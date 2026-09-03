const fs = require('fs');
let code = fs.readFileSync('src/components/common/StatusBadge.tsx', 'utf8');

code = code.replace(/const normalized = status.toLowerCase\(\);/g, "const normalized = (status || 'Unknown').toLowerCase();");

fs.writeFileSync('src/components/common/StatusBadge.tsx', code);
console.log('Fixed StatusBadge.tsx');
