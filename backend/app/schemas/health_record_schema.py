from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.utils.response_wrapper import APIResponse


class HealthRecordCreate(BaseModel):
    patient_id: Optional[int] = Field(default=None, examples=[1], description="Optional patient ID if submitting on behalf")
    height_cm: Optional[float] = Field(default=None, ge=50.0, le=250.0, examples=[172.5])
    weight_kg: Optional[float] = Field(default=None, ge=20.0, le=300.0, examples=[68.0])
    heart_rate_bpm: Optional[int] = Field(default=None, ge=30, le=250, examples=[72])
    systolic_bp: Optional[int] = Field(default=None, ge=50, le=250, examples=[120])
    diastolic_bp: Optional[int] = Field(default=None, ge=30, le=180, examples=[80])
    temperature: Optional[float] = Field(default=None, ge=30.0, le=45.0, examples=[36.8])
    spo2_percent: Optional[float] = Field(default=None, ge=50.0, le=100.0, examples=[98.5])
    symptoms: Optional[List[str]] = Field(default=None, examples=[["fatigue"]])
    notes: Optional[str] = Field(default=None, examples=["Routine clinic observation"])


class HealthRecordData(BaseModel):
    id: int
    patient_id: int
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    heart_rate_bpm: Optional[int] = None
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    temperature: Optional[float] = None
    spo2_percent: Optional[float] = None
    bmi: Optional[float] = None
    symptoms: Optional[List[str]] = None
    notes: Optional[str] = None
    recorded_at: datetime
    date: str


class HealthRecordResponse(APIResponse[HealthRecordData]):
    pass


class HealthRecordListResponse(APIResponse[List[HealthRecordData]]):
    pass
