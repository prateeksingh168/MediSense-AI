import React from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import { TriageBadge } from '../common/Badge';
import RedFlagAlert from '../common/RedFlagAlert';
import { CheckCircle2, Activity, ShieldCheck, FileText } from 'lucide-react';

export default function AIAnalysisResult({ result, onClose }) {
  const { setPatientTab } = useMediSense();

  if (!result) return null;

  const isEmergency = result.triageLevel === 'EMERGENCY';

  const viewAssessments = () => {
    onClose();
    setPatientTab('history');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Symptom Triage Assessment</h3>
              <p className="text-xs text-slate-500">MediSense Clinical Decision Support Engine v3.4</p>
            </div>
          </div>
          <TriageBadge level={result.triageLevel} />
        </div>

        {/* Red Flag Alert if Emergency */}
        {isEmergency && (
          <RedFlagAlert
            title="CRITICAL RED-FLAG ALERT"
            message="Your reported symptoms indicate high-acuity cardiovascular or acute systemic concern. Immediate hospital emergency evaluation is advised."
          />
        )}

        {/* Primary AI Assessment */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Primary Probable Condition
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
              {result.aiAnalysis.primaryProbability}% AI Confidence
            </span>
          </div>
          <h4 className="text-xl font-black text-slate-900">
            {result.aiAnalysis.primaryCondition}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {result.aiAnalysis.urgencyAssessment}
          </p>
        </div>

        {/* Differential Possibilities */}
        <div>
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Differential Considerations
          </h5>
          <div className="space-y-2">
            {result.aiAnalysis.differentialDiagnoses.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium">
                <span className="text-slate-800">{item.condition}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${idx === 0 ? 'bg-teal-600' : 'bg-slate-400'}`}
                      style={{ width: `${item.probability}%` }}
                    ></div>
                  </div>
                  <span className="text-slate-700 font-bold w-10 text-right">{item.probability}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Case Routing */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-teal-900 font-bold">Case Logged & Routed:</strong> Your case <span className="font-mono font-bold text-slate-900">[{result.id}]</span> has been prioritized into the Doctor Command Center. A licensed physician will review these findings, examine missing clinical tests, and make the definitive diagnosis.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          <button
            onClick={viewAssessments}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-100 hover:bg-teal-200 border border-teal-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-teal-700" />
            <span>View Saved in My Assessments →</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close Assessment
          </button>

        </div>

      </div>
    </div>
  );
}
