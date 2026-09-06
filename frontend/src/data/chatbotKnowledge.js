/**
 * MediSense AI - Clinical Knowledge Base & NLP Engine for "Medi" Chatbot
 * Empathetic, clinical, proactive, bilingual (English + Hinglish), and action-oriented.
 * Supports both Guest (Pre-Login) and Authenticated Patient modes.
 */

export function getMediResponse(query, patientName = 'Patient', isGuest = false) {
  const raw = query.trim();
  const q = raw.toLowerCase();
  const firstName = isGuest ? 'Visitor' : (patientName.split(' ')[0] || 'Patient');

  // Helper to construct response
  const build = ({ text, actionTab = null, actionLabel = null, isEmergency = false, quickReplies = [] }) => ({
    text,
    actionTab,
    actionLabel,
    isEmergency,
    quickReplies
  });

  // Check if the query is asking about clinical symptoms, pain, sickness, or diagnosis
  const isSymptomRelated = 
    q.includes('pain') || q.includes('dard') || q.includes('fever') || q.includes('bukhar') ||
    q.includes('chest') || q.includes('chhati') || q.includes('heart') || q.includes('headache') ||
    q.includes('sir dard') || q.includes('sar dard') || q.includes('stomach') || q.includes('pet dard') ||
    q.includes('cough') || q.includes('khansi') || q.includes('cold') || q.includes('vomit') ||
    q.includes('ulti') || q.includes('saans') || q.includes('breathe') || q.includes('dizzy') ||
    q.includes('chakkar') || q.includes('stroke') || q.includes('cramps') || q.includes('ache') ||
    q.includes('hurts') || q.includes('takleef') || q.includes('symptom') || q.includes('check symptoms') ||
    q.includes('bimari') || q.includes('diagnos') || q.includes('ill') || q.includes('sick') ||
    q.includes('throat') || q.includes('gala') || q.includes('infection') || q.includes('bp') ||
    q.includes('sugar') || q.includes('spo2') || q.includes('blood pressure') || q.includes('glucose');

  // =========================================================================
  // RULE 1: IF GUEST / PRE-LOGIN VISITOR ASKS ABOUT SYMPTOMS -> PROMPT LOGIN!
  // =========================================================================
  if (isGuest && isSymptomRelated) {
    const isLifeThreatening = q.includes('chest') || q.includes('chhati') || q.includes('heart') || q.includes('stroke') || q.includes('breath');
    return build({
      text: `${isLifeThreatening ? '🚨 **URGENT NOTICE:** If you are in immediate life-threatening danger, call emergency services (911 / 112) immediately!\n\n' : ''}I notice you are asking to analyze symptoms or clinical conditions. 🩺🔒\n\nTo run our **AI Symptom Checker**, compute your emergency triage score, and connect you with hospital doctors, **you must Sign In or Register a Patient Account first**!\n\n*Why is login required?*\nUnder hospital clinical safety protocols, your reported symptoms, acute pain score (1-10), and biometric vitals must be securely linked to a verified patient medical record so that our on-duty physicians can review your case and issue official OPD token receipts.\n\nPlease choose an option below to proceed:`,
      actionTab: null,
      actionLabel: null,
      isEmergency: isLifeThreatening,
      quickReplies: [
        { label: '👤 Sign In as Patient', authAction: 'patient_signin' },
        { label: '📝 New Patient Sign Up', authAction: 'patient_signup' },
        { label: '⚡ Fill Demo Account (Sarah)', authAction: 'demo_patient' },
        { label: '💡 How does Symptom Checker work?', text: 'How does the symptom checker work?' }
      ]
    });
  }

  // =========================================================================
  // HOW SYMPTOM CHECKER WORKS (EDUCATIONAL / TOUR)
  // =========================================================================
  if (q.includes('how does the symptom checker work') || q.includes('symptom checker kaise')) {
    return build({
      text: `🩺 **How the MediSense AI Symptom Checker Works:**\n\n1. **Organ System Selection:** You select the affected body system (Cardiovascular, Respiratory, Neurological, Abdominal, or Musculoskeletal).\n2. **Symptom Tagging & Notes:** Tap on verified clinical symptom tags or type your complaint in plain English or Hindi.\n3. **Pain Severity Scale:** Set your subjective pain slider from 1 (mild) to 10 (unbearable).\n4. **Instant AI Triage:** The AI evaluates your input against clinical decision guidelines and assigns a triage acuity level:\n   • 🚨 **EMERGENCY (Red):** Immediate hospital care / 911 alert\n   • ⚠️ **URGENT (Amber):** Same-day priority physician review\n   • 🟢 **ROUTINE (Green):** Scheduled clinic consultation\n5. **Explainable AI (XAI):** Transparent feature weights show exactly why the AI reached its prediction.\n\n${isGuest ? '👉 **Please sign in or create an account to try the live symptom checker!**' : '👉 **Switch to the AI Symptom Checker tab to begin!**'}`,
      actionTab: isGuest ? null : 'symptoms',
      actionLabel: isGuest ? null : '🩺 Open Symptom Checker',
      quickReplies: isGuest ? [
        { label: '👤 Sign In as Patient', authAction: 'patient_signin' },
        { label: '📝 Register Account', authAction: 'patient_signup' },
        { label: '⚡ Test with Demo Account', authAction: 'demo_patient' }
      ] : [
        { label: '🩺 Open Symptom Checker', tab: 'symptoms' }
      ]
    });
  }

  // =========================================================================
  // HOW TO SIGN IN / TEST WITH DEMO
  // =========================================================================
  if (
    q.includes('how to sign in') || q.includes('how do i sign in') || q.includes('login kaise') ||
    q.includes('demo account') || q.includes('test account') || q.includes('credentials')
  ) {
    return build({
      text: `🔐 **How to Sign In & Test MediSense AI:**\n\n• **For Registered Patients:** Enter your registered email and password in the **Patient Portal** tab and click *"Sign In as Patient"*.\n• **For New Patients:** Click *"Need an account? Sign up here"* at the bottom of the sign-in card to create a fresh medical profile.\n• **For Instant Demo Testing:** Click the **"Sarah Jenkins (Demo)"** button on the card to populate demo credentials (\`sarah.jenkins@medisense.ai\` / \`patient123\`) and click Sign In.\n• **For Doctors & Hospitals:** Switch to the **"Doctor / Hospital"** tab at the top and log in with hospital credentials (\`dr.chen@medisense.hospital.org\` / \`doctor123\`).`,
      quickReplies: [
        { label: '👤 Patient Sign In', authAction: 'patient_signin' },
        { label: '📝 New Patient Sign Up', authAction: 'patient_signup' },
        { label: '🩺 Doctor / Hospital Tab', authAction: 'doctor' },
        { label: '⚡ Fill Demo Account (Sarah)', authAction: 'demo_patient' }
      ]
    });
  }

  // =========================================================================
  // DOCTOR / HOSPITAL FEATURES
  // =========================================================================
  if (
    q.includes('doctor') || q.includes('hospital') || q.includes('physician') ||
    q.includes('what can doctors do') || q.includes('admin') || q.includes('xai') ||
    q.includes('command center')
  ) {
    return build({
      text: `🏥 **Doctor & Hospital Command Center Features:**\n\nOur platform gives physicians high-precision tools while keeping humans firmly in control (**"AI assists. Doctors decide."**):\n\n1. **Prioritized Triage Queue:** Real-time patient cases sorted automatically by urgency (Emergency > Urgent > Routine).\n2. **Explainable AI (XAI) Attribution:** Mathematical feature weights (e.g. *"+48% from substernal chest pressure"*) eliminate the black box.\n3. **Missing Clinical Test Alerts:** Warns the physician to order missing mandatory labs (e.g. 12-Lead ECG or Troponin) before confirming a diagnosis.\n4. **1,500+ Synthetic Cohort Matching:** Benchmarks acute cases against historical patient cohort outcomes.\n5. **1-Click Accept / Override Audit:** Legal compliance trail logging physician confirmations and overrides with timestamps.\n6. **Hospital Capacity Telemetry:** Real-time tracking of CCU, Trauma, and General Ward bed occupancy.`,
      quickReplies: isGuest ? [
        { label: '🩺 Switch to Doctor / Hospital', authAction: 'doctor' },
        { label: '⚡ Fill Doctor Demo (Dr. Chen)', authAction: 'demo_doctor' },
        { label: '👤 Back to Patient Sign In', authAction: 'patient_signin' }
      ] : [
        { label: '🩺 Open Doctor Command', tab: 'doctor' }
      ]
    });
  }

  // =========================================================================
  // GREETINGS & INTRODUCTIONS
  // =========================================================================
  if (/^(hi|hello|hey|namaste|hola|good morning|good afternoon|good evening|kaise ho|kya haal|sasriyakaal|salaam)\b/.test(q)) {
    return build({
      text: `Hello ${firstName}! 👋 I am **Medi**, your clinical AI health companion at MediSense AI.\n\n${isGuest ? 'I am here to guide you through the platform, explain how our AI assists patients and doctors, and help you get started.' : 'I am here 24/7 to help you check symptoms, book doctor visits with OPD receipts, and track your vital telemetry.'}\n\nHow can I help you today? You can type or tap the 🎙️ **Mic** button to talk!`,
      quickReplies: isGuest ? [
        { label: '💡 How to Use This App', text: 'How to use this app?' },
        { label: '🩺 How Symptom Checker Works', text: 'How does the symptom checker work?' },
        { label: '🏥 Doctor & Hospital Features', text: 'What can doctors do?' },
        { label: '⚡ How to Sign In or Test?', text: 'How do I sign in or test?' }
      ] : [
        { label: '🩺 Check My Symptoms', tab: 'symptoms' },
        { label: '📅 Book Doctor & Get Receipt', tab: 'appointments' },
        { label: '📊 Health Vitals & BP', tab: 'vitals' },
        { label: '💡 How to Use This App', text: 'How to use this app?' }
      ]
    });
  }

  // =========================================================================
  // WHO ARE YOU / IDENTITY
  // =========================================================================
  if (q.includes('who are you') || q.includes('koun ho') || q.includes('kya kar sakte ho') || q.includes('about medi') || q.includes('what is medi')) {
    return build({
      text: `I am **Medi** 🤖, the clinical AI assistant built into MediSense AI.\n\nMy purpose is to guide users smoothly through the hospital platform while upholding our core standard: **"AI assists. Doctors decide."**\n\nI can:\n• Explain all 5 platform modules step-by-step\n• Help patients navigate symptom checks, appointments, and vitals\n• Assist physicians in understanding Explainable AI (XAI) weights\n• Guide new users on how to register and sign in\n\n${isGuest ? '*(Note: To analyze acute symptoms and receive clinical triage, please sign in or register first!)*' : ''}`,
      quickReplies: isGuest ? [
        { label: '💡 App Walkthrough', text: 'How to use this app?' },
        { label: '👤 Sign In as Patient', authAction: 'patient_signin' },
        { label: '🩺 Doctor & Hospital Portal', authAction: 'doctor' }
      ] : [
        { label: '🩺 Try Symptom Checker', tab: 'symptoms' },
        { label: '💡 Full App Walkthrough', text: 'How to use this app?' },
        { label: '📅 View Doctors Available', tab: 'appointments' }
      ]
    });
  }

  // =========================================================================
  // COMPLETE APP WALKTHROUGH & GUIDE ("HOW TO USE", "APP KAISE USE KARE")
  // =========================================================================
  if (
    q.includes('how to use') || q.includes('kaise use') || q.includes('app guide') ||
    q.includes('tour') || q.includes('features') || q.includes('help') || q.includes('madad') ||
    q.includes('kya kya hai') || q.includes('guide me') || q.includes('guide')
  ) {
    return build({
      text: `Welcome to **MediSense AI**! Here is a step-by-step master guide to the entire platform:\n\n1️⃣ **🩺 AI Symptom Checker:**\nSelect the affected organ system (Cardiovascular, Respiratory, Neuro, Abdominal, Musculoskeletal), tag symptoms, set your pain severity slider (1-10), and click *"Analyze"*. Get an instant triage rating (Emergency, Urgent, Routine) with transparent Explainable AI feature weights!\n\n2️⃣ **📅 Book Appointment & Receipts:**\nPick an on-duty specialist (Dr. Robert Chen - Cardiology, Dr. Sarah Al-Mansoor - Neurology, Dr. Michael Chang - Pulmonology), select a time slot, and generate an official printable **OPD Token Receipt** (\`#OPD-B14\`) with room details!\n\n3️⃣ **📊 Health Vitals Tracking:**\nMonitor your continuous Blood Pressure and Oxygen SpO2 trends with interactive Recharts telemetry. Easily record new baseline measurements.\n\n4️⃣ **👤 Health Profile & Digital ID:**\nReview documented allergies, active medications, and print your smart Digital Health ID card with a QR verification pass.\n\n5️⃣ **🏥 Doctor & Hospital Command:**\nPhysicians review acuity-ranked triage queues, inspect XAI attribution, order missing labs, and confirm or override AI recommendations with a legal audit trail.\n\n${isGuest ? '👉 **Please sign in or create an account to begin using these features!**' : 'Which section would you like to explore?'}`,
      quickReplies: isGuest ? [
        { label: '👤 Sign In as Patient', authAction: 'patient_signin' },
        { label: '📝 Register New Patient', authAction: 'patient_signup' },
        { label: '🩺 Doctor / Hospital Portal', authAction: 'doctor' },
        { label: '⚡ Try Demo Patient', authAction: 'demo_patient' }
      ] : [
        { label: '🩺 AI Symptom Checker', tab: 'symptoms' },
        { label: '📅 Book Appointment', tab: 'appointments' },
        { label: '📊 Health Vitals', tab: 'vitals' },
        { label: '👤 Digital Health Card', tab: 'profile' }
      ]
    });
  }

  // =========================================================================
  // APPOINTMENTS & OPD RECEIPTS
  // =========================================================================
  if (
    q.includes('appointment') || q.includes('book') || q.includes('receipt') ||
    q.includes('token') || q.includes('opd')
  ) {
    return build({
      text: `📅 **Doctor Appointments & OPD Token Receipts:**\n\nMediSense AI lets patients schedule consultations with verified hospital specialists and generate instant official OPD token receipts:\n\n👨‍⚕️ **Available Specialists:**\n• **Dr. Robert Chen, MD** — Cardiology & Emergency Triage (Suite 304, Wing B)\n• **Dr. Sarah Al-Mansoor, MD** — Neurology & Stroke Evaluation (Room 412)\n• **Dr. Michael Chang, MD** — Pulmonology & Respiratory Care (Room 208, West Wing)\n\n🧾 **How OPD Receipts Work:**\n1. Select your specialist, date, and preferred time slot\n2. Click *"Confirm Appointment & Generate Token Receipt"*\n3. Download or print your official hospital receipt with Token Number (e.g. \`#OPD-B14\`), room details, and QR barcode!\n\n${isGuest ? '👉 **Please sign in to book your consultation!**' : ''}`,
      actionTab: isGuest ? null : 'appointments',
      actionLabel: isGuest ? null : '📅 Book Doctor & Get Receipt',
      quickReplies: isGuest ? [
        { label: '👤 Sign In to Book', authAction: 'patient_signin' },
        { label: '📝 Create Account', authAction: 'patient_signup' },
        { label: '⚡ Fill Demo Account', authAction: 'demo_patient' }
      ] : [
        { label: '📅 Book Doctor Appointment', tab: 'appointments' },
        { label: '🧾 View My Bookings & Receipts', tab: 'appointments' }
      ]
    });
  }

  // =========================================================================
  // AUTHENTICATED PATIENT PROBING FOR PAIN & SYMPTOMS (When isGuest === false)
  // =========================================================================
  if (
    q === 'pain' || q === 'pain ' || q === 'dard' || q === 'dard ' ||
    q.includes('body pain') || q.includes('bohot dard') || q.includes('severe pain') ||
    q.includes('takleef') || q.includes('hurts')
  ) {
    return build({
      text: `I am very sorry to hear you are experiencing pain, ${firstName}. Pain is a crucial clinical signal that requires immediate attention.\n\nTo give you the most accurate triage guidance and safety recommendations, **where is the pain located?**\n\n• 🚨 **Chest / Left Arm / Jaw** — High-priority acute cardiac risk\n• 🧠 **Head / Migraine** — Severe throbbing or sudden onset\n• 🤢 **Stomach / Abdomen** — Right lower side (appendix), burning acidity, or cramps\n• 🦴 **Joints / Back / Muscles** — Stiffness, swelling, or movement ache\n• 👄 **Throat / Neck** — Difficulty swallowing or swollen tonsils\n\nPlease select your pain area below, or tap **"Open AI Symptom Checker"** for a full assessment:`,
      actionTab: 'symptoms',
      actionLabel: '🩺 Open AI Symptom Checker',
      quickReplies: [
        { label: '🚨 Chest Pain (Urgent)', text: 'I have chest pain' },
        { label: '🧠 Severe Headache', text: 'I have a headache' },
        { label: '🤢 Stomach / Abdomen', text: 'I have stomach pain' },
        { label: '🦴 Joint / Back Pain', text: 'I have joint or back pain' },
        { label: '👄 Sore Throat / Neck', text: 'I have a sore throat' }
      ]
    });
  }

  // CRITICAL RED-FLAG: CHEST PAIN & CARDIAC (Authenticated)
  if (
    q.includes('chest') || q.includes('chhati') || q.includes('heart') ||
    q.includes('dil') || q.includes('angina') || q.includes('jaw pain') || q.includes('arm pain')
  ) {
    return build({
      text: `🚨 **CRITICAL RED-FLAG: CARDIAC EMERGENCY ALERT!**\n\n${firstName}, chest discomfort radiating to the left arm, neck, or jaw—especially if accompanied by shortness of breath, cold sweating, or dizziness—can be a sign of **Acute Coronary Syndrome (Heart Attack)**.\n\n⚠️ **Urgent Action Steps:**\n1. **Call emergency services (911 or 112)** immediately or have someone drive you to the nearest ER. **Do not drive yourself.**\n2. Sit upright in a comfortable position and loosen tight clothing.\n3. Chew an Aspirin (325mg) if advised by medical personnel and not allergic.\n\nI have prepared the emergency triage intake for you. Please click below so hospital cardiologists are alerted immediately:`,
      actionTab: 'symptoms',
      actionLabel: '🚨 Run Emergency Cardiac Triage',
      isEmergency: true,
      quickReplies: [
        { label: '🚨 Run Emergency Triage', tab: 'symptoms' },
        { label: '📅 Book Urgent Cardiology Visit', tab: 'appointments' },
        { label: '📊 View Heart Rate Telemetry', tab: 'vitals' }
      ]
    });
  }

  // HEADACHE & NEUROLOGICAL (Authenticated)
  if (q.includes('headache') || q.includes('sir dard') || q.includes('sar dard') || q.includes('migraine') || q.includes('chakkar')) {
    return build({
      text: `Headaches can range from common tension headaches and migraines to neurological red-flags.\n\n⚠️ **When to seek Emergency Care (Rule out stroke):**\n• Sudden, explosive "thunderclap" headache (the worst pain of your life)\n• Accompanied by facial numbness, slurred speech, or arm weakness\n• High fever with a stiff neck\n\n💡 Rest in a quiet, dark room, drink 500ml water, and tag your symptoms in our **AI Symptom Checker** for physician review.`,
      actionTab: 'symptoms',
      actionLabel: '🩺 Check Headache Severity',
      quickReplies: [
        { label: '🩺 Check Headache Symptoms', tab: 'symptoms' },
        { label: '📅 Book Dr. Sarah (Neurology)', tab: 'appointments' },
        { label: '📊 Check Blood Pressure (BP)', tab: 'vitals' }
      ]
    });
  }

  // STOMACH & ABDOMINAL (Authenticated)
  if (q.includes('stomach') || q.includes('pet dard') || q.includes('abdomen') || q.includes('acidity') || q.includes('appendix')) {
    return build({
      text: `Abdominal pain requires careful assessment:\n\n• **Lower Right Abdomen (RLQ):** If sharp pain started around the belly button and moved to the lower right side with tenderness, rule out **Acute Appendicitis**!\n• **Upper Epigastric:** Burning after meals often indicates acid reflux or gastritis.\n• ⚠️ **Red Flags:** Severe tenderness, persistent vomiting, high fever, or blood in stool.\n\nRun an analysis in the Symptom Checker to compute your Alvarado probability score!`,
      actionTab: 'symptoms',
      actionLabel: '🩺 Check Abdominal Symptoms',
      quickReplies: [
        { label: '🩺 Run Abdominal Assessment', tab: 'symptoms' },
        { label: '📅 Consult General Physician', tab: 'appointments' }
      ]
    });
  }

  // FEVER & INFECTIONS (Authenticated)
  if (q.includes('fever') || q.includes('bukhar') || q.includes('temperature') || q.includes('chills')) {
    return build({
      text: `Fever indicates your immune system is responding to a viral, bacterial, or seasonal infection.\n\n🌡️ **Guidelines:**\n• **Mild:** 99.5°F - 100.4°F\n• **High:** >102.5°F (39.2°C) — requires prompt antipyretic review.\n• Hydrate with warm fluids and ORS. If fever persists >3 days or brings shortness of breath, consult a physician immediately.\n\nYou can book a fever consultation or log your temperature in vitals!`,
      actionTab: 'appointments',
      actionLabel: '📅 Book Fever Consultation',
      quickReplies: [
        { label: '📅 Book Fever Consultation', tab: 'appointments' },
        { label: '📊 Log Vitals Reading', tab: 'vitals' },
        { label: '🩺 Check All Symptoms', tab: 'symptoms' }
      ]
    });
  }

  // THANK YOU & CLOSING
  if (q.includes('thank') || q.includes('shukriya') || q.includes('dhanyawad') || q.includes('bye') || q.includes('goodbye')) {
    return build({
      text: `You are very welcome, ${firstName}! 😊 It is my absolute pleasure to assist you.\n\nStay healthy, drink plenty of water, and remember: **AI assists, but your doctor always decides!** 🩺`,
      quickReplies: isGuest ? [
        { label: '👤 Sign In as Patient', authAction: 'patient_signin' },
        { label: '🩺 Doctor / Hospital Portal', authAction: 'doctor' }
      ] : [
        { label: '🩺 Check Symptoms', tab: 'symptoms' },
        { label: '📅 Book Appointment', tab: 'appointments' }
      ]
    });
  }

  // =========================================================================
  // DEFAULT INTELLIGENT FALLBACK
  // =========================================================================
  return build({
    text: `I understand your query regarding **"${raw}"**, ${firstName}.\n\nAs your clinical AI companion, here are the best ways I can assist you right now:\n\n1. **How to Use the App:** Step-by-step guide for patients and physicians\n2. **Symptom Checker & Triage:** Multi-system AI evaluation with XAI weights\n3. **Doctor Appointments & OPD Receipts:** Specialist booking with printable tokens\n4. **Sign In & Demo Testing:** Easy access for patients and evaluators\n\n${isGuest ? '*(Note: To analyze clinical symptoms, please sign in or register an account first.)*' : 'What would you like to do?'}`,
    actionTab: isGuest ? null : 'symptoms',
    actionLabel: isGuest ? null : '🩺 Check My Symptoms',
    quickReplies: isGuest ? [
      { label: '💡 How to Use This App', text: 'How to use this app?' },
      { label: '👤 Sign In as Patient', authAction: 'patient_signin' },
      { label: '📝 New Patient Sign Up', authAction: 'patient_signup' },
      { label: '🩺 Doctor / Hospital Portal', authAction: 'doctor' }
    ] : [
      { label: '🩺 Check My Symptoms', tab: 'symptoms' },
      { label: '📅 Book Doctor Visit', tab: 'appointments' },
      { label: '📊 Health Vitals', tab: 'vitals' },
      { label: '💡 How to Use App', text: 'How to use this app?' }
    ]
  });
}
