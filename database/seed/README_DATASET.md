# MediSense AI — Synthetic Demo Dataset

This dataset is **100% synthetic** and is intended only for development, testing,
machine-learning demonstrations, dashboards, API integration, and hackathon demos.

## Files
- `patients.csv` — synthetic patient master data
- `health_records.csv` — synthetic vitals/health-record data
- `symptom_assessments.csv` — symptoms + synthetic target labels
- `ai_predictions.csv` — synthetic AI output fields for integration testing
- `doctor_decisions.csv` — synthetic doctor accept/override/pending decisions
- `data_dictionary.csv` — column descriptions

## Important safety note
The condition labels, confidence values, and urgency labels are **synthetic demo labels**.
They are NOT medically validated and must not be used for real diagnosis, treatment,
triage, or patient care.

For the MediSense AI project, AI should be presented as decision support:
**AI Assists. Doctors Decide.**

Do not upload real patient/PHI data to the repository.
