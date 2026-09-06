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

export const HOSPITAL_DOCTORS = [
  {
    id: 'doc_001',
    name: 'Dr. Aris Thorne, MD',
    title: 'Senior Attending Cardiologist',
    department: 'Cardiology & CCU',
    specialty: 'Interventional Cardiology & Coronary Care',
    cabin: 'Room 104 (CCU Wing)',
    dutyShift: '08:00 - 16:30 (Day Duty)',
    contact: 'Ext #4421 • Beeper #902',
    status: 'AVAILABLE', // AVAILABLE | IN_CONSULTATION | IN_SURGERY | ON_ROUNDS | ON_BREAK
    statusLabel: 'Available (Free Now)',
    nextFreeTime: 'Free Now (Next OPD: 16:30)',
    currentlyAttending: [
      {
        patientId: 'pat_001',
        patientName: 'Sarah Jenkins',
        age: 58,
        gender: 'F',
        bed: 'CCU Bed 03',
        diagnosis: 'Acute Coronary Syndrome (NSTEMI Rule-out)',
        urgency: 'EMERGENCY',
        careStatus: 'Continuous Telemetry & Serial Troponins'
      }
    ]
  },
  {
    id: 'doc_002',
    name: 'Dr. Sarah Al-Mansoor, MD',
    title: 'Chief of Clinical Neurology',
    department: 'Neurology & Stroke Center',
    specialty: 'Acute Stroke Intervention & Neurovascular',
    cabin: 'Room 312 (Neuro Diagnostic Lab)',
    dutyShift: '07:30 - 16:00 (Morning Shift)',
    contact: 'Ext #4489 • Beeper #914',
    status: 'IN_CONSULTATION',
    statusLabel: 'In Consultation',
    nextFreeTime: 'Free in 15 mins (at 15:45)',
    currentlyAttending: [
      {
        patientId: 'pat_005',
        patientName: 'Elena Rostova',
        age: 42,
        gender: 'F',
        bed: 'Neuro Bay 4B',
        diagnosis: 'Atypical Refractory Migraine with Aura',
        urgency: 'ROUTINE',
        careStatus: 'In Clinic Consultation & Fundoscopy'
      },
      {
        patientId: 'pat_011',
        patientName: 'Arthur Pendelton',
        age: 67,
        gender: 'M',
        bed: 'Stroke Unit Bed 02',
        diagnosis: 'Transient Ischemic Attack (TIA)',
        urgency: 'URGENT',
        careStatus: 'Post-MRI Diffusion Protocol Review'
      }
    ]
  },
  {
    id: 'doc_003',
    name: 'Dr. Robert Chen, MD',
    title: 'Associate Director of Emergency Medicine',
    department: 'Emergency & Trauma Services',
    specialty: 'Trauma Resuscitation & Acute Triage',
    cabin: 'Station 1 (ER Resus Bay)',
    dutyShift: '24h Trauma Call (12:00 - 24:00)',
    contact: 'Ext #9111 • Beeper #101',
    status: 'ON_ROUNDS',
    statusLabel: 'On Emergency Rounds',
    nextFreeTime: 'Free at 16:15 (Finishing ER Bedside Check)',
    currentlyAttending: [
      {
        patientId: 'pat_002',
        patientName: 'Marcus Vance',
        age: 29,
        gender: 'M',
        bed: 'ER Observation Bay 02',
        diagnosis: 'Severe Epigastric Spasms & Dehydration',
        urgency: 'URGENT',
        careStatus: 'IV Fluid Replacement & Serial Abdominal Exam'
      },
      {
        patientId: 'pat_003',
        patientName: 'David Miller',
        age: 46,
        gender: 'M',
        bed: 'ER Bay 04',
        diagnosis: 'Acute Severe Asthma Exacerbation',
        urgency: 'EMERGENCY',
        careStatus: 'Nebulized DuoNeb & Peak Flow Monitoring'
      }
    ]
  },
  {
    id: 'doc_004',
    name: 'Dr. Priya Nair, MS, FACS',
    title: 'Lead Surgical Specialist',
    department: 'General & Minimally Invasive Surgery',
    specialty: 'Acute Care Surgery & Laparoscopy',
    cabin: 'OT Suite Level 2',
    dutyShift: '08:00 - 18:00 (Surgical Schedule)',
    contact: 'Ext #4210 • Surgical Desk',
    status: 'IN_SURGERY',
    statusLabel: 'In Surgery (OT-1)',
    nextFreeTime: 'Free at 16:45 (Post-Op Scrub)',
    currentlyAttending: [
      {
        patientId: 'pat_008',
        patientName: 'Carlos Ramirez',
        age: 33,
        gender: 'M',
        bed: 'OT-1 Surgical Suite',
        diagnosis: 'Complicated Gangrenous Appendicitis',
        urgency: 'EMERGENCY',
        careStatus: 'Undergoing Laparoscopic Appendectomy'
      },
      {
        patientId: 'pat_014',
        patientName: 'Beatrice Gomez',
        age: 51,
        gender: 'F',
        bed: 'Pre-Op Holding 01',
        diagnosis: 'Symptomatic Cholelithiasis with Biliary Colic',
        urgency: 'URGENT',
        careStatus: 'Pre-Operative Anesthesia Workup'
      }
    ]
  },
  {
    id: 'doc_005',
    name: 'Dr. Michael Zhang, MD, FCCP',
    title: 'Head of Pulmonary & Critical Care Medicine',
    department: 'Pulmonology & Medical ICU',
    specialty: 'Mechanical Ventilation & ARDS Management',
    cabin: 'Room 208 (Chest Clinic / MICU)',
    dutyShift: '09:00 - 17:00 (Day Critical Care)',
    contact: 'Ext #4330 • Beeper #334',
    status: 'AVAILABLE',
    statusLabel: 'Available (Free Now)',
    nextFreeTime: 'Free Now (Standby for MICU Intake)',
    currentlyAttending: [
      {
        patientId: 'pat_009',
        patientName: 'Dorothy Hall',
        age: 72,
        gender: 'F',
        bed: 'MICU Bed 01',
        diagnosis: 'Bilateral Community-Acquired Pneumonia with Hypoxia',
        urgency: 'URGENT',
        careStatus: 'High-Flow Nasal Cannula (HFNC 40L 50% FiO2)'
      }
    ]
  },
  {
    id: 'doc_006',
    name: 'Dr. Evelyn Morales, MD',
    title: 'Consultant Endocrinologist',
    department: 'Internal Medicine & Endocrinology',
    specialty: 'Diabetic Ketoacidosis & Metabolic Emergencies',
    cabin: 'Room 118 (Endocrine Clinic)',
    dutyShift: '08:30 - 16:30 (Day Duty)',
    contact: 'Ext #4155 • Beeper #552',
    status: 'IN_CONSULTATION',
    statusLabel: 'In Consultation',
    nextFreeTime: 'Free in 20 mins (at 15:50)',
    currentlyAttending: [
      {
        patientId: 'pat_004',
        patientName: 'Anita Rao',
        age: 34,
        gender: 'F',
        bed: 'Step-Down Unit Bed 06',
        diagnosis: 'Hyperglycemia / Resolving Mild Ketosis',
        urgency: 'URGENT',
        careStatus: 'Insulin Titration & Hourly Glucometry'
      }
    ]
  }
];

