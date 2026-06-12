# Arabic AI Cooking Assistant

This project is a smart cooking assistant application designed for Arabic-speaking users. It relies on artificial intelligence to understand user requests (both text and voice), search for suitable recipes, modify them according to preferences, and provide step-by-step instructions.

## How it works

The project is divided into two main parts:

### 1. Front-End
A mobile application built using **React Native** and **Expo**.
- Provides a seamless user interface to interact with the smart assistant.
- Allows the user to search for recipes, communicate via voice messages, and clearly view cooking steps and ingredients.

### 2. Back-End
A server built using **FastAPI** in Python, which manages the following operations:
- **AI Search:** Uses a vector database (`ChromaDB`) and `SentenceTransformers` models for semantic search of recipes based on available ingredients (fridge search), recipe name, or general description.
- **AI Processing (Gemini AI):** Relies on `Google GenAI` (Gemini model) to modify recipes (e.g., reducing quantities or making them healthier), guide the user step-by-step, and engage in interactive chat.
- **Speech-to-Text:** Uses a local `Whisper` model to transcribe voice messages (recorded in Arabic) into text so the assistant can understand them.

## Setup & Requirements

### Running the Back-End
Make sure Python is installed, then navigate to the `back-end` directory and install the required libraries:

```bash
cd back-end
pip install -r requirements.txt
```

You must provide a `.env` file containing your Google Gemini `GEMINI_API_KEY`.
To run the local server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Running the Front-End
Make sure `Node.js` is installed, then navigate to the `front-end` directory and run the following commands:

```bash
cd front-end
npm install
npx expo start
```
Expo will give you options to run the application on an emulator (Android/iOS) or on your physical device.

### Testing on a Physical Device (Network IP Setup)
If you want to run the application on your physical phone (using Expo Go) rather than an emulator, the mobile app needs to know your computer's local IP address to connect to the FastAPI Back-End.

**1. Find your computer's local IP address:**
- **Windows:** Open Command Prompt (CMD) and type `ipconfig`. Look for the `IPv4 Address` under your active Wi-Fi connection (usually starts with `192.168.`).
- **Mac/Linux:** Open Terminal and type `ifconfig` or `ip a` and look for your `en0` or `wlan0` IP address.

**2. Update the IP in the Front-End:**
Once you have your IP address, open the following file:
`front-end/screens/ChatScreen.js`

Find this line near the top (around line 22):
```javascript
const API_URL = 'http://192.168.100.28:8000';
```
Change `192.168.100.28` to match the IP address you found in Step 1. Save the file and reload your Expo server.
