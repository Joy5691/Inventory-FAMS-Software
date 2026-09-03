const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

// Update MIV dropdown
code = code.replace(
  `                  <select
                    value={mivItem}
                    onChange={e => setMivItem(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {items.map(it => (
                      <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
                    ))}
                  </select>`,
  `                  <select
                    value={mivItem}
                    onChange={e => setMivItem(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {items.map(it => {
                      const avail = stocks.find(s => s.itemId === it.id && s.storeName.includes(mivStore.split(',')[0]))?.availableQty || 0;
                      return (
                        <option key={it.id} value={it.id}>
                          {it.name} ({it.unit}) - Avail: {avail}
                        </option>
                      );
                    })}
                  </select>`
);

// Update MTV dropdown
code = code.replace(
  `                  <select
                    value={mtvItem}
                    onChange={e => setMtvItem(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {items.map(it => (
                      <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
                    ))}
                  </select>`,
  `                  <select
                    value={mtvItem}
                    onChange={e => setMtvItem(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {items.map(it => {
                      const avail = stocks.find(s => s.itemId === it.id && s.storeName.includes(mtvFromStore.split(',')[0]))?.availableQty || 0;
                      return (
                        <option key={it.id} value={it.id}>
                          {it.name} ({it.unit}) - Avail: {avail}
                        </option>
                      );
                    })}
                  </select>`
);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
