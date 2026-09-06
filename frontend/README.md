# MediSense AI — Comprehensive Frontend Architecture & Backend Integration Guide 🩺🤖

> **"AI assists. Doctors decide."**  
> An ethical clinical decision-support platform bridging patients and physicians. Powered by Explainable AI (XAI), automated emergency red-flag triage, continuous telemetry, and 1,500+ synthetic clinical cohort references.

---

## 📌 Notice for Team & Evaluators: All Technologies & Dependencies Used

To maintain 100% transparency across the frontend, backend, and database teams, here is the complete list of every technology, library, browser API, and dataset used in this frontend. **No hidden third-party paid APIs, secret microservices, or external trackers are used.**

### 1. Production NPM Dependencies (`package.json`)
- `react` (`^18.3.1`): Core declarative UI framework.
- `react-dom` (`^18.3.1`): DOM rendering engine for React.
- `recharts` (`^2.15.1`): SVG charting library used for:
  - 24-hour continuous Blood Pressure AreaChart (Systolic / Diastolic gradient).
  - Hemodynamics LineChart (Pulse rate BPM and Oxygen Saturation SpO2 dual-axis).
  - Clinical Triage Acuity distribution & bed capacity telemetry in the Doctor Command Center.
- `lucide-react` (`^0.475.0`): Clean, standardized clinical and UI icons (Stethoscope, Heart, Activity, Wind, Zap, Bot, ShieldCheck, etc.).
- `clsx` (`^2.1.1`) & `tailwind-merge` (`^2.6.0`): Utility functions for conditionally merging Tailwind CSS classes cleanly without collision.

### 2. Development & Build Tooling
- `vite` (`^6.1.0`): High-performance Next-Generation frontend build tool with sub-second Hot Module Replacement (HMR).
- `@vitejs/plugin-react` (`^4.3.4`): Official Babel/Fast Refresh plugin for React in Vite.
- `tailwindcss` (`^3.4.17`): Utility-first CSS framework configured with a **custom Light Medical Design System** (`#f8fafc` slate background, crisp white `#ffffff` cards, teal `#0d9488`, cyan, rose, and indigo clinical accents).
- `postcss` (`^8.5.1`) & `autoprefixer` (`^10.4.20`): CSS processing and vendor prefixing.

### 3. Native Browser Web APIs (Zero Extra Packages Required)
- **Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)**:
  - Used in the **"Medi" AI Clinical Chatbot** for voice input.
  - Converts spoken voice to text in real-time with an animated listening pulse.
  - Runs natively in Google Chrome, Microsoft Edge, and Safari — **requires zero paid speech APIs** (no Whisper, Google Cloud Speech, or AWS Polly keys needed).
- **Native Browser Print API (`window.print()`)**:
  - Used in **AppointmentBooking.jsx** to print/save the official **OPD Token Receipt** (`#OPD-B14`).
  - Used in **PatientProfile.jsx** to print the **Digital Health ID Card**.
  - Styled with CSS `@media print` rules for clean, receipt-paper formatted printouts.

### 4. Synthetic Clinical Dataset (Provided by Challenge Organizers)
- Extracted from `MediSense_AI_Synthetic_Dataset.zip` into `src/data/dataset/` and `src/data/syntheticCases.json`.
- Contains **1,500+ synthetic clinical patient records** across 6 standardized CSVs:
  - `patients.csv`: Demographics, age, gender, chronic history.
  - `health_records.csv`: Biometrics, blood pressure, heart rate, blood glucose.
  - `symptom_assessments.csv`: Organ systems, symptoms, subjective pain scores.
  - `ai_predictions.csv`: Model diagnostic predictions, probabilities, urgency scores.
  - `doctor_decisions.csv`: Physician accept/override audit trail and treatment plans.
  - `data_dictionary.csv`: Full attribute metadata and clinical definitions.
- **Usage**: Used by the frontend for historical case matching in `SimilarCases.jsx` and baseline validation benchmarks in `ClinicalAnalytics.jsx`.

