# query.py
import chromadb
from chromadb.utils import embedding_functions
import os

# الصق التوكن هنا داخل علامات التنصيص
os.environ["HF_TOKEN"] = "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"

# Setup once globally in this file
model_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="paraphrase-multilingual-MiniLM-L12-v2"
)
client = chromadb.PersistentClient(path="./recipes_db")
collection = client.get_collection(name="recipes_collection", embedding_function=model_ef)

def search_recipes(user_query, n_results=1):
    results = collection.query(
        query_texts=[user_query],
        n_results=n_results
    )
    if results['metadatas'][0]:
        print(results['distances'])  # Print distances for debugging
        return results['metadatas'][0][0]['title']  # Return the URL of the most relevant recipe
    return None

# Test directly
if __name__ == "__main__":
    user_input = " حلا يكون فيها جوز الهند"
    print(search_recipes(user_input))
    