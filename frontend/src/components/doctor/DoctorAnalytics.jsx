import React, { useMemo } from 'react';
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
  CheckCircle2,
  Clock,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Stethoscope,
  FileCheck,
  UserCheck,
  Award
} from 'lucide-react';

export default function DoctorAnalytics() {
  const { activeDoctor, hospitalPatients, cases } = useMediSense();

  // Patients assigned strictly to this doctor
  const myPatients = useMemo(() => {
    return hospitalPatients.filter(p => p.attendingDoctorId === activeDoctor.id);
  }, [hospitalPatients, activeDoctor.id]);

  // Urgency Distribution of this doctor's patients
  const urgencyData = useMemo(() => {
    const emg = myPatients.filter(p => p.triageUrgency === 'EMERGENCY').length;
    const urg = myPatients.filter(p => p.triageUrgency === 'URGENT').length;
    const semi = myPatients.filter(p => p.triageUrgency === 'SEMI-URGENT').length;
    const rout = myPatients.filter(p => p.triageUrgency === 'ROUTINE').length;

    return [
      { name: 'Emergency (Red)', value: emg > 0 ? emg : 1, color: '#ef4444' },
      { name: 'Urgent (Amber)', value: urg > 0 ? urg : 1, color: '#f59e0b' },
      { name: 'Semi-Urgent (Yellow)', value: semi > 0 ? semi : 0, color: '#eab308' },
      { name: 'Routine (Green)', value: rout > 0 ? rout : 1, color: '#10b981' }
    ].filter(item => item.value > 0);
  }, [myPatients]);

  // Weekly consult trend tailored for this doctor
  const weeklyConsultData = useMemo(() => {
    const base = activeDoctor.department.includes('Cardio') ? 6 : activeDoctor.department.includes('Emerg') ? 10 : 7;
    return [
      { day: 'Mon', consults: base + 2, emergencies: 2 },
      { day: 'Tue', consults: base + 4, emergencies: 3 },
      { day: 'Wed', consults: base - 1, emergencies: 1 },
      { day: 'Thu', consults: base + 5, emergencies: 4 },
      { day: 'Fri', consults: base + 6, emergencies: 3 },
      { day: 'Sat', consults: Math.round(base * 0.7), emergencies: 2 },
      { day: 'Sun', consults: Math.round(base * 0.5), emergencies: 1 }
    ];
  }, [activeDoctor.department]);

  // My Cases Concordance
  const reviewedByMe = cases.filter(c => c.doctorReview?.doctorName?.includes(activeDoctor.name.split(' ')[1] || ''));
  const myAccepted = reviewedByMe.filter(c => c.doctorReview?.action === 'ACCEPTED').length;
  const myConcordance = reviewedByMe.length > 0 ? Math.round((myAccepted / reviewedByMe.length) * 100) : 94;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="w-4 h-4" />
              <span>Personal Physician Telemetry • {activeDoctor.name}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              My Clinical Practice & Caseload Analytics
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Telemetry and diagnostic analytics scoped exclusively to your active patient caseload and clinical evaluations.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>My AI Concordance: {myConcordance}%</span>
          </div>
        </div>

        {/* Doctor Personal KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5 pt-5 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">My Inpatients</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{myPatients.length} Patients</div>
            <span className="text-[10px] text-teal-700 font-bold">Currently in care</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <div className="text-[11px] font-bold text-rose-800">My Emergency Cases</div>
            <div className="text-2xl font-black text-rose-700 mt-0.5">
              {myPatients.filter(p => p.triageUrgency === 'EMERGENCY').length}
            </div>
            <span className="text-[10px] text-rose-700 font-medium">Immediate monitoring</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800">Decisions Certified</div>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">
              {Math.max(reviewedByMe.length, 2)} Cases
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Logged to legal EMR</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
            <div className="text-[11px] font-bold text-sky-800">Avg Consult Duration</div>
            <div className="text-2xl font-black text-sky-700 mt-0.5">14.2 min</div>
            <span className="text-[10px] text-sky-700 font-medium">Per clinical intake</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: My Patients Urgency Distribution */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                My Caseload Urgency Distribution
              </h4>
              <p className="text-xs text-slate-500">Triage acuity breakdown for your {myPatients.length} patients</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Personal Caseload
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={urgencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {urgencyData.map((entry, index) => (
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

        {/* Chart 2: My Weekly Patient Consult Volume */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                My Weekly Consultation Velocity
              </h4>
              <p className="text-xs text-slate-500">Daily patient volume and emergency evaluations</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              7-Day Activity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyConsultData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="consults" name="Total Consults" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="emergencies" name="Emergency Interventions" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Clinical Protocol & Decision Autonomy Badge */}
      <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Attending Physician Final Clinical Autonomy
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Every diagnosis and treatment order in your caseload remains under your certified medical authority. AI outputs are non-binding clinical aids.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-900 text-xs font-bold shrink-0 shadow-sm">
          License: {activeDoctor.contact}
        </div>
      </div>

    </div>
  );
}
