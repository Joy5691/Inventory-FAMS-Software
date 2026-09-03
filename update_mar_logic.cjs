const fs = require('fs');

let context = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const marLogic = `
        const ashulia = stocks.find(s => s.storeName === 'Ashulia Central Store' && (s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase())));
        const sreemangal = stocks.find(s => s.storeName === 'Sreemangal Regional Store' && (s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase())));

        const ashuliaAvail = ashulia?.availableQty || 0;
        const sreemangalAvail = sreemangal?.availableQty || 0;
`;

const newMarLogic = `
        const hoStore = stocks.find(s => s.storeName === 'Head Office Central Store' && (s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase())));
        const ashuliaStore = stocks.find(s => s.storeName === 'Ashulia Central Store' && (s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase())));

        const ashuliaAvail = ashuliaStore?.availableQty || 0;
        const sreemangalAvail = hoStore?.availableQty || 0; // Using Head Office Central Store
`;

context = context.replace(marLogic, newMarLogic);
fs.writeFileSync('src/context/AppContext.tsx', context, 'utf8');
console.log('MAR logic updated');
