# PharmAI Enterprise
**Advanced AI Healthcare Platform for Drug Interaction Detection & Analysis**

PharmAI is a production-grade, highly scalable, and medically accurate AI platform designed for clinical environments. It leverages cutting-edge NLP (PubMedBERT), Vector Databases (ChromaDB), and RAG (Retrieval-Augmented Generation) to deliver verified, explainable, and instantaneous drug interaction safety checks.

---

## 🌟 Key Enterprise Features

- **Explainable AI (XAI)**: Not just predictions. PharmAI delivers the exact pharmacological mechanism and cites the retrieved medical evidence (e.g., *DrugBank, TWOSIDES*) for every interaction.
- **RAG & Vector Search**: Utilizes ChromaDB and BioBERT embeddings to fetch real-world clinical data to prevent AI hallucinations.
- **OCR Prescription Scanning**: Extract medicine names instantly from uploaded prescription images using Tesseract/PaddleOCR.
- **Voice-to-Text Input**: Dictate complex medical regimens directly into the system using Whisper AI/SpeechRecognition.
- **Clinical Confidence Thresholds**: AI models flag predictions with < 75% confidence and escalate them to human healthcare providers for manual review.
- **Premium Glassmorphism UI**: Built with React 19, Tailwind CSS v4, and Framer Motion, offering an intuitive, dark-mode medical dashboard.
- **PDF Report Generation**: Clinicians can export detailed interaction reports instantly using `jsPDF` for patient files or audits.
- **PostgreSQL Database**: Persistent, robust storage for user audits, history, and system analytics via SQLAlchemy.
- **Secure Authentication**: Enterprise-grade identity management integrated via Clerk.

---

## 🏗️ Architecture Stack

### **Frontend**
- **React.js (Vite)**
- **Tailwind CSS v4** (Glassmorphism & Medical Themes)
- **Framer Motion** (Smooth mounting and state transitions)
- **Recharts** (Interactive data visualization)
- **Clerk** (Secure JWT Authentication)
- **jsPDF** (Client-side report generation)

### **Backend**
- **FastAPI** (High-performance, async Python web framework)
- **SQLAlchemy & PostgreSQL** (Relational data modeling)
- **ChromaDB** (Vector Database for RAG embeddings)
- **HuggingFace Transformers** (PubMedBERT Sequence Classifier)
- **Pydantic** (Strict data validation and serialization)
- **Tesseract/SpeechRecognition** (OCR and Voice processing pipelines)

---

## 💻 Local Windows Setup Guide (No Docker Required)

Follow these steps strictly to run the entire enterprise stack on a local Windows machine.

### 1. Prerequisites
- **Python 3.10+**: Ensure `python` and `pip` are added to your System PATH.
- **Node.js 20+**: Ensure `npm` is installed.
- **PostgreSQL 15+**: Install locally via the official Windows installer.
- **Tesseract OCR**: Download the Windows installer from [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki). Install it to `C:\Program Files\Tesseract-OCR`.

### 2. Database Setup (PostgreSQL)
Open `pgAdmin` or `psql` and create a database:
```sql
CREATE DATABASE pharmai_db;
```

### 3. Backend Setup (FastAPI + ChromaDB)
Open a standard Windows Terminal (PowerShell or Command Prompt) and navigate to the project root:

```bash
# 1. Create a Python Virtual Environment
python -m venv venv

# 2. Activate the virtual environment
.\venv\Scripts\activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Configure Environment Variables
# Create a .env file in the backend directory
# echo DATABASE_URL="postgresql://postgres:YOURPASSWORD@localhost:5432/pharmai_db" > backend\.env
```

*(Note: ChromaDB will run automatically in ephemeral/persistent local mode via the Python package—no separate server is needed).*

### 4. Frontend Setup (React + Vite + Clerk)
Open a **new** terminal tab (keep the backend terminal open later):

```bash
# 1. Install frontend dependencies
npm install

# 2. Add Clerk Authentication Key
# Ensure you have your .env.local file with your Clerk key:
# VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
```

### 5. Running the Application

You need two terminals running simultaneously.

**Terminal 1 (Backend):**
```bash
.\venv\Scripts\activate
# Start the FastAPI server on port 8000
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
*API Documentation will be available at: http://localhost:8000/docs*

**Terminal 2 (Frontend):**
```bash
# Start the React Vite dev server
npm run dev
```
*The Web Application will be available at: http://localhost:3000*

---

## 🔬 Explainable AI (XAI) Workflow & RAG Pipeline

When a doctor inputs `Warfarin + Aspirin`:
1. **Normalization**: The FastAPI backend normalizes the input using a heuristic or RxNorm API wrapper.
2. **Retrieval (RAG)**: The system queries **ChromaDB** using sentence embeddings to find relevant literature from the DrugBank/TWOSIDES dataset.
3. **Classification**: The retrieved text is passed to **PubMedBERT**, a model fine-tuned on biomedical abstracts.
4. **Decision**: The model outputs a severity (`MAJOR`), a confidence score (`96%`), and the retrieved pharmacological mechanism.
5. **Safety Guardrail**: The `ai_service.py` checks the confidence score. If it drops below `0.75`, it triggers a clinical warning.
6. **Delivery**: The React UI renders this using color-coded severity badges, confidence meters, and expandable evidence cards.

---

## 🔒 Medical Disclaimer
**PharmAI is an informational tool built for educational and enterprise demonstration purposes.** It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a physician or qualified health provider with any questions you may have regarding a medical condition.
