ALTER TABLE symptom_assessments
    ADD COLUMN age_at_assessment SMALLINT CHECK (age_at_assessment BETWEEN 0 AND 130),
    ADD COLUMN sex_at_assessment VARCHAR(30);

UPDATE symptom_assessments assessment
SET
    age_at_assessment = patient.age,
    sex_at_assessment = patient.sex
FROM patients patient
WHERE assessment.patient_id = patient.id;