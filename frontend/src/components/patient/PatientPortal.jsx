import React from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import SymptomEntry from './SymptomEntry';
import HealthTracker from './HealthTracker';
import PreviousAssessments from './PreviousAssessments';
import PatientProfile from './PatientProfile';
import MediChatbot from './MediChatbot';
import {
  Stethoscope,
  Activity,
  FileText,
  User,
  PhoneCall,
  ShieldCheck,
  Bot,
  Sparkles,
  HeartPulse
} from 'lucide-react';

export default function PatientPortal() {
  const { patientTab, setPatientTab, currentPatient, cases } = useMediSense();

  const myAssessmentsCount = cases.filter(c => c.patientId === currentPatient.id).length;

  const tabs = [
    { id: 'symptoms', label: 'Symptom Entry & AI Analysis', icon: Stethoscope },
    { id: 'vitals', label: 'Health Tracking & Vitals', icon: Activity },
    { id: 'history', label: `Previous Assessments (${myAssessmentsCount})`, icon: FileText },
    { id: 'profile', label: 'Patient Profile', icon: User }
  ];

  return (
    <div className="space-y-12 relative">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = patientTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPatientTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div>
        {patientTab === 'symptoms' && <SymptomEntry />}
        {patientTab === 'vitals' && <HealthTracker />}
        {patientTab === 'history' && <PreviousAssessments />}
        {patientTab === 'profile' && <PatientProfile />}
      </div>

      {/* Attractive Clinical Advisory & Support Hub (Eliminates empty white space) */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>Patient Guidance & Hospital Care Support</span>
            </h3>
            <p className="text-xs text-slate-500">24/7 clinical assistance and hospital check-in resources</p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
            Emergency Desk Open
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Emergency Hotline */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-white border border-rose-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span>24/7 Hospital Emergency Desk</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If experiencing crushing chest pain, difficulty breathing, or stroke symptoms, contact emergency dispatch immediately.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="tel:911"
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm"
              >
                Call ER (911 / 112)
              </a>
              <span className="text-[11px] text-slate-500 font-medium">Ambulance on call</span>
            </div>
          </div>

          {/* Card 2: AI Voice Companion Medi */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-50 to-white border border-teal-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-teal-800 font-bold text-sm">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                <Bot className="w-4 h-4" />
              </div>
              <span>Meet Medi (Voice & Text AI)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have questions about your health, appointments, or vitals? Click the floating Medi icon at the bottom right to talk or type anytime.
            </p>
            <div className="text-xs text-teal-700 font-bold flex items-center gap-1 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Speech-to-Text Enabled</span>
            </div>
          </div>

          {/* Card 3: Health Tracking & Vitals Trend */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-50 to-white border border-sky-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-sky-800 font-bold text-sm">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span>Continuous Health Tracking</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track daily blood pressure, pulse, SpO2 and glucose changes with interactive visual telemetry charts.
            </p>
            <button
              onClick={() => setPatientTab('vitals')}
              className="text-xs font-bold text-sky-700 hover:underline pt-1 block cursor-pointer"
            >
              Open Health Vitals Tracker →
            </button>
          </div>

        </div>

      </div>

      {/* Floating Medi AI Health Companion Chatbot (Speech-to-Text enabled) */}
      <MediChatbot />

    </div>
  );
}
