from fastapi import APIRouter, HTTPException, Depends
import itertools
from datetime import datetime
from backend.models.schemas import AnalysisRequest, AnalysisResponse
from backend.services.ai_service import ai_service_instance
from backend.services.ml_service import extract_drugs_local
from backend.services.safety_layer import evaluate_emergency_status
from backend.services.auth_service import get_current_active_user
from backend.models.auth import UserInDB
from backend.database.mock_db import history_logs, system_stats
from backend.utils.logger import get_logger

router = APIRouter(prefix="/api/check", tags=["Analysis"])
logger = get_logger(__name__)

from backend.database.config import get_db
from backend.database.models import User as DBUser, InteractionHistory as DBHistory
from sqlalchemy.orm import Session

@router.post("/", response_model=AnalysisResponse)
async def check_interactions(
    request: AnalysisRequest, 
    current_user: UserInDB = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        med_text = request.medication_text
        logger.info(f"Received analysis request from {current_user.username}")
        system_stats["total_checks"] += 1

        # 1. Extraction phase (Local ML / NLP)
        extracted_drugs = extract_drugs_local(med_text)
        logger.info(f"Extracted drugs: {extracted_drugs}")
        
        # 2 & 3. Analysis phase using Transformer + ChromaDB AI Service
        result = ai_service_instance.check_interaction(extracted_drugs)
        
        # 4. Safety & Emergency Layer
        safe_result = evaluate_emergency_status(result)
        
        # update stats
        if safe_result.highRiskAlerts > 0:
            system_stats["high_risk_cases"] += 1
            
        for d in extracted_drugs:
            system_stats["top_drugs"][d] = system_stats["top_drugs"].get(d, 0) + 1
            
        # Get dynamic database user ID
        db_user = db.query(DBUser).filter(DBUser.username == current_user.username).first()
        user_id = db_user.id if db_user else None
        
        # Determine max severity
        max_sev = "LOW"
        if safe_result.interactions:
            severities = [i.severity.value for i in safe_result.interactions]
            if "CONTRAINDICATED" in severities:
                max_sev = "CONTRAINDICATED"
            elif "MAJOR" in severities:
                max_sev = "MAJOR"
            elif "MODERATE" in severities:
                max_sev = "MODERATE"
            elif "MINOR" in severities:
                max_sev = "MINOR"

        # Save to persistent database
        if user_id:
            try:
                db_log = DBHistory(
                    user_id=user_id,
                    medications=extracted_drugs,
                    max_severity=max_sev,
                    issue_count=safe_result.interactionsFound,
                    report_data=[i.dict() for i in safe_result.interactions]
                )
                db.add(db_log)
                db.commit()
                logger.info(f"Interaction history logged to persistent database for user ID: {user_id}")
            except Exception as e:
                logger.error(f"Failed to log interaction to database: {e}")
                db.rollback()

        # save history in mock for backward compatibility
        history_logs.append({
            "id": len(history_logs) + 1,
            "user": current_user.username,
            "medications": med_text,
            "extracted": extracted_drugs,
            "highRiskAlerts": safe_result.highRiskAlerts,
            "interactionsFound": safe_result.interactionsFound,
            "interactions": [i.dict() for i in safe_result.interactions],
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return safe_result
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal interaction analysis failed.")

