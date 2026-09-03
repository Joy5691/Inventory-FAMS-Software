const fs = require('fs');

const raw = fs.readFileSync('raw.txt', 'utf-8');
const lines = raw.split('\n');

const newItems = [];
const newStocks = [];
const newAssets = [];

let itemIdCounter = 5000;
let assetIdCounter = 5000;

lines.forEach((line, index) => {
  if (!line.trim()) return;
  const parts = line.split('\t');
  if (parts.length < 10) return;

  const sl = parts[0]?.trim();
  const mainCategory = parts[1]?.trim();
  const subCategory = parts[2]?.trim();
  const rawItemName = parts[3]?.trim();
  const model = parts[4]?.trim();
  const qtyStr = parts[5]?.trim();
  const condition = parts[6]?.trim();
  const location = parts[7]?.trim() || 'Head Office';
  const rawDate = parts[8]?.trim(); // "01/07/2026"
  const priceStr = parts[9]?.trim();
  
  let itemName = rawItemName;
  if (!itemName) {
     itemName = mainCategory ? `${mainCategory} Item ${sl}` : `Unspecified Item ${sl}`;
  }

  let qty = parseInt(qtyStr, 10);
  if (isNaN(qty)) qty = 1;

  let price = parseInt(priceStr.replace(/,/g, ''), 10);
  if (isNaN(price)) price = 0;
  
  // parse date DD/MM/YYYY -> YYYY-MM-DD
  let date = '2026-07-01';
  if (rawDate && rawDate.includes('/')) {
    const dparts = rawDate.split('/');
    if(dparts.length === 3) date = `${dparts[2]}-${dparts[1]}-${dparts[0]}`;
  }

  if (subCategory === 'Fixed Assets') {
    assetIdCounter++;
    const assetId = `TCCL-EQ-2026-${assetIdCounter.toString().padStart(4, '0')}`;
    const asset = {
      id: `a-${assetIdCounter}`,
      assetCode: assetId,
      qrCode: `QR-${assetId}`,
      name: itemName,
      category: 'Heavy Earthmoving',
      makeModel: model || 'N/A',
      serialChassisNo: 'Unknown',
      purchaseCost: price,
      capitalizationDate: date,
      usefulLifeYears: 5,
      residualValue: price * 0.1,
      depreciationMethod: 'Straight-Line (SLM)',
      currentNetBookValue: price,
      projectId: 'proj-1', // Default to first project
      projectName: 'Dhaka Elevated Expressway Phase-3',
      currentLocation: location,
      custodianName: 'Unassigned',
      custodianPhone: '',
      commissioningDate: date,
      warrantyExpiry: '2027-01-01',
      operationalHours: 0,
      fuelLogLitersTotal: 0,
      status: condition === 'DAMAGE' ? 'Under Maintenance' : 'Active / Deployed',
      maintenanceSchedule: []
    };
    newAssets.push(asset);
  } else {
    itemIdCounter++;
    const itemId = `ITEM-${itemIdCounter}`;
    
    // figure out Category
    let cat = 'Civil';
    if (mainCategory.includes('Electric')) cat = 'Electrical';
    else if (mainCategory.includes('Mechan')) cat = 'Mechanical';
    else if (mainCategory.includes('Safety')) cat = 'Safety & PPE';
    else if (mainCategory.includes('Machine')) cat = 'Tools';
    
    const item = {
      id: `itm-${itemIdCounter}`,
      itemCode: itemId,
      name: itemName,
      category: cat,
      specification: model || 'Standard',
      unit: 'Nos',
      classification: 'General',
      reorderLevel: 5,
      maxLevel: 50,
      unitPriceEstimate: price
    };
    newItems.push(item);

    const stock = {
      itemId: `itm-${itemIdCounter}`,
      itemCode: itemId,
      itemName: itemName,
      unit: 'Nos',
      storeName: location === 'Head Office' ? 'Head Office' : 'Ashulia Central Store',
      availableQty: qty,
      reservedQty: 0,
      inTransitQty: 0,
      binCardNumber: `BIN-${itemIdCounter}`,
      lastUpdated: date
    };
    newStocks.push(stock);
  }
});

let fileContent = fs.readFileSync('src/data/mockData.ts', 'utf-8');

// Insert newItems
let itemsIndex = fileContent.indexOf('export const INITIAL_ITEMS: ItemMaster[] = [');
let itemsEndIndex = fileContent.indexOf('];', itemsIndex);
let newItemsStr = newItems.map(i => JSON.stringify(i)).join(',\n') + ',\n';
fileContent = fileContent.slice(0, itemsEndIndex) + newItemsStr + fileContent.slice(itemsEndIndex);

// Insert newStocks
let stocksIndex = fileContent.indexOf('export const INITIAL_STOCKS: StoreStock[] = [');
let stocksEndIndex = fileContent.indexOf('];', stocksIndex);
let newStocksStr = newStocks.map(s => JSON.stringify(s)).join(',\n') + ',\n';
fileContent = fileContent.slice(0, stocksEndIndex) + newStocksStr + fileContent.slice(stocksEndIndex);

// Insert newAssets
let assetsIndex = fileContent.indexOf('export const INITIAL_ASSETS: FixedAsset[] = [');
let assetsEndIndex = fileContent.indexOf('];', assetsIndex);
let newAssetsStr = newAssets.map(a => JSON.stringify(a)).join(',\n') + ',\n';
fileContent = fileContent.slice(0, assetsEndIndex) + newAssetsStr + fileContent.slice(assetsEndIndex);

fs.writeFileSync('src/data/mockData.ts', fileContent);
console.log(`Added ${newItems.length} items/stocks and ${newAssets.length} fixed assets.`);
