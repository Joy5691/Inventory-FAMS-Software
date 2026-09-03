const fs = require('fs');

let context = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const oldLogic = `        // Look up stocks in Ashulia, Sreemangal, etc.
        const hoStore = stocks.find(s => s.storeName === 'Head Office Central Store' && (s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase())));
        const ashuliaStore = stocks.find(s => s.storeName === 'Ashulia Central Store' && (s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase())));

        const ashuliaAvail = ashuliaStore?.availableQty || 0;
        const sreemangalAvail = hoStore?.availableQty || 0; // Using Head Office Central Store
        const totalAvail = ashuliaAvail + sreemangalAvail;`;

const newLogic = `        // Look up stocks globally
        const allStoresStocks = stocks.filter(s => s.itemId === it.itemId || s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase()));
        const hoStore = allStoresStocks.find(s => s.storeName === 'Head Office Central Store');
        const otherAvail = allStoresStocks.reduce((sum, s) => s.storeName !== 'Head Office Central Store' ? sum + s.availableQty : sum, 0);

        const hoAvail = hoStore?.availableQty || 0;
        const totalAvail = hoAvail + otherAvail;`;

context = context.replace(oldLogic, newLogic);

const oldActionLogic = `        if (totalAvail >= req) {
          action = ashuliaAvail >= req ? 'Reserve & Issue' : 'Transfer from Store';`;

const newActionLogic = `        if (totalAvail >= req) {
          action = hoAvail >= req ? 'Transfer from Store' : 'Reserve & Issue';`;

context = context.replace(oldActionLogic, newActionLogic);

fs.writeFileSync('src/context/AppContext.tsx', context, 'utf8');
console.log('MAR logic totally fixed');
