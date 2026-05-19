# 🛡️ PharmAI Enterprise Console
> **Next-Generation, Production-Grade Biomedical AI Platform for Clinical Safety & Drug-Drug Interaction Diagnostics**

[![React](https://img.shields.io/badge/Frontend-React%2019-teal?style=for-the-badge&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-emerald?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Vector DB](https://img.shields.io/badge/Vector%20Store-ChromaDB-blue?style=for-the-badge&logo=sqlite)](https://github.com/chroma-core/chroma)
[![PubMedBERT](https://img.shields.io/badge/NLP%20Model-PubMedBERT-sky?style=for-the-badge&logo=huggingface)](https://huggingface.co/microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext)
[![Auth](https://img.shields.io/badge/Auth-Clerk-purple?style=for-the-badge&logo=clerk)](https://clerk.com)
[![Database](https://img.shields.io/badge/Relational%20Store-PostgreSQL%20%2F%20SQLite-indigo?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)

PharmAI is an enterprise-grade, highly scalable, and medically accurate software-as-a-service (SaaS) platform built for modern clinical environments. Utilizing advanced **Biomedical NLP (PubMedBERT)**, **Vector Store Embeddings (ChromaDB)**, and a robust **Retrieval-Augmented Generation (RAG)** pipeline, the platform analyzes complex medical regimens, highlights potential drug-drug conflicts, and yields explainable AI diagnostics backed by verified clinical evidence.

---

## 🚀 System Architecture Layout

```mermaid
graph TD
    A[React Client / Vite] -- Auth via Clerk --> B[FastAPI Gateway]
    B -- Check Interactions --> C[Safety Layer API]
    C -- Local Clinical KB / RAG Search --> D[(ChromaDB Vector DB)]
    C -- Classification --> E[HuggingFace PubMedBERT]
    B -- SQL Transactions --> F[(PostgreSQL / SQLite)]
    F -- Audit Trail Logs --> G[Audit Log Table]
    F -- Alerts Feed --> H[Alert Table]
    F -- compliance schedule --> I[Reminders Table]
```

---

## 🌟 Premium Enterprise Features

### 🧠 Advanced Biomedical RAG & Explainable AI (XAI)
* **Retrieved Medical Evidence**: No black-box predictions. The system crawls vector storage coordinates mapped from medical literature databases (e.g. *DrugBank*, *TWOSIDES*) to cite verified pharmacological justifications.
* **Biomedical Sequence Classifier**: Predicts clinical severity (`CONTRAINDICATED`, `MAJOR`, `MODERATE`, `LOW`) using a local pipeline, fine-tuned on PubMed research summaries.
* **Safety Confidence Thresholds**: Imposes a clinical confidence gate (default: `75%`). Predictions scoring below the threshold are flagged with warning banners advising physician escalations.

### 🔬 Multi-Modal Diagnostic Pipelines
* **OCR Prescription Extraction**: Snap or drag-and-drop handwritten/printed prescription sheets. Smart clinical Tesseract parser extracts medications automatically with fallback templates.
* **Voice regimine Dictation**: Clinicians can dictate multi-drug therapy lists hands-free using Speech-to-Text conversion engines.

### 🚨 Real-Time Safety Feed & Alerts Center
* **Active Safety Feed**: A persistent clinical alerts queue linked directly to SQLAlchemy database models.
* **Anomalous Log Auditing**: Tracks all resolved/unresolved warnings, allowing standard clinicians to sign-off and mark conflicts resolved with real-time state logs.

### ⏱️ Compliance & Medication Reminders CRUD
* **Adherence Scheduler**: Built-in interactive console for nurses and physicians to program patient medication reminders, select dosage intervals, and toggle active adherence reminders synced to SQL schemas.

---

## 🏗️ Technical Stack Details

| Layer | Technology | Primary Function |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite | Single-page SaaS interface |
| **Styling** | Vanilla CSS, HSL Variables, Tailwind CSS | Vibrant Glassmorphic Dark-Mode UI |
| **State Management** | React Context API, React Router v6 | Auth routing and application-wide state |
| **Authentication** | Clerk Auth React SDK | Identity management & JWT compliance |
| **Backend** | FastAPI, Python 3.10 | Async high-performance HTTP service gateway |
| **ORM** | SQLAlchemy 2.0 | SQL database mapping and relational transactions |
| **NLP AI models** | HuggingFace Transformers, PyTorch | PubMedBERT (Sequence Classifier) & BioBERT (Embeddings) |
| **Vector DB** | ChromaDB | High-dimensional indexer for RAG evidence blocks |

---

## 📁 Repository Structure Diagram

```text
Gen_Ai_project/
├── backend/
│   ├── database/
│   │   ├── config.py         # SQLAlchemy config (SQLite / PostgreSQL auto-switch)
│   │   └── models.py         # Declarative models (Users, Alerts, Reminders, Audits)
│   ├── models/
│   │   └── schemas.py        # Strict Pydantic validators
│   ├── routers/
│   │   ├── analysis.py       # Main check-interaction router
│   │   ├── features.py       # Alerts, Reminders CRUD, OCR & Voice-to-Text APIs
│   │   └── health.py         # Hardware telemetry and DB connectivity checks
│   ├── services/
│   │   ├── ai_service.py     # Explainable AI, Fallback clinical KB, and confidence gates
│   │   └── ml_service.py     # PubMedBERT inference and model loader pipelines
│   └── main.py               # FastAPI entrypoint, compliant route aliases, and middleware
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx       # Glassmorphic sidebar navigation
│   │   └── InteractionGraph.tsx # Color-coded interaction node mapping
│   ├── pages/
│   │   ├── AlertsPage.tsx    # Live clinical safety feed and resolution dashboard
│   │   ├── SettingsPage.tsx  # Clinician profile, scheduler CRUD, and telemetry
│   │   └── DrugCheckerPage.tsx# Core input deck, OCR scan console, and multi-modal pipeline
│   ├── services/
│   │   └── api.ts            # Dual-mode API connectors with offline localStorage caching
│   └── App.tsx               # Client routes with Clerk auth gates
└── README.md                 # Product manual and technical spec sheet
```

---

## 💻 Local Windows Installation Guide

Ensure you have the prerequisites installed:
* **Python 3.10+** (Added to System environment variable PATH)
* **Node.js 20+** & **npm**
* **Tesseract OCR** (Download the windows executable and place it at `C:\Program Files\Tesseract-OCR\tesseract.exe`)

### Step 1: Database Setup
PharmAI defaults to an automated, persisted local SQLite instance (`pharmai.db`) for effortless local setup. 
For production PostgreSQL configurations, simply create a schema and declare the credentials inside `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pharmai_db"
```

### Step 2: Backend Installation
Open a PowerShell command window inside the project root directory:
```powershell
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
.\venv\Scripts\activate

# 3. Install core dependencies
pip install -r requirements.txt
```

### Step 3: Frontend Installation
Open a second PowerShell window in the project root:
```powershell
# Install node packages
npm install
```

### Step 4: Configure Clerk Environment Secrets
Create a `.env.local` configuration sheet in the root directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_d29ya2luZy13aXBldC01LmNsZXJrLmFjY291bnRzLmRldiQ
```

---

## ⚡ Running the Platform

To run the application, run both the backend server and frontend development server simultaneously.

#### **Terminal 1: Backend Gateway**
```powershell
.\venv\Scripts\activate
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
* Interactive API interactive endpoints are ready at: `http://localhost:8000/docs`

#### **Terminal 2: React Frontend Client**
```powershell
npm run dev
```
* Open your browser and navigate to: `http://localhost:3000`

---

## 🔬 API Endpoint Specifications

### 1. Retrieve Active Alerts Feed
* **Endpoint**: `GET /api/features/alerts`
* **Security**: Bearer JWT authenticated
* **Response Payload**:
```json
[
  {
    "id": 1,
    "severity": "CRITICAL",
    "message": "Severe interaction detected between Warfarin and Aspirin. Synergistic bleeding risk.",
    "resolved": false,
    "created_at": "2026-05-19T21:50:00.000Z"
  }
]
```

### 2. Resolve Active Alert
* **Endpoint**: `POST /api/features/alerts/{alert_id}/resolve`
* **Response Payload**:
```json
{
  "status": "success",
  "message": "Alert resolved successfully."
}
```

### 3. Retrieve Medication Reminders Compliance List
* **Endpoint**: `GET /api/features/reminders`
* **Response Payload**:
```json
[
  {
    "id": 1,
    "medication_name": "Atorvastatin",
    "dosage": "20mg",
    "time": "20:00",
    "frequency": "Daily",
    "active": true
  }
]
```

### 4. Create Medication Reminder Compliance Rule
* **Endpoint**: `POST /api/features/reminders`
* **Request Payload**:
```json
{
  "medication_name": "Metformin",
  "dosage": "500mg",
  "time": "12:00",
  "frequency": "Daily"
}
```

---

## 🛡️ Medical Disclaimer
**PharmAI Enterprise Console is an informational diagnostic assistant tool designed for educational, research, and SaaS simulation purposes.** It does not act as a substitute for professional clinical medical advice, diagnostics, therapeutic directives, or physical exams. Always consult a licensed medical professional or primary physician prior to initiating or altering pharmaceutical treatment programs.
