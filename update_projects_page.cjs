const fs = require('fs');

let content = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf-8');

// 1. Update destructuring
content = content.replace(
  'const { projects, mrs, prs, grns, mivs, mtvs, stocks, addProject } = useApp();',
  'const { projects, mrs, prs, grns, mivs, mtvs, stocks, addProject, items, createMR, currentUser, activeRole } = useApp();'
);

// 2. Add New MR Modal states
const statesToAdd = `
  const [showNewMRModal, setShowNewMRModal] = useState(false);
  const [mrLocation, setMrLocation] = useState('Airport-Kuril Section, Dhaka');
  const [mrDepartment, setMrDepartment] = useState('Civil Construction');
  const [mrWBS, setMrWBS] = useState('Pier Substructure (WBS-01)');
  const [mrCostCode, setMrCostCode] = useState('MAT-STL-002 (Rebar 500W)');
  const [mrDueDate, setMrDueDate] = useState('2026-09-15');
  const [mrPriority, setMrPriority] = useState<any>('High');
  const [mrItems, setMrItems] = useState<any[]>([]);

  const openNewMRModal = () => {
    if (!selectedProject) return;
    setMrLocation(selectedProject.location || '');
    setMrItems([{
      itemId: items[0]?.id || 'itm-1',
      itemDescription: items[0]?.name || 'Portland Cement (OPC Grade 53)',
      specification: items[0]?.specification || '50 Kg Bag',
      unit: items[0]?.unit || 'Bags',
      quantity: 500,
      estimatedUnitPrice: 575,
      ledger: 'Substructure Concreting'
    }]);
    setShowNewMRModal(true);
  };

  const handleAddItemRow = () => {
    setMrItems(prev => [
      ...prev,
      {
        itemId: items[1]?.id || 'itm-2',
        itemDescription: items[1]?.name || 'Deformed Steel Rebar 500W',
        specification: items[1]?.specification || 'Grade 500W',
        unit: items[1]?.unit || 'MT',
        quantity: 10,
        estimatedUnitPrice: 96500,
        ledger: 'Reinforcement Steel Cage'
      }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (mrItems.length > 1) {
      setMrItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleItemSelect = (index: number, selectedItemId: string) => {
    const selected = items.find((it: any) => it.id === selectedItemId);
    if (!selected) return;
    setMrItems(prev => prev.map((row, i) => i === index ? {
      ...row,
      itemId: selected.id,
      itemDescription: selected.name,
      specification: selected.specification,
      unit: selected.unit,
      estimatedUnitPrice: selected.unitPriceEstimate
    } : row));
  };

  const handleCreateMRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    createMR({
      date: new Date().toISOString().substring(0, 10),
      dueDate: mrDueDate,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      location: mrLocation,
      department: mrDepartment,
      wbsCode: mrWBS,
      costCode: mrCostCode,
      purchaseType: 'Goods / Materials',
      priority: mrPriority,
      items: mrItems.map((it, idx) => ({
        id: \`mr-itm-\${Date.now()}-\${idx}\`,
        itemId: it.itemId,
        itemDescription: it.itemDescription,
        specification: it.specification,
        unit: it.unit,
        quantity: Number(it.quantity),
        classification: 'Raw Material',
        estimatedUnitPrice: Number(it.estimatedUnitPrice),
        ledger: it.ledger
      })),
      initiatedBy: currentUser?.name || 'User',
      initiatedByRole: activeRole,
      status: 'Pending Verification'
    });
    setShowNewMRModal(false);
  };
`;
content = content.replace(
  'const formatCurrency = (val: number) => {',
  statesToAdd + '\n  const formatCurrency = (val: number) => {'
);

