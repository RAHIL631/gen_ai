from fastapi import APIRouter, Depends
from backend.services.auth_service import get_current_active_user
from backend.models.auth import UserInDB
from backend.database.mock_db import history_logs

from backend.database.config import get_db
from backend.database.models import User as DBUser, InteractionHistory as DBHistory
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("/")
def get_user_history(
    current_user: UserInDB = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        db_user = db.query(DBUser).filter(DBUser.username == current_user.username).first()
        if db_user:
            db_logs = db.query(DBHistory).filter(DBHistory.user_id == db_user.id).all()
            if db_logs:
                # Map to response format
                mapped = []
                for item in db_logs:
                    mapped.append({
                        "id": item.id,
                        "user": current_user.username,
                        "medications": ", ".join(item.medications) if isinstance(item.medications, list) else str(item.medications),
                        "extracted": item.medications,
                        "highRiskAlerts": item.issue_count if item.max_severity in ["CONTRAINDICATED", "MAJOR"] else 0, # logical mapping
                        "interactionsFound": item.issue_count,
                        "interactions": item.report_data or [],
                        "timestamp": item.timestamp.isoformat()
                    })
                return sorted(mapped, key=lambda x: x["timestamp"], reverse=True)
    except Exception as e:
        # Fallback to mock
        pass
        
    user_logs = [log for log in history_logs if log["user"] == current_user.username]
    return sorted(user_logs, key=lambda x: x["timestamp"], reverse=True)

