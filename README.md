# 🩺 MediSense AI

> **AI-Powered Healthcare Support & Clinical Decision Support System**

MediSense AI is an intelligent healthcare support platform designed to assist **patients and doctors** through AI-powered symptom analysis, health tracking, safety alerts, case prioritization, explainable AI recommendations, missing-information suggestions, and similar-case references.

> **AI assists. Doctors decide.**

---

# 📌 1. Project Overview

MediSense AI provides two primary interfaces:

### 👤 Patient Portal

Patients can:

- Register and log in
- Maintain basic health information
- Enter symptoms
- Track health changes
- Receive safety/urgency alerts
- View previous assessments

### 👨‍⚕️ Doctor Portal

Doctors can:

- View patient cases
- Prioritize cases according to urgency
- Review probable conditions suggested by AI
- Understand why AI generated a recommendation
- See missing information required for better assessment
- View similar case references
- Accept or override AI recommendations
- Record final decisions

---

# 🎯 2. Project Objective

The objective of MediSense AI is to create a healthcare decision-support platform that can:

1. Collect structured patient health information.
2. Analyze symptoms using AI/ML.
3. Identify potentially urgent situations.
4. Help doctors prioritize patient cases.
5. Provide probable conditions rather than definitive diagnoses.
6. Explain AI-generated recommendations.
7. Identify potentially useful missing information.
8. Provide similar-case references.
9. Keep the final decision with the healthcare professional.

---

# ✨ 3. Core Features

## Patient Features

- 🔐 Patient Registration & Login
- 👤 Patient Profile
- 🩺 Symptom Entry
- 🧠 AI-Assisted Symptom Analysis
- 🚨 Safety / Urgency Alerts
- 📊 Health Tracking
- 📋 Previous Assessments

## Doctor Features

- 🔐 Doctor Login
- 📊 Doctor Dashboard
- 🚨 Patient Case Prioritization
- 🧠 Probable Condition Prediction
- 💡 Explainable AI
- ❓ Missing Information Suggestions
- 📚 Similar Case References
- ✅ Accept AI Recommendation
- ✏️ Override AI Recommendation
- 📝 Decision History

---

# 🔄 4. Complete System Workflow

```text
                    MediSense AI
                         │
              ┌──────────┴──────────┐
              │                     │
          PATIENT                 DOCTOR
              │                     │
       Enter Symptoms          View Patient Cases
              │                     │
       Health Information      Priority Ranking
              │                     │
              └──────────┬──────────┘
                         ↓
                    BACKEND API
                         │
             ┌───────────┼───────────┐
             ↓           ↓           ↓
         DATABASE       AI/ML    SAFETY ENGINE
             │           │           │
             └───────────┼───────────┘
                         ↓
                 AI Decision Support
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
     Prediction     Explanation    Missing Info
                         │
                         ↓
                  Similar Cases
                         │
                         ↓
                  Doctor Review
                         │
                  ┌──────┴──────┐
                  ↓             ↓
               ACCEPT        OVERRIDE
```

---

# 🏗️ 5. System Architecture

The project consists of four major development modules:

```text
Frontend
   ↓
Backend API
   ↓
Database
   ↕
AI/ML Engine
```

### Frontend

Responsible for user interface and interaction.

### Backend

Responsible for APIs, authentication, business logic and communication between modules.

### Database

Responsible for storing users, patients, doctors, symptoms, assessments, AI results and doctor decisions.

### AI

Responsible for symptom analysis, probable-condition prediction, risk support, explanations, missing information and similar-case retrieval.

---

# 🛠️ 6. Technology Stack

## Frontend

- React.js
- Tailwind CSS
- Axios
- React Router
- Chart library for health tracking

## Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- JWT Authentication
- Uvicorn

## Database

- PostgreSQL
- SQL
- SQLAlchemy ORM

## AI / ML

- Python
- Pandas
- NumPy
- Scikit-learn
- NLP techniques
- Sentence Transformers
- LLM API for explanation/support tasks

## Development Tools

- Git
- GitHub
- VS Code
- Postman / Swagger for API testing

---

# 👥 7. Team Responsibilities

## 👨‍💻 MEMBER 1 — FRONTEND DEVELOPER

### Branch

```text
feature/frontend
```

### Primary Responsibility

Build the complete user interface for both:

- Patient Portal
- Doctor Portal

---

## Frontend Module A — Authentication UI

Create:

