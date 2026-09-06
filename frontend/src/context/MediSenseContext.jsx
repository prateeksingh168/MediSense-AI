import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  DEMO_PATIENTS,
  INITIAL_CASES,
  INITIAL_VITALS_HISTORY,
  HOSPITAL_DOCTORS,
  HOSPITAL_PATIENTS,
  HOSPITAL_BED_TELEMETRY,
  HOSPITAL_RESOURCES
} from '../data/mockData';

const MediSenseContext = createContext(null);


const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-2026-8941',
    tokenNumber: 'OPD-B14',
    patientId: 'pat_001',
    patientName: 'Sarah Jenkins',
    patientAge: 58,
    patientGender: 'Female',
    patientPhone: '+1 (555) 382-9910',
    doctorName: 'Dr. Robert Chen, MD',
    doctorSpecialty: 'Cardiology & Emergency Care',
    department: 'Cardiovascular Sciences',
    room: 'Consultation Suite 304, Wing B',
    appointmentDate: '2026-09-08',
    timeSlot: '10:30 AM',
    consultationType: 'In-Person Urgent Consultation',
    reason: 'Follow-up on acute retrosternal chest pain and telemetry results.',
    feeStatus: 'Confirmed (Insurance Covered)',
    status: 'SCHEDULED',
    bookedAt: 'Today, 08:30 AM'
  },
  {
    id: 'APT-2026-8940',
    tokenNumber: 'OPD-A08',
    patientId: 'pat_003',
    patientName: 'David Miller',
    patientAge: 46,
    patientGender: 'Male',
    patientPhone: '+1 (555) 902-8812',
    doctorName: 'Dr. Michael Chang, MD',
    doctorSpecialty: 'Pulmonology & Respiratory Medicine',
    department: 'Pulmonary Care Unit',
    room: 'Room 208, West Wing',
    appointmentDate: '2026-09-09',
    timeSlot: '02:15 PM',
    consultationType: 'Specialist Review',
    reason: 'Asthma exacerbation evaluation and spirometry scheduling.',
    feeStatus: 'Verified (Co-pay Paid)',
    status: 'SCHEDULED',
    bookedAt: 'Yesterday'
  }
];

