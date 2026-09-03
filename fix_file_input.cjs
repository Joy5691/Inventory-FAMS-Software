const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

code = code.replace(
  /name="challanFile"\s*required/g,
  'name="challanFile" accept="image/*,application/pdf" capture="environment" required'
);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