### 5. NLP & Decision Logic Engine (`chatbotKnowledge.js`)
- An in-house, zero-latency clinical NLP engine designed for medical hackathons.
- Features multi-intent matching, sub-categorization for ambiguous inputs (e.g. probing where `"pain"` or `"dard"` is located with interactive chips), bilingual English/Hinglish understanding, and safety disclaimers.
- **No external OpenAI or Gemini API keys are required for frontend execution**, ensuring it never fails due to rate-limits or offline connections during hackathon judging.

---

## 🏛️ System Architecture & Workflow

```
                             ┌──────────────────────────────────────┐
                             │       MediSense AI Front-End         │
                             │ (React 18 + Vite + Tailwind CSS)     │
                             └──────────────────┬───────────────────┘
                                                │
                 ┌──────────────────────────────┴─────────────────────────────┐
                 ▼                                                            ▼
    ┌───────────────────────────┐                               ┌───────────────────────────┐
    │      Patient Portal       │                               │   Doctor Command Center   │
    │  (Patient-Empowerment)    │                               │     (Clinical Triage)     │
    └────────────┬──────────────┘                               └─────────────┬─────────────┘
                 │                                                            │
    ┌────────────┼───────────────────────────┐                  ┌─────────────┼───────────────────────────┐
    ▼            ▼             ▼             ▼                  ▼             ▼             ▼             ▼
[Symptom]   [Appointment]  [Health]     ["Medi" AI]        [Triage Queue]   [XAI Feature] [Missing Lab] [Accept/Override]
[Checker]   [& OPD Token]  [Vitals]     [Companion]        [Prioritized]    [Weights]     [Tests Alert] [Legal Audit]
    │            │             │             │                  ▲             ▲             ▲             ▲
    └────────────┼─────────────┴─────────────┘                  │             │             │             │
                 ▼                                              │             │             │             │
    ┌───────────────────────────────────────────────────────────┴─────────────┴─────────────┴─────────────┴─┐
    │                               MediSenseContext (Global Reactive Store)                                 │
    │              - Session & Accounts    - Active Patients List    - Vitals History Map                   │
    │              - Triage Cases Store    - Booked Appointments     - Clinical Decision History            │
    └───────────────────────────────────────────┬────────────────────────────────────────────────────────────┘
                                                ▼
                             ┌──────────────────────────────────────┐
                             │          Backend REST API            │
                             │      (Node.js / Express / Python)     │
                             └──────────────────┬───────────────────┘
                                                ▼
                             ┌──────────────────────────────────────┐
                             │     Database (PostgreSQL / MongoDB)  │
                             └──────────────────────────────────────┘
```

---

## 📂 Complete File-by-File Breakdown

