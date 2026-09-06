# MediSense AI — Backend Development PRD
**Owner:** Member 2 — Backend & API Developer (Arin)
**Branch:** `backend-arin` (created from `main`, PR target: `main`)
**Repo:** https://github.com/prateeksingh168/MediSense-AI
**Stack:** Python, FastAPI, Pydantic, SQLAlchemy, JWT, Uvicorn, PostgreSQL (SQLite fallback for local dev)

> This PRD is derived word-for-word from the project README's "MEMBER 2 — BACKEND DEVELOPER" section, cross-checked against the actual repo structure (`backend/` folder currently empty except `.gitkeep`), and reconciled with the provided synthetic dataset (`MediSense_AI_Synthetic_Dataset.zip`). Build this **phase by phase, in order**. Do not skip ahead — later phases depend on earlier ones (DB models → auth → everything else).

---

## 0. Ground Rules (apply to every phase)

1. **Do not modify the dataset CSVs.** They live at `dataset/` (copy them in as-is) and are used ONLY as seed data + test fixtures. Never edit column names, values, or row order.
2. **Never commit:** `.env`, API keys, passwords, DB credentials, real patient data, large generated files (per repo Rule 4).
3. Every API response must follow one consistent JSON envelope (defined in Section 5).
4. Every endpoint must appear correctly in Swagger UI (`/docs`) with request/response models visible — no raw dicts, always Pydantic schemas.
5. AI is never the final decision-maker. Every AI-influenced field (`risk_level`, `probable_conditions`, etc.) must be clearly returned as "support data", never as a diagnosis.
6. Work only inside `backend/`. Do not touch `frontend/`, `database/`, `ai/` folders except to consume documented contracts.
7. Commit messages must be descriptive (e.g. "Create symptom analysis API"), never "update"/"fix"/"test".

---

## 1. Dataset Reference (for seeding + testing — READ ONLY)

The dataset is 100% synthetic, safe for dev/demo. Structure confirmed from the zip:

| File | Rows | Columns |
|---|---|---|
| `patients.csv` | 1500 | `patient_id, age, sex, city, registration_year` |
| `health_records.csv` | 1500 | `patient_id, height_cm, weight_kg, heart_rate_bpm, systolic_bp, diastolic_bp, temperature_c, spo2_percent` |
| `symptom_assessments.csv` | 1500 | `patient_id, age, sex, symptom_duration_days, symptom_severity_1_to_5, probable_condition_label, [25 binary symptom_* columns], urgency_label_demo` |
| `ai_predictions.csv` | 1500 | `patient_id, probable_condition_label, urgency_label_demo, model_name, confidence_demo, explanation_demo` |
| `doctor_decisions.csv` | 1500 | `patient_id, doctor_decision, decision_note` |
| `data_dictionary.csv` | — | column descriptions |
| `README_DATASET.md` | — | safety notes |

**25 symptom columns** (binary 0/1): `abdominal_pain, body_ache, chest_discomfort, chest_tightness, cough, diarrhea, dizziness, fatigue, fever, frequent_urination, headache, heartburn, increased_thirst, itchy_eyes, light_sensitivity, lower_abdominal_pain, nasal_congestion, nausea, painful_urination, runny_nose, shortness_of_breath, sneezing, sore_throat, vomiting, wheezing`

**10 condition labels:** `Urinary Tract Infection, Hypertension, Gastroenteritis, Asthma Exacerbation, Acid Reflux, Type 2 Diabetes, Common Cold, Viral Fever, Seasonal Allergy, Migraine`

**Dataset urgency labels (3):** `priority_review, routine_review, urgent_review`
**Dataset doctor decisions (3):** `accepted_ai, pending_review, overridden_ai`

### ⚠️ Known mismatch to resolve with team (flag this in your first standup)

The README's DB schema (Section 3 below) uses `risk_level: LOW/MODERATE/HIGH` and `decision: accepted/overridden`. The dataset uses different label sets. **Recommended mapping** (use this unless Member 3/4 say otherwise):

| Dataset value | Maps to README schema value |
|---|---|
| `routine_review` | `LOW` |
| `priority_review` | `MODERATE` |
| `urgent_review` | `HIGH` |
| `accepted_ai` | `accepted` |
| `overridden_ai` | `overridden` |
| `pending_review` | `pending` *(new status — add this to the enum, since a case exists before a doctor decides)* |

Also: dataset's `patient_id` is a string like `P00001`, not an auto-increment integer. **Keep both**: internal integer `id` (primary key, used in URLs/foreign keys) AND a separate unique string field `patient_code` (stores values like `P00001`) so the dataset can be seeded directly without renumbering anything.

