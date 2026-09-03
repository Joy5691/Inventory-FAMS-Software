const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

if (!code.includes('Printer')) {
    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, Printer} from 'lucide-react';");
}

code = code.replace(
  "return { location: loc, assetCount: siteAssets.length, capCost, nbv, accumDep };",
  "return { location: loc, assets: siteAssets, assetCount: siteAssets.length, capCost, nbv, accumDep };"
);

const oldReportBlock = `<div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Site-Wise Asset Depreciation Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/50 text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-bold">Site / Location</th>
                  <th className="px-4 py-3 font-bold text-right">No. of Assets</th>
                  <th className="px-4 py-3 font-bold text-right">Capitalized Cost (BDT)</th>
                  <th className="px-4 py-3 font-bold text-right">Accumulated Dep. (BDT)</th>
                  <th className="px-4 py-3 font-bold text-right">Net Book Value (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteWiseData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#174A7E]">{row.location}</td>
                    <td className="px-4 py-3 font-semibold text-right">{row.assetCount}</td>
                    <td className="px-4 py-3 font-mono text-slate-700 text-right">৳{row.capCost.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-amber-700 text-right">৳{row.accumDep.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-emerald-700 font-bold text-right">৳{row.nbv.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                <tr>
                  <td className="px-4 py-3 text-slate-900">GRAND TOTAL</td>
                  <td className="px-4 py-3 text-right">{assets.length}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-900">৳{totalCapCost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-800">৳{totalDepreciation.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-800">৳{totalNBV.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>`;

const newReportBlock = `<div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center print:hidden">
            <h3 className="font-bold text-slate-800 text-sm">Site-Wise Asset Depreciation Report</h3>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#174A7E] text-white text-xs font-bold rounded-lg hover:bg-[#174A7E]/90 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Generate PDF Report
            </button>
          </div>
          
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-slate-900 text-center uppercase tracking-wider">Fixed Asset Depreciation Report</h1>
            <p className="text-center text-slate-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/50 text-slate-500 uppercase print:bg-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">Asset Details (Code & Name)</th>
                  <th className="px-4 py-3 font-bold">Useful Life</th>
                  <th className="px-4 py-3 font-bold text-right">Capitalized Cost</th>
                  <th className="px-4 py-3 font-bold text-right">Accumulated Dep.</th>
                  <th className="px-4 py-3 font-bold text-right">Net Book Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteWiseData.map((row, idx) => (
                  <React.Fragment key={idx}>
                    {/* Site Header Row */}
                    <tr className="bg-slate-50 print:bg-slate-100">
                      <td colSpan={2} className="px-4 py-3 font-bold text-[#174A7E] print:text-black">
                        {row.location} <span className="text-slate-500 font-normal ml-2">({row.assetCount} assets)</span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 text-right">৳{row.capCost.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono font-bold text-amber-800 text-right">৳{row.accumDep.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-800 text-right">৳{row.nbv.toLocaleString()}</td>
                    </tr>
                    
                    {/* Asset Rows */}
                    {row.assets.map(asset => (
                      <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2 pl-8">
                          <div className="font-mono font-bold text-slate-700">{asset.assetCode}</div>
                          <div className="text-slate-500 text-[11px] truncate w-64" title={asset.name}>{asset.name}</div>
                        </td>
                        <td className="px-4 py-2 text-slate-600">{asset.usefulLifeYears} Yrs</td>
                        <td className="px-4 py-2 font-mono text-slate-600 text-right">৳{asset.purchaseCost.toLocaleString()}</td>
                        <td className="px-4 py-2 font-mono text-amber-600/80 text-right">৳{(asset.purchaseCost - asset.currentNetBookValue).toLocaleString()}</td>
                        <td className="px-4 py-2 font-mono font-medium text-emerald-700 text-right">৳{asset.currentNetBookValue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold print:bg-slate-200">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-slate-900 text-sm uppercase">GRAND TOTAL ({assets.length} ASSETS)</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-900">৳{totalCapCost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-800">৳{totalDepreciation.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-800">৳{totalNBV.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>`;

if (code.includes(oldReportBlock)) {
    code = code.replace(oldReportBlock, newReportBlock);
    console.log("Successfully replaced report block");
} else {
    console.log("Error: old report block not found. Checking if partially modified...");
    
    // Use regex to find it dynamically just in case there are whitespace differences
    const blockStart = `<div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">`;
    const blockEnd = `        </div>`;
    
    // We know it's right after `      ) : (` and before `{/* ======================= MODAL: NEW ASSET ======================= */}`
    const startIdx = code.indexOf(") : (");
    const endIdx = code.indexOf("{/* ======================= MODAL: NEW ASSET ======================= */}");
    
    if (startIdx > -1 && endIdx > -1) {
       const existingContent = code.substring(startIdx + 5, endIdx).trim();
       if (existingContent.startsWith('<div')) {
           code = code.substring(0, startIdx + 5) + "\n        " + newReportBlock + "\n\n      " + code.substring(endIdx);
           console.log("Successfully replaced via index block replacement.");
       } else {
           console.log("Unexpected content between start and end idx");
       }
    } else {
       console.log("Could not find start/end markers.");
    }
}

fs.writeFileSync('src/pages/FAMSPage.tsx', code);

