import os
from pathlib import Path
from typing import Dict, Any, List
import pandas as pd
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.health_record import HealthRecord
from app.models.symptom_assessment import SymptomAssessment
from app.models.ai_prediction import AIPrediction, RiskLevel
from app.models.doctor_decision import DoctorDecision, DecisionEnum
from app.models.alert import Alert
from app.utils.security import get_password_hash

# 25 symptom columns in dataset
SYMPTOM_COLUMNS = [
    "abdominal_pain", "body_ache", "chest_discomfort", "chest_tightness",
    "cough", "diarrhea", "dizziness", "fatigue", "fever", "frequent_urination",
    "headache", "heartburn", "increased_thirst", "itchy_eyes", "light_sensitivity",
    "lower_abdominal_pain", "nasal_congestion", "nausea", "painful_urination",
    "runny_nose", "shortness_of_breath", "sneezing", "sore_throat", "vomiting", "wheezing"
]

URGENCY_MAP = {
    "routine_review": RiskLevel.LOW,
    "priority_review": RiskLevel.MODERATE,
    "urgent_review": RiskLevel.HIGH
}

DECISION_MAP = {
    "accepted_ai": DecisionEnum.ACCEPTED,
    "overridden_ai": DecisionEnum.OVERRIDDEN,
    "pending_review": DecisionEnum.PENDING
}


def find_dataset_dir() -> Path:
    """Locate the dataset directory (checks dataset, Dataset, backend/dataset, backend/Dataset)."""
    candidates = [
        Path("Dataset"),
        Path("dataset"),
        Path("backend/Dataset"),
        Path("backend/dataset"),
        Path(__file__).resolve().parent.parent.parent / "Dataset",
        Path(__file__).resolve().parent.parent.parent / "dataset"
    ]
    for c in candidates:
        if c.exists() and (c / "patients.csv").exists():
            return c.resolve()
    raise FileNotFoundError("Could not find dataset directory containing CSV files.")


