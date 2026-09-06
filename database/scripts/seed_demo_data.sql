BEGIN;

CREATE TEMP TABLE stage_patients (
    patient_code TEXT,
    age SMALLINT,
    sex TEXT,
    city TEXT,
    registration_year SMALLINT
);

\copy stage_patients FROM 'database/seed/patients.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO patients (patient_code, age, sex, city, registration_year)
SELECT patient_code, age, sex, city, registration_year
FROM stage_patients
ON CONFLICT (patient_code) DO UPDATE
SET age = EXCLUDED.age,
    sex = EXCLUDED.sex,
    city = EXCLUDED.city,
    registration_year = EXCLUDED.registration_year;


CREATE TEMP TABLE stage_health_records (
    patient_code TEXT,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    heart_rate_bpm SMALLINT,
    systolic_bp SMALLINT,
    diastolic_bp SMALLINT,
    temperature_c NUMERIC(4,1),
    spo2_percent SMALLINT
);

\copy stage_health_records FROM 'database/seed/health_records.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO health_records (
    patient_id, height_cm, weight_kg, heart_rate_bpm,
    systolic_bp, diastolic_bp, temperature_c, spo2_percent
)
SELECT
    p.id, h.height_cm, h.weight_kg, h.heart_rate_bpm,
    h.systolic_bp, h.diastolic_bp, h.temperature_c, h.spo2_percent
FROM stage_health_records h
JOIN patients p ON p.patient_code = h.patient_code;


CREATE TEMP TABLE stage_assessments (
    patient_code TEXT,
    source_age SMALLINT,
    source_sex TEXT,
    symptom_duration_days SMALLINT,
    symptom_severity_1_to_5 SMALLINT,
    probable_condition_label_demo TEXT,
    abdominal_pain BOOLEAN,
    body_ache BOOLEAN,
    chest_discomfort BOOLEAN,
    chest_tightness BOOLEAN,
    cough BOOLEAN,
    diarrhea BOOLEAN,
    dizziness BOOLEAN,
    fatigue BOOLEAN,
    fever BOOLEAN,
    frequent_urination BOOLEAN,
    headache BOOLEAN,
    heartburn BOOLEAN,
    increased_thirst BOOLEAN,
    itchy_eyes BOOLEAN,
    light_sensitivity BOOLEAN,
    lower_abdominal_pain BOOLEAN,
    nasal_congestion BOOLEAN,
    nausea BOOLEAN,
    painful_urination BOOLEAN,
    runny_nose BOOLEAN,
    shortness_of_breath BOOLEAN,
    sneezing BOOLEAN,
    sore_throat BOOLEAN,
    vomiting BOOLEAN,
    wheezing BOOLEAN,
    urgency_label_demo TEXT
);

\copy stage_assessments FROM 'database/seed/symptom_assessments.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO symptom_assessments (
    patient_id, symptom_duration_days, symptom_severity_1_to_5,
    abdominal_pain, body_ache, chest_discomfort, chest_tightness,
    cough, diarrhea, dizziness, fatigue, fever, frequent_urination,
    headache, heartburn, increased_thirst, itchy_eyes, light_sensitivity,
    lower_abdominal_pain, nasal_congestion, nausea, painful_urination,
    runny_nose, shortness_of_breath, sneezing, sore_throat, vomiting,
    wheezing, probable_condition_label_demo, urgency_label_demo
)
SELECT
    p.id, a.symptom_duration_days, a.symptom_severity_1_to_5,
    a.abdominal_pain, a.body_ache, a.chest_discomfort, a.chest_tightness,
    a.cough, a.diarrhea, a.dizziness, a.fatigue, a.fever,
    a.frequent_urination, a.headache, a.heartburn, a.increased_thirst,
    a.itchy_eyes, a.light_sensitivity, a.lower_abdominal_pain,
    a.nasal_congestion, a.nausea, a.painful_urination, a.runny_nose,
    a.shortness_of_breath, a.sneezing, a.sore_throat, a.vomiting,
    a.wheezing, a.probable_condition_label_demo, a.urgency_label_demo
FROM stage_assessments a
JOIN patients p ON p.patient_code = a.patient_code;


CREATE TEMP TABLE stage_predictions (
    patient_code TEXT,
    probable_condition_label TEXT,
    urgency_label_demo TEXT,
    model_name TEXT,
    confidence_demo NUMERIC(4,3),
    explanation_demo TEXT
);

\copy stage_predictions FROM 'database/seed/ai_predictions.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO ai_predictions (
    assessment_id, probable_condition_label, urgency_label_demo,
    model_name, confidence_demo, explanation_demo
)
SELECT
    assessment.id, prediction.probable_condition_label,
    prediction.urgency_label_demo, prediction.model_name,
    prediction.confidence_demo, prediction.explanation_demo
FROM stage_predictions prediction
JOIN patients p ON p.patient_code = prediction.patient_code
JOIN LATERAL (
    SELECT id
    FROM symptom_assessments
    WHERE patient_id = p.id
    ORDER BY id DESC
    LIMIT 1
) assessment ON TRUE;


CREATE TEMP TABLE stage_decisions (
    patient_code TEXT,
    decision TEXT,
    reason TEXT
);

\copy stage_decisions FROM 'database/seed/doctor_decisions.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO doctor_decisions (assessment_id, decision, reason)
SELECT
    assessment.id, decision.decision, decision.reason
FROM stage_decisions decision
JOIN patients p ON p.patient_code = decision.patient_code
JOIN LATERAL (
    SELECT id
    FROM symptom_assessments
    WHERE patient_id = p.id
    ORDER BY id DESC
    LIMIT 1
) assessment ON TRUE;


INSERT INTO alerts (assessment_id, alert_level, message)
SELECT
    prediction.assessment_id,
    prediction.urgency_label_demo,
    'Synthetic demo alert. This is clinical decision support only; clinician review is required.'
FROM ai_predictions prediction
WHERE prediction.urgency_label_demo IN ('priority_review', 'urgent_review');

UPDATE symptom_assessments assessment
SET
    age_at_assessment = stage.source_age,
    sex_at_assessment = stage.source_sex
FROM stage_assessments stage
JOIN patients patient ON patient.patient_code = stage.patient_code
WHERE assessment.patient_id = patient.id
  AND assessment.age_at_assessment IS NULL;
COMMIT;