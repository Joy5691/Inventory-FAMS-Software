const fs = require('fs');

let proc = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf8');
proc = proc.replace(
  /const centralStock = stocks\.find\(s => s\.itemId === it\.id && s\.storeName === 'Ashulia Central Store'\)\?\.availableQty \|\| 0;/g,
  "const centralStock = stocks.filter(s => s.itemId === it.id).reduce((sum, s) => sum + s.availableQty, 0);"
);
fs.writeFileSync('src/pages/ProcurementPage.tsx', proc, 'utf8');

let proj = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');
proj = proj.replace(
  /const centralStock = stocks\.find\(s => s\.itemId === it\.id && s\.storeName === 'Ashulia Central Store'\)\?\.availableQty \|\| 0;/g,
  "const centralStock = stocks.filter(s => s.itemId === it.id).reduce((sum, s) => sum + s.availableQty, 0);"
);
proj = proj.replace(
  /\{it\.name\} - Central Stock: \{centralStock\} \{it\.unit\}/g,
  "{it.name} - Total Stock: {centralStock} {it.unit}"
);
fs.writeFileSync('src/pages/ProjectsPage.tsx', proj, 'utf8');

