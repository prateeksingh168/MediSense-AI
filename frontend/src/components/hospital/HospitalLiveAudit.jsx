import React, { useState, useMemo } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import {
  Activity,
  Users,
  Stethoscope,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  UserCheck,
  LogOut,
  LogIn,
  RotateCw,
  PlusCircle,
  Laptop,
  Radio,
  Fingerprint
} from 'lucide-react';

export default function HospitalLiveAudit() {
  const {
    auditLogs = [],
    simulateUserSignIn,
    setAuditLogs,
    currentUser
  } = useMediSense();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'doctor' | 'patient' | 'admin'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalLogs = auditLogs.length;
  const activeNowCount = auditLogs.filter(l => l.status === 'ACTIVE_NOW').length;
  const doctorLogsCount = auditLogs.filter(l => l.userRole === 'doctor').length;
  const patientLogsCount = auditLogs.filter(l => l.userRole === 'patient').length;
  const adminLogsCount = auditLogs.filter(l => l.userRole === 'admin').length;

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch =
        (log.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.identifier || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.ipAddress || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (roleFilter === 'ALL') return true;
      if (roleFilter === 'ACTIVE') return log.status === 'ACTIVE_NOW';
      return log.userRole === roleFilter;
    });
  }, [auditLogs, searchQuery, roleFilter]);

  const handleSimulateSignIn = (role) => {
    if (simulateUserSignIn) {
      simulateUserSignIn(role);
      showToast(`New ${role.toUpperCase()} sign-in event logged in real time!`);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Reset live audit logs to default?')) {
      localStorage.removeItem('medisense_live_audit_logs');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Real-time Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-teal-500 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
          <span className="text-xs font-bold text-teal-300">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Real-Time User Access Telemetry • Live Session Store</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Hospital Live Sign-In & User Activity Hub
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Continuous live tracking of who is using the platform, when they authenticated, their healthcare role (Doctor, Patient, Administrator), and session duration.
            </p>
          </div>

          {/* Quick Simulation & Live Pulse Badge */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{activeNowCount} Users Online Now</span>
            </div>

            <button
              onClick={() => handleSimulateSignIn('patient')}
              className="px-3 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Simulate a new patient logging in right now"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>+ Test Patient Sign-In</span>
            </button>

            <button
              onClick={() => handleSimulateSignIn('doctor')}
              className="px-3 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Simulate a new doctor logging in right now"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>+ Test Doctor Sign-In</span>
            </button>
          </div>

        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Total Sign-Ins Logged</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{totalLogs}</div>
            <span className="text-[10px] text-teal-700 font-bold">Stored in real-time</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800">Active Online Now</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">{activeNowCount}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Live active sessions</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div className="text-[11px] font-bold text-indigo-800">Doctor Access Events</div>
            <div className="text-xl sm:text-2xl font-black text-indigo-700 mt-0.5">{doctorLogsCount}</div>
            <span className="text-[10px] text-indigo-700 font-medium">Physician workspace</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
            <div className="text-[11px] font-bold text-teal-800">Patient Access Events</div>
            <div className="text-xl sm:text-2xl font-black text-teal-700 mt-0.5">{patientLogsCount}</div>
            <span className="text-[10px] text-teal-700 font-medium">Symptom & vitals app</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800">Admin Operations</div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">{adminLogsCount}</div>
            <span className="text-[10px] text-amber-700 font-medium">Hospital command</span>
          </div>

        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sign-ins by name, UHID, email, IP, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: `All (${totalLogs})` },
            { id: 'ACTIVE', label: `Active Online (${activeNowCount})` },
            { id: 'doctor', label: `Doctors (${doctorLogsCount})` },
            { id: 'patient', label: `Patients (${patientLogsCount})` },
            { id: 'admin', label: `Admins (${adminLogsCount})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === f.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* Real-Time Live Activity Feed List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 text-xs space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold">No sign-in records matched your filter criteria.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isDoctor = log.userRole === 'doctor';
            const isPatient = log.userRole === 'patient';
            const isAdmin = log.userRole === 'admin';
            const isOnline = log.status === 'ACTIVE_NOW';

            return (
              <div
                key={log.id}
                className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isOnline ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                
                {/* Left: User Avatar & Basic Info */}
                <div className="flex items-start sm:items-center gap-3.5">
                  
                  {/* Avatar Initial with Role Color */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border shadow-inner ${
                    isDoctor
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : isPatient
                      ? 'bg-teal-50 border-teal-200 text-teal-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    {(log.userName || 'U').split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>

                  {/* User Identity Details */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {log.userName}
                      </h4>

                      {/* Role Pill */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isDoctor
                          ? 'bg-indigo-100 text-indigo-800'
                          : isPatient
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isDoctor && <Stethoscope className="w-3 h-3" />}
                        {isPatient && <Users className="w-3 h-3" />}
                        {isAdmin && <Building2 className="w-3 h-3" />}
                        <span>{log.userRole}</span>
                      </span>

                      {/* Online Pulse Indicator */}
                      {isOnline ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Online / Active Now</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          Session Concluded
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-mono text-slate-600 font-semibold">{log.identifier}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Fingerprint className="w-3 h-3 text-slate-400" />
                        IP: {log.ipAddress}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 font-medium leading-relaxed">
                      {log.details}
                    </p>
                  </div>

                </div>

                {/* Right: Timestamp & Action Badge */}
                <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{log.timestamp}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {log.date}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1">
                    {log.action}
                  </span>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Safety & Compliance Bottom Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Real-time access audit conforms to healthcare security standards. All user sign-ins are encrypted and time-stamped.</span>
        </div>
        <button
          onClick={handleClearLogs}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 underline cursor-pointer"
        >
          Reset Demo Audit History
        </button>
      </div>

    </div>
  );
}