The 25 one-hot symptom columns must be converted into a `symptoms` JSON array (e.g. `["fever", "cough"]`) at seed-time — do not create 25 separate DB columns.

---

## 2. Phase 1 — Project Setup (Backend Module A)

Create exactly this structure inside `backend/`:

```
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── patient_routes.py
│   │   ├── symptom_routes.py
│   │   ├── health_record_routes.py
│   │   └── doctor_routes.py
│   ├── models/
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── doctor.py
│   │   ├── health_record.py
│   │   ├── symptom_assessment.py
│   │   ├── ai_prediction.py
│   │   ├── alert.py
│   │   ├── similar_case.py
│   │   └── doctor_decision.py
│   ├── schemas/
│   │   ├── auth_schema.py
│   │   ├── patient_schema.py
│   │   ├── symptom_schema.py
│   │   ├── health_record_schema.py
│   │   └── doctor_schema.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── ai_client.py
│   │   └── seed_service.py
│   └── utils/
│       ├── security.py
│       ├── jwt_handler.py
│       └── response_wrapper.py
├── dataset/          (copy the 5 CSVs + data dictionary here, unmodified)
├── scripts/
│   └── seed_from_dataset.py
├── tests/
│   └── (pytest files, mirrored per module)
├── .env.example
├── requirements.txt
└── README.md
```

**Acceptance criteria:** `uvicorn app.main:app --reload` runs cleanly, `/docs` loads Swagger UI with an empty API list, no import errors.

**`requirements.txt` must include at minimum:**
```
fastapi
uvicorn[standard]
sqlalchemy
pydantic
pydantic-settings
python-jose[cryptography]
passlib[bcrypt]
python-multipart
psycopg2-binary
python-dotenv
pandas
pytest
httpx
```

---

## 3. Phase 2 — Database Models (SQLAlchemy)

Implement these tables (matches README Section "Database Tables" + the reconciliation notes above). Even though Member 3 owns the DB design, backend needs its own SQLAlchemy models to develop/test against — coordinate and reconcile later during merge.

- **users**: `id (PK), name, email (unique), password_hash, role (enum: patient/doctor), created_at`
- **patients**: `id (PK), user_id (FK→users), patient_code (unique string, e.g. P00001), age, gender, city, medical_history (text), allergies (text), medications (text)`
- **doctors**: `id (PK), user_id (FK→users), specialization`
- **health_records**: `id (PK), patient_id (FK→patients), height_cm, weight_kg, heart_rate_bpm, systolic_bp, diastolic_bp, temperature, spo2_percent, symptoms (JSON, nullable), notes, recorded_at`
- **symptom_assessments**: `id (PK), patient_id (FK→patients), symptoms (JSON array), duration_days, severity_1_to_5, additional_information, created_at`
- **ai_predictions**: `id (PK), assessment_id (FK→symptom_assessments), condition, probability, risk_level (enum: LOW/MODERATE/HIGH), explanation, missing_information (JSON array), similar_cases (JSON array), recommendation, model_name, created_at`
- **alerts**: `id (PK), assessment_id (FK→symptom_assessments), alert_level, message, created_at`
- **similar_cases**: `id (PK), case_reference, case_text, metadata (JSON)`
- **doctor_decisions**: `id (PK), doctor_id (FK→doctors), assessment_id (FK→symptom_assessments), decision (enum: accepted/overridden/pending), reason, created_at`

**Acceptance criteria:** `Base.metadata.create_all()` runs without error against a fresh Postgres/SQLite DB; all foreign keys resolve; enums are enforced at the DB or Pydantic layer.

---

## 4. Phase 3 — Authentication (Backend Module B)

**Endpoints:**
```
POST /auth/register
POST /auth/login
```

`POST /auth/register` — request:
```json
{
  "name": "Riya Sharma",
  "email": "riya@example.com",
  "password": "SecurePass123",
  "role": "patient"
}
```
- `role` must be restricted to `patient` or `doctor` only.
- Password hashed with bcrypt (passlib) before storage — never store plaintext.
- If `role == patient`, auto-create a linked row in `patients`. If `role == doctor`, auto-create a linked row in `doctors`.
- Duplicate email → `409 Conflict`.

`POST /auth/login` — request: `{"email": "...", "password": "..."}`
- Verify hash, issue JWT access token (include `user_id`, `role`, `exp` in payload).
- Wrong credentials → `401 Unauthorized`.

