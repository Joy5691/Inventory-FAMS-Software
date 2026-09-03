const fs = require('fs');

let page = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');

// Insert asset requisition modal states
page = page.replace(
  /const \[isLoading, setIsLoading\] = useState\(true\);/,
  `const [isLoading, setIsLoading] = useState(true);
  
  const [showAssetRequisitionModal, setShowAssetRequisitionModal] = useState(false);
  const [assetReqData, setAssetReqData] = useState({
    requestedCategory: 'Heavy Earthmoving',
    quantity: 1,
    requiredDate: new Date().toISOString().split('T')[0],
    justification: ''
  });`
);

// Insert Asset Requisition button next to "No fixed assets" or at the top of the assets tab
page = page.replace(
  /<th className="p-3 font-bold text-slate-600">Location<\/th>\n\s*<\/tr>/,
  `<th className="p-3 font-bold text-slate-600">Location</th>
                  </tr>`
);

// Add action header and action buttons
page = page.replace(
  /<th className="p-3 font-bold text-slate-600">Location<\/th>/,
  `<th className="p-3 font-bold text-slate-600">Location</th>
                    <th className="p-3 font-bold text-slate-600 text-right">Actions</th>`
);

page = page.replace(
  /<td className="p-3">\{asset.currentLocation\}<\/td>\n\s*<\/tr>/g,
  `<td className="p-3">{asset.currentLocation}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => alert('Release requested to FAMS.')} 
                            className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100"
                          >
                            Release
                          </button>
                        </td>
                      </tr>`
);

// Add the Request Asset Button
page = page.replace(
  /\{activeTab === 'assets' && \(/,
  `{activeTab === 'assets' && (
            <div className="space-y-4">
              <div className="flex justify-end px-4 pt-4">
                <button
                  onClick={() => setShowAssetRequisitionModal(true)}
                  className="px-4 py-2 bg-[#174A7E] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#123a63] transition-all"
                >
                  + Request Fixed Asset
                </button>
              </div>`
);

page = page.replace(
  /<\/table>\n\s*<\/div>\n\s*\)}/,
  `</table>
              </div>
            </div>
          )}`
);

const modalCode = `

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
`;

page = page.replace(
  /\{showChallanModal && challanTargetGRN && \(/,
  modalCode + '\n      {showChallanModal && challanTargetGRN && ('
);

fs.writeFileSync('src/pages/ProjectsPage.tsx', page, 'utf8');
console.log('Asset requisition added');
