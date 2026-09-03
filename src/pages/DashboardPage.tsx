import React from 'react';
import {
  TrendingUp,
  Boxes,
  ShoppingCart,
  HardHat,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  Building2,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  Cpu,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';

interface DashboardPageProps {
  onNavigateTab?: (tab: string) => void;
  onOpenDoc?: (type: any, data: any) => void;
  onOpenDocPrint?: (type: any, data: any) => void;
}

const MONTHLY_SPEND_DATA = [
  { month: 'Apr', spend: 18.5, budget: 22.0 },
  { month: 'May', spend: 24.2, budget: 26.0 },
  { month: 'Jun', spend: 31.8, budget: 30.0 },
  { month: 'Jul', spend: 28.4, budget: 32.0 },
  { month: 'Aug', spend: 35.6, budget: 38.0 },
  { month: 'Sep (Est)', spend: 29.0, budget: 35.0 }
];

const STORE_STOCK_DIST = [
  { name: 'Ashulia Central', value: 45, color: '#3b82f6' },
  { name: 'Sreemangal Regional', value: 25, color: '#0ea5e9' },
  { name: 'Dhaka Expressway Site', value: 20, color: '#6366f1' },
  { name: 'Chittagong Port Site', value: 10, color: '#64748b' }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateTab,
  onOpenDoc,
  onOpenDocPrint
}) => {
  const {
    currentUser,
    projects,
    mrs,
    prs,
    pos,
    stocks,
    assets,
    approvalTasks,
    auditLogs
  } = useApp();

  const pendingApprovals = approvalTasks.filter(t => t.status === 'Pending');
  const totalAssetValue = assets.reduce((s, a) => s + (a.currentNetBookValue || a.purchaseCost), 0);
  const lowStockCount = stocks.filter(s => s.availableQty <= 20).length;

  return (
    <div className="space-y-6">
      {/* Main Module Navigation Cards (Uiverse Custom Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { id: 'procurement', title: 'Procurement & Purchase', color: '#0ea5e9' },
          { id: 'inventory', title: 'Inventory & Warehouse', color: '#10b981' },
          { id: 'tracking', title: 'Gate Pass / Challan', color: '#f59e0b' },
          { id: 'fams', title: 'Asset Mgmt (FAMS)', color: '#8b5cf6' },
          { id: 'projects', title: 'Projects', color: '#ec4899' }
        ].map(mod => (
          <a
            key={mod.id}
            href="#"
            className="uiverse-card cursor-pointer"
            style={{ '--card-color': mod.color } as React.CSSProperties}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateTab) onNavigateTab(mod.id);
            }}
          >
            <h3>{mod.title}</h3>
            <div className="go-corner">
              <div className="go-arrow">→</div>
            </div>
          </a>
        ))}
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => onNavigateTab && onNavigateTab('dashboard')}
          className="bg-white  border border-slate-200 hover:border-blue-500/50 rounded-2xl p-4 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Projects</span>
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200 group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{projects.length}</div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> 100% On Schedule
          </span>
        </div>

        <div
          onClick={() => onNavigateTab && onNavigateTab('approvals')}
          className="bg-white  border border-slate-200 hover:border-amber-500/50 rounded-2xl p-4 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Approvals</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{pendingApprovals.length}</div>
          <span className="text-[10px] text-amber-400 font-medium mt-1 block">Requires action</span>
        </div>

        <div
          onClick={() => onNavigateTab && onNavigateTab('procurement')}
          className="bg-white  border border-slate-200 hover:border-blue-500/50 rounded-2xl p-4 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Requisitions</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{mrs.length}</div>
          <span className="text-[10px] text-slate-500 mt-1 block font-medium">Requisitions active</span>
        </div>

        <div
          onClick={() => onNavigateTab && onNavigateTab('procurement')}
          className="bg-white  border border-slate-200 hover:border-emerald-500/50 rounded-2xl p-4 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active POs</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{pos.length}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block font-medium">Commercial orders</span>
        </div>

        <div
          onClick={() => onNavigateTab && onNavigateTab('inventory')}
          className="bg-white  border border-slate-200 hover:border-rose-500/50 rounded-2xl p-4 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low Stock</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">{lowStockCount}</div>
          <span className="text-[10px] text-rose-400 font-medium mt-1 block">Below safety threshold</span>
        </div>

        <div
          onClick={() => onNavigateTab && onNavigateTab('fams')}
          className="bg-white  border border-slate-200 hover:border-blue-500/50 rounded-2xl p-4 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Plant (FAMS)</span>
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200 group-hover:scale-110 transition-transform">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            ৳{(totalAssetValue / 10000000).toFixed(1)}Cr
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block font-medium">{assets.length} Heavy equipment</span>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Procurement Trend Chart */}
        <div className="lg:col-span-2 bg-white  border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Procurement Spend vs Project Budget (Crore BDT)</h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200 font-mono">
              FY 2026-27
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SPEND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#334155" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#334155" />
                <Tooltip
                  formatter={(val: any) => [`৳${val} Crore`, '']}
                  contentStyle={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#spendGradient)" name="Actual Spend" />
                <Area type="monotone" dataKey="budget" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" fill="none" name="Allocated Budget" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Store-wise Stock Distribution */}
        <div className="bg-white  border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Inventory Distribution by Store</h3>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STORE_STOCK_DIST}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {STORE_STOCK_DIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            {STORE_STOCK_DIST.map((s, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }}></span>
                  <span className="text-slate-600 font-medium">{s.name}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Approval Queue */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Urgent Approval Queue</h3>
              <p className="text-[11px] text-slate-500">Commercial requisitions, POs, and MTVs awaiting management sign-off</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('approvals')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All ({pendingApprovals.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">All Approvals Up to Date</p>
            <p className="text-xs text-slate-500 mt-0.5">No pending documents requiring your review at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {pendingApprovals.slice(0, 3).map(task => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900">{task.documentNumber}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                      {task.documentType}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{task.projectName}</p>
                  <span className="text-[11px] text-slate-500 font-medium">Req by: {task.requestedBy}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {task.amount ? `৳${task.amount.toLocaleString()}` : 'Stock Issue'}
                  </span>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('approvals')}
                    className="px-3 py-1 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Construction Projects Portfolio Strip */}
      <div className="bg-white  border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Active Construction Projects Overview</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map(proj => {
            const pct = Math.round((proj.spentBudget / proj.budget) * 100);
            return (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-blue-500/40 transition-all space-y-3"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {proj.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">{proj.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{proj.location}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Budget Spent:</span>
                    <span className="font-mono font-bold text-slate-700">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>৳{(proj.spentBudget / 10000000).toFixed(1)}Cr spent</span>
                    <span>৳{(proj.budget / 10000000).toFixed(1)}Cr total</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">PM: {proj.manager.split(',')[0]}</span>
                  <StatusBadge status={proj.status} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

