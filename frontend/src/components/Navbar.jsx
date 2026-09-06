import React from 'react';
import { useMediSense } from '../context/MediSenseContext';
import {
  Stethoscope,
  User,
  ShieldAlert,
  Sparkles,
  LogOut,
  Lock,
  Building2
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import DoctorAuthModal from './auth/DoctorAuthModal';

export default function Navbar() {
  const {
    currentUser,
    logoutUser,
    currentPatient,
    emergencyCount,
    doctorAuthModalOpen,
    setDoctorAuthModalOpen,
    activeDoctor
  } = useMediSense();

  const isDoctorRole = currentUser?.role === 'doctor' || currentUser?.role === 'admin';



  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5 select-none">
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
            
            {/* Emergency Ticker Indicator (Visible strictly to authenticated clinical staff) */}
            {isDoctorRole && emergencyCount > 0 && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold shadow-sm"
                title="Active High-Acuity Emergency Cases in Hospital Queue"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>{emergencyCount} Emergency Alert{emergencyCount > 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Authenticated Active Portal Badge (Read-only, no direct cross-role hopping) */}
            <div>
              {currentUser?.role === 'patient' ? (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-bold shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                  <User className="w-4 h-4 text-teal-600" />
                  <span>Patient Portal</span>
                  <span className="hidden md:inline-block text-[10px] text-teal-700 font-semibold border-l border-teal-200 pl-2">
                    Confidential & Encrypted
                  </span>
                </div>
              ) : currentUser?.role === 'doctor' ? (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs sm:text-sm font-bold shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <Stethoscope className="w-4 h-4 text-indigo-600" />
                  <span>Doctor Workspace</span>
                  <span className="hidden md:inline-block text-[10px] text-indigo-700 font-semibold border-l border-indigo-200 pl-2">
                    {activeDoctor?.name || currentUser?.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs sm:text-sm font-bold shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>Hospital Central Command</span>
                  <span className="hidden md:inline-block text-[10px] text-teal-700 font-semibold border-l border-teal-200 pl-2">
                    Executive Operations
                  </span>
                </div>
              )}
            </div>

            {/* User Profile Chip, Switch Account & Logout */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.role === 'doctor'
                    ? (activeDoctor?.name || currentUser?.name)
                    : currentUser?.role === 'admin'
                    ? 'Hospital Administration'
                    : (currentUser?.name || currentPatient?.name || 'Guest User')}
                </span>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                  {currentUser?.role === 'patient'
                    ? 'Registered Patient'
                    : currentUser?.role === 'admin'
                    ? 'Chief Operations'
                    : (activeDoctor?.department?.split('&')[0]?.trim() || 'Attending Physician')}
                </span>
              </div>

              {/* Secure Switch Account button (Opens staff auth modal for patients or signs out to login) */}
              <button
                onClick={() => {
                  if (currentUser?.role === 'patient') {
                    setDoctorAuthModalOpen(true);
                  } else {
                    logoutUser();
                  }
                }}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title={currentUser?.role === 'patient' ? "Medical Staff Authentication Required" : "Switch Account / Sign In as another user"}
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">
                  {currentUser?.role === 'patient' ? 'Staff Sign In' : 'Switch Account'}
                </span>
              </button>

              {/* Logout button */}
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