export function MediSenseProvider({ children }) {
  // Session & Authentication (null initially to show AuthPage)
  const [currentUser, setCurrentUser] = useState(null);

  // Navigation
  const [activePortal, setActivePortal] = useState('patient'); // 'patient' | 'doctor' | 'hospital'
  const [patientTab, setPatientTab] = useState('symptoms'); // 'symptoms' | 'vitals' | 'history' | 'profile'
  const [doctorTab, setDoctorTab] = useState('triage'); // 'triage' | 'patients' | 'audit' | 'analytics'

  // Modal for Gated Doctor / Hospital Staff Sign In
  const [doctorAuthModalOpen, setDoctorAuthModalOpen] = useState(false);

  // Hospital-Wide Operations, Doctor Roster & Inpatient Census
  const [hospitalDoctors, setHospitalDoctors] = useState(HOSPITAL_DOCTORS);
  const [hospitalPatients, setHospitalPatients] = useState(HOSPITAL_PATIENTS);

  // Active Logged-in Doctor ID (for Individual Doctor Workspace)
  const [currentDoctorId, setCurrentDoctorId] = useState('doc_001'); // Dr. Aris Thorne by default

  const activeDoctor = useMemo(() => {
    return hospitalDoctors.find(d => d.id === currentDoctorId) || hospitalDoctors[0];
  }, [hospitalDoctors, currentDoctorId]);

  const switchDoctor = (doctorId) => {
    const doc = hospitalDoctors.find(d => d.id === doctorId);
    if (doc) {
      setCurrentDoctorId(doctorId);
      setCurrentUser(prev => ({
        ...(prev || {}),
        role: 'doctor',
        name: doc.name,
        title: doc.title,
        department: doc.department,
        specialty: doc.specialty,
        doctorId: doc.id,
        cabin: doc.cabin,
        contact: doc.contact,
        email: `${doc.name.toLowerCase().replace(/[^a-z]/g, '')}@medisense.org`
      }));
    }
  };

  const updateDoctorStatus = (doctorId, newStatus, newLabel, nextFreeTime) => {
    setHospitalDoctors(prev =>
      prev.map(d =>
        d.id === doctorId
          ? { ...d, status: newStatus, statusLabel: newLabel, nextFreeTime }
          : d
      )
    );
  };



  // Patients & Current Patient
  const [patientsList, setPatientsList] = useState(DEMO_PATIENTS);
  const [currentPatient, setCurrentPatient] = useState(DEMO_PATIENTS[0]);

  // Triage Cases
  const [cases, setCases] = useState(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);

  // Appointments
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  // Health Vitals History (scoped per patient ID so new patients start with clean unmeasured state)
  const [patientVitalsMap, setPatientVitalsMap] = useState({
    'pat_001': INITIAL_VITALS_HISTORY,
    'pat_002': [
      { time: '08:00', bpSys: 118, bpDia: 78, hr: 68, spo2: 99, glucose: 90 },
      { time: '12:00', bpSys: 122, bpDia: 80, hr: 74, spo2: 98, glucose: 105 },
      { time: '16:00', bpSys: 120, bpDia: 79, hr: 71, spo2: 98, glucose: 94 }
    ],
    'pat_003': [
      { time: '08:00', bpSys: 135, bpDia: 88, hr: 92, spo2: 93, glucose: 110 },
      { time: '12:00', bpSys: 130, bpDia: 85, hr: 88, spo2: 95, glucose: 115 },
      { time: '16:00', bpSys: 128, bpDia: 84, hr: 85, spo2: 96, glucose: 108 }
    ]
  });

  const vitalsHistory = patientVitalsMap[currentPatient?.id] || [];

  const addVitalRecord = (newVitals) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const record = {
      time: timeStr,
      bpSys: Number(newVitals.bpSys) || 120,
      bpDia: Number(newVitals.bpDia) || 80,
      hr: Number(newVitals.hr) || 72,
      spo2: Number(newVitals.spo2) || 98,
      glucose: Number(newVitals.glucose) || 95
    };

    setPatientVitalsMap(prev => ({
      ...prev,
      [currentPatient.id]: [...(prev[currentPatient.id] || []), record]
    }));

    setCurrentPatient(prev => ({
      ...prev,
      lastVitals: record
    }));

    setPatientsList(prev => prev.map(p => {
      if (p.id === currentPatient.id) {
        return { ...p, lastVitals: record };
      }
      return p;
    }));
  };

  const loadSampleVitals = () => {
    const sampleRecord = { bpSys: 124, bpDia: 82, hr: 76, spo2: 98, glucose: 98 };
    const history = [
      { time: '08:00', bpSys: 128, bpDia: 84, hr: 78, spo2: 97, glucose: 102 },
      { time: '12:00', bpSys: 126, bpDia: 82, hr: 75, spo2: 98, glucose: 99 },
      { time: '16:00', bpSys: 124, bpDia: 82, hr: 76, spo2: 98, glucose: 98 }
    ];
    setPatientVitalsMap(prev => ({
      ...prev,
      [currentPatient.id]: history
    }));
    setCurrentPatient(prev => ({
      ...prev,
      lastVitals: sampleRecord
    }));
    setPatientsList(prev => prev.map(p => {
      if (p.id === currentPatient.id) {
        return { ...p, lastVitals: sampleRecord };
      }
      return p;
    }));
  };

  // Registered Accounts (Persistent storage of patient accounts and credentials)
  const [registeredAccounts, setRegisteredAccounts] = useState([
    {
      email: 'sarah.jenkins@medisense.ai',
      password: 'patient123',
      patientId: 'pat_001',
      name: 'Sarah Jenkins',
      role: 'patient'
    },
    {
      email: 'marcus.vance@medisense.ai',
      password: 'patient123',
      patientId: 'pat_002',
      name: 'Marcus Vance',
      role: 'patient'
    },
    {
      email: 'david.miller@medisense.ai',
      password: 'patient123',
      patientId: 'pat_003',
      name: 'David Miller',
      role: 'patient'
    }
  ]);

  // Patient Registration Action
  const registerNewPatient = (formData) => {
    const newId = `pat_${String(patientsList.length + 1).padStart(3, '0')}`;
    const cleanEmail = formData.email ? formData.email.toLowerCase().trim() : `patient_${Date.now()}@medisense.ai`;
    const cleanPassword = formData.password || 'patient123';

    const newPatient = {
      id: newId,
      name: formData.name,
      email: cleanEmail,
      age: Number(formData.age) || 30,
      gender: formData.gender || 'Not specified',
      bloodType: formData.bloodType || 'O+',
      phone: formData.phone || '+1 (555) 000-0000',
      emergencyContact: formData.emergencyContact || 'Family Member',
      chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(s => s.trim()) : [],
      knownAllergies: formData.knownAllergies ? formData.knownAllergies.split(',').map(s => s.trim()) : ['None reported'],
      currentMedications: formData.currentMedications ? formData.currentMedications.split(',').map(s => s.trim()) : ['None reported'],
      lastVitals: null // Null initially for fresh registration - no fake measurements
    };

    // Store account credentials for subsequent logins
    const newAccount = {
      email: cleanEmail,
      password: cleanPassword,
      patientId: newId,
      name: formData.name,
      role: 'patient'
    };

    setRegisteredAccounts(prev => [newAccount, ...prev]);
    setPatientsList(prev => [newPatient, ...prev]);
    setCurrentPatient(newPatient);
    setCurrentUser({
      role: 'patient',
      name: newPatient.name,
      patientId: newPatient.id,
      email: cleanEmail
    });
    setActivePortal('patient');
    setPatientTab('symptoms');
    return newPatient;
  };

  // Secure Patient Authentication (Validates registered email & password)
  const loginPatient = (emailInput, passwordInput) => {
    const cleanEmail = emailInput?.toLowerCase().trim();
    const cleanPassword = passwordInput?.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both your registered email and password.' };
    }

    // 1. Search in registered accounts by email
    const account = registeredAccounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (account) {
      if (account.password !== cleanPassword) {
        return { success: false, error: 'Incorrect password for this account. Please try again.' };
      }
      const patient = patientsList.find(p => p.id === account.patientId) || {
        id: account.patientId,
        name: account.name,
        email: account.email,
        age: 30,
        gender: 'Female',
        bloodType: 'O+',
        lastVitals: null
      };
      setCurrentPatient(patient);
      setCurrentUser({
        role: 'patient',
        name: patient.name,
        patientId: patient.id,
        email: account.email
      });
      setActivePortal('patient');
      setPatientTab('symptoms');
      return { success: true };
    }

    // 2. Also check if user entered Patient ID (e.g. pat_001 or P00001)
    const patientById = patientsList.find(p => p.id.toLowerCase() === cleanEmail);
    if (patientById) {
      const acc = registeredAccounts.find(a => a.patientId === patientById.id);
      if (acc && acc.password !== cleanPassword) {
        return { success: false, error: 'Incorrect password for this Patient ID.' };
      }
      setCurrentPatient(patientById);
      setCurrentUser({
        role: 'patient',
        name: patientById.name,
        patientId: patientById.id,
        email: patientById.email || `${patientById.name.toLowerCase().replace(' ', '.')}@medisense.ai`
      });
      setActivePortal('patient');
      setPatientTab('symptoms');
      return { success: true };
    }

    return {
      success: false,
      error: `No registered patient account found for "${emailInput}". Please click "Need an account? Sign up" to create a new profile.`
    };
  };

  // Secure Clinician Authentication
  const loginClinician = (emailInput, passwordInput, role = 'doctor') => {
    // If passed a user object directly
    if (typeof emailInput === 'object' && emailInput !== null) {
      const userObj = emailInput;
      setCurrentUser(userObj);
      if (userObj.role === 'admin') {
        setActivePortal('hospital');
      } else {
        const docId = userObj.doctorId || 
          (userObj.name?.includes('Chen') ? 'doc_003' : 
           userObj.name?.includes('Mansoor') ? 'doc_002' : 
           userObj.name?.includes('Nair') ? 'doc_004' : 
           userObj.name?.includes('Zhang') ? 'doc_005' : 
           userObj.name?.includes('Morales') ? 'doc_006' : 'doc_001');
        setCurrentDoctorId(docId);
        setActivePortal('doctor');
      }
      return { success: true };
    }

    const cleanEmail = emailInput?.toLowerCase().trim();
    const cleanPassword = passwordInput?.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both your hospital staff email and security key.' };
    }

    if (cleanPassword.length < 4) {
      return { success: false, error: 'Security key must be at least 4 characters long.' };
    }

    const isAdmin = role === 'admin' || (role !== 'doctor' && (cleanEmail.startsWith('admin') || cleanEmail.includes('admin@') || cleanEmail.startsWith('hospital')));

    if (isAdmin) {
      setCurrentUser({
        role: 'admin',
        name: 'Hospital Administration Director',
        specialty: 'Chief Medical Officer / Operations',
        email: cleanEmail
      });
      setActivePortal('hospital');
    } else {
      // Find matching doctor or default to Dr. Aris Thorne
      let matchedDoc = hospitalDoctors[0]; // Dr. Aris Thorne
      if (cleanEmail.includes('nair') || cleanEmail.includes('surg')) {
        matchedDoc = hospitalDoctors.find(d => d.id === 'doc_004') || hospitalDoctors[0];
      } else if (cleanEmail.includes('chen') || cleanEmail.includes('emerg')) {
        matchedDoc = hospitalDoctors.find(d => d.id === 'doc_003') || hospitalDoctors[0];
      } else if (cleanEmail.includes('mansoor') || cleanEmail.includes('neuro')) {
        matchedDoc = hospitalDoctors.find(d => d.id === 'doc_002') || hospitalDoctors[0];
      } else if (cleanEmail.includes('zhang') || cleanEmail.includes('pulm')) {
        matchedDoc = hospitalDoctors.find(d => d.id === 'doc_005') || hospitalDoctors[0];
      } else if (cleanEmail.includes('morales') || cleanEmail.includes('endo')) {
        matchedDoc = hospitalDoctors.find(d => d.id === 'doc_006') || hospitalDoctors[0];
      } else if (cleanEmail.includes('thorne') || cleanEmail.includes('cardio')) {
        matchedDoc = hospitalDoctors.find(d => d.id === 'doc_001') || hospitalDoctors[0];
      }

      setCurrentDoctorId(matchedDoc.id);
      setCurrentUser({
        role: 'doctor',
        name: matchedDoc.name,
        title: matchedDoc.title,
        department: matchedDoc.department,
        specialty: matchedDoc.specialty,
        doctorId: matchedDoc.id,
        cabin: matchedDoc.cabin,
        contact: matchedDoc.contact,
        email: cleanEmail
      });
      setActivePortal('doctor');
    }

    return { success: true };
  };


  // General login handler (backward compatibility)
  const loginUser = (userObj) => {
    setCurrentUser(userObj);
    if (userObj.role === 'patient') {
      setActivePortal('patient');
      if (userObj.patientId) {
        const found = patientsList.find(p => p.id === userObj.patientId);
        if (found) setCurrentPatient(found);
      }
    } else {
      setActivePortal('doctor');
    }
  };

  // Logout handler
  const logoutUser = () => {
    setCurrentUser(null);
    setActivePortal('patient');
  };

  // Appointment Booking
  const bookAppointment = (data) => {
    const aptNumber = Math.floor(1000 + Math.random() * 9000);
    const tokenLetter = data.department?.includes('Cardio') ? 'OPD-B' : 'OPD-A';
    const tokenSlot = Math.floor(10 + Math.random() * 40);

    const newAppointment = {
      id: `APT-2026-${aptNumber}`,
      tokenNumber: `${tokenLetter}${tokenSlot}`,
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientAge: currentPatient.age,
      patientGender: currentPatient.gender,
      patientPhone: currentPatient.phone,
      doctorName: data.doctorName || 'Dr. Robert Chen, MD',
      doctorSpecialty: data.doctorSpecialty || 'Cardiology & Emergency Medicine',
      department: data.department || 'Cardiovascular Sciences',
      room: data.room || 'Suite 304, Wing B',
      appointmentDate: data.appointmentDate || '2026-09-08',
      timeSlot: data.timeSlot || '10:00 AM',
      consultationType: data.consultationType || 'In-Person Consultation',
      reason: data.reason || 'Clinical assessment follow-up',
      feeStatus: 'Confirmed (Receipt Generated)',
      status: 'SCHEDULED',
      bookedAt: 'Just now'
    };

    setAppointments(prev => [newAppointment, ...prev]);
    return newAppointment;
  };

  // Active reviewing case
  const activeCase = useMemo(() => {
    return cases.find(c => c.id === selectedCaseId) || null;
  }, [cases, selectedCaseId]);

  // Emergency Case count for navbar alert
  const emergencyCount = useMemo(() => {
    return cases.filter(c => c.triageLevel === 'EMERGENCY' && c.status === 'PENDING_REVIEW').length;
  }, [cases]);

  // Switch active demo patient
  const switchPatient = (patientId) => {
    const patient = patientsList.find(p => p.id === patientId) || patientsList[0];
    setCurrentPatient(patient);
  };

  // Symptom Analysis & AI Decision Engine
  const analyzeAndSubmitSymptoms = (submission) => {
    const { selectedSymptoms, generalNotes, onsetDuration, primarySeverity } = submission;
    
    const hasRedFlag = (selectedSymptoms && selectedSymptoms.some(s => s.redFlag)) || primarySeverity >= 8;
    const hasChestPain = (selectedSymptoms && selectedSymptoms.some(s => s.name.includes('Chest') || s.name.includes('Radiating'))) || generalNotes.toLowerCase().includes('chest');
    const hasRespDistress = (selectedSymptoms && selectedSymptoms.some(s => s.name.includes('Dyspnea') || s.name.includes('Wheezing'))) || generalNotes.toLowerCase().includes('breath') || generalNotes.toLowerCase().includes('wheez');
    const hasNeuroFlag = (selectedSymptoms && selectedSymptoms.some(s => s.name.includes('Headache') || s.name.includes('Weakness'))) || generalNotes.toLowerCase().includes('headache');
    const hasAppendicealFlag = (selectedSymptoms && selectedSymptoms.some(s => s.name.includes('RLQ') || s.name.includes('Rebound'))) || generalNotes.toLowerCase().includes('abdomin');

    let primaryCondition = 'Acute Clinical Symptom Complex';
    let primaryProbability = 82;
    let triageLevel = 'ROUTINE';
    let triageScore = 40;
    let urgencyAssessment = 'Routine - Clinic follow-up recommended within 48-72 hours.';
    let differentialDiagnoses = [];
    let featureWeights = [];
    let missingInformation = [];
    let similarCases = [];
    let clinicalReasoning = '';

    if (hasChestPain) {
      primaryCondition = 'Acute Coronary Syndrome (High Ischemia Likelihood)';
      primaryProbability = 91;
      triageLevel = 'EMERGENCY';
      triageScore = 95;
      urgencyAssessment = 'CRITICAL EMERGENCY: Immediate Emergency Department Evaluation & 12-Lead ECG Required.';
      differentialDiagnoses = [
        { condition: 'Acute Coronary Syndrome / NSTEMI', probability: 91, confidence: 'Critical', matchRate: 96 },
        { condition: 'Unstable Angina Pectoris', probability: 7, confidence: 'Low', matchRate: 22 },
        { condition: 'Esophageal Spasm / Non-cardiac Chest Pain', probability: 2, confidence: 'Negligible', matchRate: 8 }
      ];
      featureWeights = [
        { feature: 'Chest pressure with ischemic features', impact: '+48%', type: 'positive', description: 'Strong clinical marker of acute coronary hypoperfusion' },
        { feature: 'Autonomic symptoms (Diaphoresis / Dyspnea)', impact: '+29%', type: 'positive', description: 'Reflects severe sympathetic activation' },
        { feature: 'Severity score (' + primarySeverity + '/10)', impact: '+15%', type: 'positive', description: 'Acuity scaling from patient subjective distress' }
      ];
      missingInformation = [
        { item: 'Immediate 12-Lead Electrocardiogram (ECG)', urgency: 'CRITICAL', why: 'Rule out acute ST-Elevation (STEMI) requiring cath lab.' },
        { item: 'Quantitative High-Sensitivity Troponin I', urgency: 'CRITICAL', why: 'Detect microscopic myocardial necrosis.' },
        { item: 'Comprehensive Metabolic Panel & CBC', urgency: 'HIGH', why: 'Assess baseline renal function prior to potential contrast imaging.' }
      ];
      similarCases = [
        {
          caseId: 'HIST-8910',
          similarity: 95,
          patientProfile: `${currentPatient.age}${currentPatient.gender[0]}, Similar presentation`,
          aiPrediction: 'Acute Coronary Syndrome (89%)',
          doctorDecision: 'Accepted (Emergency angiogram)',
          outcome: 'Revascularized with drug-eluting stent. Uncomplicated recovery.'
        }
      ];
      clinicalReasoning = 'Substernal chest distress combined with high reported severity and acute onset triggers maximum priority triage in accordance with American College of Cardiology guidelines.';
    } else if (hasRespDistress) {
      primaryCondition = 'Acute Respiratory Decompensation / Bronchospasm';
      primaryProbability = 83;
      triageLevel = 'URGENT';
      triageScore = 80;
      urgencyAssessment = 'Urgent - Emergent Inhaled Bronchodilator & Oxygen Therapy Indicated.';
      differentialDiagnoses = [
        { condition: 'Severe Asthma / Reactive Airway Disease Exacerbation', probability: 83, confidence: 'High', matchRate: 89 },
        { condition: 'Acute Infectious Bronchitis', probability: 12, confidence: 'Low', matchRate: 28 },
        { condition: 'Early Lobar Pneumonia', probability: 5, confidence: 'Low', matchRate: 14 }
      ];
      featureWeights = [
        { feature: 'Airway obstruction / Dyspnea', impact: '+42%', type: 'positive', description: 'Direct ventilation limitation' },
        { feature: 'Audible wheezing and tachypnea', impact: '+31%', type: 'positive', description: 'Bronchial smooth muscle constriction' }
      ];
      missingInformation = [
        { item: 'Peak Expiratory Flow Rate (PEFR)', urgency: 'HIGH', why: 'Quantify degree of mechanical airway obstruction.' },
        { item: 'Continuous Pulse Oximetry (SpO2)', urgency: 'CRITICAL', why: 'Monitor oxygenation saturation continuous trends.' }
      ];
      similarCases = [
        {
          caseId: 'HIST-4099',
          similarity: 89,
          patientProfile: 'Adult with acute respiratory wheezing',
          aiPrediction: 'Bronchospasm / Asthma Exacerbation (85%)',
          doctorDecision: 'Accepted (Nebulizer + Prednisone)',
          outcome: 'Discharged safely after 2 hours with restored airflow.'
        }
      ];
      clinicalReasoning = 'Acutely altered breathing dynamics and elevated distress warrant urgent nebulized bronchodilation.';
    } else if (hasAppendicealFlag) {
      primaryCondition = 'Acute Appendicitis / Peritoneal Irritation';
      primaryProbability = 86;
      triageLevel = 'URGENT';
      triageScore = 84;
      urgencyAssessment = 'Urgent - Stat Surgical Evaluation & Abdominal Imaging Required.';
      differentialDiagnoses = [
        { condition: 'Acute Appendicitis', probability: 86, confidence: 'High', matchRate: 90 },
        { condition: 'Mesenteric Adenitis', probability: 10, confidence: 'Low', matchRate: 25 },
        { condition: 'Acute Diverticulitis', probability: 4, confidence: 'Negligible', matchRate: 10 }
      ];
      featureWeights = [
        { feature: 'Localized RLQ rebound tenderness', impact: '+50%', type: 'positive', description: 'Peritoneal inflammatory localization' },
        { feature: 'Gastrointestinal distress & pyrexia', impact: '+25%', type: 'positive', description: 'Systemic inflammatory response' }
      ];
      missingInformation = [
        { item: 'High-Resolution Abdominal Ultrasound or CT', urgency: 'CRITICAL', why: 'Confirm appendiceal wall thickening >6mm.' },
        { item: 'CBC with Differential (Neutrophilic Leukocytosis)', urgency: 'HIGH', why: 'Detect active internal infection markers.' }
      ];
      similarCases = [
        {
          caseId: 'HIST-3012',
          similarity: 92,
          patientProfile: 'Young adult, acute RLQ guarding',
          aiPrediction: 'Acute Appendicitis (87%)',
          doctorDecision: 'Accepted (Laparoscopic Appendectomy)',
          outcome: 'Pathology confirmed acute suppurative appendicitis. Discharge in 24h.'
        }
      ];
      clinicalReasoning = 'Classical abdominal quadrant localization with peritoneal signs mandates surgical rule-out.';
    } else if (hasNeuroFlag) {
      primaryCondition = 'Acute Neurological Evaluation Warranted';
      primaryProbability = 81;
      triageLevel = hasRedFlag ? 'EMERGENCY' : 'URGENT';
      triageScore = hasRedFlag ? 92 : 75;
      urgencyAssessment = hasRedFlag ? 'CRITICAL - Rapid Neuro Assessment & Head CT Indicated' : 'Urgent Neurological Consultation';
      differentialDiagnoses = [
        { condition: 'Cerebrovascular / Intracranial Pathology', probability: 81, confidence: 'High', matchRate: 85 },
        { condition: 'Complex Migraine Variant', probability: 14, confidence: 'Low', matchRate: 30 },
        { condition: 'Tension / Benign Cephalea', probability: 5, confidence: 'Negligible', matchRate: 15 }
      ];
      featureWeights = [
        { feature: 'Sudden onset severe neuro deficit / headache', impact: '+52%', type: 'positive', description: 'High-acuity neurological warning' }
      ];
      missingInformation = [
        { item: 'Non-Contrast Head CT Scan', urgency: 'CRITICAL', why: 'Rule out acute hemorrhage or mass lesion.' },
        { item: 'NIH Stroke Scale (NIHSS) Formal Exam', urgency: 'CRITICAL', why: 'Standardize neurological deficit scoring.' }
      ];
      similarCases = [
        {
          caseId: 'HIST-9901',
          similarity: 88,
          patientProfile: 'Neurological acute onset',
          aiPrediction: 'Intracranial pathology ruled in',
          doctorDecision: 'Accepted (Stat Neuroimaging)',
          outcome: 'Managed per acute stroke protocol with prompt neuroprotective care.'
        }
      ];
      clinicalReasoning = 'Acute neurological deficits are treated as time-critical emergencies until vascular event is excluded.';
    } else {
      primaryCondition = 'Subacute Systemic / Functional Disorder';
      primaryProbability = 72;
      triageLevel = hasRedFlag ? 'SEMI-URGENT' : 'ROUTINE';
      triageScore = hasRedFlag ? 60 : 35;
      urgencyAssessment = 'Standard Care - Clinical review and symptomatic supportive measures.';
      differentialDiagnoses = [
        { condition: 'Viral Upper Respiratory or Systemic Infection', probability: 72, confidence: 'Moderate', matchRate: 78 },
        { condition: 'General Physical Fatigue / Stress-Induced Malaise', probability: 20, confidence: 'Low', matchRate: 40 },
        { condition: 'Early Metabolic Imbalance', probability: 8, confidence: 'Low', matchRate: 18 }
      ];
      featureWeights = [
        { feature: 'Reported systemic malaise / fatigue', impact: '+35%', type: 'positive', description: 'Constitutional symptom' },
        { feature: 'Absence of cardiovascular or respiratory compromise', impact: '-25%', type: 'negative', description: 'Reassuring vital parameters' }
      ];
      missingInformation = [
        { item: 'Complete Metabolic Panel (CMP)', urgency: 'MEDIUM', why: 'Assess electrolytes and renal function.' }
      ];
      similarCases = [
        {
          caseId: 'HIST-1209',
          similarity: 90,
          patientProfile: 'Adult with constitutional fatigue',
          aiPrediction: 'Benign viral syndrome',
          doctorDecision: 'Accepted (Rest & hydration)',
          outcome: 'Complete resolution in 5 days.'
        }
      ];
      clinicalReasoning = 'Mild constitutional symptoms without hemodynamic compromise are suitable for outpatient monitoring.';
    }

    const newCaseId = `CASE-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`;
    
    const newCase = {
      id: newCaseId,
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientAge: currentPatient.age,
      patientGender: currentPatient.gender,
      submittedAt: 'Just now',
      timestamp: new Date().toISOString(),
      triageLevel,
      triageScore,
      status: 'PENDING_REVIEW',
      chiefComplaint: generalNotes || (selectedSymptoms && selectedSymptoms.map(s => s.name).join(', ')) || 'General physical malaise',
      symptoms: (selectedSymptoms && selectedSymptoms.length > 0) ? selectedSymptoms.map(s => ({
        name: s.name,
        severity: primarySeverity,
        redFlag: s.redFlag
      })) : [{ name: 'Clinical Discomfort', severity: primarySeverity, redFlag: false }],
      vitalsAtIntake: {
        bp: `${currentPatient.lastVitals.bpSys}/${currentPatient.lastVitals.bpDia} mmHg`,
        hr: `${currentPatient.lastVitals.hr} bpm`,
        spo2: `${currentPatient.lastVitals.spo2}%`,
        glucose: `${currentPatient.lastVitals.glucose} mg/dL`,
        temp: `${currentPatient.lastVitals.temp} °F`
      },
      aiAnalysis: {
        primaryCondition,
        primaryProbability,
        urgencyAssessment,
        differentialDiagnoses,
        explainableAI: {
          summary: 'AI computed clinical attribution for condition likelihood:',
          featureWeights,
          clinicalReasoning
        },
        missingInformation,
        similarCases
      },
      doctorReview: null
    };

    setCases(prev => [newCase, ...prev]);
    return newCase;
  };

  // Doctor Action: Accept AI Recommendation
  const acceptDoctorDecision = (caseId, notes = '', plan = '') => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        status: 'ACCEPTED',
        doctorReview: {
          action: 'ACCEPTED',
          doctorName: currentUser?.name || 'Dr. Robert Chen, MD',
          doctorSpecialty: currentUser?.specialty || 'Cardiology & Emergency Medicine',
          reviewedAt: 'Just now',
          clinicalNotes: notes || `Confirmed AI assessment of ${c.aiAnalysis.primaryCondition}. Clinical presentation and vitals strongly corroborate findings.`,
          confirmedCondition: c.aiAnalysis.primaryCondition,
          dischargeInstructions: plan || 'Proceed with stat ordered lab work and continuous telemetry monitoring.'
        }
      };
    }));
  };

  // Doctor Action: Override AI Recommendation
  const overrideDoctorDecision = (caseId, confirmedCondition, overrideReason, adjustedUrgency, plan = '') => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        status: 'OVERRIDDEN',
        triageLevel: adjustedUrgency || c.triageLevel,
        doctorReview: {
          action: 'OVERRIDDEN',
          doctorName: currentUser?.name || 'Dr. Robert Chen, MD',
          doctorSpecialty: currentUser?.specialty || 'Cardiology & Emergency Medicine',
          reviewedAt: 'Just now',
          overrideReason: overrideReason || 'Physician clinical exam revealed alternate pathophysiology not represented in AI baseline dataset.',
          confirmedCondition: confirmedCondition || 'Physician Revised Diagnosis',
          clinicalNotes: `AI suggested ${c.aiAnalysis.primaryCondition}, but physician examination overridden to: ${confirmedCondition}. Justification: ${overrideReason}`,
          dischargeInstructions: plan || 'Follow tailored physician clinical protocol.'
        }
      };
    }));
  };

  return (
    <MediSenseContext.Provider
      value={{
        currentUser,
        loginUser,
        loginPatient,
        loginClinician,
        registeredAccounts,
        logoutUser,
        registerNewPatient,
        activePortal,
        setActivePortal,
        patientTab,
        setPatientTab,
        doctorTab,
        setDoctorTab,
        currentPatient,
        switchPatient,
        patientsList,
        demoPatients: patientsList,
        cases,
        activeCase,
        selectedCaseId,
        setSelectedCaseId,
        reviewModalOpen,
        setReviewModalOpen,
        overrideModalOpen,
        setOverrideModalOpen,
        appointments,
        bookAppointment,
        vitalsHistory,
        addVitalRecord,
        loadSampleVitals,
        analyzeAndSubmitSymptoms,
        acceptDoctorDecision,
        overrideDoctorDecision,
        emergencyCount,
        doctorAuthModalOpen,
        setDoctorAuthModalOpen,
        hospitalDoctors,
        setHospitalDoctors,
        hospitalPatients,
        setHospitalPatients,
        updateDoctorStatus,
        currentDoctorId,
        switchDoctor,
        activeDoctor
      }}


    >
      {children}
    </MediSenseContext.Provider>
  );
}

export function useMediSense() {
  const context = useContext(MediSenseContext);
  if (!context) {
    throw new Error('useMediSense must be used within a MediSenseProvider');
  }
  return context;
}
