from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Import the search function from our model
from model.ai_search import search_recipes

app = FastAPI(
    title="Arabic AI Cooking Assistant API",
    description="REST API for searching Arabic recipes and ingredients using AI",
    version="1.0.0"
)

# Configure CORS to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the exact React app URL (e.g., ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define response models for documentation (optional but good practice)
class Ingredient(BaseModel):
    item: str

class Instruction(BaseModel):
    step: int
    text: str

class RecipeResponse(BaseModel):
    recipe_id: str
    title: str
    description: str
    image: str
    source_url: str
    tags: List[str]
    ingredients: List[Ingredient]
    instructions: List[Instruction]
    match_reason: str
    relevance_score: float

@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Welcome to the Arabic AI Cooking Assistant API"}

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

@app.get("/search", response_model=List[RecipeResponse], tags=["Search"])
def search(
    query: str = Query(..., description="The search query in Arabic"),
    mode: str = Query("ingredients", description="Search mode: 'overview', 'ingredients', or 'title'"),
    top_k: int = Query(5, description="Number of results to return", ge=1, le=20)
):
    """
    Search for recipes using AI.
    
    - **query**: The search query (e.g., 'لحمة', 'بدي كفتة', 'صوص')
    - **mode**: 
        - `overview`: General semantic search based on recipe description, title, and tags
        - `ingredients`: Fridge search based on available ingredients
        - `title`: Specific recipe name search
    - **top_k**: Number of results to return (default 5)
    """
    valid_modes = ["overview", "ingredients", "title"]
    if mode not in valid_modes:
        raise HTTPException(status_code=400, detail=f"Invalid mode. Must be one of: {', '.join(valid_modes)}")
    
    try:
        results = search_recipes(query=query, mode=mode, top_k=top_k)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during search: {str(e)}")

# If you want to run the server directly from this script:
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
