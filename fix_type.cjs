const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

code = code.replace(
  "image:        { type: 'jpeg', quality: 0.98 },",
  "image:        { type: 'jpeg' as const, quality: 0.98 },"
);
code = code.replace(
  "jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }",
  "jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'landscape' as const }"
);

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
