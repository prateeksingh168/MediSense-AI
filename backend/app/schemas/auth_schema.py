from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field
from app.utils.response_wrapper import APIResponse


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, examples=["Riya Sharma"])
    email: EmailStr = Field(..., examples=["riya@example.com"])
    password: str = Field(..., min_length=6, max_length=100, examples=["SecurePass123"])
    role: Literal["patient", "doctor"] = Field(default="patient", examples=["patient"])
    specialization: Optional[str] = Field(default=None, examples=["Cardiology"], description="Optional specialization for doctors")


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., examples=["riya@example.com"])
    password: str = Field(..., examples=["SecurePass123"])


class AuthData(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    name: str
    email: str
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    patient_code: Optional[str] = None


class UserProfileData(BaseModel):
    user_id: int
    role: str
    name: str
    email: str
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    patient_code: Optional[str] = None


class AuthResponse(APIResponse[AuthData]):
    pass


class UserProfileResponse(APIResponse[UserProfileData]):
    pass
