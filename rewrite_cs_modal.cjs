const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

// 1. Remove handleQuotationChange
code = code.replace(
  /const handleQuotationChange = \([\s\S]*?\}\n\s*setCsQuotations\(newQ\);\n\s*\};\n/,
  `
  const handleQuotationChange = (vendorIdx: number, field: string, value: any) => {
    const newQ = [...csQuotationsData];
    newQ[vendorIdx][field] = value;
    setCsQuotationsData(newQ);
  };
  
  const handleCSItemChange = (vendorIdx: number, itemIdx: number, field: string, value: any) => {
    const newQ = [...csQuotationsData];
    newQ[vendorIdx].items[itemIdx][field] = value;
    setCsQuotationsData(newQ);
  };
  
  const handleRemoveCSItem = (vendorIdx: number, itemIdx: number) => {
    const newQ = [...csQuotationsData];
    newQ[vendorIdx].items.splice(itemIdx, 1);
    setCsQuotationsData(newQ);
  };
  
  const handleRemoveCSQuotation = (idx: number) => {
    const newQ = [...csQuotationsData];
    newQ.splice(idx, 1);
    setCsQuotationsData(newQ);
  };
  `
);

// 2. Replace the old Modal JSX
const oldModalRegex = /\{showCSModal && csTargetPR && \([\s\S]*?<\/form>\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/;
const newCSModalJSX = `{showCSModal && csTargetPR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Generate Comparative Statement (CS)</h3>
                <p className="text-xs text-slate-500">PR: {csTargetPR.prNumber}</p>
              </div>
              <button onClick={() => setShowCSModal(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleGenerateCS} className="space-y-6 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 text-sm">Vendor Quotations</label>
                <button type="button" onClick={handleAddCSQuotation} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold transition-colors">
                  + Add Vendor
                </button>
              </div>

              {csQuotationsData.map((q, vIdx) => (
                <div key={vIdx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Vendor Name"
                      value={q.vendorName}
                      onChange={(e) => handleQuotationChange(vIdx, 'vendorName', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                      required
                    />
                    {csQuotationsData.length > 1 && (
                      <button type="button" onClick={() => handleRemoveCSQuotation(vIdx)} className="text-rose-500 hover:text-rose-700 font-bold p-1">
                        Remove Vendor
                      </button>
                    )}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2">Item Description</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Unit Price</th>
                          <th className="p-2 text-right">Total</th>
                          <th className="p-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {q.items.map((it: any, iIdx: number) => (
                          <tr key={iIdx} className="hover:bg-slate-50">
                            <td className="p-2 font-medium text-slate-800">{it.itemDescription}</td>
                            <td className="p-2">{it.quantity} {it.unit}</td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                placeholder="Price"
                                value={it.unitPrice || ''}
                                onChange={(e) => handleCSItemChange(vIdx, iIdx, 'unitPrice', Number(e.target.value))}
                                className="w-24 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                              />
                            </td>
                            <td className="p-2 text-right font-mono font-medium text-slate-600">
                              {(it.unitPrice * it.quantity).toLocaleString()}
                            </td>
                            <td className="p-2 text-center">
                              <button type="button" onClick={() => handleRemoveCSItem(vIdx, iIdx)} className="text-slate-400 hover:text-rose-600">
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {q.items.length === 0 && (
                      <div className="p-4 text-center text-slate-500 italic">No items selected for this vendor.</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCSModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700">Generate CS</button>
              </div>
            </form>
          </div>
        </div>
      )}`;
      
code = code.replace(oldModalRegex, newCSModalJSX);

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
