import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import { TriageBadge, StatusBadge } from '../common/Badge';
import {
  Search,
  ArrowUpDown,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function TriageQueue({ onSelectCase }) {
  const { cases } = useMediSense();

  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('acuity');

  const filteredCases = cases.filter(c => {
    const matchesLevel = filterLevel === 'ALL' || c.triageLevel === filterLevel;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.aiAnalysis.primaryCondition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesStatus && matchesSearch;
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'acuity') {
      return b.triageScore - a.triageScore;
    }
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="space-y-6">
      
      {/* Controls Bar: Search, Urgency filter, Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, complaint, diagnosis, or Case ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        {/* Urgency Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'EMERGENCY', 'URGENT', 'SEMI-URGENT', 'ROUTINE'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterLevel === lvl
                  ? lvl === 'EMERGENCY'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Sort Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy(prev => prev === 'acuity' ? 'time' : 'acuity')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 whitespace-nowrap"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sort: {sortBy === 'acuity' ? 'Acuity Score' : 'Arrival Time'}</span>
          </button>
        </div>

      </div>

      {/* Case List Cards */}
      <div className="space-y-3">
        {sortedCases.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 text-xs">
            No clinical cases matched your filter criteria.
          </div>
        ) : (
          sortedCases.map(caseItem => {
            const isEmergency = caseItem.triageLevel === 'EMERGENCY';
            const isReviewed = caseItem.status !== 'PENDING_REVIEW';

            return (
              <div
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem.id)}
                className={`group p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden bg-white shadow-sm ${
                  isEmergency && !isReviewed
                    ? 'border-rose-300 ring-1 ring-rose-200 hover:shadow-md'
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                {isEmergency && !isReviewed && (
                  <div className="absolute top-0 left-0 bottom-0 w-2 bg-rose-500"></div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Patient Info & Acuity */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 ${
                      caseItem.triageScore >= 85 ? 'bg-rose-50 border border-rose-200 text-rose-700' :
                      caseItem.triageScore >= 70 ? 'bg-amber-50 border border-amber-200 text-amber-800' :
                      'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    }`}>
                      <span className="text-base font-black leading-none">{caseItem.triageScore}</span>
                      <span className="text-[9px] uppercase font-bold tracking-tight">Acuity</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {caseItem.patientName}
                        </h4>
                        <span className="text-xs text-slate-500">
                          ({caseItem.patientAge}y {caseItem.patientGender})
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {caseItem.id}
                        </span>
                        <TriageBadge level={caseItem.triageLevel} />
                        <StatusBadge status={caseItem.status} />
                      </div>

                      <p className="mt-1 text-xs text-slate-700 font-medium line-clamp-1 max-w-2xl">
                        <strong className="text-slate-500 font-semibold">Chief Complaint: </strong>
                        {caseItem.chiefComplaint}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {caseItem.submittedAt}
                        </span>
                        <span>•</span>
                        <span>Vitals: BP {caseItem.vitalsAtIntake?.bp || '120/80'} | HR {caseItem.vitalsAtIntake?.hr || '72'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Prediction & Action Button */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        AI Suggested Condition
                      </span>
                      <span className="text-xs font-bold text-slate-900 max-w-xs truncate block">
                        {caseItem.aiAnalysis.primaryCondition}
                      </span>
                      <span className="text-[11px] font-extrabold text-teal-700">
                        {caseItem.aiAnalysis.primaryProbability}% Match Likelihood
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(caseItem.id);
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-1.5 shadow"
                    >
                      <span>Review Case</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
