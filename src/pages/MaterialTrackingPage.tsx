import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Printer,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { QRCodeModal } from '../components/common/QRCodeModal';
import { GatePassType } from '../types';

interface MaterialTrackingPageProps {
  onOpenDocPrint: (type: any, data: any) => void;
}

export const MaterialTrackingPage: React.FC<MaterialTrackingPageProps> = ({ onOpenDocPrint }) => {
  const {
    gatePasses,
    projects,
    createGatePass,
    verifyGatePassSecurity,
    markGatePassReturned,
    currentUser
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<'ALL' | GatePassType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPassModal, setShowNewPassModal] = useState(false);

  // QR Modal
  const [qrModalData, setQrModalData] = useState<{
    isOpen: boolean;
    title: string;
    codeValue: string;
    meta: { label: string; value: string }[];
    gatePassId?: string;
    isVerified?: boolean;
  }>({
    isOpen: false,
    title: '',
    codeValue: '',
    meta: []
  });

  // New Gate Pass Form
  const [gpType, setGpType] = useState<GatePassType>('Non-Returnable Gate Pass');
  const [gpProject, setGpProject] = useState(projects[0]?.id || '');
  const [gpTo, setGpTo] = useState('Subcontractor Work Area, Pier Section-4');
  const [gpFrom, setGpFrom] = useState('TECHNIC Central Store, Savar, Dhaka');
  const [gpVehicle, setGpVehicle] = useState('Dhaka Metro-Ta-14-8821 (Covered Van)');
  const [gpDriver, setGpDriver] = useState('Milon Hossain');
  const [gpDriverPhone, setGpDriverPhone] = useState('+880 1712-445566');
  const [gpRef, setGpRef] = useState('MIV-2026-0031');
  const [gpReturnDate, setGpReturnDate] = useState('2026-09-25');
  const [gpItems, setGpItems] = useState<{
    particulars: string;
    unit: string;
    quantity: number;
    remarks: string;
  }[]>([
    {
      particulars: 'Scaffolding Cuplock Steel Pipe 48mm',
      unit: 'Pcs',
      quantity: 150,
      remarks: 'Heavy duty galvanised'
    }
  ]);

  const filteredPasses = gatePasses.filter(gp => {
    const matchesType = typeFilter === 'ALL' || gp.passType === typeFilter;
    const matchesSearch = gp.gatePassNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gp.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gp.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gp.toParty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === gpProject);

    createGatePass({
      date: new Date().toISOString().substring(0, 10),
      passType: gpType,
      toParty: gpTo,
      fromParty: gpFrom,
      projectId: gpProject,
      projectName: proj?.name || 'Dhaka Elevated Expressway Phase-3',
      vehicleNo: gpVehicle,
      driverName: gpDriver,
      driverPhone: gpDriverPhone,
      refDocument: gpRef,
      expectedReturnDate: gpType === 'Returnable Gate Pass' ? gpReturnDate : undefined,
      items: gpItems.map((it, idx) => ({
        slNo: idx + 1,
        particulars: it.particulars,
        unit: it.unit,
        quantity: Number(it.quantity),
        remarks: it.remarks
      })),
      issuedBy: currentUser?.name || 'Md. Delwar Hossain (Store Officer)',
      notes: 'Material dispatched in sound condition for carrying purpose only.'
    });

    setShowNewPassModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Gate Pass #, Vehicle, Driver..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#174A7E]"
            />
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {(['ALL', 'Non-Returnable Gate Pass', 'Returnable Gate Pass', 'Delivery Challan'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  typeFilter === t
                    ? 'bg-white text-[#174A7E] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'ALL' ? 'All Gate Passes' : t.replace('Gate Pass', 'GP')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowNewPassModal(true)}
          className="px-4 py-2.5 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> + Issue Gate Pass / Challan
        </button>
      </div>

      {/* Gate Pass Cards List */}
      {filteredPasses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">No Gate Passes Issued</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Click "+ Issue Gate Pass / Challan" above to generate dispatch gate clearance passes and QR delivery challans.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPasses.map(gp => {
          const isReturnable = gp.passType === 'Returnable Gate Pass';
          const isCleared = (gp.status || 'Pending Gate Out') === 'Security Cleared & Out' || (gp.status || 'Pending Gate Out') === 'Returned & Re-inspected';

          return (
            <div key={gp.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-[#174A7E]">{gp.gatePassNo}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isReturnable ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {gp.passType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Memo: {gp.memoNo || gp.gatePassNo} • {gp.date}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setQrModalData({
                      isOpen: true,
                      title: `Gate Clearance Pass: ${gp.gatePassNo}`,
                      codeValue: gp.qrCodeData || `TCCL-GATE|${gp.gatePassNo}|${gp.vehicleNo}|${gp.driverPhone}`,
                      meta: [
                        { label: 'Gate Pass #', value: gp.gatePassNo },
                        { label: 'Pass Type', value: gp.passType },
                        { label: 'Vehicle Number', value: gp.vehicleNo },
                        { label: 'Driver Info', value: `${gp.driverName} (${gp.driverPhone})` },
                        { label: 'Project Dest.', value: gp.projectName },
                        { label: 'Security State', value: (gp.status || 'Pending Gate Out') }
                      ],
                      gatePassId: gp.id,
                      isVerified: isCleared
                    })}
                    className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#174A7E] transition-colors"
                    title="Digital Gate QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenDocPrint('GP', gp)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Print Official Challan Document"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Destination & Transport Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">From (Origin):</span>
                  <span className="font-semibold text-slate-800 line-clamp-1">{gp.fromParty}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">To (Destination):</span>
                  <span className="font-semibold text-slate-800 line-clamp-1">{gp.toParty}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Vehicle No:</span>
                  <span className="font-mono font-bold text-slate-900">{gp.vehicleNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Driver & Phone:</span>
                  <span className="text-slate-800">{gp.driverName} ({gp.driverPhone})</span>
                </div>
              </div>

              {/* Particulars Table */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Carried Materials Particulars:
                </span>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-[10px] text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="py-1.5 px-3">Item Particulars</th>
                        <th className="py-1.5 px-3 text-center">Unit</th>
                        <th className="py-1.5 px-3 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {gp.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-semibold text-slate-800">{it.particulars}</td>
                          <td className="py-2 px-3 text-center font-mono text-slate-600">{it.unit}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{it.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security Status & Return Tracking Controls */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={(gp.status || 'Pending Gate Out')} size="sm" />
                  {isReturnable && gp.expectedReturnDate && (
                    <span className="text-[10px] font-mono text-amber-700 font-semibold">
                      Due: {gp.expectedReturnDate}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {(gp.status || 'Pending Gate Out') === 'Pending Gate Out' && (
                    <button
                      onClick={() => verifyGatePassSecurity(gp.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Gate Clear Out
                    </button>
                  )}

                  {isReturnable && (gp.status || 'Pending Gate Out') === 'Security Cleared & Out' && (
                    <button
                      onClick={() => markGatePassReturned(gp.id)}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Record Return
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* ======================= MODAL: NEW GATE PASS ======================= */}
      {showNewPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Official Gate Pass / Challan</h3>
              </div>
              <button onClick={() => setShowNewPassModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pass Category *</label>
                  <select
                    value={gpType}
                    onChange={e => setGpType(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  >
                    <option value="Non-Returnable Gate Pass">Non-Returnable Gate Pass (NRGP)</option>
                    <option value="Returnable Gate Pass">Returnable Gate Pass (RGP - Tools/Equipment)</option>
                    <option value="Delivery Challan">Official Delivery Challan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project Name *</label>
                  <select
                    value={gpProject}
                    onChange={e => setGpProject(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dispatch From (Origin) *</label>
                  <input
                    type="text"
                    required
                    value={gpFrom}
                    onChange={e => setGpFrom(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dispatch To (Destination) *</label>
                  <input
                    type="text"
                    required
                    value={gpTo}
                    onChange={e => setGpTo(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transport Vehicle Number *</label>
                  <input
                    type="text"
                    required
                    value={gpVehicle}
                    onChange={e => setGpVehicle(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Driver Name & Mobile *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Driver Name"
                      value={gpDriver}
                      onChange={e => setGpDriver(e.target.value)}
                      className="w-1/2 p-2 rounded-xl bg-slate-50 border border-slate-200"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Driver Mobile"
                      value={gpDriverPhone}
                      onChange={e => setGpDriverPhone(e.target.value)}
                      className="w-1/2 p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                {gpType === 'Returnable Gate Pass' && (
                  <div className="col-span-2 bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <label className="font-bold text-purple-900 block mb-1">Expected Return Due Date *</label>
                    <input
                      type="date"
                      required
                      value={gpReturnDate}
                      onChange={e => setGpReturnDate(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white border border-purple-300 font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-900 mb-2">Particulars of Material Lines:</h4>
                <div className="space-y-2">
                  {gpItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-bold block">Material Particulars</label>
                        <input
                          type="text"
                          required
                          value={item.particulars}
                          onChange={e => {
                            const val = e.target.value;
                            setGpItems(prev => prev.map((r, i) => i === idx ? { ...r, particulars: val } : r));
                          }}
                          className="w-full p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1/2">
                          <label className="text-[10px] text-slate-500 font-bold block">Unit</label>
                          <input
                            type="text"
                            required
                            value={item.unit}
                            onChange={e => {
                              const val = e.target.value;
                              setGpItems(prev => prev.map((r, i) => i === idx ? { ...r, unit: val } : r));
                            }}
                            className="w-full p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <div className="w-1/2">
                          <label className="text-[10px] text-slate-500 font-bold block">Quantity</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={item.quantity}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setGpItems(prev => prev.map((r, i) => i === idx ? { ...r, quantity: val } : r));
                            }}
                            className="w-full p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewPassModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl font-bold shadow-md"
                >
                  Issue Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Security Clearance Modal */}
      <QRCodeModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData({ ...qrModalData, isOpen: false })}
        title={qrModalData.title}
        codeValue={qrModalData.codeValue}
        meta={qrModalData.meta}
        isVerified={qrModalData.isVerified}
        onVerifySecurity={() => {
          if (qrModalData.gatePassId) {
            verifyGatePassSecurity(qrModalData.gatePassId);
            setQrModalData({ ...qrModalData, isVerified: true });
          }
        }}
      />
    </div>
  );
};
