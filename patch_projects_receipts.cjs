const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf-8');

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

code = code.replace(
  /\{activeTab === 'receipts' && \([\s\S]*?\}\s*\)\}\s*<\/tbody>\s*<\/table>\s*<\/div>\s*\)\}/,
  receiptsTab.trim()
);

const modalCode = `
      {showChallanModal && challanTargetGRN && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#174A7E] p-4 text-white flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">Receive GRN / Upload Challan</h2>
                <p className="text-blue-100 text-xs">For {challanTargetGRN.grnNumber}</p>
              </div>
              <button onClick={() => setShowChallanModal(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const fileInput = e.target.elements.namedItem('challanFile');
              const fileName = fileInput.files?.[0]?.name || 'Supplier_Challan_Scanned.pdf';
              
              postGRN(challanTargetGRN.id, {
                receivedDate: challanData.receivedDate,
                approvedDate: challanData.approvedDate,
                challanFileName: fileName
              });
              
              setShowChallanModal(false);
            }}>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Received Date</label>
                    <input 
                      type="date" 
                      value={challanData.receivedDate}
                      onChange={e => setChallanData({...challanData, receivedDate: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Approved Date</label>
                    <input 
                      type="date" 
                      value={challanData.approvedDate}
                      onChange={e => setChallanData({...challanData, approvedDate: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Upload Challan Document</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      id="challanFile"
                      name="challanFile"
                      accept="image/*,application/pdf"
                      capture="environment"
                      required
                      className="hidden" 
                      onChange={(e) => {
                        const name = e.target.files?.[0]?.name;
                        if(name) setChallanData({...challanData, challanFileName: name});
                      }}
                    />
                    <label htmlFor="challanFile" className="cursor-pointer">
                      <div className="text-slate-500 text-sm font-medium mb-1">
                        {challanData.challanFileName ? challanData.challanFileName : "Tap to capture or upload"}
                      </div>
                      <div className="text-xs text-slate-400">PDF, PNG, JPG (Camera supported)</div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowChallanModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-bold bg-[#174A7E] text-white hover:bg-[#174A7E]/90 rounded-lg"
                >
                  Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

code = code.replace(
  /export const ProjectsPage/,
  "export const ProjectsPage"
);
// Insert modal at the end before final export/div
let insertPos = code.lastIndexOf("</>");
if (insertPos === -1) {
    insertPos = code.lastIndexOf("</div>");
}
code = code.slice(0, insertPos) + modalCode + code.slice(insertPos);

fs.writeFileSync('src/pages/ProjectsPage.tsx', code);
