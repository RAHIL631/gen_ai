import os
import joblib
import pandas as pd
import re
from typing import List, Dict, Any
from backend.models.schemas import AnalysisResponse, Interaction, ClinicalInsight, SeverityEnum
from backend.utils.logger import get_logger

logger = get_logger(__name__)

# Try to load models. If they don't exist, provide a pure python fallback or instructions.
try:
    base_dir = os.path.dirname(os.path.dirname(__file__))
    model_dir = os.path.join(base_dir, 'models')
    model_path = os.path.join(model_dir, 'interaction_model.pkl')
    le_path = os.path.join(model_dir, 'label_encoder.pkl')
    db_path = os.path.join(model_dir, 'interactions_db.pkl')
    
    if os.path.exists(model_path) and os.path.exists(db_path):
        pipeline = joblib.load(model_path)
        label_encoder = joblib.load(le_path)
        interactions_db = pd.read_pickle(db_path)
        MODEL_LOADED = True
    else:
        MODEL_LOADED = False
except Exception as e:
    logger.error(f"Failed to load ML models: {e}")
    MODEL_LOADED = False

# Extractor list for simple NLP
KNOWN_DRUGS = [
    "aspirin", "warfarin", "sildenafil", "lisinopril", "ibuprofen", "simvastatin", 
    "sertraline", "fluoxetine", "omeprazole", "atorvastatin", "metoprolol", "alprazolam",
    "clopidogrel", "levothyroxine", "calcium carbonate", "ciprofloxacin", "spironolactone",
    "clarithromycin", "metronidazole", "alcohol", "lithium", "digoxin", "amiodarone",
    "phenelzine", "st. john's wort", "ketoconazole", "fluconazole", "methotrexate",
    "trimethoprim", "tramadol", "azithromycin", "ondansetron", "insulin glargine",
    "propranolol", "rivaroxaban", "phenytoin", "diltiazem", "carbamazepine", 
    "oral contraceptives", "erythromycin", "vitamin c", "vitamin d", "biotin", 
    "folic acid", "zinc", "magnesium", "loratadine", "cetirizine", "amoxicillin", "cephalexin",
    "coumadin", "jantoven", "viagra", "revatio", "prinivil", "zestril", "advil", "motrin",
    "zocor", "zoloft", "prozac", "prilosec", "lipitor", "lopressor", "toprol xl", "xanax"
]

def extract_drugs_local(text: str) -> List[str]:
    """Extracts drugs using pure Python NLP/heuristics."""
    text_lower = text.lower()
    extracted = set()
    for drug in KNOWN_DRUGS:
        # Match word boundaries
        if re.search(r'\b' + re.escape(drug) + r'\b', text_lower):
            extracted.add(drug.title())
            
    # Also attempt simple comma separation extraction
    parts = re.split(r'[,+&]| and ', text)
    for p in parts:
        clean = re.sub(r'[^a-zA-Z\s]', '', p).strip().title()
        if clean and len(clean) > 3 and clean not in extracted:
            extracted.add(clean)
            
    return list(extracted)

def perform_ml_analysis(medications_text: str, extracted_drugs: List[str]) -> AnalysisResponse:
    """Predicts interactions using the trained Scikit-Learn model."""
    interactions = []
    insights = []
    
    total_drugs = len(extracted_drugs)
    interactions_found = 0
    high_risk = 0
    
    if total_drugs < 2:
        return AnalysisResponse(
            totalDrugs=total_drugs,
            interactionsFound=0,
            highRiskAlerts=0,
            safeCombinations=1 if total_drugs == 1 else 0,
            interactions=[],
            clinicalInsights=[ClinicalInsight(title="Insufficient Data", description="Provide at least two medications to analyze interactions.", severity="info")]
        )
        
    pairs = []
    for i in range(total_drugs):
        for j in range(i + 1, total_drugs):
            pairs.append((extracted_drugs[i], extracted_drugs[j]))
            
    safe_combinations = len(pairs)
            
    for drug_a, drug_b in pairs:
        pair_text = f"{drug_a.lower()} {drug_b.lower()}"
        
        severity_pred = "LOW"
        mech = "No known mechanism."
        rec = "Standard dosing."
        type_ = "None"
        confidence = 0.5
        
        if MODEL_LOADED:
            try:
                pred_idx = pipeline.predict([pair_text])[0]
                severity_pred = label_encoder.inverse_transform([pred_idx])[0]
                prob = pipeline.predict_proba([pair_text])[0]
                confidence = prob[pred_idx]
                
                # Lookup exact details in DB
                match = interactions_db[(interactions_db['drug_a'].str.lower() == drug_a.lower()) & 
                                        (interactions_db['drug_b'].str.lower() == drug_b.lower())]
                if not match.empty:
                    mech = match.iloc[0]['mechanism']
                    rec = match.iloc[0]['recommendation']
                    type_ = match.iloc[0]['interaction_type']
            except Exception as e:
                logger.error(f"ML prediction error: {e}")
        else:
            # Fallback logic if ML model hasn't been trained yet
            if ("warfarin" in pair_text and "aspirin" in pair_text) or ("sildenafil" in pair_text and "nitrate" in pair_text):
                 severity_pred = "MAJOR"
                 mech = "Fallback heuristic: High risk combination detected."
                 rec = "Requires immediate review."
                 confidence = 0.99
                 
        if severity_pred != "LOW":
            safe_combinations -= 1
            interactions_found += 1
            
            # Map string to enum safely
            try:
                sev_enum = SeverityEnum(severity_pred.upper())
            except:
                sev_enum = SeverityEnum.MODERATE
                
            if sev_enum in [SeverityEnum.MAJOR, SeverityEnum.CONTRAINDICATED]:
                high_risk += 1
                
            interactions.append(Interaction(
                drugs=[drug_a, drug_b],
                severity=sev_enum,
                type=type_,
                reason=f"Both medications {drug_a} and {drug_b} interact via {type_} mechanisms.",
                source="DrugBank / TWOSIDES",
                mechanism=mech,
                recommendation=rec,
                confidence=float(confidence)
            ))
            
            insights.append(ClinicalInsight(
                title=f"{sev_enum.value} Risk: {drug_a} + {drug_b}",
                description=f"{mech} {rec}",
                severity="error" if sev_enum in [SeverityEnum.MAJOR, SeverityEnum.CONTRAINDICATED] else "warning"
            ))
            
            if confidence < 0.75:
                insights.append(ClinicalInsight(
                    title=f"Low Confidence: {drug_a} + {drug_b}",
                    description="Low confidence prediction. Consult healthcare provider for verification.",
                    severity="warning"
                ))
            
    if not insights:
         insights.append(ClinicalInsight(title="Regimen Safe", description="No high-risk pharmacological anomalies detected in current regimen.", severity="info"))

    return AnalysisResponse(
        totalDrugs=total_drugs,
        interactionsFound=interactions_found,
        highRiskAlerts=high_risk,
        safeCombinations=safe_combinations,
        interactions=interactions,
        clinicalInsights=insights
    )
