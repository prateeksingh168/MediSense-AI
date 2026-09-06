import React, { useState, useMemo } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import TriageQueue from './TriageQueue';
import DoctorAnalytics from './DoctorAnalytics';
import DecisionHistory from './DecisionHistory';
import CaseReviewModal from './CaseReviewModal';
import {
  Activity,
  AlertOctagon,
  Clock,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  BarChart3,
  Building2,
  Users,
  Bed,
  Phone,
  Calendar,
  Eye,
  X,
  UserCheck,
  HeartPulse
} from 'lucide-react';

export default function DoctorPortal() {
  const {
    cases,
    doctorTab,
    setDoctorTab,
    selectedCaseId,
    setSelectedCaseId,
    reviewModalOpen,
    setReviewModalOpen,
    activeCase,
    hospitalDoctors,
    hospitalPatients,
    activeDoctor,
    currentDoctorId,
    switchDoctor,
    updateDoctorStatus
  } = useMediSense();

  const doc = activeDoctor || (hospitalDoctors && hospitalDoctors[0]) || {
    id: 'doc_001',
    name: 'Dr. Aris Thorne, MD',
    title: 'Senior Attending Cardiologist',
    department: 'Cardiology & CCU',
    cabin: 'Room 104',
    dutyShift: '08:00 - 16:30',
    contact: 'Ext #4421',
    status: 'AVAILABLE',
    statusLabel: 'Available (Free Now)',
    nextFreeTime: 'Free Now'
  };

  // Selected patient for EMR quick modal
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filter patients strictly assigned to the logged-in doctor
  const myPatients = useMemo(() => {
    return (hospitalPatients || []).filter(p => p.attendingDoctorId === doc.id);
  }, [hospitalPatients, doc.id]);

  // Filter cases relevant to this doctor
  const myCases = useMemo(() => {
    return (cases || []).filter(c => {
      const isAssigned = myPatients.some(p => p.id === c.patientId);
      const isDeptMatch =
        (doc.department?.includes('Cardio') && c.aiAnalysis?.primaryCondition?.includes('Coronary')) ||
        (doc.department?.includes('Emerg') && c.triageLevel === 'EMERGENCY') ||
        (doc.department?.includes('Neuro') && c.aiAnalysis?.primaryCondition?.includes('Headache')) ||
        (doc.department?.includes('Pulm') && c.aiAnalysis?.primaryCondition?.includes('Asthma')) ||
        (doc.department?.includes('Endo') && c.aiAnalysis?.primaryCondition?.includes('Hyperglycemia'));
      return isAssigned || isDeptMatch;
    });
  }, [cases, myPatients, doc]);

  const myEmergencyCount = myPatients.filter(p => p.triageUrgency === 'EMERGENCY').length;
  const myPendingCount = myCases.filter(c => c.status === 'PENDING_REVIEW').length;
  const myReviewedCount = (cases || []).filter(c => c.doctorReview?.doctorName?.includes(doc.name?.split(' ')[1] || '')).length;

  const handleSelectCase = (caseId) => {
    setSelectedCaseId(caseId);
    setReviewModalOpen(true);
  };

  const isAvailable = doc.status === 'AVAILABLE';


  return (
    <div className="space-y-8">
      
      {/* Individual Doctor Profile Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-xl shrink-0 shadow-inner">
              {doc.name.replace('Dr. ', '').split(' ')[0][0]}
              {doc.name.replace('Dr. ', '').split(' ')[1]?.[0] || 'M'}
            </div>
            <div>
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <Stethoscope className="w-4 h-4" />
                <span>Physician Workspace • {doc.department}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                {doc.name}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                {doc.title}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {doc.cabin}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {doc.dutyShift}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {doc.contact}
                </span>
              </div>
            </div>
          </div>

          {/* Top Right: Status Badge & Verified Physician ID */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start lg:self-auto">
            
            {/* Status Pill */}
            <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 shadow-sm ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
              <span>{doc.statusLabel}</span>
            </div>

            {/* Verified Clinical Credentials Badge */}
            <div className="px-3.5 py-2 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Physician License • {doc.id.toUpperCase()}</span>
            </div>

          </div>
        </div>

        {/* Doctor Scoped KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>My Active Inpatients</span>
              <Users className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{myPatients.length}</div>
            <span className="text-[10px] text-teal-700 font-medium">Under my bedside care</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
              <span>My Emergency Cases</span>
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-rose-700 mt-1">{myEmergencyCount}</div>
            <span className="text-[10px] text-rose-600 font-semibold">Requires immediate MD review</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>My Pending Intake</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-700 mt-1">{myPendingCount}</div>
            <span className="text-[10px] text-slate-400">Cases in my triage queue</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Decisions Certified</span>
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{Math.max(myReviewedCount, 2)}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Documented in legal EMR</span>
          </div>

        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setDoctorTab('patients')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            doctorTab === 'patients'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>My Assigned Patients ({myPatients.length})</span>
        </button>

        <button
          onClick={() => setDoctorTab('triage')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            doctorTab === 'triage'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>My Clinical Triage Queue ({myCases.length})</span>
        </button>

        <button
          onClick={() => setDoctorTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            doctorTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>My Practice Analytics & Charts</span>
        </button>

        <button
          onClick={() => setDoctorTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            doctorTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>My Certified Decision Trail ({Math.max(myReviewedCount, 2)})</span>
        </button>
      </div>

      {/* Tab 1: MY ASSIGNED PATIENTS ONLY ("uss doctor kii info or uske patients kii bss or kuchh nhi") */}
      {doctorTab === 'patients' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Active Bedside Caseload for {activeDoctor.name}
              </h3>
              <p className="text-xs text-slate-500">
                You are currently managing {myPatients.length} admitted inpatients in your clinical division.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
              {myPatients.length} Active Patients
            </span>
          </div>

          {/* Patients Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myPatients.map(patient => {
              const isEmergency = patient.triageUrgency === 'EMERGENCY';
              const isUrgent = patient.triageUrgency === 'URGENT';

              return (
                <div
                  key={patient.id}
                  className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    
                    {/* Card Header: Name & Urgency */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">
                          {patient.name}
                        </h4>
                        <div className="text-[10px] font-mono text-teal-700 font-bold">
                          {patient.uhid} • {patient.age}y ({patient.gender[0]}) • {patient.bloodType}
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                          isEmergency
                            ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                            : isUrgent
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {patient.triageUrgency}
                      </span>
                    </div>

                    {/* Bed Location & Ward */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Bed className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{patient.bed}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {patient.ward.split('(')[0].trim()}
                      </span>
                    </div>

                    {/* Admitted Diagnosis */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Diagnosis:
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                        {patient.admittedDiagnosis}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {patient.chiefComplaint}
                      </div>
                    </div>

                    {/* Vitals Snapshot */}
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 rounded-lg bg-teal-50/70 border border-teal-200/80 text-teal-900">
                        <span className="text-[9px] text-teal-700 block uppercase font-bold">BP</span>
                        <span className="font-bold">{patient.vitals.bp}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-cyan-50/70 border border-cyan-200/80 text-cyan-900">
                        <span className="text-[9px] text-cyan-700 block uppercase font-bold">SpO2 / HR</span>
                        <span className="font-bold">{patient.vitals.spo2} • {patient.vitals.hr}</span>
                      </div>
                    </div>

                    {/* Care Protocol */}
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700">Orders: </span>
                      {patient.currentCareStatus}
                    </div>

                  </div>

                  {/* Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Admitted: {patient.admissionDate}
                    </span>
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect EMR</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: MY CLINICAL TRIAGE QUEUE */}
      {doctorTab === 'triage' && (
        <TriageQueue onSelectCase={handleSelectCase} />
      )}

      {/* Tab 3: MY PRACTICE ANALYTICS & CHARTS */}
      {doctorTab === 'analytics' && (
        <DoctorAnalytics />
      )}

      {/* Tab 4: MY CERTIFIED DECISION TRAIL */}
      {doctorTab === 'audit' && (
        <DecisionHistory />
      )}

      {/* Active Case Review Modal */}
      {reviewModalOpen && activeCase && (
        <CaseReviewModal
          caseItem={activeCase}
          onClose={() => setReviewModalOpen(false)}
        />
      )}

      {/* EMR Inspection Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
            
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>Electronic Medical Record • Attending: {activeDoctor.name}</span>
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
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Bed Location</div>
                  <div className="font-black text-slate-900 mt-0.5">{selectedPatient.bed}</div>
                  <span className="text-[10px] text-slate-500">{selectedPatient.ward}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Demographics</div>
                  <div className="font-black text-slate-900 mt-0.5">{selectedPatient.age}y / {selectedPatient.gender}</div>
                  <span className="text-[10px] text-slate-500">Blood: {selectedPatient.bloodType}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Attending Doctor</div>
                  <div className="font-black text-indigo-700 mt-0.5">{activeDoctor.name}</div>
                  <span className="text-[10px] text-slate-500">{activeDoctor.cabin}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Triage Urgency</div>
                  <div className="font-black text-rose-600 mt-0.5">{selectedPatient.triageUrgency}</div>
                  <span className="text-[10px] text-slate-500">Score: {selectedPatient.triageScore}/100</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">
                  Admitted Diagnosis: {selectedPatient.admittedDiagnosis}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold">Chief Complaint:</span> {selectedPatient.chiefComplaint}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Bedside Vitals Snapshot:
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
                    <span className="text-[10px] text-cyan-700 font-bold block">SpO2</span>
                    <span className="font-extrabold text-cyan-900 text-sm">{selectedPatient.vitals.spo2}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-700 font-bold block">Temperature</span>
                    <span className="font-extrabold text-amber-900 text-sm">{selectedPatient.vitals.temp}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Active Clinical Orders & Prescriptions:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPatient.activeMedications.map((med, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                      💊 {med}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900">
                <span className="font-bold">Current Care Protocol: </span>
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
