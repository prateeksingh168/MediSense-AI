import React from 'react';
import { useMediSense } from '../context/MediSenseContext';
import {
  Stethoscope,
  User,
  ShieldAlert,
  Sparkles,
  LogOut,
  Users,
  ChevronDown,
  Activity,
  Lock
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import DoctorAuthModal from './auth/DoctorAuthModal';

export default function Navbar() {
  const {
    currentUser,
    logoutUser,
    activePortal,
    setActivePortal,
    currentPatient,
    switchPatient,
    demoPatients,
    emergencyCount,
    cases,
    doctorAuthModalOpen,
    setDoctorAuthModalOpen
  } = useMediSense();

  const pendingCount = cases.filter(c => c.status === 'PENDING_REVIEW').length;
  const isDoctorRole = currentUser?.role === 'doctor' || currentUser?.role === 'admin';


  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity (Prominently placed at top next to heading) */}
          <div
            className="flex items-center gap-3.5 cursor-pointer select-none"
            onClick={() => setActivePortal(isDoctorRole ? 'doctor' : 'patient')}
          >
            <div className="p-1.5 rounded-2xl bg-slate-900 shadow-md flex items-center justify-center border border-slate-800">
              <img
                src={logoImg}
                alt="MediSense AI Logo"
                className="h-10 w-auto object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.png';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  MEDISENSE <span className="text-teal-600">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  <span>Clinical Decision Support</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                AI Assists. Doctors Decide.
              </p>
            </div>
          </div>

          {/* Right Controls & Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Demo Patient Quick Switcher (Visible in Patient Portal) */}
            {activePortal === 'patient' && demoPatients && demoPatients.length > 0 && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 font-semibold">Switch Demo:</span>
                <select
                  value={currentPatient?.id || ''}
                  onChange={(e) => switchPatient(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
                >
                  {demoPatients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y - {p.chronicConditions?.[0] || 'Healthy'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Emergency Ticker Indicator */}
            {emergencyCount > 0 && (
              <div
                onClick={() => {
                  if (isDoctorRole) {
                    setActivePortal('doctor');
                  } else {
                    setDoctorAuthModalOpen(true);
                  }
                }}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold animate-pulse hover:bg-rose-100 transition-colors shadow-sm"
                title={isDoctorRole ? "Inspect Emergency cases in Doctor Command Center" : "Medical Staff Authentication Required to view triage queue"}
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{emergencyCount} Emergency Alert{emergencyCount > 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Dual Portal Switcher (Patient vs Doctor / Hospital) */}
            <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex items-center shadow-inner">
              <button
                onClick={() => setActivePortal('patient')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activePortal === 'patient'
                    ? 'bg-white text-teal-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Patient Portal</span>
              </button>

              <button
                onClick={() => {
                  if (isDoctorRole) {
                    setActivePortal('doctor');
                  } else {
                    setDoctorAuthModalOpen(true);
                  }
                }}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activePortal === 'doctor'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={isDoctorRole ? "Doctor Command Center" : "Doctor / Hospital Staff Sign In Required"}
              >
                {isDoctorRole ? (
                  <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>Doctor / Hospital</span>
                {!isDoctorRole ? (
                  <span className="hidden sm:inline-flex items-center text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                    Staff Sign In
                  </span>
                ) : (
                  pendingCount > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-black shadow-sm">
                      {pendingCount}
                    </span>
                  )
                )}
              </button>
            </div>

            {/* User Profile Chip & Logout */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.name || currentPatient?.name || 'Guest User'}
                </span>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                  {currentUser?.role === 'patient' ? 'Registered Patient' : currentUser?.role === 'admin' ? 'Hospital Admin' : 'Attending MD'}
                </span>
              </div>

              <button
                onClick={logoutUser}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Sign Out to Login Screen"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Gated Medical Staff Sign-In Modal */}
      <DoctorAuthModal
        isOpen={doctorAuthModalOpen}
        onClose={() => setDoctorAuthModalOpen(false)}
      />
    </header>
  );
}

