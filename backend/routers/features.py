import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import pytesseract
from PIL import Image
import io
import speech_recognition as sr
from pydub import AudioSegment
import networkx as nx

router = APIRouter(prefix="/api/features", tags=["Advanced Features"])

# Configure Tesseract path for Windows
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class PatientRiskRequest(BaseModel):
    age: int
    kidney_disease: bool
    liver_disease: bool
    pregnancy: bool
    diabetes: bool
    medications: list[str]

@router.post("/ocr-prescription")
async def extract_prescription(file: UploadFile = File(...)):
    """Extract medication text from a prescription image using Tesseract OCR"""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Simple OCR
        text = pytesseract.image_to_string(image)
        
        # In a real scenario, NLP extraction is applied to this text
        return {"extracted_text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

@router.post("/voice-to-text")
async def voice_to_text(file: UploadFile = File(...)):
    """Convert audio payload to text using SpeechRecognition"""
    try:
        contents = await file.read()
        audio_file = io.BytesIO(contents)
        
        # Convert audio to wav if necessary (pydub)
        # Using SpeechRecognition directly for demonstration
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            
        return {"extracted_text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")

@router.post("/patient-risk")
async def evaluate_patient_risk(data: PatientRiskRequest):
    """Personalized risk scoring based on patient health factors"""
    base_risk = 0.1
    reasons = []
    
    if data.age > 65:
        base_risk += 0.2
        reasons.append("Elderly patients have higher susceptibility to adverse drug reactions.")
    if data.kidney_disease:
        base_risk += 0.3
        reasons.append("Renal impairment affects drug clearance, increasing toxicity risk.")
    if data.liver_disease:
        base_risk += 0.3
        reasons.append("Hepatic impairment affects drug metabolism.")
    if data.pregnancy:
        base_risk += 0.4
        reasons.append("Pregnancy contraindicates many common medications due to teratogenic risks.")
        
    final_score = min(base_risk, 1.0)
    
    return {
        "risk_score": final_score,
        "risk_level": "HIGH" if final_score > 0.6 else "MODERATE" if final_score > 0.3 else "LOW",
        "clinical_reasons": reasons
    }

@router.get("/interaction-graph")
async def get_interaction_graph(drugs: str):
    """Returns a network graph representation of drug interactions for the UI"""
    drug_list = [d.strip() for d in drugs.split(",")]
    
    G = nx.Graph()
    for d in drug_list:
        G.add_node(d)
        
    edges = []
    # Simplified mock edges for demonstration
    for i in range(len(drug_list)):
        for j in range(i + 1, len(drug_list)):
            edges.append({"source": drug_list[i], "target": drug_list[j], "weight": 0.5})
            
    return {
        "nodes": [{"id": d, "label": d.capitalize()} for d in drug_list],
        "links": edges
    }
