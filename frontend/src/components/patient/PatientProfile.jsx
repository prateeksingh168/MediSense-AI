import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import logoImg from '../../assets/logo.png';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldAlert,
  Pill,
  FileHeart,
  Heart,
  Activity,
  QrCode,
  Printer,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function PatientProfile() {
  const { currentPatient, currentUser } = useMediSense();

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    phone: currentPatient.phone,
    emergencyContact: currentPatient.emergencyContact,
    city: currentPatient.city || 'Mumbai, Maharashtra'
  });
  const [showIdCard, setShowIdCard] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    currentPatient.phone = editedProfile.phone;
    currentPatient.emergencyContact = editedProfile.emergencyContact;
    currentPatient.city = editedProfile.city;
    setIsEditing(false);
  };

  const vitals = currentPatient.lastVitals;

  return (
    <div className="space-y-8">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Health Profile & Medical History
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Personal information, chronic history, emergency contacts, and active prescriptions for <span className="font-bold text-teal-700">{currentPatient.name}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowIdCard(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-all shadow-sm"
          >
            <QrCode className="w-4 h-4 text-teal-600" />
            <span>Digital Health ID Card</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all shadow-sm"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Contact Info'}</span>
          </button>
        </div>
      </div>

      {/* Main 3 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Core Personal & Registration Data */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              {currentPatient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{currentPatient.name}</h3>
                <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
                  {currentPatient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentPatient.age} yrs • {currentPatient.gender} • Blood: <span className="font-extrabold text-teal-700">{currentPatient.bloodType}</span>
              </p>
            </div>
          </div>

          {/* Registration Details Form / View */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  value={editedProfile.city}
                  onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={editedProfile.emergencyContact}
                  onChange={(e) => setEditedProfile({ ...editedProfile, emergencyContact: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-sm"
              >
                Save Updated Details
              </button>
            </form>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                </span>
                <span className="font-semibold text-slate-900">
                  {currentUser?.email || `${currentPatient.name.toLowerCase().replace(' ', '.')}@medisense.ai`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Phone:
                </span>
                <span className="font-mono font-medium text-slate-900">{currentPatient.phone}</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> City / Region:
                </span>
                <span className="font-medium text-slate-900">{currentPatient.city || 'Mumbai / Delhi'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Emergency Contact</span>
                <div className="font-bold text-slate-900">{currentPatient.emergencyContact}</div>
              </div>
            </div>
          )}

        </div>

        {/* Column 2: Health History, Chronic Conditions & Allergies */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-2">
              <FileHeart className="w-4 h-4 text-rose-500" />
              <span>Chronic Medical Conditions</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentPatient.chronicConditions.length > 0 ? (
                currentPatient.chronicConditions.map((cond, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {cond}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No chronic diagnoses documented</span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Documented Drug & Food Allergies</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentPatient.knownAllergies.map((allg, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {allg}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Surgical & Family History</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Prior Appendectomy: Unremarkable (2021)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Family History: Paternal Early CAD & Hypertension</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Column 3: Active Medications & Baseline Vitals */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4 text-teal-600" />
              <span>Active Prescribed Medications</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {currentPatient.currentMedications.map((med, idx) => (
                <li key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold flex items-center justify-between">
                  <span>{med}</span>
                  <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 font-bold">
                    Rx Active
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Baseline Intake Vitals Snapshot</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Blood Pressure</span>
                <span className="font-bold text-slate-900">{vitals.bpSys}/{vitals.bpDia} mmHg</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Heart Rate</span>
                <span className="font-bold text-slate-900">{vitals.hr} BPM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Oxygen Saturation</span>
                <span className="font-bold text-teal-700">{vitals.spo2}% SpO2</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Blood Glucose</span>
                <span className="font-bold text-slate-900">{vitals.glucose} mg/dL</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Digital Health ID Card Modal */}
      {showIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-300 text-slate-900 space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Digital Patient Health Card</span>
              <button onClick={() => setShowIdCard(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            {/* Smart Health Card Design */}
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-teal-950 text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={logoImg} alt="MediSense AI Logo" className="h-8 w-auto object-contain" />
                  <span className="text-sm font-black tracking-wider">MEDISENSE HEALTH ID</span>
                </div>
                <span className="text-[10px] font-mono text-teal-300 font-bold border border-teal-500/40 px-2 py-0.5 rounded-md">
                  {currentPatient.id}
                </span>
              </div>

              <div>
                <div className="text-lg font-black">{currentPatient.name}</div>
                <div className="text-xs text-slate-300">
                  {currentPatient.age} Yrs • {currentPatient.gender} • Blood Group: <strong className="text-teal-300">{currentPatient.bloodType}</strong>
                </div>
              </div>

              <div className="text-xs text-slate-300 grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/80">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Emergency Phone</span>
                  <span>{currentPatient.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Allergies</span>
                  <span className="truncate block">{currentPatient.knownAllergies[0] || 'None'}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-700/80 text-[10px] text-slate-400">
                <span>AI Assists. Doctors Decide.</span>
                <div className="font-mono tracking-widest font-bold">|||| | || |||||</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-500 shadow flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Digital Health Card</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