**Response (both, wrapped per Section 8 envelope) contains:** `access_token, token_type: "bearer", role, user_id`.

Add a JWT dependency (`get_current_user`) usable on all protected routes below, plus a `require_role("doctor")` dependency for doctor-only endpoints.

**Acceptance criteria:** Register → login → use token on a protected route works end-to-end in Swagger UI ("Authorize" button works with Bearer token).

---

## 5. Phase 4 — Patient APIs (Backend Module C)

```
GET /patients/{patient_id}
PUT /patients/{patient_id}
```
- `GET`: returns profile info, medical history, allergies, current medications. 404 if not found.
- `PUT`: patient can only update **their own** profile (check JWT `user_id` against patient's linked `user_id`) — doctors can view any patient but should not edit via this endpoint.
- `PUT` body allows updating: `age, gender, city, medical_history, allergies, medications` (partial updates allowed).

**Acceptance criteria:** Unauthorized user cannot edit someone else's profile (`403`), invalid `patient_id` returns `404`, valid update persists and is reflected on next `GET`.

---

## 6. Phase 5 — Symptom APIs (Backend Module D) — core module

```
POST /symptoms/analyze
GET /symptoms/history/{patient_id}
```

`POST /symptoms/analyze` — request (matches README's Module Integration Contract exactly):
```json
{
  "symptoms": ["fever", "cough"],
  "temperature": 101,
  "duration_days": 3,
  "additional_information": "string, optional"
}
```

Backend flow (must implement all 6 steps from README literally):
1. Validate input (symptoms list non-empty, values should ideally match the known 25-symptom vocabulary — reject/flag unknown symptom strings but don't crash).
2. Store assessment row in `symptom_assessments`.
3. Send required info to AI service (`services/ai_client.py` — build this as an HTTP client function calling the AI module's endpoint; **stub it** with a mock response using the AI Output Contract shape below until Member 4's real AI service is ready, so backend isn't blocked).
4. Receive AI output.
5. Store AI results in `ai_predictions` (+ create an `alerts` row if `risk_level == HIGH`).
6. Return the structured response to the caller.

**AI Output Contract (exact shape from README — this is what `ai_client.py` must expect back and what `/symptoms/analyze` must return):**
```json
{
  "risk_level": "moderate",
  "probable_conditions": [],
  "explanation": "",
  "missing_information": [],
  "similar_cases": [],
  "recommendation": ""
}
```
`risk_level` must only be `low`, `moderate`, or `high`. Response must never claim a confirmed diagnosis — always phrase as "probable"/"AI-generated support assessment".

`GET /symptoms/history/{patient_id}` — returns all past assessments + their linked AI predictions for that patient, most recent first. 404 if patient doesn't exist; empty list (not error) if patient exists but has no history.

**Acceptance criteria:** Calling `/symptoms/analyze` with the stub AI client returns a full, correctly-shaped response and persists both the assessment and the AI prediction; history endpoint reflects it immediately after.

---

## 7. Phase 6 — Health Tracking APIs (Backend Module E)

```
POST /health-records
GET /health-records/{patient_id}
```
- `POST` body: `height_cm, weight_kg, heart_rate_bpm, systolic_bp, diastolic_bp, temperature, spo2_percent, notes (optional)`. Use the ranges observed in the dataset as sane validation bounds (not hard business rules, just sanity checks): height 145–195cm, weight 40–113kg, temp 35.5–39.1°C, SpO2 94–99%. Reject wildly impossible values (e.g. negative, or SpO2 > 100).
- `GET`: returns all records for a patient ordered by `recorded_at`, structured so the frontend can plot a date-vs-value chart directly (Frontend Module E needs `[{date, temperature}, ...]`-friendly shape).

**Acceptance criteria:** Records persist correctly, ordering is chronological, invalid data is rejected with clear validation error messages (FastAPI/Pydantic native validation is fine here).

---

## 8. Phase 7 — Doctor APIs (Backend Module F)

```
GET /doctor/cases
GET /doctor/cases/{case_id}
```
- Both routes require `role == doctor` (use the `require_role("doctor")` dependency).
- `GET /doctor/cases`: list of all symptom assessments + their AI predictions, joined so each case shows `patient_id, priority (=risk_level), assessment_date, ai_summary, case_status`. Support query param `?priority=high|moderate|low` for filtering (README: "Priority filtering").
- `GET /doctor/cases/{case_id}` (case_id = assessment id): full case detail — patient info, symptoms, priority, probable conditions, AI explanation, missing information, similar cases, current decision status (matches Frontend Module G's full display chain exactly).

**Acceptance criteria:** Non-doctor JWT gets `403`. Filtering by priority actually filters. Case detail includes every field the frontend needs in one call (no N+1 extra requests needed from frontend).

---

## 9. Phase 8 — Doctor Decision API (Backend Module G)

```
POST /doctor/decision
```
Accept decision:
```json
{ "assessment_id": 101, "decision": "accepted" }
```
Override decision:
```json
{ "assessment_id": 101, "decision": "overridden", "reason": "Clinical review requires a different assessment." }
```
- Doctor-only (JWT role check).
- `decision` must be one of `accepted`, `overridden` (map dataset's `pending_review`→`pending` only for seeded/demo data — a doctor cannot POST `pending` as a new decision, that's a default state before any decision exists).
- If `decision == overridden`, `reason` is **required** (400 if missing).
- Creates a row in `doctor_decisions` linked to the doctor (from JWT) and the assessment.
- Prevent duplicate active decisions on the same assessment — either reject a second decision or version it (pick one, document your choice in the PR description).

**Acceptance criteria:** Missing `reason` on override → `400` with a clear message. Decision shows up correctly on `GET /doctor/cases/{case_id}` afterward.

---

## 10. Phase 9 — Seed Script (uses the dataset — read-only)

Build `scripts/seed_from_dataset.py`:
1. Read all 5 CSVs from `backend/dataset/` using pandas — **never modify these files**.
2. For each `patients.csv` row: create a `users` row (generate a placeholder email like `{patient_code}@demo.medisense.ai`, a random hashed demo password) + a linked `patients` row (`patient_code`, `age`, `sex`→`gender`, `city`).
3. Join in `health_records.csv` by `patient_id` → insert into `health_records`.
4. Join in `symptom_assessments.csv` → convert the 25 one-hot symptom columns into a `symptoms` JSON list (only symptoms with value `1`) → insert into `symptom_assessments`.
5. Join in `ai_predictions.csv` → insert into `ai_predictions`, applying the urgency-label mapping table from Section 1.
6. Join in `doctor_decisions.csv` → insert into `doctor_decisions` (need at least one demo doctor user to attach these to — create one demo doctor first), applying the decision mapping table from Section 1.
7. Script must be idempotent (safe to re-run without duplicating rows — check existing `patient_code` before insert).

**Acceptance criteria:** Running the script against an empty DB populates ~1500 realistic patients with full history, ready for the frontend/doctor dashboard to demo against.

---

## 11. Phase 10 — Cross-Cutting: Error Handling, Response Format, Swagger

**Standard response envelope (use for every endpoint, success and error):**
```json
{
  "success": true,
  "data": { },
  "message": "string",
  "error": null
}
```
On error:
```json
{
  "success": false,
  "data": null,
  "message": "string",
  "error": { "code": "VALIDATION_ERROR", "detail": "..." }
}
```
Implement this via a shared `utils/response_wrapper.py` + a global FastAPI exception handler so 400/401/403/404/422/500 all come back in this shape consistently (per README: "API responses follow consistent JSON format").

Ensure every route has proper `response_model=` Pydantic schemas, `summary`, and `tags` so Swagger UI (`/docs`) groups endpoints cleanly under Auth / Patients / Symptoms / Health Records / Doctor.

---

## 12. Backend Completion Checklist (copy from README verbatim — do not close this out until every line is true)

- [ ] Authentication works
- [ ] APIs are documented
- [ ] Database connection works
- [ ] AI service can be called (stub is fine until Member 4 delivers real service)
- [ ] Error handling exists
- [ ] API responses follow consistent JSON format
- [ ] Swagger/OpenAPI documentation is available
- [ ] Frontend can consume the APIs

---

## 13. `.env.example` (commit this, never the real `.env`)

```
DATABASE_URL=postgresql://user:password@localhost:5432/medisense
JWT_SECRET_KEY=change_me
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
AI_SERVICE_URL=http://localhost:8001
```

---

## 14. Open Questions to raise with the team (don't block on these — proceed with the recommended defaults above, flag for confirmation)

1. Confirm the urgency/decision label mapping (Section 1) with Member 4 (AI) and Member 3 (Database) before final merge.
2. Confirm final AI Output Contract schema field names with Member 4 — README explicitly says "exact schema should be finalized jointly with the Backend Developer."
3. Confirm whether `doctor_decisions.decision` should support a `pending` value in the DB enum, or whether "pending" should just mean "no row exists yet" (recommended: no row = pending, keep enum as `accepted/overridden` only, matching README exactly).
