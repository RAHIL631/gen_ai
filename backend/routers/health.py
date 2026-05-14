from fastapi import APIRouter, Depends
from backend.services.auth_service import get_current_admin
from backend.database.mock_db import system_stats, history_logs

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "pharm-ai-backend"}

@router.get("/stats")
async def get_stats(admin = Depends(get_current_admin)):
    top = sorted(system_stats["top_drugs"].items(), key=lambda x: x[1], reverse=True)[:5]
    top_drugs = [{"label": k, "count": str(v), "progress": min(100, v * 10)} for k, v in top]
    from backend.database.mock_db import users_db
    
    recent_high_risk = []
    # get last 3 high risk
    for log in reversed(history_logs):
        if log["highRiskAlerts"] > 0:
            for interaction in log["interactions"]:
                if interaction["severity"] in ["CONTRAINDICATED", "MAJOR"]:
                    recent_high_risk.append({
                        "title": " + ".join(interaction["drugs"]),
                        "desc": interaction["mechanism"],
                        "severity": "High" if interaction["severity"] == "CONTRAINDICATED" else "Moderate",
                        "time": log["timestamp"],
                        "confidence": int(interaction.get("confidence", 0.9) * 100)
                    })
            if len(recent_high_risk) >= 3:
                break
                
    return {
        "total_checks": system_stats["total_checks"],
        "high_risk_cases": system_stats["high_risk_cases"],
        "active_users": len(users_db),
        "ai_accuracy": system_stats["ai_accuracy"],
        "uptime": system_stats["uptime"],
        "top_drugs": top_drugs,
        "recent_high_risk": recent_high_risk[:3]
    }
