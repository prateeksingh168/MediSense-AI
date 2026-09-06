import React from 'react';
import { Database } from 'lucide-react';

export default function SimilarCases({ similarCases = [] }) {
  if (!similarCases || similarCases.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Similar Cohort References
            </h4>
            <p className="text-[11px] text-slate-500">Historical Verified Clinical Outcomes</p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
          Cohort Vector Match
        </span>
      </div>

      <div className="space-y-3">
        {similarCases.map((c, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-teal-700">{c.caseId}</span>
                <span className="text-slate-700 font-medium">• {c.patientProfile}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {c.similarity}% Match
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block uppercase text-[9px] font-bold">AI Prediction:</span>
                <span className="text-slate-800 font-semibold">{c.aiPrediction}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block uppercase text-[9px] font-bold">Doctor Action:</span>
                <span className="text-indigo-700 font-semibold">{c.doctorDecision}</span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <strong className="text-emerald-800">Final Outcome: </strong>
              {c.outcome}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
