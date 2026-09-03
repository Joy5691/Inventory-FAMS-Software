const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

code = code.replace(/const grnNum = \\`GRN-2026-\\\$\{String\(currentGrns\.length \+ 25\)\.padStart\(4, '0'\)\}\\`;/g, 'const grnNum = `GRN-2026-${String(currentGrns.length + 25).padStart(4, "0")}`;');
code = code.replace(/id: \\`grn-\\\$\{Date\.now\(\)\}\\`,/g, 'id: `grn-${Date.now()}`,');

fs.writeFileSync('src/context/AppContext.tsx', code);
