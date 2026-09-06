import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import { CheckCircle2, Edit3 } from 'lucide-react';

export default function AcceptOverrideModal({ caseItem, mode = 'accept', onClose }) {
  const { acceptDoctorDecision, overrideDoctorDecision } = useMediSense();

  const [acceptNotes, setAcceptNotes] = useState(
    `Confirmed AI assessment of ${caseItem?.aiAnalysis.primaryCondition}. Clinical presentation, intake vitals and ECG profile correlate.`
  );
  const [treatmentPlan, setTreatmentPlan] = useState(
    'Initiate standard clinical guideline protocol. Order stat cardiac enzymes and transfer to monitored bed.'
  );

  const [alternateDiagnosis, setAlternateDiagnosis] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [adjustedUrgency, setAdjustedUrgency] = useState(caseItem?.triageLevel || 'URGENT');

  if (!caseItem) return null;

  const handleAcceptSubmit = (e) => {
    e.preventDefault();
    acceptDoctorDecision(caseItem.id, acceptNotes, treatmentPlan);
    onClose();
  };

  const handleOverrideSubmit = (e) => {
    e.preventDefault();
    if (!alternateDiagnosis.trim() || !overrideReason.trim()) {
      alert('Please specify the alternate diagnosis and clinical rationale for overriding AI.');
      return;
    }
    overrideDoctorDecision(caseItem.id, alternateDiagnosis, overrideReason, adjustedUrgency, treatmentPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-2xl ${mode === 'accept' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
              {mode === 'accept' ? <CheckCircle2 className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {mode === 'accept' ? 'Confirm & Accept AI Recommendation' : 'Override AI Decision (Physician Discretion)'}
              </h3>
              <p className="text-xs text-slate-500">
                Patient: <span className="text-teal-700 font-bold">{caseItem.patientName}</span> ({caseItem.id})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
        </div>

        {mode === 'accept' ? (
          <form onSubmit={handleAcceptSubmit} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <strong className="block text-emerald-800 mb-1">AI Recommendation Being Confirmed:</strong>
              {caseItem.aiAnalysis.primaryCondition} ({caseItem.aiAnalysis.primaryProbability}% confidence)
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Physician Clinical Assessment Notes</label>
              <textarea
                rows={3}
                value={acceptNotes}
                onChange={(e) => setAcceptNotes(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-teal-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Discharge Plan / Orders</label>
              <textarea
                rows={2}
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-teal-500 focus:bg-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow"
              >
                Certify & Finalize Decision
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOverrideSubmit} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900">
              <strong className="block text-purple-800 mb-1">AI Suggested Condition:</strong>
              {caseItem.aiAnalysis.primaryCondition} ({caseItem.aiAnalysis.primaryProbability}%)
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Physician Confirmed Alternate Diagnosis *</label>
              <input
                type="text"
                placeholder="e.g. Atypical Gastroesophageal Reflux with Severe Esophageal Spasm"
                value={alternateDiagnosis}
                onChange={(e) => setAlternateDiagnosis(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-purple-500 focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adjusted Triage Urgency</label>
                <select
                  value={adjustedUrgency}
                  onChange={(e) => setAdjustedUrgency(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:border-purple-500 focus:bg-white"
                >
                  <option value="EMERGENCY">EMERGENCY</option>
                  <option value="URGENT">URGENT</option>
                  <option value="SEMI-URGENT">SEMI-URGENT</option>
                  <option value="ROUTINE">ROUTINE</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Physician</label>
                <input
                  type="text"
                  value="Dr. Robert Chen, MD"
                  disabled
                  className="w-full bg-slate-100 text-slate-500 p-2.5 rounded-2xl border border-slate-200 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Rationale for Overriding AI *</label>
              <textarea
                rows={3}
                placeholder="Explain clinical exam findings, laboratory discordant findings, or nuanced patient history that prompted this diagnostic departure..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-purple-500 focus:bg-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 shadow"
              >
                Commit Override to Audit Trail
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
