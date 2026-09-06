import React from 'react';

export function TriageBadge({ level, className = '' }) {
  const configs = {
    EMERGENCY: {
      label: 'EMERGENCY',
      bg: 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse',
      dot: 'bg-rose-500'
    },
    URGENT: {
      label: 'URGENT',
      bg: 'bg-amber-50 text-amber-700 border-amber-300',
      dot: 'bg-amber-500'
    },
    'SEMI-URGENT': {
      label: 'SEMI-URGENT',
      bg: 'bg-yellow-50 text-yellow-700 border-yellow-300',
      dot: 'bg-yellow-500'
    },
    ROUTINE: {
      label: 'ROUTINE',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      dot: 'bg-emerald-500'
    }
  };

  const current = configs[level] || configs.ROUTINE;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide border ${current.bg} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const configs = {
    PENDING_REVIEW: {
      label: 'Awaiting Doctor',
      color: 'bg-sky-50 text-sky-700 border-sky-300'
    },
    ACCEPTED: {
      label: 'Physician Confirmed',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-300'
    },
    OVERRIDDEN: {
      label: 'Doctor Overridden',
      color: 'bg-purple-50 text-purple-700 border-purple-300'
    }
  };

  const current = configs[status] || configs.PENDING_REVIEW;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${current.color}`}>
      {current.label}
    </span>
  );
}
