import React from 'react';
import { MediSenseProvider, useMediSense } from './context/MediSenseContext';
import AuthPage from './components/auth/AuthPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PatientPortal from './components/patient/PatientPortal';
import DoctorPortal from './components/doctor/DoctorPortal';
import HospitalPortal from './components/hospital/HospitalPortal';

function AppContent() {
  const { currentUser, activePortal, setActivePortal, setDoctorAuthModalOpen } = useMediSense();

  // If not logged in, display the AuthPage
  if (!currentUser) {
    return <AuthPage />;
  }

  const isPatientAccessingStaff = (activePortal === 'doctor' || activePortal === 'hospital') && currentUser?.role === 'patient';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex-1 w-full">
        {isPatientAccessingStaff ? (
          <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-white border border-amber-200 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Staff Authentication Required
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Access Restricted: Medical Personnel Only
              </h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                You are currently signed in as a Registered Patient (<strong>{currentUser.name}</strong>). Access to the Physician Command Center, emergency triage queue, and hospital bed telemetry is restricted to licensed medical staff.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDoctorAuthModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Sign In as Doctor / Hospital Staff
              </button>
              <button
                onClick={() => setActivePortal('patient')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
              >
                Return to Patient Portal
              </button>
            </div>
          </div>
        ) : activePortal === 'patient' ? (
          <PatientPortal />
        ) : activePortal === 'hospital' ? (
          <HospitalPortal />
        ) : (
          <DoctorPortal />
        )}
      </main>
      <Footer />
    </div>
  );
}



export default function App() {
  return (
    <MediSenseProvider>
      <AppContent />
    </MediSenseProvider>
  );
}
