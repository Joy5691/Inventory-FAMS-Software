const fs = require('fs');
let code = fs.readFileSync('src/pages/MaterialTrackingPage.tsx', 'utf8');

code = code.replace(/gp\.status/g, "(gp.status || 'Pending Gate Out')");
fs.writeFileSync('src/pages/MaterialTrackingPage.tsx', code);
console.log('Fixed MaterialTrackingPage.tsx');
