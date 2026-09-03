const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

code = code.replace(
  /\{grn\.status === 'Inspected & Passed' && \(/,
  "{grn.status !== 'Inspected & Posted' && ("
);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
