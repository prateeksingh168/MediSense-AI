import React, { useState, useMemo } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Search,
  Filter,
  Building2,
  Bed,
  Activity,
  Phone,
  Calendar,
  UserCheck,
  HeartPulse,
  Eye,
  X,
  BellRing,
  Sparkles
} from 'lucide-react';

export default function HospitalRoster() {
  const { hospitalDoctors, hospitalPatients, updateDoctorStatus } = useMediSense();

  // Active view: 'doctors' or 'patients'
  const [activeSubView, setActiveSubView] = useState('doctors');

  // Doctor filters
  const [doctorStatusFilter, setDoctorStatusFilter] = useState('ALL');

  // Patient filters
  const [patientSearch, setPatientSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');

  // Selected patient for EMR quick view modal
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Notification toast state
  const [pageToast, setPageToast] = useState(null);

  const handlePageDoctor = (doctor) => {
    setPageToast(`Hospital Intercom: Paging ${doctor.name} at ${doctor.cabin} (${doctor.contact})...`);
    setTimeout(() => setPageToast(null), 4000);
  };

  // Doctors filtering
  const filteredDoctors = useMemo(() => {
    if (doctorStatusFilter === 'ALL') return hospitalDoctors;
    return hospitalDoctors.filter(d => d.status === doctorStatusFilter);
  }, [hospitalDoctors, doctorStatusFilter]);

  // Patients filtering
  const filteredPatients = useMemo(() => {
    return hospitalPatients.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.uhid.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.bed.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.admittedDiagnosis.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.attendingDoctorName.toLowerCase().includes(patientSearch.toLowerCase());

      const matchesWard =
        wardFilter === 'ALL' ||
        p.ward.toLowerCase().includes(wardFilter.toLowerCase());

      const matchesUrgency =
        urgencyFilter === 'ALL' || p.triageUrgency === urgencyFilter;

      return matchesSearch && matchesWard && matchesUrgency;
    });
  }, [hospitalPatients, patientSearch, wardFilter, urgencyFilter]);

  // Counts
  const availableDoctorsCount = hospitalDoctors.filter(d => d.status === 'AVAILABLE').length;
  const inConsultCount = hospitalDoctors.filter(d => d.status === 'IN_CONSULTATION').length;
  const inSurgeryCount = hospitalDoctors.filter(d => d.status === 'IN_SURGERY').length;
  const onRoundsCount = hospitalDoctors.filter(d => d.status === 'ON_ROUNDS').length;
  const emergencyPatientsCount = hospitalPatients.filter(p => p.triageUrgency === 'EMERGENCY').length;

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {pageToast && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
          <span className="text-xs font-semibold">{pageToast}</span>
        </div>
      )}

      {/* Hospital Command Roster Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Hospital Operational Command • Staff & Patient Census</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Hospital Doctors Roster & Patient Directory
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-3xl">
              Real-time directory of on-duty physicians, live availability schedule (who is free and when), active patient assignments, and full hospital-wide inpatient & emergency census.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{availableDoctorsCount} Doctors Free Now</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>{hospitalPatients.length} Total Patients Admitted</span>
            </div>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Active Doctors</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{hospitalDoctors.length}</div>
            <span className="text-[10px] text-teal-700 font-bold">On Duty / On Call</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800">Free / Available</div>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{availableDoctorsCount}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Ready for intake</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800">In Consultation</div>
            <div className="text-2xl font-black text-amber-700 mt-0.5">{inConsultCount}</div>
            <span className="text-[10px] text-amber-700 font-medium">With patients</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <div className="text-[11px] font-bold text-rose-800">In Surgery (OT)</div>
            <div className="text-2xl font-black text-rose-700 mt-0.5">{inSurgeryCount}</div>
            <span className="text-[10px] text-rose-700 font-medium">Active procedures</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
            <div className="text-[11px] font-bold text-sky-800">Emergency Patients</div>
            <div className="text-2xl font-black text-sky-700 mt-0.5">{emergencyPatientsCount}</div>
            <span className="text-[10px] text-sky-700 font-medium">Red-flag priority</span>
          </div>
        </div>
      </div>

      {/* Main Switcher: Doctors Directory vs Total Patient Census */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex items-center shadow-inner w-full sm:w-auto">
          <button
            onClick={() => setActiveSubView('doctors')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubView === 'doctors'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors Staff & Availability ({hospitalDoctors.length})</span>
          </button>

          <button
            onClick={() => setActiveSubView('patients')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubView === 'patients'
                ? 'bg-white text-teal-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Total Hospital Patient Census ({hospitalPatients.length})</span>
          </button>
        </div>

        {/* Section Quick Summary Note */}
        <div className="text-xs text-slate-500 font-medium">
          {activeSubView === 'doctors'
            ? 'Live tracking of doctor shifts, current availability, and active bedside assignments.'
            : 'Complete census of all inpatient, critical care, and emergency room admissions.'}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: DOCTORS STAFF & LIVE AVAILABILITY ("konsa doctor kab free hai") */}
      {/* ========================================================================= */}
      {activeSubView === 'doctors' && (
        <div className="space-y-6">
          
          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Filter Availability:
            </span>
            <button
              onClick={() => setDoctorStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                doctorStatusFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Doctors ({hospitalDoctors.length})
            </button>
            <button
              onClick={() => setDoctorStatusFilter('AVAILABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                doctorStatusFilter === 'AVAILABLE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>🟢 Free / Available Now ({availableDoctorsCount})</span>
            </button>
            <button
              onClick={() => setDoctorStatusFilter('IN_CONSULTATION')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                doctorStatusFilter === 'IN_CONSULTATION'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <span>🟡 In Consultation ({inConsultCount})</span>
            </button>
            <button
              onClick={() => setDoctorStatusFilter('IN_SURGERY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                doctorStatusFilter === 'IN_SURGERY'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              <span>🔴 In Surgery ({inSurgeryCount})</span>
            </button>
            <button
              onClick={() => setDoctorStatusFilter('ON_ROUNDS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                doctorStatusFilter === 'ON_ROUNDS'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-sky-700 border border-sky-200 hover:bg-sky-50'
              }`}
            >
              <span>🔵 On Rounds ({onRoundsCount})</span>
            </button>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDoctors.map(doctor => {
              const isAvailable = doctor.status === 'AVAILABLE';
              const isInConsult = doctor.status === 'IN_CONSULTATION';
              const isInSurgery = doctor.status === 'IN_SURGERY';
              const isOnRounds = doctor.status === 'ON_ROUNDS';

              const statusColor = isAvailable
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : isInConsult
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : isInSurgery
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-sky-50 text-sky-800 border-sky-300';

              const badgeColor = isAvailable
                ? 'bg-emerald-500'
                : isInConsult
                ? 'bg-amber-500'
                : isInSurgery
                ? 'bg-rose-500'
                : 'bg-sky-500';

              return (
                <div
                  key={doctor.id}
                  className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  {/* Top Doctor Profile Header */}
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-800 text-lg shrink-0 shadow-inner">
                          {doctor.name.replace('Dr. ', '').split(' ')[0][0]}
                          {doctor.name.replace('Dr. ', '').split(' ')[1]?.[0] || 'M'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                              {doctor.name}
                            </h3>
                          </div>
                          <p className="text-xs font-bold text-indigo-700 mt-0.5">
                            {doctor.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {doctor.department}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${statusColor} shrink-0 shadow-sm`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${badgeColor} ${isAvailable ? 'animate-ping' : ''}`}></span>
                        <span>{doctor.statusLabel}</span>
                      </div>
                    </div>

                    {/* Schedule & Location Pill Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-semibold text-slate-800">{doctor.cabin}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-semibold text-slate-800">{doctor.dutyShift}</span>
                      </div>
                    </div>

                    {/* Next Free Time Highlight Box ("konsa doctor kab free hai") */}
                    <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-indigo-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-bold text-slate-700">Availability Slot:</span>
                      </div>
                      <span className="font-extrabold text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-sm">
                        {doctor.nextFreeTime}
                      </span>
                    </div>

                    {/* Currently Attending Patients Box ("kis kis patient ko dekh rha hai") */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                          <span>Currently Attending Patients ({doctor.currentlyAttending.length}):</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Active Bedside</span>
                      </div>

                      {doctor.currentlyAttending.length > 0 ? (
                        <div className="space-y-2">
                          {doctor.currentlyAttending.map((pat, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900">{pat.patientName}</span>
                                  <span className="text-[10px] text-slate-500">({pat.age}y, {pat.gender})</span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                                    {pat.bed}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 font-medium">
                                  {pat.diagnosis}
                                </div>
                                <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
                                  Plan: {pat.careStatus}
                                </div>
                              </div>

                              <span
                                className={`self-start sm:self-auto px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                                  pat.urgency === 'EMERGENCY'
                                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                    : pat.urgency === 'URGENT'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {pat.urgency}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>No active consults at this moment. Doctor is available on standby for new emergency triage admissions.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Doctor Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-500 font-medium">
                      {doctor.contact}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageDoctor(doctor)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Page physician on hospital intercom"
                      >
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>Page Doctor</span>
                      </button>

                      {/* Quick demo status cycler */}
                      <button
                        onClick={() => {
                          const nextStatus = isAvailable ? 'IN_CONSULTATION' : 'AVAILABLE';
                          const nextLabel = isAvailable ? 'In Consultation' : 'Available (Free Now)';
                          const nextTime = isAvailable ? 'Free in 20 mins' : 'Free Now (Standby)';
                          updateDoctorStatus(doctor.id, nextStatus, nextLabel, nextTime);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isAvailable
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                        }`}
                        title="Simulate doctor status transition"
                      >
                        {isAvailable ? 'Set In Consult' : 'Set Available'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: TOTAL HOSPITAL PATIENTS CENSUS ("total patient ki info")       */}
      {/* ========================================================================= */}
      {activeSubView === 'patients' && (
        <div className="space-y-6">
          
          {/* Search & Filter Toolbar */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Search patient name, UHID, ward, bed, diagnosis, or attending MD..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm font-medium transition-all"
                />
                {patientSearch && (
                  <button
                    onClick={() => setPatientSearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Urgency Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Acuity:</span>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Triage Tiers</option>
                  <option value="EMERGENCY">Emergency (Red)</option>
                  <option value="URGENT">Urgent (Amber)</option>
                  <option value="SEMI-URGENT">Semi-Urgent (Yellow)</option>
                  <option value="ROUTINE">Routine (Green)</option>
                </select>
              </div>

            </div>

            {/* Ward Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2">
                Hospital Ward:
              </span>
              {[
                { label: 'All Wards', value: 'ALL' },
                { label: 'Cardiac CCU', value: 'Cardiac' },
                { label: 'Medical ICU', value: 'Intensive' },
                { label: 'Emergency Trauma Bay', value: 'Emergency' },
                { label: 'Inpatient General', value: 'Inpatient' },
                { label: 'Operating Theaters / PACU', value: 'Operating' },
                { label: 'Neurology Unit', value: 'Neurology' }
              ].map(w => (
                <button
                  key={w.value}
                  onClick={() => setWardFilter(w.value)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    wardFilter === w.value
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Census Table */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-extrabold text-[11px]">
                  <tr>
                    <th className="py-4 px-5">Patient & UHID</th>
                    <th className="py-4 px-4">Ward & Bed</th>
                    <th className="py-4 px-4">Admitted Diagnosis</th>
                    <th className="py-4 px-4">Triage Urgency</th>
                    <th className="py-4 px-4">Attending Physician</th>
                    <th className="py-4 px-4">Vitals Snapshot</th>
                    <th className="py-4 px-4">Current Care Status</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => {
                      const isEmergency = patient.triageUrgency === 'EMERGENCY';
                      const isUrgent = patient.triageUrgency === 'URGENT';

                      return (
                        <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* Patient Name & UHID */}
                          <td className="py-3.5 px-5">
                            <div className="font-extrabold text-slate-900 text-sm">
                              {patient.name}
                            </div>
                            <div className="text-[10px] font-mono text-teal-700 font-bold">
                              {patient.uhid} • {patient.age}y ({patient.gender[0]}) • {patient.bloodType}
                            </div>
                          </td>

                          {/* Ward & Bed */}
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            <div className="flex items-center gap-1.5">
                              <Bed className="w-3.5 h-3.5 text-slate-400" />
                              <span>{patient.bed}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              {patient.ward}
                            </div>
                          </td>

                          {/* Diagnosis */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-bold text-slate-900 line-clamp-1">
                              {patient.admittedDiagnosis}
                            </div>
                            <div className="text-[10px] text-slate-500 line-clamp-1">
                              {patient.chiefComplaint}
                            </div>
                          </td>

                          {/* Triage Urgency */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                                isEmergency
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                                  : isUrgent
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {patient.triageUrgency}
                            </span>
                          </td>

                          {/* Attending Doctor */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-indigo-700">
                              {patient.attendingDoctorName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Admitted: {patient.admissionDate}
                            </div>
                          </td>

                          {/* Vitals Snapshot */}
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="font-semibold text-slate-800">
                              BP: {patient.vitals.bp}
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              HR: {patient.vitals.hr} • SpO2: {patient.vitals.spo2}
                            </div>
                          </td>

                          {/* Care Status */}
                          <td className="py-3.5 px-4">
                            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 inline-block">
                              {patient.currentCareStatus}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setSelectedPatient(patient)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 font-bold text-xs transition-all flex items-center gap-1 mx-auto cursor-pointer"
                              title="Inspect Clinical EMR Record"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>EMR</span>
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-slate-400">
                        No patients matching the current search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Showing {filteredPatients.length} of {hospitalPatients.length} total admitted hospital patients</span>
              <span className="font-bold text-slate-700">Hospital Inpatient Census Live Telemetry</span>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PATIENT EMR QUICK INSPECTION MODAL                                       */}
      {/* ========================================================================= */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
            
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>Hospital Inpatient Electronic Medical Record (EMR)</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedPatient.name} ({selectedPatient.uhid})
                </h3>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-7 space-y-5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
              
              {/* Demographic & Bed Location Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Location</div>
                  <div className="font-black text-slate-900 mt-0.5">{selectedPatient.bed}</div>
                  <span className="text-[10px] text-slate-500">{selectedPatient.ward}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Demographics</div>
                  <div className="font-black text-slate-900 mt-0.5">{selectedPatient.age}y / {selectedPatient.gender}</div>
                  <span className="text-[10px] text-slate-500">Blood: {selectedPatient.bloodType}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Attending MD</div>
                  <div className="font-black text-indigo-700 mt-0.5">{selectedPatient.attendingDoctorName}</div>
                  <span className="text-[10px] text-slate-500">Admitted: {selectedPatient.admissionDate}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Triage Acuity</div>
                  <div className="font-black text-rose-600 mt-0.5">{selectedPatient.triageUrgency}</div>
                  <span className="text-[10px] text-slate-500">Score: {selectedPatient.triageScore}/100</span>
                </div>
              </div>

              {/* Diagnosis & Complaint */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">
                  Admitted Diagnosis: {selectedPatient.admittedDiagnosis}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold">Chief Complaint at Intake:</span> {selectedPatient.chiefComplaint}
                </div>
              </div>

              {/* Vitals Telemetry Snapshot */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Live Vitals Snapshot:
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-center">
                    <span className="text-[10px] text-teal-700 font-bold block">Blood Pressure</span>
                    <span className="font-extrabold text-teal-900 text-sm">{selectedPatient.vitals.bp}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                    <span className="text-[10px] text-rose-700 font-bold block">Heart Rate</span>
                    <span className="font-extrabold text-rose-900 text-sm">{selectedPatient.vitals.hr}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-center">
                    <span className="text-[10px] text-cyan-700 font-bold block">Oxygen Sat (SpO2)</span>
                    <span className="font-extrabold text-cyan-900 text-sm">{selectedPatient.vitals.spo2}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-700 font-bold block">Temperature</span>
                    <span className="font-extrabold text-amber-900 text-sm">{selectedPatient.vitals.temp}</span>
                  </div>
                </div>
              </div>

              {/* Active Medications */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Active Inpatient Medications & Orders:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPatient.activeMedications.map((med, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                      💊 {med}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Care Status */}
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900">
                <span className="font-bold">Active Hospital Care Protocol: </span>
                {selectedPatient.currentCareStatus}
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close EMR Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
