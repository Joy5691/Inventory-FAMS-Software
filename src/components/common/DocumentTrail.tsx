import React from 'react';
import { ArrowRight, CheckCircle2, Circle, Clock } from 'lucide-react';

export interface TraceNode {
  type: string;
  code?: string;
  status?: string;
  isCurrent?: boolean;
  onClick?: () => void;
}

interface DocumentTrailProps {
  nodes: TraceNode[];
  className?: string;
}

export const DocumentTrail: React.FC<DocumentTrailProps> = ({ nodes, className = '' }) => {
  return (
    <div className={`bg-white  border border-slate-200 rounded-xl p-3.5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
          End-to-End Document Traceability Trail
        </span>
        <span className="text-[11px] text-slate-500 font-mono">Workflow ID: TCCL-FLOW-AUDIT</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {nodes.map((node, index) => {
          const hasCode = !!node.code;
          const isDone = node.status === 'Approved' || node.status === 'Completed' || node.status === 'Inspected & Posted' || node.status === 'Received';
          
          return (
            <React.Fragment key={index}>
              <div
                onClick={node.onClick}
                className={`flex flex-col px-3 py-1.5 rounded-lg border transition-all select-none min-w-[120px] ${
                  node.onClick ? 'cursor-pointer hover:scale-102 hover:shadow-xs' : ''
                } ${
                  node.isCurrent
                    ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500/50 shadow-[0_0_12px_rgba(37,99,235,0.25)]'
                    : hasCode
                    ? isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-50/60 border-slate-200 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-tight">
                    {node.type}
                  </span>
                  {hasCode ? (
                    isDone ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
                    )
                  ) : (
                    <Circle className="w-3 h-3 text-slate-600 shrink-0" />
                  )}
                </div>

                <div className="font-mono text-xs font-semibold text-slate-100 truncate">
                  {node.code || 'Pending Stage'}
                </div>

                {node.status && (
                  <span className="text-[10px] text-slate-500 font-medium truncate">
                    {node.status}
                  </span>
                )}
              </div>

              {index < nodes.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-0.5" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

