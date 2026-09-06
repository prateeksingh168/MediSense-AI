import React from 'react';
import logoImg from '../assets/logo.png';
import { ShieldCheck, HeartPulse, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 py-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-1 rounded-xl bg-slate-900 shadow-sm inline-block">
                <img src={logoImg} alt="MediSense AI Logo" className="h-8 w-auto object-contain rounded-md" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                MEDISENSE <span className="text-teal-600">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed font-medium">
              An intelligent clinical decision-support platform bridging patients and physicians. 
              Powered by Explainable AI (XAI), safety red-flag triage, and 1,500+ synthetic clinical cohort references.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Principle: AI assists. Doctors decide.</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Patient Features</h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-teal-600" /> Multi-System Symptom Checker</li>
              <li className="flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-teal-600" /> Red-Flag Emergency Alerts</li>
              <li className="flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-teal-600" /> Vital Telemetry Trends (Recharts)</li>
              <li className="flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-teal-600" /> Doctor Appointment Token Receipts</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Clinician Command Center</h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-600" /> Prioritized Triage Queue</li>
              <li className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-600" /> Explainable AI (XAI) Attribution</li>
              <li className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-600" /> Clinical Analytics & Bed Occupancy</li>
              <li className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-600" /> Accept / Override Legal Audit Trail</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MediSense AI. Designed for Clinical Decision Support & Medical Hackathons.</p>
          <p className="italic text-slate-500 text-[11px] text-center sm:text-right">
            Medical Disclaimer: MediSense AI is a clinical decision-support tool. It does not replace independent licensed physician judgment.
          </p>
        </div>
      </div>
    </footer>
  );
}
