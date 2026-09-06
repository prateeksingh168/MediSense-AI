import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import HospitalRoster from '../doctor/HospitalRoster';
import HospitalLiveAudit from './HospitalLiveAudit';
import {
  Building2,
  Users,
  Stethoscope,
  Radio,
  Clock,
  ShieldCheck,
  Activity
} from 'lucide-react';

export default function HospitalPortal() {
  const { hospitalDoctors = [], hospitalPatients = [], auditLogs = [] } = useMediSense();

  // Tab: 'directory' (Doctors) | 'census' (Patients) | 'audit' (Real-Time Sign-Ins)
  const [hospitalTab, setHospitalTab] = useState('directory');

  const availableDoctorsCount = hospitalDoctors.filter(d => d.status === 'AVAILABLE').length;
  const emergencyPatientsCount = hospitalPatients.filter(p => p.triageUrgency === 'EMERGENCY').length;
  const activeNowCount = auditLogs.filter(l => l.status === 'ACTIVE_NOW').length;

  return (
    <div className="space-y-8">
      
      {/* Hospital Central Command Top Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Hospital Central Operations & Command Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              MediSense Central Hospital Administration
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-3xl">
              Real-time institutional oversight: Doctor staff shifts and live availability, hospital-wide admitted patient census, and continuous real-time sign-in session telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{availableDoctorsCount} Doctors Free Now</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>{hospitalPatients.length} Total Patients</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>{activeNowCount} Online Now</span>
            </div>
          </div>
        </div>

        {/* Clean, Focused Core Hospital KPI Cards (Eliminated over-complicated simulation boxes) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500">Staff Physicians</div>
              <div className="text-2xl font-black text-indigo-700 mt-0.5">
                {hospitalDoctors.length} On Duty
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">{availableDoctorsCount} Free / Ready for Intake</span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-100/70 text-indigo-700">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500">Total Admitted Patients</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {hospitalPatients.length} Inpatients
              </div>
              <span className="text-[11px] text-rose-700 font-bold">{emergencyPatientsCount} High-Risk Emergency</span>
            </div>
            <div className="p-3 rounded-2xl bg-teal-100/70 text-teal-700">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500">Live Active Platform Sessions</div>
              <div className="text-2xl font-black text-emerald-700 mt-0.5 flex items-center gap-2">
                <span>{activeNowCount} Online Now</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Real-time sign-in telemetry</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100/70 text-emerald-700">
              <Radio className="w-6 h-6" />
            </div>
          </div>

        </div>
      </div>

      {/* Hospital Navigation Sub-Tabs: Exactly 3 essential views */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setHospitalTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            hospitalTab === 'directory'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctors Staff & Availability ({hospitalDoctors.length})</span>
        </button>

        <button
          onClick={() => setHospitalTab('census')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            hospitalTab === 'census'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Total Hospital Patients Census ({hospitalPatients.length})</span>
        </button>

        <button
          onClick={() => setHospitalTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            hospitalTab === 'audit'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Real-Time Sign-In & Live User Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* Active Tab View */}
      <div>
        {hospitalTab === 'directory' && (
          <HospitalRoster initialView="doctors" />
        )}
        {hospitalTab === 'census' && (
          <HospitalRoster initialView="patients" />
        )}
        {hospitalTab === 'audit' && (
          <HospitalLiveAudit />
        )}
      </div>

    </div>
  );
}
