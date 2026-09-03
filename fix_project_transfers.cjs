const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf-8');

code = code.replace(
  /\{ id: 'transfers', label: 'Material Transfers', icon: Truck \}/,
  "{ id: 'transfers', label: 'Receipts & Transfers', icon: Truck }"
);

const newTransfersTab = `
          {activeTab === 'transfers' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 mb-3 text-sm">Goods Received Notes (Incoming)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-3 font-bold text-slate-600">GRN No</th>
                        <th className="p-3 font-bold text-slate-600">Date</th>
                        <th className="p-3 font-bold text-slate-600">Supplier / From</th>
                        <th className="p-3 font-bold text-slate-600">PO Ref</th>
                        <th className="p-3 font-bold text-slate-600">Items</th>
                        <th className="p-3 font-bold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grns.filter(g => g.projectId === selectedProjectId).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">
                            No goods receipts found.
                          </td>
                        </tr>
                      ) : (
                        grns.filter(g => g.projectId === selectedProjectId).map(g => (
                          <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-emerald-600 font-bold">{g.grnNumber}</td>
                            <td className="p-3">{g.date}</td>
                            <td className="p-3 font-bold text-slate-700">{g.vendorName}</td>
                            <td className="p-3 text-xs text-slate-500">{g.poNumber}</td>
                            <td className="p-3">{g.items?.length || 0} items</td>
                            <td className="p-3"><StatusBadge status={g.status} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-800 mb-3 text-sm">Material Transfers (Site & Stores)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border border-slate-200 rounded-lg overflow-hidden">
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
              </div>
            </div>
          )}
`;

code = code.replace(
  /\{activeTab === 'transfers' && \([\s\S]*?\}\s*\)\}\s*<\/div>\s*<\/div>\s*\)/,
  newTransfersTab.trim() + "\n        </div>\n      </div>\n    )"
);

fs.writeFileSync('src/pages/ProjectsPage.tsx', code);
