import React from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import TriageQueue from './TriageQueue';
import ClinicalAnalytics from './ClinicalAnalytics';
import DecisionHistory from './DecisionHistory';
import HospitalRoster from './HospitalRoster';
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
  Users
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
    hospitalPatients
  } = useMediSense();

  const totalCases = cases.length;
  const emergencyCount = cases.filter(c => c.triageLevel === 'EMERGENCY' && c.status === 'PENDING_REVIEW').length;
  const pendingCount = cases.filter(c => c.status === 'PENDING_REVIEW').length;
  const reviewedCount = cases.filter(c => c.doctorReview !== null).length;
  const acceptedCount = cases.filter(c => c.doctorReview?.action === 'ACCEPTED').length;
  const concordanceRate = reviewedCount > 0 ? Math.round((acceptedCount / reviewedCount) * 100) : 92;

  const handleSelectCase = (caseId) => {
    setSelectedCaseId(caseId);
    setReviewModalOpen(true);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & KPI Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Doctor & Hospital Command Center • Emergency, Inpatient & Bed Telemetry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Hospital Decision Support & Clinical Command Center
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              AI prior-triage, explainable differential diagnostics, physician staff availability, and total hospital-wide inpatient & emergency bed telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className="px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Concordance: {concordanceRate}%</span>
            </div>
          </div>
        </div>

        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Intake Cases</span>
              <Activity className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalCases}</div>
            <span className="text-[10px] text-slate-400">Across all triage tiers</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
              <span>Emergency Cases</span>
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-rose-700 mt-1">{emergencyCount}</div>
            <span className="text-[10px] text-rose-600 font-semibold">Requires Immediate Triage</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Pending Review</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</div>
            <span className="text-[10px] text-slate-400">Awaiting physician sign-off</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Decisions Certified</span>
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{reviewedCount}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Logged to legal audit trail</span>
          </div>

        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setDoctorTab('roster')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            doctorTab === 'roster'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hospital Roster & Patient Census ({hospitalPatients?.length || 16})</span>
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
          <span>Priority Triage Queue ({cases.length})</span>
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
          <span>Hospital Visual Analytics & Telemetry</span>
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
          <span>Audit & Decision Trail ({reviewedCount})</span>
        </button>
      </div>

      {/* Tab Views */}
      <div>
        {doctorTab === 'roster' && (
          <HospitalRoster />
        )}
        {doctorTab === 'triage' && (
          <TriageQueue onSelectCase={handleSelectCase} />
        )}
        {doctorTab === 'analytics' && (
          <ClinicalAnalytics />
        )}
        {doctorTab === 'audit' && (
          <DecisionHistory />
        )}
      </div>

      {/* Active Case Review Modal */}
      {reviewModalOpen && activeCase && (
        <CaseReviewModal
          caseItem={activeCase}
          onClose={() => setReviewModalOpen(false)}
        />
      )}

    </div>
  );
}
