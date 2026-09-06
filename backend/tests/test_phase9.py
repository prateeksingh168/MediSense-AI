import pytest
from app.services.seed_service import seed_dataset
from app.models.patient import Patient
from app.models.symptom_assessment import SymptomAssessment
from app.models.ai_prediction import AIPrediction, RiskLevel
from app.models.doctor_decision import DoctorDecision, DecisionEnum
from app.models.health_record import HealthRecord


def test_seed_service_execution(db_session):
    # 1. Run seed for 15 rows
    counts = seed_dataset(db_session, max_rows=15)
    assert counts["patients_created"] == 15
    assert counts["health_records"] == 15
    assert counts["assessments"] == 15
    assert counts["ai_predictions"] == 15
    assert counts["doctor_decisions"] == 15

    # 2. Verify patient records and code
    patient = db_session.query(Patient).filter(Patient.patient_code == "P00001").first()
    assert patient is not None
    assert patient.user is not None
    assert patient.user.email == "p00001@demo.medisense.ai"

    # 3. Verify 25 one-hot symptoms converted to JSON list
    assessment = db_session.query(SymptomAssessment).filter(
        SymptomAssessment.patient_id == patient.id
    ).first()
    assert assessment is not None
    assert isinstance(assessment.symptoms, list)

    # 4. Verify AI prediction mapping
    pred = assessment.ai_prediction
    assert pred is not None
    assert pred.risk_level in [RiskLevel.LOW, RiskLevel.MODERATE, RiskLevel.HIGH]
    assert pred.condition is not None

    # 5. Verify doctor decision mapping
    dec = assessment.doctor_decision
    assert dec is not None
    assert dec.decision in [DecisionEnum.ACCEPTED, DecisionEnum.OVERRIDDEN, DecisionEnum.PENDING]

    # 6. Test idempotency
    counts_rerun = seed_dataset(db_session, max_rows=15)
    assert counts_rerun["patients_created"] == 0
    assert counts_rerun["patients_skipped"] == 15
