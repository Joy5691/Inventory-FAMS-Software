sed -i '/const renderGeneric = () => (/i \
  const renderFamsRegister = () => {\
    const assets = Array.isArray(data) ? data : [];\
    const totalCost = assets.reduce((s, a) => s + (a.purchaseCost || 0), 0);\
    const totalNBV = assets.reduce((s, a) => s + (a.currentNetBookValue || 0), 0);\
    return (\
      <>\
        {renderCommonHeader()}\
        <div className="text-center my-4">\
          <h2 className="inline-block text-xl font-bold tracking-wider uppercase px-6 py-1 border-2 border-black bg-gray-200">\
            FIXED ASSET REGISTER REPORT\
          </h2>\
        </div>\
        <div className="mb-4 flex justify-between text-sm">\
          <div><strong>Date of Report:</strong> {new Date().toISOString().substring(0,10)}</div>\
          <div><strong>Total Assets:</strong> {assets.length}</div>\
        </div>\
        <table className="w-full text-left text-xs border-collapse border border-black">\
          <thead>\
            <tr className="bg-gray-100">\
              <th className="border border-black p-2">Asset Code</th>\
              <th className="border border-black p-2">Name & Make</th>\
              <th className="border border-black p-2">Category</th>\
              <th className="border border-black p-2">Location</th>\
              <th className="border border-black p-2">Status</th>\
              <th className="border border-black p-2 text-right">Purchase Cost</th>\
              <th className="border border-black p-2 text-right">Net Book Value</th>\
            </tr>\
          </thead>\
          <tbody>\
            {assets.map((asset: any) => (\
              <tr key={asset.id}>\
                <td className="border border-black p-2 font-mono">{asset.assetCode}</td>\
                <td className="border border-black p-2">{asset.name}<br/><span className="text-[10px] text-gray-500">{asset.makeModel}</span></td>\
                <td className="border border-black p-2">{asset.category}</td>\
                <td className="border border-black p-2">{asset.currentLocation}</td>\
                <td className="border border-black p-2">{asset.status}</td>\
                <td className="border border-black p-2 text-right">{asset.purchaseCost?.toLocaleString()}</td>\
                <td className="border border-black p-2 text-right font-bold">{asset.currentNetBookValue?.toLocaleString()}</td>\
              </tr>\
            ))}\
          </tbody>\
          <tfoot>\
            <tr className="bg-gray-100 font-bold">\
              <td colSpan={5} className="border border-black p-2 text-right">GRAND TOTAL (BDT)</td>\
              <td className="border border-black p-2 text-right">{totalCost.toLocaleString()}</td>\
              <td className="border border-black p-2 text-right">{totalNBV.toLocaleString()}</td>\
            </tr>\
          </tfoot>\
        </table>\
        <div className="mt-20 grid grid-cols-2 gap-32 text-center text-sm font-bold">\
          <div className="border-t border-black pt-2">Prepared By (FAMS Admin)</div>\
          <div className="border-t border-black pt-2">Approved By (Head of Finance)</div>\
        </div>\
      </>\
    );\
  };\
\
  const renderFamsDepreciation = () => {\
    const assets = Array.isArray(data) ? data : [];\
    const DEP_RATE = 0.05;\
    const totalCost = assets.reduce((s, a) => s + (a.purchaseCost || 0), 0);\
    const totalDepreciation = assets.reduce((s, a) => s + ((a.purchaseCost || 0) * DEP_RATE), 0);\
    const totalNBV = assets.reduce((s, a) => s + ((a.purchaseCost || 0) - ((a.purchaseCost || 0) * DEP_RATE)), 0);\
    return (\
      <>\
        {renderCommonHeader()}\
        <div className="text-center my-4">\
          <h2 className="inline-block text-xl font-bold tracking-wider uppercase px-6 py-1 border-2 border-black bg-gray-200">\
            FIXED ASSET DEPRECIATION REPORT (5% RATE)\
          </h2>\
        </div>\
        <div className="mb-4 flex justify-between text-sm">\
          <div><strong>Date of Report:</strong> {new Date().toISOString().substring(0,10)}</div>\
          <div><strong>Depreciation Rate Applied:</strong> 5.00% (Straight Line)</div>\
        </div>\
        <table className="w-full text-left text-xs border-collapse border border-black">\
          <thead>\
            <tr className="bg-gray-100">\
              <th className="border border-black p-2">Asset Code</th>\
              <th className="border border-black p-2">Name</th>\
              <th className="border border-black p-2">Acquisition Date</th>\
              <th className="border border-black p-2 text-right">Original Cost</th>\
              <th className="border border-black p-2 text-right">Depreciation (5%)</th>\
              <th className="border border-black p-2 text-right">Revised NBV</th>\
            </tr>\
          </thead>\
          <tbody>\
            {assets.map((asset: any) => {\
              const cost = asset.purchaseCost || 0;\
              const dep = cost * DEP_RATE;\
              const nbv = cost - dep;\
              return (\
                <tr key={asset.id}>\
                  <td className="border border-black p-2 font-mono">{asset.assetCode}</td>\
                  <td className="border border-black p-2">{asset.name}</td>\
                  <td className="border border-black p-2">{asset.capitalizationDate}</td>\
                  <td className="border border-black p-2 text-right">{cost.toLocaleString()}</td>\
                  <td className="border border-black p-2 text-right text-red-700">({dep.toLocaleString()})</td>\
                  <td className="border border-black p-2 text-right font-bold text-emerald-700">{nbv.toLocaleString()}</td>\
                </tr>\
              );\
            })}\
          </tbody>\
          <tfoot>\
            <tr className="bg-gray-100 font-bold">\
              <td colSpan={3} className="border border-black p-2 text-right">TOTAL (BDT)</td>\
              <td className="border border-black p-2 text-right">{totalCost.toLocaleString()}</td>\
              <td className="border border-black p-2 text-right text-red-700">({totalDepreciation.toLocaleString()})</td>\
              <td className="border border-black p-2 text-right text-emerald-700">{totalNBV.toLocaleString()}</td>\
            </tr>\
          </tfoot>\
        </table>\
        <div className="mt-20 grid grid-cols-2 gap-32 text-center text-sm font-bold">\
          <div className="border-t border-black pt-2">Prepared By (FAMS Admin)</div>\
          <div className="border-t border-black pt-2">Approved By (Head of Finance)</div>\
        </div>\
      </>\
    );\
  };\
' src/components/documents/DocumentPrintModal.tsx
