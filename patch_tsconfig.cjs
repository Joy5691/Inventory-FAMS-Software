const fs = require('fs');
let code = fs.readFileSync('tsconfig.json', 'utf-8');

const tsconfig = JSON.parse(code);
tsconfig.exclude = ["node_modules", "dist"];

fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
