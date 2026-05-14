from typing import List, Dict, Any
from hashlib import md5
from backend.utils.logger import get_logger

logger = get_logger(__name__)

class DataTransformer:
    """Transforms raw drug interactions into clean JSON and RAG chunks."""
    
    def __init__(self):
        self.seen_pairs = set()

    def _infer_severity(self, description: str) -> str:
        """Heuristic to infer severity from DrugBank description text."""
        desc_lower = description.lower()
        if "contraindicated" in desc_lower or "fatal" in desc_lower:
            return "CONTRAINDICATED"
        if "risk or severity" in desc_lower or "increase" in desc_lower or "myopathy" in desc_lower:
            return "MAJOR"
        if "decrease" in desc_lower or "reduce" in desc_lower:
            return "MODERATE"
        return "LOW"
        
    def _infer_mechanisms(self, description: str) -> str:
        """Infer interaction type from description."""
        desc_lower = description.lower()
        if "metabolism" in desc_lower or "concentration" in desc_lower or "excretion" in desc_lower:
            return "Pharmacokinetic"
        if "activities" in desc_lower or "effects" in desc_lower:
            return "Pharmacodynamic"
        return "Systemic"

    def clean_and_deduplicate(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Removes duplicates and standardizes drug pairs."""
        logger.info("Starting cleaning and deduplication process...")
        cleaned = []
        
        for item in raw_data:
            # Sort to ensure A_B and B_A fall into the same bucket
            drugs = sorted([item["drug_a"].strip().lower(), item["drug_b"].strip().lower()])
            if not drugs[0] or not drugs[1]:
                continue
                
            pair_id = f"{drugs[0]}_{drugs[1]}"
            if pair_id not in self.seen_pairs:
                self.seen_pairs.add(pair_id)
                cleaned.append({
                    "drugs": drugs,
                    "description": item["description"],
                    "severity": self._infer_severity(item["description"]),
                    "mechanism_type": self._infer_mechanisms(item["description"])
                })
                
        logger.info(f"Deduplication complete. Retained {len(cleaned)} unique interactions.")
        return cleaned

    def generate_rag_chunks(self, cleaned_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Converts clean records into chunk formats with enriched metadata for vector embeddings."""
        logger.info("Generating semantic RAG chunks...")
        chunks = []
        
        for item in cleaned_data:
            drug_list = [d.capitalize() for d in item["drugs"]]
            desc = item["description"]
            severity = item["severity"]
            mechanism = item["mechanism_type"]
            
            # Formulate clear prose for embeddings
            text_payload = f"Drug Interaction between {drug_list[0]} and {drug_list[1]}: {desc} The clinical severity of this interaction is {severity}. The mechanism is primarily {mechanism}."
            
            chunk_id = md5(text_payload.encode('utf-8')).hexdigest()
            
            chunks.append({
                "id": chunk_id,
                "text": text_payload,
                "metadata": {
                    "drug_1": item["drugs"][0],
                    "drug_2": item["drugs"][1],
                    "severity": severity,
                    "mechanism_type": mechanism,
                    "source": "DrugBank"
                }
            })
            
        logger.info(f"Generated {len(chunks)} RAG chunks ready for Pinecone ingestion.")
        return chunks
