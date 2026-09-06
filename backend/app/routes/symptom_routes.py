from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.symptom_assessment import SymptomAssessment
from app.models.ai_prediction import AIPrediction, RiskLevel
from app.models.alert import Alert
from app.schemas.symptom_schema import (
    SymptomAnalyzeRequest,
    SymptomAnalyzeResponse,
    SymptomHistoryResponse,
    AIAnalysisResult,
    ProbableCondition,
    SimilarCaseItem,
    SymptomAssessmentHistoryItem,
    DecisionSummary,
    KNOWN_SYMPTOMS
)
from app.services.ai_client import call_ai_service
from app.utils.jwt_handler import get_current_user
from app.utils.response_wrapper import success_response

router = APIRouter(prefix="/symptoms", tags=["Symptoms & AI Assessment"])


@router.post(
    "/analyze",
    response_model=SymptomAnalyzeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit symptoms for AI clinical decision support analysis",
    description="Validates symptoms, records the assessment, queries the AI engine (or fallback stub), stores predictions and alerts, and returns clinical support insights."
)
def analyze_symptoms(
    req: SymptomAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Determine target patient
    target_patient_id = None
    if current_user.role == UserRole.PATIENT:
        if not current_user.patient_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Patient profile not found for the current user"
            )
        target_patient_id = current_user.patient_profile.id
    elif current_user.role == UserRole.DOCTOR:
        if not req.patient_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="patient_id is required when submitting assessment as a doctor"
            )
        patient = db.query(Patient).filter(Patient.id == req.patient_id).first()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID {req.patient_id} not found"
            )
        target_patient_id = req.patient_id

    # 2. Input validation
    clean_symptoms = [s.strip().lower() for s in req.symptoms if s.strip()]
    if not clean_symptoms:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Symptoms list cannot be empty"
        )

    # 3. Store assessment row in symptom_assessments
    assessment = SymptomAssessment(
        patient_id=target_patient_id,
        symptoms=clean_symptoms,
        duration_days=req.duration_days,
        severity_1_to_5=req.severity_1_to_5,
        additional_information=req.additional_information
    )
    db.add(assessment)
    db.flush()

    # 4. Call AI service
    ai_raw = call_ai_service(
        symptoms=clean_symptoms,
        temperature=req.temperature,
        duration_days=req.duration_days,
        severity=req.severity_1_to_5,
        additional_information=req.additional_information
    )

    risk_str = str(ai_raw.get("risk_level", "low")).upper()
    risk_level_enum = getattr(RiskLevel, risk_str, RiskLevel.LOW)

    # Extract primary condition & probability for AIPrediction table
    probable_conds = ai_raw.get("probable_conditions", [])
    primary_condition = probable_conds[0].get("condition") if probable_conds else "General Assessment"
    primary_prob = probable_conds[0].get("probability", 0.5) if probable_conds else 0.5

    # 5. Store AI prediction row in ai_predictions
    prediction = AIPrediction(
        assessment_id=assessment.id,
        condition=primary_condition,
        probability=float(primary_prob),
        risk_level=risk_level_enum,
        explanation=ai_raw.get("explanation", ""),
        missing_information=ai_raw.get("missing_information", []),
        similar_cases=ai_raw.get("similar_cases", []),
        recommendation=ai_raw.get("recommendation", ""),
        model_name=ai_raw.get("model_name", "medisense-hybrid-v1")
    )
    db.add(prediction)

    # If HIGH risk, create an alert
    if risk_level_enum == RiskLevel.HIGH:
        alert = Alert(
            assessment_id=assessment.id,
            alert_level="HIGH",
            message=f"High risk assessment triggered for symptoms: {', '.join(clean_symptoms)}"
        )
        db.add(alert)

    db.commit()
    db.refresh(assessment)
    db.refresh(prediction)

    # 6. Format response conforming to AI Output Contract
    probable_condition_objs = [
        ProbableCondition(condition=c.get("condition", ""), probability=float(c.get("probability", 0.0)))
        for c in probable_conds
    ]

    result_data = AIAnalysisResult(
        assessment_id=assessment.id,
        risk_level=risk_level_enum.value.lower(),
        probable_conditions=probable_condition_objs,
        explanation=prediction.explanation or "",
        missing_information=prediction.missing_information or [],
        similar_cases=prediction.similar_cases or [],
        recommendation=prediction.recommendation or "",
        model_name=prediction.model_name or "medisense-hybrid-v1"
    )

    return success_response(data=result_data.model_dump(), message="Symptom analysis completed successfully")


@router.get(
    "/history/{patient_id}",
    response_model=SymptomHistoryResponse,
    summary="Get patient symptom assessment history",
    description="Returns all previous symptom assessments and AI predictions for the patient, ordered with most recent first."
)
def get_symptom_history(
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
                detail="You are not authorized to view this patient history"
            )

    assessments = db.query(SymptomAssessment).filter(
        SymptomAssessment.patient_id == patient_id
    ).order_by(SymptomAssessment.id.desc()).all()

    history_items = []
    for a in assessments:
        pred_obj = None
        if a.ai_prediction:
            p = a.ai_prediction
            prob_conds = []
            if p.condition:
                prob_conds.append(ProbableCondition(condition=p.condition, probability=p.probability or 0.0))

            pred_obj = AIAnalysisResult(
                assessment_id=a.id,
                risk_level=p.risk_level.value.lower() if hasattr(p.risk_level, 'value') else str(p.risk_level).lower(),
                probable_conditions=prob_conds,
                explanation=p.explanation or "",
                missing_information=p.missing_information or [],
                similar_cases=p.similar_cases or [],
                recommendation=p.recommendation or "",
                model_name=p.model_name or "medisense-hybrid-v1"
            )

        dec_obj = None
        if a.doctor_decision:
            dec_obj = DecisionSummary(
                decision=a.doctor_decision.decision.value if hasattr(a.doctor_decision.decision, 'value') else str(a.doctor_decision.decision),
                reason=a.doctor_decision.reason,
                created_at=a.doctor_decision.created_at
            )

        history_items.append(SymptomAssessmentHistoryItem(
            id=a.id,
            patient_id=a.patient_id,
            symptoms=a.symptoms or [],
            duration_days=a.duration_days,
            severity_1_to_5=a.severity_1_to_5,
            additional_information=a.additional_information,
            created_at=a.created_at,
            prediction=pred_obj,
            doctor_decision=dec_obj
        ))

    return success_response(
        data=[item.model_dump() for item in history_items],
        message="Symptom assessment history retrieved successfully"
    )