```
frontend/src/
├── App.jsx                               # Root application wrapper with persistent layout & portal toggle
├── main.jsx                              # React DOM root mounting
├── index.css                             # Global styles, Tailwind directives, and printing rules
│
├── assets/
│   └── logo.png                          # Official MediSense AI brand logo
│
├── components/
│   ├── Navbar.jsx                        # Top navigation: brand logo, CDS badge, demo switcher, portal tabs, user profile
│   ├── Footer.jsx                        # Bottom pinned footer: capabilities overview, copyright, medical disclaimer
│   │
│   ├── auth/
│   │   └── AuthPage.jsx                  # 3-way authentication: Patient Sign In, Patient Sign Up, Doctor/Admin login
│   │
│   ├── common/
│   │   ├── Badge.jsx                     # Urgency badges: EMERGENCY (red), URGENT (amber), ROUTINE (emerald)
│   │   └── RedFlagAlert.jsx              # Pulsing red-flag warning alert for acute life-threatening symptoms
│   │
│   ├── patient/
│   │   ├── PatientPortal.jsx             # Main container for patient features and 5 sub-tabs
│   │   ├── SymptomEntry.jsx              # 5-organ system selector, symptom pills, pain slider (1-10), acute notes
│   │   ├── AIAnalysisResult.jsx          # Immediate patient triage score, urgency level, and clinical recommendations
│   │   ├── AppointmentBooking.jsx        # Specialist picker, OPD token generator, and printable OPD Token Receipt
│   │   ├── HealthTracker.jsx             # Biometric cards (BP, HR, SpO2, Glucose) & 24-hr Recharts telemetry curves
│   │   ├── PreviousAssessments.jsx       # Historical list of patient assessments and reviewing physician decisions
│   │   ├── PatientProfile.jsx            # Full demographics, active medications, allergies, and Digital Health ID Card
│   │   └── MediChatbot.jsx               # Floating "Medi" AI companion with Web Speech API and clinical probing
│   │
│   └── doctor/
│       ├── DoctorPortal.jsx              # Doctor Command container (Triage Queue, Analytics, Decision Audit)
│       ├── TriageQueue.jsx               # Priority queue sorted by clinical acuity with quick review actions
│       ├── CaseReviewModal.jsx           # Deep case inspection: patient history, current complaint, vital signs
│       ├── ExplainableAI.jsx             # XAI feature attribution weight bars showing AI reasoning transparently
│       ├── MissingInfoCard.jsx           # Clinical test recommendations (ECG, Troponin, CT) prior to final diagnosis
│       ├── SimilarCases.jsx              # Historical cohort matcher searching 1,500 synthetic cases for similar outcomes
│       ├── AcceptOverrideModal.jsx       # Physician modal to Accept or Override AI assessment with clinical justification
│       ├── ClinicalAnalytics.jsx         # Hospital capacity charts: CCU/Trauma beds, AI concordance rate (92.4%)
│       └── DecisionHistory.jsx           # Legal audit log recording all physician confirmations and overrides
│
├── context/
│   └── MediSenseContext.jsx              # Central state engine managing auth, patients, vitals, triage cases, appointments
│
└── data/
    ├── chatbotKnowledge.js               # Clinical NLP knowledge base, probing trees, symptom guidance, Hinglish support
    ├── mockData.js                       # Initial seed patients, sample cases, and specialist doctor listings
    ├── syntheticCases.json               # 1,500 benchmark clinical cases extracted from the provided dataset
    └── dataset/                          # 6 raw CSV tables extracted from MediSense_AI_Synthetic_Dataset.zip
```

---

## 🔐 Authentication & Session Persistence Rules

1. **Persistent Accounts (`registeredAccounts`)**:
   - When a patient registers via **New Patient Sign Up**, their account is saved in `registeredAccounts`.
   - When logging out and logging back in via **Patient Sign In**, entering their email and password authenticates them and **loads their exact registered profile** — never demo data.
2. **Strict Credential Validation (No Direct Click Bypass)**:
   - Clicking "Sign In" with empty fields is strictly prevented with error banners.
   - Form autofill buttons are provided for demo evaluation, but users must still click **"Sign In"** to authenticate.
3. **Unmeasured Vitals for New Patients**:
   - Newly registered patients start with `lastVitals: null` and an empty vitals history.
   - `HealthTracker.jsx` displays an honest unmeasured state with `-- / -- mmHg` dashes and an invitation to log their first reading or load sample baseline measurements.

---

## 📊 Data Models & JSON Schemas (For Backend & Database Developers)

### 1. Patient Entity Schema
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

### 2. Biometric Vital Reading Schema
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

### 3. Triage Case & AI Assessment (XAI) Schema
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

### 4. Doctor Review Object (Audit Trail)
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

### 5. Appointment & OPD Token Receipt Schema
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

## 🌐 Backend REST API Endpoints Specification

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

## 🗄️ Database Schema (SQL DDL & MongoDB Mongoose)

### PostgreSQL DDL Table Creation Script
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

### MongoDB Mongoose Schemas
```javascript
import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  age: Number,
  gender: String,
  bloodType: String,
  city: String,
  chronicConditions: [String],
  knownAllergies: [String],
  currentMedications: [String],
  createdAt: { type: Date, default: Date.now }
});

const TriageCaseSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  organSystem: String,
  selectedSymptoms: Array,
  primarySeverity: Number,
  triageLevel: { type: String, enum: ['EMERGENCY', 'URGENT', 'ROUTINE'] },
  triageScore: Number,
  status: { type: String, enum: ['PENDING_REVIEW', 'ACCEPTED', 'OVERRIDDEN'], default: 'PENDING_REVIEW' },
  aiAnalysis: Object,
  doctorReview: Object,
  createdAt: { type: Date, default: Date.now }
});

export const Patient = mongoose.model('Patient', PatientSchema);
export const TriageCase = mongoose.model('TriageCase', TriageCaseSchema);
```

