# AI-Powered Java Migration & Conversion Engine: Complete Reconstruction Guide

Welcome! This guide explains the entire project from scratch, using simple explanations (like explaining to a baby!) and provides step-by-step instructions to recreate the project if it is ever deleted by mistake.

---

## 🧸 Let's Understand the Project (Baby Analogy!)

Think of this project as a **smart toy workshop**:
1. **The Painter (Frontend - React + Vite):** This is the screen you see. It has buttons, charts, and boxes. It draws everything beautifully and tells the brain what button you clicked.
2. **The Worker's Brain (Backend - FastAPI):** This is the master. It listens to the Painter's requests. When the Painter says "Run this", the Brain starts working.
3. **The Mailbox (Redis):** If a job is too big (like converting a huge project), the Brain doesn't want to freeze. It drops a message in the Mailbox (Redis).
4. **The Helper (Celery Worker):** This helper sits next to the Mailbox. As soon as a message drops in, it picks it up, runs the long job in the background, and updates the Mailbox.
5. **The Smart Friend (Google Gemini/OpenAI):** When we get stuck with a compiler error or need code converted, the Brain asks this Smart Friend for help, and it gives us the fixed code.
6. **The Library (RAG & FAISS):** This is a bookshelf of migration manuals. The helper looks through these books to find tips on how to upgrade Java code.

---

## 📁 Directory Structure

Here is how the folders are structured on your computer:

```text
java_convertion/
├── explanation.md                      <-- This Guide File
├── apache-maven-3.9.6/                 <-- Bundled Maven build tool
├── knowledge_base/                     <-- Markdown files containing Java upgrade instructions
│   └── java_rules.md                   <-- Example rule sheet
├── python_backend/                     <-- Backend Folder
│   ├── .env                            <-- Environment Variables (API Keys, config)
│   ├── main.py                         <-- FastAPI Entry Point
│   ├── requirements.txt                <-- Python Library Dependencies
│   └── app/
│       ├── __init__.py
│       ├── celery_app.py               <-- Celery configuration
│       ├── config.py                   <-- Config loader
│       ├── models.py                   <-- Request/Response models
│       ├── tasks.py                    <-- Background task functions
│       ├── ai/
│       │   ├── __init__.py
│       │   ├── ai_factory.py           <-- Factory to choose Gemini/OpenAI/Groq/Ollama
│       │   ├── gemini_client.py        <-- Gemini API Client
│       │   ├── openai_client.py        <-- OpenAI API Client
│       │   ├── groq_client.py          <-- Groq API Client
│       │   └── ollama_client.py        <-- Local Ollama Client
│       └── services/
│           ├── __init__.py
│           ├── analysis_service.py     <-- Clones and checks target Java code
│           ├── migration_service.py    <-- Runs OpenRewrite AST transformations
│           ├── build_validation.py     <-- Compiles code and triggers AI self-healing
│           ├── code_conversion.py      <-- Converts Java files to Python FastAPI files
│           ├── execution_service.py    <-- Runs/Simulates code startup and logs
│           ├── rag_service.py          <-- Vectorizes knowledge_base using FAISS
│           └── report_service.py       <-- Generates PDF reports using ReportLab
└── frontend/                           <-- Frontend Folder
    ├── package.json                    <-- Node.js Dependencies and Scripts
    ├── vite.config.js                  <-- Vite configuration
    ├── index.html                      <-- Webpage template
    ├── postcss.config.js
    ├── tailwind.config.js              <-- CSS styling rules
    └── src/
        ├── main.jsx                    <-- React app mounting point
        ├── index.css                   <-- Styling file
        ├── App.jsx                     <-- Page router and layouts
        ├── api.js                      <-- Backend API endpoints caller
        ├── components/
        │   ├── ChatbotWidget.jsx       <-- Floating RAG Chatbot
        │   ├── ExecutionConsole.jsx    <-- Terminal Emulator
        │   └── ExecutionComparison.jsx <-- Side-by-side execution dashboard
        └── pages/
            ├── Dashboard.jsx           <-- Project Summary and Metrics
            ├── RepositoryAnalysis.jsx  <-- Git repository analysis UI
            ├── MigrationCenter.jsx     <-- Target versions selection and progress log
            ├── MigrationReport.jsx     <-- PDF viewing and diff code explorer
            ├── CodeConversionCenter.jsx<-- Drag-and-drop Java files conversion UI
            ├── ConversionReport.jsx    <-- Converted code display and download
            └── RepositoryExplorer.jsx  <-- Visual directory tree and file viewer
```

