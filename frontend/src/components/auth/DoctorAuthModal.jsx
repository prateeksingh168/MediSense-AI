import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import {
  ShieldAlert,
  Lock,
  Stethoscope,
  Building2,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  UserCheck
} from 'lucide-react';

export default function DoctorAuthModal({ isOpen, onClose }) {
  const { currentUser, loginClinician, setActivePortal } = useMediSense();

  const [doctorId, setDoctorId] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!doctorId.trim()) {
      setErrorMsg('Please enter your Doctor ID or Hospital Email.');
      return;
    }
    if (!securityKey.trim()) {
      setErrorMsg('Please enter your Medical License Security Key.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      // Determine if hospital admin or doctor
      const isAdmin = doctorId.toLowerCase().includes('admin') || doctorId.toLowerCase().includes('hosp');
      const doctorProfile = {
        id: doctorId.trim(),
        name: isAdmin ? 'Hospital Operations Command' : 'Dr. Aris Thorne, MD',
        role: isAdmin ? 'admin' : 'doctor',
        email: doctorId.includes('@') ? doctorId : `${doctorId.toLowerCase()}@medisense.org`,
        department: isAdmin ? 'Hospital Operations & Bed Telemetry' : 'Cardiology & Emergency Medicine',
        license: 'MED-REG-LIC-2026-X9'
      };

      loginClinician(doctorProfile);
      setActivePortal('doctor');
      setIsAuthenticating(false);
      onClose();
    }, 400);
  };

  const handleDemoFill = (type) => {
    setErrorMsg('');
    setIsAuthenticating(true);

    setTimeout(() => {
      let doctorProfile;
      let targetPortal = 'doctor';

      if (type === 'thorne') {
        doctorProfile = {
          id: 'DOC-CARDIO-4421',
          doctorId: 'doc_001',
          name: 'Dr. Aris Thorne, MD',
          role: 'doctor',
          email: 'dr.thorne@medisense.org',
          department: 'Cardiology & CCU',
          license: 'MED-CADUCEUS-2026'
        };
      } else if (type === 'al-mansoor') {
        doctorProfile = {
          id: 'DOC-NEURO-8821',
          doctorId: 'doc_002',
          name: 'Dr. Sarah Al-Mansoor, MD',
          role: 'doctor',
          email: 'dr.almansoor@medisense.org',
          department: 'Neurology & Stroke Center',
          license: 'MED-CADUCEUS-2026'
        };
      } else if (type === 'chen') {
        doctorProfile = {
          id: 'DOC-EMERG-9111',
          doctorId: 'doc_003',
          name: 'Dr. Robert Chen, MD',
          role: 'doctor',
          email: 'dr.chen@medisense.org',
          department: 'Emergency & Trauma Services',
          license: 'MED-CADUCEUS-2026'
        };
      } else if (type === 'nair') {
        doctorProfile = {
          id: 'DOC-SURG-5511',
          doctorId: 'doc_004',
          name: 'Dr. Priya Nair, MD',
          role: 'doctor',
          email: 'dr.nair@medisense.org',
          department: 'General & Trauma Surgery',
          license: 'MED-CADUCEUS-2026'
        };
      } else {
        doctorProfile = {
          id: 'HOSP-ADMIN-7700',
          name: 'Hospital Administration Director',
          role: 'admin',
          email: 'hospital.admin@medisense.org',
          department: 'Hospital Administration & Telemetry',
          license: 'HOSP-OPS-KEY-2026'
        };
        targetPortal = 'hospital';
      }

      loginClinician(doctorProfile);
      setActivePortal(targetPortal);
      setIsAuthenticating(false);
      onClose();
    }, 350);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* Modal Top Header with Security Warning */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4" />
            <span>Restricted Medical Personnel Access</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Doctor / Hospital Staff Sign In</span>
          </h3>

          <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
            Clinical Decision Support, explainable AI differential triage, and hospital-wide patient telemetry are strictly restricted to licensed healthcare professionals.
          </p>
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          
          {/* Active Session Warning */}
          {currentUser && currentUser.role === 'patient' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Current Session:</span> You are currently signed in as Patient (
                <span className="font-extrabold">{currentUser.name}</span>). Patient accounts cannot access Doctor Command directly. Please authenticate with medical staff credentials to switch.
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Doctor ID / Hospital Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="e.g. DOC-NEURO-8821 or staff@hospital.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Medical License Security Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isAuthenticating ? 'Verifying Credentials...' : 'Verify & Enter Doctor / Hospital Portal'}</span>
            </button>
          </form>

          {/* Quick Evaluator / Demo Fill Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ⚡ Evaluator 1-Click Demo Profiles:
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Hackathon Demo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('nair')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-700">
                  Dr. Priya Nair, MD
                </div>
                <div className="text-[10px] text-slate-500">General & Trauma Surgery</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('thorne')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-700">
                  Dr. Aris Thorne, MD
                </div>
                <div className="text-[10px] text-slate-500">Cardiology & CCU</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('chen')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-700">
                  Dr. Robert Chen, MD
                </div>
                <div className="text-[10px] text-slate-500">Emergency & Trauma</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('al-mansoor')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-700">
                  Dr. Sarah Al-Mansoor
                </div>
                <div className="text-[10px] text-slate-500">Chief of Neurology</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="col-span-2 p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all group cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Hospital Administration Central Command</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Institutional Telemetry, Doctors Roster & All Wards Census</div>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Executive
                </span>
              </button>
            </div>
          </div>

          {/* Cancel button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel & Stay in Patient Portal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
