const fs = require('fs');
let code = fs.readFileSync('src/pages/ReportsPage.tsx', 'utf-8');

code = code.replace(/p\.grandTotal\.toLocaleString\(\)/g, "(p.grandTotal || 0).toLocaleString()");
code = code.replace(/s\.quantityOnHand\.toLocaleString\(\)/g, "(s.quantityOnHand || 0).toLocaleString()");
code = code.replace(/s\.averageUnitCost\.toLocaleString\(\)/g, "(s.averageUnitCost || 0).toLocaleString()");
code = code.replace(/s\.totalValuation\.toLocaleString\(\)/g, "(s.totalValuation || 0).toLocaleString()");
code = code.replace(/a\.purchaseCost\.toLocaleString\(\)/g, "(a.purchaseCost || 0).toLocaleString()");
code = code.replace(/a\.currentNetBookValue\.toLocaleString\(\)/g, "(a.currentNetBookValue || 0).toLocaleString()");
code = code.replace(/totalPOAmount\.toLocaleString\(\)/g, "(totalPOAmount || 0).toLocaleString()");
code = code.replace(/totalStockValuation\.toLocaleString\(\)/g, "(totalStockValuation || 0).toLocaleString()");
code = code.replace(/totalAssetGross\.toLocaleString\(\)/g, "(totalAssetGross || 0).toLocaleString()");
code = code.replace(/totalAssetNBV\.toLocaleString\(\)/g, "(totalAssetNBV || 0).toLocaleString()");

fs.writeFileSync('src/pages/ReportsPage.tsx', code);
