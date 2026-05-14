import os
import json
from backend.etl.extractor import DrugBankExtractor
from backend.etl.transformer import DataTransformer
from backend.utils.logger import get_logger

logger = get_logger(__name__)

RAW_DB_PATH = "backend/data/full_database.xml"
OUTPUT_INTERACTIONS_PATH = "backend/data/processed_interactions.json"
OUTPUT_CHUNKS_PATH = "backend/data/rag_chunks.json"

def save_json(data, filepath):
    logger.info(f"Saving {len(data)} records to {filepath}")
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    logger.info("Save successful.")

def run_pipeline():
    logger.info("=== Starting PharmAI Drug Interaction ETL Pipeline ===")
    
    # 1. Extract
    extractor = DrugBankExtractor(RAW_DB_PATH)
    raw_interactions = extractor.parse()
    
    # 2. Transform & Clean
    transformer = DataTransformer()
    clean_interactions = transformer.clean_and_deduplicate(raw_interactions)
    
    # 3. Generate Chunks
    rag_chunks = transformer.generate_rag_chunks(clean_interactions)
    
    # 4. Load (Save to filesystem for verification/embedding scripts)
    save_json(clean_interactions, OUTPUT_INTERACTIONS_PATH)
    save_json(rag_chunks, OUTPUT_CHUNKS_PATH)
    
    logger.info("=== ETL Pipeline Execution Completed Successfully ===")

if __name__ == "__main__":
    run_pipeline()
