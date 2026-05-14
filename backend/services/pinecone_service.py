import os
from typing import List, Dict, Any
from pinecone import Pinecone
from openai import AsyncOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential
from backend.utils.logger import get_logger

logger = get_logger(__name__)

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY", "dummy"))
index_name = os.getenv("PINECONE_INDEX_NAME", "drug-interactions")
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy"))

EMBEDDING_MODEL = "text-embedding-3-small"
SIMILARITY_THRESHOLD = 0.5

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=5))
async def get_query_embedding(text: str) -> List[float]:
    """Retrieves embedding for a query string with retry logic."""
    response = await client.embeddings.create(input=[text], model=EMBEDDING_MODEL)
    return response.data[0].embedding

async def query_interactions(drugs: List[str]) -> str:
    """Retrieve relevant interaction data from Pinecone using OpenAI embeddings."""
    logger.info(f"Querying vector DB for drugs: {', '.join(drugs)}")
    
    query_text = f"Interactions between {' and '.join(drugs)}"
    
    try:
        # Check if dummy key is used (we bypass actual pinecone call if no key is configured to avoid crashes locally)
        if os.getenv("PINECONE_API_KEY") in [None, "dummy", "your-pinecone-api-key"]:
            logger.warning("No valid Pinecone API key configured. Returning mock RAG context.")
            return "RAG Context: DrugBank DB shows Aspirin and Warfarin have a major interaction increasing bleeding risk. Lisinopril and Ibuprofen have a moderate interaction reducing antihypertensive effect."
            
        index = pc.Index(index_name)
        embedding = await get_query_embedding(query_text)
        
        # Query index
        search_result = index.query(
            vector=embedding,
            top_k=5,
            include_metadata=True
        )
        
        # Filter by similarity threshold to avoid irrelevant context
        relevant_matches = [
            match for match in search_result['matches'] 
            if match['score'] >= SIMILARITY_THRESHOLD
        ]
        
        if not relevant_matches:
            logger.info("No relevant interactions found above the similarity threshold.")
            return "No known dangerous interactions found for these medications in the database."
            
        context_parts = []
        for match in relevant_matches:
            score = match['score']
            metadata = match.get('metadata', {})
            text = metadata.get('text', '')
            severity = metadata.get('severity', 'Unknown')
            context_parts.append(f"[Score: {score:.2f}] {text} (Severity: {severity})")
            
        context = "\n".join(context_parts)
        logger.info(f"Retrieved {len(relevant_matches)} relevant context passages.")
        return context
        
    except Exception as e:
        logger.error(f"Pinecone query failed: {str(e)}")
        # Fallback context in case of error so the pipeline doesn't completely fail for the user
        return "Warning: Vector database retrieval failed. Unable to fetch real-time interaction contexts."
