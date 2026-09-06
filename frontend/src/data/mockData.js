export const BODY_SYSTEMS = [
  { id: 'cardiovascular', name: 'Cardiovascular', icon: 'Heart', color: 'rose', description: 'Heart, chest tightness, palpitations, blood pressure' },
  { id: 'respiratory', name: 'Respiratory', icon: 'Wind', color: 'cyan', description: 'Lungs, shortness of breath, wheezing, persistent cough' },
  { id: 'neurological', name: 'Neurological', icon: 'Brain', color: 'purple', description: 'Headache, dizziness, numbness, vision or balance changes' },
  { id: 'gastrointestinal', name: 'Gastrointestinal', icon: 'Activity', color: 'amber', description: 'Abdominal pain, nausea, vomiting, indigestion' },
  { id: 'endocrine', name: 'Metabolic / Endocrine', icon: 'Zap', color: 'emerald', description: 'Blood sugar, extreme thirst, fatigue, heat/cold intolerance' },
  { id: 'musculoskeletal', name: 'Musculoskeletal', icon: 'Shield', color: 'blue', description: 'Joint pain, muscle spasms, localized tenderness' },
  { id: 'systemic', name: 'Systemic / General', icon: 'Thermometer', color: 'orange', description: 'Fever, chills, night sweats, generalized weakness' },
];

export const COMMON_SYMPTOMS = [
  { id: 'sym_chest_pain', name: 'Substernal Chest Pain / Pressure', system: 'cardiovascular', redFlag: true, severityMultiplier: 2.8 },
  { id: 'sym_radiating_pain', name: 'Pain Radiating to Left Arm / Jaw', system: 'cardiovascular', redFlag: true, severityMultiplier: 2.6 },
  { id: 'sym_diaphoresis', name: 'Diaphoresis (Cold Sweats)', system: 'cardiovascular', redFlag: true, severityMultiplier: 2.2 },
  { id: 'sym_palpitations', name: 'Rapid / Irregular Heart Palpitations', system: 'cardiovascular', redFlag: false, severityMultiplier: 1.4 },
  { id: 'sym_dyspnea', name: 'Dyspnea (Shortness of Breath)', system: 'respiratory', redFlag: true, severityMultiplier: 2.4 },
  { id: 'sym_wheezing', name: 'Audible Wheezing / Stridor', system: 'respiratory', redFlag: false, severityMultiplier: 1.6 },
  { id: 'sym_cough_productive', name: 'Productive Cough with Phlegm', system: 'respiratory', redFlag: false, severityMultiplier: 1.2 },
  { id: 'sym_headache_severe', name: 'Thunderclap / Worst Headache of Life', system: 'neurological', redFlag: true, severityMultiplier: 2.9 },
  { id: 'sym_dizziness', name: 'Vertigo / Severe Lightheadedness', system: 'neurological', redFlag: false, severityMultiplier: 1.4 },
  { id: 'sym_numbness', name: 'Unilateral Facial / Arm Weakness', system: 'neurological', redFlag: true, severityMultiplier: 3.0 },
  { id: 'sym_rlq_pain', name: 'Severe RLQ Abdominal Pain with Rebound', system: 'gastrointestinal', redFlag: true, severityMultiplier: 2.5 },
  { id: 'sym_nausea', name: 'Persistent Nausea & Vomiting', system: 'gastrointestinal', redFlag: false, severityMultiplier: 1.3 },
  { id: 'sym_epigastric_burn', name: 'Epigastric Burning / Reflux', system: 'gastrointestinal', redFlag: false, severityMultiplier: 1.1 },
  { id: 'sym_high_fever', name: 'High Fever (> 102.5 F) with Chills', system: 'systemic', redFlag: true, severityMultiplier: 2.1 },
  { id: 'sym_fatigue', name: 'Severe Lethargy & Extreme Fatigue', system: 'systemic', redFlag: false, severityMultiplier: 1.2 },
  { id: 'sym_polyuria', name: 'Excessive Thirst & Frequent Urination', system: 'endocrine', redFlag: false, severityMultiplier: 1.5 },
  { id: 'sym_joint_swelling', name: 'Joint Swelling & Morning Stiffness', system: 'musculoskeletal', redFlag: false, severityMultiplier: 1.2 },
];

