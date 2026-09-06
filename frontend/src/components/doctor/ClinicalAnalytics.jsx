import React from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  Activity,
  ShieldAlert,
  Sparkles,
  Bed,
  Clock,
  CheckCircle2,
  TrendingUp,
  Building2,
  Stethoscope,
  Wind,
  Droplet,
  Flame,
  Truck,
  Scissors
} from 'lucide-react';
import {
  HOSPITAL_BED_TELEMETRY,
  HOSPITAL_RESOURCES
} from '../../data/mockData';

const TRIAGE_DISTRIBUTION = [
  { name: 'Emergency (Red)', value: 18, color: '#ef4444' },
  { name: 'Urgent (Amber)', value: 34, color: '#f59e0b' },
  { name: 'Semi-Urgent (Yellow)', value: 28, color: '#eab308' },
  { name: 'Routine (Green)', value: 20, color: '#10b981' }
];

const DOCTOR_AVAILABILITY_DATA = [
  { name: 'Free / Available Now', value: 2, color: '#10b981' },
  { name: 'In Consultation', value: 2, color: '#f59e0b' },
  { name: 'In Surgery (OT)', value: 1, color: '#ef4444' },
  { name: 'On Rounds', value: 1, color: '#0ea5e9' }
];

const DEPARTMENT_WORKLOAD = [
  { department: 'Emergency & Trauma', patients: 28, doctors: 3 },
  { department: 'Cardiology & CCU', patients: 22, doctors: 2 },
  { department: 'General Surgery', patients: 18, doctors: 2 },
  { department: 'Pulmonology / ICU', patients: 15, doctors: 2 },
  { department: 'Neurology & Stroke', patients: 14, doctors: 2 },
  { department: 'Endocrinology', patients: 11, doctors: 1 }
];

const ADMISSION_FLOW_24H = [
  { time: '00:00', admissions: 4, discharges: 1 },
  { time: '04:00', admissions: 3, discharges: 0 },
  { time: '08:00', admissions: 14, discharges: 6 },
  { time: '12:00', admissions: 19, discharges: 12 },
  { time: '16:00', admissions: 12, discharges: 15 },
  { time: '20:00', admissions: 8, discharges: 4 }
];

