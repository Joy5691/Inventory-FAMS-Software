import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Check, X, Search, Plus, Shield, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const UsersPage: React.FC = () => {
  const { users, currentUser, activeRole, setActiveRole } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'rbac'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RBAC_MATRIX: {
    permission: string;
    category: string;
    roles: Record<UserRole, boolean>;
  }[] = [
    {
      permission: 'Initiate Material Requisitions (MR)',
      category: 'Procurement',
      roles: {
        'Super Admin': true,
        'Managing Director': true,
        'Project Manager': true,
        'Site Engineer': true,
        'Store Officer': false,
        'Procurement Officer': false,
        'Internal Auditor': false,
        'FAMS Officer': false,
        'Accounts / Finance': false
      }
    },
    {
      permission: 'Verify & Check Requisitions (MAR/MR)',
      category: 'Procurement',
      roles: {
        'Super Admin': true,
        'Managing Director': true,
        'Project Manager': true,
        'Site Engineer': false,
        'Store Officer': true,
        'Procurement Officer': true,
        'Internal Auditor': false,
        'FAMS Officer': false,
        'Accounts / Finance': false
      }
    },
    {
      permission: 'Authorize Requisitions & High-Value Limits',
      category: 'Authorization',
      roles: {
        'Super Admin': true,
        'Managing Director': true,
        'Project Manager': true,
        'Site Engineer': false,
        'Store Officer': false,
        'Procurement Officer': false,
        'Internal Auditor': false,
        'FAMS Officer': false,
        'Accounts / Finance': true
      }
    },
    {
      permission: 'Generate Comparative Statements (CS)',
      category: 'Procurement',
      roles: {
        'Super Admin': true,
        'Managing Director': false,
        'Project Manager': false,
        'Site Engineer': false,
        'Store Officer': false,
        'Procurement Officer': true,
        'Internal Auditor': false,
        'FAMS Officer': false,
        'Accounts / Finance': false
      }
    },
    {
      permission: 'Issue Purchase Orders (PO)',
      category: 'Commercial',
      roles: {
        'Super Admin': true,
        'Managing Director': true,
        'Project Manager': false,
        'Site Engineer': false,
        'Store Officer': false,
        'Procurement Officer': true,
        'Internal Auditor': false,
        'FAMS Officer': false,
        'Accounts / Finance': true
      }
    },
    {
      permission: 'Inspect & Post Goods Received Notes (GRN)',
      category: 'Inventory',
      roles: {
        'Super Admin': true,
        'Managing Director': false,
        'Project Manager': false,
        'Site Engineer': true,
        'Store Officer': true,
        'Procurement Officer': false,
        'Internal Auditor': false,
        'FAMS Officer': false,
        'Accounts / Finance': false
      }
    },
    {
      permission: 'Release Material Issue (MIV) & Transfer (MTV)',
      category: 'Inventory',
      roles: {
        'Super Admin': true,
        'Managing Director': false,
        'Project Manager': false,
        'Site Engineer': false,
        'Store Officer': true,
        'Procurement Officer': false,
        'Internal Auditor': false,
        'FAMS Officer': false,
        'Accounts / Finance': false
      }
    },
    {
      permission: 'Gate Security Clearance & QR Scan',
      category: 'Security & Logistics',
      roles: {
        'Super Admin': true,
        'Managing Director': false,
        'Project Manager': false,
        'Site Engineer': false,
        'Store Officer': true,
        'Procurement Officer': false,
        'Internal Auditor': false,
        'FAMS Officer': false,
        'Accounts / Finance': false
      }
    },
    {
      permission: 'Fixed Asset Capitalization & Tagging (FAMS)',
      category: 'Fixed Assets',
      roles: {
        'Super Admin': true,
        'Managing Director': true,
        'Project Manager': false,
        'Site Engineer': false,
        'Store Officer': false,
        'Procurement Officer': false,
        'Internal Auditor': false,
        'FAMS Officer': true,
        'Accounts / Finance': true
      }
    },
    {
      permission: 'Audit Log & Cross-System Verification',
      category: 'Compliance',
      roles: {
        'Super Admin': true,
        'Managing Director': true,
        'Project Manager': true,
        'Site Engineer': false,
        'Store Officer': false,
        'Procurement Officer': false,
        'Internal Auditor': true,
        'FAMS Officer': false,
        'Accounts / Finance': true
      }
    }
  ];

  const ROLES_LIST: UserRole[] = [
    'Super Admin',
    'Managing Director',
    'Project Manager',
    'Store Officer',
    'Site Engineer',
    'Procurement Officer',
    'Internal Auditor',
    'FAMS Officer',
    'Accounts / Finance'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">User Access & Role-Based Access Control (RBAC)</h3>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-[#174A7E] font-mono text-[11px] font-bold">
              {users.length} Active Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enforces strict segregation of duties between Requisition, Store Check, Purchasing, Quality Inspection, and Financial Settlement.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-white text-[#174A7E] shadow-xs' : 'text-slate-600'
            }`}
          >
            User Directory
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rbac' ? 'bg-white text-[#174A7E] shadow-xs' : 'text-slate-600'
            }`}
          >
            RBAC Permission Matrix
          </button>
        </div>
      </div>

      {/* ======================= TAB 1: USERS DIRECTORY ======================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search staff, role, department..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#174A7E]"
              />
            </div>

            <div className="text-xs text-slate-500">
              Active Signing Role: <strong className="text-[#174A7E] font-bold">{activeRole}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(u => {
              const isCurrent = currentUser?.id === u.id;
              const isActiveSigning = activeRole === u.role;

              return (
                <div
                  key={u.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
                    isActiveSigning ? 'border-[#174A7E] ring-2 ring-[#174A7E]/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{u.name}</h4>
                      <span className="font-mono text-[10px] text-slate-500">{u.employeeId}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Role:</span>
                      <span className="font-bold text-[#174A7E]">{u.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Department:</span>
                      <span className="font-semibold text-slate-800">{u.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-mono text-slate-700">{u.email}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {u.status}
                    </span>
                    <button
                      onClick={() => setActiveRole(u.role)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isActiveSigning
                          ? 'bg-[#174A7E] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isActiveSigning ? 'Active Testing Role' : 'Switch to this Role'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================= TAB 2: RBAC PERMISSIONS MATRIX ======================= */}
      {activeTab === 'rbac' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Enterprise Role-Based Access Control Matrix</h4>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              ISO 9001 & TCCL Compliance Enforced
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 min-w-[220px]">System Functional Capability</th>
                  <th className="py-3 px-4 min-w-[100px]">Module</th>
                  {ROLES_LIST.map(r => (
                    <th key={r} className="py-3 px-2 text-center min-w-[90px]">
                      {r.replace('Officer', 'Off.').replace('Managing Director', 'MD')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {RBAC_MATRIX.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {perm.permission}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        {perm.category}
                      </span>
                    </td>
                    {ROLES_LIST.map(r => {
                      const isAllowed = perm.roles[r];
                      return (
                        <td key={r} className="py-3 px-2 text-center">
                          {isAllowed ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                              <X className="w-3 h-3 stroke-[2]" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