export const DEMO_PATIENTS = [
  {
    id: 'pat_001',
    name: 'Sarah Jenkins',
    age: 58,
    gender: 'Female',
    bloodType: 'A+',
    phone: '+1 (555) 382-9910',
    emergencyContact: 'Mark Jenkins (Husband) - +1 (555) 382-9911',
    chronicConditions: ['Hypertension (Stage 2)', 'Hyperlipidemia'],
    knownAllergies: ['Penicillin (Hives)', 'Sulfa Drugs'],
    currentMedications: ['Amlodipine 10mg OD', 'Atorvastatin 40mg HS'],
    lastVitals: { bpSys: 154, bpDia: 96, hr: 104, spo2: 95, glucose: 118, temp: 98.6 }
  },
  {
    id: 'pat_002',
    name: 'Marcus Vance',
    age: 29,
    gender: 'Male',
    bloodType: 'O+',
    phone: '+1 (555) 741-2294',
    emergencyContact: 'Linda Vance (Mother) - +1 (555) 741-2290',
    chronicConditions: ['None reported'],
    knownAllergies: ['None (NKDA)'],
    currentMedications: ['None'],
    lastVitals: { bpSys: 122, bpDia: 78, hr: 88, spo2: 99, glucose: 94, temp: 101.4 }
  },
  {
    id: 'pat_003',
    name: 'David Miller',
    age: 46,
    gender: 'Male',
    bloodType: 'B+',
    phone: '+1 (555) 902-8812',
    emergencyContact: 'Karen Miller (Wife) - +1 (555) 902-8815',
    chronicConditions: ['Moderate Persistent Asthma', 'Mild Sleep Apnea'],
    knownAllergies: ['Aspirin (Bronchospasm)'],
    currentMedications: ['Budesonide/Formoterol Inhaler', 'Montelukast 10mg'],
    lastVitals: { bpSys: 132, bpDia: 84, hr: 112, spo2: 91, glucose: 105, temp: 99.2 }
  },
  {
    id: 'pat_004',
    name: 'Anita Rao',
    age: 34,
    gender: 'Female',
    bloodType: 'AB-',
    phone: '+1 (555) 433-1099',
    emergencyContact: 'Vikram Rao (Brother) - +1 (555) 433-1098',
    chronicConditions: ['Type 1 Diabetes Mellitus (12 yrs)'],
    knownAllergies: ['Latex'],
    currentMedications: ['Insulin Glargine 22u', 'Insulin Lispro with meals'],
    lastVitals: { bpSys: 118, bpDia: 74, hr: 96, spo2: 98, glucose: 246, temp: 98.4 }
  },
  {
    id: 'pat_005',
    name: 'Elena Rostova',
    age: 42,
    gender: 'Female',
    bloodType: 'O-',
    phone: '+1 (555) 677-4401',
    emergencyContact: 'Alex Rostova (Spouse) - +1 (555) 677-4402',
    chronicConditions: ['Chronic Migraine', 'Generalized Anxiety'],
    knownAllergies: ['Codeine'],
    currentMedications: ['Propranolol 40mg', 'Zolmitriptan PRN'],
    lastVitals: { bpSys: 120, bpDia: 80, hr: 72, spo2: 99, glucose: 92, temp: 98.6 }
  }
];

