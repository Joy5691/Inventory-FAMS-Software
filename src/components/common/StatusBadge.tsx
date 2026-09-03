import React from 'react';
import { DocumentStatus, PriorityLevel } from '../../types';

interface StatusBadgeProps {
  status: DocumentStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-500';

  const displayStatus = status || 'Active';
  const normalized = displayStatus.toLowerCase();

  if (normalized.includes('approved') || normalized.includes('completed') || normalized.includes('posted') || normalized.includes('received') || normalized.includes('verified') || normalized === 'active' || normalized === 'active / deployed') {
    styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  } else if (normalized.includes('progress') || normalized.includes('ongoing') || normalized.includes('planning')) {
    styleClasses = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
  } else if (normalized.includes('pending') || normalized.includes('shortage') || normalized.includes('scheduled')) {
    styleClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500 animate-pulse';
  } else if (normalized.includes('transit') || normalized.includes('dispatched') || normalized.includes('issued') || normalized.includes('released')) {
    styleClasses = 'bg-sky-50 text-sky-700 border-sky-200';
    dotColor = 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]';
  } else if (normalized.includes('reject') || normalized.includes('overdue') || normalized.includes('cancel') || normalized.includes('critical')) {
    styleClasses = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (normalized.includes('maintenance') || normalized.includes('return') || normalized.includes('conditional')) {
    styleClasses = 'bg-orange-50 text-orange-800 border-orange-200';
    dotColor = 'bg-orange-500';
  } else if (normalized.includes('draft') || normalized.includes('idle')) {
    styleClasses = 'bg-slate-100 text-slate-600 border-slate-200';
    dotColor = 'bg-slate-400';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-bold'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border tracking-wide whitespace-nowrap ${styleClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {displayStatus}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel | string }> = ({ priority }) => {
  let color = 'bg-slate-800/80 text-slate-600 border-slate-700';
  if (priority === 'Emergency' || priority === 'Critical') {
    color = 'bg-red-500/10 text-red-400 border-red-500/30 font-bold';
  } else if (priority === 'High') {
    color = 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold';
  } else {
    color = 'bg-slate-800/60 text-slate-600 border-slate-700/60 font-medium';
  }

  return (
    <span className={`inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border backdrop-blur-xs font-semibold ${color}`}>
      {priority}
    </span>
  );
};