export default function ClinicalAnalytics() {
  const { cases, hospitalDoctors, hospitalPatients } = useMediSense();

  const totalScreened = cases.length + 1495; // Synthetic dataset pool
  const emergencyCases = cases.filter(c => c.triageLevel === 'EMERGENCY').length + 86;

  return (
    <div className="space-y-8">
      
      {/* Analytics Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Hospital Intelligence • Operational & Clinical Telemetry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Hospital Visual Analytics & Capacity Telemetry
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-3xl">
              Complete institutional analytics covering multi-ward bed occupancy, real-time doctor availability distribution, department patient loads, surgical suite operations, and critical hospital reserves.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Concordance: 92.4%</span>
            </div>
          </div>
        </div>

        {/* Hospital-Wide Core KPI Gauges */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Total Bed Occupancy</span>
              <Bed className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {HOSPITAL_RESOURCES.totalOccupied} / {HOSPITAL_RESOURCES.totalBeds}
            </div>
            <span className="text-[10px] text-teal-700 font-bold">{HOSPITAL_RESOURCES.overallOccupancyRate}% Occupied</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Active Doctors</span>
              <Stethoscope className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-700">{hospitalDoctors.length} On Duty</div>
            <span className="text-[10px] text-emerald-700 font-bold">2 Available Free Now</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>ICU Ventilators</span>
              <Wind className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-cyan-700">
              {HOSPITAL_RESOURCES.ventilators.inUse} / {HOSPITAL_RESOURCES.ventilators.total}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">{HOSPITAL_RESOURCES.ventilators.available} Units Available</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Central O2 Line</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">99.2%</div>
            <span className="text-[10px] text-emerald-700 font-medium">4,200L High-Purity</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>OT Surgical Suites</span>
              <Scissors className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-700">2 In Surgery</div>
            <span className="text-[10px] text-amber-700 font-medium">1 Prep • 1 Cath Standby</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Ambulance Fleet</span>
              <Truck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700">4 / 6 Active</div>
            <span className="text-[10px] text-slate-500 font-medium">2 Stationed at Base</span>
          </div>

        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Multi-Ward Bed Telemetry */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Bed className="w-4 h-4 text-teal-600" />
                <span>Multi-Ward Bed Capacity Telemetry</span>
              </h3>
              <p className="text-xs text-slate-500">Occupied vs Available beds by clinical ward</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Live Census
            </span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOSPITAL_BED_TELEMETRY} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ward" stroke="#64748b" fontSize={10} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="occupied" name="Occupied Beds" fill="#0d9488" radius={[6, 6, 0, 0]} />
                <Bar dataKey="available" name="Available Beds" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Doctor Staff Workload & Availability */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-indigo-600" />
                <span>Doctor Staff Availability Status</span>
              </h3>
              <p className="text-xs text-slate-500">Breakdown of on-duty physician active duties</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              6 MDs On Duty
            </span>
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DOCTOR_AVAILABILITY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DOCTOR_AVAILABILITY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department Workload Distribution */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Departmental Patient Census & Staffing
              </h3>
              <p className="text-xs text-slate-500">Active patients per specialty division</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
              Department Load
            </span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_WORKLOAD} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="department" type="category" stroke="#64748b" fontSize={10} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                />
                <Bar dataKey="patients" fill="#6366f1" radius={[0, 8, 8, 0]} name="Active Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: 24-Hour Patient Admissions vs Discharges Flow */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                24-Hour Patient Admissions vs Discharges
              </h3>
              <p className="text-xs text-slate-500">Real-time hospital turnover flow</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Turnover Velocity
            </span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMISSION_FLOW_24H}>
                <defs>
                  <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDsc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="admissions" name="Intake Admissions" stroke="#0d9488" fillOpacity={1} fill="url(#colorAdm)" />
                <Area type="monotone" dataKey="discharges" name="Successful Discharges" stroke="#6366f1" fillOpacity={1} fill="url(#colorDsc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Operation Theaters (OT) Real-Time Utilization Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Scissors className="w-4 h-4 text-indigo-600" />
            <span>Surgical Suites & Operation Theater (OT) Real-Time Status</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">4 Surgical Suites Monitored</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {HOSPITAL_RESOURCES.operationTheaters.map(ot => {
            const isInSurgery = ot.status === 'IN_SURGERY';
            const isSterilizing = ot.status === 'STERILIZING';
            const isStandby = ot.status === 'STANDBY';

            return (
              <div
                key={ot.id}
                className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                  isInSurgery
                    ? 'bg-rose-50/70 border-rose-200'
                    : isSterilizing
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 font-extrabold text-sm">{ot.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isInSurgery
                        ? 'bg-rose-100 text-rose-800'
                        : isSterilizing
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {ot.statusLabel}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-slate-800 line-clamp-1">{ot.name}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Surgeon: {ot.surgeon}</div>
                  <div className="text-[11px] font-medium text-indigo-900 mt-0.5">
                    Procedure: {ot.procedure}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Target Time:</span>
                  <span className="font-bold text-slate-800">{ot.estimatedCompletion}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hospital Critical Supplies & Blood Bank Reserves */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Droplet className="w-4 h-4 text-rose-600" />
          <span>Hospital Blood Bank & Critical Medical Life-Support Reserves</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {Object.entries(HOSPITAL_RESOURCES.bloodBank).map(([bloodType, data]) => (
            <div key={bloodType} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center">
              <div className="text-xl font-black text-rose-600">{bloodType}</div>
              <div className="text-lg font-extrabold text-slate-900">{data.units} Units</div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                {data.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
