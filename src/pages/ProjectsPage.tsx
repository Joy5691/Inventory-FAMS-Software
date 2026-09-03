import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, MapPin, Calendar, CheckCircle2, ChevronRight, FileText, ShoppingCart, ArrowLeft, Plus, Download, Truck, Archive, Wrench, Trash2, X, Printer, Upload, Eye, Check, ShieldCheck, FileCheck, AlertCircle, Sliders, Search } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

interface ProjectsPageProps {
  onOpenDocPrint?: (type: string, data: any) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenDocPrint }) => {
  const { projects, mrs, prs, grns, mivs, mtvs, stocks, addProject, items, createMR, postGRN, createGRN, approveMR, currentUser, activeRole, assets, assetRequisitions, requestAssetRelocation, approveAssetRelocation, reallocateAsset, updateAsset, addMaintenanceLog } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'requisitions' | 'receipts' | 'inventory' | 'transfers' | 'assets'>('requisitions');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showAssetRequisitionModal, setShowAssetRequisitionModal] = useState(false);
  const [assetReqSubTab, setAssetReqSubTab] = useState<'deployed' | 'requisitions'>('deployed');
  const [selectedAvailableAssetId, setSelectedAvailableAssetId] = useState<string>('');
  const [assetReqTargetLocation, setAssetReqTargetLocation] = useState<string>('');
  const [assetReqCustodianName, setAssetReqCustodianName] = useState<string>('');
  const [assetReqCustodianPhone, setAssetReqCustodianPhone] = useState<string>('');
  const [assetReqRequiredDate, setAssetReqRequiredDate] = useState<string>('');
  const [assetReqJustification, setAssetReqJustification] = useState<string>('');
  const [assetReqSearch, setAssetReqSearch] = useState<string>('');
  const [assetReqCategoryFilter, setAssetReqCategoryFilter] = useState<string>('ALL');
  const [assetReqDirectDeploy, setAssetReqDirectDeploy] = useState<boolean>(true);
  const [siteAssetSearch, setSiteAssetSearch] = useState<string>('');
  const [siteAssetLocationFilter, setSiteAssetLocationFilter] = useState<string>('ALL');
  const [assetToast, setAssetToast] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // State for updating site asset
  const [editingSiteAsset, setEditingSiteAsset] = useState<any | null>(null);
  const [editSiteLocation, setEditSiteLocation] = useState<string>('');
  const [editSiteCustodian, setEditSiteCustodian] = useState<string>('');
  const [editSitePhone, setEditSitePhone] = useState<string>('');
  const [editSiteStatus, setEditSiteStatus] = useState<any>('Active / Deployed');
  const [editSiteHours, setEditSiteHours] = useState<number>(0);
  const [editSiteRemarks, setEditSiteRemarks] = useState<string>('');

  // State for site asset maintenance
  const [maintSiteAsset, setMaintSiteAsset] = useState<any | null>(null);
  const [maintSiteServiceType, setMaintSiteServiceType] = useState<string>('Site Routine Servicing & Filter Replacement');
  const [maintSiteVendor, setMaintSiteVendor] = useState<string>('Project Site Mechanical Team');
  const [maintSiteCost, setMaintSiteCost] = useState<number>(15000);
  const [maintSiteNextDue, setMaintSiteNextDue] = useState<string>('');

  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanTargetGRN, setChallanTargetGRN] = useState<any>(null);
  const [isDirectGRN, setIsDirectGRN] = useState(false);
  const [directVendorName, setDirectVendorName] = useState('Central Store (Internal Stock Issue)');
  const [directItems, setDirectItems] = useState<any[]>([]);
  const [challanData, setChallanData] = useState({ 
    receivedDate: new Date().toISOString().split('T')[0], 
    approvedDate: new Date().toISOString().split('T')[0], 
    challanNo: '',
    challanFileName: 'Signed_Delivery_Challan.pdf',
    vehicleNo: 'Dhaka Metro-TA-14-3829 (10-Ton)',
    driverName: 'Abdul Karim',
    driverPhone: '+880 1712-334455',
    inspectorName: 'Engr. Tanvir Ahmed (Site In-charge)',
    inspectionRemarks: 'Materials physically verified, count and quality checked against delivery challan.',
    inspectedItems: [] as { itemId: string; acceptedQty: number; rejectedQty: number; remarks: string }[]
  });
  const [viewingChallanDoc, setViewingChallanDoc] = useState<any>(null);
  const [grnSuccessToast, setGrnSuccessToast] = useState<string | null>(null);


  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const [newProject, setNewProject] = useState({
    code: "", name: "", client: "", location: "", manager: "",
    budget: 0, startDate: "", endDate: "", status: "Planning" as any
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  
  const [showNewMRModal, setShowNewMRModal] = useState(false);
  const [mrLocation, setMrLocation] = useState('Airport-Kuril Section, Dhaka');
  const [mrDepartment, setMrDepartment] = useState('Civil Construction');
  const [mrWBS, setMrWBS] = useState('Pier Substructure (WBS-01)');
  const [mrCostCode, setMrCostCode] = useState('MAT-STL-002 (Rebar 500W)');
  const [mrDueDate, setMrDueDate] = useState('2026-09-15');
  const [mrPriority, setMrPriority] = useState<any>('High');
  const [mrItems, setMrItems] = useState<any[]>([]);

  const openNewMRModal = () => {
    if (!selectedProject) return;
    setMrLocation(selectedProject.location || 'Site Location');
    setMrDepartment('Civil Construction');
    setMrWBS('Substructure Works (WBS-01)');
    setMrCostCode('MAT-CIV-001');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    setMrDueDate(futureDate.toISOString().substring(0, 10));
    setMrPriority('High');

    const firstItem = (items && items.length > 0) ? items[0] : {
      id: 'itm-1',
      name: 'Portland Cement (OPC Grade 53)',
      specification: '50 Kg Bag',
      unit: 'Bags',
      unitPriceEstimate: 575
    };

    setMrItems([{
      itemId: firstItem.id,
      itemDescription: firstItem.name,
      specification: firstItem.specification || '50 Kg Bag',
      unit: firstItem.unit || 'Bags',
      quantity: 500,
      estimatedUnitPrice: firstItem.unitPriceEstimate || 575,
      ledger: 'Substructure Concreting'
    }]);
    setShowNewMRModal(true);
  };

  const handleAddItemRow = () => {
    const nextItem = (items && items.length > 0) 
      ? (items[mrItems.length % items.length] || items[0])
      : {
        id: `itm-${Date.now()}`,
        name: 'Deformed Steel Rebar 500W',
        specification: 'Grade 500W',
        unit: 'MT',
        unitPriceEstimate: 96500
      };

    setMrItems(prev => [
      ...prev,
      {
        itemId: nextItem.id,
        itemDescription: nextItem.name,
        specification: nextItem.specification || 'Standard Spec',
        unit: nextItem.unit || 'Nos',
        quantity: 10,
        estimatedUnitPrice: nextItem.unitPriceEstimate || 1000,
        ledger: 'Reinforcement Steel Cage'
      }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (mrItems.length > 1) {
      setMrItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleItemSelect = (index: number, selectedItemId: string) => {
    const selected = items.find((it: any) => it.id === selectedItemId);
    if (!selected) return;
    setMrItems(prev => prev.map((row, i) => i === index ? {
      ...row,
      itemId: selected.id,
      itemDescription: selected.name,
      specification: selected.specification || row.specification,
      unit: selected.unit || row.unit,
      estimatedUnitPrice: selected.unitPriceEstimate || row.estimatedUnitPrice
    } : row));
  };

  const handleCreateMRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    if (mrItems.length === 0) {
      alert("Please add at least one line item.");
      return;
    }

    createMR({
      date: new Date().toISOString().substring(0, 10),
      dueDate: mrDueDate,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      location: mrLocation,
      department: mrDepartment,
      wbsCode: mrWBS,
      costCode: mrCostCode,
      purchaseType: 'Goods / Materials',
      priority: mrPriority,
      items: mrItems.map((it, idx) => ({
        id: `mr-itm-${Date.now()}-${idx}`,
        itemId: it.itemId,
        itemDescription: it.itemDescription,
        specification: it.specification || '',
        unit: it.unit || 'Nos',
        quantity: Number(it.quantity) || 1,
        classification: 'Raw Material',
        estimatedUnitPrice: Number(it.estimatedUnitPrice) || 0,
        ledger: it.ledger || 'General Construction'
      })),
      initiatedBy: currentUser?.name || 'Site Project Engineer',
      initiatedByRole: activeRole,
      status: 'Pending Verification'
    });
    setShowNewMRModal(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(val);
  };

  const openUploadChallanForGRN = (grn: any) => {
    setChallanTargetGRN(grn);
    setIsDirectGRN(false);
    const defaultItems = grn.items?.map((it: any) => ({
      itemId: it.itemId || `itm-${it.slNo}`,
      acceptedQty: it.acceptedQty > 0 ? it.acceptedQty : (it.orderedQty || it.quantity || 1),
      rejectedQty: it.rejectedQty || 0,
      remarks: 'Inspected and verified against physical stock & challan'
    })) || [];

    setChallanData({
      receivedDate: grn.date || new Date().toISOString().split('T')[0],
      approvedDate: new Date().toISOString().split('T')[0],
      challanNo: grn.supplierChallanNo && !grn.supplierChallanNo.startsWith('Auto-') 
        ? grn.supplierChallanNo 
        : `CH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      challanFileName: grn.supplierChallanNo?.endsWith('.pdf') ? grn.supplierChallanNo : 'Signed_Delivery_Challan.pdf',
      vehicleNo: grn.vehicleNo && grn.vehicleNo !== 'N/A' && grn.vehicleNo !== 'TBD' ? grn.vehicleNo : 'Dhaka Metro-TA-14-3829 (10-Ton)',
      driverName: grn.driverName && grn.driverName !== 'N/A' && grn.driverName !== 'TBD' ? grn.driverName : 'Abdul Karim',
      driverPhone: grn.driverPhone && grn.driverPhone !== 'N/A' && grn.driverPhone !== 'TBD' ? grn.driverPhone : '+880 1712-334455',
      inspectorName: currentUser?.name || 'Engr. Tanvir Ahmed (Site In-charge)',
      inspectionRemarks: 'Materials physically verified, count and quality checked against delivery challan.',
      inspectedItems: defaultItems
    });
    setShowChallanModal(true);
  };

  const openNewDeliveryChallanModal = () => {
    if (!selectedProject) return;
    setChallanTargetGRN(null);
    setIsDirectGRN(true);
    setDirectVendorName('Central Store (Internal Transfer)');
    const defaultItem = items && items.length > 0 ? items[0] : {
      id: 'itm-1',
      name: 'Portland Cement (OPC Grade 53)',
      specification: '50 Kg Bag',
      unit: 'Bags'
    };
    setDirectItems([{
      itemId: defaultItem.id,
      itemDescription: defaultItem.name,
      specification: defaultItem.specification || '50 Kg Bag',
      unit: defaultItem.unit || 'Bags',
      quantity: 150,
      acceptedQty: 150,
      rejectedQty: 0
    }]);
    setChallanData({
      receivedDate: new Date().toISOString().split('T')[0],
      approvedDate: new Date().toISOString().split('T')[0],
      challanNo: `CH-SITE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      challanFileName: 'Site_Signed_Delivery_Challan.pdf',
      vehicleNo: 'Dhaka Metro-TA-11-9042',
      driverName: 'Rafiqul Islam',
      driverPhone: '+880 1819-223344',
      inspectorName: currentUser?.name || 'Site Quality Engineer',
      inspectionRemarks: 'Direct site delivery received and physically inspected.',
      inspectedItems: []
    });
    setShowChallanModal(true);
  };

  const handleChallanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    if (isDirectGRN) {
      const siteStore = `${selectedProject.name} Site Store`;
      const created = createGRN({
        date: challanData.receivedDate,
        poId: 'direct-site-delivery',
        poNumber: 'Site Material Receipt',
        vendorName: directVendorName,
        supplierChallanNo: challanData.challanNo || challanData.challanFileName || 'CH-DIRECT-DELIVERY',
        vehicleNo: challanData.vehicleNo,
        driverName: challanData.driverName,
        driverPhone: challanData.driverPhone,
        receivingStore: siteStore,
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        inspectedBy: challanData.inspectorName,
        storeOfficer: currentUser?.name || 'Site Store Controller',
        status: 'Draft' as any,
        items: directItems.map((it, idx) => ({
          slNo: idx + 1,
          itemId: it.itemId,
          itemCode: it.itemCode || `MAT-${it.itemDescription.substring(0, 3).toUpperCase()}-NEW`,
          itemDescription: it.itemDescription,
          specification: it.specification,
          unit: it.unit,
          orderedQty: Number(it.quantity) || 1,
          receivedQty: Number(it.quantity) || 1,
          acceptedQty: Number(it.acceptedQty !== undefined ? it.acceptedQty : it.quantity) || 1,
          rejectedQty: Number(it.rejectedQty) || 0,
          damagedQty: 0,
          inspectionResult: 'Passed',
          remarks: 'Inspected against site challan'
        }))
      });

      postGRN(created.id, {
        receivedDate: challanData.receivedDate,
        approvedDate: challanData.approvedDate,
        challanNo: challanData.challanNo,
        challanFileName: challanData.challanFileName,
        vehicleNo: challanData.vehicleNo,
        driverName: challanData.driverName,
        driverPhone: challanData.driverPhone,
        remarks: challanData.inspectionRemarks,
        inspectedItems: directItems.map(it => ({
          itemId: it.itemId,
          acceptedQty: Number(it.acceptedQty !== undefined ? it.acceptedQty : it.quantity) || 1,
          rejectedQty: Number(it.rejectedQty) || 0
        }))
      });
    } else if (challanTargetGRN) {
      postGRN(challanTargetGRN.id, {
        receivedDate: challanData.receivedDate,
        approvedDate: challanData.approvedDate,
        challanNo: challanData.challanNo,
        challanFileName: challanData.challanFileName,
        vehicleNo: challanData.vehicleNo,
        driverName: challanData.driverName,
        driverPhone: challanData.driverPhone,
        remarks: challanData.inspectionRemarks,
        inspectedItems: challanData.inspectedItems
      });
    }

    setShowChallanModal(false);
    setActiveTab('inventory');
    setGrnSuccessToast(`Material Received & Challan Approved! Stock has been credited to ${selectedProject.name} Site Store and whole company inventory is updated.`);
  };

  if (!selectedProjectId || !selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Projects Portfolio</h2>
            <p className="text-sm text-slate-500">Manage all ongoing and completed projects.</p>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            Create Project
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between min-h-[160px] animate-pulse">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-6 bg-slate-200 rounded-md"></div>
                    <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-slate-100 rounded mt-2"></div>
                    <div className="w-1/2 h-3 bg-slate-100 rounded"></div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="w-24 h-3 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((proj, idx) => {
              const bgColors = ['#e0f2fe', '#dcfce7', '#f3e8ff', '#fef3c7', '#fee2e2', '#ede9fe'];
              const overlayColors = ['#38bdf8', '#4ade80', '#c084fc', '#fcd34d', '#f87171', '#a78bfa'];
              const bgColor = bgColors[idx % bgColors.length];
              const overlayColor = overlayColors[idx % overlayColors.length];

              return (
                <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className="eslam-card min-h-[160px]"
                style={{ '--card-bg': bgColor, '--card-overlay': overlayColor } as React.CSSProperties}
              >
                <div className="eslam-content p-5 flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Building2 className="w-16 h-16 text-slate-900" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold text-slate-700 bg-white/60 px-2 py-1 rounded-md border border-white/40 shadow-xs">
                        {proj.code}
                      </span>
                      <StatusBadge status={proj.status} />
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug pr-8">{proj.name}</h4>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="line-clamp-1">{proj.location}</span>
                        </div>
                        {proj.client && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="line-clamp-1">{proj.client}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-900/10 flex items-center text-xs font-semibold text-slate-700">
                    View Workspace <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> Register New Project
                </h3>
                <button onClick={() => setShowNewProjectModal(false)} className="text-slate-400 hover:text-slate-600">
                  <Archive className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Project Code</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.code} onChange={e => setNewProject({...newProject, code: e.target.value})} placeholder="e.g. TCCL-PRJ-01" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Project Name</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="Project Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Client Name</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})} placeholder="Client Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Location</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} placeholder="Location" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Project Manager</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.manager} onChange={e => setNewProject({...newProject, manager: e.target.value})} placeholder="Manager Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Total Budget (BDT)</label>
                    <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.budget || ""} onChange={e => setNewProject({...newProject, budget: Number(e.target.value)})} placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Start Date</label>
                    <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.startDate} onChange={e => setNewProject({...newProject, startDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">End Date</label>
                    <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newProject.endDate} onChange={e => setNewProject({...newProject, endDate: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setShowNewProjectModal(false)} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors text-sm">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    addProject({
                      code: newProject.code, name: newProject.name, client: newProject.client,
                      location: newProject.location, manager: newProject.manager, budget: newProject.budget,
                      committedBudget: 0, spentBudget: 0, startDate: newProject.startDate, endDate: newProject.endDate,
                      status: newProject.status, workPackages: [], costCodes: []
                    });
                    setShowNewProjectModal(false);
                    setNewProject({ code: "", name: "", client: "", location: "", manager: "", budget: 0, startDate: "", endDate: "", status: "Planning" as any });
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Detail View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedProjectId(null)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{selectedProject.name}</h2>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {selectedProject.code}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedProject.location}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={selectedProject.status} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Project Financials</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Total Budget</p>
            <p className="text-xl font-mono font-bold text-slate-900">{formatCurrency(selectedProject.budget)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Committed Budget</p>
            <p className="text-xl font-mono font-bold text-orange-600">{formatCurrency(selectedProject.committedBudget)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Spent Budget</p>
            <p className="text-xl font-mono font-bold text-red-600">{formatCurrency(selectedProject.spentBudget)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          {[
            { id: 'requisitions', label: 'Material Requisitions', icon: FileText },
            { id: 'receipts', label: 'Goods Receipts (GRN)', icon: ShoppingCart },
            { id: 'inventory', label: 'Project Inventory', icon: Archive },
            { id: 'transfers', label: 'Receipts & Transfers', icon: Truck },
            { id: 'assets', label: 'Fixed Assets', icon: Wrench },
          ].map(tab => {
            const pendingGrns = tab.id === 'receipts' ? grns.filter(g => g.projectId === selectedProjectId && g.status !== 'Inspected & Posted').length : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4" /> 
                <span>{tab.label}</span>
                {pendingGrns > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    {pendingGrns} Pending
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="p-6">
          {grnSuccessToast && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">Material Receipt & Challan Approved!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">{grnSuccessToast}</p>
                </div>
              </div>
              <button 
                onClick={() => setGrnSuccessToast(null)}
                className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-100/60 text-xs font-bold transition-colors"
                title="Dismiss message"
              >
                ✕
              </button>
            </div>
          )}

          {activeTab === 'requisitions' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Material Requisitions</h3>
              <button 
                onClick={openNewMRModal}
                className="px-4 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-lg text-sm font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Requisition
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600">MR No</th>
                    <th className="p-3 font-bold text-slate-600">Date</th>
                    <th className="p-3 font-bold text-slate-600">Items</th>
                    <th className="p-3 font-bold text-slate-600">Est. Total</th>
                    <th className="p-3 font-bold text-slate-600">Priority</th>
                    <th className="p-3 font-bold text-slate-600">Status</th>
                    <th className="p-3 font-bold text-slate-600 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mrs.filter(mr => mr.projectId === selectedProjectId).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        No requisitions found. Click "Create Requisition" above to create one.
                      </td>
                    </tr>
                  ) : (
                    mrs.filter(mr => mr.projectId === selectedProjectId).map(mr => {
                      const totalEst = mr.items?.reduce((sum: number, it: any) => sum + (it.quantity * (it.estimatedUnitPrice || 0)), 0) || 0;
                      return (
                        <tr key={mr.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-mono text-blue-600 font-bold">{mr.mrNumber}</td>
                          <td className="p-3">{mr.date}</td>
                          <td className="p-3">{mr.items?.length || 0} items</td>
                          <td className="p-3 font-mono font-bold text-slate-800">{formatCurrency(totalEst)}</td>
                          <td className="p-3">
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                              mr.priority === 'Critical' || mr.priority === 'Emergency' ? 'bg-red-100 text-red-700' :
                              mr.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {mr.priority || 'Normal'}
                            </span>
                          </td>
                          <td className="p-3"><StatusBadge status={mr.status} /></td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {mr.status !== 'Approved' && mr.status !== 'Rejected' && (
                                <button
                                  onClick={() => {
                                    approveMR(mr.id);
                                    setActiveTab('receipts');
                                  }}
                                  className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg inline-flex items-center gap-1 transition-colors shadow-xs"
                                  title="Audit available stock in Central Store & route to Site GRN / PR"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Route Stock
                                </button>
                              )}
                              {onOpenDocPrint && (
                                <button
                                  onClick={() => onOpenDocPrint('MR', mr)}
                                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg inline-flex items-center gap-1 transition-colors"
                                  title="Print / View Requisition"
                                >
                                  <Printer className="w-3.5 h-3.5" /> View
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
          )}

          {activeTab === 'receipts' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    Goods Received Notes & Site Delivery Challans
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Materials transferred from Central Store or suppliers arrive here. Upload signed challans and complete inspection to post into site inventory.
                  </p>
                </div>
                <button
                  onClick={openNewDeliveryChallanModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4" /> Receive Material / Upload Challan
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 font-bold text-slate-600">GRN No</th>
                      <th className="p-3 font-bold text-slate-600">Date</th>
                      <th className="p-3 font-bold text-slate-600">Source / Supplier</th>
                      <th className="p-3 font-bold text-slate-600">Challan / Transport</th>
                      <th className="p-3 font-bold text-slate-600">Received Items</th>
                      <th className="p-3 font-bold text-slate-600">Status</th>
                      <th className="p-3 font-bold text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grns.filter(g => g.projectId === selectedProjectId).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-slate-500">
                          <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-bold text-slate-700">No goods receipts registered for this project yet.</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                            Approve an MR above to automatically dispatch available stock from Central Store, or click "Receive Material / Upload Challan" to log a direct site receipt.
                          </p>
                          <button
                            onClick={openNewDeliveryChallanModal}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" /> Upload Delivery Challan Now
                          </button>
                        </td>
                      </tr>
                    ) : (
                      grns.filter(g => g.projectId === selectedProjectId).map(g => (
                        <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-blue-600 font-bold whitespace-nowrap">
                            {g.grnNumber}
                            <div className="text-[10px] text-slate-400 font-sans font-normal">{g.poNumber || 'Site Transfer'}</div>
                          </td>
                          <td className="p-3 whitespace-nowrap">{g.date}</td>
                          <td className="p-3">
                            <span className="font-bold text-slate-800">{g.vendorName || (g as any).supplierName || 'Central Store'}</span>
                            <div className="text-[11px] text-slate-500">{g.receivingStore}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-xs font-mono font-semibold text-slate-700 flex items-center gap-1">
                              <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                              {g.supplierChallanNo || 'Pending Challan'}
                            </div>
                            {g.vehicleNo && g.vehicleNo !== 'N/A' && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Truck className="w-3 h-3" /> {g.vehicleNo}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col gap-1.5">
                              {g.items?.map((it, idx) => (
                                <div key={idx} className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-1 rounded whitespace-nowrap">
                                  <span className="font-bold text-slate-800">{it.itemDescription}</span>
                                  <span className="text-blue-600 ml-1 font-mono text-[10px]">[{it.itemCode || it.itemId || `MAT-${it.itemDescription.substring(0,3).toUpperCase()}-00${it.slNo}`}]</span>
                                  <span className="text-emerald-700 ml-1.5 font-bold font-mono">
                                    {g.status === 'Inspected & Posted' ? `${it.acceptedQty} ${it.unit} (Accepted)` : `${it.orderedQty || (it as any).quantity} ${it.unit}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap"><StatusBadge status={g.status} /></td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {g.status !== 'Inspected & Posted' ? (
                                <button
                                  onClick={() => openUploadChallanForGRN(g)}
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 whitespace-nowrap"
                                  title="Receive material or upload challan for approve"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Receive Material / Upload Challan for Approve
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setViewingChallanDoc(g)}
                                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 inline-flex items-center gap-1"
                                    title="View Delivery Challan & Inspection Record"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> View Challan
                                  </button>
                                  {onOpenDocPrint && (
                                    <button
                                      onClick={() => onOpenDocPrint('GRN', g)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1"
                                      title="Print GRN Ledger"
                                    >
                                      <Printer className="w-3.5 h-3.5" /> Print
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {(() => {
                const projectStocks = stocks.filter(s => 
                  s.projectId === selectedProjectId || 
                  (selectedProject && s.storeName.toLowerCase().includes(selectedProject.name.toLowerCase())) ||
                  (selectedProject && s.storeName.toLowerCase().includes(selectedProject.code.toLowerCase()))
                );
                const totalUnits = projectStocks.reduce((sum, s) => sum + (s.availableQty || 0), 0);

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Project Site Store</p>
                        <p className="text-base font-bold text-slate-800 mt-0.5">{selectedProject.name} Site Store</p>
                      </div>
                      <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl">
                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Tracked Material SKUs</p>
                        <p className="text-2xl font-mono font-bold text-blue-900 mt-0.5">{projectStocks.length}</p>
                      </div>
                      <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl">
                        <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Total Available Units</p>
                        <p className="text-2xl font-mono font-bold text-emerald-900 mt-0.5">{totalUnits.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-3 font-bold text-slate-600">Item Code</th>
                            <th className="p-3 font-bold text-slate-600">Item Description</th>
                            <th className="p-3 font-bold text-slate-600">Store / Bin Location</th>
                            <th className="p-3 font-bold text-slate-600 text-right">Available Qty</th>
                            <th className="p-3 font-bold text-slate-600">Last Movement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectStocks.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-10 text-center text-slate-500">
                                <Archive className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                <p className="font-bold text-slate-700">No inventory stocked for this project yet.</p>
                                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                                  Once goods receipts (GRNs) are inspected and challans accepted, stocks automatically increment in this site ledger.
                                </p>
                                <button
                                  onClick={() => setActiveTab('receipts')}
                                  className="mt-3 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                                >
                                  Go to Receipts & Challans
                                </button>
                              </td>
                            </tr>
                          ) : (
                            projectStocks.map((s, idx) => (
                              <tr key={`${s.itemId}-${s.storeName}-${idx}`} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="p-3 font-mono font-bold text-blue-600">{s.itemCode}</td>
                                <td className="p-3">
                                  <div className="font-bold text-slate-800">{s.itemName}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">BIN: {s.binCardNumber || `BIN-0${idx+1}`}</div>
                                </td>
                                <td className="p-3 text-slate-600">{s.storeName}</td>
                                <td className="p-3 text-right">
                                  <span className="font-mono font-bold text-base text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg inline-block">
                                    {s.availableQty} {s.unit}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-500 text-xs font-mono">{s.lastUpdated || new Date().toISOString().substring(0, 10)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === 'transfers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600">MTV No</th>
                    <th className="p-3 font-bold text-slate-600">Date</th>
                    <th className="p-3 font-bold text-slate-600">From</th>
                    <th className="p-3 font-bold text-slate-600">To</th>
                    <th className="p-3 font-bold text-slate-600">Items</th>
                    <th className="p-3 font-bold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mtvs.filter(m => m.projectId === selectedProjectId).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        <Truck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        No material transfers found.
                      </td>
                    </tr>
                  ) : (
                    mtvs.filter(m => m.projectId === selectedProjectId).map(m => (
                      <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-blue-600 font-bold">{m.mtvNumber}</td>
                        <td className="p-3">{m.date}</td>
                        <td className="p-3 font-bold text-slate-700">{m.fromStore}</td>
                        <td className="p-3 font-bold text-slate-700">{m.toStore}</td>
                        <td className="p-3">{m.items?.length || 0} items</td>
                        <td className="p-3"><StatusBadge status={m.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'assets' && (
            <div className="space-y-4 p-4">
              {/* Asset Notification Toast */}
              {assetToast && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{assetToast.message}</span>
                  </div>
                  <button onClick={() => setAssetToast(null)} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold ml-4">✕</button>
                </div>
              )}

              {/* Sub-navigation and Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAssetReqSubTab('deployed')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      assetReqSubTab === 'deployed'
                        ? 'bg-[#174A7E] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Deployed Equipment</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${assetReqSubTab === 'deployed' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {assets.filter(a => a.projectId === selectedProjectId).length}
                    </span>
                  </button>

                  <button
                    onClick={() => setAssetReqSubTab('requisitions')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      assetReqSubTab === 'requisitions'
                        ? 'bg-[#174A7E] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Asset Requisitions</span>
                    {assetRequisitions.filter(r => r.targetProjectId === selectedProjectId && r.status === 'Pending Approval').length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${assetReqSubTab === 'requisitions' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {assetRequisitions.filter(r => r.targetProjectId === selectedProjectId).length}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    const available = assets.filter(a => a.projectId !== selectedProjectId);
                    setSelectedAvailableAssetId(available[0]?.id || '');
                    setAssetReqTargetLocation(selectedProject?.location || 'Project Site Yard');
                    setAssetReqCustodianName(selectedProject?.manager || currentUser?.name || 'Site In-Charge');
                    setAssetReqCustodianPhone(currentUser?.phone || '+880 1711-224466');
                    const futureDate = new Date();
                    futureDate.setDate(futureDate.getDate() + 3);
                    setAssetReqRequiredDate(futureDate.toISOString().substring(0, 10));
                    setAssetReqJustification('Required for upcoming construction mobilization and heavy erection work packages.');
                    setAssetReqSearch('');
                    setAssetReqCategoryFilter('ALL');
                    setShowAssetRequisitionModal(true);
                  }}
                  className="px-4 py-2.5 bg-[#174A7E] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#123a63] transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Request Fixed Asset from Fleet</span>
                </button>
              </div>

              {/* VIEW 1: Deployed Fixed Assets */}
              {assetReqSubTab === 'deployed' && (() => {
                const projectDeployedAssets = assets.filter(a => 
                  a.projectId === selectedProjectId || 
                  a.projectName === selectedProject?.name
                );

                const projectSiteLocations = Array.from(
                  new Set(projectDeployedAssets.map(a => a.currentLocation).filter(Boolean))
                ).sort();

                const displayedProjectAssets = projectDeployedAssets.filter(asset => {
                  const matchesLoc = siteAssetLocationFilter === 'ALL' || asset.currentLocation === siteAssetLocationFilter;
                  const matchesSearch = !siteAssetSearch ||
                    asset.name.toLowerCase().includes(siteAssetSearch.toLowerCase()) ||
                    asset.assetCode.toLowerCase().includes(siteAssetSearch.toLowerCase()) ||
                    asset.currentLocation.toLowerCase().includes(siteAssetSearch.toLowerCase()) ||
                    asset.makeModel.toLowerCase().includes(siteAssetSearch.toLowerCase()) ||
                    (asset.custodianName && asset.custodianName.toLowerCase().includes(siteAssetSearch.toLowerCase()));
                  return matchesLoc && matchesSearch;
                });

                return (
                  <div className="space-y-3">
                    {/* Site Asset Search and Location Filter Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
                      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
                        <div className="relative flex-1 min-w-[180px]">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={siteAssetSearch}
                            onChange={e => setSiteAssetSearch(e.target.value)}
                            placeholder="Filter deployed equipment, code, custodian..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs focus:ring-1 focus:ring-[#174A7E] focus:outline-hidden"
                          />
                        </div>

                        <div className="relative">
                          <select
                            value={siteAssetLocationFilter}
                            onChange={e => setSiteAssetLocationFilter(e.target.value)}
                            className="pl-2.5 pr-7 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-[#174A7E] focus:outline-hidden max-w-[220px] truncate"
                          >
                            <option value="ALL">All Project Locations ({projectDeployedAssets.length})</option>
                            {projectSiteLocations.map(loc => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>

                        {(siteAssetSearch || siteAssetLocationFilter !== 'ALL') && (
                          <button
                            onClick={() => {
                              setSiteAssetSearch('');
                              setSiteAssetLocationFilter('ALL');
                            }}
                            className="text-xs text-rose-600 font-bold hover:underline px-1 py-1"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      <div className="text-[11px] font-semibold text-slate-500 shrink-0">
                        Showing <strong className="text-slate-800">{displayedProjectAssets.length}</strong> of {projectDeployedAssets.length} assets deployed
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-3.5 font-bold text-slate-600 text-xs">Asset Code</th>
                            <th className="p-3.5 font-bold text-slate-600 text-xs">Asset Name & Model</th>
                            <th className="p-3.5 font-bold text-slate-600 text-xs">Category</th>
                            <th className="p-3.5 font-bold text-slate-600 text-xs">Serial / Chassis</th>
                            <th className="p-3.5 font-bold text-slate-600 text-xs">Site Custodian</th>
                            <th className="p-3.5 font-bold text-slate-600 text-xs">Current Site Location</th>
                            <th className="p-3.5 font-bold text-slate-600 text-xs">Status</th>
                            <th className="p-3.5 font-bold text-slate-600 text-xs">Running Hours</th>
                            <th className="p-3.5 font-bold text-slate-600 text-xs">Transfer Record</th>
                            <th className="p-3.5 font-bold text-slate-600 text-xs text-right">Site Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {displayedProjectAssets.length > 0 ? (
                            displayedProjectAssets.map(asset => {
                            const latestTransfer = asset.transferHistory && asset.transferHistory.length > 0 ? asset.transferHistory[0] : null;
                            return (
                              <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-3.5 font-mono font-bold text-blue-700 text-xs">
                                  {asset.assetCode}
                                </td>
                                <td className="p-3.5">
                                  <div className="font-bold text-slate-900 text-xs">{asset.name}</div>
                                  <div className="text-[11px] text-slate-500">{asset.makeModel}</div>
                                </td>
                                <td className="p-3.5">
                                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
                                    {asset.category}
                                  </span>
                                </td>
                                <td className="p-3.5 font-mono text-xs text-slate-600">
                                  {asset.serialChassisNo}
                                </td>
                                <td className="p-3.5">
                                  <div className="font-semibold text-slate-800 text-xs">{asset.custodianName}</div>
                                  <div className="text-[11px] text-slate-500">{asset.custodianPhone}</div>
                                </td>
                                <td className="p-3.5 text-xs text-slate-700">
                                  <div className="flex items-center gap-1.5 font-medium text-slate-900">
                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span>{asset.currentLocation}</span>
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    asset.status === 'Active / Deployed'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : asset.status === 'Under Maintenance'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}>
                                    {asset.status}
                                  </span>
                                </td>
                                <td className="p-3.5 text-xs font-mono font-semibold text-slate-700">
                                  {asset.operationalHours || 0} hrs
                                </td>
                                <td className="p-3.5">
                                  {latestTransfer?.mtvNumber ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-800 rounded-md text-[10px] font-mono font-bold border border-sky-200">
                                      <Truck className="w-3 h-3 text-sky-600" />
                                      {latestTransfer.mtvNumber}
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-slate-400">Direct Assigned</span>
                                  )}
                                </td>
                                <td className="p-3.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setEditingSiteAsset(asset);
                                        setEditSiteLocation(asset.currentLocation || '');
                                        setEditSiteCustodian(asset.custodianName || '');
                                        setEditSitePhone(asset.custodianPhone || '');
                                        setEditSiteStatus(asset.status);
                                        setEditSiteHours(asset.operationalHours || 0);
                                        setEditSiteRemarks('');
                                      }}
                                      className="px-2.5 py-1.5 bg-[#174A7E]/10 hover:bg-[#174A7E] text-[#174A7E] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                                      title="Update site location, custodian, or status (syncs to Central FAMS)"
                                    >
                                      <Sliders className="w-3 h-3" /> Update Site Info
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMaintSiteAsset(asset);
                                        setMaintSiteServiceType('Site Routine Inspection & Lubrication');
                                        setMaintSiteVendor('Project Mechanical Workshop Team');
                                        setMaintSiteCost(12000);
                                        setMaintSiteNextDue(new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10));
                                      }}
                                      className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                                      title="Log Site Maintenance / Repair"
                                    >
                                      <Wrench className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={10} className="p-10 text-center">
                              <div className="max-w-md mx-auto space-y-2">
                                <div className="p-3 bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-400">
                                  <Truck className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm">No Fixed Assets Deployed at this Site</h4>
                                <p className="text-xs text-slate-500">
                                  This project currently has no heavy equipment or plant assets assigned. Click "Request Fixed Asset from Fleet" above to requisition available equipment.
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

              {/* VIEW 2: Asset Requisitions for this Project */}
              {assetReqSubTab === 'requisitions' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-3.5 font-bold text-slate-600 text-xs">Requisition #</th>
                          <th className="p-3.5 font-bold text-slate-600 text-xs">Date</th>
                          <th className="p-3.5 font-bold text-slate-600 text-xs">Requested Equipment</th>
                          <th className="p-3.5 font-bold text-slate-600 text-xs">Source Location</th>
                          <th className="p-3.5 font-bold text-slate-600 text-xs">Target Site Custodian</th>
                          <th className="p-3.5 font-bold text-slate-600 text-xs">Required Date</th>
                          <th className="p-3.5 font-bold text-slate-600 text-xs">Status</th>
                          <th className="p-3.5 font-bold text-slate-600 text-xs text-right">Approval Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {assetRequisitions.filter(r => r.targetProjectId === selectedProjectId).length > 0 ? (
                          assetRequisitions.filter(r => r.targetProjectId === selectedProjectId).map(req => (
                            <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-blue-700 text-xs">
                                {req.requisitionNo}
                              </td>
                              <td className="p-3.5 text-xs text-slate-600">{req.date}</td>
                              <td className="p-3.5">
                                <div className="font-bold text-slate-900 text-xs">{req.assetName}</div>
                                <div className="text-[11px] text-slate-500 font-mono">{req.assetCode} • {req.makeModel}</div>
                              </td>
                              <td className="p-3.5 text-xs text-slate-700">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{req.sourceLocation}</span>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <div className="font-semibold text-slate-800 text-xs">{req.targetCustodianName}</div>
                                <div className="text-[11px] text-slate-500">{req.targetCustodianPhone}</div>
                              </td>
                              <td className="p-3.5 text-xs font-semibold text-slate-700">{req.requiredDate}</td>
                              <td className="p-3.5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  req.status === 'Approved'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : req.status === 'Rejected'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {req.status === 'Pending Approval' ? 'Awaiting Central FAMS' : req.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right text-xs">
                                {req.status === 'Approved' ? (
                                  <div>
                                    <div className="font-mono text-emerald-700 font-bold text-[11px]">
                                      {req.mtvNumber}
                                    </div>
                                    <div className="text-[10px] text-slate-500">Relocated to project</div>
                                  </div>
                                ) : req.status === 'Rejected' ? (
                                  <span className="text-[11px] text-rose-600 italic">{req.approvalRemarks || 'Declined'}</span>
                                ) : (
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-amber-600 font-medium">Under Central Review</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        approveAssetRelocation(req.id, 'Approved & Mobilized by Site Coordination');
                                        setAssetToast({
                                          type: 'success',
                                          message: `Asset ${req.assetCode} (${req.assetName}) approved and mobilized to site location "${req.targetLocation}". Central FAMS & Location Filters updated!`
                                        });
                                      }}
                                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-colors shadow-xs"
                                    >
                                      Authorize & Mobilize
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-500 text-xs font-medium">
                              No asset requisitions requested for this project yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================= NEW MATERIAL REQUISITION (MR) MODAL ======================= */}
      {showNewMRModal && selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 my-auto">
            {/* Modal Header */}
            <div className="bg-[#174A7E] text-white p-5 flex justify-between items-center shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">New Material Requisition (MR)</h2>
                  <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {selectedProject.code}
                  </span>
                </div>
                <p className="text-blue-100 text-xs mt-0.5">
                  Project: <span className="font-semibold text-white">{selectedProject.name}</span>
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowNewMRModal(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Form */}
            <form onSubmit={handleCreateMRSubmit} className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-5">
              {/* Form Metadata Fields */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Site Delivery Location *</label>
                  <input 
                    type="text" 
                    value={mrLocation} 
                    onChange={e => setMrLocation(e.target.value)} 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required On Site Due Date *</label>
                  <input 
                    type="date" 
                    value={mrDueDate} 
                    onChange={e => setMrDueDate(e.target.value)} 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Level *</label>
                  <select 
                    value={mrPriority} 
                    onChange={e => setMrPriority(e.target.value as any)} 
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input 
                    type="text" 
                    value={mrDepartment} 
                    onChange={e => setMrDepartment(e.target.value)} 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WBS / Work Package</label>
                  <input 
                    type="text" 
                    value={mrWBS} 
                    onChange={e => setMrWBS(e.target.value)} 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost Code / Budget Head</label>
                  <input 
                    type="text" 
                    value={mrCostCode} 
                    onChange={e => setMrCostCode(e.target.value)} 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
              </div>

              {/* Line Items Section */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Requisition Items</h3>
                    <p className="text-[11px] text-slate-500">Add materials and estimated quantities required for this project</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddItemRow} 
                    className="px-3 py-1.5 bg-[#174A7E] text-white rounded-lg text-xs font-bold hover:bg-[#123a63] flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item Line
                  </button>
                </div>
                
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-3 min-w-[200px]">Item Description</th>
                        <th className="p-3 min-w-[140px]">Specification</th>
                        <th className="p-3 w-20">Unit</th>
                        <th className="p-3 w-28">Quantity</th>
                        <th className="p-3 w-28">Est. Rate (BDT)</th>
                        <th className="p-3 w-28 text-right">Subtotal</th>
                        <th className="p-3 w-12 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mrItems.map((row, index) => {
                        const lineSubtotal = (Number(row.quantity) || 0) * (Number(row.estimatedUnitPrice) || 0);
                        return (
                          <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-2.5">
                              <select 
                                value={row.itemId} 
                                onChange={e => handleItemSelect(index, e.target.value)} 
                                className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              >
                                {items.map((it: any) => (
                                  <option key={it.id} value={it.id}>
                                    {it.name} [{it.itemCode || it.id}]
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2.5">
                              <input 
                                type="text" 
                                value={row.specification} 
                                onChange={e => {
                                  const val = e.target.value;
                                  setMrItems(prev => prev.map((r, i) => i === index ? { ...r, specification: val } : r));
                                }} 
                                placeholder="Specification"
                                className="w-full border border-slate-300 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                              />
                            </td>
                            <td className="p-2.5">
                              <input 
                                type="text" 
                                value={row.unit} 
                                onChange={e => {
                                  const val = e.target.value;
                                  setMrItems(prev => prev.map((r, i) => i === index ? { ...r, unit: val } : r));
                                }} 
                                className="w-full border border-slate-300 rounded-lg p-1.5 text-xs text-center font-bold bg-slate-50" 
                              />
                            </td>
                            <td className="p-2.5">
                              <input 
                                type="number" 
                                value={row.quantity} 
                                onChange={e => {
                                  const val = e.target.value;
                                  setMrItems(prev => prev.map((r, i) => i === index ? { ...r, quantity: val === '' ? '' : Number(val) } : r));
                                }} 
                                className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono font-bold text-slate-800 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                min="1" 
                                required 
                              />
                            </td>
                            <td className="p-2.5">
                              <input 
                                type="number" 
                                value={row.estimatedUnitPrice} 
                                onChange={e => {
                                  const val = e.target.value;
                                  setMrItems(prev => prev.map((r, i) => i === index ? { ...r, estimatedUnitPrice: val === '' ? '' : Number(val) } : r));
                                }} 
                                className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono text-slate-800 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                min="0" 
                                required 
                              />
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-800">
                              {formatCurrency(lineSubtotal)}
                            </td>
                            <td className="p-2.5 text-center">
                              <button 
                                type="button" 
                                onClick={() => handleRemoveItemRow(index)} 
                                disabled={mrItems.length === 1} 
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Remove Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-xs">
                      <tr>
                        <td colSpan={5} className="p-3 text-right text-slate-600">
                          Total Estimated Value:
                        </td>
                        <td className="p-3 text-right font-mono text-sm text-[#174A7E] font-black">
                          {formatCurrency(mrItems.reduce((sum, it) => sum + ((Number(it.quantity) || 0) * (Number(it.estimatedUnitPrice) || 0)), 0))}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Form Footer Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setShowNewMRModal(false)} 
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSET REQUISITION MODAL */}
      {showAssetRequisitionModal && selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto border border-slate-200">
            <div className="bg-gradient-to-r from-[#174A7E] to-[#0f3054] p-5 text-white flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">Request Fixed Asset / Heavy Equipment</h2>
                <p className="text-blue-100 text-xs mt-0.5">
                  Requisition from available items for: <span className="font-semibold text-white">{selectedProject.name}</span>
                </p>
              </div>
              <button
                onClick={() => setShowAssetRequisitionModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors text-lg"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const chosen = assets.find(a => a.id === selectedAvailableAssetId);
              if (!chosen) {
                alert('Please select an available asset to request.');
                return;
              }

              const targetLoc = assetReqTargetLocation.trim() || selectedProject.location || 'Project Site Yard';

              if (assetReqDirectDeploy) {
                reallocateAsset(
                  chosen.id,
                  selectedProject.id,
                  selectedProject.name,
                  targetLoc,
                  assetReqCustodianName,
                  assetReqCustodianPhone,
                  'Site to Site',
                  chosen.currentLocation
                );

                setAssetToast({
                  type: 'success',
                  message: `Fixed asset ${chosen.assetCode} (${chosen.name}) deployed immediately to ${selectedProject.name} at "${targetLoc}"! Central FAMS register updated.`
                });
                setShowAssetRequisitionModal(false);
                setAssetReqSubTab('deployed');
              } else {
                const newReq = requestAssetRelocation({
                  date: new Date().toISOString().substring(0, 10),
                  assetId: chosen.id,
                  assetCode: chosen.assetCode,
                  assetName: chosen.name,
                  category: chosen.category,
                  makeModel: chosen.makeModel,
                  serialChassisNo: chosen.serialChassisNo,
                  sourceProjectId: chosen.projectId,
                  sourceProjectName: chosen.projectName,
                  sourceLocation: chosen.currentLocation,
                  targetProjectId: selectedProject.id,
                  targetProjectName: selectedProject.name,
                  targetLocation: targetLoc,
                  requestedBy: currentUser?.name || 'Site Project Engineer',
                  requestedByRole: activeRole || 'Site Engineer',
                  requiredDate: assetReqRequiredDate,
                  justification: assetReqJustification,
                  targetCustodianName: assetReqCustodianName,
                  targetCustodianPhone: assetReqCustodianPhone
                });

                setShowAssetRequisitionModal(false);
                setAssetReqSubTab('requisitions');
                setAssetToast({
                  type: 'success',
                  message: `Requisition ${newReq.requisitionNo} submitted to Central Fixed Asset Module for verification & approval.`
                });
              }
            }}>
              <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                {/* Step 1: Select Available Asset */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      1. Select Available Item from Fleet / Depots *
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {assets.filter(a => a.projectId !== selectedProjectId).length} items available outside this site
                    </span>
                  </div>

                  {/* Search and category filter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Search asset name, code, model..."
                      value={assetReqSearch}
                      onChange={e => setAssetReqSearch(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                    />
                    <select
                      value={assetReqCategoryFilter}
                      onChange={e => setAssetReqCategoryFilter(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                    >
                      <option value="ALL">All Equipment Categories</option>
                      <option value="Heavy Earthmoving">Heavy Earthmoving</option>
                      <option value="Lifting & Cranes">Lifting & Cranes</option>
                      <option value="Concrete & Mixing">Concrete & Mixing</option>
                      <option value="Survey & Testing">Survey & Testing</option>
                      <option value="Power & Generator">Power & Generator</option>
                      <option value="Site Vehicle">Site Vehicle</option>
                    </select>
                  </div>

                  {/* Available assets list selector */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100 bg-slate-50">
                    {assets
                      .filter(a => a.projectId !== selectedProjectId)
                      .filter(a => assetReqCategoryFilter === 'ALL' || a.category === assetReqCategoryFilter)
                      .filter(a => {
                        if (!assetReqSearch) return true;
                        const q = assetReqSearch.toLowerCase();
                        return (
                          a.name.toLowerCase().includes(q) ||
                          a.assetCode.toLowerCase().includes(q) ||
                          a.makeModel.toLowerCase().includes(q) ||
                          a.currentLocation.toLowerCase().includes(q)
                        );
                      })
                      .map(a => {
                        const isSelected = selectedAvailableAssetId === a.id;
                        return (
                          <div
                            key={a.id}
                            onClick={() => setSelectedAvailableAssetId(a.id)}
                            className={`p-3 cursor-pointer transition-all flex items-center justify-between text-xs ${
                              isSelected
                                ? 'bg-blue-50/90 border-l-4 border-[#174A7E]'
                                : 'hover:bg-white bg-transparent'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-blue-700">{a.assetCode}</span>
                                <span className="font-bold text-slate-800">{a.name}</span>
                                <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-semibold">
                                  {a.category}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-3">
                                <span>Model: {a.makeModel}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {a.currentLocation}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                a.status === 'Active / Deployed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {a.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Selected Asset Highlight Card */}
                {(() => {
                  const chosen = assets.find(a => a.id === selectedAvailableAssetId);
                  if (!chosen) return null;
                  return (
                    <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                      <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-700" />
                        <span>Selected Asset for Relocation</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Asset Code</span>
                          <span className="font-mono font-bold text-slate-800">{chosen.assetCode}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Make & Model</span>
                          <span className="font-medium text-slate-800">{chosen.makeModel}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Serial / Chassis</span>
                          <span className="font-mono text-slate-800">{chosen.serialChassisNo}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Current Location</span>
                          <span className="font-medium text-slate-800 truncate block">{chosen.currentLocation}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Step 2: Destination & Mobilization Details */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    2. Destination Site & Custodian Details
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Project</label>
                      <input
                        type="text"
                        disabled
                        value={selectedProject.name}
                        className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Site Yard / Location *</label>
                      <input
                        type="text"
                        value={assetReqTargetLocation}
                        onChange={e => setAssetReqTargetLocation(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                        placeholder="e.g. Airport Section Site Yard"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Site Custodian / Plant In-Charge *</label>
                      <input
                        type="text"
                        value={assetReqCustodianName}
                        onChange={e => setAssetReqCustodianName(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                        placeholder="Name of receiving engineer/officer"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Custodian Mobile Phone *</label>
                      <input
                        type="text"
                        value={assetReqCustodianPhone}
                        onChange={e => setAssetReqCustodianPhone(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                        placeholder="+880 1711-xxxxxx"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Required Mobilization Date *</label>
                    <input
                      type="date"
                      value={assetReqRequiredDate}
                      onChange={e => setAssetReqRequiredDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Work Justification & Purpose *</label>
                    <textarea
                      value={assetReqJustification}
                      onChange={e => setAssetReqJustification(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs h-20 focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                      placeholder="Specify work package (e.g. Girder erection, heavy excavation, site power generation)..."
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assetReqDirectDeploy}
                      onChange={e => setAssetReqDirectDeploy(e.target.checked)}
                      className="mt-0.5 rounded text-[#174A7E] focus:ring-[#174A7E] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">
                        Direct Site Mobilization & Stationing (Immediate FAMS Register Sync)
                      </span>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        Station this equipment immediately at <strong>{assetReqTargetLocation || selectedProject.location}</strong> and update its location in both the Project fleet and Central FAMS register.
                      </span>
                    </div>
                  </label>
                </div>

                {!assetReqDirectDeploy && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      This requisition will be forwarded to the <strong>Central Fixed Asset Module (FAMS)</strong> for approval. Upon Central Approval, the item will be automatically relocated to this project and listed in your Deployed Equipment.
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowAssetRequisitionModal(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#174A7E] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#123a63] transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {assetReqDirectDeploy ? 'Deploy & Station at Site Now' : 'Submit Request to Central FAMS'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE SITE ASSET MODAL */}
      {editingSiteAsset && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#174A7E] p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Sliders className="w-5 h-5 text-sky-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Update Site Asset Info & Location</h3>
                  <p className="text-blue-100 text-xs">Instantly syncs with Central Fixed Asset Management System (FAMS)</p>
                </div>
              </div>
              <button
                onClick={() => setEditingSiteAsset(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                updateAsset(editingSiteAsset.id, {
                  currentLocation: editSiteLocation,
                  custodianName: editSiteCustodian,
                  custodianPhone: editSitePhone,
                  status: editSiteStatus,
                  operationalHours: Number(editSiteHours)
                });
                setAssetToast({
                  type: 'success',
                  message: `Asset ${editingSiteAsset.assetCode} (${editingSiteAsset.name}) updated successfully! Central FAMS register & project location synchronized.`
                });
                setEditingSiteAsset(null);
              }}
              className="p-6 space-y-4 text-xs"
            >
              {/* Asset Identity Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                    {editingSiteAsset.assetCode}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {editingSiteAsset.category}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{editingSiteAsset.name}</div>
                <div className="text-slate-500 flex items-center gap-3">
                  <span>Model: <strong>{editingSiteAsset.makeModel}</strong></span>
                  <span>•</span>
                  <span>S/N: <strong>{editingSiteAsset.serialChassisNo}</strong></span>
                </div>
              </div>

              {/* Site Location Field */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Current Site Location / Yard Section *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={editSiteLocation}
                    onChange={e => setEditSiteLocation(e.target.value)}
                    required
                    placeholder="e.g. Kawla Base Yard, Pier 4 Section, Airport"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  This specific site location is directly reflected in the central asset register and location-wise asset sorting.
                </p>
              </div>

              {/* Custodian Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Site Custodian / In-charge *</label>
                  <input
                    type="text"
                    value={editSiteCustodian}
                    onChange={e => setEditSiteCustodian(e.target.value)}
                    required
                    placeholder="e.g. Engr. Tanvir Ahmed"
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custodian Contact Phone *</label>
                  <input
                    type="text"
                    value={editSitePhone}
                    onChange={e => setEditSitePhone(e.target.value)}
                    required
                    placeholder="e.g. +880 1712-334455"
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Status & Operational Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Operational Status *</label>
                  <select
                    value={editSiteStatus}
                    onChange={e => setEditSiteStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden bg-white"
                  >
                    <option value="Active / Deployed">Active / Deployed</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Idle / In Store">Idle / In Store (Standby)</option>
                    <option value="Site-Deployed">Site-Deployed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Running / Meter Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={editSiteHours}
                    onChange={e => setEditSiteHours(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Site Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Site Activity Log / Remarks</label>
                <textarea
                  value={editSiteRemarks}
                  onChange={e => setEditSiteRemarks(e.target.value)}
                  placeholder="Record current operational deployment, operator shift notes, or inspection notes..."
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs h-16 focus:ring-2 focus:ring-[#174A7E] focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Updates will immediately sync to the central Fixed Asset Management register. Anyone filtering or sorting assets by project or site will see this current location.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingSiteAsset(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save & Sync to FAMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG SITE MAINTENANCE MODAL */}
      {maintSiteAsset && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-700 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Wrench className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Record Site Maintenance / Servicing</h3>
                  <p className="text-amber-100 text-xs">Asset: {maintSiteAsset.assetCode} - {maintSiteAsset.name}</p>
                </div>
              </div>
              <button
                onClick={() => setMaintSiteAsset(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                addMaintenanceLog(maintSiteAsset.id, {
                  id: `ms-${Date.now()}`,
                  serviceType: maintSiteServiceType,
                  lastServiceDate: new Date().toISOString().substring(0, 10),
                  nextServiceDueDate: maintSiteNextDue || new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
                  cost: Number(maintSiteCost),
                  mechanicOrVendor: maintSiteVendor,
                  status: 'Completed'
                });
                updateAsset(maintSiteAsset.id, {
                  status: 'Active / Deployed'
                });
                setAssetToast({
                  type: 'success',
                  message: `Site maintenance successfully logged for ${maintSiteAsset.assetCode}. Central maintenance schedule updated.`
                });
                setMaintSiteAsset(null);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service / Repair Type *</label>
                <input
                  type="text"
                  value={maintSiteServiceType}
                  onChange={e => setMaintSiteServiceType(e.target.value)}
                  required
                  placeholder="e.g. Engine oil & fuel filter replacement, hydraulic hose fix"
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost incurred (BDT)</label>
                  <input
                    type="number"
                    min="0"
                    value={maintSiteCost}
                    onChange={e => setMaintSiteCost(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mechanic / Service Vendor *</label>
                  <input
                    type="text"
                    value={maintSiteVendor}
                    onChange={e => setMaintSiteVendor(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Next Service Due Date *</label>
                <input
                  type="date"
                  value={maintSiteNextDue}
                  onChange={e => setMaintSiteNextDue(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMaintSiteAsset(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Service Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIVE CHALLAN & INSPECTION MODAL */}
      {showChallanModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-8">
            <div className="bg-[#174A7E] p-5 text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-bold text-lg">Site Delivery Challan & Material Receipt</h2>
                </div>
                <p className="text-blue-100 text-xs mt-0.5">
                  {challanTargetGRN 
                    ? `GRN: ${challanTargetGRN.grnNumber} • ${challanTargetGRN.vendorName || 'Central Store'} → ${challanTargetGRN.receivingStore}`
                    : `Direct Site Receipt • ${selectedProject?.name} Site Store`
                  }
                </p>
              </div>
              <button onClick={() => setShowChallanModal(false)} className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleChallanSubmit} className="flex flex-col flex-1">
              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                {/* Challan & Date Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Challan / Invoice No *</label>
                    <input 
                      type="text" 
                      value={challanData.challanNo}
                      onChange={e => setChallanData({...challanData, challanNo: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono font-semibold"
                      placeholder="e.g. CH-2026-9481"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Delivery / Received Date *</label>
                    <input 
                      type="date" 
                      value={challanData.receivedDate}
                      onChange={e => setChallanData({...challanData, receivedDate: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Inspection Date *</label>
                    <input 
                      type="date" 
                      value={challanData.approvedDate}
                      onChange={e => setChallanData({...challanData, approvedDate: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Transport & Inspector Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Vehicle / Truck No</label>
                    <input 
                      type="text"
                      value={challanData.vehicleNo}
                      onChange={e => setChallanData({...challanData, vehicleNo: e.target.value})}
                      className="w-full border border-slate-300 rounded-md p-1.5 text-xs bg-white"
                      placeholder="e.g. Dhaka Metro-TA-14-3829"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Driver Name & Phone</label>
                    <input 
                      type="text"
                      value={`${challanData.driverName} (${challanData.driverPhone})`}
                      onChange={e => {
                        const parts = e.target.value.split('(');
                        setChallanData({
                          ...challanData, 
                          driverName: parts[0]?.trim() || 'Driver',
                          driverPhone: parts[1]?.replace(')', '').trim() || ''
                        });
                      }}
                      className="w-full border border-slate-300 rounded-md p-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Quality Inspector</label>
                    <input 
                      type="text"
                      value={challanData.inspectorName}
                      onChange={e => setChallanData({...challanData, inspectorName: e.target.value})}
                      className="w-full border border-slate-300 rounded-md p-1.5 text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Scanned Challan Attachment Dropzone */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">Upload Delivery Challan Document / Slip</label>
                    <button
                      type="button"
                      onClick={() => setChallanData({...challanData, challanFileName: 'Signed_Delivery_Challan_Verified.pdf'})}
                      className="text-[11px] text-blue-600 hover:underline font-semibold"
                    >
                      Attach Sample Signed Slip
                    </button>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-4 text-center hover:bg-blue-50/20 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      id="challanFile"
                      name="challanFile"
                      accept="image/*,application/pdf"
                      capture="environment"
                      className="hidden" 
                      onChange={(e) => {
                        const name = e.target.files?.[0]?.name;
                        if (name) setChallanData({...challanData, challanFileName: name});
                      }}
                    />
                    <label htmlFor="challanFile" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-slate-800 text-sm font-bold">
                        {challanData.challanFileName ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Attached: {challanData.challanFileName}
                          </span>
                        ) : (
                          "Click to select Challan PDF or photo"
                        )}
                      </div>
                      <div className="text-xs text-slate-400">Supported formats: PDF, JPG, PNG from device or camera</div>
                    </label>
                  </div>
                </div>

                {/* Physical Quality Inspection Table */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Physical Material Inspection & Accepted Quantities</label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Item Description</th>
                          <th className="p-2.5 text-center">Unit</th>
                          <th className="p-2.5 text-right">Dispatched</th>
                          <th className="p-2.5 text-right">Accepted Qty</th>
                          <th className="p-2.5 text-right">Rejected</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {isDirectGRN ? (
                          directItems.map((it, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5">
                                <span className="font-bold text-slate-800">{it.itemDescription}</span>
                                <div className="text-[10px] text-slate-400 font-mono">{it.specification}</div>
                              </td>
                              <td className="p-2.5 text-center font-mono">{it.unit}</td>
                              <td className="p-2.5 text-right font-mono font-bold text-slate-700">{it.quantity}</td>
                              <td className="p-2.5 text-right">
                                <input 
                                  type="number" 
                                  min="0"
                                  value={it.acceptedQty}
                                  onChange={e => {
                                    const val = Math.max(0, Number(e.target.value));
                                    setDirectItems(prev => prev.map((row, i) => i === idx ? { ...row, acceptedQty: val } : row));
                                  }}
                                  className="w-20 border border-slate-300 rounded p-1 text-right font-mono font-bold text-emerald-700"
                                />
                              </td>
                              <td className="p-2.5 text-right">
                                <input 
                                  type="number" 
                                  min="0"
                                  value={it.rejectedQty}
                                  onChange={e => {
                                    const val = Math.max(0, Number(e.target.value));
                                    setDirectItems(prev => prev.map((row, i) => i === idx ? { ...row, rejectedQty: val } : row));
                                  }}
                                  className="w-16 border border-slate-300 rounded p-1 text-right font-mono text-red-600"
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          challanTargetGRN?.items?.map((it: any, idx: number) => {
                            const match = challanData.inspectedItems.find(i => i.itemId === (it.itemId || `itm-${it.slNo}`));
                            const accQty = match ? match.acceptedQty : (it.acceptedQty > 0 ? it.acceptedQty : (it.orderedQty || it.quantity || 1));
                            const rejQty = match ? match.rejectedQty : (it.rejectedQty || 0);

                            return (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-2.5">
                                  <span className="font-bold text-slate-800">{it.itemDescription}</span>
                                  <div className="text-[10px] text-slate-400 font-mono">{it.itemCode || it.specification}</div>
                                </td>
                                <td className="p-2.5 text-center font-mono">{it.unit}</td>
                                <td className="p-2.5 text-right font-mono font-bold text-slate-700">{it.orderedQty || it.quantity}</td>
                                <td className="p-2.5 text-right">
                                  <input 
                                    type="number" 
                                    min="0"
                                    max={it.orderedQty || it.quantity || 99999}
                                    value={accQty}
                                    onChange={e => {
                                      const val = Math.max(0, Number(e.target.value));
                                      const itemId = it.itemId || `itm-${it.slNo}`;
                                      setChallanData(prev => {
                                        const exists = prev.inspectedItems.some(item => item.itemId === itemId);
                                        const next = exists 
                                          ? prev.inspectedItems.map(item => item.itemId === itemId ? { ...item, acceptedQty: val } : item)
                                          : [...prev.inspectedItems, { itemId, acceptedQty: val, rejectedQty: 0, remarks: 'Verified' }];
                                        return { ...prev, inspectedItems: next };
                                      });
                                    }}
                                    className="w-20 border border-slate-300 rounded p-1 text-right font-mono font-bold text-emerald-700"
                                  />
                                </td>
                                <td className="p-2.5 text-right">
                                  <input 
                                    type="number" 
                                    min="0"
                                    value={rejQty}
                                    onChange={e => {
                                      const val = Math.max(0, Number(e.target.value));
                                      const itemId = it.itemId || `itm-${it.slNo}`;
                                      setChallanData(prev => {
                                        const exists = prev.inspectedItems.some(item => item.itemId === itemId);
                                        const next = exists 
                                          ? prev.inspectedItems.map(item => item.itemId === itemId ? { ...item, rejectedQty: val } : item)
                                          : [...prev.inspectedItems, { itemId, acceptedQty: (it.orderedQty || 1) - val, rejectedQty: val, remarks: 'Rejection logged' }];
                                        return { ...prev, inspectedItems: next };
                                      });
                                    }}
                                    className="w-16 border border-slate-300 rounded p-1 text-right font-mono text-red-600"
                                  />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inspection remarks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Site Quality Inspection Remarks</label>
                  <input 
                    type="text" 
                    value={challanData.inspectionRemarks}
                    onChange={e => setChallanData({...challanData, inspectionRemarks: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    placeholder="e.g. Verified against mill test certificates, no transit damages observed."
                  />
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center gap-3">
                <div className="text-xs text-slate-500">
                  Clicking <b>Okay</b> will approve the delivery challan, credit accepted stock to <b>{selectedProject?.name} Site Store</b>, and update whole company inventory.
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowChallanModal(false)}
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Okay - Approve & Update Inventory
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW CHALLAN DOCUMENT MODAL */}
      {viewingChallanDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col border border-slate-200">
            <div className="bg-[#174A7E] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base">Delivery Challan Record</h3>
                  <p className="text-blue-200 text-xs font-mono">{viewingChallanDoc.supplierChallanNo || 'Challan Slip'}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingChallanDoc(null)} 
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
              <div className="border-b border-dashed border-slate-300 pb-3 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">TECHNO CONSTRUCTIONS LTD.</h4>
                  <p className="text-xs text-slate-500">Materials Inward Delivery Challan & Inspection Record</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Inspected & Accepted
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-semibold">Goods Receipt No (GRN):</span>
                  <span className="font-mono font-bold text-blue-700">{viewingChallanDoc.grnNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Delivery Date:</span>
                  <span className="font-bold text-slate-800">{viewingChallanDoc.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Supplier / Source:</span>
                  <span className="font-bold text-slate-800">{viewingChallanDoc.vendorName || 'Central Store'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Destination Site:</span>
                  <span className="font-bold text-slate-800">{viewingChallanDoc.receivingStore}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Vehicle & Driver:</span>
                  <span className="text-slate-700">{viewingChallanDoc.vehicleNo || 'Dhaka Metro-TA-11-9042'} ({viewingChallanDoc.driverName || 'Driver'})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Inspected By:</span>
                  <span className="text-slate-700">{viewingChallanDoc.inspectedBy || 'Site Engineer'}</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-700 text-xs mb-2 uppercase tracking-wider">Accepted Materials</h5>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Item Description</th>
                        <th className="p-2 text-right">Received Qty</th>
                        <th className="p-2 text-right">Accepted Qty</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {viewingChallanDoc.items?.map((it: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-2">
                            <span className="font-bold text-slate-800">{it.itemDescription}</span>
                            <div className="text-[10px] text-slate-400 font-mono">{it.itemCode}</div>
                          </td>
                          <td className="p-2 text-right font-mono">{it.receivedQty || it.orderedQty} {it.unit}</td>
                          <td className="p-2 text-right font-mono font-bold text-emerald-700">{it.acceptedQty} {it.unit}</td>
                          <td className="p-2 text-center">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {it.inspectionResult || 'Passed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Physical Challan Slip: <b>{viewingChallanDoc.supplierChallanNo || 'Signed_Delivery_Slip.pdf'}</b></span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">Verified</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              {onOpenDocPrint && (
                <button
                  onClick={() => {
                    setViewingChallanDoc(null);
                    onOpenDocPrint('GRN', viewingChallanDoc);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Official GRN Document
                </button>
              )}
              <button
                onClick={() => setViewingChallanDoc(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
