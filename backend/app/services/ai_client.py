from typing import List, Dict, Any, Optional

from ai.prediction.predict import analyze_patient


def call_ai_service(
    symptoms: List[str],
    temperature: Optional[float] = None,
    duration_days: Optional[int] = None,
    severity: Optional[int] = None,
    additional_information: Optional[str] = None,
    age: Optional[int] = 30,
    sex: Optional[str] = "Female",
) -> Dict[str, Any]:
    """
    Run the MediSense ML decision-support pipeline and adapt its
    output to the backend AI response contract.

    This is a synthetic-data software demonstration and is not
    a medical diagnosis or emergency triage system.
    """

    clean_symptoms = [
        s.strip().lower().replace(" ", "_")
        for s in symptoms
        if s.strip()
    ]

    # Build the feature set expected by the trained Random Forest model.
    patient_data = {
        "age": age if age is not None else 30,
        "sex": sex if sex else "Female",
        "symptom_duration_days": (
            duration_days if duration_days is not None else 1
        ),
        "symptom_severity_1_to_5": (
            severity if severity is not None else 2
        ),
    }

    # Initialize all symptom features to 0.
    known_features = [
        "abdominal_pain",
        "body_ache",
        "chest_discomfort",
        "chest_tightness",
        "cough",
        "diarrhea",
        "dizziness",
        "fatigue",
        "fever",
        "frequent_urination",
        "headache",
        "heartburn",
        "increased_thirst",
        "itchy_eyes",
        "light_sensitivity",
        "lower_abdominal_pain",
        "nasal_congestion",
        "nausea",
        "painful_urination",
        "runny_nose",
        "shortness_of_breath",
        "sneezing",
        "sore_throat",
        "vomiting",
        "wheezing",
    ]

    for feature in known_features:
        patient_data[feature] = 1 if feature in clean_symptoms else 0

    # Run the actual Random Forest + Safety Engine + Explanation Layer.
    result = analyze_patient(patient_data)

    # Convert the AI pipeline output to the backend API contract.
    probable_conditions = []

    for item in result.get("top_3_predictions", []):
        probable_conditions.append(
            {
                "condition": item["condition"],
                "probability": float(item["model_score"]),
            }
        )

    # Map safety urgency to backend risk levels.
    urgency = result.get("urgency_level", "routine_review")

    if urgency == "urgent_review":
        risk_level = "high"
    elif urgency == "priority_review":
        risk_level = "moderate"
    else:
        risk_level = "low"

    recommendation = result.get(
        "action",
        "Clinical review recommended based on the decision-support output.",
    )

    if additional_information:
        explanation = (
            f"{result.get('explanation', '')} "
            f"Additional information provided: {additional_information}"
        ).strip()
    else:
        explanation = result.get("explanation", "")

    similar_cases = [
        {
            "case_id": f"CASE-SYNTH-{index + 1}",
            "similarity": 0.0,
            "summary": "Synthetic decision-support reference.",
        }
        for index, _ in enumerate(
            result.get("top_3_predictions", [])[:1]
        )
    ]

    return {
        "risk_level": risk_level,
        "probable_conditions": probable_conditions,
        "explanation": explanation,
        "missing_information": result.get(
            "missing_information", []
        ),
        "similar_cases": similar_cases,
        "recommendation": recommendation,
        "model_name": "medisense-random-forest-v1",
    }
