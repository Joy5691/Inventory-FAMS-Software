const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/<Header[\s\S]*?\/>/, match => `<div className="print:hidden">\n          ${match}\n        </div>`);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx header patched');
