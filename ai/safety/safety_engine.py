# ai/safety/safety_engine.py

"""
MediSense AI - Safety Signal Engine

Purpose:
    Detect predefined safety-related symptom signals and generate
    a deterministic decision-support priority level.

IMPORTANT:
    This is a software demonstration layer.
    It is NOT a medical diagnosis, emergency triage system,
    or substitute for professional medical care.
"""


# ============================================================
# 1. SAFETY SIGNAL DEFINITIONS
# ============================================================

HIGH_PRIORITY_SYMPTOMS = {
    "shortness_of_breath",
    "chest_discomfort",
}

PRIORITY_SYMPTOMS = {
    "chest_tightness",
    "wheezing",
}


# ============================================================
# 2. SAFETY ENGINE
# ============================================================

def evaluate_safety(patient_data):
    """
    Evaluate predefined safety signals.

    Parameters
    ----------
    patient_data : dict
        Patient symptoms represented as 0/1 values.

    Returns
    -------
    dict
        Structured safety decision-support output.
    """

    triggered_high_priority = []
    triggered_priority = []

    # --------------------------------------------------------
    # Check high-priority signals
    # --------------------------------------------------------

    for symptom in HIGH_PRIORITY_SYMPTOMS:

        if patient_data.get(symptom, 0) == 1:
            triggered_high_priority.append(symptom)

    # --------------------------------------------------------
    # Check priority signals
    # --------------------------------------------------------

    for symptom in PRIORITY_SYMPTOMS:

        if patient_data.get(symptom, 0) == 1:
            triggered_priority.append(symptom)

    # --------------------------------------------------------
    # Determine priority level
    # --------------------------------------------------------

    if triggered_high_priority:

        urgency_level = "urgent_review"

        action = (
            "Immediate professional medical evaluation may be "
            "appropriate based on the detected safety signals."
        )

    elif triggered_priority:

        urgency_level = "priority_review"

        action = (
            "Prompt clinician review is recommended based on "
            "the detected safety signals."
        )

    else:

        urgency_level = "routine_review"

        action = (
            "No predefined high-priority safety signal was detected. "
            "Continue with normal clinical review."
        )

    # --------------------------------------------------------
    # Return structured result
    # --------------------------------------------------------

    return {
        "urgency_level": urgency_level,
        "triggered_high_priority_signals": triggered_high_priority,
        "triggered_priority_signals": triggered_priority,
        "action": action,
        "note": (
            "Safety signal output for software demonstration only; "
            "not a medical diagnosis or emergency triage decision."
        ),
    }


# ============================================================
# 3. TEST THE SAFETY ENGINE
# ============================================================

if __name__ == "__main__":

    sample_patient = {
        "shortness_of_breath": 1,
        "chest_discomfort": 0,
        "chest_tightness": 0,
        "wheezing": 0,
    }

    result = evaluate_safety(sample_patient)

    print("\n" + "=" * 60)
    print("MEDISENSE AI — SAFETY SIGNAL ENGINE")
    print("=" * 60)

    print("\nUrgency level:")
    print(result["urgency_level"])

    print("\nHigh-priority signals:")
    print(result["triggered_high_priority_signals"])

    print("\nPriority signals:")
    print(result["triggered_priority_signals"])

    print("\nAction:")
    print(result["action"])

    print("\nNote:")
    print(result["note"])