export const HOSPITAL_PATIENTS = [
  {
    id: 'pat_001',
    uhid: 'UHID-2026-8921',
    name: 'Sarah Jenkins',
    age: 58,
    gender: 'Female',
    bloodType: 'A+',
    ward: 'Cardiac Care Unit (CCU)',
    bed: 'CCU Bed 03',
    admittedDiagnosis: 'Acute Coronary Syndrome (NSTEMI Rule-out)',
    chiefComplaint: 'Substernal chest pressure radiating to left arm and jaw with diaphoresis',
    triageUrgency: 'EMERGENCY',
    triageScore: 92,
    attendingDoctorId: 'doc_001',
    attendingDoctorName: 'Dr. Aris Thorne, MD',
    admissionDate: 'Today, 08:15 AM',
    vitals: { bp: '154/96 mmHg', hr: '104 bpm', spo2: '95%', temp: '98.6 °F' },
    currentCareStatus: 'Under Continuous Telemetry',
    activeMedications: ['Aspirin 325mg', 'Ticagrelor 90mg', 'Atorvastatin 80mg', 'Heparin Infusion'],
    isAdmitted: true
  },
  {
    id: 'pat_002',
    uhid: 'UHID-2026-8922',
    name: 'Marcus Vance',
    age: 29,
    gender: 'Male',
    bloodType: 'O+',
    ward: 'Emergency Trauma & Resuscitation',
    bed: 'ER Observation Bay 02',
    admittedDiagnosis: 'Acute Gastroenteritis with Moderate Dehydration',
    chiefComplaint: 'Severe epigastric pain, recurrent vomiting x 6 hours, postural dizziness',
    triageUrgency: 'URGENT',
    triageScore: 68,
    attendingDoctorId: 'doc_003',
    attendingDoctorName: 'Dr. Robert Chen, MD',
    admissionDate: 'Today, 10:30 AM',
    vitals: { bp: '122/78 mmHg', hr: '88 bpm', spo2: '99%', temp: '101.4 °F' },
    currentCareStatus: 'IV Fluid Replacement (1L RL Running)',
    activeMedications: ['Ondansetron 4mg IV', 'Normal Saline 100mL/hr', 'Pantoprazole 40mg IV'],
    isAdmitted: true
  },
  {
    id: 'pat_003',
    uhid: 'UHID-2026-8923',
    name: 'David Miller',
    age: 46,
    gender: 'Male',
    bloodType: 'B+',
    ward: 'Emergency Trauma & Resuscitation',
    bed: 'ER Bay 04',
    admittedDiagnosis: 'Acute Exacerbation of Bronchial Asthma',
    chiefComplaint: 'Severe dyspnea, audible expiratory wheeze, inability to complete full sentences',
    triageUrgency: 'EMERGENCY',
    triageScore: 88,
    attendingDoctorId: 'doc_003',
    attendingDoctorName: 'Dr. Robert Chen, MD',
    admissionDate: 'Today, 09:40 AM',
    vitals: { bp: '132/84 mmHg', hr: '112 bpm', spo2: '91%', temp: '99.2 °F' },
    currentCareStatus: 'Nebulized DuoNeb & Peak Flow Tracking',
    activeMedications: ['Albuterol/Ipratropium Nebs q20m', 'Methylprednisolone 60mg IV'],
    isAdmitted: true
  },
  {
    id: 'pat_004',
    uhid: 'UHID-2026-8924',
    name: 'Anita Rao',
    age: 34,
    gender: 'Female',
    bloodType: 'AB-',
    ward: 'Inpatient Step-Down Unit',
    bed: 'Step-Down Unit Bed 06',
    admittedDiagnosis: 'Type 1 Diabetes with Severe Hyperglycemia',
    chiefComplaint: 'Extreme polydipsia, polyuria, fingerstick glucose 246 mg/dL after missed dose',
    triageUrgency: 'URGENT',
    triageScore: 74,
    attendingDoctorId: 'doc_006',
    attendingDoctorName: 'Dr. Evelyn Morales, MD',
    admissionDate: 'Today, 11:15 AM',
    vitals: { bp: '118/74 mmHg', hr: '96 bpm', spo2: '98%', temp: '98.4 °F' },
    currentCareStatus: 'Subcutaneous Insulin Lispro Protocol',
    activeMedications: ['Insulin Lispro Sliding Scale', 'Normal Saline 150mL/hr'],
    isAdmitted: true
  },
  {
    id: 'pat_005',
    uhid: 'UHID-2026-8925',
    name: 'Elena Rostova',
    age: 42,
    gender: 'Female',
    bloodType: 'O-',
    ward: 'Neurology Diagnostic Ward',
    bed: 'Neuro Bay 4B',
    admittedDiagnosis: 'Atypical Refractory Migraine with Cervical Component',
    chiefComplaint: 'Bilateral throbbing headache, photophobia, neck stiffness without fever',
    triageUrgency: 'ROUTINE',
    triageScore: 35,
    attendingDoctorId: 'doc_002',
    attendingDoctorName: 'Dr. Sarah Al-Mansoor, MD',
    admissionDate: 'Today, 12:05 PM',
    vitals: { bp: '120/80 mmHg', hr: '72 bpm', spo2: '99%', temp: '98.6 °F' },
    currentCareStatus: 'In Clinic Consultation & Eye Examination',
    activeMedications: ['Zolmitriptan 2.5mg PRN', 'Ketorolac 30mg IM'],
    isAdmitted: false
  },
  {
    id: 'pat_006',
    uhid: 'UHID-2026-8926',
    name: 'Harold Watkins',
    age: 64,
    gender: 'Male',
    bloodType: 'A+',
    ward: 'Cardiac Care Unit (CCU)',
    bed: 'CCU Bed 01',
    admittedDiagnosis: 'Acute STEMI - Post Primary PCI Stenting',
    chiefComplaint: 'Crushing retrosternal pain relieved post drug-eluting stent placement to LAD',
    triageUrgency: 'EMERGENCY',
    triageScore: 96,
    attendingDoctorId: 'doc_001',
    attendingDoctorName: 'Dr. Aris Thorne, MD',
    admissionDate: 'Yesterday, 10:20 PM',
    vitals: { bp: '128/82 mmHg', hr: '76 bpm', spo2: '98%', temp: '98.8 °F' },
    currentCareStatus: 'Post-PCI Monitoring & Femoral Site Check',
    activeMedications: ['Dual Antiplatelet Therapy (DAPT)', 'Metoprolol Tartrate 25mg'],
    isAdmitted: true
  },
  {
    id: 'pat_007',
    uhid: 'UHID-2026-8927',
    name: 'Liam O\'Connor',
    age: 19,
    gender: 'Male',
    bloodType: 'O+',
    ward: 'Emergency Trauma & Resuscitation',
    bed: 'ER Trauma Bay 01',
    admittedDiagnosis: 'Motorcycle Road Traffic Accident - Blunt Torso Trauma',
    chiefComplaint: 'Right flank pain, contusions, FAST ultrasound positive for pelvic free fluid',
    triageUrgency: 'EMERGENCY',
    triageScore: 95,
    attendingDoctorId: 'doc_003',
    attendingDoctorName: 'Dr. Robert Chen, MD',
    admissionDate: 'Today, 02:15 PM',
    vitals: { bp: '108/68 mmHg', hr: '118 bpm', spo2: '97%', temp: '98.2 °F' },
    currentCareStatus: 'Emergency CT Angiography Scheduled',
    activeMedications: ['Tranexamic Acid 1g IV', 'Morphine Sulfate 4mg IV'],
    isAdmitted: true
  },
  {
    id: 'pat_008',
    uhid: 'UHID-2026-8928',
    name: 'Carlos Ramirez',
    age: 33,
    gender: 'Male',
    bloodType: 'B-',
    ward: 'Operating Theaters (OT Suite)',
    bed: 'OT-1 Surgical Suite',
    admittedDiagnosis: 'Acute Perforated Gangrenous Appendicitis',
    chiefComplaint: 'Severe Right Lower Quadrant pain with rebound tenderness and 102.8°F fever',
    triageUrgency: 'EMERGENCY',
    triageScore: 94,
    attendingDoctorId: 'doc_004',
    attendingDoctorName: 'Dr. Priya Nair, MS, FACS',
    admissionDate: 'Today, 01:10 PM',
    vitals: { bp: '114/72 mmHg', hr: '106 bpm', spo2: '99%', temp: '102.8 °F' },
    currentCareStatus: 'In Active Surgery (Laparoscopic Appendectomy)',
    activeMedications: ['Ceftriaxone 2g IV', 'Metronidazole 500mg IV'],
    isAdmitted: true
  },
  {
    id: 'pat_009',
    uhid: 'UHID-2026-8929',
    name: 'Dorothy Hall',
    age: 72,
    gender: 'Female',
    bloodType: 'A-',
    ward: 'Intensive Care Unit (ICU)',
    bed: 'MICU Bed 01',
    admittedDiagnosis: 'Severe Bilateral Pneumonia with Acute Respiratory Failure',
    chiefComplaint: 'Hypoxemia refractory to low-flow oxygen, bilateral basal crackles',
    triageUrgency: 'URGENT',
    triageScore: 84,
    attendingDoctorId: 'doc_005',
    attendingDoctorName: 'Dr. Michael Zhang, MD, FCCP',
    admissionDate: 'Yesterday, 04:30 PM',
    vitals: { bp: '138/86 mmHg', hr: '94 bpm', spo2: '92%', temp: '100.6 °F' },
    currentCareStatus: 'High-Flow Nasal Cannula (HFNC) at 50% FiO2',
    activeMedications: ['Levofloxacin 750mg IV', 'Dexamethasone 6mg IV'],
    isAdmitted: true
  },
  {
    id: 'pat_010',
    uhid: 'UHID-2026-8930',
    name: 'Samuel Adebayo',
    age: 53,
    gender: 'Male',
    bloodType: 'O+',
    ward: 'General Inpatient Medical Ward',
    bed: 'Ward 3B - Bed 12',
    admittedDiagnosis: 'Acute Decompensated Heart Failure (NYHA Class III)',
    chiefComplaint: 'Bilateral pitting lower extremity edema, orthopnea requiring 3 pillows',
    triageUrgency: 'URGENT',
    triageScore: 78,
    attendingDoctorId: 'doc_001',
    attendingDoctorName: 'Dr. Aris Thorne, MD',
    admissionDate: '2 days ago',
    vitals: { bp: '144/92 mmHg', hr: '84 bpm', spo2: '96%', temp: '98.4 °F' },
    currentCareStatus: 'Diuretic Therapy & Daily Weight Monitoring',
    activeMedications: ['Furosemide 40mg IV BID', 'Spironolactone 25mg', 'Sacubitril/Valsartan'],
    isAdmitted: true
  },
  {
    id: 'pat_011',
    uhid: 'UHID-2026-8931',
    name: 'Arthur Pendelton',
    age: 67,
    gender: 'Male',
    bloodType: 'AB+',
    ward: 'Neurology Diagnostic Ward',
    bed: 'Stroke Unit Bed 02',
    admittedDiagnosis: 'Transient Ischemic Attack (Left Hemisphere Syndrome)',
    chiefComplaint: 'Resolving right arm weakness and mild dysarthria lasting 25 minutes',
    triageUrgency: 'URGENT',
    triageScore: 82,
    attendingDoctorId: 'doc_002',
    attendingDoctorName: 'Dr. Sarah Al-Mansoor, MD',
    admissionDate: 'Today, 07:45 AM',
    vitals: { bp: '148/90 mmHg', hr: '80 bpm', spo2: '98%', temp: '98.5 °F' },
    currentCareStatus: 'Awaiting Carotid Doppler Ultrasound',
    activeMedications: ['Clopidogrel 75mg', 'Atorvastatin 80mg'],
    isAdmitted: true
  },
  {
    id: 'pat_012',
    uhid: 'UHID-2026-8932',
    name: 'Mei-Ling Zhou',
    age: 27,
    gender: 'Female',
    bloodType: 'B+',
    ward: 'General Inpatient Medical Ward',
    bed: 'Ward 2A - Bed 04',
    admittedDiagnosis: 'Acute Pyelonephritis with Sepsis Screen Negative',
    chiefComplaint: 'Right flank costovertebral tenderness, dysuria, chills',
    triageUrgency: 'URGENT',
    triageScore: 69,
    attendingDoctorId: 'doc_006',
    attendingDoctorName: 'Dr. Evelyn Morales, MD',
    admissionDate: 'Yesterday, 02:00 PM',
    vitals: { bp: '116/74 mmHg', hr: '90 bpm', spo2: '99%', temp: '99.8 °F' },
    currentCareStatus: 'IV Antibiotic Course Day 2 (Afebrile 12h)',
    activeMedications: ['Ceftriaxone 1g IV daily', 'Acetaminophen 650mg PRN'],
    isAdmitted: true
  },
  {
    id: 'pat_013',
    uhid: 'UHID-2026-8933',
    name: 'Robert K. Higgins',
    age: 61,
    gender: 'Male',
    bloodType: 'A+',
    ward: 'Post-Anesthesia Surgical Recovery',
    bed: 'PACU Bay 03',
    admittedDiagnosis: 'Status Post Total Knee Arthroplasty (Right)',
    chiefComplaint: 'Post-operative surgical wound monitoring and regional nerve block management',
    triageUrgency: 'ROUTINE',
    triageScore: 40,
    attendingDoctorId: 'doc_004',
    attendingDoctorName: 'Dr. Priya Nair, MS, FACS',
    admissionDate: 'Today, 06:30 AM',
    vitals: { bp: '130/80 mmHg', hr: '74 bpm', spo2: '99%', temp: '98.7 °F' },
    currentCareStatus: 'Physical Therapy Assessment & Stable on Adductor Canal Block',
    activeMedications: ['Enoxaparin 40mg SC', 'Celecoxib 200mg', 'Oxycodone 5mg PRN'],
    isAdmitted: true
  },
  {
    id: 'pat_014',
    uhid: 'UHID-2026-8934',
    name: 'Beatrice Gomez',
    age: 51,
    gender: 'Female',
    bloodType: 'O-',
    ward: 'Surgical Pre-Op Holding',
    bed: 'Pre-Op Holding 01',
    admittedDiagnosis: 'Symptomatic Cholelithiasis with Biliary Colic',
    chiefComplaint: 'Recurrent postprandial Right Upper Quadrant pain and intolerance to fatty foods',
    triageUrgency: 'URGENT',
    triageScore: 62,
    attendingDoctorId: 'doc_004',
    attendingDoctorName: 'Dr. Priya Nair, MS, FACS',
    admissionDate: 'Today, 11:30 AM',
    vitals: { bp: '124/78 mmHg', hr: '78 bpm', spo2: '98%', temp: '98.6 °F' },
    currentCareStatus: 'NPO Status & Scheduled for Lap Cholecystectomy at 17:00',
    activeMedications: ['IV Ringer Lactate', 'Ketorolac 15mg IV PRN'],
    isAdmitted: true
  },
  {
    id: 'pat_015',
    uhid: 'UHID-2026-8935',
    name: 'Lucas Dupont',
    age: 8,
    gender: 'Male',
    bloodType: 'O+',
    ward: 'Pediatric Inpatient Unit',
    bed: 'Peds Room 102',
    admittedDiagnosis: 'Pediatric Viral Croup with Stridor at Rest',
    chiefComplaint: 'Barking seal-like cough, inspiratory stridor responding to dexamethasone',
    triageUrgency: 'SEMI-URGENT',
    triageScore: 55,
    attendingDoctorId: 'doc_003',
    attendingDoctorName: 'Dr. Robert Chen, MD',
    admissionDate: 'Today, 03:00 AM',
    vitals: { bp: '100/62 mmHg', hr: '108 bpm', spo2: '98%', temp: '99.4 °F' },
    currentCareStatus: 'Humidified Air Therapy • Discharge Planned Tonight',
    activeMedications: ['Oral Dexamethasone 0.6mg/kg (single dose given)'],
    isAdmitted: true
  },
  {
    id: 'pat_016',
    uhid: 'UHID-2026-8936',
    name: 'Grace Kim',
    age: 38,
    gender: 'Female',
    bloodType: 'B+',
    ward: 'General Inpatient Medical Ward',
    bed: 'Ward 2B - Bed 08',
    admittedDiagnosis: 'Acute Uncomplicated Cellulitis of Left Lower Limb',
    chiefComplaint: 'Erythema and local warmth over left calf following minor insect bite',
    triageUrgency: 'ROUTINE',
    triageScore: 32,
    attendingDoctorId: 'doc_006',
    attendingDoctorName: 'Dr. Evelyn Morales, MD',
    admissionDate: 'Yesterday, 06:00 PM',
    vitals: { bp: '118/76 mmHg', hr: '76 bpm', spo2: '99%', temp: '98.9 °F' },
    currentCareStatus: 'Erythema Margin Demarcated and Regressing',
    activeMedications: ['Cefazolin 1g IV q8h', 'Leg Elevation Protocol'],
    isAdmitted: true
  }
];

