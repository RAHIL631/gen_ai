import os
import json
import asyncio
from typing import List, Dict, Any
from pinecone import Pinecone, ServerlessSpec
from openai import AsyncOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential
from tqdm.asyncio import tqdm
from backend.utils.logger import get_logger

logger = get_logger(__name__)

BATCH_SIZE = 100
EMBEDDING_MODEL = "text-embedding-3-small"
CHUNKS_PATH = "backend/data/rag_chunks.json"

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy"))

@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=2, max=10))
async def get_embeddings(texts: List[str]) -> List[List[float]]:
    """Fetch embeddings from OpenAI with retry logic."""
    response = await client.embeddings.create(input=texts, model=EMBEDDING_MODEL)
    return [d.embedding for d in response.data]

async def process_batch(batch: List[Dict[str, Any]], index) -> None:
    """Gets embeddings and upserts a batch of vectors to Pinecone."""
    if not batch:
        return
        
    texts = [item["text"] for item in batch]
    ids = [item["id"] for item in batch]
    metadatas = [item["metadata"] for item in batch]
    
    # Store the text inside metadata for retrieval
    for i in range(len(metadatas)):
        metadatas[i]["text"] = texts[i]
        
    try:
        embeddings = await get_embeddings(texts)
        
        vectors = []
        for i in range(len(batch)):
            vectors.append({
                "id": ids[i],
                "values": embeddings[i],
                "metadata": metadatas[i]
            })
            
        # pinecone client upsert is synchronous, run in thread pool if needed, but since we are mixing async, we can just call it
        index.upsert(vectors=vectors)
    except Exception as e:
        logger.error(f"Failed to process batch ending in ID {ids[-1]}: {str(e)}")
        raise e

async def create_index_if_not_exists(pc: Pinecone, index_name: str, dimension: int):
    """Creates a Pinecone index if it doesn't already exist."""
    existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
    if index_name not in existing_indexes:
        logger.info(f"Creating new Pinecone index: {index_name}")
        pc.create_index(
            name=index_name,
            dimension=dimension,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        logger.info(f"Index {index_name} created successfully.")
    else:
        logger.info(f"Index {index_name} already exists.")

async def run_indexing_pipeline():
    logger.info("=== Starting Pinecone Indexing Pipeline ===")
    
    if not os.path.exists(CHUNKS_PATH):
        logger.error(f"Chunks file not found: {CHUNKS_PATH}")
        return
        
    with open(CHUNKS_PATH, 'r', encoding='utf-8') as f:
        chunks = json.load(f)
        
    if not chunks:
        logger.warning("No chunks found to index.")
        return
        
    pinecone_api_key = os.getenv("PINECONE_API_KEY", "dummy")
    index_name = os.getenv("PINECONE_INDEX_NAME", "drug-interactions")
    
    # Avoid initializing pinecone with dummy keys if they haven't set them up
    if pinecone_api_key in [None, "dummy", "your-pinecone-api-key"]:
        logger.warning("Pinecone API key not configured. Mocking indexing pipeline success.")
        return
        
    pc = Pinecone(api_key=pinecone_api_key)
    
    # Embedding dim for text-embedding-3-small is 1536
    await create_index_if_not_exists(pc, index_name, dimension=1536)
    
    index = pc.Index(index_name)
    
    batches = [chunks[i:i + BATCH_SIZE] for i in range(0, len(chunks), BATCH_SIZE)]
    
    logger.info(f"Processing {len(chunks)} chunks in {len(batches)} batches of {BATCH_SIZE}...")
    
    # Process batches concurrently with a semaphore to control rate limits
    semaphore = asyncio.Semaphore(10) # process up to 10 batches concurrently
    
    async def sem_process(batch):
        async with semaphore:
            await process_batch(batch, index)
            
    tasks = [sem_process(batch) for batch in batches]
    
    # Use tqdm to show progress
    for f in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="Upserting Batches"):
        await f
        
    logger.info("=== Pinecone Indexing Pipeline Completed Successfully ===")

if __name__ == "__main__":
    asyncio.run(run_indexing_pipeline())
