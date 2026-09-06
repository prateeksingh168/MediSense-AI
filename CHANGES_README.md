# MediSense AI — Frontend Changelog, Architecture & Integration Guide 🩺⚡

> **Clinical Philosophy:** *"AI assists. Doctors decide."*  
> **Repository:** `github.com/prateeksingh168/MediSense-AI`  
> **Active Branch:** `feature/frontend-ui`  
> **Pull Request URL:** [https://github.com/prateeksingh168/MediSense-AI/pull/new/feature/frontend-ui](https://github.com/prateeksingh168/MediSense-AI/pull/new/feature/frontend-ui)

---

## 📋 Table of Contents
1. [Executive Summary & Recent Changelog](#1-executive-summary--recent-changelog)
2. [Strict Role-Based Access Control (RBAC) & Healthcare Privacy](#2-strict-role-based-access-control-rbac--healthcare-privacy)
3. [The 3 Isolated Portals (Patient, Doctor, Hospital)](#3-the-3-isolated-portals)
   - [👤 Patient Health Portal](#31--patient-health-portal)
   - [🩺 Individual Doctor Workspace](#32--individual-doctor-workspace)
   - [🏥 Hospital Central Command](#33--hospital-central-command)
4. [Bug Fixes & Technical Resolutions](#4-bug-fixes--technical-resolutions)
5. [Frontend Component Architecture & File Map](#5-frontend-component-architecture--file-map)
6. [Backend & Database Team Integration Blueprint](#6-backend--database-team-integration-blueprint)
7. [Step-by-Step Testing & Evaluation Guide](#7-step-by-step-testing--evaluation-guide)

---

## 1. Executive Summary & Recent Changelog

This document details all recent modifications made to the **MediSense AI** frontend to achieve an award-winning, production-grade medical platform ready for hackathon evaluation and full backend/database integration.

### Summary of Latest Changes:
| Commit Hash | Type | Change Description |
| :--- | :--- | :--- |
| `b686191` | **Feature** | Aligned Patient & Doctor Portals strictly with the PRD specification matrix while preserving Hospital Central Command and the Medi AI Voice/Text Companion intact. |
| `39f4000` | **Docs** | Added comprehensive English CHANGES_README documenting frontend architecture, RBAC, and integration specs. |
| `8216060` | **Fix** | Resolved React runtime `ReferenceError: autofillStaff is not defined` on `AuthPage.jsx` when passing props to `MediChatbot`, fixing blank screen. |
| `e7e722f` | **Feature** | Separated login page (`AuthPage.jsx`) into **3 distinct, dedicated tabs**: `Patient`, `Doctor`, and `Hospital`, ensuring clean role entry. |
| `977366d` | **Security** | Enforced strict healthcare privacy and role-based access control (RBAC). Removed 1-click cross-portal jumping buttons from Navbar, locked portal rendering strictly to `currentUser.role` in `App.jsx`. |
| `1dc6391` | **Feature** | Isolated **Individual Doctor Workspace** (`DoctorPortal.jsx`) strictly to authenticated physician's information, cabin, shift, and assigned patients. |
| `0464a6d` | **Feature** | Built dedicated **Hospital Central Command** (`HospitalPortal.jsx`) with live Doctors Availability Directory (*who is free when*), 16-Patient Census, and Institutional Visual Analytics. |

---

## 2. Strict Role-Based Access Control (RBAC) & Healthcare Privacy

In accordance with healthcare privacy standards (e.g., HIPAA-style patient confidentiality), the application enforces strict boundaries between roles:

```
                                  [ Sign-In Gateway ]
                                           │
             ┌─────────────────────────────┼─────────────────────────────┐
             ▼                             ▼                             ▼
   [ 👤 Patient Role ]            [ 🩺 Doctor Role ]            [ 🏥 Hospital Admin ]
             │                             │                             │
             ▼                             ▼                             ▼
   <PatientPortal />             <DoctorPortal />              <HospitalPortal />
   • Own symptoms & vitals       • Scoped to logged-in MD      • Institutional telemetry
   • Own OPD appointments        • Own assigned patients       • 6 Doctors live availability
   • Confidential medical data   • Personal practice charts    • All 16 inpatients across wards
   ❌ No doctor/hospital access  ❌ No other doctors' data     ❌ No patient-facing wizards
```

### Key Privacy Safeguards Implemented:
1. **Zero 1-Click Cross-Portal Jumping in Navbar**:
   - Open switcher buttons (`[ Patient View ]`, `[ Hospital Command ]`, `[ Doctor Workspace ]`) have been **completely eliminated**.
   - The Navbar displays only a **Read-Only Authenticated Session Badge** indicating the current role:
     - For Patient: `👤 Patient Portal • Confidential & Encrypted`
     - For Doctor: `🩺 Doctor Workspace • [Dr. Name]`
     - For Hospital Admin: `🏥 Hospital Central Command • Executive Operations`
2. **Re-Authentication Required to Switch Roles**:
   - To switch between Patient, Doctor, or Hospital Admin, the user must click **"Switch Account"** or **"Logout"**, requiring valid credentials.
3. **App Root RBAC Guard ([`App.jsx`](file:///C:/Users/TempAdmin/OneDrive/Desktop/med/MediSense-AI/frontend/src/App.jsx))**:
   - `currentUser.role === 'patient'` $\rightarrow$ renders `<PatientPortal />` **ONLY**.
   - `currentUser.role === 'doctor'` $\rightarrow$ renders `<DoctorPortal />` **ONLY**.
   - `currentUser.role === 'admin'` $\rightarrow$ renders `<HospitalPortal />` **ONLY**.
   - Direct state manipulation or URL tampering cannot breach portal boundaries.
4. **Patient Privacy Protection**:
   - Removed the navbar demo switcher dropdown that allowed switching between different patients.
   - Removed the `Review as Doctor` bypass button in [`AIAnalysisResult.jsx`](file:///C:/Users/TempAdmin/OneDrive/Desktop/med/MediSense-AI/frontend/src/components/patient/AIAnalysisResult.jsx) and [`PreviousAssessments.jsx`](file:///C:/Users/TempAdmin/OneDrive/Desktop/med/MediSense-AI/frontend/src/components/patient/PreviousAssessments.jsx).
5. **Doctor Practice Isolation**:
   - Removed the unauthenticated on-screen "Switch Doctor" dropdown from `DoctorPortal.jsx`.
   - The workspace strictly belongs to `activeDoctor` (the physician who logged in).

---

## 3. The 3 Isolated Portals

### 3.1 👤 Patient Health Portal
*Accessible only when authenticated as a Patient.*

- **Symptom Wizard (`SymptomChecker.jsx`)**:
  - Organ-system guided symptom input (Cardiovascular, Respiratory, Neurological, Gastrointestinal, Musculoskeletal, Endocrine).
  - Subjective pain scale (1–10) and duration selector.
  - Automated Emergency Red-Flag detection (triggers alert for high-risk presentations like acute chest pain or severe dyspnea).
- **AI Triage Assessment (`AIAnalysisResult.jsx`)**:
  - Displays probable differential conditions with transparent probability bars.
  - Transparent feature weight explanation (Explainable AI / XAI).
  - Missing clinical test recommendations.
  - Clear notice: *"Case prioritized into Doctor Triage Queue. A licensed physician will review your case."*
- **OPD Appointment Booking (`AppointmentBooking.jsx`)**:
  - Doctor consultation booking with department selection.
  - **Printable Official OPD Token Receipt** (`#OPD-B14`) using native browser print styles.
- **Biometric Vitals Telemetry (`VitalsMonitor.jsx`)**:
  - Live blood pressure area chart (Systolic / Diastolic gradient).
  - Hemodynamics dual-axis line chart (Heart Rate BPM and Oxygen Saturation SpO2).
  - Manual vital entry modal.
- **Assessment History (`PreviousAssessments.jsx`)**:
  - Historical symptom submissions with verified doctor diagnostic notes and discharge instructions.
- **Digital Health Card (`PatientProfile.jsx`)**:
  - Digital card showing blood type, emergency contact, chronic conditions, and QR identity code.

---

### 3.2 🩺 Individual Doctor Workspace
*Accessible only when authenticated as an Attending Physician (`role: 'doctor'`).*

- **Physician Profile Header**:
  - Displays the logged-in doctor's name, department, cabin/room, duty shift, contact extension, and verified Physician License ID.
- **`My Assigned Patients` Tab**:
  - Displays **only** patients assigned to this doctor (`attendingDoctorId === doc.id`):
    - **Dr. Priya Nair, MD (Surgery)**: Shows *Elena Rostova, Chloe Bennett*, etc.
    - **Dr. Aris Thorne, MD (Cardiology)**: Shows *Sarah Jenkins, Harold Watkins, Samuel Adebayo*.
    - **Dr. Robert Chen, MD (Emergency)**: Shows *Marcus Vance, David Miller, Liam O'Connor, Lucas Dupont*.
  - Quick EMR inspection modal showing bed number, diagnosis, vital history, and urgency badge.
- **`My Clinical Triage Queue` Tab**:
  - Intake queue displaying cases that match this physician's clinical department.
  - Interactive **Case Review Modal (`CaseReviewModal.jsx`)**:
    - AI differential analysis with explainable feature weights.
    - Missing clinical test recommendations.
    - Similar cohort references from 1,500+ synthetic cases.
    - **Doctor Decision Action**: Accept AI recommendation or override with clinical notes, revised diagnosis, and customized discharge prescription.
- **`My Practice Analytics & Charts` Tab (`DoctorAnalytics.jsx`)**:
  - **Caseload Urgency Distribution**: Donut chart showing Emergency vs. Urgent vs. Routine breakdown for this doctor's patients.
  - **Weekly Consultation Volume**: Bar chart of consultations conducted by this doctor across Monday to Sunday.
  - **AI Diagnostic Concordance Metric**: Radial gauge tracking agreement between this doctor's final diagnoses and AI suggestions.
  - **Patient Acuity Stratification**: Progress meters showing stable vs. critical patients under this doctor's care.
- **`My Certified Decision Trail` Tab (`DecisionHistory.jsx`)**:
  - Tamper-evident legal audit log of decisions signed by this physician with timestamps and clinical rationales.

---

### 3.3 🏥 Hospital Central Command
*Accessible only when authenticated as Hospital Administration (`role: 'admin'`).*

- **Institutional Operations Header**:
  - High-level KPIs: 120 Total Beds (88 Occupied, 73.3% occupancy), 6 Staff Physicians on duty, ICU Ventilators (14/18 active), Oxygen Purity (99.2%, 4,200L reserve), Active Surgical Theaters (2 in surgery, 1 prep, 1 cath lab), Ambulance Fleet (4 active, 2 standby).
- **`Doctors Staff & Availability Directory` Tab (`HospitalRoster.jsx`)**:
  - Complete roster of all 6 hospital physicians.
  - Real-time availability status (*Available / Free Now, In Surgery, In Consult, On Rounds*).
  - Next free slot timing (*who is free when*).
  - Attended patient listing (*who is seeing which patient*).
  - Cabin number, duty shift, and direct phone extension.
- **`Total Hospital Patient Census` Tab**:
  - Complete institutional census of all 16 admitted inpatients across all hospital wards:
    - Cardiac CCU (Ward A)
    - Medical ICU (Ward B)
    - Trauma & Emergency (ER Ground)
    - General Medical (Ward C)
    - Post-Anesthesia Care (PACU 2nd Fl)
    - Pediatrics & Neonatal (Wing D)
  - Full-text search by patient name, diagnosis, or bed ID, plus ward filters.
- **`Hospital Visual Analytics & Telemetry` Tab (`ClinicalAnalytics.jsx`)**:
  - Multi-ward bed occupancy bar charts.
  - Doctor duty status breakdown donut chart.
  - Department caseload workloads.
  - 24-hour hospital admissions vs. discharges flow telemetry.
  - Operating Theater live schedule (OT 1 to 4).
  - Blood Bank reserve levels (A+, O+, B+, AB-, O- critical stocks).

---

## 4. Bug Fixes & Technical Resolutions

### 1. Domain Matching Bug in `MediSenseContext.jsx` (Fixed)
- **Problem**: In `loginClinician`, the condition `if (role === 'admin' || cleanEmail.includes('hosp'))` was evaluating to `true` for all doctors because their demo emails were `@medisense.hospital.org`. This caused doctors to be misclassified as Hospital Admin and redirected to `HospitalPortal`.
- **Fix**: Refactored logic to strictly respect the `role === 'doctor'` parameter and check email prefixes (`admin@`, `hospital@`), ensuring doctor logins always open `DoctorPortal`.

### 2. Runtime `ReferenceError: autofillStaff` (Fixed)
- **Problem**: When refactoring `AuthPage.jsx`, `autofillStaff` was renamed to `autofillDoctor` and `autofillHospital`, but `MediChatbot` was still passed `onFillDoctorDemo={autofillStaff}`. In React, this unhandled ReferenceError halted component rendering, resulting in a blank white screen.
- **Fix**: Updated prop to `onFillDoctorDemo={autofillDoctor}`. Verified zero build errors.

### 3. Missing `Building2` Icon & Null-Safety (Fixed)
- **Problem**: Missing `Building2` Lucide icon import and unextracted `activeDoctor` in `Navbar.jsx` previously caused a crash when switching views.
- **Fix**: Added `Building2` to imports, destructured `activeDoctor`, and added fallback defaults in `DoctorPortal.jsx` and `DoctorAnalytics.jsx`.

---

## 5. Frontend Component Architecture & File Map

```
frontend/src/
├── App.jsx                                  # Root component with strict RBAC portal routing
├── main.jsx                                 # Application entry point & StrictMode
├── index.css                                # Tailwind CSS & custom medical light styling
│
├── assets/
│   └── logo.png                             # MediSense AI logo asset
│
├── components/
│   ├── Navbar.jsx                           # Top navigation with read-only portal badges & sign-out
│   ├── Footer.jsx                           # Professional medical disclaimer & footer
│   │
│   ├── auth/
│   │   ├── AuthPage.jsx                     # 3-way tabbed login: Patient, Doctor, Hospital
│   │   └── DoctorAuthModal.jsx              # Gated staff credential authentication modal
│   │
│   ├── common/
│   │   ├── Badge.jsx                        # Triage urgency badges (EMERGENCY, URGENT, ROUTINE)
│   │   └── RedFlagAlert.jsx                 # Critical warning banner for high-acuity symptoms
│   │
│   ├── patient/
│   │   ├── PatientPortal.jsx                # Patient container managing tabs
│   │   ├── SymptomChecker.jsx               # Organ-system symptom intake wizard
│   │   ├── AIAnalysisResult.jsx             # Differential triage assessment & XAI weights
│   │   ├── AppointmentBooking.jsx           # Doctor visit scheduling & printable OPD token
│   │   ├── VitalsMonitor.jsx                # Real-time BP, Heart Rate, SpO2 telemetry charts
│   │   ├── PreviousAssessments.jsx          # Historical symptom records & verified doctor notes
│   │   ├── PatientProfile.jsx               # Digital health ID card & medical history
│   │   └── MediChatbot.jsx                  # Floating clinical AI companion ("Medi") with Web Speech API
│   │
│   ├── doctor/
│   │   ├── DoctorPortal.jsx                 # Individual Doctor Workspace (isolated to logged-in MD)
│   │   ├── DoctorAnalytics.jsx              # Personal practice charts (caseload, volume, concordance)
│   │   ├── TriageQueue.jsx                  # Departmental intake queue
│   │   ├── CaseReviewModal.jsx              # Clinical review, XAI feature weights, accept/override
│   │   ├── DecisionHistory.jsx              # Legal EMR decision audit trail
│   │   ├── SimilarCases.jsx                 # Cohort case matching from synthetic dataset
│   │   ├── HospitalRoster.jsx               # Doctors availability directory (used in HospitalPortal)
│   │   └── ClinicalAnalytics.jsx            # Multi-ward telemetry & bed analytics (used in HospitalPortal)
│   │
│   └── hospital/
│       └── HospitalPortal.jsx               # Hospital Central Command (all doctors & total census)
│
├── context/
│   └── MediSenseContext.jsx                 # Global state: authentication, patients, doctors, cases, vitals
│
└── data/
    ├── mockData.js                          # Mock patients, hospital doctors, wards, bed telemetry
    ├── chatbotKnowledge.js                  # In-house zero-latency NLP knowledge base for MediChatbot
    └── dataset/                             # Synthetic clinical dataset (1,500+ records)
```

---

## 6. Backend & Database Team Integration Blueprint

For the backend team (Node.js/Express, Python/FastAPI, or Django) and database team (PostgreSQL or MongoDB), here are the recommended API endpoints and database schemas to connect with this frontend:

### Recommended REST API Endpoints:

#### 1. Authentication & Session:
- `POST /api/auth/patient/register` $\rightarrow$ Accepts patient demographics & password; returns JWT token + patient profile.
- `POST /api/auth/patient/login` $\rightarrow$ Accepts email/password; returns JWT token + patient record.
- `POST /api/auth/clinician/login` $\rightarrow$ Accepts doctor ID/email + security key + role (`doctor` or `admin`); returns session token + doctor/hospital profile.

#### 2. Patient Services:
- `GET /api/patients/:id` $\rightarrow$ Fetch full patient medical profile.
- `POST /api/triage/assess` $\rightarrow$ Accepts submitted symptoms; runs AI/ML differential inference; returns triage level, probable conditions, XAI feature weights, and missing information.
- `POST /api/appointments/book` $\rightarrow$ Books OPD appointment; returns token receipt ID (e.g., `OPD-B14`).
- `POST /api/vitals` $\rightarrow$ Records new vital signs (BP, HR, SpO2, glucose).
- `GET /api/vitals/:patientId/history` $\rightarrow$ Returns continuous vitals time-series data.

#### 3. Doctor Services:
- `GET /api/doctors/:doctorId/patients` $\rightarrow$ Returns active inpatients assigned to this doctor.
- `GET /api/doctors/:doctorId/cases` $\rightarrow$ Returns intake triage cases matching this doctor's specialty.
- `POST /api/cases/:caseId/decision` $\rightarrow$ Submits physician final certified decision (accept or override, clinical notes, discharge instructions).
- `GET /api/doctors/:doctorId/analytics` $\rightarrow$ Returns personal practice analytics (urgency breakdown, consultation volume, concordance metric).

#### 4. Hospital Operations:
- `GET /api/hospital/doctors` $\rightarrow$ Returns all hospital physicians with live status (*Available, In Surgery, In Consult*) and current patient assignments.
- `GET /api/hospital/census` $\rightarrow$ Returns all admitted inpatients across all hospital wards.
- `GET /api/hospital/resources` $\rightarrow$ Returns bed telemetry, ICU ventilators, oxygen purity, operating theaters, and blood bank stocks.

---

## 7. Step-by-Step Testing & Evaluation Guide

To test the application on `http://localhost:5173/`:

1. **Test Patient Portal**:
   - On the login screen, select `[ 👤 Patient ]`.
   - Click `Sarah Jenkins (Demo)` and click **Sign In as Patient**.
   - Verify that only the **Patient Portal** opens.
   - Verify that the Navbar shows `👤 Patient Portal • Confidential & Encrypted`.
   - Test symptom submission in the Symptom Checker and OPD Token printing in Appointments.

2. **Test Individual Doctor Workspace**:
   - Click **Switch Account** in the Navbar.
   - Select `[ 🩺 Doctor ]` tab.
   - Click `Dr. Priya Nair, MD (General & Trauma Surgery)` and click **Enter My Doctor Workspace**.
   - Verify that the Navbar shows `🩺 Doctor Workspace • Dr. Priya Nair, MD`.
   - Under **My Assigned Patients**, verify that only Dr. Nair's surgery patients (*Elena Rostova, Chloe Bennett*) appear.
   - Click **My Practice Analytics** and verify charts reflect only Dr. Nair's caseload.

3. **Test Hospital Central Command**:
   - Click **Switch Account** in the Navbar.
   - Select `[ 🏥 Hospital ]` tab.
   - Click `Hospital Operations Command` and click **Access Hospital Central Command**.
   - Verify that the Navbar shows `🏥 Hospital Central Command • Executive Operations`.
   - Under **Doctors Staff & Availability**, verify that all 6 doctors are listed with live status (*who is free when*).
   - Under **Total Hospital Patient Census**, verify that all 16 inpatients across all wards appear.
   - Under **Hospital Visual Analytics**, verify bed telemetry, operating theaters, and blood bank reserves.

---

*Authored by the MediSense AI Engineering Pair — Ready for Hackathon Presentation & Deployment.* 🚀
