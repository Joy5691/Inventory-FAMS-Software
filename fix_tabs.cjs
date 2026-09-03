const fs = require('fs');
let content = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf-8');

const replacement = `
          {activeTab === 'requisitions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600">MR No</th>
                    <th className="p-3 font-bold text-slate-600">Date</th>
                    <th className="p-3 font-bold text-slate-600">Items</th>
                    <th className="p-3 font-bold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mrs.filter(mr => mr.projectId === selectedProjectId).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        No requisitions found.
                      </td>
                    </tr>
                  ) : (
                    mrs.filter(mr => mr.projectId === selectedProjectId).map(mr => (
                      <tr key={mr.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-blue-600 font-bold">{mr.mrNumber}</td>
                        <td className="p-3">{mr.date}</td>
                        <td className="p-3">{mr.items.length} items</td>
                        <td className="p-3"><StatusBadge status={mr.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'receipts' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600">GRN No</th>
                    <th className="p-3 font-bold text-slate-600">Date</th>
                    <th className="p-3 font-bold text-slate-600">Supplier</th>
                    <th className="p-3 font-bold text-slate-600">Items</th>
                    <th className="p-3 font-bold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {grns.filter(g => g.projectId === selectedProjectId).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        No goods receipts found.
                      </td>
                    </tr>
                  ) : (
                    grns.filter(g => g.projectId === selectedProjectId).map(g => (
                      <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-blue-600 font-bold">{g.grnNumber}</td>
                        <td className="p-3">{g.date}</td>
                        <td className="p-3">{g.supplierName}</td>
                        <td className="p-3">{g.items.length} items</td>
                        <td className="p-3"><StatusBadge status={g.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'inventory' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600">Item Code</th>
                    <th className="p-3 font-bold text-slate-600">Item Name</th>
                    <th className="p-3 font-bold text-slate-600">Store/Location</th>
                    <th className="p-3 font-bold text-slate-600 text-right">Available Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.filter(s => s.projectId === selectedProjectId).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        <Archive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        No inventory records linked to this project.
                      </td>
                    </tr>
                  ) : (
                    stocks.filter(s => s.projectId === selectedProjectId).map(s => (
                      <tr key={s.itemId + s.storeName} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold">{s.itemCode}</td>
                        <td className="p-3 font-bold text-slate-800">{s.itemName}</td>
                        <td className="p-3 text-slate-500">{s.storeName}</td>
                        <td className="p-3 text-right font-bold">{s.availableQty} {s.unit}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                        <td className="p-3">{m.items.length} items</td>
                        <td className="p-3"><StatusBadge status={m.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
`;

const startIdx = content.indexOf("{activeTab === 'requisitions' && (");
const endIdx = content.indexOf('</div>\n      </div>\n    </div>\n  );\n};');

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + replacement.trim() + '\n        ' + content.substring(endIdx);
  fs.writeFileSync('src/pages/ProjectsPage.tsx', content);
  console.log('Fixed tabs!');
} else {
  console.log('Could not find boundaries.');
}
