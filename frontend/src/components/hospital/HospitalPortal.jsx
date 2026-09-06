import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import HospitalRoster from '../doctor/HospitalRoster';
import ClinicalAnalytics from '../doctor/ClinicalAnalytics';
import {
  Building2,
  Users,
  BarChart3,
  Stethoscope,
  Bed,
  Sparkles,
  ShieldAlert,
  Activity,
  Wind
} from 'lucide-react';
import { HOSPITAL_RESOURCES } from '../../data/mockData';

export default function HospitalPortal() {
  const { hospitalDoctors, hospitalPatients } = useMediSense();

  const [hospitalTab, setHospitalTab] = useState('directory'); // 'directory' | 'census' | 'analytics'

  const availableDoctorsCount = hospitalDoctors.filter(d => d.status === 'AVAILABLE').length;

  return (
    <div className="space-y-8">
      
      {/* Hospital Central Command Top Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Hospital Central Operations & Institutional Command Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              MediSense Central Hospital Administration
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-3xl">
              Complete institutional intelligence across all medical departments: real-time staff doctor availability, hospital-wide patient census, surgical theaters, and critical bed telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{availableDoctorsCount} Doctors Free Now</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>{hospitalPatients.length} Total Patients</span>
            </div>
          </div>
        </div>

        {/* Institutional KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Bed Occupancy</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {HOSPITAL_RESOURCES.totalOccupied} / {HOSPITAL_RESOURCES.totalBeds}
            </div>
            <span className="text-[10px] text-teal-700 font-bold">{HOSPITAL_RESOURCES.overallOccupancyRate}% Occupied</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Staff Physicians</div>
            <div className="text-xl sm:text-2xl font-black text-indigo-700 mt-0.5">
              {hospitalDoctors.length} On Duty
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">{availableDoctorsCount} Free Now</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">ICU Ventilators</div>
            <div className="text-xl sm:text-2xl font-black text-cyan-700 mt-0.5">
              {HOSPITAL_RESOURCES.ventilators.inUse} / {HOSPITAL_RESOURCES.ventilators.total}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">{HOSPITAL_RESOURCES.ventilators.available} Available</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Oxygen Purity</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">99.2%</div>
            <span className="text-[10px] text-emerald-700 font-medium">4,200L Reserve</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Active Theaters</div>
            <div className="text-xl sm:text-2xl font-black text-rose-700 mt-0.5">2 In Surgery</div>
            <span className="text-[10px] text-amber-700 font-medium">1 Prep • 1 Cath Lab</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Ambulances</div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">4 Active</div>
            <span className="text-[10px] text-slate-500 font-medium">2 On Standby</span>
          </div>
        </div>
      </div>

      {/* Hospital Navigation Sub-Tabs */}
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
          <span>Total Hospital Patient Census ({hospitalPatients.length})</span>
        </button>

        <button
          onClick={() => setHospitalTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            hospitalTab === 'analytics'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Hospital Visual Analytics & Telemetry</span>
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
        {hospitalTab === 'analytics' && (
          <ClinicalAnalytics />
        )}
      </div>

    </div>
  );
}
