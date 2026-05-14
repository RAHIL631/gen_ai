from backend.models.schemas import AnalysisResponse, ClinicalInsight
from backend.utils.logger import get_logger

logger = get_logger(__name__)

def evaluate_emergency_status(result: AnalysisResponse) -> AnalysisResponse:
    """Evaluates the analysis result for immediate emergency actions."""
    
    is_emergency = False
    emergency_messages = []
    
    for interaction in result.interactions:
        if interaction.severity == "CONTRAINDICATED":
            is_emergency = True
            emergency_messages.append(f"CRITICAL: {', '.join(interaction.drugs)} is contraindicated. {interaction.recommendation}")
    
    if is_emergency:
        logger.warning("Emergency condition detected in analysis!")
        # Inject an emergency insight at the top
        result.clinicalInsights.insert(0, ClinicalInsight(
            title="🚨 IMMEDIATE ACTION REQUIRED",
            description=" ".join(emergency_messages),
            severity="error"
        ))
        
    # Recalculate metrics to ensure accuracy
    result.interactionsFound = len(result.interactions)
    result.highRiskAlerts = sum(1 for i in result.interactions if i.severity in ["CONTRAINDICATED", "MAJOR"])
    
    return result
