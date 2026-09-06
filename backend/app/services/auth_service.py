from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.schemas.auth_schema import RegisterRequest, LoginRequest, AuthData
from app.utils.security import get_password_hash, verify_password
from app.utils.jwt_handler import create_access_token


def register_user(db: Session, req: RegisterRequest) -> AuthData:
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email address already exists"
        )

    role_enum = UserRole.PATIENT if req.role == "patient" else UserRole.DOCTOR

    new_user = User(
        name=req.name,
        email=req.email,
        password_hash=get_password_hash(req.password),
        role=role_enum
    )
    db.add(new_user)
    db.flush()

    patient_id = None
    patient_code = None
    doctor_id = None

    if role_enum == UserRole.PATIENT:
        generated_code = f"P{new_user.id:05d}"
        new_patient = Patient(
            user_id=new_user.id,
            patient_code=generated_code
        )
        db.add(new_patient)
        db.flush()
        patient_id = new_patient.id
        patient_code = generated_code
    elif role_enum == UserRole.DOCTOR:
        new_doctor = Doctor(
            user_id=new_user.id,
            specialization=req.specialization or "General Physician"
        )
        db.add(new_doctor)
        db.flush()
        doctor_id = new_doctor.id

    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "sub": str(new_user.id),
        "user_id": new_user.id,
        "role": new_user.role.value,
        "email": new_user.email
    })

    return AuthData(
        access_token=token,
        token_type="bearer",
        role=new_user.role.value,
        user_id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        patient_id=patient_id,
        doctor_id=doctor_id,
        patient_code=patient_code
    )


def login_user(db: Session, req: LoginRequest) -> AuthData:
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    patient_id = user.patient_profile.id if user.patient_profile else None
    patient_code = user.patient_profile.patient_code if user.patient_profile else None
    doctor_id = user.doctor_profile.id if user.doctor_profile else None

    token = create_access_token({
        "sub": str(user.id),
        "user_id": user.id,
        "role": user.role.value,
        "email": user.email
    })

    return AuthData(
        access_token=token,
        token_type="bearer",
        role=user.role.value,
        user_id=user.id,
        name=user.name,
        email=user.email,
        patient_id=patient_id,
        doctor_id=doctor_id,
        patient_code=patient_code
    )
