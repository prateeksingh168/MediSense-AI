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
import { Activity, ShieldAlert, Sparkles, Bed, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

const TRIAGE_DISTRIBUTION = [
  { name: 'Emergency (Red)', value: 18, color: '#ef4444' },
  { name: 'Urgent (Amber)', value: 34, color: '#f59e0b' },
  { name: 'Semi-Urgent (Yellow)', value: 28, color: '#eab308' },
  { name: 'Routine (Green)', value: 20, color: '#10b981' }
];

const TOP_CONDITIONS = [
  { condition: 'Acute Coronary Syndrome', count: 42 },
  { condition: 'Acute Appendicitis', count: 35 },
  { condition: 'Asthma Exacerbation', count: 31 },
  { condition: 'Hyperglycemia / DKA', count: 24 },
  { condition: 'Migraine / Neurologic', count: 19 },
  { condition: 'Viral Syndrome', count: 16 }
];

const INTAKE_TREND = [
  { day: 'Mon', emergency: 12, urgent: 24, routine: 18 },
  { day: 'Tue', emergency: 15, urgent: 28, routine: 22 },
  { day: 'Wed', emergency: 9, urgent: 21, routine: 19 },
  { day: 'Thu', emergency: 18, urgent: 32, routine: 25 },
  { day: 'Fri', emergency: 22, urgent: 36, routine: 30 },
  { day: 'Sat', emergency: 14, urgent: 26, routine: 17 },
  { day: 'Sun', emergency: 10, urgent: 20, routine: 15 }
];

export default function ClinicalAnalytics() {
  const { cases } = useMediSense();

  const totalScreened = cases.length + 1495; // Synthetic dataset pool
  const emergencyCases = cases.filter(c => c.triageLevel === 'EMERGENCY').length + 86;

  return (
    <div className="space-y-8">
      
      {/* Analytics Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Clinical Analytics & Epidemiological Intelligence
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Aggregated decision-support metrics, triage distribution, condition frequency, and physician concordance across 1,500+ synthetic clinical cohorts.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Triage Screenings</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalScreened.toLocaleString()}</div>
          <span className="text-[11px] text-teal-700 font-medium">Synthetic cohort dataset integrated</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Red-Flag Interceptions</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600">{emergencyCases}</div>
          <span className="text-[11px] text-rose-600 font-medium">Acutely flagged for immediate ER</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Physician Concordance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">92.4%</div>
          <span className="text-[11px] text-emerald-700 font-medium">Doctor agreement with AI suggestions</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Avg Triage Time</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-sky-600">4.2 min</div>
          <span className="text-[11px] text-sky-700 font-medium">From patient intake to MD sign-off</span>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Triage Urgency Distribution */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Triage Acuity Distribution
              </h3>
              <p className="text-xs text-slate-500">Breakdown of patient urgency tiers</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Live Stratification
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TRIAGE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {TRIAGE_DISTRIBUTION.map((entry, index) => (
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

        {/* Chart 2: Top Clinical Differential Diagnoses */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Top AI Differential Diagnoses
              </h3>
              <p className="text-xs text-slate-500">Most frequent condition predictions</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Epidemiological Model
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_CONDITIONS} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="condition" type="category" stroke="#64748b" fontSize={10} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                />
                <Bar dataKey="count" fill="#0891b2" radius={[0, 8, 8, 0]} name="Case Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Weekly Patient Triage Intake Flow */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Weekly Triage Intake & Patient Flow
              </h3>
              <p className="text-xs text-slate-500">Day-by-day Emergency vs Urgent cases</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Continuous Flow
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INTAKE_TREND}>
                <defs>
                  <linearGradient id="colorEmg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUrg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="emergency" name="Emergency (Red)" stroke="#ef4444" fillOpacity={1} fill="url(#colorEmg)" />
                <Area type="monotone" dataKey="urgent" name="Urgent (Amber)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUrg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Hospital ICU & Ward Telemetry Monitor */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Bed className="w-4 h-4 text-teal-600" />
          <span>Hospital Capacity & Telemetry Bed Tracking</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Cardiac Care Unit (CCU)</span>
              <span className="text-rose-600">85% Full</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="text-[11px] text-slate-500">17 of 20 Monitored Telemetry Beds Occupied</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Emergency Resuscitation</span>
              <span className="text-amber-600">60% Full</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="text-[11px] text-slate-500">6 of 10 Trauma Bays Available</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Outpatient Observation</span>
              <span className="text-emerald-600">42% Full</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '42%' }}></div>
            </div>
            <div className="text-[11px] text-slate-500">15 Beds Open for Urgent Admissions</div>
          </div>

        </div>
      </div>

    </div>
  );
}
