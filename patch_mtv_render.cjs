const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

code = code.replace(
  /\{mtv\.items\.map\(\(it, idx\) => \(\n\s*<div key=\{idx\} className="font-bold text-slate-800">\n\s*\{it\.itemName\} \(\{it\.quantity\} \{it\.unit\}\)\n\s*<\/div>\n\s*\)\)\}/,
  `{mtv.items.map((it, idx) => (
    <div key={idx} className="font-bold text-slate-800">
      {it.itemName} ({it.quantity} {it.unit})
      {it.sourceItemName && <span className="block text-[10px] text-slate-500 font-normal">Source: {it.sourceItemName}</span>}
    </div>
  ))}`
);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
