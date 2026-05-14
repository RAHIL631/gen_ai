from fastapi import APIRouter, HTTPException
from backend.models.schemas import NormalizeRequest, NormalizeResponse
from backend.services.rxnorm import normalize_drug

router = APIRouter(prefix="/api/normalize", tags=["Drugs"])

@router.post("/", response_model=NormalizeResponse)
async def extract_and_normalize(request: NormalizeRequest):
    try:
        result = await normalize_drug(request.drug_name)
        return NormalizeResponse(
            original_name=request.drug_name,
            rxcui=result.get("rxcui"),
            normalized_name=result.get("normalized_name"),
            synonyms=result.get("synonyms", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
