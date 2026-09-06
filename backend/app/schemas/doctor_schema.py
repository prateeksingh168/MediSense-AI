from typing import List, Optional, Any, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from app.utils.response_wrapper import APIResponse
from app.schemas.patient_schema import PatientResponseData
from app.schemas.health_record_schema import HealthRecordData
from app.schemas.symptom_schema import AIAnalysisResult, DecisionSummary


class CaseListItem(BaseModel):
    case_id: int = Field(..., examples=[101])
    patient_id: int = Field(..., examples=[1])
    patient_code: Optional[str] = Field(default=None, examples=["P00001"])
    patient_name: str = Field(..., examples=["Riya Sharma"])
    age: Optional[int] = Field(default=None, examples=[28])
    gender: Optional[str] = Field(default=None, examples=["Female"])
    symptoms: List[str] = Field(..., examples=[["fever", "cough"]])
    priority: str = Field(..., examples=["moderate"], description="low | moderate | high")
    assessment_date: datetime
    ai_summary: str = Field(..., examples=["Probable Viral Fever (82% confidence)"])
    case_status: str = Field(..., examples=["pending"], description="pending | accepted | overridden")


class CaseDetailData(BaseModel):
    case_id: int
    assessment_date: datetime
    symptoms: List[str]
    duration_days: Optional[int] = None
    severity_1_to_5: Optional[int] = None
    additional_information: Optional[str] = None
    priority: str
    patient: PatientResponseData
    latest_vitals: Optional[HealthRecordData] = None
    ai_prediction: Optional[AIAnalysisResult] = None
    alerts: List[str] = Field(default_factory=list)
    case_status: str = "pending"
    doctor_decision: Optional[DecisionSummary] = None


class DoctorDecisionRequest(BaseModel):
    assessment_id: int = Field(..., examples=[101])
    decision: Literal["accepted", "overridden"] = Field(..., examples=["accepted"])
    reason: Optional[str] = Field(default=None, examples=["Clinical review agrees with assessment"])


class DoctorDecisionData(BaseModel):
    id: int
    doctor_id: int
    doctor_name: str
    assessment_id: int
    decision: str
    reason: Optional[str] = None
    created_at: datetime


class CaseListResponse(APIResponse[List[CaseListItem]]):
    pass


class CaseDetailResponse(APIResponse[CaseDetailData]):
    pass


class DoctorDecisionResponse(APIResponse[DoctorDecisionData]):
    pass
