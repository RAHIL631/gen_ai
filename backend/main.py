import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

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

@app.on_event("startup")
async def startup_event():
    logger.info("PharmAI Backend started successfully.")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
