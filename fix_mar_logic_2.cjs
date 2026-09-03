const fs = require('fs');

let context = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// The earlier replacement might have failed due to whitespace/formatting, so let's do a more robust regex replacement.

context = context.replace(
  /const ashulia = stocks\.find.*?;\n\s*const sreemangal = stocks\.find.*?;/gs,
  `const allStocksForItem = stocks.filter(s => s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase()));
        
        // Sum up all central/HO stores or just use total available for simplicity, but as per request "available product in Head office so the available one transfer directly"
        const hoStore = stocks.find(s => s.storeName === 'Head Office Central Store' && (s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase())));
        const otherAvail = allStocksForItem.reduce((sum, s) => s.storeName !== 'Head Office Central Store' ? sum + s.availableQty : sum, 0);`
);

context = context.replace(
  /const ashuliaAvail = ashulia\?\.availableQty \|\| 0;\n\s*const sreemangalAvail = sreemangal\?\.availableQty \|\| 0;\n\s*const totalAvail = ashuliaAvail \+ sreemangalAvail;/gs,
  `const ashuliaAvail = hoStore?.availableQty || 0; // mapped to hoStore for now
        const sreemangalAvail = otherAvail;
        const totalAvail = ashuliaAvail + sreemangalAvail;`
);

fs.writeFileSync('src/context/AppContext.tsx', context, 'utf8');
console.log('MAR logic updated with regex');
