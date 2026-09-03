const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

// Add viewMode state and locationFilter state
code = code.replace("const [categoryFilter, setCategoryFilter] = useState<'ALL' | AssetCategory>('ALL');",
`const [categoryFilter, setCategoryFilter] = useState<'ALL' | AssetCategory>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'REPORT'>('LIST');`);

// Update uniqueLocations and filteredAssets
code = code.replace("const filteredAssets = assets.filter(a => {",
`const uniqueLocations = Array.from(new Set(assets.map(a => a.currentLocation))).filter(Boolean).sort();
  const filteredAssets = assets.filter(a => {
    const matchesLoc = locationFilter === 'ALL' || a.currentLocation === locationFilter;`);
    
code = code.replace("return matchesCat && matchesSearch;",
`return matchesCat && matchesLoc && matchesSearch;`);

// Add Site-wise Report logic
code = code.replace("const totalDepreciation = totalCapCost - totalNBV;",
`const totalDepreciation = totalCapCost - totalNBV;

  const siteWiseData = uniqueLocations.map(loc => {
    const siteAssets = assets.filter(a => a.currentLocation === loc);
    const capCost = siteAssets.reduce((sum, a) => sum + a.purchaseCost, 0);
    const nbv = siteAssets.reduce((sum, a) => sum + a.currentNetBookValue, 0);
    const accumDep = capCost - nbv;
    return { location: loc, assetCount: siteAssets.length, capCost, nbv, accumDep };
  });`);

// Update filters UI to include location and View tabs
// Find: {/* Filter and Create Controls */} and replace the div structure.
// Instead of complex replacement, let's inject after the top valuation strip:
code = code.replace("{/* Filter and Create Controls */}",
`{/* View Tabs */}
      <div className="flex border-b border-slate-200 mb-4">
        <button
          onClick={() => setViewMode('LIST')}
          className={\`px-4 py-2 text-sm font-bold border-b-2 transition-colors \${viewMode === 'LIST' ? 'border-[#174A7E] text-[#174A7E]' : 'border-transparent text-slate-500 hover:text-slate-700'}\`}
        >
          Asset Register
        </button>
        <button
          onClick={() => setViewMode('REPORT')}
          className={\`px-4 py-2 text-sm font-bold border-b-2 transition-colors \${viewMode === 'REPORT' ? 'border-[#174A7E] text-[#174A7E]' : 'border-transparent text-slate-500 hover:text-slate-700'}\`}
        >
          Site-Wise Depreciation Report
        </button>
      </div>

      {/* Filter and Create Controls */}`);

// We need to conditionally render Asset Cards vs Report Table
// Replace: {/* Asset Cards Grid */}
// With a condition `if (viewMode === 'LIST') ... else ...`

const cardsStart = code.indexOf("{/* Asset Cards Grid */}");
const modalsStart = code.indexOf("{/* ======================= MODAL: NEW ASSET ======================= */}");

const cardsBlock = code.substring(cardsStart, modalsStart);

const newCardsBlock = `
      {viewMode === 'LIST' ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <select
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="ALL">All Sites & Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          ` + cardsBlock + `
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
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
        </div>
      )}

      `;

code = code.replace(cardsBlock, newCardsBlock);

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
console.log("FAMSPage.tsx patched successfully");
