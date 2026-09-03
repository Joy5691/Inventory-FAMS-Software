import React, { useState } from 'react';
import { History, Search, Filter, ShieldCheck, Download, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuditTrailPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = actionFilter === 'ALL' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.documentId && log.documentId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">Immutable Audit Trail & System Event Logs</h3>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-[#174A7E] font-mono text-[11px] font-bold">
              {auditLogs.length} Events Logged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete chronological record of document submissions, tier authorizations, stock receipts, and security clearances.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Audit Log
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by User, Action, Document ID, Details..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#174A7E]"
          />
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {['ALL', 'CREATE', 'APPROVE', 'ISSUE', 'TRANSFER', 'SECURITY'].map(act => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                actionFilter === act
                  ? 'bg-white text-[#174A7E] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Document Ref</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <div className="text-[10px] text-sky-700 font-semibold">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-bold border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#174A7E] whitespace-nowrap">
                    {log.documentId || '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
