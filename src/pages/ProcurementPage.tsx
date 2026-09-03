import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  FileText,
  Printer,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  Sparkles,
  Building,
  UserCheck,
  Award,
  Layers,
  ChevronDown,
  Boxes,
  Upload,
  FileCheck,
  Truck,
  Clock,
  X,
  Calendar,
  Phone,
  ShieldCheck,
  Check,
  FileSpreadsheet,
  Scale,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { DocumentTrail } from '../components/common/DocumentTrail';
import { MaterialRequisition, PriorityLevel, MARItem, PurchaseRequisition, ComparativeStatement, PurchaseOrder } from '../types';

interface ProcurementPageProps {
  onOpenDocPrint: (type: any, data: any) => void;
}

export const ProcurementPage: React.FC<ProcurementPageProps> = ({ onOpenDocPrint }) => {
  const {
    projects,
    items,
    stocks,
    vendors,
    mrs,
    mars,
    prs,
    csList,
    pos,
    grns,
    currentUser,
    activeRole,
    createMR,
    verifyMR,
    approveMR,
    rejectMR,
    createMAR,
    reserveStock,
    createPRFromMAR,
    issueMARToGRN,
    createComparativeStatement,
    approveComparativeStatement,
    createPurchaseOrder,
    approvePurchaseOrder,
    receiveChallanForPO
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'mr' | 'mar' | 'pr' | 'cs' | 'po' | 'vendors'>('mr');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMR, setSelectedMR] = useState<MaterialRequisition | null>(null);

  // Individual PO Delivery Challan & Inspection State
  const [selectedPOForChallan, setSelectedPOForChallan] = useState<PurchaseOrder | null>(null);
  const [selectedPOForViewChallan, setSelectedPOForViewChallan] = useState<{ po: PurchaseOrder; grn?: any } | null>(null);
  const [challanFormData, setChallanFormData] = useState({
    challanNo: '',
    challanDate: new Date().toISOString().substring(0, 10),
    vehicleNo: '',
    driverName: '',
    driverPhone: '',
    inspectorName: '',
    challanFileName: 'Supplier_Delivery_Challan.pdf',
    remarks: '',
    inspectedItems: [] as Array<{
      itemId: string;
      description: string;
      unit: string;
      orderedQty: number;
      receivedQty: number;
      acceptedQty: number;
      rejectedQty: number;
      remarks: string;
    }>
  });
  const [challanSuccessToast, setChallanSuccessToast] = useState<string | null>(null);

  const handleOpenChallanModal = (po: PurchaseOrder) => {
    const linkedGRN = grns.find(g => g.poId === po.id || g.poNumber === po.poNumber);
    setSelectedPOForChallan(po);
    const defaultChallanNo = linkedGRN?.supplierChallanNo && linkedGRN.supplierChallanNo !== 'Awaiting Challan Upload'
      ? linkedGRN.supplierChallanNo
      : `${(po.vendorName.replace(/[^a-zA-Z]/g, '').substring(0, 4) || 'CHAL').toUpperCase()}/CH/2026/${Math.floor(1000 + Math.random() * 9000)}`;

    setChallanFormData({
      challanNo: defaultChallanNo,
      challanDate: new Date().toISOString().substring(0, 10),
      vehicleNo: linkedGRN?.vehicleNo && linkedGRN.vehicleNo !== 'N/A' ? linkedGRN.vehicleNo : 'Dhaka Metro-TA-18-4921',
      driverName: linkedGRN?.driverName && linkedGRN.driverName !== 'N/A' ? linkedGRN.driverName : 'Md. Rafiqul Islam',
      driverPhone: linkedGRN?.driverPhone || '+880 1712-345678',
      inspectorName: currentUser?.name || 'Site Quality Engineer',
      challanFileName: 'Signed_Delivery_Challan.pdf',
      remarks: 'Inspected and verified against PO delivery specifications.',
      inspectedItems: po.items.map((it, idx) => {
        const qty = Number(it.qty || (it as any).quantity || 0);
        return {
          itemId: (it as any).itemId || `itm-po-${idx + 1}`,
          description: it.itemDescription,
          unit: it.unit || 'Nos',
          orderedQty: qty,
          receivedQty: qty,
          acceptedQty: qty,
          rejectedQty: 0,
          remarks: 'Passed standard physical inspection'
        };
      })
    });
  };

  const handleApproveChallanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPOForChallan) return;

    receiveChallanForPO(selectedPOForChallan.id, {
      challanNo: challanFormData.challanNo,
      receivedDate: challanFormData.challanDate,
      challanDate: challanFormData.challanDate,
      vehicleNo: challanFormData.vehicleNo,
      driverName: challanFormData.driverName,
      driverPhone: challanFormData.driverPhone,
      inspectorName: challanFormData.inspectorName,
      challanFileName: challanFormData.challanFileName,
      remarks: challanFormData.remarks,
      inspectedItems: challanFormData.inspectedItems.map(it => ({
        itemId: it.itemId,
        acceptedQty: Number(it.acceptedQty),
        rejectedQty: Number(it.rejectedQty),
        remarks: it.remarks
      }))
    });

    const poNumber = selectedPOForChallan.poNumber;
    const store = selectedPOForChallan.deliveryLocation || `${selectedPOForChallan.projectName} Site Store`;
    setSelectedPOForChallan(null);
    setChallanSuccessToast(`Delivery Challan approved for ${poNumber}! Stock credited to "${store}" and whole company inventory updated.`);
    setTimeout(() => {
      setChallanSuccessToast(null);
    }, 7000);
  };

  // New MR Form State
  
  const [showCSModal, setShowCSModal] = useState(false);
  const [csTargetPR, setCsTargetPR] = useState<PurchaseRequisition | null>(null);
  const [csQuotationsData, setCsQuotationsData] = useState<any[]>([]);
  const [showIssuePOModal, setShowIssuePOModal] = useState(false);
  const [poTargetCS, setPoTargetCS] = useState<any>(null);
  const [poSelectedVendors, setPoSelectedVendors] = useState<string[]>([]);

  
  
  
  const handleQuotationChange = (vendorIdx: number, field: string, value: any) => {
    const newQ = [...csQuotationsData];
    newQ[vendorIdx][field] = value;
    setCsQuotationsData(newQ);
  };
  
  const handleCSItemChange = (vendorIdx: number, itemIdx: number, field: string, value: any) => {
    const newQ = [...csQuotationsData];
    newQ[vendorIdx].items[itemIdx][field] = value;
    setCsQuotationsData(newQ);
  };
  
  const handleRemoveCSItem = (vendorIdx: number, itemIdx: number) => {
    const newQ = [...csQuotationsData];
    newQ[vendorIdx].items.splice(itemIdx, 1);
    setCsQuotationsData(newQ);
  };
  
  const handleRemoveCSQuotation = (idx: number) => {
    const newQ = [...csQuotationsData];
    newQ.splice(idx, 1);
    setCsQuotationsData(newQ);
  };

  const handleOpenCSModal = (pr: PurchaseRequisition) => {
    setCsTargetPR(pr);
    // Initialize with 2 empty vendor quotes
    const initItems = pr.items.map((it, i) => ({
      slNo: i + 1,
      itemId: it.itemId || it.id,
      itemDescription: it.itemDescription,
      specification: it.specification,
      unit: it.unit,
      quantity: it.quantity,
      unitPrice: 0,
      totalAmount: 0
    }));
    
    setCsQuotationsData([
      { vendorName: vendors[0]?.name || '', items: [...initItems] },
      { vendorName: vendors[1]?.name || '', items: JSON.parse(JSON.stringify(initItems)) }
    ]);
    setShowCSModal(true);
  };

  const handleAddCSQuotation = () => {
    if (!csTargetPR) return;
    const initItems = csTargetPR.items.map((it, i) => ({
      slNo: i + 1,
      itemId: it.itemId || it.id,
      itemDescription: it.itemDescription,
      specification: it.specification,
      unit: it.unit,
      quantity: it.quantity,
      unitPrice: 0,
      totalAmount: 0
    }));
    setCsQuotationsData([...csQuotationsData, { vendorName: '', items: initItems }]);
  };

  const handleGenerateCS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csTargetPR) return;

    const quotations = csQuotationsData.map((q, idx) => {
      const vendor = vendors.find(v => v.name === q.vendorName);
      const grandTotal = (q.items || []).reduce((sum: number, it: any) => sum + (it.unitPrice * it.quantity), 0);
      
      const items = (q.items || []).map((it: any) => ({
        ...it,
        totalAmount: it.unitPrice * it.quantity
      }));
      
      return {
        vendorId: vendor?.id || `vnd-${Date.now()}-${idx}`,
        vendorName: q.vendorName,
        quoteRef: `Q-${Date.now()}-${idx}`,
        quoteDate: new Date().toISOString().substring(0, 10),
        items,
        vatTaxAmount: 0,
        freightCost: 0,
        grandTotal,
        leadTimeDays: 7,
        warrantyPeriod: 'Standard',
        paymentTerms: 'Standard terms',
        technicalCompliance: 'Full Compliance',
        score: 100
      };
    });

    createComparativeStatement({
      prId: csTargetPR.id,
      prNumber: csTargetPR.prNumber,
      projectId: csTargetPR.projectId,
      projectName: csTargetPR.projectName,
      quotations,
      preparedBy: 'Current User'
    });

    // Mark PR as Approved/CS Generated (The user mentioned: "after that if that requisition made from any projects there it will be uploaded and status is approved.")
    
    setShowCSModal(false);
    setActiveSubTab('cs');
  };

  const handleOpenIssuePOModal = (cs: ComparativeStatement) => {
    setPoTargetCS(cs);
    setPoSelectedVendors([]);
    setShowIssuePOModal(true);
  };

  const handleIssueMultiplePOs = () => {
    if (!poTargetCS) return;
    
    const newPoIds: string[] = [];
    poSelectedVendors.forEach((qRef) => {
       const quote = poTargetCS.quotations.find((q: any) => q.quoteRef === qRef);
       if (!quote) return;
       
       const vendor = vendors.find(v => v.id === quote.vendorId);
       
       createPurchaseOrder({
         date: new Date().toISOString().substring(0, 10),
         orderType: 'Purchase Order',
         vendorId: quote.vendorId,
         vendorName: quote.vendorName,
         vendorAddress: vendor?.address || 'Vendor Address',
         contactPerson: vendor?.contactPerson || 'Vendor Contact',
         contactMobile: vendor?.phone || 'N/A',
         quotationRef: quote.quoteRef,
         quotationDate: quote.quoteDate,
         deliveryLocation: poTargetCS.projectName + ' Site',
         alternativeContact: 'Project Engineer',
         prNo: poTargetCS.prNumber,
         mrNo: 'N/A',
         projectId: poTargetCS.projectId,
         projectName: poTargetCS.projectName,
         items: (quote.items || []).map((it: any) => ({
           slNo: it.slNo,
           itemDescription: it.itemDescription,
           specification: it.specification,
           unit: it.unit,
           qty: it.quantity,
           unitRate: it.unitPrice,
           totalAmount: it.totalAmount,
           remarks: ''
         })),
         grossAmount: quote.grandTotal,
         vatTaxAmount: quote.vatTaxAmount,
         grandTotal: quote.grandTotal,
         amountInWords: 'Amount as per quotation',
         deliveryLeadTime: `${quote.leadTimeDays} Days`,
         paymentTerms: quote.paymentTerms || 'As per standard terms',
         warranty: 'Standard Warranty'
       });
       // Just generate an ID for tracking in CS (naive)
       newPoIds.push(`PO-${Date.now()}-${Math.floor(Math.random()*1000)}`);
    });
    
    setShowIssuePOModal(false);
  };

  const [showNewMRModal, setShowNewMRModal] = useState(false);
  const [mrProject, setMrProject] = useState(projects[0]?.id || 'proj-1');
  const [mrLocation, setMrLocation] = useState('Airport-Kuril Section, Dhaka');
  const [mrDepartment, setMrDepartment] = useState('Civil Construction');
  const [mrWBS, setMrWBS] = useState('Pier Substructure (WBS-01)');
  const [mrCostCode, setMrCostCode] = useState('MAT-STL-002 (Rebar 500W)');
  const [mrDueDate, setMrDueDate] = useState('2026-09-15');
  const [mrPriority, setMrPriority] = useState<PriorityLevel>('High');
  const [mrItems, setMrItems] = useState<{
    itemId: string;
    itemDescription: string;
    specification: string;
    unit: string;
    quantity: number;
    estimatedUnitPrice: number;
    ledger: string;
  }[]>([
    {
      itemId: items[0]?.id || 'itm-1',
      itemDescription: items[0]?.name || 'Portland Cement (OPC Grade 53)',
      specification: items[0]?.specification || '50 Kg Bag',
      unit: items[0]?.unit || 'Bags',
      quantity: 500,
      estimatedUnitPrice: 575,
      ledger: 'Substructure Concreting'
    }
  ]);

  const handleAddItemRow = () => {
    setMrItems(prev => [
      ...prev,
      {
        itemId: items[1]?.id || 'itm-2',
        itemDescription: items[1]?.name || 'Deformed Steel Rebar 500W',
        specification: items[1]?.specification || 'Grade 500W',
        unit: items[1]?.unit || 'MT',
        quantity: 10,
        estimatedUnitPrice: 96500,
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
    const selected = items.find(it => it.id === selectedItemId);
    if (!selected) return;

    setMrItems(prev => prev.map((row, i) => i === index ? {
      ...row,
      itemId: selected.id,
      itemDescription: selected.name,
      specification: selected.specification,
      unit: selected.unit,
      estimatedUnitPrice: selected.unitPriceEstimate
    } : row));
  };

  const handleCreateMRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === mrProject);
    
    const newMR = createMR({
      date: new Date().toISOString().substring(0, 10),
      dueDate: mrDueDate,
      projectId: mrProject,
      projectName: proj?.name || 'Dhaka Elevated Expressway Phase-3',
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
        specification: it.specification,
        unit: it.unit,
        quantity: Number(it.quantity),
        classification: 'Raw Material',
        estimatedUnitPrice: Number(it.estimatedUnitPrice),
        ledger: it.ledger
      })),
      initiatedBy: currentUser?.name || 'Engr. Nazmul Huda',
      initiatedByRole: activeRole,
      status: 'Pending Verification'
    });

    setShowNewMRModal(false);
    setSelectedMR(newMR);
  };

  // Filtered lists
  const filteredMRs = mrs.filter(m => 
    m.mrNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub Module Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xs flex flex-wrap gap-1.5">
        {[
          { id: 'mr', label: '1. Material Requisitions (MR)', count: mrs.length },
          { id: 'mar', label: '2. Store Availability (MAR)', count: mars.length },
          { id: 'pr', label: '3. Purchase Requisitions (PR)', count: prs.length },
          { id: 'cs', label: '4. Comparative Statements (CS)', count: csList.length },
          { id: 'po', label: '5. Purchase Orders (PO)', count: pos.length },
          { id: 'vendors', label: '6. Approved Vendor Register', count: vendors.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === tab.id
                ? 'bg-[#174A7E] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeSubTab === tab.id ? 'bg-sky-500 text-slate-900' : 'bg-slate-200 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ======================= SUB-TAB 1: MATERIAL REQUISITION ======================= */}
      {activeSubTab === 'mr' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search MR Number, Project, Status..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#174A7E] focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => setShowNewMRModal(true)}
              className="px-4 py-2.5 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> + Create Material Requisition (MR)
            </button>
          </div>

          {/* Table of MRs */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">MR Number</th>
                    <th className="py-3 px-4">Project & WBS</th>
                    <th className="py-3 px-4">Required Date</th>
                    <th className="py-3 px-4">Items Summary</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Workflow Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredMRs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No Material Requisitions Found</p>
                        <p className="text-xs text-slate-500 mt-0.5">Click "+ Create Requisition" above to initiate a new material request.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMRs.map(mr => {
                    const totalQty = (mr.items || []).reduce((s, it) => s + it.quantity, 0);
                    return (
                      <tr key={mr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#174A7E]">
                          {mr.mrNumber}
                          <span className="block text-[10px] text-slate-500 font-normal">
                            Doc: {mr.documentNo}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 line-clamp-1">{mr.projectName}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{mr.wbsCode} • {mr.costCode}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {mr.dueDate}
                          <span className="block text-[10px] text-slate-500">Created: {mr.date}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800">{mr.items?.[0]?.itemDescription}</span>
                          {(mr.items?.length || 0) > 1 && (
                            <span className="text-slate-500 font-normal"> (+{(mr.items?.length || 1) - 1} more items)</span>
                          )}
                          <div className="text-[10px] text-slate-500 font-mono">
                            Qty: {mr.items?.[0]?.quantity} {mr.items?.[0]?.unit}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <PriorityBadge priority={mr.priority} />
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={mr.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Workflow Actions */}
                            {mr.status === 'Pending Verification' && (
                              <button
                                onClick={() => verifyMR(mr.id)}
                                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-[#174A7E] rounded-lg text-xs font-bold border border-sky-200 transition-colors"
                              >
                                Verify
                              </button>
                            )}

                            {mr.status === 'Pending Approval' && (
                              <button
                                onClick={() => approveMR(mr.id)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
                              >
                                Approve
                              </button>
                            )}

                            {mr.status === 'Approved' && (
                              <button
                                onClick={() => {
                                  const mar = createMAR(mr.id);
                                  setActiveSubTab('mar');
                                }}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200 transition-colors flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-500" /> Run MAR Check
                              </button>
                            )}

                            {/* Print Preview Button */}
                            <button
                              onClick={() => onOpenDocPrint('MR', mr)}
                              className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-100 transition-colors"
                              title="Print Official MR PDF"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= SUB-TAB 2: MATERIAL AVAILABILITY REPORT (MAR) ======================= */}
      {activeSubTab === 'mar' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#174A7E]/10 to-sky-100/50 p-4 rounded-2xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-[#174A7E] flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#174A7E]" />
                Rule: Check All Depot Stores (Ashulia & Sreemangal) Before New Purchase
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                The MAR automatically checks multi-store balances, reserves stock, and routes net shortages to commercial PR.
              </p>
            </div>
            <button
              onClick={() => {
                if (mrs.length > 0) {
                  createMAR(mrs[0].id);
                }
              }}
              className="px-4 py-2 bg-[#174A7E] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#123a63] transition-all shrink-0"
            >
              + Generate MAR Audit
            </button>
          </div>

          {/* MAR Report Cards */}
          <div className="space-y-4">
            {mars.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                <Boxes className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Material Availability Reports (MAR)</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  When a Material Requisition is approved, run the MAR check to scan depot stores for surplus stock before commercial purchasing.
                </p>
              </div>
            ) : (
              mars.map(mar => (
              <div key={mar.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base font-black text-[#174A7E]">{mar.reportNo}</span>
                      <StatusBadge status={mar.status} size="sm" />
                      <span className="text-xs text-slate-500 font-mono">Against {mar.mrNumber}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">{mar.projectName} ({mar.projectLocation})</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDocPrint('MAR', mar)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Official MAR
                    </button>
                    {mar.items.some(i => i.actionTaken === 'Reserve & Issue') && mar.status !== 'Issued to GRN' && (
                      <button
                        onClick={() => {
                          issueMARToGRN(mar.id);
                          alert("GRN has been generated and sent for Site Approval.");
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Reserve & Issue to GRN
                      </button>
                    )}

                    {mar.items.some(i => i.shortageQty > 0) && (
                      <button
                        onClick={() => {
                          createPRFromMAR(mar.id);
                          setActiveSubTab('pr');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> Auto-Create PR for Shortage
                      </button>
                    )}
                  </div>
                </div>

                {/* MAR Availability Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-y border-slate-200 text-[11px] font-bold">
                        <th className="py-2.5 px-3">SL#</th>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3 text-center">Unit</th>
                        <th className="py-2.5 px-3 text-right">Req. Qty</th>
                        <th className="py-2.5 px-3 text-right bg-sky-50/50">Ashulia Store</th>
                        <th className="py-2.5 px-3 text-right bg-indigo-50/50">Sreemangal</th>
                        <th className="py-2.5 px-3 text-right bg-emerald-50/60 font-bold">Total Available</th>
                        <th className="py-2.5 px-3 text-right bg-rose-50/60 font-bold text-rose-700">Shortage</th>
                        <th className="py-2.5 px-3">Action Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mar.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 font-mono text-slate-500">{it.slNo}</td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900">{it.itemName}</span>
                            <span className="block text-[10px] text-slate-500">{it.specification}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono">{it.unit}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold">{it.requiredQty}</td>
                          <td className="py-3 px-3 text-right font-mono text-slate-700 bg-sky-50/30">{it.ashuliaQty}</td>
                          <td className="py-3 px-3 text-right font-mono text-slate-700 bg-indigo-50/30">{it.sreemangalQty}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">
                            {it.totalAvailable}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-rose-700 bg-rose-50/30">
                            {it.shortageQty}
                          </td>
                          <td className="py-3 px-3 font-medium">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              it.shortageQty > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {it.actionTaken}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex justify-between items-center">
                  <span>Prepared by: <strong className="text-slate-800">{mar.preparedBy}</strong></span>
                  <span className="font-mono text-slate-500">Report Date: {mar.reportDate}</span>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      )}

      {/* ======================= SUB-TAB 3: PURCHASE REQUISITION ======================= */}
      {activeSubTab === 'pr' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Purchase Requisitions (PR) Generated from Shortages</h3>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">PR Number</th>
                    <th className="py-3 px-4">Source MR / Project</th>
                    <th className="py-3 px-4">Shortage Items</th>
                    <th className="py-3 px-4">Recommended Suppliers</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {prs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No Purchase Requisitions (PR)</p>
                        <p className="text-xs text-slate-500 mt-0.5">Commercial PRs are generated automatically when depot stock cannot fulfill requisitioned materials.</p>
                      </td>
                    </tr>
                  ) : (
                    prs.map(pr => (
                    <tr key={pr.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#174A7E]">
                        {pr.prNumber}
                        <span className="block text-[10px] text-slate-500">{pr.date}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {pr.sourceMrNumber || 'Direct PR'}
                        </span>
                        <div className="font-bold text-slate-900 mt-1">{pr.projectName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {pr.items.map((it, idx) => (
                          <div key={idx} className="font-semibold text-slate-800">
                            {it.itemDescription} ({it.quantity} {it.unit})
                          </div>
                        ))}
                      </td>
                      <td className="py-3.5 px-4">
                        {pr.recommendedSuppliers?.map((s, i) => (
                          <span key={i} className="inline-block bg-sky-50 text-[#174A7E] text-[10px] font-bold px-2 py-0.5 rounded mr-1">
                            {s.name}
                          </span>
                        ))}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={pr.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              handleOpenCSModal(pr);
                            }}
                            className="px-3 py-1 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                          >
                            Generate CS Quotation
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= SUB-TAB 4: COMPARATIVE STATEMENT (CS) ======================= */}
      {activeSubTab === 'cs' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Side-by-Side Comparative Statements (CS)</h3>
            </div>
          </div>

          <div className="space-y-6">
            {csList.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                <Scale className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Comparative Statements (CS)</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Comparative Statements evaluate quotations from verified suppliers against approved PRs for competitive bidding.
                </p>
              </div>
            ) : (
              csList.map(cs => (
              <div key={cs.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-[#174A7E]">{cs.csNumber}</span>
                      <StatusBadge status={cs.status} size="sm" />
                      <span className="text-xs text-slate-500 font-mono">Ref PR: {cs.prNumber}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">{cs.quotations[0]?.items?.[0]?.itemDescription || "Multiple Items"} • {cs.projectName}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDocPrint('CS', cs)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Official CS
                    </button>

                    {cs.status === 'Pending Approval' && (
                      <button
                        onClick={() => approveComparativeStatement(cs.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        Approve CS
                      </button>
                    )}

                    {cs.status === 'Approved' && (
                      <button
                        onClick={() => {
                          handleOpenIssuePOModal(cs);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#174A7E] hover:bg-[#123a63] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Issue Purchase Order (PO)
                      </button>
                    )}
                  </div>
                </div>

                {/* Quotation Comparison Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cs.quotations.map((q, i) => {
                    const isRec = q.vendorId === cs.recommendedVendorId || q.isRecommended;
                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border transition-all ${
                          isRec
                            ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block">{q.quoteRef}</span>
                            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                              {isRec && <Award className="w-4 h-4 text-emerald-600" />}
                              {q.vendorName}
                            </h4>
                          </div>
                          {isRec && (
                            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase">
                              Lowest & Recommended Bidder
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 border-y border-slate-200/70 py-2.5 my-2">
                          
                          <div className="flex justify-between">
                            <span>Quoted Items:</span>
                            <span className="font-mono font-bold text-slate-900">{q.items?.length || 0} items</span>
                          </div>
                          
                          <div className="my-1.5 space-y-1 border border-slate-100 rounded-lg p-2 bg-white max-h-24 overflow-y-auto">
                            {(q.items || []).map((it: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-[10px] items-center border-b border-slate-50 last:border-0 pb-1 last:pb-0">
                                <span className="text-slate-700 truncate pr-2 font-medium" title={it.itemDescription}>{it.itemDescription}</span>
                                <span className="font-mono text-slate-900 shrink-0">{it.quantity} {it.unit} × ৳{(it.unitPrice || 0).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between">
                            <span>Base Amount:</span>
                            <span className="font-mono">৳{(q.items?.reduce((sum, it) => sum + ((it.unitPrice || 0) * (it.quantity || 0)), 0) || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VAT / AIT + Freight:</span>
                            <span className="font-mono">৳{((q.vatTaxAmount || 0) + (q.freightCost || 0)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-sm">
                            <span>Grand Total:</span>
                            <span className="font-mono text-[#174A7E]">৳{(q.grandTotal || 0).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                          <div>Lead Time: <strong className="text-slate-800">{q.leadTimeDays} Days</strong></div>
                          <div>Compliance: <strong className="text-emerald-700">{q.technicalCompliance}</strong></div>
                          <div className="col-span-2">Terms: <strong className="text-slate-800">{q.paymentTerms}</strong></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl text-xs border border-emerald-200 text-emerald-950">
                  <strong>Justification:</strong> {cs.recommendationReason}
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      )}

      {/* ======================= SUB-TAB 5: PURCHASE ORDER (PO) ======================= */}
      {activeSubTab === 'po' && (
        <div className="space-y-4">
          {challanSuccessToast && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold">{challanSuccessToast}</span>
              </div>
              <button
                onClick={() => setChallanSuccessToast(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold text-xs p-1"
              >
                ✕
              </button>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Purchase Orders & Material Receipts</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Delivery challans and material receipts are processed individually for each Purchase Order. Click "Upload Challan & Receive" to inspect and credit stock into inventory.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200">
                Total POs: <b>{pos.length}</b>
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">PO Number</th>
                    <th className="py-3 px-4">Vendor & Contact</th>
                    <th className="py-3 px-4">Project & PR Ref</th>
                    <th className="py-3 px-4">Order Value (BDT)</th>
                    <th className="py-3 px-4">Delivery Due Date</th>
                    <th className="py-3 px-4">Status & Receipt</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {pos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No Purchase Orders Issued Yet</p>
                        <p className="text-xs text-slate-500 mt-0.5">Click "+ Issue Direct PO" above or award a Comparative Statement to issue an official purchase order.</p>
                      </td>
                    </tr>
                  ) : (
                    pos.map(po => {
                    const linkedGRN = grns.find(g => g.poId === po.id || g.poNumber === po.poNumber);
                    const isReceivedAndPosted = linkedGRN?.status === 'Inspected & Posted';

                    return (
                      <tr key={po.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#174A7E]">
                          {po.poNumber}
                          <span className="block text-[10px] text-slate-500 font-normal">Doc: {po.docNo}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{po.vendorName}</div>
                          <div className="text-[10px] text-slate-500">{po.contactPerson} ({po.contactMobile})</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 line-clamp-1">{po.projectName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Ref: {po.prNo}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          ৳{(po.grandTotal || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {po.deliveryDueDate}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={po.status} />
                          {isReceivedAndPosted ? (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Challan Approved
                            </div>
                          ) : po.status === 'Approved' ? (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded w-fit">
                              <Clock className="w-3 h-3 text-amber-600 shrink-0" /> Awaiting Challan
                            </div>
                          ) : null}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {po.status === 'Pending Approval' && (
                              <button
                                onClick={() => approvePurchaseOrder(po.id)}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
                              >
                                Sign & Approve
                              </button>
                            )}

                            {po.status === 'Approved' && !isReceivedAndPosted && (
                              <button
                                onClick={() => handleOpenChallanModal(po)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                                title="Upload supplier challan and inspect materials to receive into inventory"
                              >
                                <Upload className="w-3.5 h-3.5" /> Upload Challan & Receive
                              </button>
                            )}

                            {isReceivedAndPosted && (
                              <>
                                <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-[11px] font-bold inline-flex items-center gap-1 whitespace-nowrap">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Stock Posted
                                </span>
                                <button
                                  onClick={() => setSelectedPOForViewChallan({ po, grn: linkedGRN })}
                                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 inline-flex items-center gap-1 transition-colors whitespace-nowrap"
                                  title="View verified delivery challan document"
                                >
                                  <FileCheck className="w-3.5 h-3.5" /> View Challan
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => onOpenDocPrint('PO', po)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                            >
                              <Printer className="w-3.5 h-3.5" /> PDF Preview
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= SUB-TAB 6: VENDORS REGISTER ======================= */}
      {activeSubTab === 'vendors' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Approved Vendor Register & Performance Matrix</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map(v => (
              <div key={v.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#174A7E] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                      {v.code}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{v.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {v.qualificationStatus}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="text-[11px] font-semibold text-[#174A7E]">{v.category}</div>
                  <div>Contact: <strong className="text-slate-800">{v.contactPerson}</strong></div>
                  <div>Phone: <span className="font-mono">{v.phone}</span></div>
                  <div>Tax TIN: <span className="font-mono text-slate-500">{v.taxId}</span></div>
                  <div>Payment Terms: <strong className="text-slate-700">{v.paymentTerms}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Quality Rating:</span>
                  <span className="font-bold text-amber-600 font-mono">★ {v.rating} / 5.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= NEW MATERIAL REQUISITION MODAL ======================= */}
      {showNewMRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">New Material Requisition (MR)</h3>
              </div>
              <button
                onClick={() => setShowNewMRModal(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMRSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project Name *</label>
                  <select
                    value={mrProject}
                    onChange={e => setMrProject(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Site Delivery Location *</label>
                  <input
                    type="text"
                    required
                    value={mrLocation}
                    onChange={e => setMrLocation(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">WBS / Work Package</label>
                  <input
                    type="text"
                    value={mrWBS}
                    onChange={e => setMrWBS(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cost Code / Ledger</label>
                  <input
                    type="text"
                    value={mrCostCode}
                    onChange={e => setMrCostCode(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required On Site Due Date *</label>
                  <input
                    type="date"
                    required
                    value={mrDueDate}
                    onChange={e => setMrDueDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority Level</label>
                  <select
                    value={mrPriority}
                    onChange={e => setMrPriority(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              {/* Item Lines */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-900">Requisition Items Line:</h4>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-[#174A7E] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add Line Item
                  </button>
                </div>

                <div className="space-y-3">
                  {mrItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Item #{idx + 1}</span>
                        {mrItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="text-rose-600 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block">Item Catalog</label>
                          <select
                            value={item.itemId}
                            onChange={e => handleItemSelect(idx, e.target.value)}
                            className="w-full p-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                          >
                            {items.map(it => {
                              const centralStock = stocks.filter(s => s.itemId === it.id).reduce((sum, s) => sum + s.availableQty, 0);
                              return (
                                <option key={it.id} value={it.id}>
                                  {it.name} ({it.unit}) - Total Stock: {centralStock}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block">Quantity ({item.unit})</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={item.quantity}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setMrItems(prev => prev.map((r, i) => i === idx ? { ...r, quantity: val } : r));
                            }}
                            className="w-full p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block">Estimated Rate (BDT)</label>
                          <input
                            type="number"
                            value={item.estimatedUnitPrice}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setMrItems(prev => prev.map((r, i) => i === idx ? { ...r, estimatedUnitPrice: val } : r));
                            }}
                            className="w-full p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block">Specification & Ledger Purpose</label>
                        <input
                          type="text"
                          value={item.specification}
                          onChange={e => {
                            const val = e.target.value;
                            setMrItems(prev => prev.map((r, i) => i === idx ? { ...r, specification: val } : r));
                          }}
                          className="w-full p-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewMRModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl font-bold shadow-md"
                >
                  Submit Requisition for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showIssuePOModal && poTargetCS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Issue Purchase Orders</h3>
                <p className="text-sm text-slate-500">CS Ref: {poTargetCS.csNumber} • {poTargetCS.projectName}</p>
              </div>
              <button onClick={() => setShowIssuePOModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            
            <div className="mb-4 text-sm text-slate-700">
              Select the vendors you wish to issue Purchase Orders to based on this Comparative Statement.
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {poTargetCS.quotations.map((q: any, idx: number) => {
                const isSelected = poSelectedVendors.includes(q.quoteRef);
                const isRecommended = q.vendorId === poTargetCS.recommendedVendorId || q.isRecommended;
                
                return (
                  <label key={`${q.vendorId}-${idx}`} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                    <div className="pt-1">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPoSelectedVendors([...poSelectedVendors, q.quoteRef]);
                          } else {
                            setPoSelectedVendors(poSelectedVendors.filter(id => id !== q.quoteRef));
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {q.vendorName}
                          {isRecommended && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase rounded-full">Recommended</span>}
                        </div>
                        <div className="font-mono font-bold text-[#174A7E]">
                          ৳{(q.grandTotal || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Ref: {q.quoteRef} • Items: {q.items?.length || 0}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-slate-200">
              <button onClick={() => setShowIssuePOModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
              <button 
                onClick={() => {
                  handleIssueMultiplePOs();
                  setShowIssuePOModal(false);
                }} 
                disabled={poSelectedVendors.length === 0}
                className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-sm"
              >
                Dispatch Selected POs ({poSelectedVendors.length})
              </button>
            </div>
          </div>
        </div>
      )}
\n      {showCSModal && csTargetPR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Generate Comparative Statement (CS)</h3>
                <p className="text-xs text-slate-500">PR: {csTargetPR.prNumber}</p>
              </div>
              <button onClick={() => setShowCSModal(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleGenerateCS} className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 text-sm">Vendor Quotations</label>
                <button type="button" onClick={handleAddCSQuotation} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold transition-colors">
                  + Add Vendor
                </button>
              </div>

              {csQuotationsData.map((q, vIdx) => (
                <div key={vIdx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Vendor Name"
                      value={q.vendorName}
                      onChange={(e) => handleQuotationChange(vIdx, 'vendorName', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                      required
                    />
                    {csQuotationsData.length > 1 && (
                      <button type="button" onClick={() => handleRemoveCSQuotation(vIdx)} className="text-rose-500 hover:text-rose-700 font-bold p-1">
                        Remove Vendor
                      </button>
                    )}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2">Item Description</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Unit Price</th>
                          <th className="p-2 text-right">Total</th>
                          <th className="p-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(q.items || []).map((it: any, iIdx: number) => (
                          <tr key={iIdx} className="hover:bg-slate-50">
                            <td className="p-2 font-medium text-slate-800">{it.itemDescription}</td>
                            <td className="p-2">{it.quantity} {it.unit}</td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                placeholder="Price"
                                value={it.unitPrice || ''}
                                onChange={(e) => handleCSItemChange(vIdx, iIdx, 'unitPrice', Number(e.target.value))}
                                className="w-24 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                              />
                            </td>
                            <td className="p-2 text-right font-mono font-medium text-slate-600">
                              {((it.unitPrice || 0) * (it.quantity || 0)).toLocaleString()}
                            </td>
                            <td className="p-2 text-center">
                              <button type="button" onClick={() => handleRemoveCSItem(vIdx, iIdx)} className="text-slate-400 hover:text-rose-600">
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {q.items.length === 0 && (
                      <div className="p-4 text-center text-slate-500 italic">No items selected for this vendor.</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCSModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700">Generate CS</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: INDIVIDUAL PO UPLOAD CHALLAN & RECEIVE ==================== */}
      {selectedPOForChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                    {selectedPOForChallan.poNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Doc: {selectedPOForChallan.docNo}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Upload Delivery Challan & Receive Material</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Vendor: <span className="font-semibold text-slate-800">{selectedPOForChallan.vendorName}</span> • 
                  Destination: <span className="font-semibold text-slate-800">{selectedPOForChallan.deliveryLocation || `${selectedPOForChallan.projectName} Site Store`}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedPOForChallan(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApproveChallanSubmit} className="space-y-5 pt-4">
              {/* Delivery & Transport Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supplier Challan No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={challanFormData.challanNo}
                    onChange={(e) => setChallanFormData({ ...challanFormData, challanNo: e.target.value })}
                    placeholder="e.g. BSRM/CH/2026/8842"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#174A7E] font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Challan / Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={challanFormData.challanDate}
                    onChange={(e) => setChallanFormData({ ...challanFormData, challanDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#174A7E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vehicle / Truck No
                  </label>
                  <input
                    type="text"
                    value={challanFormData.vehicleNo}
                    onChange={(e) => setChallanFormData({ ...challanFormData, vehicleNo: e.target.value })}
                    placeholder="e.g. Dhaka Metro-TA-18-4921"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#174A7E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    value={challanFormData.driverName}
                    onChange={(e) => setChallanFormData({ ...challanFormData, driverName: e.target.value })}
                    placeholder="e.g. Md. Rafiqul Islam"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#174A7E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Driver Mobile
                  </label>
                  <input
                    type="text"
                    value={challanFormData.driverPhone}
                    onChange={(e) => setChallanFormData({ ...challanFormData, driverPhone: e.target.value })}
                    placeholder="e.g. +880 1712-345678"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#174A7E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Site Inspector / Receiver <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={challanFormData.inspectorName}
                    onChange={(e) => setChallanFormData({ ...challanFormData, inspectorName: e.target.value })}
                    placeholder="Inspector Name"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#174A7E]"
                  />
                </div>
              </div>

              {/* Upload Challan Document File */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Signed Supplier Challan Document <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50 hover:bg-blue-50/40 transition-all cursor-pointer">
                  <input
                    type="file"
                    id="poChallanFile"
                    name="poChallanFile"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setChallanFormData({ ...challanFormData, challanFileName: file.name });
                      }
                    }}
                  />
                  <label htmlFor="poChallanFile" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        {challanFormData.challanFileName ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <FileCheck className="w-4 h-4" /> Selected: {challanFormData.challanFileName}
                          </span>
                        ) : (
                          "Click to browse signed challan slip or drag and drop"
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">PDF, scanned PNG, JPG (Mill delivery challan, weighbridge slip, gate pass copy)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Material Inspection & Acceptance Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Physical Material Verification & Quality Acceptance
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5 text-center">Unit</th>
                        <th className="p-2.5 text-center">Ordered</th>
                        <th className="p-2.5 text-center">Received</th>
                        <th className="p-2.5 text-center">Accepted</th>
                        <th className="p-2.5 text-center">Rejected</th>
                        <th className="p-2.5">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {challanFormData.inspectedItems.map((item, idx) => (
                        <tr key={item.itemId || idx} className="hover:bg-slate-50">
                          <td className="p-2.5">
                            <div className="font-bold text-slate-900">{item.description}</div>
                            <div className="text-[10px] text-slate-500 font-mono">Ref: {item.itemId}</div>
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-600">{item.unit}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-700">{item.orderedQty}</td>
                          <td className="p-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              value={item.receivedQty}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = [...challanFormData.inspectedItems];
                                updated[idx].receivedQty = val;
                                updated[idx].acceptedQty = Math.max(0, val - updated[idx].rejectedQty);
                                setChallanFormData({ ...challanFormData, inspectedItems: updated });
                              }}
                              className="w-16 px-2 py-1 text-center font-mono border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 font-bold text-xs"
                            />
                          </td>
                          <td className="p-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              max={item.receivedQty}
                              value={item.acceptedQty}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = [...challanFormData.inspectedItems];
                                updated[idx].acceptedQty = val;
                                updated[idx].rejectedQty = Math.max(0, updated[idx].receivedQty - val);
                                setChallanFormData({ ...challanFormData, inspectedItems: updated });
                              }}
                              className="w-16 px-2 py-1 text-center font-mono border border-emerald-300 bg-emerald-50 text-emerald-800 rounded focus:ring-1 focus:ring-emerald-500 font-bold text-xs"
                            />
                          </td>
                          <td className="p-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              value={item.rejectedQty}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = [...challanFormData.inspectedItems];
                                updated[idx].rejectedQty = val;
                                updated[idx].acceptedQty = Math.max(0, updated[idx].receivedQty - val);
                                setChallanFormData({ ...challanFormData, inspectedItems: updated });
                              }}
                              className="w-14 px-2 py-1 text-center font-mono border border-red-300 bg-red-50 text-red-800 rounded focus:ring-1 focus:ring-red-500 font-bold text-xs"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={item.remarks}
                              onChange={(e) => {
                                const updated = [...challanFormData.inspectedItems];
                                updated[idx].remarks = e.target.value;
                                setChallanFormData({ ...challanFormData, inspectedItems: updated });
                              }}
                              placeholder="Inspection notes"
                              className="w-full px-2 py-1 border border-slate-200 rounded text-[11px]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overall Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  General Inspection Remarks / Test Certificate Notes
                </label>
                <input
                  type="text"
                  value={challanFormData.remarks}
                  onChange={(e) => setChallanFormData({ ...challanFormData, remarks: e.target.value })}
                  placeholder="e.g. Delivered materials checked and verified against mill test certificates."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#174A7E]"
                />
              </div>

              {/* Footer Notice & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clicking <b>Okay</b> will approve the challan, credit stock to <b>{selectedPOForChallan.deliveryLocation || `${selectedPOForChallan.projectName} Site Store`}</b>, and update whole inventory.</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedPOForChallan(null)}
                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 text-xs cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Okay - Approve & Update Inventory
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: VIEW VERIFIED DELIVERY CHALLAN ==================== */}
      {selectedPOForViewChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 my-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                  VERIFIED DELIVERY CHALLAN
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Delivery Challan for {selectedPOForViewChallan.po.poNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Vendor: {selectedPOForViewChallan.po.vendorName} • {selectedPOForViewChallan.po.projectName}
                </p>
              </div>
              <button
                onClick={() => setSelectedPOForViewChallan(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Challan Number</div>
                  <div className="font-mono font-bold text-blue-700">
                    {selectedPOForViewChallan.grn?.supplierChallanNo || 'BSRM/CH/2026/8842'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Received Date</div>
                  <div className="font-bold text-slate-800">
                    {selectedPOForViewChallan.grn?.date || selectedPOForViewChallan.po.date}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Receiving Store</div>
                  <div className="font-bold text-slate-800">
                    {selectedPOForViewChallan.grn?.receivingStore || selectedPOForViewChallan.po.deliveryLocation}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Vehicle Number</div>
                  <div className="font-bold text-slate-700">
                    {selectedPOForViewChallan.grn?.vehicleNo || 'Dhaka Metro-TA-18-4921'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Driver & Contact</div>
                  <div className="font-bold text-slate-700">
                    {selectedPOForViewChallan.grn?.driverName || 'Md. Rafiqul Islam'} ({selectedPOForViewChallan.grn?.driverPhone || '+880 1712-345678'})
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Verified By</div>
                  <div className="font-bold text-emerald-800">
                    {selectedPOForViewChallan.grn?.inspectedBy || 'Site Quality Engineer'}
                  </div>
                </div>
              </div>

              {/* Digital Attachment Preview */}
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Signed_Delivery_Challan.pdf</div>
                    <div className="text-[11px] text-slate-500">2.4 MB • Stamped & Digitally Signed Delivery Document</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              {/* Items in Challan */}
              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">Delivered & Accepted Materials</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2">Item Description</th>
                        <th className="p-2 text-center">Unit</th>
                        <th className="p-2 text-center">Delivered</th>
                        <th className="p-2 text-center">Accepted</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {selectedPOForViewChallan.po.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900">{it.itemDescription}</td>
                          <td className="p-2 text-center text-slate-600">{it.unit}</td>
                          <td className="p-2 text-center font-mono">{it.qty}</td>
                          <td className="p-2 text-center font-mono font-bold text-emerald-700">{it.qty}</td>
                          <td className="p-2">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                              Passed & Posted
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button
                  onClick={() => setSelectedPOForViewChallan(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
