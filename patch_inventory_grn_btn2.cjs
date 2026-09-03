const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

code = code.replace(
  /<CheckCircle2 className="w-3\.5 h-3\.5" \/> Post to Stock Ledger/,
  "<CheckCircle2 className=\"w-3.5 h-3.5\" /> Upload Challan & Receive"
);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
