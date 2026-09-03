const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

// 1. Add state for sourceItemName
code = code.replace(
  /const \[mtvDriverPhone, setMtvDriverPhone\] = useState\('\+880 1912-334455'\);/,
  `const [mtvDriverPhone, setMtvDriverPhone] = useState('+880 1912-334455');
  const [mtvSourceItem, setMtvSourceItem] = useState('');`
);

// 2. Add to handleMTVSubmit
code = code.replace(
  /remarks: 'Inter-store balanced stock replenishment'/,
  `remarks: 'Inter-store balanced stock replenishment',
          sourceItemName: mtvSourceItem`
);

// 3. Add to Form JSX
const formInput = `
              <div className="mb-2">
                <label className="font-bold text-slate-700 block mb-1">Source Project / Material Origin *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Returned from Expressway Site, Extra material from Project X"
                  value={mtvSourceItem}
                  onChange={e => setMtvSourceItem(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">`;

code = code.replace(
  /<div className="grid grid-cols-2 gap-2">\s*<div>\s*<label className="font-bold text-slate-700 block mb-1">Material Item \*/,
  formInput + `\n                <div>\n                  <label className="font-bold text-slate-700 block mb-1">Material Item *`
);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
