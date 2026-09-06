import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert } from 'lucide-react';

export default function RedFlagAlert({ title = 'CRITICAL RED-FLAG ALERT', message, actions = [] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-rose-400 bg-gradient-to-r from-rose-50 via-white to-rose-50/50 p-5 sm:p-6 shadow-md text-slate-900">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl border border-rose-200 shrink-0 mt-0.5 animate-bounce">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <h4 className="text-sm sm:text-base font-extrabold text-rose-800 uppercase tracking-wider">{title}</h4>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {message || 'High-acuity red flag symptoms detected. These signs may indicate life-threatening cardiac, cerebral, or acute internal pathology.'}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-3">
            <a
              href="tel:911"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Call Emergency Services (911 / 112)
            </a>
            <div className="inline-flex items-center gap-1.5 text-xs text-rose-800 bg-rose-100/70 px-3 py-2 rounded-xl border border-rose-200 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Do not drive yourself. Have someone escort you to the nearest ER.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
