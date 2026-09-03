const fs = require('fs');

let content = fs.readFileSync('src/components/documents/DocumentPrintModal.tsx', 'utf-8');

const assetRenderer = `
  const renderAssetCard = () => {
    const asset = data;
    return (
      <>
        {renderCommonHeader()}
        <div className="text-center my-4">
          <h2 className="inline-block text-xl font-bold tracking-wider uppercase px-6 py-1 border-2 border-black bg-gray-200">
            FIXED ASSET REGISTRATION CARD (FAMS)
          </h2>
        </div>
        <div className="mb-4 text-sm flex justify-between">
          <div><strong>Date:</strong> {new Date().toISOString().substring(0,10)}</div>
          <div><strong>Asset Code:</strong> {asset.assetCode}</div>
        </div>

        <div className="border-2 border-black p-4 mb-6 relative">
          <div className="absolute top-4 right-4 border border-black p-2 w-24 h-24 flex flex-col items-center justify-center bg-gray-50">
            <QrCode className="w-12 h-12 text-black mb-1" />
            <span className="text-[8px] font-mono">{asset.qrCode || asset.assetCode}</span>
          </div>

          <h3 className="font-bold text-lg border-b border-black pb-2 mb-4 w-3/4">1. General Information</h3>
          <table className="w-3/4 text-sm mb-4">
            <tbody>
              <tr><td className="w-1/3 py-1 font-bold">Asset Name:</td><td>{asset.name}</td></tr>
              <tr><td className="py-1 font-bold">Category:</td><td>{asset.category}</td></tr>
              <tr><td className="py-1 font-bold">Make / Model:</td><td>{asset.makeModel || 'N/A'}</td></tr>
              <tr><td className="py-1 font-bold">Serial / Chassis No:</td><td>{asset.serialChassisNo || 'N/A'}</td></tr>
              <tr><td className="py-1 font-bold">Capitalization Date:</td><td>{asset.capitalizationDate}</td></tr>
            </tbody>
          </table>

          <h3 className="font-bold text-lg border-b border-black pb-2 mb-4">2. Financial Information</h3>
          <table className="w-full text-sm mb-4">
            <tbody>
              <tr>
                <td className="w-1/4 py-1 font-bold">Purchase Cost (BDT):</td><td className="w-1/4">{asset.purchaseCost?.toLocaleString()}</td>
                <td className="w-1/4 py-1 font-bold">Useful Life:</td><td className="w-1/4">{asset.usefulLifeYears} Years</td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Depreciation Method:</td><td>{asset.depreciationMethod}</td>
                <td className="py-1 font-bold">Residual Value (BDT):</td><td>{asset.residualValue?.toLocaleString() || 0}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Current NBV (BDT):</td><td className="font-bold text-emerald-700">{asset.currentNetBookValue?.toLocaleString()}</td>
                <td className="py-1 font-bold"></td><td></td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-bold text-lg border-b border-black pb-2 mb-4">3. Deployment & Status</h3>
          <table className="w-full text-sm mb-4">
            <tbody>
              <tr>
                <td className="w-1/4 py-1 font-bold">Current Project:</td><td className="w-1/4">{asset.projectName || 'Unassigned'}</td>
                <td className="w-1/4 py-1 font-bold">Current Location:</td><td className="w-1/4">{asset.currentLocation || 'Unknown'}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Custodian Name:</td><td>{asset.custodianName || 'Unassigned'}</td>
                <td className="py-1 font-bold">Custodian Phone:</td><td>{asset.custodianPhone || 'N/A'}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Operating Status:</td><td colSpan={3} className="font-bold">{asset.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-32 text-center text-sm font-bold">
          <div className="border-t border-black pt-2">Custodian Signature</div>
          <div className="border-t border-black pt-2">Authorized By (FAMS)</div>
        </div>
      </>
    );
  };
`;

let genericIndex = content.indexOf('const renderGeneric = () =>');
content = content.slice(0, genericIndex) + assetRenderer + '\n\n  ' + content.slice(genericIndex);

// Replace {docType === 'ASSET' && renderAssetCard()} in switch
content = content.replace(
  "{docType === 'FAMS_DEPRECIATION' && renderFamsDepreciation()}",
  "{docType === 'FAMS_DEPRECIATION' && renderFamsDepreciation()}\n            {docType === 'ASSET' && renderAssetCard()}"
);

// Remove ASSET from generic
content = content.replace("&& docType !== 'FAMS_DEPRECIATION'", "&& docType !== 'FAMS_DEPRECIATION' && docType !== 'ASSET'");
content = content.replace("{docType === 'ASSET' && 'FIXED ASSET REGISTRATION CARD (FAMS)'}", "");

fs.writeFileSync('src/components/documents/DocumentPrintModal.tsx', content);
console.log('Fixed asset card renderer added.');

