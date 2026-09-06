import React, { useState, useMemo } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import {
  Users,
  Stethoscope,
  Building2,
  Clock,
  Search,
  ShieldCheck,
  PlusCircle,
  Fingerprint,
  LogIn
} from 'lucide-react';

export default function HospitalLiveAudit() {
  const {
    auditLogs = [],
    simulateUserSignIn,
    hospitalDoctors = [],
    patientsList = []
  } = useMediSense();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'doctor' | 'patient' | 'admin'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User counts
  const totalDoctors = hospitalDoctors.length;
  const totalPatients = patientsList.length;
  const totalAdmins = 1;
  const totalSystemUsers = totalDoctors + totalPatients + totalAdmins;

  // Log counts
  const totalLogs = auditLogs.length;
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
      return log.userRole === roleFilter;
    });
  }, [auditLogs, searchQuery, roleFilter]);

  const handleSimulateSignIn = (role) => {
    if (simulateUserSignIn) {
      simulateUserSignIn(role);
      showToast(`Naya ${role.toUpperCase()} login record add ho gaya!`);
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

      {/* Header Banner: Total Users & Login Tracking */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <LogIn className="w-4 h-4 text-teal-600" />
              <span>User Sign-In History & User Directory</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Hospital Login History & Total Users
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Track exactly who signed into the system and when (Doctors, Patients, Administrators), with complete user counts.
            </p>
          </div>

          {/* Quick Simulation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={() => handleSimulateSignIn('patient')}
              className="px-3.5 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Add a new patient login record"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>+ Add Patient Login</span>
            </button>

            <button
              onClick={() => handleSimulateSignIn('doctor')}
              className="px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Add a new doctor login record"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>+ Add Doctor Login</span>
            </button>
          </div>

        </div>

        {/* Total Users Summary Cards (Ek Jgh Total Kitne Users Hai: Doctor + Patient + Admin) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          
          {/* Card 1: Total Users in System */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-sm">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total System Users</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {totalSystemUsers}
            </div>
            <span className="text-[10px] text-teal-400 font-semibold block mt-0.5">
              {totalDoctors} Doctors • {totalPatients} Patients • 1 Admin
            </span>
          </div>

          {/* Card 2: Total Doctors */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center justify-between">
              <span>Total Doctors</span>
              <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-900 mt-1">
              {totalDoctors}
            </div>
            <span className="text-[10px] text-indigo-600 font-medium block mt-0.5">
              Verified attending staff
            </span>
          </div>

          {/* Card 3: Total Patients */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
            <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center justify-between">
              <span>Total Patients</span>
              <Users className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-900 mt-1">
              {totalPatients}
            </div>
            <span className="text-[10px] text-teal-600 font-medium block mt-0.5">
              Registered patient accounts
            </span>
          </div>

          {/* Card 4: Total Login Events Recorded */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Logins Recorded</span>
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {totalLogs}
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Sign-in timestamp history
            </span>
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
            placeholder="Search login history by name, UHID, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white"
          />
        </div>

        {/* Filter Pills (No 'online' filter as requested) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: `All Logins (${totalLogs})` },
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

      {/* Real-Time Login Feed Cards (Clean: Kisne Kab Login Kiya, NO online badges) */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 text-xs space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold">No login records found matching your filter.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isDoctor = log.userRole === 'doctor';
            const isPatient = log.userRole === 'patient';
            const isAdmin = log.userRole === 'admin';

            return (
              <div
                key={log.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                
                {/* Left: User Avatar, Name & Role */}
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
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-mono text-slate-700 font-semibold">{log.identifier}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                        <Fingerprint className="w-3 h-3 text-slate-400" />
                        IP: {log.ipAddress}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                      {log.details}
                    </p>
                  </div>

                </div>

                {/* Right: Exactly KAB login kiya (Clock time + date) */}
                <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-black text-slate-900">
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
          <span>Every login event is time-stamped and automatically appended to this access history.</span>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Total Registered Users: {totalSystemUsers}
        </span>
      </div>

    </div>
  );
}
