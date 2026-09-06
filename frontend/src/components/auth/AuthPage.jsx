import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import logoImg from '../../assets/logo.png';
import MediChatbot from '../patient/MediChatbot';
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
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  KeyRound
} from 'lucide-react';

export default function AuthPage() {
  const { loginPatient, loginClinician, registerNewPatient, demoPatients } = useMediSense();

  // Mode: 'patient_signin' | 'patient_signup' | 'doctor'
  const [authMode, setAuthMode] = useState('patient_signin');

  // Error & Status Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign In State (Patient)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up State (Patient)
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

  // Doctor / Hospital Role State
  const [adminRole, setAdminRole] = useState('doctor'); // 'doctor' | 'admin'
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');

  const switchTab = (mode) => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handlePatientSignIn = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your registered patient email address or Patient ID.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    const res = loginPatient(email, password);
    if (!res.success) {
      setErrorMessage(res.error);
    }
  };

  const handlePatientSignUp = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signUpForm.name.trim()) {
      setErrorMessage('Please provide your full legal name.');
      return;
    }
    if (!signUpForm.email.trim()) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!signUpForm.password) {
      setErrorMessage('Please create a secure password for your account.');
      return;
    }
    if (signUpForm.password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setErrorMessage('Passwords do not match! Please verify and re-type.');
      return;
    }

    registerNewPatient(signUpForm);
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!doctorEmail.trim()) {
      setErrorMessage('Please enter your hospital staff email or physician ID.');
      return;
    }
    if (!doctorPassword.trim()) {
      setErrorMessage('Please enter your medical license security key.');
      return;
    }

    const res = loginClinician(doctorEmail, doctorPassword, adminRole);
    if (!res.success) {
      setErrorMessage(res.error);
    }
  };

  // Helper autofill handlers (fills form fields only; user must still click Sign In)
  const autofillPatient = (pEmail, pPass) => {
    setAuthMode('patient_signin');
    setEmail(pEmail);
    setPassword(pPass);
    setErrorMessage('');
    setSuccessMessage(`Credentials for ${pEmail} populated into form. Click "Sign In as Patient" to proceed.`);
  };

  const autofillStaff = (sEmail, sPass, role = 'doctor') => {
    setAuthMode('doctor');
    setDoctorEmail(sEmail);
    setDoctorPassword(sPass);
    setAdminRole(role);
    setErrorMessage('');
    setSuccessMessage(`Hospital staff credentials populated into form. Click "Access Clinical Command Center" to proceed.`);
  };

  const isPatientMode = authMode === 'patient_signin' || authMode === 'patient_signup';

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      
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
          
          {/* Clean 2-Way Mode Switcher Tabs (Patient Portal vs Doctor / Hospital) */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold shadow-inner">
            <button
              type="button"
              onClick={() => switchTab('patient_signin')}
              className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPatientMode
                  ? 'bg-white text-teal-700 shadow-md border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-teal-600" />
              <span>Patient Portal</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab('doctor')}
              className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMode === 'doctor'
                  ? 'bg-white text-indigo-700 shadow-md border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-indigo-600" />
              <span>Doctor / Hospital</span>
            </button>
          </div>

          {/* Validation / Status Banners */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* TAB 1A: PATIENT SIGN IN */}
          {authMode === 'patient_signin' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Patient Sign In</h3>
                <p className="text-xs text-slate-500">Access your health vitals, symptom evaluations, and appointment receipts.</p>
              </div>

              <form onSubmit={handlePatientSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Email Address or ID</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. sarah.jenkins@medisense.ai or your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Passcode / Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Enter your account password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] text-slate-400">Default demo password: <code className="text-teal-700 font-bold">patient123</code></span>
                  <button
                    type="button"
                    onClick={() => switchTab('patient_signup')}
                    className="text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Need an account? Sign up
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Sign In as Patient</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Credentials Helper (Fills inputs; does NOT auto-login) */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  📋 Demo Patients (Click to Populate Form):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => autofillPatient('sarah.jenkins@medisense.ai', 'patient123')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 text-left transition-all text-xs cursor-pointer"
                  >
                    <div className="font-bold text-slate-800">Sarah Jenkins (Demo)</div>
                    <div className="text-[10px] text-slate-500">sarah.jenkins@medisense.ai</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPatient('marcus.vance@medisense.ai', 'patient123')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 text-left transition-all text-xs cursor-pointer"
                  >
                    <div className="font-bold text-slate-800">Marcus Vance (Demo)</div>
                    <div className="text-[10px] text-slate-500">marcus.vance@medisense.ai</div>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center italic">
                  Tip: Populates the inputs above. Click "Sign In as Patient" to authenticate.
                </p>
              </div>
            </div>
          )}

          {/* TAB 1B: NEW PATIENT SIGN UP (REVEALED VIA "NEED AN ACCOUNT? SIGN UP") */}
          {authMode === 'patient_signup' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">New Patient Registration</h3>
                  <p className="text-xs text-slate-500">Create your health ID to check symptoms, track vitals, and book appointments.</p>
                </div>
                <button
                  type="button"
                  onClick={() => switchTab('patient_signin')}
                  className="text-xs font-bold text-teal-600 hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
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
                      placeholder="e.g. aanya.sharma@example.com"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>

                {/* Gender, Blood Group & City */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
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

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Blood Type</label>
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
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={signUpForm.city}
                      onChange={(e) => setSignUpForm({ ...signUpForm, city: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Medical History */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Chronic Conditions (if any)</label>
                    <input
                      type="text"
                      placeholder="e.g. Asthma, Hypertension (or None)"
                      value={signUpForm.chronicConditions}
                      onChange={(e) => setSignUpForm({ ...signUpForm, chronicConditions: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Known Allergies (if any)</label>
                    <input
                      type="text"
                      placeholder="e.g. Penicillin, Peanuts (or None)"
                      value={signUpForm.knownAllergies}
                      onChange={(e) => setSignUpForm({ ...signUpForm, knownAllergies: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Create Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
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
                      placeholder="••••••••••••"
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
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create My Patient Account & Enter Portal</span>
                  </button>
                </div>

                <p className="text-center text-[11px] text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('patient_signin')}
                    className="text-teal-600 font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign in to your account
                  </button>
                </p>

              </form>
            </div>
          )}

          {/* TAB 2: DOCTOR / HOSPITAL */}
          {authMode === 'doctor' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Doctor / Hospital Portal</h3>
                <p className="text-xs text-slate-500">Clinical Triage Command, Explainable AI models, and Decision Governance.</p>
              </div>

              {/* Role Switcher */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAdminRole('doctor');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    adminRole === 'doctor' ? 'bg-white text-indigo-700 shadow border border-slate-200' : 'text-slate-500'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Attending Physician</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminRole('admin');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    adminRole === 'admin' ? 'bg-white text-purple-700 shadow border border-slate-200' : 'text-slate-500'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hospital Admin</span>
                </button>
              </div>

              <form onSubmit={handleDoctorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {adminRole === 'admin' ? 'Hospital Admin Staff Email' : 'Doctor ID / Hospital Email'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={adminRole === 'admin' ? 'admin@medisense.hospital.org' : 'dr.chen@medisense.hospital.org'}
                      value={doctorEmail}
                      onChange={(e) => {
                        setDoctorEmail(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medical License Security Key</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Enter security key (e.g. doctor123)"
                      value={doctorPassword}
                      onChange={(e) => {
                        setDoctorPassword(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Default demo keys: <code className="text-indigo-700 font-bold">doctor123</code> or <code className="text-purple-700 font-bold">admin123</code>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Clinical Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Clinician Autofill Helpers */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  📋 Demo Staff Credentials (Click to Populate):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => autofillStaff('dr.chen@medisense.hospital.org', 'doctor123', 'doctor')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 text-left transition-all text-xs cursor-pointer"
                  >
                    <div className="font-bold text-slate-800">Dr. Robert Chen, MD</div>
                    <div className="text-[10px] text-slate-500">Chief of Emergency Triage</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillStaff('admin@medisense.hospital.org', 'admin123', 'admin')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-left transition-all text-xs cursor-pointer"
                  >
                    <div className="font-bold text-slate-800">Hospital Administration</div>
                    <div className="text-[10px] text-slate-500">Clinical Audit & Governance</div>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center italic">
                  Tip: Populates the inputs above. Click "Access Clinical Command Center" to authenticate.
                </p>
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

      {/* Floating Clinical AI Companion "Medi" on Auth/Login Page */}
      <MediChatbot
        isGuest={true}
        onSelectAuthMode={switchTab}
        onFillPatientDemo={autofillPatient}
        onFillDoctorDemo={autofillStaff}
      />

    </div>
  );
}