---

## 🛠️ Step-by-Step Reconstruction Guide

If the project is deleted, follow these exact baby steps to build it again from scratch:

### **Step 1: Install Prerequisites**
Make sure you have these programs installed on your Windows machine:
1. **Node.js** (v18 or higher) - [Download from nodejs.org](https://nodejs.org/)
2. **Python** (3.10 or 3.11) - [Download from python.org](https://www.python.org/)
3. **Redis Server** (For Windows, you can run it via WSL or use Memurai or a native windows port).
4. **Git** - [Download from git-scm.com](https://git-scm.com/)
5. **Java JDK 17 or 21** - Make sure `JAVA_HOME` environment variable is set.

---

### **Step 2: Recreate the Backend**

1. Create a folder named `python_backend`.
2. Inside `python_backend`, create a file named `requirements.txt` and paste this:
   ```text
   fastapi
   uvicorn
   pydantic
   gitpython
   reportlab
   faiss-cpu
   sentence-transformers
   numpy
   google-genai
   openai
   ollama
   httpx
   python-multipart
   groq
   celery
   redis
   ```
3. Create a file named `.env` and paste this (replace placeholder keys with your active keys):
   ```ini
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL_NAME=gemini-2.5-flash
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL_NAME=gpt-4-turbo
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL_NAME=llama-3.3-70b-versatile
   APP_WORK_DIR=workspace
   REDIS_URL=redis://localhost:6379/0
   ```
4. Create the file structure `app/` and recreate the Python script files. Let's write down the key scripts so you can copy them:

#### **File: `python_backend/main.py`**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import api

app = FastAPI(title="Assistant API")

# Allows React frontend to talk to FastAPI without CORS issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    # Starts server on http://localhost:8080
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

#### **File: `python_backend/app/celery_app.py`**
```python
from celery import Celery
import os

redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

# Setup Celery to queue long-running migrations
celery_app = Celery(
    "migration_tasks",
    broker=redis_url,
    backend=redis_url,
    include=['app.tasks']
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    broker_connection_retry_on_startup=True
)
```

#### **File: `python_backend/app/config.py`**
```python
import os
from pathlib import Path

class AppConfig:
    def __init__(self):
        self.ai_provider = os.getenv("AI_PROVIDER", "gemini")
        self.work_dir_name = os.getenv("APP_WORK_DIR", "workspace")

    @property
    def workspace_directory(self) -> Path:
        dir_path = Path(self.work_dir_name)
        dir_path.mkdir(parents=True, exist_ok=True)
        return dir_path.absolute()

    @property
    def project_root(self) -> Path:
        return self.workspace_directory.parent.parent

app_config = AppConfig()
```

#### **File: `python_backend/app/tasks.py`**
```python
from app.celery_app import celery_app
from app.services.migration_service import migration_service
from app.config import app_config

@celery_app.task(bind=True, name="run_background_migration")
def run_background_migration(self, repo_url: str, target_version: str, api_key: str, model_name: str, provider: str = None):
    if provider:
        app_config.ai_provider = provider
    result = migration_service.migrate_repository(repo_url, target_version, api_key, model_name)
    return result.model_dump() if hasattr(result, 'model_dump') else result.dict()
```

---

### **Step 3: Setup and Start the Backend Environment**

Open your PowerShell terminal and run:

```powershell
# 1. Enter the backend folder
cd python_backend

# 2. Create Python virtual environment (use Python 3.11 for safety!)
py -3.11 -m venv venv

# 3. Activate the virtual environment
.\venv\Scripts\activate

# 4. Install all Python packages
pip install -r requirements.txt

# 5. Start the FastAPI server (Runs on port 8080)
python main.py
```

Open a **second terminal** to start the Celery Worker (which listens to the Redis queue on Windows):

```powershell
# 1. Enter the backend folder and activate virtual environment
cd python_backend
.\venv\Scripts\activate

# 2. Start Celery worker using solo pool (crucial for Windows!)
celery -A app.celery_app.celery_app worker --loglevel=info -P solo
```

*(Ensure Redis server is running locally on port 6379 before launching Celery)*

---

### **Step 4: Recreate the Frontend**

1. Create a folder named `frontend`.
2. Inside `frontend`, create `package.json` with the following configuration:
   ```json
   {
     "name": "frontend",
     "private": true,
     "version": "0.0.0",
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "lint": "eslint .",
       "preview": "vite preview"
     },
     "dependencies": {
       "axios": "^1.17.0",
       "lucide-react": "^1.18.0",
       "prismjs": "^1.30.0",
       "react": "^19.2.6",
       "react-dom": "^19.2.6",
       "react-syntax-highlighter": "^16.1.1"
     },
     "devDependencies": {
       "@vitejs/plugin-react": "^6.0.1",
       "autoprefixer": "^10.5.0",
       "postcss": "^8.5.15",
       "tailwindcss": "^3.4.17",
       "vite": "^8.0.12"
     }
   }
   ```
3. Create `vite.config.js`:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
   })
   ```
4. Run commands to install packages and start the frontend:
   ```powershell
   # 1. Enter frontend folder
   cd frontend
   
   # 2. Install node packages
   npm install
   
   # 3. Start Vite developer server (Runs on port 5173)
   npm run dev
   ```

---

## 🌟 Key Backend Pipelines Explained

### **1. Repository Analysis pipeline (`/api/analyze`)**
- Clones a remote repository to the `python_backend/workspace/` folder.
- Scans `pom.xml` or `build.gradle` to extract Java and Spring Boot versions.
- Generates vectors of raw configuration files and searches the local FAISS index (built on `knowledge_base/*.md` files) for relevant migration instructions.
- Passes files + RAG search results to the selected AI Provider to create a migration plan.

### **2. AST Migration & Validation (`/api/migrate`)**
- Receives version target (e.g. Java 17 or Java 21).
- Automatically updates configuration values in `pom.xml` (like Lombok and compiler properties).
- Runs **OpenRewrite Recipes** command:
  `mvn org.openrewrite.maven:rewrite-maven-plugin:run -Drewrite.activeRecipes=...`
- Invokes **Build Validation** (`mvn clean compile`). If compilation errors occur:
  - Captures compiler stdout.
  - Sends stdout to AI Factory.
  - AI returns precise JSON replacements to edit compiler-broken files.
  - Re-runs build validation (supports up to 3 self-healing attempts).

### **3. Chatbot Assistant (`/api/chat`)**
- On startup, the backend reads markdown documents inside the `knowledge_base` folder.
- Chunks them and generates dense vector embeddings using a local transformer model (`all-MiniLM-L6-v2`).
- Indexes them in **FAISS** index.
- When you ask the chat interface a question, it queries the index, pulls the context, and injects it into the LLM system prompt along with details of the analyzed repository.

### **4. Native PDF Generation Engine**
- PDF reports are generated entirely in-memory using **ReportLab**, styled dynamically with Times-Roman and Courier fonts.
- This eliminates the need for Sphinx or command-line system dependencies, ensuring 100% reliability on Windows machines.

### **5. Interactive Resizable Sidebar**
- The repository explorer includes a drag-and-drop resize divider handle.
- Users can click and hold the sidebar border to dynamically adjust the width of the project file tree panel between 160px and 600px.

---

## 👶 Summary: How to run it every day

1. Open **Redis Server** (ensure it's running).
2. Start **FastAPI Backend**:
   - `cd python_backend`
   - `.\venv\Scripts\activate`
   - `python main.py`
3. Start **Celery Worker**:
   - `cd python_backend`
   - `.\venv\Scripts\activate`
   - `celery -A app.celery_app.celery_app worker -P solo`
4. Start **React Frontend**:
   - `cd frontend`
   - `npm run dev`
5. Open your browser to **[http://localhost:5173/](http://localhost:5173/)**!
