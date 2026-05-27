# Monkeypatch bcrypt to prevent passlib from crashing in Python 3.13+
try:
    import bcrypt
    _orig_hashpw = bcrypt.hashpw
    def _patched_hashpw(password, salt):
        if isinstance(password, str):
            password = password.encode('utf-8')
        if len(password) > 72:
            password = password[:72]
        return _orig_hashpw(password, salt)
    bcrypt.hashpw = _patched_hashpw
except Exception:
    pass

import os
from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.models.auth import UserInDB
from backend.services.auth_service import get_current_active_user
from backend.database.config import get_db

# Load environment variables
load_dotenv()

# Import routers
from backend.routers import health, analysis, drugs, auth, history, features
from backend.utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(
    title="PharmAI Diagnostic Engine",
    description="Backend for AI Drug Interaction Checker utilizing RAG and Pinecone",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(history.router)
app.include_router(health.router)
app.include_router(analysis.router)
app.include_router(drugs.router)
app.include_router(features.router)

# Root compliance alias endpoints
@app.post("/api/upload-prescription")
async def upload_prescription_alias(file: UploadFile = File(...)):
    from backend.routers.features import extract_prescription
    return await extract_prescription(file)

@app.post("/api/voice-check")
async def voice_check_alias(file: UploadFile = File(...)):
    from backend.routers.features import voice_to_text
    return await voice_to_text(file)

@app.get("/api/history")
async def history_alias(current_user: UserInDB = Depends(get_current_active_user), db = Depends(get_db)):
    from backend.routers.history import get_user_history
    return get_user_history(current_user, db)


@app.on_event("startup")
async def startup_event():
    from backend.database.config import engine
    from backend.database.models import Base
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("PostgreSQL/SQLite Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database tables: {e}")
    logger.info("PharmAI Backend started successfully.")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