- Login Page
- Registration Page
- Role Selection
- Logout
- Basic form validation
- Error/success messages

### Technologies

```text
React
React Router
Tailwind CSS
Axios
```

---

## Frontend Module B — Patient Dashboard

Create:

```text
Patient Dashboard
├── Profile
├── Symptom Checker
├── Health Tracking
├── Previous Assessments
└── Alerts
```

---

## Frontend Module C — Symptom Checker

Create a structured form containing fields such as:

- Symptoms
- Symptom duration
- Temperature
- Additional information
- Relevant health history

Example UI:

```text
Symptoms:
[ Fever ] [ Cough ] [ Headache ]

Temperature:
[ 101 °F ]

Duration:
[ 3 days ]

Additional Information:
[.........................]

[ Analyze Symptoms ]
```

The frontend should send this information to the backend API.

---

## Frontend Module D — AI Result Page

Display:

- Risk / urgency level
- Probable conditions
- AI explanation
- Missing information
- Safety recommendation
- Assessment date

Important:

Do not present AI output as a confirmed medical diagnosis.

---

## Frontend Module E — Health Tracking

Create:

- Health record form
- Historical records
- Charts/graphs
- Date-based tracking

Example:

```text
Date       Temperature
01 Sep       99°F
02 Sep      100°F
03 Sep      102°F
```

---

## Frontend Module F — Doctor Dashboard

Create:

```text
Doctor Dashboard
│
├── High Priority Cases
├── Medium Priority Cases
├── Low Priority Cases
└── All Cases
```

Case cards should display:

- Patient ID/name as permitted
- Priority
- Assessment date
- AI summary
- Case status

---

## Frontend Module G — Doctor Case Details

Display:

```text
Patient Information
        ↓
Symptoms
        ↓
Priority
        ↓
Probable Conditions
        ↓
AI Explanation
        ↓
Missing Information
        ↓
Similar Cases
        ↓
AI Recommendation
        ↓
Accept / Override
```

---

## Frontend Module H — Doctor Decision

Create buttons:

```text
[ ACCEPT AI RECOMMENDATION ]

[ OVERRIDE RECOMMENDATION ]
```

For override:

```text
Reason:
[...........................]

[ Submit Override ]
```

---

## Frontend Completion Criteria

Frontend is considered complete when:

- Patient pages work
- Doctor pages work
- Routing works
- Forms validate input
- API integration works
- Loading/error states exist
- Responsive UI is implemented
- AI results display correctly
- Doctor accept/override UI works

---

# ⚙️ MEMBER 2 — BACKEND DEVELOPER

### Branch

```text
feature/backend
```

### Primary Responsibility

Build the backend API and business logic that connects:

```text
Frontend ↔ Backend ↔ Database ↔ AI
```

### Technologies

```text
Python
FastAPI
Pydantic
SQLAlchemy
JWT
Uvicorn
```

---

## Backend Module A — Project Setup

Create:

```text
backend/
├── app/
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── utils/
│
└── requirements.txt
```

---

## Backend Module B — Authentication

Create APIs:

```text
POST /auth/register
POST /auth/login
```

Implement:

- Password hashing
- JWT authentication
- Role handling
- Authentication validation

Roles:

```text
patient
doctor
```

---

## Backend Module C — Patient APIs

Create APIs for:

```text
GET /patients/{patient_id}
PUT /patients/{patient_id}
```

Support:

- Profile information
- Medical history
- Allergies
- Current medications

---

## Backend Module D — Symptom APIs

Create:

```text
POST /symptoms/analyze
GET /symptoms/history/{patient_id}
```

The backend should:

1. Validate input.
2. Store assessment data.
3. Send required information to AI service.
4. Receive AI output.
5. Store AI results.
6. Return structured response.

---

## Backend Module E — Health Tracking APIs

Create:

```text
POST /health-records
GET /health-records/{patient_id}
```

---

## Backend Module F — Doctor APIs

Create:

```text
GET /doctor/cases
GET /doctor/cases/{case_id}
```

Support:

- Case listing
- Priority filtering
- Case details
- AI results

---

## Backend Module G — Doctor Decision API

Create:

```text
POST /doctor/decision
```

Example:

```json
{
  "assessment_id": 101,
  "decision": "accepted"
}
```

For override:

```json
{
  "assessment_id": 101,
  "decision": "overridden",
  "reason": "Clinical review requires a different assessment."
}
```

