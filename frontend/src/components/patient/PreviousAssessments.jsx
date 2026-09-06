import React from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import { TriageBadge, StatusBadge } from '../common/Badge';
import { Clock, Stethoscope, ChevronRight, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PreviousAssessments() {
  const { cases, currentPatient, setSelectedCaseId, setActivePortal, setReviewModalOpen } = useMediSense();

  const patientCases = cases.filter(c => c.patientId === currentPatient.id);

  const openCaseInDoctorReview = (caseId) => {
    setSelectedCaseId(caseId);
    setActivePortal('doctor');
    setReviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Clinical Assessment History
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Historical records of symptom submissions for <span className="font-bold text-teal-700">{currentPatient.name}</span>, AI triage scores, and doctor verified outcomes.
        </p>
      </div>

      {patientCases.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">No Assessment Records Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Use the Symptom Checker tab to submit your symptoms for AI assisted clinical assessment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {patientCases.map((item) => {
            const hasDoctorReview = !!item.doctorReview;
            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-sm"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                      {item.id}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {item.submittedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TriageBadge level={item.triageLevel} />
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                {/* Chief Complaint */}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chief Complaint</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{item.chiefComplaint}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.symptoms.map((s, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-0.5 rounded-lg font-semibold ${
                          s.redFlag ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {s.name} (Severity {s.severity}/10)
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Assessment Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold uppercase text-[10px]">AI Probable Condition</span>
                    <div className="text-slate-900 font-extrabold text-sm mt-0.5">
                      {item.aiAnalysis.primaryCondition}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-teal-700 font-black text-sm">{item.aiAnalysis.primaryProbability}% Match</span>
                    <div className="text-[10px] text-slate-500">Confidence Score</div>
                  </div>
                </div>

                {/* Doctor Verified Section */}
                {hasDoctorReview ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Physician Confirmed: {item.doctorReview.confirmedCondition}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        {item.doctorReview.doctorName} • {item.doctorReview.reviewedAt}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-emerald-900">Doctor's Note: </strong>
                      {item.doctorReview.clinicalNotes}
                    </p>
                    {item.doctorReview.dischargeInstructions && (
                      <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-emerald-200">
                        <strong className="text-slate-900">Care Instructions / Rx: </strong>
                        {item.doctorReview.dischargeInstructions}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Case currently awaiting review in Doctor Triage Queue.</span>
                    </div>
                    <button
                      onClick={() => openCaseInDoctorReview(item.id)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 underline underline-offset-2 shrink-0"
                    >
                      <span>Review as Doctor</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
