import os
import json
import re
import chromadb
from sentence_transformers import SentenceTransformer


#  AUTHENTICATION & CONFIGURATION
# os.environ["HF_TOKEN"] = "hf_your_token_here"


# Instruction for the model to understand the nature of the data (specific to Instruct models)
TASK_INSTRUCTION = "Given an Arabic food recipe search query, retrieve relevant recipes or ingredients."


#  SETUP MODEL & DATABASE
model = SentenceTransformer("intfloat/multilingual-e5-large")

current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, "chroma_db")
client = chromadb.PersistentClient(path=db_path)

collection = client.get_or_create_collection(
    name="recipes",
    metadata={"hnsw:space": "cosine"} 
)


#  TEXT CLEANING
def clean_ar(text, is_query=False):
    if not text:
        return ""
    text = str(text)
    
    text = re.sub(r"[^\w\s\u0600-\u06FF]", " ", text)
    
    
    if is_query:
        stop_words = ["طريقة", "عمل", "كيفية", "تحضير", "بدي", "اطبخ", "وصفة", "كيف", "اسوي"]
        pattern = re.compile(r'\b(' + '|'.join(stop_words) + r')\b')
        text = pattern.sub("", text)

    
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# DATA FORMATTERS
def get_ingredients_text(ingredients):
    result = []
    for ing in ingredients:
        if isinstance(ing, dict):
            item = clean_ar(ing.get("item", ""))
            if item: result.append(item)
        elif isinstance(ing, str):
            result.append(clean_ar(ing))
    return " | ".join(result)

def get_instructions_text(instructions):
    result = []
    for step in instructions:
        if isinstance(step, dict):
            text = clean_ar(step.get("text", ""))
            if text: result.append(text)
        elif isinstance(step, str):
            text = clean_ar(step)
            if text: result.append(text)
    return " ".join(result)

def format_ingredients_full(ingredients):
    result = []
    for ing in ingredients:
        if isinstance(ing, dict):
            result.append({
                "item": clean_ar(ing.get("item", "")),
            })
        elif isinstance(ing, str):
            result.append({"item": clean_ar(ing)})
    return result

def format_instructions_full(instructions):
    result = []
    for i, step in enumerate(instructions, 1):
        if isinstance(step, dict):
            result.append({"step": i, "text": clean_ar(step.get("text", ""))})
        elif isinstance(step, str):
            result.append({"step": i, "text": clean_ar(step)})
    return result



# CHUNK BUILDER
def build_chunks(recipe):
    chunks = []
    title = clean_ar(recipe.get("title", ""))
    description = clean_ar(recipe.get("description", ""))
    tags = " | ".join(recipe.get("tags", []))
    
    overview_text = f"title: {title}. description: {description}. tags: {tags}"
    chunks.append(("overview", overview_text))
    
    if title:
        chunks.append(("title", title))
        
    ingredients_text = get_ingredients_text(recipe.get("ingredients", []))
    if ingredients_text:
        chunks.append(("ingredients", ingredients_text))
        
    return chunks


