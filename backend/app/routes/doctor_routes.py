from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.symptom_assessment import SymptomAssessment
from app.models.ai_prediction import AIPrediction, RiskLevel
from app.models.doctor_decision import DoctorDecision, DecisionEnum
from app.models.health_record import HealthRecord
from app.models.alert import Alert
from app.schemas.doctor_schema import (
    CaseListItem,
    CaseListResponse,
    CaseDetailData,
    CaseDetailResponse,
    DoctorDecisionRequest,
    DoctorDecisionResponse,
    DoctorDecisionData
)
from app.schemas.patient_schema import PatientResponseData
from app.schemas.health_record_schema import HealthRecordData
from app.schemas.symptom_schema import (
    AIAnalysisResult,
    ProbableCondition,
    DecisionSummary
)
from app.routes.health_record_routes import compute_bmi
from app.utils.jwt_handler import require_role
from app.utils.response_wrapper import success_response

router = APIRouter(prefix="/doctor", tags=["Doctor & Clinical Decision Support"])


@router.get(
    "/cases",
    response_model=CaseListResponse,
    summary="Get patient clinical cases triage list",
    description="Returns all patient assessments with AI predictions and triage priorities. Supports filtering by priority (?priority=high|moderate|low). Doctor access only."
)
def get_doctor_cases(
    priority: Optional[str] = Query(None, description="Filter by risk priority: high | moderate | low"),
    current_user: User = Depends(require_role("doctor")),
    db: Session = Depends(get_db)
):
    query = db.query(SymptomAssessment)

    if priority:
        priority_upper = priority.strip().upper()
        if priority_upper in RiskLevel.__members__:
            query = query.join(AIPrediction).filter(AIPrediction.risk_level == RiskLevel[priority_upper])

    assessments = query.order_by(SymptomAssessment.id.desc()).all()

    case_items = []
    for a in assessments:
        p = a.patient
        user = p.user if p else None
        pred = a.ai_prediction
        dec = a.doctor_decision

        risk_val = pred.risk_level.value.lower() if pred and hasattr(pred.risk_level, 'value') else "low"
        
        # Calculate summary
        if pred and pred.condition:
            prob_percent = int((pred.probability or 0.5) * 100)
            ai_summary = f"{pred.condition} ({prob_percent}% probability)"
        elif pred and pred.explanation:
            ai_summary = pred.explanation[:80] + "..."
        else:
            ai_summary = "AI prediction pending"

        # Determine decision status
        if dec:
            case_status = dec.decision.value if hasattr(dec.decision, 'value') else str(dec.decision)
        else:
            case_status = "pending"

        case_items.append(CaseListItem(
            case_id=a.id,
            patient_id=a.patient_id,
            patient_code=p.patient_code if p else None,
            patient_name=user.name if user else "Unknown Patient",
            age=p.age if p else None,
            gender=p.gender if p else None,
            symptoms=a.symptoms or [],
            priority=risk_val,
            assessment_date=a.created_at,
            ai_summary=ai_summary,
            case_status=case_status
        ))

    return success_response(
        data=[item.model_dump() for item in case_items],
        message="Doctor cases retrieved successfully"
    )


