import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  ArrowLeftRight,
  Send,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  Building,
  QrCode,
  Clock,
  FileText,
  ArrowUpRight,
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { QRCodeModal } from '../components/common/QRCodeModal';

interface InventoryPageProps {
  onOpenDocPrint: (type: any, data: any) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ onOpenDocPrint }) => {

  const {
    stocks,
    grns,
    mivs,
    mtvs,
    projects,
    items,
    postGRN,
    createMIV,
    createMTV,
    receiveMTV,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stocks' | 'grn' | 'miv' | 'mtv'>('stocks');
  const [storeFilter, setStoreFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showNewMIVModal, setShowNewMIVModal] = useState(false);
  const [showNewMTVModal, setShowNewMTVModal] = useState(false);
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

  // New MIV State
  const [mivProject, setMivProject] = useState(projects[0]?.id || '');
  const [mivStore, setMivStore] = useState('Ashulia Central Store, Savar');
  const [mivItem, setMivItem] = useState(items[0]?.id || '');
  const [mivQty, setMivQty] = useState(50);
  const [mivReceiver, setMivReceiver] = useState('Md. Al-Amin (Site Foreman)');
  const [mivPhone, setMivPhone] = useState('+880 1711-998877');

  // New MTV State
  const [mtvFromStore, setMtvFromStore] = useState('Ashulia Central Store, Savar');
  const [mtvToStore, setMtvToStore] = useState('Sreemangal Regional Depot, Sylhet');
  const [mtvProject, setMtvProject] = useState(projects[0]?.id || '');
  const [mtvItem, setMtvItem] = useState(items[0]?.id || '');
  const [mtvQty, setMtvQty] = useState(100);
  const [mtvVehicle, setMtvVehicle] = useState('Dhaka Metro-Ta-11-9042 (10-Ton Bedford)');
  const [mtvDriver, setMtvDriver] = useState('Rafiqul Islam');
  const [mtvDriverPhone, setMtvDriverPhone] = useState('+880 1912-334455');
  const [mtvSourceItem, setMtvSourceItem] = useState('');

  // Filter stocks
  const filteredStocks = stocks.filter(s => {
    const matchesStore = storeFilter === 'ALL' || s.storeName.toLowerCase().includes(storeFilter.toLowerCase());
    const matchesSearch = s.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || s.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStore && matchesSearch;
  });

  const handleMIVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === mivProject);
    const itm = items.find(i => i.id === mivItem);

    createMIV({
      date: new Date().toISOString().substring(0, 10),
      mrNo: 'MR-2026-0045',
      marNo: 'MAR-2026-0012',
      projectId: mivProject,
      projectName: proj?.name || 'Dhaka Elevated Expressway Phase-3',
      fromStore: mivStore,
      toLocation: 'Work Package Pier #12-18',
      receiverName: mivReceiver,
      receiverPhone: mivPhone,
      items: [
        {
          itemId: itm?.id || 'itm-1',
          itemName: itm?.name || 'Portland Cement',
          specification: itm?.specification || '50 Kg Bag',
          unit: itm?.unit || 'Bags',
          quantity: Number(mivQty),
          unitCost: itm?.unitPriceEstimate || 575,
          remarks: 'Issued for structural casting'
        }
      ],
      preparedBy: currentUser?.name || 'Md. Delwar Hossain (Store Officer)',
      notesComments: 'Material verified and released in sound condition.'
    });

    setShowNewMIVModal(false);
  };

  const handleMTVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === mtvProject);
    const itm = items.find(i => i.id === mtvItem);

    createMTV({
      date: new Date().toISOString().substring(0, 10),
      projectId: mtvProject,
      projectName: proj?.name || 'Inter-Store Relocation',
      fromStore: mtvFromStore,
      toStore: mtvToStore,
      vehicleNo: mtvVehicle,
      driverName: mtvDriver,
      driverPhone: mtvDriverPhone,
      items: [
        {
          itemId: itm?.id || 'itm-1',
          itemName: itm?.name || 'Portland Cement',
          specification: itm?.specification || '50 Kg Bag',
          unit: itm?.unit || 'Bags',
          quantity: Number(mtvQty),
          unitCost: itm?.unitPriceEstimate || 575,
          remarks: 'Inter-store balanced stock replenishment',
          sourceItemName: mtvSourceItem
        }
      ],
      preparedBy: currentUser?.name || 'Md. Delwar Hossain (Store Officer)',
      notesComments: 'Vehicle inspected and secured with waterproof tarpaulin.'
    });

    setShowNewMTVModal(false);
  };

  
  

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xs flex flex-wrap gap-1.5">
        {[
          { id: 'stocks', label: '1. Store Stock Ledger & Bin Cards', count: stocks.length },
          { id: 'grn', label: '2. Goods Received Notes (GRN)', count: grns.length },
          { id: 'miv', label: '3. Material Issue Vouchers (MIV)', count: mivs.length },
          { id: 'mtv', label: '4. Material Transfer Vouchers (MTV)', count: mtvs.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#174A7E] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === tab.id ? 'bg-sky-500 text-slate-900' : 'bg-slate-200 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ======================= SUB-TAB 1: STORE STOCKS ======================= */}
      {activeTab === 'stocks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search item code, material name..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#174A7E]"
                />
              </div>

              {/* Store Filter Pills */}
              {['ALL', 'Ashulia', 'Sreemangal', 'Expressway', 'Chittagong'].map(st => (
                <button
                  key={st}
                  onClick={() => setStoreFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    storeFilter === st
                      ? 'bg-[#102A43] text-slate-900'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All Stores' : st}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowNewMIVModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Issue Material (MIV)
              </button>
              <button
                onClick={() => setShowNewMTVModal(true)}
                className="px-3.5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" /> Transfer Material (MTV)
              </button>
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Item Code & Name</th>
                    <th className="py-3 px-4">Depot Store & Location</th>
                    <th className="py-3 px-4 text-center">Unit</th>
                    <th className="py-3 px-4 text-right">Physical On Hand</th>
                    <th className="py-3 px-4 text-right">Reserved (MAR)</th>
                    <th className="py-3 px-4 text-right bg-sky-50 font-bold">Net Free Qty</th>
                    <th className="py-3 px-4 text-right">Unit Rate (BDT)</th>
                    <th className="py-3 px-4 text-right">Total Value (BDT)</th>
                    <th className="py-3 px-4 text-center">Tag / QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStocks.map((stock, idx) => {
                    const isLow = stock.availableQty <= (items.find(i => i.id === stock.itemId)?.reorderLevel || 0);
                    return (
                      <tr key={`${stock.itemId}-${stock.storeName}-${idx}`} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-[#174A7E] bg-sky-50 px-1.5 py-0.5 rounded text-[10px]">
                            {stock.itemCode}
                          </span>
                          <div className="font-bold text-slate-900 mt-1">{stock.itemName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Bin: {stock.binCardNumber}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{stock.storeName}</div>
                          
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                          {stock.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {((stock.availableQty || 0) + (stock.reservedQty || 0)).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-amber-700">
                          {(stock.reservedQty || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold bg-sky-50/50">
                          <span className={isLow ? 'text-rose-600 font-black' : 'text-emerald-700 font-black'}>
                            {(stock.availableQty || 0).toLocaleString()}
                          </span>
                          {isLow && (
                            <span className="block text-[9px] text-rose-500 uppercase font-bold">
                              Low Stock Alert
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700">
                          ৳{(items.find(i => i.id === stock.itemId)?.unitPriceEstimate || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ৳{(((stock.availableQty || 0) + (stock.reservedQty || 0)) * (items.find(i => i.id === stock.itemId)?.unitPriceEstimate || 0)).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setQrModalData({
                              isOpen: true,
                              title: `Bin Card: ${stock.itemName}`,
                              codeValue: `TCCL-BIN|${stock.itemCode}|${stock.storeName}|${stock.binCardNumber}`,
                              meta: [
                                { label: 'Item Code', value: stock.itemCode },
                                { label: 'Item Name', value: stock.itemName },
                                { label: 'Store Depot', value: stock.storeName },
                                { label: 'Bin Rack', value: stock.binCardNumber },
                                { label: 'Net Free Qty', value: `${stock.availableQty} ${stock.unit}` }
                              ]
                            })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#174A7E] hover:bg-sky-50 transition-colors"
                            title="View Bin Card QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= SUB-TAB 2: GOODS RECEIVED NOTE (GRN) ======================= */}
      {activeTab === 'grn' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Goods Received Notes (GRN) — Central Register & Audit Log</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Central company-wide log for all goods receipts. Delivery challans are uploaded and inspected directly on each individual Purchase Order (PO).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200">
                Total GRNs: <b>{grns.length}</b>
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {grns.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Goods Received Notes (GRN)</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  When a Purchase Order is issued, pending GRNs are automatically generated for project stores. You can also upload supplier challans and inspect incoming materials directly within the Procurement PO records.
                </p>
              </div>
            ) : (
              grns.map(grn => (
              <div key={grn.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-[#174A7E]">{grn.grnNumber}</span>
                      <StatusBadge status={grn.status} size="sm" />
                      <span className="text-xs font-mono text-slate-500">PO Ref: {grn.poNumber}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                      Vendor: {grn.vendorName} • Delivered to: {grn.receivingStore}
                    </p>
                    {grn.supplierChallanNo && grn.supplierChallanNo !== 'Awaiting Challan Upload' && (
                      <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                        Challan Ref: {grn.supplierChallanNo} {grn.vehicleNo ? `• Vehicle: ${grn.vehicleNo}` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDocPrint('GRN', grn)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Official GRN
                    </button>

                    {grn.status !== 'Inspected & Posted' ? (
                      <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Awaiting PO Challan Upload
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Challan Approved & Stock Posted
                      </span>
                    )}
                  </div>
                </div>

                {/* GRN Item Qty Breakdown */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-y border-slate-200 text-[11px] font-bold">
                        <th className="py-2.5 px-3">SL#</th>
                        <th className="py-2.5 px-3">Item Code</th>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3 text-center">Unit</th>
                        <th className="py-2.5 px-3 text-right">Ordered Qty</th>
                        <th className="py-2.5 px-3 text-right">Received Qty</th>
                        <th className="py-2.5 px-3 text-right bg-emerald-50 text-emerald-800 font-bold">Accepted Qty</th>
                        <th className="py-2.5 px-3 text-right bg-rose-50 text-rose-800 font-bold">Rejected Qty</th>
                        <th className="py-2.5 px-3">QC Inspection Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {grn.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 font-mono text-slate-500">{it.slNo}</td>
                          <td className="py-3 px-3 font-mono text-blue-600 font-bold">{it.itemCode || it.itemId || `MAT-${it.itemDescription.substring(0,3).toUpperCase()}-00${it.slNo}`}</td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900">{it.itemDescription}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono">{it.unit}</td>
                          <td className="py-3 px-3 text-right font-mono">{it.orderedQty}</td>
                          <td className="py-3 px-3 text-right font-mono">{it.receivedQty}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">
                            {it.acceptedQty}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-rose-700 bg-rose-50/30">
                            {it.rejectedQty}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700">{it.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div>Supplier Challan: <strong className="text-slate-800">{grn.supplierChallanNo}</strong></div>
                  <div>Transport Vehicle: <strong className="text-slate-800">{grn.vehicleNo}</strong> ({grn.driverName})</div>
                  <div>QC Inspector: <strong className="text-emerald-800 font-bold">{grn.inspectedBy}</strong></div>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      )}

      {/* ======================= SUB-TAB 3: MATERIAL ISSUE VOUCHER (MIV) ======================= */}
      {activeTab === 'miv' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Material Issue Vouchers (MIV)</h3>
            </div>
            <button
              onClick={() => setShowNewMIVModal(true)}
              className="px-4 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> + Create Material Issue (MIV)
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">MIV Number</th>
                    <th className="py-3 px-4">Project & Work Package</th>
                    <th className="py-3 px-4">From Store Depot</th>
                    <th className="py-3 px-4">Issued Material Lines</th>
                    <th className="py-3 px-4">Receiver & Contact</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {mivs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <ArrowUpRight className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No Material Issues Yet</p>
                        <p className="text-xs text-slate-500 mt-0.5">Click "+ Issue Material (MIV)" to issue materials to site work packages.</p>
                      </td>
                    </tr>
                  ) : (
                    mivs.map(miv => (
                    <tr key={miv.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#174A7E]">
                        {miv.mivNumber}
                        <span className="block text-[10px] text-slate-500">{miv.date}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{miv.projectName}</div>
                        <div className="text-[10px] text-slate-500">{miv.toLocation}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{miv.fromStore}</td>
                      <td className="py-3.5 px-4">
                        {miv.items.map((it, idx) => (
                          <div key={idx} className="font-semibold text-slate-800">
                            {it.itemName} • <span className="font-mono font-bold">{it.quantity} {it.unit}</span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{miv.receiverName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{miv.receiverPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onOpenDocPrint('MIV', miv)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ml-auto"
                        >
                          <Printer className="w-3.5 h-3.5" /> PDF Voucher
                        </button>
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

      {/* ======================= SUB-TAB 4: MATERIAL TRANSFER VOUCHER (MTV) ======================= */}
      {activeTab === 'mtv' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Material Transfer Vouchers (MTV)</h3>
            </div>
            <button
              onClick={() => setShowNewMTVModal(true)}
              className="px-4 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> + Transfer Materials (MTV)
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">MTV Number</th>
                    <th className="py-3 px-4">From Store → To Store</th>
                    <th className="py-3 px-4">Materials Transferred</th>
                    <th className="py-3 px-4">Vehicle & Driver</th>
                    <th className="py-3 px-4">Transfer Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {mtvs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No Inter-Store Transfers</p>
                        <p className="text-xs text-slate-500 mt-0.5">Click "+ Transfer Materials (MTV)" to transfer stock between project depots.</p>
                      </td>
                    </tr>
                  ) : (
                    mtvs.map(mtv => (
                    
                    <tr key={mtv.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#174A7E]">
                        {mtv.mtvNumber}
                        <span className="block text-[10px] text-slate-500">{mtv.date}</span>
                        {mtv.mrNo && <span className="block text-[10px] text-slate-500">Ref: {mtv.mrNo}</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{mtv.fromStore}</div>
                        <div className="text-emerald-700 font-bold text-[11px]">→ {mtv.toStore}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                           Source/Origin: {mtv.fromOfficeOrSite || mtv.sourceProjectId || mtv.fromStore}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {mtv.items.map((it, idx) => (

    <div key={idx} className="font-bold text-slate-800">
      {it.itemName} ({it.quantity} {it.unit})
      {it.sourceItemName && <span className="block text-[10px] text-slate-500 font-normal">Source: {it.sourceItemName}</span>}
    </div>
  ))}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">{mtv.vehicleNo}</div>
                        <div className="text-[10px] text-slate-500">{mtv.driverName} ({mtv.driverPhone})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={mtv.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {mtv.status === 'In Transit' && (
                            <button
                              onClick={() => receiveMTV(mtv.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
                            >
                              Receive at Depot
                            </button>
                          )}
                          <button
                            onClick={() => onOpenDocPrint('MTV', mtv)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" /> PDF
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

      {/* ======================= MODAL: NEW MIV ======================= */}
      {showNewMIVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Material Issue Voucher (MIV)</h3>
              </div>
              <button onClick={() => setShowNewMIVModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleMIVSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Project *</label>
                <select
                  value={mivProject}
                  onChange={e => setMivProject(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Source Store Depot *</label>
                <select
                  value={mivStore}
                  onChange={e => setMivStore(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <option value="Ashulia Central Store, Savar">Ashulia Central Store, Savar</option>
                  <option value="Sreemangal Regional Depot, Sylhet">Sreemangal Regional Depot, Sylhet</option>
                  <option value="Dhaka Expressway Site Store, Airport Yard">Dhaka Expressway Site Store, Airport Yard</option>
                </select>
              </div>

              
              <div className="mb-2">
                <label className="font-bold text-slate-700 block mb-1">Source Project / Material Origin *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Returned from Expressway Site, Extra material from Project X"
                  value={mtvSourceItem}
                  onChange={e => setMtvSourceItem(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Material Item *</label>
                  <select
                    value={mivItem}
                    onChange={e => setMivItem(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {items.map(it => {
                      const avail = stocks.find(s => s.itemId === it.id && s.storeName.includes(mivStore.split(',')[0]))?.availableQty || 0;
                      return (
                        <option key={it.id} value={it.id}>
                          {it.name} ({it.unit}) - Avail: {avail}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issue Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={mivQty}
                    onChange={e => setMivQty(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Receiver Name *</label>
                  <input
                    type="text"
                    required
                    value={mivReceiver}
                    onChange={e => setMivReceiver(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Receiver Mobile *</label>
                  <input
                    type="text"
                    required
                    value={mivPhone}
                    onChange={e => setMivPhone(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewMIVModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md"
                >
                  Post MIV & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: NEW MTV ======================= */}
      {showNewMTVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Material Transfer Voucher (MTV)</h3>
              </div>
              <button onClick={() => setShowNewMTVModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleMTVSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">From Depot Store *</label>
                  <select
                    value={mtvFromStore}
                    onChange={e => setMtvFromStore(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="Ashulia Central Store, Savar">Ashulia Central Store, Savar</option>
                    <option value="Sreemangal Regional Depot, Sylhet">Sreemangal Regional Depot, Sylhet</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">To Depot / Site Store *</label>
                  <select
                    value={mtvToStore}
                    onChange={e => setMtvToStore(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="Sreemangal Regional Depot, Sylhet">Sreemangal Regional Depot, Sylhet</option>
                    <option value="Ashulia Central Store, Savar">Ashulia Central Store, Savar</option>
                    <option value="Dhaka Expressway Site Store, Airport Yard">Dhaka Expressway Site Store</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Material Item *</label>
                  <select
                    value={mtvItem}
                    onChange={e => setMtvItem(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {items.map(it => {
                      const avail = stocks.find(s => s.itemId === it.id && s.storeName.includes(mtvFromStore.split(',')[0]))?.availableQty || 0;
                      return (
                        <option key={it.id} value={it.id}>
                          {it.name} ({it.unit}) - Avail: {avail}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transfer Qty *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={mtvQty}
                    onChange={e => setMtvQty(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transport Vehicle No *</label>
                  <input
                    type="text"
                    required
                    value={mtvVehicle}
                    onChange={e => setMtvVehicle(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Driver Name & Phone *</label>
                  <input
                    type="text"
                    required
                    value={mtvDriver}
                    onChange={e => setMtvDriver(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewMTVModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl font-bold shadow-md"
                >
                  Issue MTV & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal for Bin Cards */}
      <QRCodeModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData({ ...qrModalData, isOpen: false })}
        title={qrModalData.title}
        codeValue={qrModalData.codeValue}
        meta={qrModalData.meta}
      />
    </div>
  );
};