export const INITIAL_CASES = [
  {
    id: 'CASE-2026-089',
    patientId: 'pat_001',
    patientName: 'Sarah Jenkins',
    patientAge: 58,
    patientGender: 'Female',
    submittedAt: '12 mins ago',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    triageLevel: 'EMERGENCY', // EMERGENCY | URGENT | SEMI-URGENT | ROUTINE
    triageScore: 94,
    status: 'PENDING_REVIEW', // PENDING_REVIEW | ACCEPTED | OVERRIDDEN
    chiefComplaint: 'Severe substernal crushing chest pressure radiating to left jaw, accompanied by cold sweat and dyspnea.',
    symptoms: [
      { name: 'Substernal Chest Pain / Pressure', severity: 9, redFlag: true },
      { name: 'Pain Radiating to Left Arm / Jaw', severity: 8, redFlag: true },
      { name: 'Diaphoresis (Cold Sweats)', severity: 8, redFlag: true },
      { name: 'Dyspnea (Shortness of Breath)', severity: 7, redFlag: true }
    ],
    vitalsAtIntake: { bp: '154/96 mmHg', hr: '104 bpm', spo2: '95%', glucose: '118 mg/dL', temp: '98.6 °F' },
    aiAnalysis: {
      primaryCondition: 'Acute Coronary Syndrome (NSTEMI / Unstable Angina)',
      primaryProbability: 89,
      urgencyAssessment: 'Critical - Immediate Emergency Department Evaluation Required',
      differentialDiagnoses: [
        { condition: 'Acute Coronary Syndrome (NSTEMI/UA)', probability: 89, confidence: 'Very High', matchRate: 94 },
        { condition: 'Gastroesophageal Reflux with Severe Esophageal Spasm', probability: 7, confidence: 'Low', matchRate: 24 },
        { condition: 'Thoracic Musculoskeletal Strain', probability: 4, confidence: 'Negligible', matchRate: 11 }
      ],
      explainableAI: {
        summary: 'AI identified high-acuity cardiac ischemia probability based on key clinical correlates:',
        featureWeights: [
          { feature: 'Retrosternal chest pressure with radiation', impact: '+44%', type: 'positive', description: 'Strongest predictor for acute myocardial ischemia' },
          { feature: 'Profuse Diaphoresis (Cold Sweats)', impact: '+28%', type: 'positive', description: 'Sympathetic nervous system response to coronary hypoperfusion' },
          { feature: 'History: Stage 2 Hypertension + Hyperlipidemia', impact: '+18%', type: 'positive', description: 'Significant baseline cardiovascular risk factors' },
          { feature: 'Tachycardia (HR 104 bpm)', impact: '+12%', type: 'positive', description: 'Hemodynamic compensation under cardiovascular stress' },
          { feature: 'SpO2 95% (Acceptable baseline)', impact: '-2%', type: 'negative', description: 'Mild reduction, not yet severe hypoxic respiratory failure' }
        ],
        clinicalReasoning: 'Co-occurrence of classic ischemic triad (retrosternal pressure, jaw radiation, diaphoresis) in a patient over 55 with chronic vascular comorbidities meets ACC/AHA high-risk criteria for ACS.'
      },
      missingInformation: [
        { item: 'Immediate 12-Lead Electrocardiogram (ECG)', urgency: 'CRITICAL', why: 'Essential to rule out acute ST-Elevation Myocardial Infarction (STEMI).' },
        { item: 'High-Sensitivity Cardiac Troponin I (hs-cTnI) Assay', urgency: 'CRITICAL', why: 'Required to confirm or exclude myocardial cellular necrosis.' },
        { item: 'Prior baseline ECG for ST/T wave comparison', urgency: 'HIGH', why: 'Differentiates preexisting ischemic changes from new acute pathology.' },
        { item: 'Bedside Echocardiogram (TTE)', urgency: 'MEDIUM', why: 'Evaluates wall motion abnormalities and left ventricular ejection fraction.' }
      ],
      similarCases: [
        {
          caseId: 'HIST-4902',
          similarity: 94,
          patientProfile: '56F, Hypertensive, Dyspnea & Diaphoresis',
          aiPrediction: 'Acute Coronary Syndrome (88%)',
          doctorDecision: 'Accepted (Emergency Cath Lab activated)',
          outcome: 'Confirmed NSTEMI with 95% LAD occlusion; successfully stented.'
        },
        {
          caseId: 'HIST-3811',
          similarity: 88,
          patientProfile: '61F, Retrosternal ache, BP 158/92',
          aiPrediction: 'Acute Coronary Syndrome (82%)',
          doctorDecision: 'Accepted (Heparin + Dual Antiplatelet started)',
          outcome: 'Troponin peak at 1.4 ng/mL; stabilized with medical revascularization.'
        }
      ]
    },
    doctorReview: null
  },
  {
    id: 'CASE-2026-088',
    patientId: 'pat_002',
    patientName: 'Marcus Vance',
    patientAge: 29,
    patientGender: 'Male',
    submittedAt: '38 mins ago',
    timestamp: new Date(Date.now() - 38 * 60000).toISOString(),
    triageLevel: 'URGENT',
    triageScore: 82,
    status: 'PENDING_REVIEW',
    chiefComplaint: 'Periumbilical pain migrating to right lower quadrant with severe rebound tenderness, low-grade fever and nausea.',
    symptoms: [
      { name: 'Severe RLQ Abdominal Pain with Rebound', severity: 9, redFlag: true },
      { name: 'Persistent Nausea & Vomiting', severity: 7, redFlag: false },
      { name: 'High Fever (> 102.5 F) with Chills', severity: 6, redFlag: false }
    ],
    vitalsAtIntake: { bp: '122/78 mmHg', hr: '88 bpm', spo2: '99%', glucose: '94 mg/dL', temp: '101.4 °F' },
    aiAnalysis: {
      primaryCondition: 'Acute Appendicitis (High Alvarado Probability)',
      primaryProbability: 84,
      urgencyAssessment: 'Urgent - Surgical Consultation & Abdominal Imaging Recommended',
      differentialDiagnoses: [
        { condition: 'Acute Appendicitis', probability: 84, confidence: 'High', matchRate: 91 },
        { condition: 'Acute Mesenteric Lymphadenitis', probability: 11, confidence: 'Moderate', matchRate: 35 },
        { condition: 'Gastroenteritis with Localized Ileitis', probability: 5, confidence: 'Low', matchRate: 18 }
      ],
      explainableAI: {
        summary: 'AI weighted migratory RLQ tenderness and systemic inflammatory markers:',
        featureWeights: [
          { feature: 'Pain localized to McBurney’s point with rebound', impact: '+48%', type: 'positive', description: 'High diagnostic specificity for acute appendiceal inflammation' },
          { feature: 'Fever (101.4 °F) + Nausea', impact: '+26%', type: 'positive', description: 'Systemic inflammatory response to peritoneal irritation' },
          { feature: 'Patient Demographics (29M)', impact: '+12%', type: 'positive', description: 'Peak epidemiological incidence bracket for appendicitis' },
          { feature: 'Absence of diarrhea', impact: '+6%', type: 'positive', description: 'Rules down routine viral gastroenteritis' }
        ],
        clinicalReasoning: 'Classical presentation of periumbilical-to-RLQ pain migration accompanied by pyrexia and peritoneal signs has >80% sensitivity for appendiceal lumen obstruction.'
      },
      missingInformation: [
        { item: 'Abdominal Ultrasound or Contrast-Enhanced CT Scan', urgency: 'CRITICAL', why: 'Direct visualization of appendiceal diameter (>6mm) and periappendiceal fat stranding.' },
        { item: 'Complete Blood Count (CBC) with Differential', urgency: 'HIGH', why: 'Check for leukocytosis and neutrophil left-shift (>75%).' },
        { item: 'Urinalysis (Microscopic)', urgency: 'MEDIUM', why: 'Exclude nephrolithiasis and acute urinary tract infection.' }
      ],
      similarCases: [
        {
          caseId: 'HIST-2914',
          similarity: 91,
          patientProfile: '27M, RLQ tenderness, Temp 101.2 °F',
          aiPrediction: 'Acute Appendicitis (86%)',
          doctorDecision: 'Accepted (Laparoscopic appendectomy ordered)',
          outcome: 'Unruptured gangrenous appendicitis excised; full recovery in 48h.'
        }
      ]
    },
    doctorReview: null
  },
  {
    id: 'CASE-2026-087',
    patientId: 'pat_003',
    patientName: 'David Miller',
    patientAge: 46,
    patientGender: 'Male',
    submittedAt: '1 hr ago',
    timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
    triageLevel: 'URGENT',
    triageScore: 78,
    status: 'PENDING_REVIEW',
    chiefComplaint: 'Acute exacerbation of shortness of breath, audible expiratory wheezing, SpO2 down to 91% on room air.',
    symptoms: [
      { name: 'Dyspnea (Shortness of Breath)', severity: 8, redFlag: true },
      { name: 'Audible Wheezing / Stridor', severity: 8, redFlag: false },
      { name: 'Productive Cough with Phlegm', severity: 6, redFlag: false }
    ],
    vitalsAtIntake: { bp: '132/84 mmHg', hr: '112 bpm', spo2: '91%', glucose: '105 mg/dL', temp: '99.2 °F' },
    aiAnalysis: {
      primaryCondition: 'Acute Severe Exacerbation of Bronchial Asthma',
      primaryProbability: 79,
      urgencyAssessment: 'Urgent - Bronchodilator Nebulization & Corticosteroid Therapy Indicated',
      differentialDiagnoses: [
        { condition: 'Acute Asthma Exacerbation', probability: 79, confidence: 'High', matchRate: 88 },
        { condition: 'Acute Bronchitis with Reactive Airway Disease', probability: 15, confidence: 'Low', matchRate: 32 },
        { condition: 'Early Community-Acquired Pneumonia', probability: 6, confidence: 'Low', matchRate: 15 }
      ],
      explainableAI: {
        summary: 'Key clinical factors contributing to asthma exacerbation score:',
        featureWeights: [
          { feature: 'Hypoxia (SpO2 91% on room air)', impact: '+38%', type: 'positive', description: 'Impending ventilation-perfusion mismatch' },
          { feature: 'Audible expiratory wheeze with tachypnea', impact: '+32%', type: 'positive', description: 'Direct indicator of acute diffuse airway bronchoconstriction' },
          { feature: 'Pre-existing Moderate Asthma History', impact: '+22%', type: 'positive', description: 'Established airway hyperresponsiveness' },
          { feature: 'Mild low-grade fever', impact: '-5%', type: 'negative', description: 'Suggests possible viral trigger or secondary infection' }
        ],
        clinicalReasoning: 'Tachycardia with SpO2 < 92% in a patient with diagnosed asthma indicates a moderate-to-severe bronchospastic episode requiring emergent nebulization.'
      },
      missingInformation: [
        { item: 'Peak Expiratory Flow Rate (PEFR)', urgency: 'HIGH', why: 'Measures airflow limitation severity (<50% predicted warrants aggressive protocol).' },
        { item: 'Chest X-Ray (PA View)', urgency: 'MEDIUM', why: 'Rule out pneumothorax, atelectasis, or lobar consolidation.' },
        { item: 'Arterial Blood Gas (ABG)', urgency: 'HIGH', why: 'Assess PaCO2 to ensure patient is not developing hypercapnic respiratory fatigue.' }
      ],
      similarCases: [
        {
          caseId: 'HIST-5501',
          similarity: 88,
          patientProfile: '44M, SpO2 90%, Wheezing & Asthma history',
          aiPrediction: 'Acute Asthma Exacerbation (84%)',
          doctorDecision: 'Accepted (Nebulized Albuterol/Ipratropium + IV Methylprednisolone)',
          outcome: 'SpO2 recovered to 97% within 90 minutes; discharged with oral taper.'
        }
      ]
    },
    doctorReview: null
  },
  {
    id: 'CASE-2026-085',
    patientId: 'pat_004',
    patientName: 'Anita Rao',
    patientAge: 34,
    patientGender: 'Female',
    submittedAt: '3 hrs ago',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    triageLevel: 'SEMI-URGENT',
    triageScore: 68,
    status: 'ACCEPTED',
    chiefComplaint: 'Polyuria, dry mouth, blurred vision, fingerstick blood glucose 246 mg/dL after missing evening insulin dose.',
    symptoms: [
      { name: 'Excessive Thirst & Frequent Urination', severity: 7, redFlag: false },
      { name: 'Severe Lethargy & Extreme Fatigue', severity: 6, redFlag: false }
    ],
    vitalsAtIntake: { bp: '118/74 mmHg', hr: '96 bpm', spo2: '98%', glucose: '246 mg/dL', temp: '98.4 °F' },
    aiAnalysis: {
      primaryCondition: 'Acute Hyperglycemia with Risk of Early Diabetic Ketoacidosis (DKA)',
      primaryProbability: 76,
      urgencyAssessment: 'Semi-Urgent - Check Serum/Urine Ketones & Fluid Resuscitation',
      differentialDiagnoses: [
        { condition: 'Hyperglycemia in T1DM (Missed Dose)', probability: 76, confidence: 'High', matchRate: 85 },
        { condition: 'Early Diabetic Ketoacidosis (DKA)', probability: 19, confidence: 'Moderate', matchRate: 42 },
        { condition: 'Transient Postprandial Dysglycemia', probability: 5, confidence: 'Low', matchRate: 10 }
      ],
      explainableAI: {
        summary: 'AI identified missed insulin with high glucometry in Type 1 diabetic:',
        featureWeights: [
          { feature: 'Capillary Glucose 246 mg/dL + T1DM', impact: '+45%', type: 'positive', description: 'Immediate risk of metabolic decompensation in insulin deficiency' },
          { feature: 'Polydipsia & Osmotic Polyuria', impact: '+32%', type: 'positive', description: 'Hallmark signs of renal glucose threshold exceedance' },
          { feature: 'Normal SpO2 and absence of Kussmaul breathing', impact: '-12%', type: 'negative', description: 'Rules out late-stage severe acidemic hyperventilation' }
        ],
        clinicalReasoning: 'T1D patient with blood glucose >240 requires ketone screening to differentiate simple hyperglycemia from impending ketosis.'
      },
      missingInformation: [
        { item: 'Serum Beta-Hydroxybutyrate / Urine Ketones', urgency: 'CRITICAL', why: 'Essential to confirm or rule out ketone bodies accumulation.' },
        { item: 'Serum Electrolyte Panel (Anion Gap Calculation)', urgency: 'HIGH', why: 'Evaluate for metabolic acidosis and potassium shifts.' }
      ],
      similarCases: [
        {
          caseId: 'HIST-1123',
          similarity: 92,
          patientProfile: '31F, T1DM, Glucose 260 mg/dL, Polyuria',
          aiPrediction: 'Hyperglycemia / Ketosis Risk (78%)',
          doctorDecision: 'Accepted (Subcutaneous corrective insulin + oral rehydration)',
          outcome: 'Ketones negative; euglycemia achieved in 4 hours.'
        }
      ]
    },
    doctorReview: {
      action: 'ACCEPTED',
      doctorName: 'Dr. Robert Chen, MD',
      doctorSpecialty: 'Endocrinology & Internal Medicine',
      reviewedAt: '2 hrs ago',
      clinicalNotes: 'Concur with AI differential. Administered 4 units rapid-acting insulin lispro with 1L IV normal saline. Urine ketones tested negative. Patient advised on basal insulin compliance.',
      confirmedCondition: 'Acute Hyperglycemia secondary to missed insulin dose',
      dischargeInstructions: 'Monitor blood glucose q2h. Resume basal insulin tonight at standard 22 units.'
    }
  },
  {
    id: 'CASE-2026-082',
    patientId: 'pat_005',
    patientName: 'Elena Rostova',
    patientAge: 42,
    patientGender: 'Female',
    submittedAt: '5 hrs ago',
    timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
    triageLevel: 'ROUTINE',
    triageScore: 35,
    status: 'OVERRIDDEN',
    chiefComplaint: 'Bilateral band-like squeezing head pressure, mild eye strain, no nausea or focal neurological signs.',
    symptoms: [
      { name: 'Thunderclap / Worst Headache of Life', severity: 4, redFlag: false },
      { name: 'Severe Lethargy & Extreme Fatigue', severity: 4, redFlag: false }
    ],
    vitalsAtIntake: { bp: '120/80 mmHg', hr: '72 bpm', spo2: '99%', glucose: '92 mg/dL', temp: '98.6 °F' },
    aiAnalysis: {
      primaryCondition: 'Episodic Tension-Type Headache',
      primaryProbability: 88,
      urgencyAssessment: 'Routine - Outpatient Symptom Management',
      differentialDiagnoses: [
        { condition: 'Episodic Tension-Type Headache', probability: 88, confidence: 'High', matchRate: 92 },
        { condition: 'Migraine without Aura', probability: 9, confidence: 'Low', matchRate: 20 },
        { condition: 'Cervicogenic Headache', probability: 3, confidence: 'Low', matchRate: 12 }
      ],
      explainableAI: {
        summary: 'AI detected bilateral non-pulsatile headache pattern:',
        featureWeights: [
          { feature: 'Bilateral band-like distribution', impact: '+52%', type: 'positive', description: 'Characteristic of tension-type pathology' },
          { feature: 'Absence of meningeal or focal signs', impact: '+30%', type: 'positive', description: 'Reassuring against intracranial mass or infection' },
          { feature: 'Normal blood pressure (120/80 mmHg)', impact: '+15%', type: 'positive', description: 'Rules out hypertensive urgency headache' }
        ],
        clinicalReasoning: 'Mild moderate bilateral headache without photophobia/nausea aligns with tension headache criteria.'
      },
      missingInformation: [
        { item: 'Fundoscopic Eye Examination', urgency: 'LOW', why: 'Confirm absence of papilledema if headaches persist >2 weeks.' }
      ],
      similarCases: [
        {
          caseId: 'HIST-7703',
          similarity: 95,
          patientProfile: '40F, Tension headache, work stress',
          aiPrediction: 'Tension-Type Headache (90%)',
          doctorDecision: 'Accepted (Acetaminophen + ergonomic advisory)',
          outcome: 'Complete resolution within 24 hours.'
        }
      ]
    },
    doctorReview: {
      action: 'OVERRIDDEN',
      doctorName: 'Dr. Sarah Al-Mansoor, MD',
      doctorSpecialty: 'Neurology',
      reviewedAt: '4 hrs ago',
      clinicalNotes: 'Overridden AI Primary diagnosis of Tension Headache. Patient has known refractory migraine history and reports mild unilateral neck stiffness on targeted exam. Reclassified as Atypical Migraine with Cervical Component. Prescribed Zolmitriptan 2.5mg PRN.',
      confirmedCondition: 'Atypical Migraine with Cervicogenic Component',
      overrideReason: 'Clinical history of diagnosed chronic migraines and unilateral cervical trigger points not captured in initial symptom checklist.',
      dischargeInstructions: 'Take Zolmitriptan at earliest migraine onset. Avoid screen glare and maintain sleep hygiene.'
    }
  }
];

export const INITIAL_VITALS_HISTORY = [
  { time: '08:00', bpSys: 148, bpDia: 92, hr: 98, spo2: 96, glucose: 124 },
  { time: '10:00', bpSys: 154, bpDia: 96, hr: 104, spo2: 95, glucose: 118 },
  { time: '12:00', bpSys: 142, bpDia: 88, hr: 88, spo2: 97, glucose: 112 },
  { time: '14:00', bpSys: 136, bpDia: 86, hr: 82, spo2: 98, glucose: 108 },
  { time: '16:00', bpSys: 130, bpDia: 84, hr: 78, spo2: 98, glucose: 104 },
  { time: '18:00', bpSys: 126, bpDia: 82, hr: 76, spo2: 99, glucose: 98 }
];
