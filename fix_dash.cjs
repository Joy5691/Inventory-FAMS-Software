const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardPage.tsx', 'utf8');

code = code.replace(
  /\{ id: 'procurement'.*/, 
  "{ id: 'procurement', title: 'Procurement & Purchase', color: '#0ea5e9' },"
);
code = code.replace(
  /\{ id: 'inventory'.*/, 
  "{ id: 'inventory', title: 'Inventory & Warehouse', color: '#10b981' },"
);
code = code.replace(
  /\{ id: 'tracking'.*/, 
  "{ id: 'tracking', title: 'Gate Pass / Challan', color: '#f59e0b' },"
);
code = code.replace(
  /\{ id: 'fams'.*/, 
  "{ id: 'fams', title: 'Asset Mgmt (FAMS)', color: '#8b5cf6' },"
);
code = code.replace(
  /\{ id: 'reports'.*/, 
  "{ id: 'reports', title: 'Analytics & Reports', color: '#ec4899' }"
);
fs.writeFileSync('src/pages/DashboardPage.tsx', code);
