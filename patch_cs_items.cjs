const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

const itemsJSX = `
                          <div className="flex justify-between">
                            <span>Quoted Items:</span>
                            <span className="font-mono font-bold text-slate-900">{q.items?.length || 0} items</span>
                          </div>
                          
                          <div className="my-1.5 space-y-1 border border-slate-100 rounded-lg p-2 bg-white max-h-24 overflow-y-auto">
                            {(q.items || []).map((it: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-[10px] items-center border-b border-slate-50 last:border-0 pb-1 last:pb-0">
                                <span className="text-slate-700 truncate pr-2 font-medium" title={it.itemDescription}>{it.itemDescription}</span>
                                <span className="font-mono text-slate-900 shrink-0">{it.quantity} {it.unit} × ৳{(it.unitPrice || 0).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
`;

code = code.replace(
  /<div className="flex justify-between">\s*<span>Quoted Items:<\/span>\s*<span className="font-mono font-bold text-slate-900">\{q\.items\?\.length \|\| 0\} items<\/span>\s*<\/div>/g,
  itemsJSX
);

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
