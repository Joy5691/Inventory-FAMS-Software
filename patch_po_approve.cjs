const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const regex = /const approvePurchaseOrder = \(\s*poId:\s*string\s*\) => \{[\s\S]*?\}\s*;\s*(?=const createGRN)/m;

if (regex.test(code)) {
    console.log("Match found!");
} else {
    console.log("No match found.");
}