@router.get(
    "/cases/{case_id}",
    response_model=CaseDetailResponse,
    summary="Get complete case details for clinical review",
    description="Returns full clinical case details including patient profile, latest vitals, AI reasoning, missing info, and doctor decision in a single comprehensive payload."
)
def get_case_detail(
    case_id: int,
    current_user: User = Depends(require_role("doctor")),
    db: Session = Depends(get_db)
):
    assessment = db.query(SymptomAssessment).filter(SymptomAssessment.id == case_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case assessment with ID {case_id} not found"
        )

    patient = assessment.patient
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile linked to case not found"
        )

    user = patient.user

    # Patient profile schema
    patient_data = PatientResponseData(
        id=patient.id,
        user_id=patient.user_id,
        patient_code=patient.patient_code,
        name=user.name if user else "",
        email=user.email if user else "",
        age=patient.age,
        gender=patient.gender,
        city=patient.city,
        medical_history=patient.medical_history,
        allergies=patient.allergies,
        medications=patient.medications
    )

    # Latest Vitals
    latest_hr = db.query(HealthRecord).filter(
        HealthRecord.patient_id == patient.id
    ).order_by(HealthRecord.recorded_at.desc(), HealthRecord.id.desc()).first()

    latest_vitals_data = None
    if latest_hr:
        bmi = compute_bmi(latest_hr.height_cm, latest_hr.weight_kg)
        latest_vitals_data = HealthRecordData(
            id=latest_hr.id,
            patient_id=latest_hr.patient_id,
            height_cm=latest_hr.height_cm,
            weight_kg=latest_hr.weight_kg,
            heart_rate_bpm=latest_hr.heart_rate_bpm,
            systolic_bp=latest_hr.systolic_bp,
            diastolic_bp=latest_hr.diastolic_bp,
            temperature=latest_hr.temperature,
            spo2_percent=latest_hr.spo2_percent,
            bmi=bmi,
            symptoms=latest_hr.symptoms or [],
            notes=latest_hr.notes,
            recorded_at=latest_hr.recorded_at,
            date=latest_hr.recorded_at.isoformat() if latest_hr.recorded_at else ""
        )

    # AI Prediction data
    pred = assessment.ai_prediction
    ai_pred_data = None
    priority = "low"
    if pred:
        priority = pred.risk_level.value.lower() if hasattr(pred.risk_level, 'value') else str(pred.risk_level).lower()
        prob_conds = []
        if pred.condition:
            prob_conds.append(ProbableCondition(condition=pred.condition, probability=pred.probability or 0.0))

        ai_pred_data = AIAnalysisResult(
            assessment_id=assessment.id,
            risk_level=priority,
            probable_conditions=prob_conds,
            explanation=pred.explanation or "",
            missing_information=pred.missing_information or [],
            similar_cases=pred.similar_cases or [],
            recommendation=pred.recommendation or "",
            model_name=pred.model_name or "medisense-hybrid-v1"
        )

    # Alerts
    alerts = [a.message for a in assessment.alerts]

    # Doctor Decision
    dec = assessment.doctor_decision
    dec_status = "pending"
    dec_data = None
    if dec:
        dec_status = dec.decision.value if hasattr(dec.decision, 'value') else str(dec.decision)
        dec_data = DecisionSummary(
            decision=dec_status,
            reason=dec.reason,
            created_at=dec.created_at
        )

    detail_data = CaseDetailData(
        case_id=assessment.id,
        assessment_date=assessment.created_at,
        symptoms=assessment.symptoms or [],
        duration_days=assessment.duration_days,
        severity_1_to_5=assessment.severity_1_to_5,
        additional_information=assessment.additional_information,
        priority=priority,
        patient=patient_data,
        latest_vitals=latest_vitals_data,
        ai_prediction=ai_pred_data,
        alerts=alerts,
        case_status=dec_status,
        doctor_decision=dec_data
    )

    return success_response(data=detail_data.model_dump(), message="Case details retrieved successfully")


@router.post(
    "/decision",
    response_model=DoctorDecisionResponse,
    status_code=status.HTTP_200_OK,
    summary="Record or update doctor clinical decision",
    description="Allows a clinician to accept or override an AI recommendation for an assessment case. If decision is 'overridden', reason is required."
)
def submit_doctor_decision(
    req: DoctorDecisionRequest,
    current_user: User = Depends(require_role("doctor")),
    db: Session = Depends(get_db)
):
    if not current_user.doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor profile not found for current user"
        )

    # Validate decision value
    if req.decision not in ["accepted", "overridden"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Decision must be either 'accepted' or 'overridden'"
        )

    # Validate reason on override
    if req.decision == "overridden" and (not req.reason or not req.reason.strip()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A clinical reason is strictly required when overriding an AI recommendation"
        )

    # Check assessment exists
    assessment = db.query(SymptomAssessment).filter(SymptomAssessment.id == req.assessment_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case assessment with ID {req.assessment_id} not found"
        )

    decision_enum = DecisionEnum.ACCEPTED if req.decision == "accepted" else DecisionEnum.OVERRIDDEN

    # Check for existing decision (upsert logic)
    existing_decision = db.query(DoctorDecision).filter(
        DoctorDecision.assessment_id == req.assessment_id
    ).first()

    if existing_decision:
        existing_decision.doctor_id = current_user.doctor_profile.id
        existing_decision.decision = decision_enum
        existing_decision.reason = req.reason.strip() if req.reason else None
        db.commit()
        db.refresh(existing_decision)
        target_decision = existing_decision
    else:
        new_decision = DoctorDecision(
            doctor_id=current_user.doctor_profile.id,
            assessment_id=req.assessment_id,
            decision=decision_enum,
            reason=req.reason.strip() if req.reason else None
        )
        db.add(new_decision)
        db.commit()
        db.refresh(new_decision)
        target_decision = new_decision

    data = DoctorDecisionData(
        id=target_decision.id,
        doctor_id=target_decision.doctor_id,
        doctor_name=current_user.name,
        assessment_id=target_decision.assessment_id,
        decision=target_decision.decision.value if hasattr(target_decision.decision, 'value') else str(target_decision.decision),
        reason=target_decision.reason,
        created_at=target_decision.created_at
    )

    return success_response(data=data.model_dump(), message="Doctor clinical decision recorded successfully")
