const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

const replacement = `
                    <tr key={mtv.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#174A7E]">
                        {mtv.mtvNumber}
                        <span className="block text-[10px] text-slate-500">{mtv.date}</span>
                        {mtv.mrNo && <span className="block text-[10px] text-slate-500">Ref: {mtv.mrNo}</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{mtv.fromStore}</div>
                        <div className="text-emerald-700 font-bold text-[11px]">→ {mtv.toStore}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                           Source/Origin: {mtv.fromOfficeOrSite || mtv.sourceProjectId || mtv.fromStore}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {mtv.items.map((it, idx) => (
`;

code = code.replace(
  /<tr key=\{mtv\.id\} className="hover:bg-slate-50">\s*<td className="py-3\.5 px-4 font-mono font-bold text-\[#174A7E\]">\s*\{mtv\.mtvNumber\}\s*<span className="block text-\[10px\] text-slate-500">\{mtv\.date\}<\/span>\s*<\/td>\s*<td className="py-3\.5 px-4">\s*<div className="font-semibold text-slate-800">\{mtv\.fromStore\}<\/div>\s*<div className="text-emerald-700 font-bold text-\[11px\]">→ \{mtv\.toStore\}<\/div>\s*<\/td>\s*<td className="py-3\.5 px-4">\s*\{mtv\.items\.map\(\(it, idx\) => \(/,
  replacement
);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
