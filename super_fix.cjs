const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

// There is literally a string "\\n"
code = code.split('\\\\n').join('\\n'); // replace escaped slash n if it exists

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
