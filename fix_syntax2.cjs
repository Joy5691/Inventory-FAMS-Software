const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');

// A bracket issue again! Let's carefully slice it out and put it back in.

let newCode = code.replace(/\{showChallanModal && challanTargetGRN && \(/g, "{showChallanModal && challanTargetGRN && (");

// we are missing the closing bracket for the parent div in some place, probably from my replacement
// Let's just fix it by replacing the end of the file.
let parts = code.split('</form>\n          </div>\n        </div>\n      )}');
if(parts.length > 2) {
    // The second occurrence is the Challan modal.
    parts[2] = '\n    </div>\n  );\n};\n';
    fs.writeFileSync('src/pages/ProjectsPage.tsx', parts.join('</form>\n          </div>\n        </div>\n      )}'), 'utf8');
} else {
    // maybe we deleted the challan modal? Let's check.
    const hasChallan = code.includes("Receive GRN / Upload Challan");
    if (!hasChallan) {
        console.log("Oh no, I deleted the challan modal.");
        
        // Append it before the final divs
        code = code.replace(/    <\/div>\n  \);\n\};\n?/g, `
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

                <button
                  type="submit"
                  className="w-full py-3 bg-[#174A7E] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#123a63] transition-all"
                >
                  Upload & Receive GRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
`);
        fs.writeFileSync('src/pages/ProjectsPage.tsx', code, 'utf8');
        console.log("Restored challan modal");
    }
}
