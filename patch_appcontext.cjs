const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

code = code.replace(/newPO\.grandTotal\.toLocaleString\(\)/g, "(newPO.grandTotal || 0).toLocaleString()");
code = code.replace(/newAsset\.purchaseCost\.toLocaleString\(\)/g, "(newAsset.purchaseCost || 0).toLocaleString()");
code = code.replace(/maint\.cost\.toLocaleString\(\)/g, "(maint.cost || 0).toLocaleString()");

fs.writeFileSync('src/context/AppContext.tsx', code);