// 3. Add 'Create Requisition' button in the requisitions tab.
// Find: {activeTab === 'requisitions' && (
// Insert inside it, before <div className="overflow-x-auto">
const buttonHtml = `
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Material Requisitions</h3>
              <button 
                onClick={openNewMRModal}
                className="px-4 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-lg text-sm font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Requisition
              </button>
            </div>
`;
content = content.replace(
  "{activeTab === 'requisitions' && (\n            <div className=\"overflow-x-auto\">",
  "{activeTab === 'requisitions' && (\n          <>" + buttonHtml + "<div className=\"overflow-x-auto\">"
);
// replace closing tag for activeTab === 'requisitions'
content = content.replace(
  "                  )}\n                </tbody>\n              </table>\n            </div>\n          )}",
  "                  )}\n                </tbody>\n              </table>\n            </div>\n          </>\n          )}"
);

// 4. Inject Modal HTML at the end of the return statement before the last </div>
const modalHtml = `
      {/* NEW MATERIAL REQUISITION MODAL */}
      {showNewMRModal && selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-[#174A7E] text-white p-5 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold">New Material Requisition (MR)</h2>
                <p className="text-blue-200 text-sm mt-1">Project: {selectedProject.name}</p>
              </div>
              <button 
                onClick={() => setShowNewMRModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateMRSubmit} className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                  <input type="date" value={mrDueDate} onChange={e => setMrDueDate(e.target.value)} required className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                  <select value={mrPriority} onChange={e => setMrPriority(e.target.value as any)} className="w-full border border-slate-300 rounded-lg p-2 text-sm">
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                  <input type="text" value={mrDepartment} onChange={e => setMrDepartment(e.target.value)} required className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WBS Code</label>
                  <input type="text" value={mrWBS} onChange={e => setMrWBS(e.target.value)} required className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700">Requested Items</h3>
                  <button type="button" onClick={handleAddItemRow} className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-semibold text-slate-600">Item</th>
                        <th className="p-3 font-semibold text-slate-600">Specification</th>
                        <th className="p-3 font-semibold text-slate-600 w-24">Unit</th>
                        <th className="p-3 font-semibold text-slate-600 w-32">Qty</th>
                        <th className="p-3 font-semibold text-slate-600 w-32">Est. Price</th>
                        <th className="p-3 font-semibold text-slate-600 w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {mrItems.map((row, index) => (
                        <tr key={index} className="border-b border-slate-100">
                          <td className="p-2">
                            <select value={row.itemId} onChange={e => handleItemSelect(index, e.target.value)} className="w-full border border-slate-300 rounded-md p-1.5 text-sm">
                              {items.map((it: any) => (
                                <option key={it.id} value={it.id}>{it.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2"><input type="text" value={row.specification} onChange={e => { const newItems = [...mrItems]; newItems[index].specification = e.target.value; setMrItems(newItems); }} className="w-full border border-slate-300 rounded-md p-1.5 text-sm" /></td>
                          <td className="p-2"><input type="text" value={row.unit} onChange={e => { const newItems = [...mrItems]; newItems[index].unit = e.target.value; setMrItems(newItems); }} className="w-full border border-slate-300 rounded-md p-1.5 text-sm" /></td>
                          <td className="p-2"><input type="number" value={row.quantity} onChange={e => { const newItems = [...mrItems]; newItems[index].quantity = Number(e.target.value); setMrItems(newItems); }} className="w-full border border-slate-300 rounded-md p-1.5 text-sm" min="1" required /></td>
                          <td className="p-2"><input type="number" value={row.estimatedUnitPrice} onChange={e => { const newItems = [...mrItems]; newItems[index].estimatedUnitPrice = Number(e.target.value); setMrItems(newItems); }} className="w-full border border-slate-300 rounded-md p-1.5 text-sm" min="0" required /></td>
                          <td className="p-2 text-center">
                            <button type="button" onClick={() => handleRemoveItemRow(index)} disabled={mrItems.length === 1} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50">
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setShowNewMRModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white rounded-xl font-bold shadow-md">
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

content = content.replace(
  '    </div>\n  );\n};',
  modalHtml + '\n    </div>\n  );\n};'
);

fs.writeFileSync('src/pages/ProjectsPage.tsx', content);
console.log('Project page updated successfully!');

