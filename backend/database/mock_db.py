from typing import Dict, List, Any
from backend.models.auth import UserInDB

# Simple in-memory storage simulating a database
users_db: Dict[str, UserInDB] = {}

history_logs: List[Dict[str, Any]] = []

system_stats = {
    "total_checks": 0,
    "high_risk_cases": 0,
    "active_users": 1,
    "ai_accuracy": 99.8,
    "uptime": "99.99%",
    "top_drugs": {}
}
