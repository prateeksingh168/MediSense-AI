from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.health_record import HealthRecord
from app.schemas.health_record_schema import (
    HealthRecordCreate,
    HealthRecordData,
    HealthRecordResponse,
    HealthRecordListResponse
)
from app.utils.jwt_handler import get_current_user
from app.utils.response_wrapper import success_response

router = APIRouter(prefix="/health-records", tags=["Health Records & Vitals"])


def compute_bmi(height_cm: float | None, weight_kg: float | None) -> float | None:
    if height_cm and weight_kg and height_cm > 0:
        height_m = height_cm / 100.0
        return round(weight_kg / (height_m ** 2), 1)
    return None


@router.post(
    "",
    response_model=HealthRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record vital signs and health metrics",
    description="Records biometric data (heart rate, blood pressure, temperature, SpO2, height, weight) with physiological sanity bounds."
)
def create_health_record(
    req: HealthRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_patient_id = None
    if current_user.role == UserRole.PATIENT:
        if not current_user.patient_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Patient profile not found for current user"
            )
        target_patient_id = current_user.patient_profile.id
    elif current_user.role == UserRole.DOCTOR:
        if not req.patient_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="patient_id is required when creating a record as a doctor"
            )
        patient = db.query(Patient).filter(Patient.id == req.patient_id).first()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID {req.patient_id} not found"
            )
        target_patient_id = req.patient_id

    record = HealthRecord(
        patient_id=target_patient_id,
        height_cm=req.height_cm,
        weight_kg=req.weight_kg,
        heart_rate_bpm=req.heart_rate_bpm,
        systolic_bp=req.systolic_bp,
        diastolic_bp=req.diastolic_bp,
        temperature=req.temperature,
        spo2_percent=req.spo2_percent,
        symptoms=req.symptoms,
        notes=req.notes
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    bmi = compute_bmi(record.height_cm, record.weight_kg)
    data = HealthRecordData(
        id=record.id,
        patient_id=record.patient_id,
        height_cm=record.height_cm,
        weight_kg=record.weight_kg,
        heart_rate_bpm=record.heart_rate_bpm,
        systolic_bp=record.systolic_bp,
        diastolic_bp=record.diastolic_bp,
        temperature=record.temperature,
        spo2_percent=record.spo2_percent,
        bmi=bmi,
        symptoms=record.symptoms or [],
        notes=record.notes,
        recorded_at=record.recorded_at,
        date=record.recorded_at.isoformat() if record.recorded_at else ""
    )

    return success_response(data=data.model_dump(), message="Health record saved successfully")


@router.get(
    "/{patient_id}",
    response_model=HealthRecordListResponse,
    summary="Get patient health records history",
    description="Returns chronological health records and vital trajectories for the specified patient."
)
def get_health_records_history(
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

    # Authorization
    if current_user.role == UserRole.PATIENT:
        if not current_user.patient_profile or current_user.patient_profile.id != patient_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to view these health records"
            )

    records = db.query(HealthRecord).filter(
        HealthRecord.patient_id == patient_id
    ).order_by(HealthRecord.recorded_at.asc(), HealthRecord.id.asc()).all()

    record_items = []
    for r in records:
        bmi = compute_bmi(r.height_cm, r.weight_kg)
        record_items.append(HealthRecordData(
            id=r.id,
            patient_id=r.patient_id,
            height_cm=r.height_cm,
            weight_kg=r.weight_kg,
            heart_rate_bpm=r.heart_rate_bpm,
            systolic_bp=r.systolic_bp,
            diastolic_bp=r.diastolic_bp,
            temperature=r.temperature,
            spo2_percent=r.spo2_percent,
            bmi=bmi,
            symptoms=r.symptoms or [],
            notes=r.notes,
            recorded_at=r.recorded_at,
            date=r.recorded_at.isoformat() if r.recorded_at else ""
        ))

    return success_response(
        data=[r.model_dump() for r in record_items],
        message="Health records history retrieved successfully"
    )
