const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

const challanModalJSX = `
      {showChallanModal && challanTargetGRN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Supplier Challan</h3>
                <p className="text-sm text-slate-500">GRN Ref: {challanTargetGRN.grnNumber}</p>
              </div>
              <button onClick={() => setShowChallanModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // In a real app this would upload a file and return a URL
              const fileInput = e.target.elements.namedItem('challanFile');
              const fileName = fileInput.files?.[0]?.name || 'Supplier_Challan_Scanned.pdf';
              
              // Post the GRN
              postGRN(challanTargetGRN.id, {
                receivedDate: challanData.receivedDate,
                approvedDate: challanData.approvedDate,
                challanFileName: fileName
              });
              
              setShowChallanModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receive Date</label>
                  <input 
                    type="date" 
                    required
                    value={challanData.receivedDate}
                    onChange={(e) => setChallanData({...challanData, receivedDate: e.target.value})}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#174A7E]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Upload Challan Document</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      id="challanFile"
                      name="challanFile"
                      required
                      className="hidden" 
                      onChange={(e) => {
                        const name = e.target.files?.[0]?.name;
                        if(name) setChallanData({...challanData, challanFileName: name});
                      }}
                    />
                    <label htmlFor="challanFile" className="cursor-pointer">
                      <div className="text-slate-500 text-sm font-medium mb-1">
                        {challanData.challanFileName ? challanData.challanFileName : "Click to upload or drag & drop"}
                      </div>
                      <div className="text-xs text-slate-400">PDF, PNG, JPG (Max 5MB)</div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-slate-200">
                <button type="button" onClick={() => setShowChallanModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

code = code.replace(
  /\{\/\* QR Code Modal for Bin Cards \*\/\}/,
  challanModalJSX + "\n      {/* QR Code Modal for Bin Cards */}"
);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
