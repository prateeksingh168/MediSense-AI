import React from 'react';
import { FileSearch } from 'lucide-react';

export default function MissingInfoCard({ missingItems = [] }) {
  if (!missingItems || missingItems.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Missing Clinical Information
            </h4>
            <p className="text-[11px] text-slate-500">Diagnostic Tests Suggested for Definitive Diagnosis</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          {missingItems.length} Tests Suggested
        </span>
      </div>

      <div className="space-y-2.5">
        {missingItems.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {item.item}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                item.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                item.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                'bg-slate-200 text-slate-700'
              }`}>
                {item.urgency}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 pl-3.5">
              <strong className="text-slate-800">Rationale: </strong>{item.why}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
