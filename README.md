# PharmAI: Advanced Enterprise AI Drug Interaction Platform

PharmAI has been transformed into a production-grade healthcare AI platform. Built with a world-class UI, real medical datasets, RAG architecture, vector databases, and offline ML prediction models, it delivers hallucination-free, explainable pharmacological insights.

## Features

- **Biomedical AI Models**: Uses **PubMedBERT** for sequence classification and **BioBERT** embeddings for RAG retrieval.
- **Explainable AI (XAI)**: Provides mechanism explanations, clinical evidence, and confidence scores for every prediction.
- **Vector Database**: Implements **ChromaDB** for hyper-fast semantic search of pharmacological datasets.
- **PostgreSQL Database**: Modular SQLAlchemy architecture storing users, interactions, and audit logs.
- **Voice Assistant**: Whisper API (SpeechRecognition) for hands-free medication input.
- **OCR Prescription Scanning**: Tesseract OCR for automated prescription data extraction.
- **Personalized Risk Analysis**: Tailored risk indexes calculating age, kidney disease, liver disease, and pregnancy factors.
- **Premium UI/UX**: Built with React, Tailwind CSS, Framer Motion, and Recharts. Features glassmorphism, dynamic glowing neon effects, and dark/light modes.

## Architecture Stack

| Component      | Technology               |
| -------------- | ------------------------ |
| **Frontend**   | React, Tailwind CSS      |
| **Backend**    | FastAPI                  |
| **Relational DB** | PostgreSQL          |
| **Vector DB**  | ChromaDB                 |
| **Embeddings** | Sentence Transformers    |
| **Classifier** | HuggingFace (PubMedBERT) |

---

## Complete Windows Localhost Setup

Follow these exact steps to run the complete platform on a local Windows machine. Do **NOT** use Docker.

### 1. Prerequisites
- **Python**: Download and install Python 3.10+ from python.org. Ensure "Add Python to PATH" is checked.
- **Node.js**: Download and install Node.js 18+ from nodejs.org.
- **PostgreSQL**: Download and install PostgreSQL for Windows. Create a new database named `pharm_ai`.

### 2. Backend Setup (Virtual Environment & Dependencies)
Open PowerShell and navigate to the project directory:
```powershell
# Navigate into the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\activate

# Install all backend requirements (including PyTorch, ChromaDB, FastAPI)
pip install -r requirements.txt
```

### 3. Initialize ML Models & ChromaDB Vector Database
While inside the `backend` folder with the virtual environment activated:
```powershell
cd etl

# 1. Generate local datasets and train the PubMedBERT classifier
python train_model.py

# 2. Generate BioBERT embeddings and populate ChromaDB
python embedding_pipeline.py

cd ..
```
*Note: This process will download HuggingFace models locally and may take a few minutes depending on your internet connection.*

### 4. Configure Environment Variables
Create a `.env` file in the `backend` directory and configure your database URL:
```env
# backend/.env
DATABASE_URL=postgresql://postgres:password@localhost/pharm_ai
```

### 5. Start the FastAPI Backend
Start the backend server on port 8000:
```powershell
uvicorn main:app --reload
```
The API is now running at `http://localhost:8000`. You can access the Swagger documentation at `http://localhost:8000/docs`.

### 6. Frontend Setup
Open a new PowerShell terminal (do not close the backend terminal), navigate to the root directory:
```powershell
# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
The UI will be accessible at `http://localhost:3000` (or 5173).

---

## Datasets Integration
The AI Pipeline utilizes the following foundational datasets to map interactions:
1. **DrugBank**: Gold standard pharmacology dataset for RAG base.
2. **TWOSIDES**: Interaction risk prediction and severity signals.
3. **RxNorm**: Normalization and canonical drug naming.
4. **SIDER**: Patient side-effect profiling.

