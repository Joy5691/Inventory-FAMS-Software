const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

// 1. Add State
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState\('stocks'\);/,
  `const [activeTab, setActiveTab] = useState('stocks');
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanTargetGRN, setChallanTargetGRN] = useState<any>(null);
  const [challanData, setChallanData] = useState({ 
    receivedDate: new Date().toISOString().split('T')[0], 
    approvedDate: new Date().toISOString().split('T')[0], 
    challanFileName: '' 
  });`
);

// 2. Change Button
code = code.replace(
  /onClick=\{\(\) => postGRN\(grn\.id\)\}/g,
  `onClick={() => { setChallanTargetGRN(grn); setShowChallanModal(true); }}`
);

// 3. Add Modal Component at end before export
const modalJSX = `
  {showChallanModal && challanTargetGRN && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Challan & Receive to Site</h3>
            <p className="text-xs text-slate-500">GRN Ref: {challanTargetGRN.grnNumber}</p>
          </div>
          <button onClick={() => setShowChallanModal(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-700">✕</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Approved Date</label>
            <input 
              type="date" 
              value={challanData.approvedDate}
              onChange={(e) => setChallanData({...challanData, approvedDate: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Received Date (Site)</label>
            <input 
              type="date" 
              value={challanData.receivedDate}
              onChange={(e) => setChallanData({...challanData, receivedDate: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Upload Delivery Challan</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-slate-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file or camera picture</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,application/pdf" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setChallanData({...challanData, challanFileName: e.target.files[0].name});
                      }
                    }} />
                  </label>
                </div>
                <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
                {challanData.challanFileName && <p className="text-xs font-bold text-emerald-600 mt-2">Selected: {challanData.challanFileName}</p>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-slate-100">
          <button onClick={() => setShowChallanModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
          <button 
            onClick={() => {
              postGRN(challanTargetGRN.id, challanData);
              setShowChallanModal(false);
            }} 
            className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-700"
          >
            Confirm & Receive Goods
          </button>
        </div>
      </div>
    </div>
  )}
`;

code = code.replace(/return \(/, modalJSX + '\n  return (');

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
