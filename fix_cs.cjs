const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

code = code.replace(
  "const vendor = vendors.find(v => v.name === q.vendorName) || vendors[0];",
  "const vendor = vendors.find(v => v.name === q.vendorName);"
);

// Fix the key in the Modal just in case there are still existing duplicates in state
code = code.replace(
  "{poTargetCS.quotations.map((q: any) => {",
  "{poTargetCS.quotations.map((q: any, idx: number) => {"
);

code = code.replace(
  "<label key={q.vendorId} className",
  "<label key={`${q.vendorId}-${idx}`} className"
);

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
