const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf-8');

const targetStrStart = "{activeTab === 'receipts' && (";
const targetStrEnd = ")}\n          {activeTab === 'inventory' && (";

const startIndex = code.indexOf(targetStrStart);
const endIndex = code.indexOf(targetStrEnd);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find boundaries");
  process.exit(1);
}

const receiptsTab = `
          {activeTab === 'receipts' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600">GRN No</th>
                    <th className="p-3 font-bold text-slate-600">Date</th>
                    <th className="p-3 font-bold text-slate-600">Supplier / Vendor</th>
                    <th className="p-3 font-bold text-slate-600">Items</th>
                    <th className="p-3 font-bold text-slate-600">Status</th>
                    <th className="p-3 font-bold text-slate-600 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {grns.filter(g => g.projectId === selectedProjectId).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        No goods receipts found.
                      </td>
                    </tr>
                  ) : (
                    grns.filter(g => g.projectId === selectedProjectId).map(g => (
                      <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-blue-600 font-bold">{g.grnNumber}</td>
                        <td className="p-3">{g.date}</td>
                        <td className="p-3">{g.vendorName || g.supplierName}</td>
                        <td className="p-3">{g.items?.length || 0} items</td>
                        <td className="p-3"><StatusBadge status={g.status} /></td>
                        <td className="p-3 text-right">
                          {g.status !== 'Inspected & Posted' && (
                            <button
                              onClick={() => { setChallanTargetGRN(g); setShowChallanModal(true); }}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Upload Challan
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
`;

code = code.slice(0, startIndex) + receiptsTab.trim() + "\n" + code.slice(endIndex);
fs.writeFileSync('src/pages/ProjectsPage.tsx', code);
console.log("Replaced successfully!");
