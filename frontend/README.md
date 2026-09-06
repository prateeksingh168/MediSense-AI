# MediSense AI — Frontend Architecture & Backend Integration Guide 🩺🤖

> **"AI assists. Doctors decide."**  
> An intelligent clinical decision-support ecosystem bridging patients and physicians. Powered by Explainable AI (XAI), automated emergency red-flag triage, and 1,500+ synthetic clinical cohort references.

---

## 📋 Table of Contents
1. [Overview & Philosophy](#1-overview--philosophy)
2. [Technology Stack](#2-technology-stack)
3. [Folder & Component Structure](#3-folder--component-structure)
4. [Authentication & Role-Based Access](#4-authentication--role-based-access)
5. [Frontend Data Contracts & Schemas](#5-frontend-data-contracts--schemas)
6. [Backend API Specification (REST Endpoints)](#6-backend-api-specification-rest-endpoints)
7. [Database Schema Recommendations](#7-database-schema-recommendations)
8. [Connecting Frontend to Backend (Integration Steps)](#8-connecting-frontend-to-backend-integration-steps)
9. [Development & Build Commands](#9-development--build-commands)

---

## 1. Overview & Philosophy

MediSense AI is a dual-portal clinical platform designed for healthcare hackathons and real-world medical workflows:

- **Patient Portal**:
  - **AI Symptom Checker**: Multi-system organ triage (Cardiovascular, Respiratory, Neurological, Abdominal, Musculoskeletal) with 1–10 pain severity scoring.
  - **Book Appointment & OPD Receipts**: Specialist doctor booking with official printable OPD Token Receipts (`#OPD-B14`), room allocation, and barcode verification.
  - **Health Vitals Tracking**: Real-time biometric monitoring with Recharts telemetry (Blood Pressure, Heart Rate, SpO2, Blood Glucose). New patients begin with a clean unmeasured state.
  - **Digital Health ID Card**: Smart patient pass with scannable QR verification, chronic conditions, and allergy tags.
  - **"Medi" Voice AI Companion**: An empathetic clinical assistant supporting speech-to-text (Web Speech API) and multi-chip interactive clinical probing (e.g. chest vs abdominal pain differentiation).

- **Doctor Command Center**:
  - **Prioritized Triage Queue**: Sorts acute patients by urgency (`EMERGENCY` > `URGENT` > `ROUTINE`).
  - **Explainable AI (XAI)**: Displays feature attribution weights (e.g. *"+48% substernal chest pressure"*), preventing black-box uncertainty.
  - **Missing Clinical Tests Alert**: Recommends mandatory diagnostic tests (e.g., 12-Lead ECG, Troponin I) before confirming high-risk conditions.
  - **Historical Cohort Matching**: Correlates acute presentations with 1,500+ synthetic clinical cases.
  - **Accept / Override Legal Audit Trail**: 100% physician autonomy with timestamps and clinical justification logs.
  - **Clinical Analytics & Telemetry**: Bed occupancy telemetry, triage acuity distributions, and AI-physician concordance metrics.

---

## 2. Technology Stack

| Layer | Technologies Used |
|---|---|
| **Framework & Build Tool** | React 18, Vite 6, Modern ES6+ JavaScript |
| **Styling & Design System** | Tailwind CSS v3 (Crisp Light Medical Theme: Slate `#f8fafc`, Teal `#0d9488`, Cyan, Rose, Indigo) |
| **Iconography** | Lucide React |
| **Data Visualization** | Recharts (AreaChart, LineChart, ResponsiveContainer) |
| **Voice AI / Speech Recognition** | Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) |
| **State Management** | React Context API (`MediSenseContext.jsx`) |
| **Synthetic Data Engine** | 1,500 Patient Cohort Benchmark (`syntheticCases.json`, CSV tables) |

---

## 3. Folder & Component Structure

```
frontend/
├── public/
│   └── logo.png                       # MediSense AI logo asset
├── src/
│   ├── assets/
│   │   └── logo.png                   # Brand logo image
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthPage.jsx           # 3-way auth: Patient Login, Patient Signup, Doctor/Admin Login
│   │   ├── common/
│   │   │   ├── Badge.jsx              # Triage severity badges (Emergency, Urgent, Routine)
│   │   │   └── RedFlagAlert.jsx       # Pulsing emergency banner for life-threatening symptoms
│   │   ├── doctor/
│   │   │   ├── AcceptOverrideModal.jsx# Modal for doctor to confirm or override AI decision
│   │   │   ├── CaseReviewModal.jsx    # Full-screen deep clinical case inspection
│   │   │   ├── ClinicalAnalytics.jsx  # Recharts hospital telemetry, bed capacity, acuity charts
│   │   │   ├── DecisionHistory.jsx    # Legal physician audit log of accepted/overridden cases
│   │   │   ├── DoctorPortal.jsx       # Doctor Command container & sub-tabs
│   │   │   ├── ExplainableAI.jsx      # XAI feature attribution weight bars (+% / -%)
│   │   │   ├── MissingInfoCard.jsx    # Critical lab tests missing from patient case
│   │   │   ├── SimilarCases.jsx       # Historical cohort matching (1,500 synthetic cases)
│   │   │   └── TriageQueue.jsx        # Acuity-ranked incoming patient triage queue
│   │   ├── patient/
│   │   │   ├── AIAnalysisResult.jsx   # Patient-facing triage urgency rating & instructions
│   │   │   ├── AppointmentBooking.jsx # Doctor scheduling & official printable OPD receipt generator
│   │   │   ├── HealthTracker.jsx      # Biometric cards & 24-hr Recharts BP/SpO2 trend curves
│   │   │   ├── MediChatbot.jsx        # Floating "Medi" AI companion with mic speech-to-text
│   │   │   ├── PatientPortal.jsx      # Patient container & navigation sub-tabs
│   │   │   ├── PatientProfile.jsx     # Medical record, active meds, & Digital Health ID card
│   │   │   ├── PreviousAssessments.jsx# Patient's submission history and reviewing doctor decisions
│   │   │   └── SymptomEntry.jsx       # 5 organ systems, symptom chips, pain slider (1-10)
│   │   ├── Navbar.jsx                 # Top header with logo, title, patient switcher, logout
│   │   └── Footer.jsx                 # Bottom pinned footer with capabilities & disclaimer
│   ├── context/
│   │   └── MediSenseContext.jsx       # Global application store (auth, patients, cases, vitals)
│   ├── data/
│   │   ├── chatbotKnowledge.js        # Medi NLP clinical engine, probing trees & Hinglish
│   │   ├── mockData.js                # Initial seed patients, triage cases, doctors
│   │   ├── syntheticCases.json        # 1,500 synthetic cases extracted from provided dataset
│   │   └── dataset/                   # Unzipped raw synthetic dataset CSV files
│   ├── App.jsx                        # Root wrapper with layout & portal routing
│   ├── index.css                      # Tailwind utilities & custom healthcare animations
│   └── main.jsx                       # React DOM root entrypoint
├── index.html                         # HTML template
├── package.json                       # Dependencies & build scripts
├── tailwind.config.js                 # Tailwind design theme configuration
└── vite.config.js                     # Vite build configuration
```

---

## 4. Authentication & Role-Based Access

The frontend currently provides state-managed authentication via `MediSenseContext.jsx` and `AuthPage.jsx`:

1. **Patient Sign Up**:
   - Fields collected: Full Name, Email, Phone, Age, Gender, Blood Type, City, Chronic Conditions, Known Allergies, Password.
   - Account is saved in `registeredAccounts` and `patientsList`.
   - The user immediately enters the Patient Portal with `lastVitals: null` (unmeasured).
2. **Patient Sign In**:
   - Validates email and password against `registeredAccounts`.
   - Successfully loads the **exact registered patient profile and their personal vitals history**.
   - Demo Accounts available for instant testing:
     - `sarah.jenkins@medisense.ai` (Password: `patient123`)
     - `marcus.vance@medisense.ai` (Password: `patient123`)
3. **Doctor / Admin Sign In**:
   - Requires staff email and medical security key (e.g. `doctor123` / `admin123`).
   - Roles:
     - `doctor`: Dr. Robert Chen, MD (Cardiology & Emergency Triage)
     - `admin`: Dr. Sarah Al-Mansoor (Chief Medical Officer / Administration)

---

## 5. Frontend Data Contracts & Schemas

To integrate with your backend database (PostgreSQL, MongoDB, MySQL, etc.), match the following JSON structures:

### A. Patient Entity
```json
{
  "id": "pat_001",
  "name": "Sarah Jenkins",
  "email": "sarah.jenkins@medisense.ai",
  "age": 58,
  "gender": "Female",
  "bloodType": "A+",
  "phone": "+1 (555) 382-9910",
  "city": "Mumbai",
  "emergencyContact": "David Jenkins (Spouse) - +1 (555) 382-9911",
  "chronicConditions": ["Essential Hypertension (5 yrs)", "Hyperlipidemia"],
  "knownAllergies": ["Penicillin", "Sulfa Drugs"],
  "currentMedications": ["Amlodipine 5mg OD", "Atorvastatin 20mg HS"],
  "lastVitals": {
    "bpSys": 148,
    "bpDia": 92,
    "hr": 104,
    "spo2": 94,
    "glucose": 112,
    "temp": 98.6
  }
}
```

### B. Biometric Vital Reading Record
```json
{
  "patientId": "pat_001",
  "time": "14:30",
  "bpSys": 128,
  "bpDia": 82,
  "hr": 76,
  "spo2": 98,
  "glucose": 95
}
```

### C. Triage Case & AI Assessment (XAI)
```json
{
  "id": "CASE-2026-001",
  "patientId": "pat_001",
  "patientName": "Sarah Jenkins",
  "patientAge": 58,
  "patientGender": "Female",
  "organSystem": "cardiovascular",
  "selectedSymptoms": [
    { "id": "cv_1", "name": "Crushing Retrosternal Chest Pain", "redFlag": true },
    { "id": "cv_2", "name": "Radiation to Left Arm / Jaw", "redFlag": true },
    { "id": "cv_4", "name": "Diaphoresis (Cold Sweats)", "redFlag": true }
  ],
  "primarySeverity": 9,
  "onsetDuration": "Acute (< 2 hours)",
  "generalNotes": "Severe squeezing sensation while climbing stairs.",
  "triageLevel": "EMERGENCY",
  "triageScore": 95,
  "urgencyAssessment": "CRITICAL EMERGENCY: Immediate Emergency Department Evaluation & 12-Lead ECG Required.",
  "status": "PENDING_REVIEW",
  "aiAnalysis": {
    "primaryCondition": "Acute Coronary Syndrome (High Ischemia Likelihood)",
    "primaryProbability": 91,
    "differentialDiagnoses": [
      { "condition": "Acute Coronary Syndrome / NSTEMI", "probability": 91, "confidence": "Critical", "matchRate": 96 },
      { "condition": "Unstable Angina Pectoris", "probability": 7, "confidence": "Low", "matchRate": 22 },
      { "condition": "Esophageal Spasm", "probability": 2, "confidence": "Negligible", "matchRate": 8 }
    ],
    "featureWeights": [
      { "feature": "Chest pressure with ischemic features", "impact": "+48%", "type": "positive", "description": "Strong clinical marker of acute coronary hypoperfusion" },
      { "feature": "Autonomic symptoms (Diaphoresis)", "impact": "+29%", "type": "positive", "description": "Reflects severe sympathetic activation" },
      { "feature": "Severity score (9/10)", "impact": "+15%", "type": "positive", "description": "High subjective acute distress" }
    ],
    "missingInformation": [
      { "item": "Immediate 12-Lead Electrocardiogram (ECG)", "urgency": "CRITICAL", "why": "Rule out acute ST-Elevation (STEMI) requiring cath lab." },
      { "item": "Quantitative High-Sensitivity Troponin I", "urgency": "CRITICAL", "why": "Detect microscopic myocardial necrosis." }
    ],
    "similarCases": [
      {
        "caseId": "HIST-8910",
        "similarity": 95,
        "patientProfile": "58F, Similar ischemic presentation",
        "aiPrediction": "Acute Coronary Syndrome (89%)",
        "doctorDecision": "Accepted (Emergency angiogram)",
        "outcome": "Revascularized with drug-eluting stent. Uncomplicated recovery."
      }
    ]
  },
  "doctorReview": null
}
```

### D. Doctor Review Object (Accept / Override Audit)
```json
{
  "action": "ACCEPTED",
  "doctorName": "Dr. Robert Chen, MD",
  "doctorSpecialty": "Cardiology & Emergency Triage",
  "reviewedAt": "Today, 10:15 AM",
  "confirmedCondition": "Acute Coronary Syndrome (High Ischemia Likelihood)",
  "overrideReason": null,
  "clinicalNotes": "Confirmed AI assessment. Patient prepared for emergency catheterization lab.",
  "dischargeInstructions": "Immediate ICU telemetry admission and continuous cardiac monitoring."
}
```

### E. Appointment & OPD Token Receipt
```json
{
  "id": "APT-2026-8941",
  "tokenNumber": "OPD-B14",
  "patientId": "pat_001",
  "patientName": "Sarah Jenkins",
  "patientAge": 58,
  "patientGender": "Female",
  "patientPhone": "+1 (555) 382-9910",
  "doctorName": "Dr. Robert Chen, MD",
  "doctorSpecialty": "Cardiology & Emergency Care",
  "department": "Cardiovascular Sciences",
  "room": "Consultation Suite 304, Wing B",
  "appointmentDate": "2026-09-08",
  "timeSlot": "10:30 AM",
  "consultationType": "In-Person Urgent Consultation",
  "reason": "Follow-up on acute retrosternal chest pain and telemetry results.",
  "feeStatus": "Confirmed (Insurance Covered)",
  "status": "SCHEDULED",
  "bookedAt": "Today, 08:30 AM"
}
```

---

## 6. Backend API Specification (REST Endpoints)

Implement the following endpoints in your Node.js/Express, Python (FastAPI/Flask), or Java (Spring Boot) backend:

| Method | Endpoint | Description | Request Body | Response Body |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Register new patient account | `{ name, email, password, phone, age, gender, bloodType, city, chronicConditions, knownAllergies }` | `{ success: true, patient: { id, name, ... }, token: "jwt..." }` |
| `POST` | `/api/auth/login` | Authenticate patient or doctor | `{ email, password, role }` | `{ success: true, user: { ... }, token: "jwt..." }` |
| `GET` | `/api/patients/:id` | Fetch patient profile | Header: `Bearer <token>` | `{ patient: { ... } }` |
| `GET` | `/api/patients/:id/vitals` | Get patient vitals history | Query: `?limit=24` | `{ vitals: [ { time, bpSys, bpDia, hr, spo2, glucose } ] }` |
| `POST` | `/api/patients/:id/vitals` | Record new vital sign | `{ bpSys, bpDia, hr, spo2, glucose }` | `{ success: true, reading: { ... } }` |
| `POST` | `/api/triage/assess` | Submit symptoms & compute AI prediction | `{ patientId, organSystem, symptoms, severity, duration, notes }` | `{ success: true, case: { ...aiAnalysis, triageLevel, ... } }` |
| `GET` | `/api/triage/queue` | Fetch triage cases for Doctor Portal | Query: `?status=PENDING_REVIEW` | `{ cases: [ ... ] }` |
| `PUT` | `/api/triage/:id/review` | Doctor Accept or Override decision | `{ action: "ACCEPTED"|"OVERRIDDEN", confirmedCondition, overrideReason, notes, plan }` | `{ success: true, updatedCase: { ... } }` |
| `POST` | `/api/appointments` | Book doctor visit & issue OPD token | `{ patientId, doctorName, department, date, timeSlot, reason }` | `{ success: true, appointment: { id, tokenNumber, ... } }` |
| `GET` | `/api/appointments/patient/:id` | Get patient's appointments & receipts | Header: `Bearer <token>` | `{ appointments: [ ... ] }` |
| `GET` | `/api/analytics/hospital` | Telemetry & hospital bed occupancy | Header: `Bearer <token>` | `{ totalCases, emergencyCount, concordanceRate, beds: { ... } }` |

---

## 7. Database Schema Recommendations

### Relational Schema (PostgreSQL / MySQL)

```sql
-- Patients Table
CREATE TABLE patients (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    age INT,
    gender VARCHAR(20),
    blood_type VARCHAR(10),
    city VARCHAR(100),
    chronic_conditions TEXT[],
    known_allergies TEXT[],
    current_medications TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vitals Telemetry Table
CREATE TABLE vitals_telemetry (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bp_systolic INT NOT NULL,
    bp_diastolic INT NOT NULL,
    heart_rate INT NOT NULL,
    spo2 INT NOT NULL,
    blood_glucose INT NOT NULL
);

-- Triage Cases Table
CREATE TABLE triage_cases (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    organ_system VARCHAR(50) NOT NULL,
    selected_symptoms JSONB NOT NULL,
    primary_severity INT NOT NULL,
    triage_level VARCHAR(20) NOT NULL, -- 'EMERGENCY', 'URGENT', 'ROUTINE'
    triage_score INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING_REVIEW', -- 'PENDING_REVIEW', 'ACCEPTED', 'OVERRIDDEN'
    ai_prediction JSONB NOT NULL,
    doctor_review JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    token_number VARCHAR(20) NOT NULL, -- e.g. 'OPD-B14'
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    doctor_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    room VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 8. Connecting Frontend to Backend (Integration Steps)

1. **Set Environment Variable**:
   In `frontend/.env.development`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

2. **Connecting `MediSenseContext.jsx` to Real API**:
   Replace the local state methods in `frontend/src/context/MediSenseContext.jsx` with standard `fetch` or `axios` calls:
   ```javascript
   const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

   // Example: Real Login Integration
   const loginPatient = async (email, password) => {
     try {
       const res = await fetch(`${API_BASE}/auth/login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password, role: 'patient' })
       });
       const data = await res.json();
       if (!res.ok) return { success: false, error: data.message };

       setCurrentPatient(data.patient);
       setCurrentUser({ role: 'patient', ...data.user });
       setActivePortal('patient');
       return { success: true };
     } catch (err) {
       return { success: false, error: 'Server connection failed.' };
     }
   };
   ```

3. **CORS Configuration**:
   Ensure your backend permits requests from the frontend origin:
   ```javascript
   // In Express.js backend:
   const cors = require('cors');
   app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
   ```

---

## 9. Development & Build Commands

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install all dependencies
npm install

# 3. Start local development server (with hot module reload)
npm run dev

# 4. Build for production (outputs optimized static bundle to dist/)
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 🏆 Hackathon Evaluation Quick Reference

| Feature | Where to Test in UI | Expected Result |
|---|---|---|
| **New Patient Registration** | Auth Screen -> `New Patient Sign Up` | Creates new account, starts with `null` vitals, persists for future logins |
| **Authentic Login Check** | Auth Screen -> `Patient Sign In` | Re-logging in with registered email loads **that patient's record**, not demo data |
| **Interactive Chatbot "Medi"** | Bottom-right floating icon | Type `"pain"`, `"fever"` or `"How to use app?"` for clinical probing & action chips |
| **Emergency Red-Flag Triage** | Symptom Checker -> `⚡ Load Demo Emergency` | Triggers ACS protocol, 911 banner, 95 triage score, XAI feature weights |
| **Printable OPD Token Receipt** | Book Appointment -> Confirm Booking | Generates official `#OPD-B14` card with Room Suite & Print button |
| **Physician Decision Audit** | Doctor Portal -> Click Case -> `Confirm` or `Override` | Logs legal audit timestamp with clinical justification in Decision History |
| **Hospital Analytics** | Doctor Portal -> `Clinical Analytics` | Real-time Recharts triage donut, bed occupancy, and AI concordance telemetry |

*MediSense AI — Engineered for Medical Excellence, Safety & Doctor-in-the-Loop Governance.*
