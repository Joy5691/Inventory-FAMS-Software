const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

code = code.replace(
  /<div className="flex justify-between">\s*<span>Unit Price:<\/span>\s*<span className="font-mono font-bold text-slate-900">৳\{q\.unitPrice\.toLocaleString\(\)\} \/ \{cs\.unit\}<\/span>\s*<\/div>\s*<div className="flex justify-between">\s*<span>Base Amount:<\/span>\s*<span className="font-mono">৳\{q\.totalAmount\.toLocaleString\(\)\}<\/span>\s*<\/div>/g,
  `<div className="flex justify-between">
                            <span>Quoted Items:</span>
                            <span className="font-mono font-bold text-slate-900">{q.items?.length || 0} items</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Base Amount:</span>
                            <span className="font-mono">৳{(q.items?.reduce((sum, it) => sum + ((it.unitPrice || 0) * (it.quantity || 0)), 0) || 0).toLocaleString()}</span>
                          </div>`
);

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
