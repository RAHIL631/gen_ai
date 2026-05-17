import os
import chromadb
from transformers import pipeline
from typing import List
from backend.models.schemas import AnalysisResponse, Interaction, ClinicalInsight, SeverityEnum
from backend.utils.logger import get_logger

logger = get_logger(__name__)

class AIService:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(__file__))
        self.model_dir = os.path.join(self.base_dir, 'models', 'trained_model')
        self.db_path = os.path.join(self.base_dir, 'data', 'vector_db')
        
        self.classifier = None
        self.collection = None
        
        self.load_models()
        
    def load_models(self):
        try:
            if os.path.exists(self.model_dir):
                logger.info("Loading PubMedBERT classifier...")
                self.classifier = pipeline('text-classification', model=self.model_dir)
            else:
                logger.warning(f"PubMedBERT model not found at {self.model_dir}. Using fallback.")
                
            if os.path.exists(self.db_path):
                logger.info("Loading ChromaDB vector database...")
                self.client = chromadb.PersistentClient(path=self.db_path)
                self.collection = self.client.get_collection('drug_interactions')
            else:
                logger.warning(f"ChromaDB not found at {self.db_path}. Using fallback.")
        except Exception as e:
            logger.error(f"Failed to load AI models: {e}")

    def check_interaction(self, extracted_drugs: List[str]) -> AnalysisResponse:
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
            query = f"Interaction between {drug_a} and {drug_b}"
            
            severity_pred = "LOW"
            mech = "No known mechanism."
            rec = "Standard dosing."
            confidence = 0.5
            
            if self.classifier and self.collection:
                try:
                    # 1. RAG Retrieval from ChromaDB
                    results = self.collection.query(
                        query_texts=[query],
                        n_results=1
                    )
                    
                    if results and results['documents'] and results['documents'][0]:
                        retrieved_text = results['documents'][0][0]
                        # 2. Classification using PubMedBERT
                        prediction = self.classifier(retrieved_text)
                        
                        severity_pred = prediction[0]['label']
                        confidence = prediction[0]['score']
                        mech = retrieved_text
                        rec = "Review detailed clinical insights."
                except Exception as e:
                    logger.error(f"AI prediction error: {e}")
            else:
                # Fallback logic
                pair_text = query.lower()
                if ("warfarin" in pair_text and "aspirin" in pair_text) or ("fluoxetine" in pair_text and "selegiline" in pair_text):
                     severity_pred = "MAJOR" if "warfarin" in pair_text else "CONTRAINDICATED"
                     mech = "Fallback heuristic: High risk combination detected."
                     rec = "Requires immediate review."
                     confidence = 0.99
                     
            # Normalize severity strings from model to match enum
            severity_mapping = {
                'LABEL_0': 'LOW',
                'LABEL_1': 'MINOR',
                'LABEL_2': 'MODERATE',
                'LABEL_3': 'MAJOR',
                'LABEL_4': 'CONTRAINDICATED',
                'none': 'LOW',
                'minor': 'MINOR',
                'moderate': 'MODERATE',
                'major': 'MAJOR',
                'contraindicated': 'CONTRAINDICATED',
                'LOW': 'LOW',
                'MINOR': 'MINOR',
                'MODERATE': 'MODERATE',
                'MAJOR': 'MAJOR',
                'CONTRAINDICATED': 'CONTRAINDICATED'
            }
            
            normalized_severity = severity_mapping.get(severity_pred, 'MODERATE')
            
            if normalized_severity != "LOW":
                safe_combinations -= 1
                interactions_found += 1
                
                try:
                    sev_enum = SeverityEnum(normalized_severity)
                except:
                    sev_enum = SeverityEnum.MODERATE
                    
                if sev_enum in [SeverityEnum.MAJOR, SeverityEnum.CONTRAINDICATED]:
                    high_risk += 1
                    
                interactions.append(Interaction(
                    drugs=[drug_a, drug_b],
                    severity=sev_enum,
                    type="Pharmacodynamic",
                    mechanism=mech,
                    recommendation=rec,
                    confidence=float(confidence)
                ))
                
                insights.append(ClinicalInsight(
                    title=f"{sev_enum.value} Risk: {drug_a} + {drug_b}",
                    description=f"Mechanism: {mech[:100]}... {rec}",
                    severity="error" if sev_enum in [SeverityEnum.MAJOR, SeverityEnum.CONTRAINDICATED] else "warning"
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

ai_service_instance = AIService()
