import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Truck,
  HardHat,
  CheckSquare,
  History,
  ShieldCheck,
  FileBarChart, Building2,
  ChevronDown,
  LogOut,
  X,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from "../common/Logo";
import { UserRole } from '../../types';

interface SidebarProps {
  activePage?: string;
  setActivePage?: (page: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

const ALL_ROLES: UserRole[] = [
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

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  activePage,
  setActivePage,
  activeTab,
  setActiveTab,
  mobileOpen = false,
  setMobileOpen
}) => {
  const currentActive = activePage || activeTab || 'dashboard';
  const handleSelect = (id: string) => {
    if (setActivePage) setActivePage(id);
    if (setActiveTab) setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  const { currentUser, activeRole, setActiveRole, approvalTasks, logout } = useApp();

  const pendingApprovalsCount = approvalTasks.filter(t => t.status === 'Pending').length;

  const operationsItems = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard },
    { id: 'procurement', label: 'Procurement & Purchasing', icon: ShoppingCart, badge: 'MR, CS, PO' },
    { id: 'inventory', label: 'Inventory & Warehouse', icon: Boxes, badge: 'GRN, Stores' },
    { id: 'tracking', alias: 'material-tracking', label: 'Gate Pass & Tracking', icon: Truck, badge: 'RGP, Challan' },
    { id: 'fams', label: 'Asset Management (FAMS)', icon: HardHat, badge: 'Plant & Mach.' }
  ];

  const governanceItems = [
    {
      id: 'approvals',
      label: 'Approval Inbox',
      icon: CheckSquare,
      counter: pendingApprovalsCount
    },
    { id: 'projects', label: 'Projects', icon: Building2 },
    { id: 'audit', alias: 'audit-trail', label: 'Audit Trails & Logs', icon: History },
    { id: 'users', label: 'User & RBAC Control', icon: ShieldCheck }
  ];

  const isItemActive = (id: string, alias?: string) => {
    return currentActive === id || (alias && currentActive === alias);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-white/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Docked Left Sidebar Container - Immersive Dark Theme */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 h-full bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'} ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Branding Section */}
          <div className="p-5 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isCollapsed ? <div className="px-1"><Building2 className="w-8 h-8 text-blue-600" /></div> : <Logo showTagline={false} />}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed && setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded shadow-sm"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              
              {setMobileOpen && (
                <button
                  onClick={() => setMobileOpen(false)}
                  className="lg:hidden p-1 text-slate-500 hover:text-white rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-5 scrollbar-thin">
            {/* Operations Category */}
            <div>
              {!isCollapsed ? <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operations</p> : <div className="h-4" />}
              <div className="space-y-1">
                {operationsItems.map(item => {
                  const Icon = item.icon;
                  const active = isItemActive(item.id, item.alias);

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-xs font-medium transition-all group rounded-r-md cursor-pointer ${
                        active
                          ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                            active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-900'
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && !active && (
                        <span className="hidden xl:inline text-[9px] text-slate-500 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Governance & Control Category */}
            <div>
              {!isCollapsed ? <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Governance & Control</p> : <div className="h-4" />}
              <div className="space-y-1">
                {governanceItems.map(item => {
                  const Icon = item.icon;
                  const active = isItemActive(item.id, item.alias);

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-xs font-medium transition-all group rounded-r-md cursor-pointer ${
                        active
                          ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                            active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-900'
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.counter !== undefined && item.counter > 0 && (
                        <span className="bg-red-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                          {item.counter}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* User Profile Pill & Quick Role Switcher */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200">
            <div className="relative">
              <div
                className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                  SA
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Super Admin</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">System Administrator</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
              <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {!isCollapsed && "HQ Online"}
              </span>
              <button
                onClick={logout}
                className="text-[10px] text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" /> {!isCollapsed && "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

