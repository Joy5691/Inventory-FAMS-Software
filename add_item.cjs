const fs = require('fs');

let fileContent = fs.readFileSync('src/data/mockData.ts', 'utf-8');

const newItem = {
  "id": "itm-9999",
  "itemCode": "ITEM-9999",
  "name": "Welding Electrode Box",
  "category": "Mechanical",
  "specification": "One-time use consumable",
  "unit": "Box",
  "classification": "Consumable",
  "reorderLevel": 10,
  "maxLevel": 100,
  "unitPriceEstimate": 1500
};

const newStock = {
  "itemId": "itm-9999",
  "itemCode": "ITEM-9999",
  "itemName": "Welding Electrode Box",
  "unit": "Box",
  "storeName": "Head Office",
  "availableQty": 10,
  "reservedQty": 0,
  "inTransitQty": 0,
  "binCardNumber": "BIN-9999",
  "lastUpdated": "2026-09-01"
};

let itemsIndex = fileContent.indexOf('export const INITIAL_ITEMS: ItemMaster[] = [');
let itemsEndIndex = fileContent.indexOf('];', itemsIndex);
let newItemStr = JSON.stringify(newItem) + ',\n';
fileContent = fileContent.slice(0, itemsEndIndex) + newItemStr + fileContent.slice(itemsEndIndex);

let stocksIndex = fileContent.indexOf('export const INITIAL_STOCKS: StoreStock[] = [');
let stocksEndIndex = fileContent.indexOf('];', stocksIndex);
let newStockStr = JSON.stringify(newStock) + ',\n';
fileContent = fileContent.slice(0, stocksEndIndex) + newStockStr + fileContent.slice(stocksEndIndex);

fs.writeFileSync('src/data/mockData.ts', fileContent);
console.log("Added new item.");
