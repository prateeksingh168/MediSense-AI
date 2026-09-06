import React from 'react';
import { MediSenseProvider, useMediSense } from './context/MediSenseContext';
import AuthPage from './components/auth/AuthPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PatientPortal from './components/patient/PatientPortal';
import DoctorPortal from './components/doctor/DoctorPortal';

function AppContent() {
  const { currentUser, activePortal } = useMediSense();

  // If not logged in, display the Hackathon-winning AuthPage
  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex-1 w-full">
        {activePortal === 'patient' ? <PatientPortal /> : <DoctorPortal />}
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
