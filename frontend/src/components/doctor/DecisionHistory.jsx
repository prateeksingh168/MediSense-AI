import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import { StatusBadge, TriageBadge } from '../common/Badge';
import { FileText, CheckCircle2, Edit3, Printer } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export default function DecisionHistory() {
  const { cases } = useMediSense();

  const [printCase, setPrintCase] = useState(null);

  const reviewedCases = cases.filter(c => c.doctorReview !== null);
  const acceptedCount = reviewedCases.filter(c => c.doctorReview?.action === 'ACCEPTED').length;
  const overriddenCount = reviewedCases.filter(c => c.doctorReview?.action === 'OVERRIDDEN').length;

  const handlePrint = (item) => {
    setPrintCase(item);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Certified Decisions</span>
          <div className="text-3xl font-black text-slate-900">{reviewedCases.length}</div>
          <span className="text-[11px] text-slate-400">Documented in clinical audit trail</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Accepted AI Differentials</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{acceptedCount}</div>
          <span className="text-[11px] text-emerald-700 font-medium">
            {reviewedCases.length > 0 ? Math.round((acceptedCount / reviewedCases.length) * 100) : 0}% Physician Concordance
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Doctor Overrides</span>
            <Edit3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-600">{overriddenCount}</div>
          <span className="text-[11px] text-purple-700 font-medium">
            Physician autonomous overrides with justification
          </span>
        </div>

      </div>

      {/* Decision Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Clinical Decision Audit Trail</h3>
            <p className="text-xs text-slate-500">Record of AI proposals vs Doctor final determinations</p>
          </div>
          <span className="text-xs text-indigo-800 bg-indigo-50 font-bold px-3 py-1 rounded-full border border-indigo-200">
            Medical Legal Governance Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {reviewedCases.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">
              No cases reviewed yet. Head to the Triage Queue and accept or override pending cases.
            </div>
          ) : (
            reviewedCases.map((item) => {
              const review = item.doctorReview;
              const isAccepted = review.action === 'ACCEPTED';

              return (
                <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors space-y-3">
                  
                  {/* Row Top */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {item.id}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{item.patientName} ({item.patientAge}y {item.patientGender})</span>
                      <TriageBadge level={item.triageLevel} />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isAccepted ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}>
                        {isAccepted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                        <span>{isAccepted ? 'AI Recommendation Accepted' : 'AI Recommendation Overridden'}</span>
                      </span>

                      <button
                        onClick={() => handlePrint(item)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 border border-slate-300 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5 text-teal-700" />
                        <span>Print Medical Summary</span>
                      </button>
                    </div>
                  </div>

                  {/* Diagnoses Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Proposed Diagnosis:</span>
                      <div className="text-slate-800 font-bold mt-0.5">
                        {item.aiAnalysis.primaryCondition} ({item.aiAnalysis.primaryProbability}%)
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border ${
                      isAccepted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-purple-50/50 border-purple-200'
                    }`}>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Physician Final Determination:</span>
                      <div className="text-slate-900 font-black mt-0.5">
                        {review.confirmedCondition}
                      </div>
                    </div>
                  </div>

                  {/* Notes & Justification */}
                  <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <div>
                      <strong className="text-slate-500">Clinical Attestation: </strong>
                      {review.clinicalNotes}
                    </div>
                    {review.overrideReason && (
                      <div className="text-purple-800 pt-1">
                        <strong className="text-purple-950">Override Rationale: </strong>
                        {review.overrideReason}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-200/60 mt-2">
                      <span>Attending: {review.doctorName} ({review.doctorSpecialty})</span>
                      <span>Recorded: {review.reviewedAt}</span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Printable Clinical Summary Modal */}
      {printCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-6">
            
            {/* Modal Controls */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Clinical Decision Record
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  Print Document
                </button>
                <button
                  onClick={() => setPrintCase(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-6 text-slate-900 bg-white">
              
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-xl bg-slate-950 shadow-sm">
                    <img src={logoImg} alt="MediSense AI Logo" className="h-10 w-auto object-contain rounded-md" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">MEDISENSE AI HEALTHCARE</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Clinical Decision Support System
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-mono font-bold text-slate-900">CASE ID: {printCase.id}</div>
                  <div className="text-slate-500 text-[11px]">Generated: {new Date().toLocaleString()}</div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Patient Name</span>
                  <span className="font-bold text-sm text-slate-900">{printCase.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Age & Gender</span>
                  <span className="font-bold text-slate-900">{printCase.patientAge} yrs • {printCase.patientGender}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Intake Vitals</span>
                  <span className="font-bold text-slate-900">BP: {printCase.vitalsAtIntake?.bp || '120/80'} | HR: {printCase.vitalsAtIntake?.hr}</span>
                </div>
              </div>

              {/* Chief Complaint */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider block">1. Chief Complaint & Clinical Intake</span>
                <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {printCase.chiefComplaint}
                </p>
              </div>

              {/* AI vs Doctor Summary */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block">AI Inference & Differential</span>
                  <div className="font-bold text-slate-900 text-sm">{printCase.aiAnalysis.primaryCondition}</div>
                  <div className="text-slate-600 font-mono">Confidence: {printCase.aiAnalysis.primaryProbability}%</div>
                  <div className="text-[11px] text-slate-500 italic mt-1">
                    "{printCase.aiAnalysis.explainableAI.clinicalReasoning}"
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                  <span className="font-bold text-indigo-900 uppercase tracking-wider block">Physician Final Determination ({printCase.doctorReview.action})</span>
                  <div className="font-extrabold text-slate-900 text-sm">{printCase.doctorReview.confirmedCondition}</div>
                  <div className="text-slate-700 text-xs mt-1">
                    {printCase.doctorReview.clinicalNotes}
                  </div>
                  {printCase.doctorReview.overrideReason && (
                    <div className="text-indigo-800 text-[11px] font-medium mt-1">
                      Override Justification: {printCase.doctorReview.overrideReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Signature Line */}
              <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <div className="text-slate-500">System Philosophy:</div>
                  <div className="font-bold text-slate-800">AI assists. Doctors decide.</div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-base text-slate-900 pb-1 border-b border-slate-400">
                    {printCase.doctorReview.doctorName}
                  </div>
                  <div className="text-slate-500 mt-1">Attending Physician Digital Signature</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