---

## Backend Completion Criteria

Backend is complete when:

- Authentication works
- APIs are documented
- Database connection works
- AI service can be called
- Error handling exists
- API responses follow consistent JSON format
- Swagger/OpenAPI documentation is available
- Frontend can consume the APIs

---

# 🗄️ MEMBER 3 — DATABASE DEVELOPER

### Branch

```text
feature/database
```

### Primary Responsibility

Design and implement the PostgreSQL database.

### Technologies

```text
PostgreSQL
SQL
SQLAlchemy
```

---

## Database Tables

Initial schema:

```text
users
patients
doctors
health_records
symptom_assessments
ai_predictions
alerts
similar_cases
doctor_decisions
```

---

## Table: users

```text
id
name
email
password_hash
role
created_at
```

---

## Table: patients

```text
id
user_id
age
gender
medical_history
allergies
medications
```

---

## Table: doctors

```text
id
user_id
specialization
```

---

## Table: health_records

```text
id
patient_id
temperature
symptoms
notes
recorded_at
```

---

## Table: symptom_assessments

```text
id
patient_id
symptoms
duration
additional_information
created_at
```

---

## Table: ai_predictions

```text
id
assessment_id
condition
probability
risk_level
explanation
created_at
```

---

## Table: alerts

```text
id
assessment_id
alert_level
message
created_at
```

---

## Table: similar_cases

```text
id
case_reference
case_text
metadata
```

---

## Table: doctor_decisions

```text
id
doctor_id
assessment_id
decision
reason
created_at
```

Decision values:

```text
accepted
overridden
```

---

## Database Responsibilities

Member 3 must also provide:

- Primary keys
- Foreign keys
- Relationships
- Indexes where required
- Constraints
- Sample/demo data
- Database setup documentation

---

## Database Completion Criteria

Database is complete when:

- Schema is created
- Relationships work
- CRUD operations work
- Backend can connect successfully
- Sample data exists
- Database setup instructions are documented

---

# 🤖 MEMBER 4 — AI DEVELOPER 

### Branch

```text
feature/ai
```

### Primary Responsibility

Build the AI/ML pipeline and manage project coordination and integration.

---

# AI Module A — Symptom Processing

Input:

```text
Fever
Cough
Fatigue
Headache
```

Process:

```text
Raw Symptoms
     ↓
Cleaning / Normalization
     ↓
Feature Representation
     ↓
ML Model
```

Technologies:

```text
Python
Pandas
NumPy
Scikit-learn
```

---

# AI Module B — Probable Condition Prediction

Develop an ML model that maps symptom features to probable conditions.

Possible models:

- Logistic Regression
- Decision Tree
- Random Forest

For MVP, start with a simple interpretable model and compare performance before selecting the final model.

Output should contain:

```text
Probable Condition
Probability / Model Score
```

Do not represent model output as a confirmed diagnosis.

---

# AI Module C — Safety / Urgency Engine

Create a deterministic safety layer for potentially concerning symptom combinations.

Output:

```text
LOW
MODERATE
HIGH
```

Example:

```text
Input
 ↓
Safety Rules
 ↓
Urgency Level
 ↓
Safety Message
```

Safety-critical logic should not depend only on an LLM.

---

# AI Module D — Explainable AI

The system should provide information about why a prediction was generated.

Example:

```text
Probable Condition:
Possible respiratory condition

Contributing information:
- Fever
- Persistent cough
- Duration of symptoms

Important:
This is an AI-generated support assessment,
not a confirmed diagnosis.
```

Possible techniques:

```text
Feature Importance
SHAP (optional)
Model-based explanations
```

---

# AI Module E — Missing Information Suggestions

The AI should identify information that may be useful for further clinical review.

Example:

```text
Potentially useful missing information:

- Symptom duration
- Temperature
- Relevant medical history
- Other associated symptoms
```

This feature should support the doctor rather than make a medical decision.

---

# AI Module F — Similar Case Retrieval

Implement a retrieval system:

```text
Current Case
     ↓
Text Embedding
     ↓
Vector Search
     ↓
Similar Cases
```

Suggested technologies:

```text
Sentence Transformers

```

For development/demo:

**Use synthetic, public, or appropriately de-identified data.**

Do not use real patient data in the project repository.

---

# AI Module G — LLM Integration

An LLM may be used for:

- Explanation generation
- Case summarization
- Missing-information suggestions
- Natural-language formatting

