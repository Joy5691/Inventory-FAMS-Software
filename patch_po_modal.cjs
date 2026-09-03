const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

const poModalJSX = `
      {showIssuePOModal && poTargetCS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Issue Purchase Orders</h3>
                <p className="text-sm text-slate-500">CS Ref: {poTargetCS.csNumber} • {poTargetCS.projectName}</p>
              </div>
              <button onClick={() => setShowIssuePOModal(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            
            <div className="mb-4 text-sm text-slate-700">
              Select the vendors you wish to issue Purchase Orders to based on this Comparative Statement.
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {poTargetCS.quotations.map((q: any) => {
                const isSelected = poSelectedVendors.includes(q.vendorId);
                const isRecommended = q.vendorId === poTargetCS.recommendedVendorId || q.isRecommended;
                
                return (
                  <label key={q.vendorId} className={\`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all \${isSelected ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}\`}>
                    <div className="pt-1">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPoSelectedVendors([...poSelectedVendors, q.vendorId]);
                          } else {
                            setPoSelectedVendors(poSelectedVendors.filter(id => id !== q.vendorId));
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {q.vendorName}
                          {isRecommended && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase rounded-full">Recommended</span>}
                        </div>
                        <div className="font-mono font-bold text-[#174A7E]">
                          ৳{(q.grandTotal || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Ref: {q.quoteRef} • Items: {q.items?.length || 0}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-slate-200">
              <button onClick={() => setShowIssuePOModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
              <button 
                onClick={() => {
                  handleIssueMultiplePOs();
                  setShowIssuePOModal(false);
                }} 
                disabled={poSelectedVendors.length === 0}
                className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-sm"
              >
                Dispatch Selected POs ({poSelectedVendors.length})
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  /\{showCSModal && csTargetPR && \(/,
  poModalJSX + "\\n      {showCSModal && csTargetPR && ("
);

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
