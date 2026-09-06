from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    AuthData,
    UserProfileResponse,
    UserProfileData
)
from app.services.auth_service import register_user, login_user
from app.utils.response_wrapper import success_response
from app.utils.jwt_handler import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new patient or doctor",
    description="Registers a new user account with role 'patient' or 'doctor', creates linked profiles, and returns an access token."
)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    auth_data = register_user(db, req)
    return success_response(data=auth_data.model_dump(), message="User registered successfully")


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Log in user",
    description="Authenticates credentials and returns a JWT access token."
)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    auth_data = login_user(db, req)
    return success_response(data=auth_data.model_dump(), message="Login successful")


@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Get current authenticated user profile",
    description="Returns profile information for the authenticated user from the Bearer token without echoing tokens."
)
def get_me(current_user: User = Depends(get_current_user)):
    patient_id = current_user.patient_profile.id if current_user.patient_profile else None
    patient_code = current_user.patient_profile.patient_code if current_user.patient_profile else None
    doctor_id = current_user.doctor_profile.id if current_user.doctor_profile else None

    data = UserProfileData(
        role=current_user.role.value,
        user_id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        patient_id=patient_id,
        doctor_id=doctor_id,
        patient_code=patient_code
    )
    return success_response(data=data.model_dump(), message="Current user profile retrieved successfully")
