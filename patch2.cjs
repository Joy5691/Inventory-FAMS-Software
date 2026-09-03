const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

code = code.replace(/\{q\.vatTaxAmount \+ q\.freightCost\}\.toLocaleString\(\)/g, "{(q.vatTaxAmount || 0) + (q.freightCost || 0)}.toLocaleString()");
code = code.replace(/q\.grandTotal\.toLocaleString\(\)/g, "(q.grandTotal || 0).toLocaleString()");
code = code.replace(/po\.grandTotal\.toLocaleString\(\)/g, "(po.grandTotal || 0).toLocaleString()");
code = code.replace(/\(it\.unitPrice \* it\.quantity\)\.toLocaleString\(\)/g, "((it.unitPrice || 0) * (it.quantity || 0)).toLocaleString()");
code = code.replace(/\(q\.vatTaxAmount \+ q\.freightCost\)\.toLocaleString\(\)/g, "((q.vatTaxAmount || 0) + (q.freightCost || 0)).toLocaleString()");

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
