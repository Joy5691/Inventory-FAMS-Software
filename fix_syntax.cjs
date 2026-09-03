const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');

// I will find the activeTab === 'assets' section and correctly substitute the entire block.
const assetsStart = code.indexOf("{activeTab === 'assets' && (");
const challanModalStart = code.indexOf("{showChallanModal && challanTargetGRN && (");

if (assetsStart > -1 && challanModalStart > -1) {
    const replacement = `          {activeTab === 'assets' && (
            <div className="space-y-4">
              <div className="flex justify-end px-4 pt-4">
                <button
                  onClick={() => setShowAssetRequisitionModal(true)}
                  className="px-4 py-2 bg-[#174A7E] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#123a63] transition-all"
                >
                  + Request Fixed Asset
                </button>
              </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600">Asset Code</th>
                    <th className="p-3 font-bold text-slate-600">Asset Name</th>
                    <th className="p-3 font-bold text-slate-600">Category</th>
                    <th className="p-3 font-bold text-slate-600">Custodian</th>
                    <th className="p-3 font-bold text-slate-600">Location</th>
                    <th className="p-3 font-bold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.filter(a => a.projectId === selectedProjectId).length > 0 ? (
                    assets.filter(a => a.projectId === selectedProjectId).map(asset => (
                      <tr key={asset.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-600">{asset.assetCode}</td>
                        <td className="p-3 font-bold">{asset.name}</td>
                        <td className="p-3"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{asset.category}</span></td>
                        <td className="p-3 font-medium">{asset.custodianName}</td>
                        <td className="p-3">{asset.currentLocation}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => alert('Release requested to FAMS.')} 
                            className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100"
                          >
                            Release
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                        No fixed assets assigned to this project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ASSET REQUISITION MODAL */}
      {showAssetRequisitionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#174A7E] p-4 text-white flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">Request Fixed Asset</h2>
                <p className="text-blue-100 text-xs">For {projects.find(p => p.id === selectedProjectId)?.name}</p>
              </div>
              <button onClick={() => setShowAssetRequisitionModal(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              alert("Asset Requisition submitted for Head Office Approval");
              setShowAssetRequisitionModal(false);
            }}>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Category *</label>
                  <select 
                    value={assetReqData.requestedCategory}
                    onChange={e => setAssetReqData({...assetReqData, requestedCategory: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                    required
                  >
                    <option value="Heavy Earthmoving">Heavy Earthmoving</option>
                    <option value="Lifting & Cranes">Lifting & Cranes</option>
                    <option value="Concrete & Mixing">Concrete & Mixing</option>
                    <option value="Survey & Testing">Survey & Testing</option>
                    <option value="Power & Generator">Power & Generator</option>
                    <option value="Site Vehicle">Site Vehicle</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
                    <input 
                      type="number" 
                      min="1"
                      value={assetReqData.quantity}
                      onChange={e => setAssetReqData({...assetReqData, quantity: parseInt(e.target.value)})}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Required Date *</label>
                    <input 
                      type="date" 
                      value={assetReqData.requiredDate}
                      onChange={e => setAssetReqData({...assetReqData, requiredDate: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Justification / Purpose *</label>
                  <textarea 
                    value={assetReqData.justification}
                    onChange={e => setAssetReqData({...assetReqData, justification: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm h-24"
                    placeholder="Why is this equipment needed?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#174A7E] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#123a63] transition-all"
                >
                  Submit Asset Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIVE CHALLAN MODAL */}
      `;
    
    code = code.slice(0, assetsStart) + replacement + code.slice(challanModalStart + "{showChallanModal && challanTargetGRN && (".length);
    fs.writeFileSync('src/pages/ProjectsPage.tsx', code, 'utf8');
    console.log("Fixed JSX");
} else {
    console.log("Could not find start boundaries");
}