The LLM should not independently make high-stakes medical decisions.

Use structured inputs/outputs and validate generated responses.

---

# AI Output Contract

The AI service should return structured data similar to:

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

The exact schema should be finalized jointly with the Backend Developer before integration.

---


# 🌿 8. Git & Branching Strategy

## Protected Main Branch

```text
main 🔐
```

Direct development on `main` is not allowed.

Every developer works on a feature branch.

### Branch Naming

```text
feature/frontend
feature/backend
feature/database
feature/ai
```

---

# 🔄 9. Git Workflow

```text
Clone Repository
      ↓
Create / Switch Feature Branch
      ↓
Develop
      ↓
Test
      ↓
Commit
      ↓
Push Feature Branch
      ↓
Create Pull Request
      ↓
Review
      ↓
Merge
      ↓
main
```

### Example

```bash
git switch -c feature/frontend
```

After development:

```bash
git add .
git commit -m "Add patient dashboard"
git push -u origin feature/frontend
```

Then create a Pull Request to:

```text
feature/frontend → main
```

---

# 📋 10. Development Rules

### Rule 1

❌ Do not directly push to `main`.

### Rule 2

Each member works only on their assigned module unless coordination is required.

### Rule 3

Use meaningful commit messages.

Good:

```text
Add patient symptom form
Create symptom analysis API
Add patient database schema
Implement symptom prediction model
```

Avoid:

```text
update
final
changes
abc
test
```

### Rule 4

Do not commit:

```text
.env
API keys
Passwords
Database credentials
Personal patient information
Large generated files
```

### Rule 5

Before creating a Pull Request:

- Test your changes.
- Check for errors.
- Pull/rebase latest changes when required.
- Explain what was changed in the PR.

---

# 🔗 11. Module Integration Contract

All modules must communicate through clearly defined interfaces.

```text
Frontend
   ↓ HTTP/JSON
Backend API
   ↓
Database

Backend
   ↓
AI Service
   ↓
Structured AI Response
   ↓
Backend
   ↓
Frontend
```

### Example

Frontend sends:

```json
{
  "symptoms": ["fever", "cough"],
  "temperature": 101,
  "duration_days": 3
}
```

Backend sends validated data to AI.

AI returns:

```json
{
  "risk_level": "moderate",
  "probable_conditions": [],
  "explanation": "",
  "missing_information": [],
  "similar_cases": []
}
```

Backend stores the result and returns it to the frontend.

---

# 🧪 12. Testing Strategy

Testing will be performed at multiple levels.

### Frontend

- Form validation
- Routing
- API responses
- Loading states
- Error states

### Backend

- API testing
- Authentication
- Validation
- Database operations
- Error handling

### Database

- CRUD operations
- Relationships
- Constraints

### AI

- Model performance
- Input validation
- Output validation
- Safety rule testing
- Explanation consistency

### Integration

Test the complete:

```text
Patient → Frontend → Backend → Database/AI
                         ↓
                      Doctor
```

---

# ⚠️ 13. Healthcare Safety

MediSense AI is a **healthcare support and decision-support system**, not a replacement for qualified medical professionals.

AI outputs should not be presented as confirmed diagnoses.

Safety alerts should be designed conservatively and should direct users toward appropriate professional medical care when urgent attention may be needed.

For development and demonstration, use:

- Synthetic data
- Public datasets
- Appropriately de-identified data

Never commit real patient information to the repository.

---

# 📂 14. Project Structure

```text
MediSense-AI/
│
├── frontend/
│   └── .gitkeep
│
├── backend/
│   └── .gitkeep
│
├── database/
│   └── .gitkeep
│
├── ai/
│   └── .gitkeep
│
├── docs/
│   └── .gitkeep
│
├── tests/
│   └── .gitkeep
│
├── .gitignore
└── README.md
```

The structure will evolve as development progresses.

---

# 🚧 15. Project Status

**Current Status:** Initial Development

### Completed

- GitHub repository setup
- Protected `main` branch
- Initial project structure
- Team development workflow


### In Progress

- Frontend development
- Backend API development
- Database implementation
- AI/ML pipeline

---

# 🏆 16. Final Vision

MediSense AI combines:

**Patient Safety + AI Assistance + Explainability + Case Prioritization + Doctor-in-the-Loop Decision Support**

> ## **AI Assists. Doctors Decide.**

---