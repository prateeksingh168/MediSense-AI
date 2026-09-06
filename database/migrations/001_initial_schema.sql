-- MediSense AI PostgreSQL database schema
-- Synthetic demo data only. AI supports clinicians; it does not diagnose.

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('patient', 'doctor'))
);

CREATE TABLE patients (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE SET NULL,

    -- Source identifier from the provided dataset, e.g. P00001.
    patient_code VARCHAR(20) NOT NULL UNIQUE,

    age SMALLINT NOT NULL CHECK (age BETWEEN 0 AND 130),
    sex VARCHAR(30) NOT NULL,
    city VARCHAR(100),
    registration_year SMALLINT CHECK (registration_year BETWEEN 2000 AND 2100),

    medical_history TEXT,
    allergies TEXT,
    medications TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_city ON patients(city);

CREATE TABLE health_records (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

    height_cm NUMERIC(5, 2) CHECK (height_cm BETWEEN 30 AND 300),
    weight_kg NUMERIC(5, 2) CHECK (weight_kg BETWEEN 1 AND 500),
    heart_rate_bpm SMALLINT CHECK (heart_rate_bpm BETWEEN 20 AND 300),
    systolic_bp SMALLINT CHECK (systolic_bp BETWEEN 40 AND 300),
    diastolic_bp SMALLINT CHECK (diastolic_bp BETWEEN 20 AND 200),
    temperature_c NUMERIC(4, 1) CHECK (temperature_c BETWEEN 25 AND 45),
    spo2_percent SMALLINT CHECK (spo2_percent BETWEEN 0 AND 100),

    notes TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_records_patient_id
    ON health_records(patient_id);

CREATE INDEX idx_health_records_recorded_at
    ON health_records(recorded_at DESC);

CREATE TABLE symptom_assessments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

    symptom_duration_days SMALLINT
        CHECK (symptom_duration_days BETWEEN 0 AND 3650),

    symptom_severity_1_to_5 SMALLINT
        CHECK (symptom_severity_1_to_5 BETWEEN 1 AND 5),

    abdominal_pain BOOLEAN NOT NULL DEFAULT FALSE,
    body_ache BOOLEAN NOT NULL DEFAULT FALSE,
    chest_discomfort BOOLEAN NOT NULL DEFAULT FALSE,
    chest_tightness BOOLEAN NOT NULL DEFAULT FALSE,
    cough BOOLEAN NOT NULL DEFAULT FALSE,
    diarrhea BOOLEAN NOT NULL DEFAULT FALSE,
    dizziness BOOLEAN NOT NULL DEFAULT FALSE,
    fatigue BOOLEAN NOT NULL DEFAULT FALSE,
    fever BOOLEAN NOT NULL DEFAULT FALSE,
    frequent_urination BOOLEAN NOT NULL DEFAULT FALSE,
    headache BOOLEAN NOT NULL DEFAULT FALSE,
    heartburn BOOLEAN NOT NULL DEFAULT FALSE,
    increased_thirst BOOLEAN NOT NULL DEFAULT FALSE,
    itchy_eyes BOOLEAN NOT NULL DEFAULT FALSE,
    light_sensitivity BOOLEAN NOT NULL DEFAULT FALSE,
    lower_abdominal_pain BOOLEAN NOT NULL DEFAULT FALSE,
    nasal_congestion BOOLEAN NOT NULL DEFAULT FALSE,
    nausea BOOLEAN NOT NULL DEFAULT FALSE,
    painful_urination BOOLEAN NOT NULL DEFAULT FALSE,
    runny_nose BOOLEAN NOT NULL DEFAULT FALSE,
    shortness_of_breath BOOLEAN NOT NULL DEFAULT FALSE,
    sneezing BOOLEAN NOT NULL DEFAULT FALSE,
    sore_throat BOOLEAN NOT NULL DEFAULT FALSE,
    vomiting BOOLEAN NOT NULL DEFAULT FALSE,
    wheezing BOOLEAN NOT NULL DEFAULT FALSE,

    additional_information TEXT,

    -- Synthetic labels from the supplied dataset; not confirmed diagnoses.
    probable_condition_label_demo VARCHAR(150),
    urgency_label_demo VARCHAR(30),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_symptom_assessments_patient_id
    ON symptom_assessments(patient_id);

CREATE INDEX idx_symptom_assessments_created_at
    ON symptom_assessments(created_at DESC);

CREATE INDEX idx_symptom_assessments_urgency
    ON symptom_assessments(urgency_label_demo);

CREATE TABLE ai_predictions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    assessment_id BIGINT NOT NULL
        REFERENCES symptom_assessments(id) ON DELETE CASCADE,

    probable_condition_label VARCHAR(150) NOT NULL,
    urgency_label_demo VARCHAR(30) NOT NULL,

    model_name VARCHAR(150),
    confidence_demo NUMERIC(4, 3)
        CHECK (confidence_demo BETWEEN 0 AND 1),

    explanation_demo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_predictions_assessment_id
    ON ai_predictions(assessment_id);

CREATE INDEX idx_ai_predictions_urgency
    ON ai_predictions(urgency_label_demo);


CREATE TABLE alerts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    assessment_id BIGINT NOT NULL
        REFERENCES symptom_assessments(id) ON DELETE CASCADE,

    alert_level VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT alerts_level_check
        CHECK (alert_level IN ('routine_review', 'priority_review', 'urgent_review'))
);

CREATE INDEX idx_alerts_assessment_id
    ON alerts(assessment_id);

CREATE INDEX idx_alerts_level
    ON alerts(alert_level);


CREATE TABLE similar_cases (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Reference to a synthetic/de-identified case only.
    case_reference VARCHAR(100) NOT NULL UNIQUE,
    case_text TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE doctor_decisions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    doctor_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    assessment_id BIGINT NOT NULL
        REFERENCES symptom_assessments(id) ON DELETE CASCADE,

    -- Includes the supplied CSV values and supports backend values.
    decision VARCHAR(30) NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT doctor_decisions_value_check
        CHECK (
            decision IN (
                'accepted_ai',
                'overridden_ai',
                'pending_review',
                'accepted',
                'overridden'
            )
        )
);

CREATE INDEX idx_doctor_decisions_doctor_id
    ON doctor_decisions(doctor_id);

CREATE INDEX idx_doctor_decisions_assessment_id
    ON doctor_decisions(assessment_id);

CREATE INDEX idx_doctor_decisions_created_at
    ON doctor_decisions(created_at DESC);