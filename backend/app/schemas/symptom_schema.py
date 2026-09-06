from typing import List, Optional, Any, Union
from datetime import datetime

from pydantic import BaseModel, Field

from app.utils.response_wrapper import APIResponse


KNOWN_SYMPTOMS = [
    "abdominal_pain",
    "body_ache",
    "chest_discomfort",
    "chest_tightness",
    "cough",
    "diarrhea",
    "dizziness",
    "fatigue",
    "fever",
    "frequent_urination",
    "headache",
    "heartburn",
    "increased_thirst",
    "itchy_eyes",
    "light_sensitivity",
    "lower_abdominal_pain",
    "nasal_congestion",
    "nausea",
    "painful_urination",
    "runny_nose",
    "shortness_of_breath",
    "sneezing",
    "sore_throat",
    "vomiting",
    "wheezing",
]


class ProbableCondition(BaseModel):
    condition: str = Field(..., examples=["Viral Fever"])
    probability: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        examples=[0.82],
    )


class SimilarCaseItem(BaseModel):
    case_id: str = Field(..., examples=["CASE-1042"])
    similarity: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        examples=[0.91],
    )
    summary: str = Field(
        ...,
        examples=["Patient with 3-day fever and dry cough"],
    )


class SymptomAnalyzeRequest(BaseModel):
    symptoms: List[str] = Field(
        ...,
        min_length=1,
        examples=[["fever", "cough"]],
        description="List of observed symptoms",
    )

    temperature: Optional[float] = Field(
        default=None,
        ge=30.0,
        le=45.0,
        examples=[38.5],
    )

    duration_days: Optional[int] = Field(
        default=1,
        ge=1,
        le=365,
        examples=[3],
    )

    severity_1_to_5: Optional[int] = Field(
        default=2,
        ge=1,
        le=5,
        examples=[3],
    )

    additional_information: Optional[str] = Field(
        default=None,
        examples=["Mild chills in the evening"],
    )

    # ML model demographic features
    age: Optional[int] = Field(
        default=30,
        ge=0,
        le=120,
        examples=[30],
        description="Patient age used by the ML model",
    )

    sex: Optional[str] = Field(
        default="Female",
        examples=["Female"],
        description="Patient sex used by the ML model",
    )

    patient_id: Optional[int] = Field(
        default=None,
        examples=[1],
        description="Optional patient ID if submitting on behalf",
    )


class AIAnalysisResult(BaseModel):
    assessment_id: int

    risk_level: str = Field(
        ...,
        examples=["moderate"],
        description="low | moderate | high",
    )

    probable_conditions: List[ProbableCondition] = Field(
        default_factory=list
    )

    explanation: str = Field(
        ...,
        examples=[
            "Reported symptoms suggest a probable viral respiratory illness."
        ],
    )

    missing_information: List[str] = Field(
        default_factory=list,
        examples=[["fever_pattern", "fluid_intake"]],
    )

    similar_cases: List[Union[SimilarCaseItem, str, dict]] = Field(
        default_factory=list
    )

    recommendation: str = Field(
        ...,
        examples=[
            "Hydration and rest. Consult doctor if symptoms worsen."
        ],
    )

    model_name: str = "medisense-hybrid-v1"

    disclaimer: str = (
        "This assessment is an AI-generated clinical decision support "
        "aid and does not constitute a confirmed medical diagnosis."
    )


class DecisionSummary(BaseModel):
    decision: str
    reason: Optional[str] = None
    created_at: Optional[datetime] = None


class SymptomAssessmentHistoryItem(BaseModel):
    id: int
    patient_id: int
    symptoms: List[str]
    duration_days: Optional[int] = None
    severity_1_to_5: Optional[int] = None
    additional_information: Optional[str] = None
    created_at: datetime
    prediction: Optional[AIAnalysisResult] = None
    doctor_decision: Optional[DecisionSummary] = None


class SymptomAnalyzeResponse(APIResponse[AIAnalysisResult]):
    pass


class SymptomHistoryResponse(APIResponse[List[SymptomAssessmentHistoryItem]]):
    pass
