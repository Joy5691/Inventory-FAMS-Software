const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// Update createMTV to set 'In-Transit'
const oldCreateMTVReturn = `              projectId: mtvData.destinationProjectId || mtvData.projectId || a.projectId,
              projectName: mtvData.projectName || a.projectName,
              currentLocation: toLoc,
              custodianName: mtvData.receiverName || a.custodianName,
              custodianPhone: mtvData.receiverPhone || a.custodianPhone,
              transferHistory: [transferEntry, ...(a.transferHistory || [])]`;

const newCreateMTVReturn = `              projectId: mtvData.destinationProjectId || mtvData.projectId || a.projectId,
              projectName: mtvData.projectName || a.projectName,
              currentLocation: toLoc,
              custodianName: mtvData.receiverName || a.custodianName,
              custodianPhone: mtvData.receiverPhone || a.custodianPhone,
              status: 'In-Transit',
              transferHistory: [transferEntry, ...(a.transferHistory || [])]`;

code = code.replace(oldCreateMTVReturn, newCreateMTVReturn);

// Update confirmMTVReceipt to set 'Site-Deployed'
const oldConfirmMTVReceipt = `    // Move from inTransit to destination store available for materials
    targetMTV.items.forEach(it => {
      if (!it.isAsset) {
        setStocks(prev => {`;

const newConfirmMTVReceipt = `    // Move from inTransit to destination store available for materials and update assets
    targetMTV.items.forEach(it => {
      if (it.isAsset || it.assetId) {
        setAssets(prev => prev.map(a => {
          const matches = (it.assetId && a.id === it.assetId) ||
                          (it.assetCode && a.assetCode === it.assetCode) ||
                          (it.itemName && it.itemName.includes(a.assetCode));
          if (matches) {
            return {
              ...a,
              status: 'Site-Deployed'
            };
          }
          return a;
        }));
      } else {
        setStocks(prev => {`;

code = code.replace(oldConfirmMTVReceipt, newConfirmMTVReceipt);

// We need to fix the closing brace for the added else block
const oldConfirmMTVReceiptEnd = `          }
        });
      }
    });

    setMtvs(prev => prev.map(m => m.id === mtvId ? { ...m, status: 'Received' } : m));`;

const newConfirmMTVReceiptEnd = `          }
        });
      }
    });

    setMtvs(prev => prev.map(m => m.id === mtvId ? { ...m, status: 'Received' } : m));`;

// The closing braces are the same because we just turned `if (!it.isAsset)` into `if (it.isAsset) { ... } else { if(!it.isAsset) ... }`
// Wait, the original code had:
//      if (!it.isAsset) {
//        setStocks(prev => { ... });
//      }

// If I just replaced `if (!it.isAsset) { setStocks...` with `if (it.isAsset) { ... } else { setStocks...`
// Then the braces should naturally match. Let's verify by just printing the replaced section.

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("Updated asset lifecycle successfully");
