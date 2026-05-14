# 💊 PharmAI: Full-Stack AI Clinical Diagnostics & Analysis

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)

PharmAI is a premium, full-stack clinical decision support system designed to transform pharmaceutical data into actionable insights. By combining a modern, glassmorphic React frontend with a robust FastAPI backend and local Machine Learning models, PharmAI provides real-time drug interaction severity predictions and patient history analysis.

---

## ✨ Key Features

- **🛡️ Drug Interaction Prediction**: Uses a RandomForest classifier trained on clinical datasets to predict severity (Low, Moderate, High, Critical).
- **📊 Interactive Analytics**: Real-time visualization of diagnostic trends and patient history using Recharts.
- **✨ Premium UI/UX**: A state-of-the-art interface featuring glassmorphism, smooth animations (Framer Motion), and a sleek dark theme.
- **⚙️ ETL Pipeline**: Automated data generation and model training scripts for maintaining up-to-date clinical models.
- **⚡ Fast Performance**: Powered by Vite and FastAPI for sub-second response times.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (TypeScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS (Glassmorphism design)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI
- **ML Engine**: Scikit-Learn (Random Forest)
- **Language**: Python 3.x
- **Data Handling**: Pandas, NumPy

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.9+)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RAHIL631/gen_ai.git
   cd gen_ai
   ```

2. **Frontend Setup:**
   ```bash
   npm install
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the Backend:**
   ```bash
   cd backend
   uvicorn main:main --reload
   ```

2. **Start the Frontend:**
   ```bash
   # In the root directory
   npm run dev
   ```

---

## 🧠 Machine Learning Pipeline

PharmAI includes a complete ETL pipeline located in `backend/etl/`:
- `generate_dataset.py`: Generates a synthetic clinical dataset of drug-drug interactions.
- `train_ml_model.py`: Trains a Random Forest model on the generated data and exports it for the FastAPI service.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Developed with ❤️ for Advanced Clinical Intelligence
</div>
