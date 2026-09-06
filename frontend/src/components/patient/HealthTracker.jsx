import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Heart,
  Activity,
  Wind,
  Zap,
  Plus,
  Info,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function HealthTracker() {
  const { currentPatient, vitalsHistory, addVitalRecord, loadSampleVitals } = useMediSense();

  const [showLogModal, setShowLogModal] = useState(false);
  const [formVitals, setFormVitals] = useState({
    bpSys: currentPatient?.lastVitals?.bpSys || 120,
    bpDia: currentPatient?.lastVitals?.bpDia || 80,
    hr: currentPatient?.lastVitals?.hr || 72,
    spo2: currentPatient?.lastVitals?.spo2 || 98,
    glucose: currentPatient?.lastVitals?.glucose || 95
  });

  const handleSaveVital = (e) => {
    e.preventDefault();
    addVitalRecord(formVitals);
    setShowLogModal(false);
  };

  const latest = currentPatient?.lastVitals;
  const hasRecordedVitals = Boolean(latest && vitalsHistory && vitalsHistory.length > 0);

  const isBpElevated = latest ? (latest.bpSys >= 140 || latest.bpDia >= 90) : false;
  const isHrElevated = latest ? (latest.hr >= 100) : false;
  const isHypoxic = latest ? (latest.spo2 < 95) : false;
  const isGlucoseElevated = latest ? (latest.glucose > 140) : false;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Health Vitals Tracking & Biometrics
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Real-time biometric telemetry for <span className="text-teal-700 font-bold">{currentPatient?.name}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!hasRecordedVitals && (
            <button
              onClick={loadSampleVitals}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 shadow-sm transition-all"
              title="Load realistic sample vitals for testing and demonstration"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Load Sample Baseline</span>
            </button>
          )}

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{hasRecordedVitals ? 'Log New Vital Reading' : 'Log First Vital Reading'}</span>
          </button>
        </div>
      </div>

      {/* If patient has NO recorded vitals yet (e.g. freshly registered patient like anamika) */}
      {!hasRecordedVitals && (
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200/90 text-amber-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">No Vitals Recorded Yet</h4>
              <p className="text-xs text-amber-800/90 mt-0.5 max-w-2xl leading-relaxed">
                As <span className="font-semibold">{currentPatient?.name}</span> is newly registered, no biometrics (Blood Pressure, Heart Rate, SpO2, or Glucose) have been measured yet. You can log your current reading manually or load demo vitals for evaluation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              onClick={() => setShowLogModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm"
            >
              + Log Reading
            </button>
            <button
              onClick={loadSampleVitals}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-300 shadow-sm"
            >
              Load Demo Baseline
            </button>
          </div>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Blood Pressure Card */}
        <div className={`p-5 rounded-3xl border bg-white shadow-sm transition-all ${
          !hasRecordedVitals ? 'border-dashed border-slate-300' : isBpElevated ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Blood Pressure</span>
            <Activity className={`w-4 h-4 ${!hasRecordedVitals ? 'text-slate-400' : isBpElevated ? 'text-rose-500' : 'text-teal-600'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${!hasRecordedVitals ? 'text-slate-400' : 'text-slate-900'}`}>
              {hasRecordedVitals ? `${latest.bpSys}/${latest.bpDia}` : '-- / --'}
            </span>
            <span className="text-xs text-slate-400">mmHg</span>
          </div>
          <div className="mt-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
              !hasRecordedVitals
                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                : isBpElevated
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {!hasRecordedVitals ? 'Awaiting Measurement' : isBpElevated ? 'Stage 2 Hypertension' : 'Optimal BP'}
            </span>
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className={`p-5 rounded-3xl border bg-white shadow-sm transition-all ${
          !hasRecordedVitals ? 'border-dashed border-slate-300' : isHrElevated ? 'border-amber-300 ring-1 ring-amber-300' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Heart Rate (Pulse)</span>
            <Heart className={`w-4 h-4 ${!hasRecordedVitals ? 'text-slate-400' : isHrElevated ? 'text-amber-500' : 'text-rose-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${!hasRecordedVitals ? 'text-slate-400' : 'text-slate-900'}`}>
              {hasRecordedVitals ? latest.hr : '--'}
            </span>
            <span className="text-xs text-slate-400">BPM</span>
          </div>
          <div className="mt-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
              !hasRecordedVitals
                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                : isHrElevated
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {!hasRecordedVitals ? 'Not Monitored' : isHrElevated ? 'Sinus Tachycardia' : 'Normal Resting HR'}
            </span>
          </div>
        </div>

        {/* Blood Oxygen SpO2 */}
        <div className={`p-5 rounded-3xl border bg-white shadow-sm transition-all ${
          !hasRecordedVitals ? 'border-dashed border-slate-300' : isHypoxic ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Oxygen Saturation</span>
            <Wind className={`w-4 h-4 ${!hasRecordedVitals ? 'text-slate-400' : isHypoxic ? 'text-rose-500' : 'text-sky-600'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${!hasRecordedVitals ? 'text-slate-400' : 'text-slate-900'}`}>
              {hasRecordedVitals ? `${latest.spo2}%` : '-- %'}
            </span>
            <span className="text-xs text-slate-400">SpO2</span>
          </div>
          <div className="mt-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
              !hasRecordedVitals
                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                : isHypoxic
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {!hasRecordedVitals ? 'Not Monitored' : isHypoxic ? 'Hypoxic Alert (<95%)' : 'Optimal Saturation'}
            </span>
          </div>
        </div>

        {/* Blood Glucose */}
        <div className={`p-5 rounded-3xl border bg-white shadow-sm transition-all ${
          !hasRecordedVitals ? 'border-dashed border-slate-300' : isGlucoseElevated ? 'border-amber-300 ring-1 ring-amber-300' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Blood Glucose</span>
            <Zap className={`w-4 h-4 ${!hasRecordedVitals ? 'text-slate-400' : isGlucoseElevated ? 'text-amber-500' : 'text-emerald-600'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${!hasRecordedVitals ? 'text-slate-400' : 'text-slate-900'}`}>
              {hasRecordedVitals ? latest.glucose : '--'}
            </span>
            <span className="text-xs text-slate-400">mg/dL</span>
          </div>
          <div className="mt-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
              !hasRecordedVitals
                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                : isGlucoseElevated
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {!hasRecordedVitals ? 'Not Monitored' : isGlucoseElevated ? 'Elevated Glycemia' : 'Normal Euglycemia'}
            </span>
          </div>
        </div>

      </div>

      {/* Recharts Analytics Section */}
      {hasRecordedVitals ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Blood Pressure Trends */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Blood Pressure Profile (Systolic / Diastolic)
                </h3>
                <p className="text-xs text-slate-500">Normal Range: &lt;120 / &lt;80 mmHg</p>
              </div>
              <span className="text-[11px] font-mono text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Telemetry Trend
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vitalsHistory}>
                  <defs>
                    <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891b2" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[60, 180]} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="bpSys" name="Systolic (mmHg)" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSys)" />
                  <Area type="monotone" dataKey="bpDia" name="Diastolic (mmHg)" stroke="#0891b2" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDia)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Heart Rate & SpO2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Hemodynamics: Heart Rate & Oxygenation
                </h3>
                <p className="text-xs text-slate-500">Pulse rate and SpO2 correlation</p>
              </div>
              <span className="text-[11px] font-mono text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Live Monitor
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#f43f5e" fontSize={11} domain={[50, 140]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} domain={[85, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="hr" name="Heart Rate (BPM)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      ) : (
        /* Clean Placeholder State for Graphs when no vitals have been recorded */
        <div className="p-10 rounded-3xl bg-white border-2 border-dashed border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center mx-auto">
            <Activity className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-800">Biometric Trend Graphs Awaiting Data</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Once you log your first vital sign reading or connect a telemetry monitor, your 24-hour continuous Blood Pressure profile and Hemodynamics correlation charts will be plotted here automatically.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
            <button
              onClick={() => setShowLogModal(true)}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Record Initial Reading</span>
            </button>
            <button
              onClick={loadSampleVitals}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Load Demo Baseline Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Log Vital Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record New Biometric Reading</h3>
                <p className="text-[11px] text-slate-500">Add baseline vital measurements to medical history</p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVital} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={formVitals.bpSys}
                    onChange={(e) => setFormVitals({ ...formVitals, bpSys: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="120"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={formVitals.bpDia}
                    onChange={(e) => setFormVitals({ ...formVitals, bpDia: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="80"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={formVitals.hr}
                    onChange={(e) => setFormVitals({ ...formVitals, hr: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="72"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={formVitals.spo2}
                    onChange={(e) => setFormVitals({ ...formVitals, spo2: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="98"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={formVitals.glucose}
                    onChange={(e) => setFormVitals({ ...formVitals, glucose: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="95"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md transition-all"
                >
                  Save to Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
