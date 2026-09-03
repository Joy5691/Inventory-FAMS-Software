const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// 1. Add to context type interface
code = code.replace(
  `  reallocateAsset: (`,
  `  updateAssetStatus: (assetId: string, status: FixedAsset['status']) => void;\n  reallocateAsset: (`
);

// 2. Add implementation
const implStr = `  const addAssetMaintenance = (`;
const implReplacement = `  const updateAssetStatus = (assetId: string, status: FixedAsset['status']) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status } : a));
    
    // audit log
    const targetAsset = assets.find(a => a.id === assetId);
    if (targetAsset) {
      addAuditLog({
        userName: currentUser?.name || 'System',
        userRole: activeRole,
        action: 'UPDATE_ASSET_STATUS',
        documentType: 'Fixed Asset',
        documentCode: targetAsset.assetCode,
        projectName: targetAsset.projectName,
        previousStatus: targetAsset.status,
        newStatus: status,
        details: \`Asset \${targetAsset.assetCode} (\${targetAsset.name}) marked as \${status}.\`
      });
    }
  };

  const addAssetMaintenance = (`;

code = code.replace(implStr, implReplacement);

// 3. Add to provider exports
code = code.replace(
  `        createAsset,`,
  `        createAsset,\n        updateAssetStatus,`
);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("updateAssetStatus added to AppContext");
