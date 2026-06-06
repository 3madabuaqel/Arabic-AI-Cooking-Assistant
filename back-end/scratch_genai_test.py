import os
from google import genai
from google.genai import types

# Test the client
try:
    client = genai.Client()
    print("Client initialized successfully.")
    
    # Test chat syntax
    history = [{"role": "user", "parts": [{"text": "Hello"}]}]
    print("History format created:", history)
    
except Exception as e:
    print("Error:", e)
