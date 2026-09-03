const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');
code = code.replace(
  `                            {items.map(it => (
                              <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
                            ))}`,
  `                            {items.map(it => {
                              const centralStock = stocks.find(s => s.itemId === it.id && s.storeName === 'Ashulia Central Store')?.availableQty || 0;
                              return (
                                <option key={it.id} value={it.id}>
                                  {it.name} ({it.unit}) - Central Stock: {centralStock}
                                </option>
                              );
                            })}`
);
fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
