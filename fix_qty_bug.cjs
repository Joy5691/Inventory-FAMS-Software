const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const oldCode = `orderedQty: it.quantity || (it as any).orderedQty || 0,`;
const newCode = `orderedQty: (it as any).qty || (it as any).quantity || (it as any).orderedQty || 0,`;

code = code.replace(oldCode, newCode);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("AppContext fixed qty successfully!");
