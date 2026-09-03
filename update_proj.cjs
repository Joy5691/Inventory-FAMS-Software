const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf-8');
code = code.replace(
  `                              {items.map((it: any) => (
                                <option key={it.id} value={it.id}>{it.name}</option>
                              ))}`,
  `                              {items.map((it: any) => {
                                const centralStock = stocks.find(s => s.itemId === it.id && s.storeName === 'Ashulia Central Store')?.availableQty || 0;
                                return (
                                  <option key={it.id} value={it.id}>
                                    {it.name} - Central Stock: {centralStock} {it.unit}
                                  </option>
                                );
                              })}`
);
fs.writeFileSync('src/pages/ProjectsPage.tsx', code);
