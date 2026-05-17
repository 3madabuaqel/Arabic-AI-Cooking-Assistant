import json
import chromadb
from chromadb.utils import embedding_functions

def build_database():
    with open('recipes.json', 'r', encoding='utf-8') as f:
        recipes_data = json.load(f)

    model_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="paraphrase-multilingual-MiniLM-L12-v2"
    )

    client = chromadb.PersistentClient(path="./recipes_db")
    
    # Use get_or_create to avoid errors if it exists
    collection = client.get_or_create_collection(
        name="recipes_collection", 
        embedding_function=model_ef
    )

    # Check if collection is empty before adding to prevent duplicates
    if collection.count() == 0:
        documents, metadatas, ids = [], [], []
        for index, recipe in enumerate(recipes_data):
            ingredients_text = " , ".join([f"{i.get('quantity', '')} {i.get('ingredient', '')}".strip() for i in recipe['ingredients']])
            instructions_text = " ".join(recipe['instructions'])
            
            documents.append(f"Title: {recipe['title'][0]}\nIngredients: {ingredients_text}\nInstructions: {instructions_text}")
            metadatas.append({
                "title": recipe['title'][0],
                "ingredients": ingredients_text,
                "instructions": instructions_text,
                "url": recipe['url']
            })
            ids.append(f"recipe_{index}")

        collection.add(documents=documents, metadatas=metadatas, ids=ids)
        print(f"Database built with {collection.count()} recipes.")
    else:
        print(f"Database already exists with {collection.count()} recipes. Skipping build.")

if __name__ == "__main__":
    build_database()