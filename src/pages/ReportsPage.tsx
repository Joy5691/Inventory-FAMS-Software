import React, { useState } from 'react';
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  Building,
  Boxes,
  ShoppingCart,
  HardHat,
  Truck,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';

export const ReportsPage: React.FC = () => {
  const { projects, stocks, assets, pos, mrs, gatePasses } = useApp();
  const [selectedReport, setSelectedReport] = useState<'procurement' | 'stock' | 'fams' | 'gate'>('procurement');

  const totalStockValuation = stocks.reduce((s, it) => s + it.totalValuation, 0);
  const totalAssetGross = assets.reduce((s, a) => s + a.purchaseCost, 0);
  const totalAssetNBV = assets.reduce((s, a) => s + a.currentNetBookValue, 0);
  const totalPOAmount = pos.reduce((s, p) => s + p.grandTotal, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">Official Reports & Business Analytics Center</h3>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-[#174A7E] font-mono text-[11px] font-bold">
              Ready to Export
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standard executive formats formatted for Management Review meetings, Board Audits, and Tax filings.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Printer className="w-4 h-4" /> Print / Save Active Report PDF
        </button>
      </div>

      {/* Report Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        {[
          { id: 'procurement', label: 'Procurement Spend Report', icon: ShoppingCart, count: `৳${(totalPOAmount / 10000000).toFixed(2)}Cr` },
          { id: 'stock', label: 'Store Stock Valuation Ledger', icon: Boxes, count: `৳${(totalStockValuation / 10000000).toFixed(2)}Cr` },
          { id: 'fams', label: 'Fixed Asset (FAMS) Register', icon: HardHat, count: `৳${(totalAssetNBV / 10000000).toFixed(2)}Cr` },
          { id: 'gate', label: 'Material Gate Movement Log', icon: Truck, count: `${gatePasses.length} Passes` }
        ].map(r => {
          const Icon = r.icon;
          const isSel = selectedReport === r.id;

          return (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSel
                  ? 'bg-gradient-to-br from-[#174A7E] to-[#102A43] text-slate-900 shadow-md border-[#174A7E]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <Icon className={`w-5 h-5 ${isSel ? 'text-sky-300' : 'text-slate-500'}`} />
                <span className={`font-mono text-xs font-bold ${isSel ? 'text-sky-200' : 'text-[#174A7E]'}`}>
                  {r.count}
                </span>
              </div>
              <div className="font-bold text-xs">{r.label}</div>
            </button>
          );
        })}
      </div>

      {/* Formal Printable Document Canvas */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 printable-document">
        {/* Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Logo variant="dark" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black italic tracking-tight text-[#174A7E]">
                  Technic Construction Company Ltd.
                </h1>
                <p className="text-[10px] font-semibold text-slate-600">
                  Head Office: House # 221, Road # 2, DOHS Baridhara, Dhaka-1206
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-500 font-mono">
              <div>Report Date: {new Date().toLocaleDateString()}</div>
              <div>Audit Scope: All Depots & Sites</div>
            </div>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wide">
            {selectedReport === 'procurement' && 'EXECUTIVE PROCUREMENT & PURCHASE ORDER COMMITMENT AUDIT'}
            {selectedReport === 'stock' && 'STORE STOCK INVENTORY VALUATION & RECONCILIATION STATEMENT'}
            {selectedReport === 'fams' && 'FIXED ASSET MANAGEMENT (FAMS) MACHINERY & DEPRECIATION SCHEDULE'}
            {selectedReport === 'gate' && 'MATERIAL GATE CLEARANCE & CARRIER MOVEMENT LOG'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">TECHNIC Enterprise ERP Certified Data</p>
        </div>

        {/* ======================= REPORT 1: PROCUREMENT ======================= */}
        {selectedReport === 'procurement' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-semibold">
              <div>Total PO Volume: <strong className="font-mono text-slate-900">{pos.length} Orders</strong></div>
              <div>Gross Commitment: <strong className="font-mono text-slate-900">BDT {(totalPOAmount || 0).toLocaleString()}</strong></div>
              <div>Active Projects: <strong className="font-mono text-slate-900">{projects.length} Sites</strong></div>
            </div>

            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-200 text-[11px]">
                  <th className="border border-slate-200 p-2">PO #</th>
                  <th className="border border-slate-200 p-2">Project Name</th>
                  <th className="border border-slate-200 p-2">Vendor Name</th>
                  <th className="border border-slate-200 p-2 text-right">Order Value (BDT)</th>
                  <th className="border border-slate-200 p-2 text-center">Due Date</th>
                  <th className="border border-slate-200 p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {pos.map((p, idx) => (
                  <tr key={idx} className="border-b border-slate-300">
                    <td className="border border-slate-200 p-2 font-mono font-bold">{p.poNumber}</td>
                    <td className="border border-slate-200 p-2">{p.projectName}</td>
                    <td className="border border-slate-200 p-2 font-semibold">{p.vendorName}</td>
                    <td className="border border-slate-200 p-2 text-right font-mono font-bold">
                      ৳{(p.grandTotal || 0).toLocaleString()}
                    </td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{p.deliveryDueDate}</td>
                    <td className="border border-slate-200 p-2 text-center font-bold text-emerald-700">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================= REPORT 2: STORE STOCKS ======================= */}
        {selectedReport === 'stock' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-semibold">
              <div>Total Catalog Items: <strong className="font-mono text-slate-900">{stocks.length} Lines</strong></div>
              <div>Gross Stock Valuation: <strong className="font-mono text-emerald-700">BDT {(totalStockValuation || 0).toLocaleString()}</strong></div>
              <div>Depot Hubs: <strong className="font-mono text-slate-900">Ashulia & Sreemangal</strong></div>
            </div>

            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-200 text-[11px]">
                  <th className="border border-slate-200 p-2">Item Code & Name</th>
                  <th className="border border-slate-200 p-2">Depot Store</th>
                  <th className="border border-slate-200 p-2 text-center">Unit</th>
                  <th className="border border-slate-200 p-2 text-right">Physical On Hand</th>
                  <th className="border border-slate-200 p-2 text-right">Unit Rate (BDT)</th>
                  <th className="border border-slate-200 p-2 text-right">Total Valuation (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {stocks.map((s, idx) => (
                  <tr key={idx} className="border-b border-slate-300">
                    <td className="border border-slate-200 p-2 font-bold">{s.itemName} ({s.itemCode})</td>
                    <td className="border border-slate-200 p-2">{s.storeName}</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{s.unit}</td>
                    <td className="border border-slate-200 p-2 text-right font-mono font-bold">{(s.quantityOnHand || 0).toLocaleString()}</td>
                    <td className="border border-slate-200 p-2 text-right font-mono">৳{(s.averageUnitCost || 0).toLocaleString()}</td>
                    <td className="border border-slate-200 p-2 text-right font-mono font-bold text-slate-900">
                      ৳{(s.totalValuation || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================= REPORT 3: FAMS ASSETS ======================= */}
        {selectedReport === 'fams' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-semibold">
              <div>Total Machines: <strong className="font-mono text-slate-900">{assets.length} Units</strong></div>
              <div>Capitalized Cost: <strong className="font-mono text-slate-900">BDT {(totalAssetGross || 0).toLocaleString()}</strong></div>
              <div>Current NBV: <strong className="font-mono text-emerald-700">BDT {(totalAssetNBV || 0).toLocaleString()}</strong></div>
            </div>

            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-200 text-[11px]">
                  <th className="border border-slate-200 p-2">Asset Code</th>
                  <th className="border border-slate-200 p-2">Equipment Description</th>
                  <th className="border border-slate-200 p-2">Deployed Site</th>
                  <th className="border border-slate-200 p-2 text-right">Purchase Cost (Tk)</th>
                  <th className="border border-slate-200 p-2 text-right">Net Book Value (Tk)</th>
                  <th className="border border-slate-200 p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {assets.map((a, idx) => (
                  <tr key={idx} className="border-b border-slate-300">
                    <td className="border border-slate-200 p-2 font-mono font-bold text-[#174A7E]">{a.assetCode}</td>
                    <td className="border border-slate-200 p-2 font-semibold">{a.name} ({a.serialChassisNo})</td>
                    <td className="border border-slate-200 p-2">{a.projectName}</td>
                    <td className="border border-slate-200 p-2 text-right font-mono">৳{(a.purchaseCost || 0).toLocaleString()}</td>
                    <td className="border border-slate-200 p-2 text-right font-mono font-bold text-emerald-800">
                      ৳{(a.currentNetBookValue || 0).toLocaleString()}
                    </td>
                    <td className="border border-slate-200 p-2 text-center font-bold text-emerald-700">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================= REPORT 4: GATE MOVEMENT ======================= */}
        {selectedReport === 'gate' && (
          <div className="space-y-4">
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-200 text-[11px]">
                  <th className="border border-slate-200 p-2">Gate Pass #</th>
                  <th className="border border-slate-200 p-2">Pass Type</th>
                  <th className="border border-slate-200 p-2">Vehicle No & Driver</th>
                  <th className="border border-slate-200 p-2">Origin → Destination</th>
                  <th className="border border-slate-200 p-2 text-center">Security Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {gatePasses.map((gp, idx) => (
                  <tr key={idx} className="border-b border-slate-300">
                    <td className="border border-slate-200 p-2 font-mono font-bold">{gp.gatePassNo}</td>
                    <td className="border border-slate-200 p-2 font-semibold">{gp.passType}</td>
                    <td className="border border-slate-200 p-2 font-mono">{gp.vehicleNo} ({gp.driverName})</td>
                    <td className="border border-slate-200 p-2">{gp.fromParty} → {gp.toParty}</td>
                    <td className="border border-slate-200 p-2 text-center font-bold text-emerald-700">
                      {gp.securityStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Signature Lines */}
        <div className="grid grid-cols-3 gap-6 pt-16 mt-8 border-t border-slate-400 text-center text-xs">
          <div>
            <div className="border-t border-slate-200 pt-1 font-bold">Md. Delwar Hossain</div>
            <div className="text-[10px] text-slate-500">Prepared By (Store / Accounts)</div>
          </div>
          <div>
            <div className="border-t border-slate-200 pt-1 font-bold">Mohammad Faruk, FCA</div>
            <div className="text-[10px] text-slate-500">Checked & Audited By</div>
          </div>
          <div>
            <div className="border-t border-slate-200 pt-1 font-bold">Brig. Gen. (Retd.) M. A. Hasan</div>
            <div className="text-[10px] text-slate-500">Managing Director / CEO</div>
          </div>
        </div>
      </div>
    </div>
  );
};