export const HOSPITAL_BED_TELEMETRY = [
  { ward: 'Cardiac CCU', total: 20, occupied: 17, available: 3, critical: 2, occupancyRate: 85 },
  { ward: 'Medical ICU', total: 16, occupied: 13, available: 3, critical: 5, occupancyRate: 81 },
  { ward: 'Emergency Trauma Bays', total: 12, occupied: 8, available: 4, critical: 3, occupancyRate: 67 },
  { ward: 'General Inpatient Ward', total: 40, occupied: 31, available: 9, critical: 0, occupancyRate: 78 },
  { ward: 'Surgical Recovery / PACU', total: 18, occupied: 12, available: 6, critical: 1, occupancyRate: 67 },
  { ward: 'Pediatric Inpatient', total: 14, occupied: 7, available: 7, critical: 0, occupancyRate: 50 }
];

export const HOSPITAL_RESOURCES = {
  totalBeds: 120,
  totalOccupied: 88,
  overallOccupancyRate: 73.3,
  ventilators: { total: 14, inUse: 10, available: 4 },
  centralOxygen: { purity: '99.2%', reserveLiters: 4200, status: 'NOMINAL' },
  bloodBank: {
    'O-': { units: 18, status: 'ADEQUATE' },
    'A+': { units: 24, status: 'OPTIMAL' },
    'B+': { units: 30, status: 'OPTIMAL' },
    'AB+': { units: 12, status: 'RESERVE' }
  },
  operationTheaters: [
    {
      id: 'OT-1',
      name: 'General & Minimally Invasive Surgery Suite',
      surgeon: 'Dr. Priya Nair, MS, FACS',
      procedure: 'Laparoscopic Appendectomy',
      status: 'IN_SURGERY', // IN_SURGERY | STERILIZING | STANDBY
      statusLabel: 'Active Surgery in Progress',
      estimatedCompletion: '16:45'
    },
    {
      id: 'OT-2',
      name: 'Trauma & Orthopedic Reconstruction Suite',
      surgeon: 'Dr. Michael Zhang / Ortho Team',
      procedure: 'Open Reduction Internal Fixation (ORIF)',
      status: 'IN_SURGERY',
      statusLabel: 'Active Surgery in Progress',
      estimatedCompletion: '17:30'
    },
    {
      id: 'OT-3',
      name: 'Neurosurgery & Vascular Hybrid Suite',
      surgeon: 'On-Call Surgical Team',
      procedure: 'Post-Procedure Sanitization & Pre-Op Prep',
      status: 'STERILIZING',
      statusLabel: 'Sanitizing & Turnover',
      estimatedCompletion: '16:15'
    },
    {
      id: 'OT-4',
      name: 'Emergency Cardiac Catheterization Lab',
      surgeon: 'Interventional Cardiology Team (Dr. Aris Thorne)',
      procedure: 'Emergency Primary PCI Ready',
      status: 'STANDBY',
      statusLabel: '24/7 Standby for STEMI Code',
      estimatedCompletion: 'Immediate Availability'
    }
  ],
  ambulanceFleet: { total: 6, onMission: 4, atStation: 2 }
};

