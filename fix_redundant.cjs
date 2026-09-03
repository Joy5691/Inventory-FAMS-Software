const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const targetStr = `      } else {
        // If it was an asset, ensure status is Active / Deployed
        setAssets(prev => prev.map(a => {
          if ((it.assetId && a.id === it.assetId) || (it.assetCode && a.assetCode === it.assetCode)) {
            return {
              ...a,
              status: 'Active / Deployed',
              currentLocation: toLoc,
              projectId: targetMTV.destinationProjectId || targetMTV.projectId || a.projectId,
              projectName: targetMTV.destinationProjectName || targetMTV.projectName || a.projectName,
              custodianName: targetMTV.receiverName || a.custodianName
            };
          }
          return a;
        }));
      }`;

// Replace the duplicate `else` logic with nothing, as we already have `if(it.isAsset) { ... } else { ... }` up above!
code = code.replace(targetStr, ``);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("Cleaned up redundant else block");
