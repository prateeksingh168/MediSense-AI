# ai/explanation/explanation.py

"""
MediSense AI - Explanation Layer

Purpose:
    Convert the ML prediction into a simple, structured explanation.

IMPORTANT:
    This is an explainability/demo layer.
    It does not provide a medical diagnosis or treatment advice.
"""


# ============================================================
# 1. HUMAN-READABLE SYMPTOM NAMES
# ============================================================

SYMPTOM_NAMES = {
    "abdominal_pain": "Abdominal pain",
    "body_ache": "Body ache",
    "chest_discomfort": "Chest discomfort",
    "chest_tightness": "Chest tightness",
    "cough": "Cough",
    "diarrhea": "Diarrhea",
    "dizziness": "Dizziness",
    "fatigue": "Fatigue",
    "fever": "Fever",
    "frequent_urination": "Frequent urination",
    "headache": "Headache",
    "heartburn": "Heartburn",
    "increased_thirst": "Increased thirst",
    "itchy_eyes": "Itchy eyes",
    "light_sensitivity": "Light sensitivity",
    "lower_abdominal_pain": "Lower abdominal pain",
    "nasal_congestion": "Nasal congestion",
    "nausea": "Nausea",
    "painful_urination": "Painful urination",
    "runny_nose": "Runny nose",
    "shortness_of_breath": "Shortness of breath",
    "sneezing": "Sneezing",
    "sore_throat": "Sore throat",
    "vomiting": "Vomiting",
    "wheezing": "Wheezing",
}


# ============================================================
# 2. CONDITION → EXPECTED SYMPTOM PATTERNS
# ============================================================

CONDITION_SYMPTOMS = {
    "Common Cold": [
        "cough",
        "runny_nose",
        "sore_throat",
        "fatigue",
    ],

    "Seasonal Allergy": [
        "sneezing",
        "runny_nose",
        "itchy_eyes",
        "nasal_congestion",
    ],

    "Migraine": [
        "headache",
        "nausea",
        "light_sensitivity",
        "fatigue",
    ],

    "Gastroenteritis": [
        "abdominal_pain",
        "nausea",
        "vomiting",
        "diarrhea",
    ],

    "Urinary Tract Infection": [
        "painful_urination",
        "frequent_urination",
        "lower_abdominal_pain",
    ],

    "Asthma Exacerbation": [
        "cough",
        "wheezing",
        "shortness_of_breath",
        "chest_tightness",
    ],

    "Viral Fever": [
        "fever",
        "fatigue",
        "body_ache",
        "headache",
    ],

    "Hypertension": [
        "headache",
        "dizziness",
        "fatigue",
    ],

    "Type 2 Diabetes": [
        "increased_thirst",
        "frequent_urination",
        "fatigue",
    ],

    "Acid Reflux": [
        "heartburn",
        "chest_discomfort",
        "nausea",
        "cough",
    ],
}


# ============================================================
# 3. MISSING INFORMATION DEFINITIONS
# ============================================================

COMMON_MISSING_INFORMATION = [
    "Relevant medical history",
    "Current medications",
    "Known allergies",
]


# ============================================================
# 4. EXPLANATION FUNCTION
# ============================================================

def generate_explanation(
    patient_data,
    predicted_condition,
    model_score,
):
    """
    Generate a structured explanation for the ML prediction.

    Parameters
    ----------
    patient_data : dict
        Patient input data.

    predicted_condition : str
        Condition predicted by the ML model.

    model_score : float
        Model score for the predicted class.

    Returns
    -------
    dict
        Explanation and supporting information.
    """

    expected_symptoms = CONDITION_SYMPTOMS.get(
        predicted_condition,
        [],
    )

    supporting_symptoms = []

    for symptom in expected_symptoms:

        if patient_data.get(symptom, 0) == 1:

            supporting_symptoms.append(
                SYMPTOM_NAMES.get(
                    symptom,
                    symptom.replace("_", " ").title(),
                )
            )

    # --------------------------------------------------------
    # Generate explanation text
    # --------------------------------------------------------

    if supporting_symptoms:

        explanation = (
            "The model prediction is supported by the reported "
            "symptom pattern, including: "
            + ", ".join(supporting_symptoms)
            + "."
        )

    else:

        explanation = (
            "The model generated this prediction from the "
            "overall input pattern. No predefined supporting "
            "symptom was identified by the explanation layer."
        )

    # --------------------------------------------------------
    # Model score interpretation
    # --------------------------------------------------------

    score_note = (
        f"The model score for the predicted class is "
        f"{model_score:.2f}. This score is a model output and "
        f"should not be interpreted as a clinical probability."
    )

    # --------------------------------------------------------
    # Return structured explanation
    # --------------------------------------------------------

    return {
        "explanation": explanation,

        "supporting_symptoms": supporting_symptoms,

        "missing_information": COMMON_MISSING_INFORMATION,

        "model_score_note": score_note,

        "note": (
            "Explanation generated for software demonstration "
            "only. Clinical interpretation requires qualified "
            "professional review."
        ),
    }


# ============================================================
# 5. TEST THE EXPLANATION LAYER
# ============================================================

if __name__ == "__main__":

    sample_patient = {
        "cough": 1,
        "runny_nose": 1,
        "sore_throat": 1,
        "fatigue": 1,
    }

    result = generate_explanation(
        patient_data=sample_patient,
        predicted_condition="Common Cold",
        model_score=1.0,
    )

    print("\n" + "=" * 60)
    print("MEDISENSE AI — EXPLANATION LAYER")
    print("=" * 60)

    print("\nExplanation:")
    print(result["explanation"])

    print("\nSupporting symptoms:")
    for symptom in result["supporting_symptoms"]:
        print(f"- {symptom}")

    print("\nMissing information:")
    for item in result["missing_information"]:
        print(f"- {item}")

    print("\nModel score note:")
    print(result["model_score_note"])

    print("\nNote:")
    print(result["note"])