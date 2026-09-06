SELECT 'patients' AS table_name, COUNT(*) AS row_count FROM patients
UNION ALL
SELECT 'health_records', COUNT(*) FROM health_records
UNION ALL
SELECT 'symptom_assessments', COUNT(*) FROM symptom_assessments
UNION ALL
SELECT 'ai_predictions', COUNT(*) FROM ai_predictions
UNION ALL
SELECT 'doctor_decisions', COUNT(*) FROM doctor_decisions
UNION ALL
SELECT 'alerts', COUNT(*) FROM alerts;

SELECT COUNT(*) AS orphaned_health_records
FROM health_records health
LEFT JOIN patients patient ON patient.id = health.patient_id
WHERE patient.id IS NULL;

SELECT COUNT(*) AS orphaned_predictions
FROM ai_predictions prediction
LEFT JOIN symptom_assessments assessment
    ON assessment.id = prediction.assessment_id
WHERE assessment.id IS NULL;