---

## 🔌 Connecting Frontend to Backend (Step-by-Step)

1. **Create Environment File**:
   In `frontend/.env.development`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

2. **Connect API Calls in `MediSenseContext.jsx`**:
   ```javascript
   const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

   // Real API Patient Login
   const loginPatient = async (email, password) => {
     try {
       const res = await fetch(`${API_BASE}/auth/login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password, role: 'patient' })
       });
       const data = await res.json();
       if (!res.ok) return { success: false, error: data.error || 'Login failed.' };

       setCurrentPatient(data.patient);
       setCurrentUser({ role: 'patient', ...data.user });
       setActivePortal('patient');
       return { success: true };
     } catch (err) {
       return { success: false, error: 'Cannot connect to backend server.' };
     }
   };
   ```

3. **Enable CORS in Backend**:
   ```javascript
   // In Express.js backend server.js:
   const cors = require('cors');
   app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
   ```

---

## 🚀 Setup, Run & Build Commands

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Install all dependencies
npm install

# 3. Start local development server (http://127.0.0.1:5173/)
npm run dev

# 4. Compile optimized production build (0 errors)
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 🏆 Judge Demonstration Script (To Win the Hackathon)

1. **Step 1 — Modern Auth & Sign Up**:
   - Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/).
   - Click **"New Patient Sign Up"**, enter a name (e.g. *Ananya Gupta*), email, and password.
   - Click Create Account. You enter the Patient Portal as Ananya with clean unmeasured vitals.
2. **Step 2 — Scoped Vitals & Telemetry**:
   - Switch to **"Health Vitals Tracking"**. Notice the genuine empty state (`-- / -- mmHg`).
   - Click `⚡ Load Sample Baseline Profile` or `+ Log Reading` to see the live Recharts BP & SpO2 curves animate into view!
3. **Step 3 — Interactive Voice AI Companion "Medi"**:
   - Click the floating **Medi** bot icon at bottom-right.
   - Type `"pain"` or `"dard"`. Medi probes with clinical empathy: *"Where is the pain located?"* with 5 clickable chips.
   - Click `[ 🚨 Chest Pain (Urgent) ]` to receive acute coronary emergency instructions.
4. **Step 4 — Symptom Checker & Red-Flag Urgency**:
   - Open **"AI Symptom Checker"**. Click `⚡ Load Demo Emergency`.
   - Severity auto-sets to 9/10 with radiating chest pain. Click **"Analyze with MediSense AI"**.
   - An immediate **EMERGENCY (95/100)** score appears with 911 dispatch warning and XAI attribution.
5. **Step 5 — Official Printable OPD Token Receipt**:
   - Switch to **"Book Appointment & Receipts"**. Pick *Dr. Robert Chen (Cardiology)*.
   - Click **"Confirm Appointment & Generate Token Receipt"**.
   - Official `#OPD-B14` card is generated with barcode and a **Print / Save as PDF** button!
6. **Step 6 — Doctor Command Center & Explainable AI (XAI)**:
   - Click the top Navbar switch to **"Doctor Command"**.
   - View the prioritized Triage Queue with pending emergency cases.
   - Click **"Review Clinical Assessment"**: Inspect **XAI feature weights** (+48% chest pressure), **missing tests** (ECG, Troponin), and **1,500 synthetic case cohort matches**.
7. **Step 7 — Physician Accept / Override & Analytics**:
   - Click **"Confirm / Override AI Assessment"**. Enter clinical notes and confirm or override.
   - Check **"Decision History & Audit"** for legal timestamped logs.
   - Check **"Clinical Analytics"** for real-time Recharts bed telemetry and 92.4% AI-doctor concordance!

---

*MediSense AI — Engineered for Medical Excellence, Safety & Doctor-in-the-Loop Governance.*
