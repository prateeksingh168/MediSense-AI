from typing import Optional
from pydantic import BaseModel, Field
from app.utils.response_wrapper import APIResponse


class PatientUpdate(BaseModel):
    age: Optional[int] = Field(default=None, ge=0, le=130, examples=[28])
    gender: Optional[str] = Field(default=None, max_length=32, examples=["Female"])
    city: Optional[str] = Field(default=None, max_length=128, examples=["Mumbai"])
    medical_history: Optional[str] = Field(default=None, examples=["Mild asthma diagnosed in childhood"])
    allergies: Optional[str] = Field(default=None, examples=["Penicillin"])
    medications: Optional[str] = Field(default=None, examples=["Albuterol inhaler as needed"])


class PatientResponseData(BaseModel):
    id: int
    user_id: int
    patient_code: Optional[str] = None
    name: str
    email: str
    age: Optional[int] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None


class PatientResponse(APIResponse[PatientResponseData]):
    pass
