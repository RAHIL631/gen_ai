from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class SeverityEnum(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    MAJOR = "MAJOR"
    CONTRAINDICATED = "CONTRAINDICATED"

class Interaction(BaseModel):
    drugs: List[str] = Field(..., description="List of drugs involved in the interaction")
    severity: SeverityEnum = Field(..., description="Severity level of the interaction")
    type: str = Field(..., description="Type of interaction (e.g., Pharmacodynamic)")
    reason: str = Field(default="Both medications interact via mechanism.", description="Reason for the interaction")
    source: str = Field(default="DrugBank", description="Source database of the interaction evidence")
    mechanism: str = Field(..., description="Clinical mechanism of the interaction")
    recommendation: str = Field(..., description="Actionable recommendation")
    confidence: float = Field(..., description="Confidence score of the interaction analysis from 0.0 to 1.0")

class ClinicalInsight(BaseModel):
    title: str
    description: str
    severity: str = Field(..., description="error, warning, or info")

class AnalysisRequest(BaseModel):
    medication_text: str = Field(..., description="Raw text of patient medications")

class AnalysisResponse(BaseModel):
    totalDrugs: int
    interactionsFound: int
    highRiskAlerts: int
    safeCombinations: int
    interactions: List[Interaction]
    clinicalInsights: List[ClinicalInsight]

class NormalizeRequest(BaseModel):
    drug_name: str

class NormalizeResponse(BaseModel):
    original_name: str
    rxcui: Optional[str]
    normalized_name: Optional[str]
    synonyms: List[str]
