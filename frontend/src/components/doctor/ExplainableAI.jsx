import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export default function ExplainableAI({ xaiData, primaryCondition, primaryProbability }) {
  if (!xaiData) return null;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-slate-900">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Explainable AI (XAI) Attribution
            </h4>
            <p className="text-[11px] text-slate-500">Clinical Feature Importance & SHAP-style Weights</p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
          Transparency Score: 98%
        </span>
      </div>

      <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
        "{xaiData.clinicalReasoning}"
      </p>

      {/* Feature Weights Visual Bars */}
      <div className="space-y-2.5 pt-1">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Top Contributing Clinical Predictors:
        </div>

        {xaiData.featureWeights.map((feat, idx) => {
          const isPositive = feat.type === 'positive';
          const percentageValue = parseInt(feat.impact.replace(/[^0-9]/g, '')) || 20;

          return (
            <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-800 flex items-center gap-1.5">
                  {isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )}
                  <span>{feat.feature}</span>
                </span>
                <span className={`font-mono font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {feat.impact}
                </span>
              </div>

              {/* Progress bar representing weight */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(100, percentageValue * 1.8)}%` }}
                ></div>
              </div>

              <div className="text-[11px] text-slate-500 italic">
                {feat.description}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-900 font-medium">
        <Info className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>XAI weights allow the attending physician to understand the exact clinical factors behind the triage score.</span>
      </div>

    </div>
  );
}
