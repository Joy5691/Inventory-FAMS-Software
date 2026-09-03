const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

// 1. Add updateAssetStatus to useApp import
code = code.replace(
  `    reallocateAsset,`,
  `    reallocateAsset,\n    updateAssetStatus,`
);

// 2. Add button in UI
const oldActions = `                  <button
                    onClick={() => setQrModalData({`;

const newActions = `                  {asset.status !== 'Retired' && asset.status !== 'Disposed' && (
                    <button
                      onClick={() => {
                        if (window.confirm(\`Are you sure you want to retire asset \${asset.assetCode}?\`)) {
                          updateAssetStatus(asset.id, 'Retired');
                        }
                      }}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold border border-rose-200 transition-colors"
                    >
                      Retire
                    </button>
                  )}
                  <button
                    onClick={() => setQrModalData({`;

code = code.replace(oldActions, newActions);

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
console.log("FAMSPage Retire feature added");
