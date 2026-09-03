const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

const issuePOModalJSX = `{showIssuePOModal && poTargetCS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Issue Purchase Orders</h3>
                <p className="text-xs text-slate-500">CS Ref: {poTargetCS.csNumber}</p>
              </div>
              <button onClick={() => setShowIssuePOModal(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-700">✕</button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-700 mb-3 font-semibold">Select Vendors to Issue POs to:</p>
              <div className="space-y-2">
                {poTargetCS.quotations.map((q: any) => (
                  <label key={q.vendorId} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      checked={poSelectedVendors.includes(q.vendorId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPoSelectedVendors([...poSelectedVendors, q.vendorId]);
                        } else {
                          setPoSelectedVendors(poSelectedVendors.filter(id => id !== q.vendorId));
                        }
                      }}
                    />
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{q.vendorName}</div>
                      <div className="text-xs text-slate-500">Quote: {q.quoteRef} • Items: {q.items.length} • Total: ৳{q.grandTotal.toLocaleString()}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button onClick={() => setShowIssuePOModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
              <button 
                onClick={handleIssueMultiplePOs} 
                disabled={poSelectedVendors.length === 0}
                className="px-4 py-2 bg-[#174A7E] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-sm hover:bg-[#123a63]"
              >
                Issue {poSelectedVendors.length > 0 ? poSelectedVendors.length : ''} PO(s)
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showCSModal &&`;

code = code.replace(/\{showCSModal &&/g, issuePOModalJSX);
// this replacement is a bit dangerous if showCSModal appears multiple times, but I'll check it.

// Just do it carefully.
