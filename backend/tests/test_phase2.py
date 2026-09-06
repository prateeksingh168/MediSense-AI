import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import (
    Base,
    User,
    UserRole,
    Patient,
    Doctor,
    HealthRecord,
    SymptomAssessment,
    AIPrediction,
    RiskLevel,
    Alert,
    SimilarCase,
    DoctorDecision,
    DecisionEnum
)


def test_database_models_creation():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    # 1. Create a User (Patient)
    user_patient = User(
        name="John Doe",
        email="john@example.com",
        password_hash="hashed_pw_test",
        role=UserRole.PATIENT
    )
    db.add(user_patient)
    db.commit()
    db.refresh(user_patient)

    # 2. Create a Patient Profile
    patient = Patient(
        user_id=user_patient.id,
        patient_code="P00001",
        age=35,
        gender="Male",
        city="Mumbai",
        medical_history="None",
        allergies="Peanuts",
        medications="None"
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    # 3. Create a User (Doctor) & Doctor Profile
    user_doctor = User(
        name="Dr. Smith",
        email="drsmith@example.com",
        password_hash="hashed_pw_test",
        role=UserRole.DOCTOR
    )
    db.add(user_doctor)
    db.commit()
    db.refresh(user_doctor)

    doctor = Doctor(
        user_id=user_doctor.id,
        specialization="Cardiology"
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    # 4. Create Health Record
    health_record = HealthRecord(
        patient_id=patient.id,
        height_cm=175.0,
        weight_kg=70.0,
        heart_rate_bpm=72,
        systolic_bp=120,
        diastolic_bp=80,
        temperature=36.6,
        spo2_percent=98.0,
        symptoms=["fatigue"],
        notes="Routine checkup"
    )
    db.add(health_record)
    db.commit()

    # 5. Create Symptom Assessment
    assessment = SymptomAssessment(
        patient_id=patient.id,
        symptoms=["fever", "cough"],
        duration_days=3,
        severity_1_to_5=3,
        additional_information="Mild headache"
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # 6. Create AI Prediction
    prediction = AIPrediction(
        assessment_id=assessment.id,
        condition="Viral Fever",
        probability=0.85,
        risk_level=RiskLevel.MODERATE,
        explanation="Symptoms are consistent with viral infection.",
        missing_information=["travel_history"],
        similar_cases=["CASE-001"],
        recommendation="Hydration and rest",
        model_name="medisense-v1"
    )
    db.add(prediction)

    # 7. Create Alert
    alert = Alert(
        assessment_id=assessment.id,
        alert_level="MODERATE",
        message="Patient exhibits multiple symptoms"
    )
    db.add(alert)

    # 8. Create Similar Case
    similar_case = SimilarCase(
        case_reference="CASE-001",
        case_text="Patient with fever and cough",
        case_metadata={"age": 34, "diagnosis": "Viral Fever"}
    )
    db.add(similar_case)

    # 9. Create Doctor Decision
    decision = DoctorDecision(
        doctor_id=doctor.id,
        assessment_id=assessment.id,
        decision=DecisionEnum.ACCEPTED,
        reason="Agreed with AI assessment."
    )
    db.add(decision)
    db.commit()

    # Verify query
    fetched_assessment = db.query(SymptomAssessment).filter_by(id=assessment.id).first()
    assert fetched_assessment is not None
    assert fetched_assessment.symptoms == ["fever", "cough"]
    assert fetched_assessment.ai_prediction.risk_level == RiskLevel.MODERATE
    assert fetched_assessment.doctor_decision.decision == DecisionEnum.ACCEPTED
    assert fetched_assessment.patient.patient_code == "P00001"

    db.close()
