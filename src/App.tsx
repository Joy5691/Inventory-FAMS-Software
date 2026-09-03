import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { ProcurementPage } from './pages/ProcurementPage';
import { InventoryPage } from './pages/InventoryPage';
import { MaterialTrackingPage } from './pages/MaterialTrackingPage';
import { FAMSPage } from './pages/FAMSPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { UsersPage } from './pages/UsersPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DocumentPrintModal } from './components/documents/DocumentPrintModal';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Document Print Modal State
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    docType: 'MR' | 'MAR' | 'PR' | 'CS' | 'PO' | 'GRN' | 'GP' | 'MIV' | 'MTV' | 'ASSET';
    data: any;
  }>({
    isOpen: false,
    docType: 'PO',
    data: null
  });

  const handleOpenDocPrint = (
    docType: 'MR' | 'MAR' | 'PR' | 'CS' | 'PO' | 'GRN' | 'GP' | 'MIV' | 'MTV' | 'ASSET',
    data: any
  ) => {
    setPrintModalState({
      isOpen: true,
      docType,
      data
    });
  };

  // If user is not authenticated, strictly show the Login Screen
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen print:h-auto bg-[#F8FAFC] print:bg-white text-slate-900 font-sans overflow-hidden print:overflow-visible antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Immersive Theme Global Radial Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,1),rgba(255,255,255,0))] z-0"></div>

      {/* Collapsible Left Navigation Sidebar */}
      <div className="print:hidden"><Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        activeTab={activePage}
        setActiveTab={setActivePage}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      /></div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible relative z-10">
        {/* Top Header */}
        <div className="print:hidden">
          <Header
          activePage={activePage}
          setActivePage={setActivePage}
          activeTab={activePage}
          setActiveTab={setActivePage}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => {}}
        />
        </div>

        {/* Dynamic Page Views Container with custom scrollbar */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin bg-transparent">
          <div className="max-w-7xl mx-auto space-y-6">
            {(activePage === 'dashboard' || activePage === 'dash') && (
              <DashboardPage onNavigateTab={setActivePage} onOpenDocPrint={handleOpenDocPrint} />
            )}
            {activePage === 'procurement' && (
              <ProcurementPage onOpenDocPrint={handleOpenDocPrint} />
            )}
            {activePage === 'inventory' && (
              <InventoryPage onOpenDocPrint={handleOpenDocPrint} />
            )}
            {(activePage === 'tracking' || activePage === 'material-tracking') && (
              <MaterialTrackingPage onOpenDocPrint={handleOpenDocPrint} />
            )}
            {activePage === 'fams' && (
              <FAMSPage onOpenDocPrint={handleOpenDocPrint} />
            )}
            {activePage === 'approvals' && (
              <ApprovalsPage onOpenDocPrint={handleOpenDocPrint} />
            )}
            {(activePage === 'audit' || activePage === 'audit-trail') && (
              <AuditTrailPage />
            )}
            {activePage === 'users' && (
              <UsersPage />
            )}
            {activePage === 'projects' && (
              <ProjectsPage onOpenDocPrint={handleOpenDocPrint} />
            )}
          </div>
        </main>

        {/* Immersive UI Bottom Status & Telemetry Bar */}
        <footer className="h-7 bg-[#0f172a]/95 border-t border-slate-800 text-[11px] text-slate-400 px-4 flex items-center justify-between shrink-0 font-mono select-none z-20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
              CORE-ERP ONLINE
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">Node: TCCL-HQ-CLUSTER-01</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">Sync: Realtime (18ms)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 hidden sm:inline">TECHNIC ERP v2.4.1</span>
            <span className="text-blue-400 font-semibold">ISO 9001:2015 Compliant</span>
          </div>
        </footer>
      </div>

      {/* Universal Document Print & Export Modal */}
      <DocumentPrintModal
        isOpen={printModalState.isOpen}
        onClose={() => setPrintModalState({ ...printModalState, isOpen: false })}
        docType={printModalState.docType}
        data={printModalState.data}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

