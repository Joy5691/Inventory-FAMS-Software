import React, { useState } from 'react';
import {
  Search,
  Bell,
  RotateCcw,
  Menu,
  Shield,
  FileText,
  Truck,
  HardHat,
  Boxes,
  CheckCircle2,
  ExternalLink,
  Maximize,
  Minimize
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  activePage?: string;
  setActivePage?: (page: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenMobileMenu?: () => void;
  onOpenSearch?: () => void;
  onSelectDocument?: (type: string, doc: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  onSelectDocument
}) => {
  const currentTab = activePage || activeTab || 'dashboard';
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.log(err));
      }
    }
  };

  const handleNav = (tabId: string) => {
    if (setActivePage) setActivePage(tabId);
    if (setActiveTab) setActiveTab(tabId);
  };

  const {
    activeRole,
    projects,
    mrs,
    pos,
    gatePasses,
    assets,
    approvalTasks,
    resetAllData
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const pendingApprovals = approvalTasks.filter(t => t.status === 'Pending');

  // Filter global search results
  const searchResults = searchQuery.trim() === '' ? [] : [
    ...mrs.filter(m => m.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()) || m.projectName.toLowerCase().includes(searchQuery.toLowerCase())).map(m => ({ type: 'MR', code: m.mrNumber, title: `${m.mrNumber} - ${m.projectName}`, tab: 'procurement', data: m })),
    ...pos.filter(p => p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || p.vendorName.toLowerCase().includes(searchQuery.toLowerCase())).map(p => ({ type: 'PO', code: p.poNumber, title: `${p.poNumber} - ${p.vendorName}`, tab: 'procurement', data: p })),
    ...gatePasses.filter(g => g.gatePassNo.toLowerCase().includes(searchQuery.toLowerCase()) || g.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase())).map(g => ({ type: 'GP', code: g.gatePassNo, title: `${g.gatePassNo} - ${g.vehicleNo}`, tab: 'tracking', data: g })),
    ...assets.filter(a => a.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) || a.name.toLowerCase().includes(searchQuery.toLowerCase())).map(a => ({ type: 'ASSET', code: a.assetCode, title: `${a.assetCode} - ${a.name}`, tab: 'fams', data: a })),
    ...projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase())).map(p => ({ type: 'PROJ', code: p.code, title: p.name, tab: 'dashboard', data: p }))
  ].slice(0, 8);

  const pageTitles: Record<string, { title: string; subtitle: string; breadcrumb: string }> = {
    dashboard: { title: 'Executive Dashboard & Analytics', subtitle: 'Real-time multi-project spend, stock valuation and plant intelligence', breadcrumb: 'Operations / Dashboard' },
    procurement: { title: 'Procurement & Purchasing Workflow', subtitle: 'Material Requisition (MR), MAR store check, RFQ, CS & Purchase Orders', breadcrumb: 'Operations / Procurement' },
    inventory: { title: 'Inventory & Warehouse Ledger', subtitle: 'Central & site stores, Bin cards, MIV/MTV issue vouchers & GRN inspection', breadcrumb: 'Operations / Inventory' },
    tracking: { title: 'Gate Pass Tracking & Challans', subtitle: 'Returnable/Non-returnable gate clearance, live transport & QR gate scan', breadcrumb: 'Operations / Gate Pass' },
    'material-tracking': { title: 'Gate Pass Tracking & Challans', subtitle: 'Returnable/Non-returnable gate clearance, live transport & QR gate scan', breadcrumb: 'Operations / Gate Pass' },
    fams: { title: 'Fixed Asset Management (FAMS)', subtitle: 'Heavy equipment register, depreciation calculation, service logs & tags', breadcrumb: 'Operations / FAMS' },
    approvals: { title: 'Approval Inbox & Authorization', subtitle: 'Multi-tier sequential approval engine with delegation rules and limits', breadcrumb: 'Governance / Approvals' },
    reports: { title: 'Reports & Analytics Center', subtitle: 'Official executive audit, procurement spend, stock ledger & FAMS reports', breadcrumb: 'Governance / Reports' },
    audit: { title: 'Audit Trails & System Logs', subtitle: 'Immutable chronological record of every document, approval & transfer', breadcrumb: 'Governance / Audit Logs' },
    'audit-trail': { title: 'Audit Trails & System Logs', subtitle: 'Immutable chronological record of every document, approval & transfer', breadcrumb: 'Governance / Audit Logs' },
    users: { title: 'User & RBAC Management', subtitle: 'Role permissions matrix, authorization thresholds & user directory', breadcrumb: 'Administration / RBAC' }
  };

  const currentInfo = pageTitles[currentTab] || pageTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 transition-all text-slate-900">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{currentInfo.breadcrumb.split('/')[0]}</span>
              <span className="text-slate-600">/</span>
              <span className="text-blue-400 font-semibold">{currentInfo.breadcrumb.split('/')[1] || currentInfo.title}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate max-w-xs sm:max-w-md">
              {currentInfo.title}
            </h1>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="relative hidden md:block flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search MR-0045, PO-0012, Gate Pass, Excavator, BSRM..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/60 focus:border-blue-500 text-xs text-slate-900 placeholder-slate-500 transition-all focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Search Dropdown Results */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1 ">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 border-b border-slate-200/60">
                Matching ERP Records:
              </div>
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onMouseDown={() => {
                    handleNav(res.tab);
                    if (onSelectDocument) onSelectDocument(res.type, res.data);
                    setSearchQuery('');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between border-b border-slate-200 last:border-0 transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 font-mono">
                      {res.type}
                    </span>
                    <span className="text-xs font-medium text-slate-900 truncate">{res.title}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Site Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200/80">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs text-slate-600 font-medium">Site Status: Active</span>
          </div>

          {/* Active Role Chip */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/10 border border-blue-500/30 text-xs font-semibold text-blue-400">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>{activeRole}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition-colors"
              title="System Notifications & Approvals"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovals.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-slate-900"></span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden ">
                <div className="bg-white border-b border-slate-200/80 text-slate-900 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold">Pending Workflow Actions</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-600 text-white rounded-full font-bold">
                    {pendingApprovals.length} Urgent
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800 scrollbar-thin">
                  {pendingApprovals.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      All approval queues are up to date!
                    </div>
                  ) : (
                    pendingApprovals.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          handleNav('approvals');
                          setNotifOpen(false);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="text-[11px] font-bold text-white font-mono">
                            {t.documentNumber}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {t.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1">{t.comments}</p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                          <span>{t.projectName}</span>
                          <span className="font-semibold text-blue-400">Needs: {t.requiredRole}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                  <button
                    onClick={() => {
                      handleNav('approvals');
                      setNotifOpen(false);
                    }}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Open Full Approval Inbox →
                  </button>
                </div>
              </div>
            )}
          </div>

          
          {/* Full Screen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 border border-slate-200 transition-colors"
            title="Toggle Full Screen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-200 transition-colors"
            title="Reset Demo Data to Initial State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-500/30">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Reset All Portal Data?</h3>
            <p className="text-xs text-slate-500 mb-5">
              This will restore all default construction projects, MRs, MARs, POs, stocks and assets to the original sample state.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

