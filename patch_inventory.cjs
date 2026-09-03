const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

code = code.replace(/\(stock\.availableQty \+ stock\.reservedQty\)\.toLocaleString\(\)/g, "((stock.availableQty || 0) + (stock.reservedQty || 0)).toLocaleString()");
code = code.replace(/stock\.reservedQty\.toLocaleString\(\)/g, "(stock.reservedQty || 0).toLocaleString()");
code = code.replace(/stock\.availableQty\.toLocaleString\(\)/g, "(stock.availableQty || 0).toLocaleString()");
code = code.replace(/\(\(stock\.availableQty \+ stock\.reservedQty\) \* \(items\.find\(i => i\.id === stock\.itemId\)\?\.unitPriceEstimate \|\| 0\)\)\.toLocaleString\(\)/g, "(((stock.availableQty || 0) + (stock.reservedQty || 0)) * (items.find(i => i.id === stock.itemId)?.unitPriceEstimate || 0)).toLocaleString()");

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
