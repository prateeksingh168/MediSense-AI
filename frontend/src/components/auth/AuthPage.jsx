import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import logoImg from '../../assets/logo.png';
import {
  User,
  Stethoscope,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  UserPlus,
  Phone,
  Heart,
  Calendar,
  Building2,
  FileText,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function AuthPage() {
  const { loginUser, registerNewPatient, demoPatients } = useMediSense();

  // Mode: 'patient_signin' | 'patient_signup' | 'doctor'
  const [authMode, setAuthMode] = useState('patient_signin');

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up State
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Female',
    bloodType: 'O+',
    city: 'Mumbai',
    chronicConditions: '',
    knownAllergies: '',
    password: '',
    confirmPassword: ''
  });

  // Doctor Role State
  const [adminRole, setAdminRole] = useState('doctor'); // 'doctor' | 'admin'

  const handlePatientSignIn = (e) => {
    e.preventDefault();
    loginUser({
      role: 'patient',
      name: demoPatients[0].name,
      patientId: demoPatients[0].id,
      email: email || 'sarah.jenkins@medisense.ai'
    });
  };

  const handlePatientSignUp = (e) => {
    e.preventDefault();
    if (!signUpForm.name || !signUpForm.email) {
      alert('Please fill in your name and email.');
      return;
    }
    if (signUpForm.password && signUpForm.password !== signUpForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    registerNewPatient(signUpForm);
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    loginUser({
      role: adminRole === 'admin' ? 'admin' : 'doctor',
      name: adminRole === 'admin' ? 'Dr. Sarah Al-Mansoor (Hospital Chief)' : 'Dr. Robert Chen, MD',
      specialty: adminRole === 'admin' ? 'Chief Medical Officer / Administration' : 'Cardiology & Emergency Triage',
      email: email || (adminRole === 'admin' ? 'admin@medisense.hospital.org' : 'dr.chen@medisense.hospital.org')
    });
  };

  const quickLoginPatient = (patient) => {
    loginUser({
      role: 'patient',
      name: patient.name,
      patientId: patient.id,
      email: `${patient.name.toLowerCase().replace(' ', '.')}@medisense.ai`
    });
  };

  const quickLoginDoctor = (name, specialty, role = 'doctor') => {
    loginUser({
      role,
      name,
      specialty,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@medisense.hospital.org`
    });
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      
      {/* Background Soft Medical Lighting Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-sky-200/40 via-teal-100/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="p-1 rounded-xl bg-slate-900 shadow-md">
            <img src={logoImg} alt="MediSense AI Logo" className="h-10 w-auto object-contain rounded-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                MEDISENSE <span className="text-teal-600 font-black">AI</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Healthcare CDS
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              AI assists. Doctors decide.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Synthetic Patient Cohort (1500+ Profiles)</span>
        </div>
      </header>

      {/* Main Authentication Core */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col items-center justify-center">
        
        {/* Hero Title */}
        <div className="text-center max-w-2xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide shadow-sm mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
            <span>Intelligent Medical Decision Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Healthcare Intelligence for <br />
            <span className="bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
              Patients, Physicians & Hospitals
            </span>
          </h1>
          <p className="text-slate-600 text-sm font-medium max-w-lg mx-auto">
            AI-driven symptom analysis with Explainable AI (XAI) and priority triage. Final decisions always remain with the licensed physician.
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* 3-Way Mode Switcher Tabs */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('patient_signin')}
              className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'patient_signin'
                  ? 'bg-white text-teal-700 shadow-md border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('patient_signup')}
              className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'patient_signup'
                  ? 'bg-white text-teal-700 shadow-md border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Patient Sign Up</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('doctor')}
              className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'doctor'
                  ? 'bg-white text-indigo-700 shadow-md border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor / Admin</span>
            </button>
          </div>

          {/* TAB 1: PATIENT SIGN IN */}
          {authMode === 'patient_signin' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Patient Sign In</h3>
                <p className="text-xs text-slate-500">Access your health vitals, symptom evaluations, and appointment receipts.</p>
              </div>

              <form onSubmit={handlePatientSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Patient ID or Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. P00001 or sarah.jenkins@medisense.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Passcode / Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-0" />
                    <span>Keep me signed in</span>
                  </label>
                  <span onClick={() => setAuthMode('patient_signup')} className="text-teal-600 hover:underline cursor-pointer font-semibold">
                    Need an account? Sign up
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Sign In as Patient</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Fast Patient Profiles */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  ⚡ 1-Click Instant Demo Patients:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {demoPatients.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => quickLoginPatient(p)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 text-left transition-all text-xs"
                    >
                      <div className="font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.age}y • {p.chronicConditions[0] || 'Healthy'}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEW PATIENT SIGN UP (FULL REGISTRATION FORM) */}
          {authMode === 'patient_signup' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">New Patient Registration</h3>
                <p className="text-xs text-slate-500">Create your health ID to check symptoms, track vitals, and book appointments.</p>
              </div>

              <form onSubmit={handlePatientSignUp} className="space-y-3.5 text-xs">
                
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Aanya Sharma"
                      value={signUpForm.name}
                      onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="aanya.sharma@example.com"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Age & Gender */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={signUpForm.phone}
                      onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Age *</label>
                    <input
                      type="number"
                      placeholder="28"
                      value={signUpForm.age}
                      onChange={(e) => setSignUpForm({ ...signUpForm, age: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={signUpForm.gender}
                      onChange={(e) => setSignUpForm({ ...signUpForm, gender: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Blood Type & City */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={signUpForm.bloodType}
                      onChange={(e) => setSignUpForm({ ...signUpForm, bloodType: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                    <input
                      type="text"
                      placeholder="Mumbai / Delhi / Jaipur"
                      value={signUpForm.city}
                      onChange={(e) => setSignUpForm({ ...signUpForm, city: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Known Conditions / Allergies */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Known Allergies / Chronic History (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin allergy, Mild Asthma, Hypertension"
                    value={signUpForm.chronicConditions}
                    onChange={(e) => setSignUpForm({ ...signUpForm, chronicConditions: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Create Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 shadow-md flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create My Patient Account & Enter Portal</span>
                  </button>
                </div>

                <p className="text-center text-[11px] text-slate-500">
                  Already registered?{' '}
                  <span onClick={() => setAuthMode('patient_signin')} className="text-teal-600 font-bold hover:underline cursor-pointer">
                    Sign in here
                  </span>
                </p>

              </form>
            </div>
          )}

          {/* TAB 3: DOCTOR & HOSPITAL ADMIN */}
          {authMode === 'doctor' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Physician & Hospital Administration</h3>
                <p className="text-xs text-slate-500">Clinical Triage Command, Explainable AI models, and Decision Governance.</p>
              </div>

              {/* Role Switcher */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setAdminRole('doctor')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    adminRole === 'doctor' ? 'bg-white text-indigo-700 shadow border border-slate-200' : 'text-slate-500'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Attending Physician</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminRole('admin')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    adminRole === 'admin' ? 'bg-white text-purple-700 shadow border border-slate-200' : 'text-slate-500'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hospital Admin</span>
                </button>
              </div>

              <form onSubmit={handleDoctorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor ID / Hospital Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. dr.chen@medisense.hospital.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medical License Security Key</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Clinical Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Clinician Logins */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  ⚡ 1-Click Fast Clinician Logins:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickLoginDoctor('Dr. Robert Chen, MD', 'Cardiology & Emergency Triage', 'doctor')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 text-left transition-all text-xs"
                  >
                    <div className="font-bold text-slate-800">Dr. Robert Chen, MD</div>
                    <div className="text-[10px] text-slate-500">Chief of Emergency Triage</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLoginDoctor('Dr. Sarah Al-Mansoor', 'Chief Medical Officer / Administration', 'admin')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-left transition-all text-xs"
                  >
                    <div className="font-bold text-slate-800">Hospital Administration</div>
                    <div className="text-[10px] text-slate-500">Clinical Audit & Governance</div>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl w-full text-xs">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Explainable AI</div>
              <div className="text-[11px] text-slate-500">Transparent Feature Weights</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Red-Flag Triage</div>
              <div className="text-[11px] text-slate-500">Emergency Acuity Detection</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Token Receipts</div>
              <div className="text-[11px] text-slate-500">Printable OPD Receipts</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Doctor Decision</div>
              <div className="text-[11px] text-slate-500">100% Physician Autonomy</div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/60">
        <p>MediSense AI • Built with React, Tailwind CSS, Recharts & Synthetic Clinical Data for Medical Hackathons.</p>
      </footer>

    </div>
  );
}
