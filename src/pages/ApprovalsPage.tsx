import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  ShieldAlert,
  FileText,
  Search,
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { ApprovalTask } from '../types';

interface ApprovalsPageProps {
  onOpenDocPrint: (type: any, data: any) => void;
}

export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ onOpenDocPrint }) => {
  const {
    approvalTasks,
    activeRole,
    currentUser,
    approveApprovalTask,
    rejectApprovalTask,
    mrs,
    csList,
    pos
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected' | 'ALL'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentInput, setCommentInput] = useState<{ [id: string]: string }>({});

  const filteredTasks = approvalTasks.filter(t => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch = t.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (task: ApprovalTask) => {
    const comment = commentInput[task.id] || 'Verified and approved as per standard TCCL limits.';
    approveApprovalTask(task.id, comment);
  };

  const handleReject = (task: ApprovalTask) => {
    const comment = commentInput[task.id] || 'Clarification required on line items specifications.';
    rejectApprovalTask(task.id, comment);
  };

  // Find linked document data for preview
  const getDocumentData = (task: ApprovalTask) => {
    if (task.documentType === 'Material Requisition') {
      return mrs.find(m => m.mrNumber === task.documentNumber) || null;
    } else if (task.documentType === 'Comparative Statement') {
      return csList.find(c => c.csNumber === task.documentNumber) || null;
    } else if (task.documentType === 'Purchase Order') {
      return pos.find(p => p.poNumber === task.documentNumber) || null;
    }
    return null;
  };

  const getDocTypeForPrint = (docType: string) => {
    if (docType === 'Material Requisition') return 'MR';
    if (docType === 'Comparative Statement') return 'CS';
    if (docType === 'Purchase Order') return 'PO';
    return 'MR';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">Multi-Tier Sequential Authorization Engine</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[11px] font-bold">
              {approvalTasks.filter(t => t.status === 'Pending').length} Pending Tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Current signing identity: <strong className="text-[#174A7E]">{activeRole}</strong> ({currentUser?.name})
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['Pending', 'Approved', 'Rejected', 'ALL'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === s
                  ? 'bg-white text-[#174A7E] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Task Queue Cards */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
            <h4 className="font-bold text-slate-800 text-base">No tasks in this queue!</h4>
            <p className="text-xs text-slate-500 mt-1">All requisitions, CS, and PO approvals are up to date.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isPending = task.status === 'Pending';
            const docData = getDocumentData(task);

            return (
              <div
                key={task.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-4 ${
                  isPending ? 'border-amber-200 ring-1 ring-amber-400/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base font-black text-[#174A7E]">{task.documentNumber}</span>
                      <span className="px-2 py-0.5 bg-sky-100 text-[#174A7E] rounded text-xs font-bold">
                        {task.documentType}
                      </span>
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      {task.projectName} • Submitted by: <span className="font-semibold text-slate-600">{task.requestedBy}</span> ({task.date})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.amount && (
                      <div className="text-right mr-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Document Value</span>
                        <span className="font-mono font-black text-slate-900 text-base">
                          ৳{task.amount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {docData && (
                      <button
                        onClick={() => onOpenDocPrint(getDocTypeForPrint(task.documentType), docData)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" /> Full PDF
                      </button>
                    )}
                  </div>
                </div>

                {/* Workflow Stage Tracker */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 block">Stage Requirement:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#174A7E]"></span>
                      Current Authorization Stage: <strong className="text-[#174A7E]">{task.requiredRole}</strong>
                    </span>
                  </div>

                  <div className="text-slate-600 text-xs sm:text-right">
                    <span className="text-[11px] text-slate-500 block">Workflow Remarks:</span>
                    <span className="font-medium italic text-slate-800">"{task.comments}"</span>
                  </div>
                </div>

                {/* Action Section for Pending Tasks */}
                {isPending && (
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Add sign-off notes or audit comment (optional)..."
                        value={commentInput[task.id] || ''}
                        onChange={e => setCommentInput({ ...commentInput, [task.id]: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#174A7E]"
                      />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => handleReject(task)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject / Return
                      </button>
                      <button
                        onClick={() => handleApprove(task)}
                        className="flex-1 sm:flex-none px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Sign & Authorize
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
