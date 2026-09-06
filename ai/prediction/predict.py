# ai/prediction/predict.py

"""
MediSense AI - Complete Prediction Service

Combines:
1. ML probable-condition prediction
2. Safety signal evaluation
3. Explainability layer

IMPORTANT:
This is a synthetic-data software demonstration.
It is NOT a medical diagnosis or emergency triage system.
"""

import joblib
import pandas as pd

from pathlib import Path

from ai.safety.safety_engine import evaluate_safety
from ai.explanation.explanation import generate_explanation


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    BASE_DIR
    / "ai"
    / "models"
    / "saved"
    / "medisense_condition_model.joblib"
)


# ============================================================
# 2. LOAD TRAINED MODEL
# ============================================================

model = joblib.load(MODEL_PATH)


# ============================================================
# 3. COMPLETE AI ANALYSIS
# ============================================================

def analyze_patient(patient_data):
    """
    Run the complete MediSense AI analysis.

    Parameters
    ----------
    patient_data : dict
        Patient information and symptom values.

    Returns
    -------
    dict
        Combined ML prediction, safety evaluation,
        and explanation.
    """

    # ========================================================
    # A. ML PREDICTION
    # ========================================================

    input_df = pd.DataFrame([patient_data])

    predicted_condition = model.predict(input_df)[0]

    probabilities = model.predict_proba(input_df)[0]

    classes = model.classes_

    ranked_predictions = sorted(
        zip(classes, probabilities),
        key=lambda x: x[1],
        reverse=True,
    )

    top_3_predictions = [
        {
            "condition": condition,
            "model_score": round(float(score), 4),
        }
        for condition, score in ranked_predictions[:3]
    ]

    model_score = round(
        float(ranked_predictions[0][1]),
        4,
    )


    # ========================================================
    # B. SAFETY ENGINE
    # ========================================================

    safety_result = evaluate_safety(patient_data)


    # ========================================================
    # C. EXPLANATION LAYER
    # ========================================================

    explanation_result = generate_explanation(
        patient_data=patient_data,
        predicted_condition=predicted_condition,
        model_score=model_score,
    )


    # ========================================================
    # D. COMBINE ALL RESULTS
    # ========================================================

    result = {

        # -------------------------------
        # ML Prediction
        # -------------------------------

        "probable_condition": predicted_condition,

        "model_score": model_score,

        "top_3_predictions": top_3_predictions,


        # -------------------------------
        # Safety
        # -------------------------------

        "urgency_level": safety_result[
            "urgency_level"
        ],

        "triggered_high_priority_signals": safety_result[
            "triggered_high_priority_signals"
        ],

        "triggered_priority_signals": safety_result[
            "triggered_priority_signals"
        ],

        "action": safety_result["action"],


        # -------------------------------
        # Explanation
        # -------------------------------

        "explanation": explanation_result[
            "explanation"
        ],

        "supporting_symptoms": explanation_result[
            "supporting_symptoms"
        ],

        "missing_information": explanation_result[
            "missing_information"
        ],

        "model_score_note": explanation_result[
            "model_score_note"
        ],


        # -------------------------------
        # Safety / Disclaimer
        # -------------------------------

        "note": (
            "Synthetic-data decision-support output only; "
            "not a medical diagnosis or emergency triage "
            "decision."
        ),
    }

    return result


# ============================================================
# 4. TEST COMPLETE PIPELINE
# ============================================================

if __name__ == "__main__":

    sample_patient = {

        "age": 30,

        "sex": "Female",

        "symptom_duration_days": 3,

        "symptom_severity_1_to_5": 3,


        "abdominal_pain": 0,

        "body_ache": 0,

        "chest_discomfort": 0,

        "chest_tightness": 0,

        "cough": 1,

        "diarrhea": 0,

        "dizziness": 0,

        "fatigue": 1,

        "fever": 0,

        "frequent_urination": 0,

        "headache": 0,

        "heartburn": 0,

        "increased_thirst": 0,

        "itchy_eyes": 0,

        "light_sensitivity": 0,

        "lower_abdominal_pain": 0,

        "nasal_congestion": 0,

        "nausea": 0,

        "painful_urination": 0,

        "runny_nose": 1,

        "shortness_of_breath": 0,

        "sneezing": 0,

        "sore_throat": 1,

        "vomiting": 0,

        "wheezing": 0,
    }


    # Run complete analysis

    result = analyze_patient(sample_patient)


    # ========================================================
    # PRINT RESULT
    # ========================================================

    print("\n" + "=" * 60)

    print("MEDISENSE AI — COMPLETE ANALYSIS")

    print("=" * 60)


    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    print("\nProbable condition:")

    print(
        result["probable_condition"]
    )


    print("\nModel score:")

    print(
        result["model_score"]
    )


    # --------------------------------------------------------
    # Top 3
    # --------------------------------------------------------

    print("\nTop 3 predictions:")

    for index, prediction in enumerate(
        result["top_3_predictions"],
        start=1,
    ):

        print(
            f"{index}. "
            f"{prediction['condition']} "
            f"({prediction['model_score']})"
        )


    # --------------------------------------------------------
    # Safety
    # --------------------------------------------------------

    print("\nUrgency level:")

    print(
        result["urgency_level"]
    )


    print("\nHigh-priority safety signals:")

    print(
        result[
            "triggered_high_priority_signals"
        ]
    )


    print("\nPriority safety signals:")

    print(
        result[
            "triggered_priority_signals"
        ]
    )


    print("\nAction:")

    print(
        result["action"]
    )


    # --------------------------------------------------------
    # Explanation
    # --------------------------------------------------------

    print("\nExplanation:")

    print(
        result["explanation"]
    )


    print("\nSupporting symptoms:")

    for symptom in result[
        "supporting_symptoms"
    ]:

        print(f"- {symptom}")


    print("\nMissing information:")

    for item in result[
        "missing_information"
    ]:

        print(f"- {item}")


    print("\nModel score note:")

    print(
        result["model_score_note"]
    )


    # --------------------------------------------------------
    # Note
    # --------------------------------------------------------

    print("\nNote:")

    print(
        result["note"]
    )