def seed_dataset(db: Session, max_rows: int = None) -> Dict[str, int]:
    """
    Seeds database from the synthetic dataset CSVs idempotently.
    """
    dataset_dir = find_dataset_dir()
    print(f"Reading dataset from: {dataset_dir}")

    # 1. Read CSVs
    patients_df = pd.read_csv(dataset_dir / "patients.csv")
    health_records_df = pd.read_csv(dataset_dir / "health_records.csv")
    symptoms_df = pd.read_csv(dataset_dir / "symptom_assessments.csv")
    ai_predictions_df = pd.read_csv(dataset_dir / "ai_predictions.csv")
    decisions_df = pd.read_csv(dataset_dir / "doctor_decisions.csv")

    if max_rows:
        patients_df = patients_df.head(max_rows)

    # 2. Ensure Demo Doctor exists
    demo_doc_email = "doctor.demo@medisense.ai"
    demo_doc_user = db.query(User).filter(User.email == demo_doc_email).first()
    if not demo_doc_user:
        demo_doc_user = User(
            name="Dr. Sarah Chen, MD",
            email=demo_doc_email,
            password_hash=get_password_hash("DemoDoctor123!"),
            role=UserRole.DOCTOR
        )
        db.add(demo_doc_user)
        db.flush()

        demo_doctor = Doctor(
            user_id=demo_doc_user.id,
            specialization="Internal Medicine"
        )
        db.add(demo_doctor)
        db.flush()
    else:
        demo_doctor = demo_doc_user.doctor_profile

    # Prepare maps for quick relational joins
    hr_by_patient = health_records_df.set_index("patient_id").to_dict(orient="index")
    sym_by_patient = symptoms_df.set_index("patient_id").to_dict(orient="index")
    ai_by_patient = ai_predictions_df.set_index("patient_id").to_dict(orient="index")
    dec_by_patient = decisions_df.set_index("patient_id").to_dict(orient="index")

    default_pw_hash = get_password_hash("DemoPatient123!")

    # Check existing patient codes for idempotency
    existing_codes = set(r[0] for r in db.query(Patient.patient_code).all() if r[0])

    counts = {
        "patients_created": 0,
        "patients_skipped": 0,
        "health_records": 0,
        "assessments": 0,
        "ai_predictions": 0,
        "alerts": 0,
        "doctor_decisions": 0
    }

    for _, row in patients_df.iterrows():
        p_code = str(row["patient_id"]).strip()
        if p_code in existing_codes:
            counts["patients_skipped"] += 1
            continue

        email = f"{p_code.lower()}@demo.medisense.ai"
        age = int(row["age"]) if pd.notnull(row.get("age")) else None
        gender = str(row["sex"]) if pd.notnull(row.get("sex")) else None
        city = str(row["city"]) if pd.notnull(row.get("city")) else None

        # Create user
        user = User(
            name=f"Patient {p_code}",
            email=email,
            password_hash=default_pw_hash,
            role=UserRole.PATIENT
        )
        db.add(user)
        db.flush()

        # Create patient
        patient = Patient(
            user_id=user.id,
            patient_code=p_code,
            age=age,
            gender=gender,
            city=city,
            medical_history="No major prior chronic illnesses documented.",
            allergies="None reported",
            medications="None"
        )
        db.add(patient)
        db.flush()
        existing_codes.add(p_code)
        counts["patients_created"] += 1

        # Health Record join
        if p_code in hr_by_patient:
            hr_row = hr_by_patient[p_code]
            h_rec = HealthRecord(
                patient_id=patient.id,
                height_cm=float(hr_row["height_cm"]) if pd.notnull(hr_row.get("height_cm")) else None,
                weight_kg=float(hr_row["weight_kg"]) if pd.notnull(hr_row.get("weight_kg")) else None,
                heart_rate_bpm=int(hr_row["heart_rate_bpm"]) if pd.notnull(hr_row.get("heart_rate_bpm")) else None,
                systolic_bp=int(hr_row["systolic_bp"]) if pd.notnull(hr_row.get("systolic_bp")) else None,
                diastolic_bp=int(hr_row["diastolic_bp"]) if pd.notnull(hr_row.get("diastolic_bp")) else None,
                temperature=float(hr_row["temperature_c"]) if pd.notnull(hr_row.get("temperature_c")) else None,
                spo2_percent=float(hr_row["spo2_percent"]) if pd.notnull(hr_row.get("spo2_percent")) else None,
                symptoms=[],
                notes="Seeded baseline physiological measurements."
            )
            db.add(h_rec)
            counts["health_records"] += 1

        # Symptom Assessment join
        assessment = None
        if p_code in sym_by_patient:
            sym_row = sym_by_patient[p_code]
            # Convert 25 one-hot symptoms into list
            symptoms_list = [
                col for col in SYMPTOM_COLUMNS
                if col in sym_row and int(sym_row[col]) == 1
            ]

            duration = int(sym_row["symptom_duration_days"]) if pd.notnull(sym_row.get("symptom_duration_days")) else 3
            severity = int(sym_row["symptom_severity_1_to_5"]) if pd.notnull(sym_row.get("symptom_severity_1_to_5")) else 2

            assessment = SymptomAssessment(
                patient_id=patient.id,
                symptoms=symptoms_list,
                duration_days=duration,
                severity_1_to_5=severity,
                additional_information="Seeded initial clinical consultation report."
            )
            db.add(assessment)
            db.flush()
            counts["assessments"] += 1

        # AI Prediction join
        if assessment and p_code in ai_by_patient:
            ai_row = ai_by_patient[p_code]
            raw_urgency = str(ai_row.get("urgency_label_demo", "")).strip().lower()
            risk_enum = URGENCY_MAP.get(raw_urgency, RiskLevel.LOW)
            condition = str(ai_row.get("probable_condition_label", "Undetermined"))
            confidence = float(ai_row.get("confidence_demo", 0.75)) if pd.notnull(ai_row.get("confidence_demo")) else 0.75
            explanation = str(ai_row.get("explanation_demo", "AI prediction generated based on clinical symptom correlations."))
            model_name = str(ai_row.get("model_name", "medisense-hybrid-v1"))

            prediction = AIPrediction(
                assessment_id=assessment.id,
                condition=condition,
                probability=round(confidence, 2),
                risk_level=risk_enum,
                explanation=explanation,
                missing_information=["vital_signs_trend", "recent_travel_history"],
                similar_cases=[f"CASE-SYNTH-{p_code}"],
                recommendation="Review clinical symptoms and maintain fluid hydration. Seek clinical follow up as advised.",
                model_name=model_name
            )
            db.add(prediction)
            counts["ai_predictions"] += 1

            if risk_enum == RiskLevel.HIGH:
                alert = Alert(
                    assessment_id=assessment.id,
                    alert_level="HIGH",
                    message=f"Urgent review flagged for patient {p_code}: {condition}."
                )
                db.add(alert)
                counts["alerts"] += 1

        # Doctor Decision join
        if assessment and p_code in dec_by_patient:
            dec_row = dec_by_patient[p_code]
            raw_dec = str(dec_row.get("doctor_decision", "")).strip().lower()
            decision_enum = DECISION_MAP.get(raw_dec, DecisionEnum.PENDING)
            note = str(dec_row.get("decision_note", "")) if pd.notnull(dec_row.get("decision_note")) else None

            doc_decision = DoctorDecision(
                doctor_id=demo_doctor.id,
                assessment_id=assessment.id,
                decision=decision_enum,
                reason=note
            )
            db.add(doc_decision)
            counts["doctor_decisions"] += 1

    db.commit()
    return counts