#  INDEXING ENGINE (WITH BATCHING)
def run_pipeline(jsonl_path, batch_size=200):
    print(f"Reading file: {jsonl_path}...")
    
    data = []
    with open(jsonl_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                try:
                    data.append(json.loads(line))
                except Exception:
                    pass

    total_recipes = len(data)
    print(f"Found {total_recipes} recipes. Starting ingestion...")

    ids_batch = []
    documents_batch = []
    metadatas_batch = []

    for i, recipe in enumerate(data, 1):
        recipe_id = str(recipe.get("id", f"auto_{i}")) 
        chunks = build_chunks(recipe)
        
        full_metadata = {
            "recipe_id": recipe_id,
            "title": clean_ar(recipe.get("title", "")),
            "description": clean_ar(recipe.get("description", "")),
            "source_url": recipe.get("source_url", ""),
            "image": recipe.get("image", ""),
            "tags": " | ".join(recipe.get("tags", [])),
            "ingredients": json.dumps(format_ingredients_full(recipe.get("ingredients", [])), ensure_ascii=False),
            "instructions": json.dumps(format_instructions_full(recipe.get("instructions", [])), ensure_ascii=False)
        }

        for chunk_type, text in chunks:
            ids_batch.append(f"{recipe_id}#{chunk_type}")
            documents_batch.append(text)
            metadatas_batch.append({**full_metadata, "type": chunk_type})

        
        if len(documents_batch) >= batch_size or i == total_recipes:
            if documents_batch: 
                try:

                    embeddings_batch = model.encode(documents_batch, normalize_embeddings=True).tolist()
                    
                    collection.add(
                        ids=ids_batch,
                        documents=documents_batch,
                        embeddings=embeddings_batch,
                        metadatas=metadatas_batch
                    )
                    
                    print(f"Indexed batch up to recipe: {i} / {total_recipes}")
                    
                    ids_batch.clear()
                    documents_batch.clear()
                    metadatas_batch.clear()
                    
                except Exception as e:
                    print(f"Failed at batch ending in recipe {i}: {e}")

    print("ChromaDB is ready!")



# UNIFIED SEARCH API
def detect_search_mode(query: str) -> str:
    ingredients_keywords = ["عندي", "بثلاجتي", "في الثلاجة", "مكونات", "ومكونات", "بدي اطبخ ب", "شو اطبخ ب"]
    title_keywords = ["طريقة عمل", "وصفة", "كيف اسوي", "كيف اطبخ", "بدي", "اريد", "كيف اعمل"]
    overview_keywords = ["صحي", "سريع", "نباتي", "بدون", "دايت", "للرجيم", "صوص", "مقبلات", "شوربة", "حلى", "حلا", "حلويات", "فطور", "غداء", "عشاء", "اكل", "بروتين", "خفيف", "وجبة"]
    
    query_lower = query.lower()
    
    for kw in ingredients_keywords:
        if kw in query_lower:
            return "ingredients"
            
    if " و " in query_lower or " و" in query_lower or "," in query_lower or "،" in query_lower:
        return "ingredients"
        
    for kw in overview_keywords:
        if kw in query_lower:
            return "overview"
            
    for kw in title_keywords:
        if kw in query_lower:
            return "title"
            
    words = query_lower.split()
    if len(words) <= 2:
        return "title"
        
    return "overview"

def search_recipes(query, mode="auto", top_k=5):
    if mode == "auto":
        mode = detect_search_mode(query)
        
    query_clean = clean_ar(query, is_query=True)
    
    
    query_with_prefix = f"Instruct: {TASK_INSTRUCTION}\nQuery: {query_clean}"
    
    
    query_embedding = model.encode(query_with_prefix, normalize_embeddings=True).tolist() 
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"type": mode},
        include=["documents", "metadatas", "distances"]
    )
    
    formatted_recipes = []
    
    if not results["documents"] or not results["documents"][0]:
        return formatted_recipes 
        
    docs = results["documents"][0]
    metas = results["metadatas"][0]
    dists = results["distances"][0]
    
    for doc, meta, dist in zip(docs, metas, dists):
        recipe_obj = {
            "recipe_id": meta.get("recipe_id"),
            "title": meta.get("title"),
            "description": meta.get("description"),
            "image": meta.get("image"),
            "source_url": meta.get("source_url"),
            "tags": meta.get("tags").split(" | ") if meta.get("tags") else [],
            "ingredients": json.loads(meta.get("ingredients", "[]")),
            "instructions": json.loads(meta.get("instructions", "[]")),
            "match_reason": doc.strip(),
            # Cosine distance in ChromaDB is 0 for an exact match, so we subtract from 1 to get the percentage
            "relevance_score": 1 - dist  
        }
        formatted_recipes.append(recipe_obj)
        
    return formatted_recipes



# EXECUTION (TESTING)
if __name__ == "__main__":
    
    # 1. To build the database for the first time, uncomment the following line:
    # run_pipeline("../data/final.jsonl", batch_size=200)

    # 2. Testing search functionality
    print("\n" + "="*50)
    print("Test 1: Fridge Search (Ingredients Mode)")
    q1 =  "لحمة"
    results_fridge = search_recipes(q1, mode="ingredients", top_k=5)
    print(f"question: {q1}")
    for r in results_fridge:
        print(f"Title: {r['title']} | Score: {r['relevance_score']:.4f}")
        print(f"Matched Ingredients: {r['match_reason']}")

    print("\n" + "="*50)
    print("Test 2: General/Semantic Search (Overview Mode)")
    q2 = "صوص"
    results_overview = search_recipes(q2, mode="overview", top_k=5)
    print(f"question: {q2}")      
    for r in results_overview:
        print(f"Title: {r['title']} | Score: {r['relevance_score']:.4f}")

    print("\n" + "="*50)
    print("Test 3: Specific Recipe Name (Title Mode)")
    q3 = "بدي كفتة"
    results_title = search_recipes(q3, mode="title", top_k=5)
    print(f"question: {q3}")
    for r in results_title:
        print(f"Title: {r['title']} | Score: {r['relevance_score']:.4f}")