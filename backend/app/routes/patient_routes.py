from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.schemas.patient_schema import PatientUpdate, PatientResponse, PatientResponseData
from app.utils.jwt_handler import get_current_user
from app.utils.response_wrapper import success_response

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get(
    "/{patient_id}",
    response_model=PatientResponse,
    summary="Get patient profile",
    description="Fetches patient demographic and medical history. Doctors can view any patient; patients can view their own profile."
)
def get_patient_profile(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found"
        )

    # Authorization: Doctor can view any patient; Patient can only view self
    if current_user.role == UserRole.PATIENT:
        if not current_user.patient_profile or current_user.patient_profile.id != patient_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to view this patient profile"
            )

    user_info = patient.user
    data = PatientResponseData(
        id=patient.id,
        user_id=patient.user_id,
        patient_code=patient.patient_code,
        name=user_info.name if user_info else "",
        email=user_info.email if user_info else "",
        age=patient.age,
        gender=patient.gender,
        city=patient.city,
        medical_history=patient.medical_history,
        allergies=patient.allergies,
        medications=patient.medications
    )

    return success_response(data=data.model_dump(), message="Patient profile retrieved successfully")


@router.put(
    "/{patient_id}",
    response_model=PatientResponse,
    summary="Update patient profile",
    description="Updates patient demographic and medical details. Patients can only update their own profile."
)
def update_patient_profile(
    patient_id: int,
    req: PatientUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found"
        )

    # Authorization: Only the patient themselves can update their profile
    if current_user.id != patient.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile"
        )

    update_data = req.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)

    user_info = patient.user
    data = PatientResponseData(
        id=patient.id,
        user_id=patient.user_id,
        patient_code=patient.patient_code,
        name=user_info.name if user_info else "",
        email=user_info.email if user_info else "",
        age=patient.age,
        gender=patient.gender,
        city=patient.city,
        medical_history=patient.medical_history,
        allergies=patient.allergies,
        medications=patient.medications
    )

    return success_response(data=data.model_dump(), message="Patient profile updated successfully")
