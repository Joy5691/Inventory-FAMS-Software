import React, { useState, useMemo } from 'react';
import {
  HardHat,
  Search,
  Filter,
  Plus,
  Wrench,
  Printer,
  QrCode,
  Calendar,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  Building,
  Building2,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Truck,
  FileText,
  XCircle,
  ArrowRight,
  Clock,
  MapPin,
  ArrowUpDown,
  LayoutGrid,
  Sliders,
  Edit3,
  User
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { QRCodeModal } from '../components/common/QRCodeModal';
import { FixedAsset, AssetCategory } from '../types';

interface FAMSPageProps {
  onOpenDocPrint: (type: any, data: any) => void;
}

export const FAMSPage: React.FC<FAMSPageProps> = ({ onOpenDocPrint }) => {
  const {
    assets,
    projects,
    createAsset,
    updateAsset,
    reallocateAsset,
    updateAssetStatus,
    addMaintenanceLog,
    currentUser,
    assetRequisitions,
    approveAssetRequisition,
    rejectAssetRequisition,
    mtvs
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AssetCategory>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'PROJECT' | 'LOCATION' | 'CODE' | 'NAME' | 'VALUE_DESC' | 'STATUS'>('PROJECT');
  const [viewLayout, setViewLayout] = useState<'GROUPED_PROJECT' | 'GRID'>('GROUPED_PROJECT');
  const [viewMode, setViewMode] = useState<'LIST' | 'REQUESTS' | 'REPORT'>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);

  // Edit Asset Modal state
  const [showEditAssetModal, setShowEditAssetModal] = useState(false);
  const [editingAssetData, setEditingAssetData] = useState<FixedAsset | null>(null);
  const [editAssetName, setEditAssetName] = useState('');
  const [editAssetProject, setEditAssetProject] = useState('');
  const [editAssetLocation, setEditAssetLocation] = useState('');
  const [editAssetCustodian, setEditAssetCustodian] = useState('');
  const [editAssetCustodianPhone, setEditAssetCustodianPhone] = useState('');
  const [editAssetStatus, setEditAssetStatus] = useState<FixedAsset['status']>('Active / Deployed');
  const [editAssetHours, setEditAssetHours] = useState(0);

  // Requisitions state
  const [reqStatusFilter, setReqStatusFilter] = useState<'ALL' | 'Pending Approval' | 'Approved' | 'Rejected'>('ALL');
  const [approvalModalReq, setApprovalModalReq] = useState<any | null>(null);
  const [approvalRemarksInput, setApprovalRemarksInput] = useState('Approved by Central FAMS for site mobilization.');
  const [rejectionModalReq, setRejectionModalReq] = useState<any | null>(null);
  const [rejectionRemarksInput, setRejectionRemarksInput] = useState('Equipment currently engaged in scheduled maintenance overhaul.');
  const [famsToast, setFamsToast] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // Modals
  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showReallocateModal, setShowReallocateModal] = useState(false);
  const [showPdfConfirm, setShowPdfConfirm] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [qrModalData, setQrModalData] = useState<{
    isOpen: boolean;
    title: string;
    codeValue: string;
    meta: { label: string; value: string }[];
  }>({
    isOpen: false,
    title: '',
    codeValue: '',
    meta: []
  });

  // New Asset Form
  const [assetName, setAssetName] = useState('Komatsu Hydraulic Excavator PC300');
  const [assetCategory, setAssetCategory] = useState<AssetCategory>('Heavy Construction Equipment');
  const [assetMakeModel, setAssetMakeModel] = useState('Komatsu PC300-8M0');
  const [assetSerial, setAssetSerial] = useState('KM-PC300-2024-8841');
  const [assetBuyingDate, setAssetBuyingDate] = useState('2024-03-15');
  const [assetCost, setAssetCost] = useState(16500000);
  const [assetUsefulLife, setAssetUsefulLife] = useState(10);
  const [assetProject, setAssetProject] = useState(projects[0]?.id || '');
  const [assetLocation, setAssetLocation] = useState(projects[0]?.location || 'Airport to Qutubkhali, Dhaka');
  
  const [assetCustodian, setAssetCustodian] = useState('Md. Jahangir Alam (Chief Plant Operator)');
  const [assetCustodianPhone, setAssetCustodianPhone] = useState('+880 1711-234567');

  // Maintenance Form
  const [maintType, setMaintType] = useState('500-Hour Hydraulic Oil & Filter Replacement');
  const [maintVendor, setMaintVendor] = useState('Komatsu Bangladesh (Pragati Motors)');
  const [maintCost, setMaintCost] = useState(85000);
  const [maintNextDue, setMaintNextDue] = useState('2026-11-20');

  // Reallocate Form
  const [reallocType, setReallocType] = useState<'Site to Site' | 'Office to Site' | 'Site to Office'>('Site to Site');
  const [reallocFromLocation, setReallocFromLocation] = useState('');
  const [reallocProject, setReallocProject] = useState(projects[0]?.id || '');
  const [reallocTargetLocation, setReallocTargetLocation] = useState(projects[0]?.location || 'Airport to Qutubkhali, Dhaka');
  
  const [reallocCustodian, setReallocCustodian] = useState('Engr. Shafiul Islam');
  const [reallocPhone, setReallocPhone] = useState('+880 1819-887766');

  // Comprehensive unique location list from both current assets and all known projects
  const uniqueLocations = useMemo(() => {
    const locSet = new Set<string>();
    assets.forEach(a => {
      if (a.currentLocation && a.currentLocation.trim()) locSet.add(a.currentLocation.trim());
    });
    projects.forEach(p => {
      if (p.location && p.location.trim()) locSet.add(p.location.trim());
    });
    return Array.from(locSet).filter(Boolean).sort();
  }, [assets, projects]);

  // Comprehensive unique project list from all known projects and assets
  const uniqueProjects = useMemo(() => {
    const projSet = new Set<string>();
    projects.forEach(p => {
      if (p.name && p.name.trim()) projSet.add(p.name.trim());
    });
    assets.forEach(a => {
      if (a.projectName && a.projectName.trim()) projSet.add(a.projectName.trim());
    });
    return Array.from(projSet).filter(Boolean).sort();
  }, [assets, projects]);

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      // Smart location match:
      // Check if locationFilter matches:
      // 1. Exact a.currentLocation
      // 2. Case-insensitive substring match
      // 3. The asset's project site location matches locationFilter
      // 4. If an asset has a project name corresponding to this location
      let matchesLoc = locationFilter === 'ALL';
      if (!matchesLoc) {
        const normFilter = locationFilter.trim().toLowerCase();
        const normAssetLoc = (a.currentLocation || '').trim().toLowerCase();
        const normProjectName = (a.projectName || '').trim().toLowerCase();
        const projObj = projects.find(p => p.id === a.projectId || p.name === a.projectName);
        const normProjSiteLoc = (projObj?.location || '').trim().toLowerCase();

        matchesLoc = 
          normAssetLoc === normFilter ||
          normProjSiteLoc === normFilter ||
          normAssetLoc.includes(normFilter) ||
          normFilter.includes(normAssetLoc) ||
          (normProjSiteLoc && (normProjSiteLoc.includes(normFilter) || normFilter.includes(normProjSiteLoc))) ||
          (normProjectName && normProjectName.includes(normFilter));
      }

      // Smart project match:
      let matchesProj = projectFilter === 'ALL';
      if (!matchesProj) {
        const normFilter = projectFilter.trim().toLowerCase();
        const normProjectName = (a.projectName || '').trim().toLowerCase();
        const normProjectId = (a.projectId || '').trim().toLowerCase();
        const projObj = projects.find(p => p.id === projectFilter || p.name === projectFilter || p.code === projectFilter);
        
        matchesProj = 
          normProjectId === normFilter ||
          normProjectName === normFilter ||
          normProjectName.includes(normFilter) ||
          (projObj && (a.projectId === projObj.id || a.projectName === projObj.name));
      }

      const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
      const matchesSearch = !searchQuery || 
        a.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.serialChassisNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.currentLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.custodianName && a.custodianName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesProj && matchesCat && matchesLoc && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'PROJECT') {
        const pComp = a.projectName.localeCompare(b.projectName);
        if (pComp !== 0) return pComp;
        const lComp = a.currentLocation.localeCompare(b.currentLocation);
        if (lComp !== 0) return lComp;
        return a.assetCode.localeCompare(b.assetCode);
      }
      if (sortBy === 'LOCATION') {
        const lComp = a.currentLocation.localeCompare(b.currentLocation);
        if (lComp !== 0) return lComp;
        return a.projectName.localeCompare(b.projectName);
      }
      if (sortBy === 'CODE') return a.assetCode.localeCompare(b.assetCode);
      if (sortBy === 'NAME') return a.name.localeCompare(b.name);
      if (sortBy === 'VALUE_DESC') return (b.currentNetBookValue || 0) - (a.currentNetBookValue || 0);
      if (sortBy === 'STATUS') return a.status.localeCompare(b.status);
      return 0;
    });
  }, [assets, projectFilter, locationFilter, categoryFilter, searchQuery, sortBy]);

  // Group assets by Project & Site Location
  const projectLocationGroups = useMemo(() => {
    const groupsMap = new Map<string, {
      groupKey: string;
      projectId: string;
      projectName: string;
      location: string;
      custodianName: string;
      custodianPhone: string;
      assets: FixedAsset[];
      totalNBV: number;
      totalCost: number;
    }>();

    filteredAssets.forEach(asset => {
      const pName = asset.projectName || 'Central Depot / Unallocated';
      const pLoc = asset.currentLocation || 'Main Fleet Yard';
      const key = `${pName}:::${pLoc}`;

      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          groupKey: key,
          projectId: asset.projectId || '',
          projectName: pName,
          location: pLoc,
          custodianName: asset.custodianName || 'Depot In-Charge',
          custodianPhone: asset.custodianPhone || '',
          assets: [],
          totalNBV: 0,
          totalCost: 0
        });
      }
      const g = groupsMap.get(key)!;
      g.assets.push(asset);
      g.totalNBV += (asset.currentNetBookValue || 0);
      g.totalCost += (asset.purchaseCost || 0);
    });

    return Array.from(groupsMap.values());
  }, [filteredAssets]);

  const totalCapCost = assets.reduce((s, a) => s + a.purchaseCost, 0);
  const totalNBV = assets.reduce((s, a) => s + a.currentNetBookValue, 0);
  const totalDepreciation = totalCapCost - totalNBV;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('site-wise-depreciation-report');
    if (!element) return;
    
    setIsGeneratingPdf(true);
    
    // Temporarily remove print-specific classes that hide elements on screen
    const printHiddenEls = element.querySelectorAll('.hidden.print\\:block');
    printHiddenEls.forEach(el => {
      el.classList.remove('hidden', 'print:block');
      el.classList.add('block');
    });
    
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
      pdf.save(`Site_Wise_Depreciation_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      // Restore classes
      printHiddenEls.forEach(el => {
        el.classList.remove('block');
        el.classList.add('hidden', 'print:block');
      });
      setIsGeneratingPdf(false);
      setShowPdfConfirm(false);
    }
  };

  const siteWiseData = uniqueLocations.map(loc => {
    const siteAssets = assets.filter(a => a.currentLocation === loc);
    const capCost = siteAssets.reduce((sum, a) => sum + a.purchaseCost, 0);
    const nbv = siteAssets.reduce((sum, a) => sum + a.currentNetBookValue, 0);
    const accumDep = capCost - nbv;
    return { location: loc, assets: siteAssets, assetCount: siteAssets.length, capCost, nbv, accumDep };
  });

  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === assetProject);
    const finalLocation = (assetLocation && assetLocation.trim()) ? assetLocation.trim() : (proj?.location || proj?.name || 'Main Fleet Yard');

    createAsset({
      name: assetName,
      category: assetCategory,
      makeModel: assetMakeModel,
      serialChassisNo: assetSerial,
      buyingDate: assetBuyingDate,
      capitalizationDate: new Date().toISOString().substring(0, 10),
      purchaseCost: Number(assetCost),
      salvageValue: Number(assetCost) * 0.1,
      usefulLifeYears: Number(assetUsefulLife),
      projectId: assetProject,
      projectName: proj?.name || 'Dhaka Elevated Expressway Phase-3 (DEEP-03)',
      currentLocation: finalLocation,
      custodianName: assetCustodian,
      custodianPhone: assetCustodianPhone,
      operationalHours: 450,
      maintenanceSchedule: [
        {
          id: `maint-${Date.now()}`,
          serviceType: 'Pre-Deployment Inspection & Engine Fluid Analysis',
          lastServiceDate: new Date().toISOString().substring(0, 10),
          nextServiceDueDate: '2026-12-15',
          mechanicOrVendor: 'TCCL Central Workshop Savar',
          cost: 35000,
          status: 'Completed'
        }
      ]
    });

    setFamsToast({
      type: 'success',
      message: `Asset registered successfully! Assigned to ${proj?.name || 'Fleet'} at site location: "${finalLocation}".`
    });

    setShowNewAssetModal(false);
  };

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    addMaintenanceLog(selectedAsset.id, {
      serviceType: maintType,
      lastServiceDate: new Date().toISOString().substring(0, 10),
      nextServiceDueDate: maintNextDue,
      mechanicOrVendor: maintVendor,
      cost: Number(maintCost),
      status: 'Completed'
    });

    setShowMaintenanceModal(false);
  };

  const handleReallocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    const proj = projects.find(p => p.id === reallocProject);
    const finalDestLocation = (reallocTargetLocation && reallocTargetLocation.trim()) ? reallocTargetLocation.trim() : (proj?.location || proj?.name || 'Main Fleet Yard');

    reallocateAsset(
      selectedAsset.id,
      reallocProject,
      proj?.name || 'Central Fleet Reserve',
      finalDestLocation,
      reallocCustodian,
      reallocPhone,
      reallocType,
      reallocFromLocation || selectedAsset.currentLocation
    );

    setFamsToast({
      type: 'success',
      message: `Equipment ${selectedAsset.assetCode} successfully relocated to ${proj?.name || 'Project'} at "${finalDestLocation}".`
    });

    setShowReallocateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top FAMS Valuation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Gross Capitalized Cost</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              ৳{(totalCapCost / 10000000).toFixed(2)} Crore
            </div>
            <span className="text-[11px] text-slate-500 font-medium">{assets.length} Registered units</span>
          </div>
          <div className="p-3 bg-sky-50 text-[#174A7E] rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Current Net Book Value (NBV)</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
              ৳{(totalNBV / 10000000).toFixed(2)} Crore
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Straight-Line Depreciation</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Accumulated Depreciation</span>
            <div className="text-2xl font-black text-amber-700 font-mono mt-1">
              ৳{(totalDepreciation / 10000000).toFixed(2)} Crore
            </div>
            <span className="text-[11px] text-amber-600 font-medium">Monthly straight amortisation</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pending Requisitions Alert Banner */}
      {assetRequisitions.filter(r => r.status === 'Pending Approval').length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {assetRequisitions.filter(r => r.status === 'Pending Approval').length} Fixed Asset Requisition{assetRequisitions.filter(r => r.status === 'Pending Approval').length > 1 ? 's' : ''} Awaiting Central Approval
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Project site teams have requested mobilization of heavy machinery & fleet items. Authorize relocation to dispatch equipment.
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewMode('REQUESTS')}
            className="px-4 py-2 bg-[#174A7E] text-white text-xs font-bold rounded-xl hover:bg-[#123a63] transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <span>Review Requisitions ({assetRequisitions.filter(r => r.status === 'Pending Approval').length})</span>
          </button>
        </div>
      )}

      {/* Action Notification Toast */}
      {famsToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{famsToast.message}</span>
          </div>
          <button onClick={() => setFamsToast(null)} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold ml-4">✕</button>
        </div>
      )}

      {/* View Tabs */}
      <div className="flex border-b border-slate-200 mb-4 print:hidden">
        <button
          onClick={() => setViewMode('LIST')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${viewMode === 'LIST' ? 'border-[#174A7E] text-[#174A7E]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <span>Asset Register</span>
          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{assets.length}</span>
        </button>
        <button
          onClick={() => setViewMode('REQUESTS')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${viewMode === 'REQUESTS' ? 'border-[#174A7E] text-[#174A7E]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <span>Relocation Requisitions</span>
          {assetRequisitions.filter(r => r.status === 'Pending Approval').length > 0 ? (
            <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-xs font-bold animate-pulse">
              {assetRequisitions.filter(r => r.status === 'Pending Approval').length} Pending
            </span>
          ) : (
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{assetRequisitions.length}</span>
          )}
        </button>
        <button
          onClick={() => setViewMode('REPORT')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${viewMode === 'REPORT' ? 'border-[#174A7E] text-[#174A7E]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Site-Wise Depreciation Report
        </button>
      </div>

      {/* Filter and Create Controls for LIST view */}
      {viewMode === 'LIST' && (
        <div className="space-y-4 print:hidden">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-56 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Asset, Code, Serial..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#174A7E]"
                />
              </div>

              {/* Project Filter */}
              <div className="relative">
                <select
                  value={projectFilter}
                  onChange={e => setProjectFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:border-[#174A7E] max-w-[200px] truncate"
                  title="Filter by Project"
                >
                  <option value="ALL">All Projects</option>
                  {uniqueProjects.map(proj => (
                    <option key={proj} value={proj}>{proj}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:border-[#174A7E] max-w-[190px] truncate"
                  title="Filter by Specific Location"
                >
                  <option value="ALL">All Site Locations</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-700 focus:outline-hidden text-xs py-1 cursor-pointer"
                >
                  <option value="PROJECT">Project & Site Location</option>
                  <option value="LOCATION">Site Location (A-Z)</option>
                  <option value="CODE">Asset Code (A-Z)</option>
                  <option value="NAME">Asset Name</option>
                  <option value="VALUE_DESC">Net Book Value (High-Low)</option>
                  <option value="STATUS">Operating Status</option>
                </select>
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {['ALL', 'Heavy Construction Equipment', 'Vehicles & Transport', 'Power & Utility'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      categoryFilter === cat
                        ? 'bg-white text-[#174A7E] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Categories' : cat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Toggle & Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewLayout('GROUPED_PROJECT')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewLayout === 'GROUPED_PROJECT'
                      ? 'bg-white text-[#174A7E] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Group equipment by Project and Location"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>By Project & Site</span>
                </button>
                <button
                  onClick={() => setViewLayout('GRID')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewLayout === 'GRID'
                      ? 'bg-white text-[#174A7E] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Flat Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All Cards</span>
                </button>
              </div>

              <button
                onClick={() => onOpenDocPrint("FAMS_REGISTER", assets)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Printer className="w-4 h-4" /> Register
              </button>
              <button
                onClick={() => onOpenDocPrint("FAMS_DEPRECIATION", assets)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <TrendingDown className="w-4 h-4" /> Depreciation
              </button>
              <button
                onClick={() => setShowNewAssetModal(true)}
                className="px-4 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Register Asset
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(projectFilter !== 'ALL' || locationFilter !== 'ALL' || categoryFilter !== 'ALL' || searchQuery) && (
            <div className="flex items-center gap-2 text-xs flex-wrap bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
              <span className="font-bold text-slate-600">Active Filters:</span>
              {projectFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-800 font-semibold shadow-2xs">
                  <Building2 className="w-3 h-3 text-[#174A7E]" />
                  <span>Project: {projectFilter}</span>
                  <button onClick={() => setProjectFilter('ALL')} className="text-slate-400 hover:text-slate-700 ml-1">✕</button>
                </span>
              )}
              {locationFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-800 font-semibold shadow-2xs">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>Location: {locationFilter}</span>
                  <button onClick={() => setLocationFilter('ALL')} className="text-slate-400 hover:text-slate-700 ml-1">✕</button>
                </span>
              )}
              {categoryFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-800 font-semibold shadow-2xs">
                  <span>Category: {categoryFilter}</span>
                  <button onClick={() => setCategoryFilter('ALL')} className="text-slate-400 hover:text-slate-700 ml-1">✕</button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-800 font-semibold shadow-2xs">
                  <span>Query: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-700 ml-1">✕</button>
                </span>
              )}
              <button
                onClick={() => {
                  setProjectFilter('ALL');
                  setLocationFilter('ALL');
                  setCategoryFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-600 font-bold hover:underline ml-auto"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {viewMode === 'LIST' && (
        <>
          {filteredAssets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No matching assets found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try adjusting your project, site location, or search keywords to view registered fixed assets.
              </p>
            </div>
          ) : viewLayout === 'GROUPED_PROJECT' || sortBy === 'PROJECT' ? (
            /* ================= GROUPED BY PROJECT & LOCATION VIEW ================= */
            <div className="space-y-6">
              {projectLocationGroups.map(group => (
                <div key={group.groupKey} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
                  {/* Group Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="p-1.5 bg-[#174A7E]/10 text-[#174A7E] rounded-lg">
                          <Building2 className="w-4 h-4" />
                        </span>
                        <h3 className="font-bold text-base text-slate-900">{group.projectName}</h3>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>{group.location}</span>
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>Site Custodian: <strong>{group.custodianName}</strong> {group.custodianPhone ? `(${group.custodianPhone})` : ''}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total NBV at Site</span>
                        <span className="text-sm font-mono font-bold text-emerald-700">৳{group.totalNBV.toLocaleString()}</span>
                      </div>
                      <span className="px-3 py-1 bg-sky-50 text-[#174A7E] font-bold text-xs rounded-xl border border-sky-200 flex items-center gap-1.5 shadow-2xs">
                        <HardHat className="w-3.5 h-3.5" />
                        <span>{group.assets.length} {group.assets.length === 1 ? 'Asset Stationed' : 'Assets Stationed'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Asset Cards Grid for this group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {group.assets.map(asset => {
                      const nextMaint = asset.maintenanceSchedule?.[asset.maintenanceSchedule.length - 1];
                      return (
                        <div
                          key={asset.id}
                          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#174A7E] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-mono text-xs font-bold text-[#174A7E] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                                {asset.assetCode}
                              </span>
                              <StatusBadge status={asset.status} size="sm" />
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{asset.name}</h4>
                            <p className="text-xs text-slate-500 font-mono line-clamp-1">
                              {asset.makeModel} • S/N: {asset.serialChassisNo}
                            </p>

                            {/* Project & Location Box */}
                            <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-[10px] uppercase font-bold">Assigned Location</span>
                                <span className="text-slate-600 font-mono font-semibold text-[11px]">{asset.operationalHours || 0} hrs</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-bold text-slate-800 line-clamp-1">
                                <Building2 className="w-3.5 h-3.5 text-[#174A7E] shrink-0" />
                                <span>{asset.projectName}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-600 font-medium line-clamp-1 text-[11px]">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span>{asset.currentLocation}</span>
                              </div>
                              <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                                <span>Custodian: <strong>{asset.custodianName}</strong></span>
                                {asset.custodianPhone && <span className="text-slate-400 font-mono text-[10px]">{asset.custodianPhone}</span>}
                              </div>
                            </div>

                            {/* Financials & Depreciation */}
                            <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-50/70 p-2.5 rounded-xl">
                              <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Buying Date:</span>
                                <span className="font-mono font-semibold text-blue-900">{asset.buyingDate || asset.capitalizationDate}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Net Book Value:</span>
                                <span className="font-mono font-bold text-emerald-700">৳{(asset.currentNetBookValue || 0).toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Purchase Cost:</span>
                                <span className="font-mono text-slate-800">৳{(asset.purchaseCost || 0).toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Useful Life:</span>
                                <span className="font-mono text-slate-800">{asset.usefulLifeYears} Years</span>
                              </div>
                            </div>

                            {/* Maintenance Due Alert */}
                            {nextMaint && (
                              <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                                <span className="text-[11px]">Next Service: <strong>{nextMaint.nextServiceDueDate}</strong></span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                                  Scheduled
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                            <div className="flex gap-1.5 flex-wrap">
                              <button
                                onClick={() => {
                                  setEditingAssetData(asset);
                                  setEditAssetName(asset.name);
                                  setEditAssetProject(asset.projectId || '');
                                  setEditAssetLocation(asset.currentLocation);
                                  setEditAssetCustodian(asset.custodianName);
                                  setEditAssetCustodianPhone(asset.custodianPhone);
                                  setEditAssetStatus(asset.status);
                                  setEditAssetHours(asset.operationalHours || 0);
                                  setShowEditAssetModal(true);
                                }}
                                className="px-2.5 py-1.5 bg-[#174A7E]/10 hover:bg-[#174A7E] text-[#174A7E] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                                title="Update Asset Location & Details"
                              >
                                <Sliders className="w-3 h-3" /> Update
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAsset(asset);
                                  setShowMaintenanceModal(true);
                                }}
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200 transition-colors flex items-center gap-1"
                              >
                                <Wrench className="w-3 h-3" /> Service
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAsset(asset);
                                  setShowReallocateModal(true);
                                }}
                                className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#174A7E] rounded-lg text-xs font-bold border border-sky-200 transition-colors"
                              >
                                Reallocate
                              </button>
                            </div>

                            <div className="flex gap-1">
                              {asset.status !== 'Retired' && asset.status !== 'Disposed' && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to retire asset ${asset.assetCode}?`)) {
                                      updateAssetStatus(asset.id, 'Retired');
                                    }
                                  }}
                                  className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold border border-rose-200 transition-colors"
                                >
                                  Retire
                                </button>
                              )}
                              <button
                                onClick={() => setQrModalData({
                                  isOpen: true,
                                  title: `FAMS Asset Tag: ${asset.name}`,
                                  codeValue: asset.qrCodeTag || `TCCL-FAMS|${asset.assetCode}|${asset.serialChassisNo}|${asset.projectName}`,
                                  meta: [
                                    { label: 'Asset Code', value: asset.assetCode },
                                    { label: 'Equipment Name', value: asset.name },
                                    { label: 'Serial/Chassis', value: asset.serialChassisNo },
                                    { label: 'Deployed Site', value: asset.projectName },
                                    { label: 'Location', value: asset.currentLocation },
                                    { label: 'Current NBV', value: `BDT ${(asset.currentNetBookValue || 0).toLocaleString()}` },
                                    { label: 'Custodian', value: asset.custodianName }
                                  ]
                                })}
                                className="p-1.5 text-slate-500 hover:text-[#174A7E] hover:bg-sky-50 rounded-lg transition-colors"
                                title="Digital Asset Tag QR"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onOpenDocPrint('ASSET', asset)}
                                className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 border border-slate-200"
                                title="Print Fixed Asset Registration & Verification Report"
                              >
                                <Printer className="w-3.5 h-3.5" /> Report
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ================= FLAT GRID VIEW ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAssets.map(asset => {
                const nextMaint = asset.maintenanceSchedule?.[asset.maintenanceSchedule.length - 1];

                return (
                  <div
                    key={asset.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#174A7E] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs font-bold text-[#174A7E] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                          {asset.assetCode}
                        </span>
                        <StatusBadge status={asset.status} size="sm" />
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{asset.name}</h3>
                      <p className="text-xs text-slate-500 font-mono line-clamp-1">
                        {asset.makeModel} • S/N: {asset.serialChassisNo}
                      </p>

                      {/* Project Allocation Pill */}
                      <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Deployed Project & Site</span>
                          <span className="text-slate-600 font-mono font-semibold text-[11px]">{asset.operationalHours || 0} hrs</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 line-clamp-1">
                          <Building2 className="w-3.5 h-3.5 text-[#174A7E] shrink-0" />
                          <span>{asset.projectName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium line-clamp-1 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{asset.currentLocation}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                          <span>Custodian: <strong>{asset.custodianName}</strong></span>
                          {asset.custodianPhone && <span className="text-slate-400 font-mono text-[10px]">{asset.custodianPhone}</span>}
                        </div>
                      </div>

                      {/* Depreciation Financials */}
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-50/70 p-2.5 rounded-xl">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Buying Date:</span>
                          <span className="font-mono font-semibold text-blue-900">{asset.buyingDate || asset.capitalizationDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Net Book Value:</span>
                          <span className="font-mono font-bold text-emerald-700">৳{(asset.currentNetBookValue || 0).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Purchase Cost:</span>
                          <span className="font-mono text-slate-800">৳{(asset.purchaseCost || 0).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Useful Life:</span>
                          <span className="font-mono text-slate-800">{asset.usefulLifeYears} Years</span>
                        </div>
                      </div>

                      {/* Maintenance Due Alert */}
                      {nextMaint && (
                        <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                          <span className="text-[11px]">Next Service: <strong>{nextMaint.nextServiceDueDate}</strong></span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                            Scheduled
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      <div className="flex gap-1.5 flex-wrap">
                        <button
                          onClick={() => {
                            setEditingAssetData(asset);
                            setEditAssetName(asset.name);
                            setEditAssetProject(asset.projectId || '');
                            setEditAssetLocation(asset.currentLocation);
                            setEditAssetCustodian(asset.custodianName);
                            setEditAssetCustodianPhone(asset.custodianPhone);
                            setEditAssetStatus(asset.status);
                            setEditAssetHours(asset.operationalHours || 0);
                            setShowEditAssetModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-[#174A7E]/10 hover:bg-[#174A7E] text-[#174A7E] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                          title="Update Asset Location & Details"
                        >
                          <Sliders className="w-3 h-3" /> Update
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowMaintenanceModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200 transition-colors flex items-center gap-1"
                        >
                          <Wrench className="w-3 h-3" /> Service
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowReallocateModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#174A7E] rounded-lg text-xs font-bold border border-sky-200 transition-colors"
                        >
                          Reallocate
                        </button>
                      </div>

                      <div className="flex gap-1">
                        {asset.status !== 'Retired' && asset.status !== 'Disposed' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to retire asset ${asset.assetCode}?`)) {
                                updateAssetStatus(asset.id, 'Retired');
                              }
                            }}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold border border-rose-200 transition-colors"
                          >
                            Retire
                          </button>
                        )}
                        <button
                          onClick={() => setQrModalData({
                            isOpen: true,
                            title: `FAMS Asset Tag: ${asset.name}`,
                            codeValue: asset.qrCodeTag || `TCCL-FAMS|${asset.assetCode}|${asset.serialChassisNo}|${asset.projectName}`,
                            meta: [
                              { label: 'Asset Code', value: asset.assetCode },
                              { label: 'Equipment Name', value: asset.name },
                              { label: 'Serial/Chassis', value: asset.serialChassisNo },
                              { label: 'Deployed Site', value: asset.projectName },
                              { label: 'Location', value: asset.currentLocation },
                              { label: 'Current NBV', value: `BDT ${(asset.currentNetBookValue || 0).toLocaleString()}` },
                              { label: 'Custodian', value: asset.custodianName }
                            ]
                          })}
                          className="p-1.5 text-slate-500 hover:text-[#174A7E] hover:bg-sky-50 rounded-lg transition-colors"
                          title="Digital Asset Tag QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenDocPrint('ASSET', asset)}
                          className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 border border-slate-200"
                          title="Print Fixed Asset Registration & Verification Report"
                        >
                          <Printer className="w-3.5 h-3.5" /> Report
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ======================= VIEW: RELOCATION REQUESTS & APPROVALS ======================= */}
      {viewMode === 'REQUESTS' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Requisition #, Project, Asset..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#174A7E]"
                />
              </div>

              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {(['ALL', 'Pending Approval', 'Approved', 'Rejected'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setReqStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      reqStatusFilter === st
                        ? 'bg-white text-[#174A7E] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'ALL' ? 'All Requests' : st}
                    <span className="ml-1.5 text-[10px] opacity-75 font-normal">
                      ({st === 'ALL' ? assetRequisitions.length : assetRequisitions.filter(r => r.status === st).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Showing {assetRequisitions
                .filter(r => reqStatusFilter === 'ALL' || r.status === reqStatusFilter)
                .filter(r => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    r.requisitionNo.toLowerCase().includes(q) ||
                    r.assetName.toLowerCase().includes(q) ||
                    r.assetCode.toLowerCase().includes(q) ||
                    r.targetProjectName.toLowerCase().includes(q) ||
                    r.sourceLocation.toLowerCase().includes(q)
                  );
                }).length} relocation requests
            </div>
          </div>

          {/* Requisitions List */}
          <div className="space-y-4">
            {assetRequisitions
              .filter(r => reqStatusFilter === 'ALL' || r.status === reqStatusFilter)
              .filter(r => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return (
                  r.requisitionNo.toLowerCase().includes(q) ||
                  r.assetName.toLowerCase().includes(q) ||
                  r.assetCode.toLowerCase().includes(q) ||
                  r.targetProjectName.toLowerCase().includes(q) ||
                  r.sourceLocation.toLowerCase().includes(q)
                );
              }).length > 0 ? (
              assetRequisitions
                .filter(r => reqStatusFilter === 'ALL' || r.status === reqStatusFilter)
                .filter(r => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    r.requisitionNo.toLowerCase().includes(q) ||
                    r.assetName.toLowerCase().includes(q) ||
                    r.assetCode.toLowerCase().includes(q) ||
                    r.targetProjectName.toLowerCase().includes(q) ||
                    r.sourceLocation.toLowerCase().includes(q)
                  );
                })
                .map(req => {
                  const mtvRecord = req.mtvNumber ? mtvs.find(m => m.mtvNumber === req.mtvNumber) : null;
                  return (
                    <div
                      key={req.id}
                      className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                        req.status === 'Pending Approval'
                          ? 'border-amber-300 ring-2 ring-amber-400/20'
                          : req.status === 'Approved'
                          ? 'border-emerald-200'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${
                            req.status === 'Pending Approval'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-[#174A7E]">{req.requisitionNo}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                req.status === 'Pending Approval'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : req.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {req.status === 'Pending Approval' ? 'Awaiting Central Approval' : req.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Submitted on {req.date} by <span className="font-semibold text-slate-700">{req.requestedBy}</span> ({req.requestedByRole})
                            </div>
                          </div>
                        </div>

                        {/* Action buttons in header */}
                        <div className="flex items-center gap-2">
                          {req.status === 'Pending Approval' && (
                            <>
                              <button
                                onClick={() => {
                                  setRejectionModalReq(req);
                                  setRejectionRemarksInput('Equipment currently engaged in scheduled maintenance overhaul.');
                                }}
                                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Reject</span>
                              </button>
                              <button
                                onClick={() => {
                                  setApprovalModalReq(req);
                                  setApprovalRemarksInput('Approved by Central FAMS for site mobilization.');
                                }}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Approve & Relocate Asset</span>
                              </button>
                            </>
                          )}

                          {req.status === 'Approved' && (
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <span className="text-[11px] text-slate-500 block">Voucher Generated</span>
                                <span className="font-mono font-bold text-xs text-emerald-700">{req.mtvNumber}</span>
                              </div>
                              {mtvRecord && (
                                <button
                                  onClick={() => onOpenDocPrint('MTV', mtvRecord)}
                                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>View MTV</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content details grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                        {/* Equipment Info */}
                        <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Equipment Details</span>
                          <div className="font-bold text-slate-900 text-sm">{req.assetName}</div>
                          <div className="text-slate-600 font-mono text-xs">{req.assetCode}</div>
                          <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                            Model: <span className="font-medium text-slate-700">{req.makeModel}</span>
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            Chassis/Serial: <span className="font-mono text-slate-700">{req.serialChassisNo}</span>
                          </div>
                        </div>

                        {/* Route Info */}
                        <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Relocation Route</span>
                          <div className="space-y-1">
                            <div className="text-slate-500 text-[11px]">From (Source):</div>
                            <div className="font-semibold text-slate-800">{req.sourceLocation}</div>
                            <div className="text-[11px] text-slate-500 font-medium">({req.sourceProjectName})</div>
                          </div>
                          <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                            <div className="text-slate-500 text-[11px]">To Destination Site:</div>
                            <div className="font-bold text-[#174A7E]">{req.targetProjectName}</div>
                            <div className="text-slate-700 font-medium">{req.targetLocation}</div>
                          </div>
                        </div>

                        {/* Custodian & Justification */}
                        <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 border border-slate-100 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Receiving Site Custodian</span>
                            <div className="font-bold text-slate-900 mt-1">{req.targetCustodianName}</div>
                            <div className="text-slate-500 text-[11px]">{req.targetCustodianPhone}</div>
                            <div className="mt-2 text-[11px] text-slate-600">
                              Required Date: <span className="font-bold text-slate-800">{req.requiredDate}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Justification</span>
                            <p className="text-slate-700 italic text-[11px] mt-0.5 bg-white p-2 rounded-lg border border-slate-200/80">
                              "{req.justification}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Approval History if resolved */}
                      {req.approvalRemarks && (
                        <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                          req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'bg-rose-50 text-rose-900 border border-rose-200'
                        }`}>
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <div>
                            <span className="font-bold">{req.status} by {req.approvedBy} on {req.approvalDate}:</span>{' '}
                            <span>{req.approvalRemarks}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Requisitions Found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  There are no fixed asset relocation requisitions matching the selected filter.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= VIEW: DEPRECIATION REPORT ======================= */}
      {viewMode === 'REPORT' && (
        <div id="site-wise-depreciation-report" className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center print:hidden">
            <h3 className="font-bold text-slate-800 text-sm">Site-Wise Asset Depreciation Report</h3>
            <button
              onClick={() => setShowPdfConfirm(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#174A7E] text-white text-xs font-bold rounded-lg hover:bg-[#174A7E]/90 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Generate PDF Report
            </button>
          </div>
          
          
          <div className="hidden print:block mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 text-center uppercase tracking-wider">Fixed Asset Depreciation Report</h1>
            <p className="text-center text-slate-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/50 text-slate-500 uppercase print:bg-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">Asset Details (Code & Name)</th>
                  <th className="px-4 py-3 font-bold">Useful Life</th>
                  <th className="px-4 py-3 font-bold text-right">Capitalized Cost</th>
                  <th className="px-4 py-3 font-bold text-right">Accumulated Dep.</th>
                  <th className="px-4 py-3 font-bold text-right">Net Book Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteWiseData.map((row, idx) => (
                  <React.Fragment key={idx}>
                    {/* Site Header Row */}
                    <tr className="bg-slate-50 print:bg-slate-100">
                      <td colSpan={2} className="px-4 py-3 font-bold text-[#174A7E] print:text-black">
                        {row.location} <span className="text-slate-500 font-normal ml-2">({row.assetCount} assets)</span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 text-right">৳{row.capCost.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono font-bold text-amber-800 text-right">৳{row.accumDep.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-800 text-right">৳{row.nbv.toLocaleString()}</td>
                    </tr>
                    
                    {/* Asset Rows */}
                    {row.assets.map(asset => (
                      <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2 pl-8">
                          <div className="font-mono font-bold text-slate-700">{asset.assetCode}</div>
                          <div className="text-slate-500 text-[11px] truncate w-64" title={asset.name}>{asset.name}</div>
                        </td>
                        <td className="px-4 py-2 text-slate-600">{asset.usefulLifeYears} Yrs</td>
                        <td className="px-4 py-2 font-mono text-slate-600 text-right">৳{asset.purchaseCost.toLocaleString()}</td>
                        <td className="px-4 py-2 font-mono text-amber-600/80 text-right">৳{(asset.purchaseCost - asset.currentNetBookValue).toLocaleString()}</td>
                        <td className="px-4 py-2 font-mono font-medium text-emerald-700 text-right">৳{asset.currentNetBookValue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold print:bg-slate-200">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-slate-900 text-sm uppercase">GRAND TOTAL ({assets.length} ASSETS)</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-900">৳{totalCapCost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-800">৳{totalDepreciation.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-800">৳{totalNBV.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ======================= MODAL: NEW ASSET ======================= */}
      {showNewAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Register Fixed Plant & Equipment (FAMS)</h3>
              </div>
              <button onClick={() => setShowNewAssetModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateAssetSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={assetName}
                    onChange={e => setAssetName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={assetCategory}
                    onChange={e => setAssetCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Heavy Construction Equipment">Heavy Construction Equipment</option>
                    <option value="Vehicles & Transport">Vehicles & Transport</option>
                    <option value="Power & Utility">Power & Utility</option>
                    <option value="Engineering & Survey Tools">Engineering & Survey Tools</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Make & Model *</label>
                  <input
                    type="text"
                    required
                    value={assetMakeModel}
                    onChange={e => setAssetMakeModel(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Buying Date *</label>
                  <input
                    type="date"
                    required
                    value={assetBuyingDate}
                    onChange={e => setAssetBuyingDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Serial / Chassis Number *</label>
                  <input
                    type="text"
                    required
                    value={assetSerial}
                    onChange={e => setAssetSerial(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Purchase Cost (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={assetCost}
                    onChange={e => setAssetCost(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Useful Life (Years) *</label>
                  <input
                    type="number"
                    required
                    value={assetUsefulLife}
                    onChange={e => setAssetUsefulLife(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deployed Project *</label>
                  <select
                    value={assetProject}
                    onChange={e => {
                      const newProjId = e.target.value;
                      setAssetProject(newProjId);
                      const sel = projects.find(p => p.id === newProjId);
                      if (sel && sel.location) {
                        setAssetLocation(sel.location);
                      }
                    }}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Site Deployment Location / Yard *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={assetLocation}
                      onChange={e => setAssetLocation(e.target.value)}
                      placeholder="e.g. Airport to Qutubkhali, Dhaka"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                    />
                    <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Directly syncs with location filter & project fleet view</span>
                </div>



                <div>
                  <label className="font-bold text-slate-700 block mb-1">Designated Custodian / Operator *</label>
                  <input
                    type="text"
                    required
                    value={assetCustodian}
                    onChange={e => setAssetCustodian(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custodian Mobile *</label>
                  <input
                    type="text"
                    required
                    value={assetCustodianPhone}
                    onChange={e => setAssetCustodianPhone(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewAssetModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl font-bold shadow-md"
                >
                  Capitalize & Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: LOG MAINTENANCE ======================= */}
      {showMaintenanceModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Preventative Maintenance</h3>
                <p className="text-xs text-slate-500">{selectedAsset.name} ({selectedAsset.assetCode})</p>
              </div>
              <button onClick={() => setShowMaintenanceModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddMaintenance} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Type / Work Executed *</label>
                <input
                  type="text"
                  required
                  value={maintType}
                  onChange={e => setMaintType(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Authorized Vendor / Workshop *</label>
                <input
                  type="text"
                  required
                  value={maintVendor}
                  onChange={e => setMaintVendor(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Maintenance Cost (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={maintCost}
                    onChange={e => setMaintCost(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Next Service Due *</label>
                  <input
                    type="date"
                    required
                    value={maintNextDue}
                    onChange={e => setMaintNextDue(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowMaintenanceModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md"
                >
                  Log Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: REALLOCATE ASSET ======================= */}
      {showReallocateModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Reallocate Machine to Project</h3>
                <p className="text-xs text-slate-500">{selectedAsset.name} ({selectedAsset.assetCode})</p>
              </div>
              <button onClick={() => setShowReallocateModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleReallocateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transfer Type *</label>
                  <select
                    value={reallocType}
                    onChange={e => setReallocType(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Site to Site">Site to Site</option>
                    <option value="Office to Site">Office to Site</option>
                    <option value="Site to Office">Site to Office</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Origin (From Site/Office) *</label>
                  <input
                    type="text"
                    required
                    value={reallocFromLocation || selectedAsset.currentLocation}
                    onChange={e => setReallocFromLocation(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                    placeholder="Origin yard or depot"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Destination Project *</label>
                <select
                  value={reallocProject}
                  onChange={e => {
                    const newProjId = e.target.value;
                    setReallocProject(newProjId);
                    const sel = projects.find(p => p.id === newProjId);
                    if (sel && sel.location) {
                      setReallocTargetLocation(sel.location);
                    }
                  }}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination Site Location / Yard *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={reallocTargetLocation}
                    onChange={e => setReallocTargetLocation(e.target.value)}
                    placeholder="e.g. Patenga Container Terminal, Chattogram"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                  <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Syncs with project site inventory & central location filter</span>
              </div>



              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Custodian *</label>
                  <input
                    type="text"
                    required
                    value={reallocCustodian}
                    onChange={e => setReallocCustodian(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custodian Mobile *</label>
                  <input
                    type="text"
                    required
                    value={reallocPhone}
                    onChange={e => setReallocPhone(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowReallocateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl font-bold shadow-md"
                >
                  Transfer & Reallocate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal for Fixed Assets */}
      <QRCodeModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData({ ...qrModalData, isOpen: false })}
        title={qrModalData.title}
        codeValue={qrModalData.codeValue}
        meta={qrModalData.meta}
      />

      {/* PDF Download Confirmation Modal */}
      {showPdfConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Download PDF Report?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Would you like to generate and download the Site-Wise Depreciation Report in PDF format?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowPdfConfirm(false)}
                disabled={isGeneratingPdf}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="px-4 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Yes, Download</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ======================= MODAL: CONFIRM ASSET RELOCATION APPROVAL ======================= */}
      {approvalModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 my-auto">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 mb-4">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Approve Asset Relocation</h3>
                <p className="text-xs text-slate-500">Requisition #{approvalModalReq.requisitionNo}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Asset to Relocate:</span>
                  <span className="font-bold text-slate-900">{approvalModalReq.assetName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Asset Code:</span>
                  <span className="font-mono font-bold text-blue-700">{approvalModalReq.assetCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Current Site:</span>
                  <span className="font-medium text-slate-800">{approvalModalReq.sourceLocation}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/80 pt-2">
                  <span className="text-slate-500 font-semibold">Destination Project:</span>
                  <span className="font-bold text-[#174A7E]">{approvalModalReq.targetProjectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Destination Yard:</span>
                  <span className="font-medium text-slate-800">{approvalModalReq.targetLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Receiving Custodian:</span>
                  <span className="font-medium text-slate-800">{approvalModalReq.targetCustodianName} ({approvalModalReq.targetCustodianPhone})</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Approval Comments / Dispatch Instructions *</label>
                <textarea
                  value={approvalRemarksInput}
                  onChange={e => setApprovalRemarksInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden h-20"
                  placeholder="e.g. Authorized for site mobilization. Driver assigned with escort."
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Confirming this approval will generate an official <strong>Material Transfer Voucher (MTV)</strong> and relocate the asset to <strong>{approvalModalReq.targetProjectName}</strong>. The project's fixed asset list will be updated immediately.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovalModalReq(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    approveAssetRequisition(approvalModalReq.id, approvalRemarksInput);
                    setFamsToast({
                      type: 'success',
                      message: `Equipment ${approvalModalReq.assetName} [${approvalModalReq.assetCode}] successfully relocated to ${approvalModalReq.targetProjectName}! Material Transfer Voucher generated.`
                    });
                    setApprovalModalReq(null);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Relocation & Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: REJECT ASSET REQUISITION ======================= */}
      {rejectionModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 my-auto">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 mb-4">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Decline Asset Requisition</h3>
                <p className="text-xs text-slate-500">Requisition #{rejectionModalReq.requisitionNo}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Please provide the reason for declining the relocation of <strong>{rejectionModalReq.assetName}</strong> to <strong>{rejectionModalReq.targetProjectName}</strong>:
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rejection Reason *</label>
                <textarea
                  value={rejectionRemarksInput}
                  onChange={e => setRejectionRemarksInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden h-20"
                  placeholder="Specify why the item cannot be mobilized..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalReq(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    rejectAssetRequisition(rejectionModalReq.id, rejectionRemarksInput);
                    setFamsToast({
                      type: 'info',
                      message: `Requisition ${rejectionModalReq.requisitionNo} declined.`
                    });
                    setRejectionModalReq(null);
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: EDIT ASSET DETAILS & LOCATION ======================= */}
      {showEditAssetModal && editingAssetData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#174A7E]/10 text-[#174A7E] rounded-xl">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Update Asset Info & Site Location</h3>
                  <p className="text-xs text-slate-500">{editingAssetData.assetCode} • {editingAssetData.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditAssetModal(false);
                  setEditingAssetData(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const matchedProj = projects.find(p => p.id === editAssetProject);
                updateAsset(editingAssetData.id, {
                  name: editAssetName,
                  projectId: editAssetProject,
                  projectName: matchedProj ? matchedProj.name : editingAssetData.projectName,
                  currentLocation: editAssetLocation,
                  custodianName: editAssetCustodian,
                  custodianPhone: editAssetCustodianPhone,
                  status: editAssetStatus,
                  operationalHours: Number(editAssetHours)
                });
                setFamsToast({
                  type: 'success',
                  message: `Asset ${editingAssetData.assetCode} successfully updated! Central register and site location synchronized.`
                });
                setShowEditAssetModal(false);
                setEditingAssetData(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={editAssetName}
                  onChange={e => setEditAssetName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Project *</label>
                  <select
                    value={editAssetProject}
                    onChange={e => setEditAssetProject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                  >
                    <option value="">-- Unallocated / Central Depot --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Site Location / Yard Section *</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={editAssetLocation}
                      onChange={e => setEditAssetLocation(e.target.value)}
                      placeholder="e.g. Mawa Site Batching Plant Yard"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Site Custodian / In-Charge *</label>
                  <input
                    type="text"
                    required
                    value={editAssetCustodian}
                    onChange={e => setEditAssetCustodian(e.target.value)}
                    placeholder="e.g. Engr. Tanvir Ahmed"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custodian Mobile Phone</label>
                  <input
                    type="text"
                    value={editAssetCustodianPhone}
                    onChange={e => setEditAssetCustodianPhone(e.target.value)}
                    placeholder="e.g. +880 1711-223344"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Operational Status *</label>
                  <select
                    value={editAssetStatus}
                    onChange={e => setEditAssetStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                  >
                    <option value="Active / Deployed">Active / Deployed</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Idle / In Store">Idle / In Store (Standby)</option>
                    <option value="Site-Deployed">Site-Deployed</option>
                    <option value="Due for Verification">Due for Verification</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Running / Operational Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={editAssetHours}
                    onChange={e => setEditAssetHours(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#174A7E] shrink-0 mt-0.5" />
                <span>
                  Updating this record updates the Central Fixed Asset Management Register and keeps the Project module synchronized. All reports, sorting, and location summaries will immediately reflect these changes.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAssetModal(false);
                    setEditingAssetData(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Sync</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
