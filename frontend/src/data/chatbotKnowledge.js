/**
 * MediSense AI - Clinical Knowledge Base & NLP Engine for "Medi" Chatbot
 * Empathetic, clinical, proactive, bilingual (English + Hinglish), and action-oriented.
 */

export function getMediResponse(query, patientName = 'Patient') {
  const raw = query.trim();
  const q = raw.toLowerCase();
  const firstName = patientName.split(' ')[0] || 'Patient';

  // Helper to construct response with text, actionTab, actionLabel, isEmergency, and quickReplies
  const build = ({ text, actionTab = null, actionLabel = null, isEmergency = false, quickReplies = [] }) => ({
    text,
    actionTab,
    actionLabel,
    isEmergency,
    quickReplies
  });

  // 1. GREETINGS & CASUAL OPENINGS
  if (/^(hi|hello|hey|namaste|hola|good morning|good afternoon|good evening|kaise ho|kya haal|sasriyakaal|salaam)\b/.test(q)) {
    return build({
      text: `Hello ${firstName}! 👋 I am **Medi**, your clinical AI health companion at MediSense AI.\n\nI am here 24/7 to guide you through your health journey. Whether you need to analyze symptoms, book a doctor consultation, get an OPD token receipt, or check your biometric vitals, I am ready to help!\n\nWhat would you like to explore right now?`,
      quickReplies: [
        { label: '🩺 Check My Symptoms', tab: 'symptoms' },
        { label: '📅 Book Doctor & Get Receipt', tab: 'appointments' },
        { label: '📊 Health Vitals & BP', tab: 'vitals' },
        { label: '💡 How to Use This App', text: 'How to use this app?' }
      ]
    });
  }

  // 2. WHO ARE YOU / IDENTITY
  if (q.includes('who are you') || q.includes('koun ho') || q.includes('kya kar sakte ho') || q.includes('about medi') || q.includes('what is medi')) {
    return build({
      text: `I am **Medi** 🤖, the clinical AI assistant built into MediSense AI.\n\nMy purpose is to empower patients with transparent, intelligent guidance while maintaining our gold standard: **"AI assists. Doctors decide."**\n\nI can:\n• Triage your acute symptoms across 5 body systems\n• Generate hospital OPD appointment token receipts with room numbers\n• Monitor your Blood Pressure, Heart Rate, and SpO2 telemetry\n• Display your printable Digital Health ID Card\n• Provide instant red-flag emergency guidance`,
      quickReplies: [
        { label: '🩺 Try Symptom Checker', tab: 'symptoms' },
        { label: '💡 Full App Walkthrough', text: 'How to use this app?' },
        { label: '📅 View Doctors Available', tab: 'appointments' }
      ]
    });
  }

  // 3. COMPLETE APP WALKTHROUGH & GUIDE ("HOW TO USE", "APP KAISE USE KARE", "FEATURES")
  if (
    q.includes('how to use') || q.includes('kaise use') || q.includes('app guide') ||
    q.includes('tour') || q.includes('features') || q.includes('help') || q.includes('madad') ||
    q.includes('kya kya hai') || q.includes('guide me') || q.includes('guide')
  ) {
    return build({
      text: `Welcome to **MediSense AI**, ${firstName}! Here is your complete guide to the 5 core capabilities:\n\n1️⃣ **🩺 AI Symptom Checker:**\nSelect the affected body system (Cardiovascular, Respiratory, Neuro, Abdominal, Musculoskeletal), check your symptoms or describe them, set your pain severity slider (1-10), and click *"Analyze with MediSense AI"*. You will see an instant triage score (Emergency, Urgent, or Routine) with Explainable AI feature weights!\n\n2️⃣ **📅 Book Appointment & Receipts:**\nPick an on-duty specialist doctor (e.g. Dr. Robert Chen in Cardiology), choose a convenient date/time, and generate an official printable OPD Token Receipt with room number and QR verification.\n\n3️⃣ **📊 Health Vitals Tracking:**\nMonitor your continuous Blood Pressure, Heart Rate, and SpO2 telemetry curves. If you are newly registered, click *"+ Log First Vital Reading"* to start your profile.\n\n4️⃣ **📋 My Assessments:**\nView all your past clinical submissions, AI predictions, and reviewing doctor confirmations.\n\n5️⃣ **👤 Health Profile & Digital ID:**\nReview your recorded allergies, chronic conditions, and print your smart Digital Health Card.\n\nWhich section would you like to open?`,
      quickReplies: [
        { label: '🩺 AI Symptom Checker', tab: 'symptoms' },
        { label: '📅 Book Appointment', tab: 'appointments' },
        { label: '📊 Health Vitals', tab: 'vitals' },
        { label: '👤 Digital Health Card', tab: 'profile' }
      ]
    });
  }

  // 4. GENERAL PAIN & AMBIGUOUS PAIN QUERIES ("PAIN", "DARD", "ACHE", "HURTS", "TAKLEEF")
  // Probes the user with direct sub-categories so they get exact clinical triage
  if (
    q === 'pain' || q === 'pain ' || q === 'dard' || q === 'dard ' ||
    q.includes('body pain') || q.includes('pain in body') || q.includes('bohot dard') ||
    q.includes('severe pain') || q.includes('takleef') || q.includes('hurts')
  ) {
    return build({
      text: `I am very sorry to hear you are experiencing pain, ${firstName}. Pain is a crucial clinical signal that requires immediate attention.\n\nTo give you the most accurate triage guidance and safety recommendations, **where is the pain located?**\n\n• 🚨 **Chest / Left Arm / Jaw** — High-priority acute cardiac risk\n• 🧠 **Head / Migraine** — Severe throbbing or sudden onset\n• 🤢 **Stomach / Abdomen** — Right lower side (appendix), burning acidity, or cramps\n• 🦴 **Joints / Back / Muscles** — Stiffness, swelling, or movement ache\n• 👄 **Throat / Neck** — Difficulty swallowing or swollen tonsils\n\nPlease select your pain area below, or tap **"Open AI Symptom Checker"** for a full assessment:`,
      actionTab: 'symptoms',
      actionLabel: '🩺 Open AI Symptom Checker',
      quickReplies: [
        { label: '🚨 Chest Pain (Urgent)', text: 'I have chest pain' },
        { label: '🧠 Severe Headache', text: 'I have a headache' },
        { label: '🤢 Stomach / Abdominal Pain', text: 'I have stomach pain' },
        { label: '🦴 Joint / Back Pain', text: 'I have joint or back pain' },
        { label: '👄 Sore Throat / Neck', text: 'I have a sore throat' }
      ]
    });
  }

  // 5. CRITICAL RED-FLAG: CHEST PAIN & CARDIAC SYMPTOMS
  if (
    q.includes('chest') || q.includes('chhati') || q.includes('heart') ||
    q.includes('dil') || q.includes('cardiac') || q.includes('angina') ||
    q.includes('jaw pain') || q.includes('arm pain') || q.includes('left arm')
  ) {
    return build({
      text: `🚨 **CRITICAL RED-FLAG: CARDIAC EMERGENCY ALERT!**\n\n${firstName}, chest discomfort radiating to the left arm, neck, or jaw—especially if accompanied by shortness of breath, cold sweating, or dizziness—can be a sign of **Acute Coronary Syndrome (Heart Attack)**.\n\n⚠️ **Urgent Action Steps:**\n1. **Call emergency services (911 or 112)** immediately or have someone drive you to the nearest ER. **Do not drive yourself.**\n2. Sit upright in a comfortable position and loosen tight collar/clothing.\n3. Chew an Aspirin (325mg) if advised by medical personnel and not allergic.\n\nI have prepared the emergency triage intake for you. Please click below so hospital cardiologists are alerted immediately:`,
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

  // 6. HEADACHE, MIGRAINE & NEUROLOGICAL
  if (
    q.includes('headache') || q.includes('head') || q.includes('sir dard') ||
    q.includes('sar dard') || q.includes('migraine') || q.includes('chakkar') ||
    q.includes('dizziness') || q.includes('vertigo') || q.includes('fainting')
  ) {
    return build({
      text: `Headaches can range from common tension headaches and migraines to neurological red-flags.\n\n⚠️ **When to seek Emergency Care (Rule out stroke / hemorrhage):**\n• Sudden, explosive "thunderclap" headache (the most intense pain of your life)\n• Accompanied by facial numbness, slurred speech, or arm weakness\n• High fever with a stiff neck\n\n💡 **Home Care for Mild to Moderate Headache:**\n• Rest in a quiet, dark room away from screens\n• Hydrate with 500ml of water (dehydration is a frequent cause)\n• Apply a cool compress to your forehead or temples\n\nLog your headache in our **AI Symptom Checker** so our neurologist can review your severity!`,
      actionTab: 'symptoms',
      actionLabel: '🩺 Check Headache Severity',
      quickReplies: [
        { label: '🩺 Check Headache Symptoms', tab: 'symptoms' },
        { label: '📅 Book Dr. Sarah (Neurologist)', tab: 'appointments' },
        { label: '📊 Check Blood Pressure (BP)', tab: 'vitals' }
      ]
    });
  }

  // 7. STOMACH, ABDOMINAL PAIN, ACIDITY, APPENDICITIS
  if (
    q.includes('stomach') || q.includes('pet dard') || q.includes('abdomen') ||
    q.includes('abdominal') || q.includes('acidity') || q.includes('gas') ||
    q.includes('indigestion') || q.includes('appendix') || q.includes('cramps')
  ) {
    return build({
      text: `Abdominal pain requires careful assessment depending on its exact location:\n\n• **Lower Right Abdomen (RLQ):** If sharp pain began around your belly button and shifted to the lower right side with tenderness when pressed, this is a hallmark of **Acute Appendicitis**—requires urgent surgical evaluation!\n• **Upper Central / Epigastric:** Burning pain after meals often indicates acid reflux, gastritis, or peptic ulcer.\n• **Cramps & Bloating:** Commonly associated with gastroenteritis, food intolerance, or irritable bowel.\n\n⚠️ **Red Flags:** Severe tenderness, persistent vomiting, high fever, or blood in stool.\n\nWould you like to run an abdominal symptom analysis or book an urgent consultation?`,
      actionTab: 'symptoms',
      actionLabel: '🩺 Check Abdominal Symptoms',
      quickReplies: [
        { label: '🩺 Run Abdominal Assessment', tab: 'symptoms' },
        { label: '📅 Consult General Physician', tab: 'appointments' },
        { label: '🤢 I have vomiting too', text: 'I have vomiting and nausea' }
      ]
    });
  }

  // 8. VOMITING, NAUSEA, DIARRHEA, FOOD POISONING
  if (
    q.includes('vomit') || q.includes('ulti') || q.includes('nausea') ||
    q.includes('diarrhea') || q.includes('loose motion') || q.includes('food poisoning')
  ) {
    return build({
      text: `Nausea, vomiting, and diarrhea frequently stem from acute gastroenteritis, viral infections, or food poisoning.\n\n💧 **Essential Clinical Guidance:**\n• **Prevent Dehydration:** Sip Oral Rehydration Salts (ORS) or electrolyte water in small quantities (1-2 sips every 5 minutes). Avoid gulping.\n• **Diet:** Follow the BRAT diet (Bananas, Rice, Applesauce, Toast) once vomiting subsides. Avoid dairy, oily, and spicy foods.\n• ⚠️ **Go to the Clinic / Hospital if:** Unable to keep liquids down for >12 hours, extreme dry mouth, dizziness upon standing, or high fever.\n\nWould you like to log your symptoms or book an OPD slot?`,
      actionTab: 'appointments',
      actionLabel: '📅 Book Urgent Doctor Consultation',
      quickReplies: [
        { label: '📅 Book Urgent Consultation', tab: 'appointments' },
        { label: '🩺 Tag Symptoms in Checker', tab: 'symptoms' }
      ]
    });
  }

  // 9. FEVER, BUKHAR, CHILLS, TEMPERATURE
  if (
    q.includes('fever') || q.includes('bukhar') || q.includes('temperature') ||
    q.includes('chills') || q.includes('shivering') || q.includes('garam')
  ) {
    return build({
      text: `Fever is your body's immune defense fighting off an infection (viral, bacterial, or seasonal).\n\n🌡️ **Clinical Temperature Thresholds:**\n• **Mild Fever:** 99.5°F - 100.4°F (37.5°C - 38°C)\n• **High Fever:** >102.5°F (39.2°C) — requires prompt antipyretic management and physician review.\n\n🛡️ **Care Recommendations:**\n• Drink warm water, clear soups, and ORS to replenish fluids\n• Get plenty of rest and avoid heavy blankets if shivering has stopped\n• ⚠️ If fever persists for >3 days, is accompanied by shortness of breath, severe throat pain, or rash, see a physician immediately.\n\nYou can record your temperature in **Health Vitals** or schedule an appointment!`,
      actionTab: 'appointments',
      actionLabel: '📅 Book Fever Consultation',
      quickReplies: [
        { label: '📅 Book Fever Consultation', tab: 'appointments' },
        { label: '📊 Log Vitals Reading', tab: 'vitals' },
        { label: '🩺 Check All Symptoms', tab: 'symptoms' }
      ]
    });
  }

  // 10. COUGH, COLD, BREATHING, THROAT, ASTHMA
  if (
    q.includes('cough') || q.includes('khansi') || q.includes('cold') ||
    q.includes('throat') || q.includes('gala') || q.includes('breathe') ||
    q.includes('saans') || q.includes('shortness of breath') || q.includes('asthma') ||
    q.includes('wheez')
  ) {
    return build({
      text: `Respiratory symptoms like cough, congestion, and breathing difficulty require careful monitoring:\n\n• **Sore Throat / Cold:** Gargle with warm salt water 3 times a day. Steam inhalation helps clear nasal congestion.\n• **Dry vs Productive Cough:** Persistent dry cough can indicate allergic bronchitis or viral post-infection; productive yellow/green phlegm can indicate bacterial infection.\n• 🚨 **Breathing Warning:** If you experience wheezing, chest tightness, or rapid breathing, check your **SpO2** immediately. If SpO2 drops below **94%**, seek urgent medical care.\n\nDr. Michael Chang (Pulmonology) is on duty today. Would you like to consult him?`,
      actionTab: 'appointments',
      actionLabel: '📅 Book Pulmonology Consultation',
      quickReplies: [
        { label: '📅 Consult Dr. Chang (Pulmonologist)', tab: 'appointments' },
        { label: '📊 Check Oxygen (SpO2) Level', tab: 'vitals' },
        { label: '🩺 Run Respiratory Triage', tab: 'symptoms' }
      ]
    });
  }

  // 11. BLOOD PRESSURE, BP, HYPERTENSION
  if (
    q.includes('bp') || q.includes('blood pressure') || q.includes('hypertension') ||
    q.includes('high bp') || q.includes('low bp')
  ) {
    return build({
      text: `📊 **Clinical Blood Pressure Standards (AHA/ACC):**\n\n• **Normal / Optimal:** Less than **120/80 mmHg**\n• **Elevated:** Systolic 120-129 AND Diastolic <80 mmHg\n• **Stage 1 Hypertension:** Systolic 130-139 OR Diastolic 80-89 mmHg\n• **Stage 2 Hypertension:** Systolic **≥140** OR Diastolic **≥90 mmHg**\n• 🚨 **Hypertensive Crisis:** Systolic >180 and/or Diastolic >120 mmHg — seek immediate ER care!\n\nIn MediSense AI, your BP trends are graphed continuously using Recharts. If you are newly registered, click **"+ Log First Vital Reading"** to begin tracking!`,
      actionTab: 'vitals',
      actionLabel: '📊 Open Blood Pressure Telemetry',
      quickReplies: [
        { label: '📊 View My BP Trends', tab: 'vitals' },
        { label: '➕ Log New BP Reading', tab: 'vitals' },
        { label: '📅 Book Cardiologist (Dr. Chen)', tab: 'appointments' }
      ]
    });
  }

  // 12. BLOOD SUGAR, DIABETES, GLUCOSE
  if (
    q.includes('sugar') || q.includes('glucose') || q.includes('diabetes') ||
    q.includes('sugar level') || q.includes('insulin')
  ) {
    return build({
      text: `🩸 **Blood Glucose Reference Ranges (ADA):**\n\n• **Fasting (Empty Stomach):** **70 to 99 mg/dL** (Normal)\n• **Pre-Diabetes (Fasting):** 100 to 125 mg/dL\n• **Diabetes (Fasting):** **≥126 mg/dL**\n• **Post-Prandial (2 hrs after meal):** Less than **140 mg/dL** is normal; >200 mg/dL indicates hyperglycemia.\n\nKeep your blood sugar documented in our **Health Vitals** tab to help your consulting physician evaluate treatment efficacy.`,
      actionTab: 'vitals',
      actionLabel: '📊 View Glucose Tracking',
      quickReplies: [
        { label: '📊 Open Vitals Tracking', tab: 'vitals' },
        { label: '📅 Book Specialist Consultation', tab: 'appointments' }
      ]
    });
  }

  // 13. SPO2, OXYGEN SATURATION & PULSE
  if (
    q.includes('spo2') || q.includes('oxygen') || q.includes('pulse') ||
    q.includes('heart rate') || q.includes('bpm')
  ) {
    return build({
      text: `💓 **Hemodynamics & Oxygenation Standards:**\n\n• **Oxygen Saturation (SpO2):** Healthy baseline is **95% to 100%**. A reading between 90-94% requires clinical attention; **<90% is a medical emergency (Hypoxemia)**.\n• **Resting Heart Rate (Pulse):** Normal adult resting rate is **60 to 100 BPM**. Rates consistently >100 BPM at rest (Tachycardia) or <50 BPM (Bradycardia) should be evaluated.\n\nYou can log your pulse oximeter readings directly in the **"Health Vitals Tracking"** tab!`,
      actionTab: 'vitals',
      actionLabel: '📊 View Oxygen & Pulse Monitor',
      quickReplies: [
        { label: '📊 Open Hemodynamics Monitor', tab: 'vitals' },
        { label: '➕ Record New Vital Reading', tab: 'vitals' }
      ]
    });
  }

  // 14. APPOINTMENT BOOKING, OPD TOKEN RECEIPTS & SPECIALISTS
  if (
    q.includes('appointment') || q.includes('book') || q.includes('receipt') ||
    q.includes('token') || q.includes('doctor') || q.includes('opd') ||
    q.includes('dr chen') || q.includes('dr robert') || q.includes('dr sarah') ||
    q.includes('dr chang') || q.includes('specialist')
  ) {
    return build({
      text: `📅 **Doctor Appointments & OPD Token Receipts:**\n\nMediSense AI lets you book consultations with verified hospital specialists and generate instant official OPD token receipts:\n\n👨‍⚕️ **Available Specialists:**\n• **Dr. Robert Chen, MD** — Cardiology & Emergency Triage (Suite 304, Wing B)\n• **Dr. Sarah Al-Mansoor, MD** — Neurology & Stroke Evaluation (Room 412)\n• **Dr. Michael Chang, MD** — Pulmonology & Respiratory Care (Room 208, West Wing)\n\n🧾 **How OPD Receipts Work:**\n1. Go to **"Book Appointment & Receipts"**\n2. Select your doctor, date, and preferred time slot\n3. Click *"Confirm Appointment & Generate Token Receipt"*\n4. Download or print your official receipt with Token Number (e.g. \`#OPD-B14\`), room details, and QR barcode!\n\nWould you like to book an appointment now?`,
      actionTab: 'appointments',
      actionLabel: '📅 Book Doctor & Get Receipt',
      quickReplies: [
        { label: '📅 Book Doctor Appointment', tab: 'appointments' },
        { label: '🧾 View My Bookings & Receipts', tab: 'appointments' }
      ]
    });
  }

  // 15. DIGITAL HEALTH ID CARD & PROFILE
  if (
    q.includes('profile') || q.includes('id card') || q.includes('card') ||
    q.includes('digital card') || q.includes('health id') || q.includes('meri detail') ||
    q.includes('history') || q.includes('allergy') || q.includes('allergies')
  ) {
    return build({
      text: `👤 **Your Health Profile & Digital Health ID Card:**\n\nUnder the **"Health Profile"** tab, you have access to your complete digital medical record:\n\n• **Personal Demographics:** Name, Age, Gender, Blood Group, Phone, and Email\n• **Allergies & Medical History:** Documented drug/food allergies and chronic conditions\n• **Active Medications:** Prescriptions and dosage schedule\n• **Digital Health ID Card:** Click *"Digital Health ID Card"* to generate a printable smart hospital card complete with your unique ID and scannable QR verification!\n\nWould you like to view your profile now?`,
      actionTab: 'profile',
      actionLabel: '👤 View Health Profile & ID Card',
      quickReplies: [
        { label: '👤 Open My Health Profile', tab: 'profile' },
        { label: '🪪 Print Digital Health Card', tab: 'profile' }
      ]
    });
  }

  // 16. EXPLAINABLE AI (XAI), DOCTOR PORTAL & ETHICAL AI
  if (
    q.includes('xai') || q.includes('explainable') || q.includes('doctor portal') ||
    q.includes('doctor side') || q.includes('how ai works') || q.includes('synthetic data') ||
    q.includes('decision') || q.includes('doctor decide') || q.includes('accuracy')
  ) {
    return build({
      text: `💡 **Ethical Clinical AI Architecture:**\n\nMediSense AI is built around the founding medical principle: **"AI assists. Doctors decide."**\n\nKey Safety Innovations:\n• **Explainable AI (XAI):** The AI does not output black-box decisions. It shows exact mathematical feature attributions (e.g. *"+48% from substernal chest pressure"*).\n• **Missing Test Detection:** Alerts physicians to critical missing diagnostic tests (e.g. High-Sensitivity Troponin, 12-Lead ECG) before confirming diagnoses.\n• **1,500+ Synthetic Cohort Benchmarks:** Clinical algorithms are validated against synthetic multi-parameter patient cohorts without compromising real patient privacy.\n• **Physician Autonomy & Audit Trail:** Doctors can accept or override AI suggestions with 1-click legal logging.`,
      quickReplies: [
        { label: '🩺 Try Patient Symptom Checker', tab: 'symptoms' },
        { label: '📅 Book Specialist Visit', tab: 'appointments' }
      ]
    });
  }

  // 17. THANK YOU & CLOSING
  if (
    q.includes('thank') || q.includes('shukriya') || q.includes('dhanyawad') ||
    q.includes('bye') || q.includes('goodbye') || q.includes('alvida') || q.includes('ok bye')
  ) {
    return build({
      text: `You are very welcome, ${firstName}! 😊 It is my absolute pleasure to assist you.\n\nRemember to stay hydrated, get plenty of rest, and never hesitate to reach out if you feel unwell.\n\nTake great care, and remember: **AI assists, but your doctor always decides!** 🩺`,
      quickReplies: [
        { label: '🩺 Check Symptoms', tab: 'symptoms' },
        { label: '📅 Book Appointment', tab: 'appointments' }
      ]
    });
  }

  // 18. INTELLIGENT CLINICAL FALLBACK (Contextual & Action-Packed)
  return build({
    text: `I understand your query regarding **"${raw}"**, ${firstName}.\n\nAs your clinical AI health companion, here are the most effective ways I can assist you right now:\n\n1. **Check Your Symptoms:** Run an instant multi-system AI triage analysis with urgency ratings\n2. **Book a Specialist & Get OPD Receipt:** Select Dr. Robert Chen, Dr. Sarah, or Dr. Chang and print your token receipt\n3. **Track Health Vitals:** View or log your Blood Pressure, Heart Rate, and SpO2 telemetry\n4. **Digital Health Card:** View your medical record and smart QR health pass\n\nWhat would you like to do?`,
    actionTab: 'symptoms',
    actionLabel: '🩺 Check My Symptoms',
    quickReplies: [
      { label: '🩺 Check My Symptoms', tab: 'symptoms' },
      { label: '📅 Book Doctor Visit', tab: 'appointments' },
      { label: '📊 Health Vitals', tab: 'vitals' },
      { label: '💡 How to Use App', text: 'How to use this app?' }
    ]
  });
}
