import os
import json
from typing import List
from openai import AsyncOpenAI
from backend.models.schemas import AnalysisResponse
from backend.prompts.interaction_prompts import ANALYSIS_SYSTEM_PROMPT, EXTRACTION_SYSTEM_PROMPT
from backend.utils.logger import get_logger

logger = get_logger(__name__)

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy"))

async def extract_drugs_with_llm(medications_text: str) -> List[str]:
    """Extracts a list of medicines from raw text using OpenAI LLM."""
    logger.info("Starting LLM drug extraction")
    try:
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
                {"role": "user", "content": f"Medication Text: {medications_text}"}
            ],
            temperature=0.0
        )
        raw_output = response.choices[0].message.content
        data = json.loads(raw_output)
        return data.get("drugs", [])
    except Exception as e:
        logger.error(f"LLM drug extraction failed: {str(e)}")
        # Simple fallback parsing if LLM fails
        return [d.strip() for d in medications_text.replace("and", ",").split(",") if d.strip()]

async def analyze_with_llm(medications: str, context: str) -> AnalysisResponse:
    """Analyzes drugs + context using OpenAI LLM."""
    logger.info("Starting LLM analysis")
    
    prompt = f"Patient Medications: {medications}\n\nVerified Database Context:\n{context}\n\nPerform the interaction analysis based strictly on the context."
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": ANALYSIS_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0
        )
        
        raw_output = response.choices[0].message.content
        data = json.loads(raw_output)
        return AnalysisResponse(**data)
        
    except Exception as e:
        logger.error(f"LLM analysis failed: {str(e)}")
        raise e
