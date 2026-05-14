from fastapi import APIRouter, Depends
from backend.services.auth_service import get_current_active_user
from backend.models.auth import UserInDB
from backend.database.mock_db import history_logs

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("/")
def get_user_history(current_user: UserInDB = Depends(get_current_active_user)):
    user_logs = [log for log in history_logs if log["user"] == current_user.username]
    return sorted(user_logs, key=lambda x: x["timestamp"], reverse=True)
