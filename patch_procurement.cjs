const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

// Add states
const states = `
  const [showCSModal, setShowCSModal] = useState(false);
  const [csTargetPR, setCsTargetPR] = useState<PurchaseRequisition | null>(null);
  const [csSelectedItemIndex, setCsSelectedItemIndex] = useState<number>(0);
  const [csQuotations, setCsQuotations] = useState<any[]>([]);

  const handleOpenCSModal = (pr: PurchaseRequisition) => {
    setCsTargetPR(pr);
    setCsSelectedItemIndex(0);
    setCsQuotations([
      { vendorName: vendors[0]?.name || '', unitPrice: 0 },
      { vendorName: vendors[1]?.name || '', unitPrice: 0 }
    ]);
    setShowCSModal(true);
  };

  const handleAddQuotation = () => {
    setCsQuotations([...csQuotations, { vendorName: '', unitPrice: 0 }]);
  };

  const handleRemoveQuotation = (index: number) => {
    setCsQuotations(csQuotations.filter((_, i) => i !== index));
  };

  const handleQuotationChange = (index: number, field: string, value: any) => {
    const updated = [...csQuotations];
    updated[index] = { ...updated[index], [field]: value };
    setCsQuotations(updated);
  };

  const handleGenerateCS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csTargetPR) return;
    const targetItem = csTargetPR.items[csSelectedItemIndex];
    if (!targetItem) return;

    // Build quotations conforming to VendorQuotation
    const quotations = csQuotations.map((q, idx) => {
      const vendor = vendors.find(v => v.name === q.vendorName) || vendors[0];
      const totalAmt = q.unitPrice * targetItem.quantity;
      return {
        vendorId: vendor?.id || \`vnd-\${Date.now()}-\${idx}\`,
        vendorName: q.vendorName,
        quoteRef: \`Q-\${Date.now()}-\${idx}\`,
        quoteDate: new Date().toISOString().substring(0, 10),
        unitPrice: q.unitPrice,
        totalAmount: totalAmt,
        vatTaxAmount: 0,
        freightCost: 0,
        grandTotal: totalAmt,
        leadTimeDays: 7,
        warrantyPeriod: '',
        paymentTerms: '',
        technicalCompliance: 'Full Compliance',
        score: idx === 0 ? 98 : 85,
        isRecommended: idx === 0
      };
    });

    createComparativeStatement({
      prId: csTargetPR.id,
      prNumber: csTargetPR.prNumber,
      projectId: csTargetPR.projectId,
      projectName: csTargetPR.projectName,
      itemDescription: targetItem.itemDescription,
      specification: targetItem.specification,
      quantity: targetItem.quantity,
      unit: targetItem.unit,
      quotations,
      recommendedVendorId: quotations[0]?.vendorId || '',
      recommendationReason: 'Lowest evaluated responsive bidder.',
      preparedBy: currentUser?.name || 'Procurement Officer'
    });

    setShowCSModal(false);
    setActiveSubTab('cs');
  };
`;

code = code.replace(/const \[showNewMRModal, setShowNewMRModal\] = useState\(false\);/, states + '\n  const [showNewMRModal, setShowNewMRModal] = useState(false);');

// Replace button onClick
code = code.replace(/alert\("Please fill the comparative statement form.*?"\);/, 'handleOpenCSModal(pr);');

// Add Modal rendering at the end, right before final closing tags
const modalUI = `
      {showCSModal && csTargetPR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Generate Comparative Statement (CS)</h3>
                <p className="text-xs text-slate-500">PR: {csTargetPR.prNumber}</p>
              </div>
              <button onClick={() => setShowCSModal(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleGenerateCS} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select PR Item *</label>
                <select
                  value={csSelectedItemIndex}
                  onChange={(e) => setCsSelectedItemIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {csTargetPR.items.map((item, idx) => (
                    <option key={idx} value={idx}>{item.itemDescription} ({item.quantity} {item.unit})</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold text-slate-700">Vendor Quotations *</label>
                  <button type="button" onClick={handleAddQuotation} className="text-xs font-bold text-blue-600 hover:text-blue-700">+ Add Quote</button>
                </div>
                
                <div className="space-y-2">
                  {csQuotations.map((q, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded border border-slate-200">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Vendor Name"
                          value={q.vendorName}
                          onChange={(e) => handleQuotationChange(idx, 'vendorName', e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Unit Price"
                          value={q.unitPrice || ''}
                          onChange={(e) => handleQuotationChange(idx, 'unitPrice', Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                      {csQuotations.length > 1 && (
                        <button type="button" onClick={() => handleRemoveQuotation(idx)} className="text-red-500 hover:text-red-700 p-1">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Note: The first vendor in the list will be automatically marked as the recommended vendor.</p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCSModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700">Generate CS</button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

code = code.replace(/    <\/div>\n  \);\n};\n/, modalUI + '\n    </div>\n  );\n};\n');

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
