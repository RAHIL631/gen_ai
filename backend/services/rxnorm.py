import httpx
from backend.utils.logger import get_logger

logger = get_logger(__name__)

RXNORM_BASE_URL = "https://rxnav.nlm.nih.gov/REST"

async def normalize_drug(drug_name: str) -> dict:
    """Uses the RxNorm API to get the standard name and RxCUI for a drug."""
    logger.info(f"Normalizing drug: {drug_name}")
    async with httpx.AsyncClient() as client:
        try:
            # 1. Search for drug to get spelling suggestions / exact match
            response = await client.get(f"{RXNORM_BASE_URL}/drugs.json?name={drug_name}")
            response.raise_for_status()
            data = response.json()
            
            concept_group = data.get('drugGroup', {}).get('conceptGroup', [])
            for group in concept_group:
                if 'conceptProperties' in group:
                    props = group['conceptProperties'][0]
                    return {
                        "rxcui": props.get("rxcui"),
                        "normalized_name": props.get("name"),
                        "synonyms": [props.get("synonym")] if props.get("synonym") else []
                    }
            return {"rxcui": None, "normalized_name": drug_name, "synonyms": []}
        except Exception as e:
            logger.error(f"Failed to normalize drug {drug_name}: {str(e)}")
            return {"rxcui": None, "normalized_name": drug_name, "synonyms": []}
