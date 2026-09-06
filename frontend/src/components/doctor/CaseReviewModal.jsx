import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import { TriageBadge, StatusBadge } from '../common/Badge';
import ExplainableAI from './ExplainableAI';
import MissingInfoCard from './MissingInfoCard';
import SimilarCases from './SimilarCases';
import AcceptOverrideModal from './AcceptOverrideModal';
import RedFlagAlert from '../common/RedFlagAlert';
import {
  X,
  CheckCircle2,
  Edit3,
  User,
  HeartPulse,
  Clock,
  FileCheck,
  Stethoscope
} from 'lucide-react';

export default function CaseReviewModal({ caseItem, onClose }) {
  const [decisionModalMode, setDecisionModalMode] = useState(null);

  if (!caseItem) return null;

  const isEmergency = caseItem.triageLevel === 'EMERGENCY';
  const hasDecision = !!caseItem.doctorReview;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white border border-slate-300 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh] text-slate-900">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Case Review: <span className="text-teal-700">{caseItem.patientName}</span>
                </h3>
                <span className="font-mono text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  [{caseItem.id}]
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Acuity Score: <span className="font-bold text-slate-900">{caseItem.triageScore}/100</span> • Submitted {caseItem.submittedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TriageBadge level={caseItem.triageLevel} />
            <StatusBadge status={caseItem.status} />
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patient Intake Strip */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Demographics:</span>
              <span className="font-bold text-slate-800">{caseItem.patientAge}y • {caseItem.patientGender}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-slate-500">Intake Vitals:</span>
              <span className="font-mono text-teal-800 font-semibold">
                BP {caseItem.vitalsAtIntake?.bp || '120/80'} | HR {caseItem.vitalsAtIntake?.hr || '76'} | SpO2 {caseItem.vitalsAtIntake?.spo2 || '98%'}
              </span>
            </div>
          </div>

          {/* Quick Doctor Decision Trigger */}
          <div className="flex items-center gap-2">
            {!hasDecision ? (
              <>
                <button
                  onClick={() => setDecisionModalMode('accept')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept AI Decision</span>
                </button>
                <button
                  onClick={() => setDecisionModalMode('override')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Override Recommendation</span>
                </button>
              </>
            ) : (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                Decision Certified by {caseItem.doctorReview.doctorName}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Clinical Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Emergency Alert */}
          {isEmergency && (
            <RedFlagAlert
              title="CRITICAL RED-FLAG CASE"
              message="Patient exhibits cardiovascular ischemic markers or acute systemic decompensation. Priority medical order initiation strongly advised."
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Chief Complaint, AI Differentials, XAI */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Chief Complaint */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chief Complaint & Onset</span>
                <p className="text-sm font-bold text-slate-900 leading-relaxed">{caseItem.chiefComplaint}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {caseItem.symptoms.map((s, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2.5 py-1 rounded-xl font-semibold ${
                        s.redFlag ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {s.name} (Severity {s.severity}/10)
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Differentials */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    AI Differential Diagnoses & Probability
                  </h4>
                  <span className="text-xs font-extrabold text-teal-700">
                    Primary: {caseItem.aiAnalysis.primaryProbability}%
                  </span>
                </div>

                <div className="space-y-2">
                  {caseItem.aiAnalysis.differentialDiagnoses.map((diff, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{diff.condition}</span>
                        <span className="text-slate-500 text-[11px]">{diff.confidence} Diagnostic Match</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-base font-black ${idx === 0 ? 'text-teal-700' : 'text-slate-600'}`}>
                          {diff.probability}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explainable AI */}
              <ExplainableAI
                xaiData={caseItem.aiAnalysis.explainableAI}
                primaryCondition={caseItem.aiAnalysis.primaryCondition}
                primaryProbability={caseItem.aiAnalysis.primaryProbability}
              />

            </div>

            {/* Right: Doctor Decision, Missing Info, Cohort */}
            <div className="lg:col-span-5 space-y-6">
              
              {hasDecision && (
                <div className={`p-6 rounded-3xl border ${
                  caseItem.doctorReview.action === 'ACCEPTED'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-purple-50 border-purple-200'
                } space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Physician Decision Record</span>
                    </span>
                    <StatusBadge status={caseItem.status} />
                  </div>

                  <div className="text-xs text-slate-800">
                    <strong className="block text-slate-500 text-[10px] uppercase">Final Certified Diagnosis:</strong>
                    <span className="text-base font-extrabold text-slate-900">{caseItem.doctorReview.confirmedCondition}</span>
                  </div>

                  {caseItem.doctorReview.overrideReason && (
                    <div className="text-xs text-purple-900 bg-purple-100/60 p-3 rounded-2xl border border-purple-200">
                      <strong>Override Justification: </strong>
                      {caseItem.doctorReview.overrideReason}
                    </div>
                  )}

                  <div className="text-xs text-slate-700">
                    <strong className="block text-slate-500 text-[10px] uppercase">Clinical Notes:</strong>
                    {caseItem.doctorReview.clinicalNotes}
                  </div>

                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                    Signed by: {caseItem.doctorReview.doctorName} • {caseItem.doctorReview.reviewedAt}
                  </div>
                </div>
              )}

              <MissingInfoCard missingItems={caseItem.aiAnalysis.missingInformation} />
              <SimilarCases similarCases={caseItem.aiAnalysis.similarCases} />

            </div>

          </div>

        </div>

      </div>

      {decisionModalMode && (
        <AcceptOverrideModal
          caseItem={caseItem}
          mode={decisionModalMode}
          onClose={() => setDecisionModalMode(null)}
        />
      )}

    </div>
  );
}
