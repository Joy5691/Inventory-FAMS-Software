const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf-8');

const modalCode = `
      {/* RECEIVE CHALLAN MODAL */}
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

const insertIndex = code.lastIndexOf('    </div>\n  );\n};');
if (insertIndex !== -1) {
  code = code.slice(0, insertIndex) + modalCode + '\n' + code.slice(insertIndex);
  fs.writeFileSync('src/pages/ProjectsPage.tsx', code);
  console.log("Success");
} else {
  console.log("Failed to find insertion point");
}
