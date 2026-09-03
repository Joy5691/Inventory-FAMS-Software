const fs = require('fs');

let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const newInitialItems = `export const INITIAL_ITEMS: ItemMaster[] = [
  {
    id: 'itm-1',
    itemCode: 'MAT-CEM-OPC-53',
    name: 'Portland Cement (OPC Grade 53)',
    category: 'Civil',
    specification: 'OPC 53 Grade, 50kg Bag',
    unit: 'Bags',
    classification: 'Raw Material',
    reorderLevel: 500,
    maxLevel: 5000,
    unitPriceEstimate: 550
  },
  {
    id: 'itm-2',
    itemCode: 'MAT-STL-500W-16',
    name: 'Deformed Steel Rebar 500W (16mm)',
    category: 'Civil',
    specification: '500W Grade, 16mm diameter',
    unit: 'MT',
    classification: 'Raw Material',
    reorderLevel: 10,
    maxLevel: 100,
    unitPriceEstimate: 95000
  },
  {
    id: 'itm-3',
    itemCode: 'MAT-STL-500W-25',
    name: 'Deformed Steel Rebar 500W (25mm)',
    category: 'Civil',
    specification: '500W Grade, 25mm diameter',
    unit: 'MT',
    classification: 'Raw Material',
    reorderLevel: 10,
    maxLevel: 100,
    unitPriceEstimate: 95000
  },
  {
    id: 'itm-4',
    itemCode: 'MAT-AGR-STN-20',
    name: 'Crushed Stone Aggregate (20mm Down)',
    category: 'Civil',
    specification: '20mm Down graded',
    unit: 'CFT',
    classification: 'Raw Material',
    reorderLevel: 1000,
    maxLevel: 10000,
    unitPriceEstimate: 220
  },
  {
    id: 'itm-5',
    itemCode: 'MAT-SND-SYL-FM25',
    name: 'Coarse Sand (FM 2.5 Sylhet Sand)',
    category: 'Civil',
    specification: 'FM 2.5, Washed',
    unit: 'CFT',
    classification: 'Raw Material',
    reorderLevel: 1000,
    maxLevel: 10000,
    unitPriceEstimate: 65
  },
  {
    id: 'itm-6',
    itemCode: 'PPE-HLM-VENT-WH',
    name: 'Industrial Safety Helmet (White Vented)',
    category: 'Safety & PPE',
    specification: 'White, Vented, ANSI Z89.1',
    unit: 'Pcs',
    classification: 'Consumable',
    reorderLevel: 50,
    maxLevel: 500,
    unitPriceEstimate: 350
  },
  {
    id: 'itm-7',
    itemCode: 'PPE-HARN-FALL-FB',
    name: 'Full Body Safety Harness with Lanyard',
    category: 'Safety & PPE',
    specification: 'Full body with double lanyard and shock absorber',
    unit: 'Sets',
    classification: 'Consumable',
    reorderLevel: 20,
    maxLevel: 200,
    unitPriceEstimate: 2500
  },
  {
    id: 'itm-8',
    itemCode: 'MAT-PIPE-HP-6IN',
    name: '6-inch DN High-Pressure Gas Gathering Pipeline',
    category: 'Mechanical',
    specification: 'API 5L X65, Seamless, 6" Nominal Diameter',
    unit: 'Meters',
    classification: 'Raw Material',
    reorderLevel: 500,
    maxLevel: 5000,
    unitPriceEstimate: 12500
  },
  {
    id: 'itm-9',
    itemCode: 'MAT-CPS-ANODE',
    name: 'Magnesium Sacrificial Anode (CP System)',
    category: 'Electrical',
    specification: 'High Potential Magnesium Anode (32 lbs) with backfill',
    unit: 'Nos',
    classification: 'Consumable',
    reorderLevel: 50,
    maxLevel: 200,
    unitPriceEstimate: 4500
  },
  {"id":"itm-5001","itemCode":"ITEM-5001","name":"Heating Torch","category":"Civil","specification":"Standard","unit":"Nos","classification":"Consumable","reorderLevel":5,"maxLevel":50,"unitPriceEstimate":600},
  {"id":"itm-5002","itemCode":"ITEM-5002","name":"Gas Cutting Torch","category":"Civil","specification":"Standard","unit":"Nos","classification":"Consumable","reorderLevel":5,"maxLevel":50,"unitPriceEstimate":10200},
  {"id":"itm-5003","itemCode":"ITEM-5003","name":"Earthing Rod","category":"Civil","specification":"Standard","unit":"Nos","classification":"Consumable","reorderLevel":5,"maxLevel":50,"unitPriceEstimate":16600},
  {"id":"itm-5004","itemCode":"ITEM-5004","name":"Protable Oven","category":"Civil","specification":"Weight:5kg","unit":"Nos","classification":"Consumable","reorderLevel":5,"maxLevel":50,"unitPriceEstimate":26850},
  {"id":"itm-5005","itemCode":"ITEM-5005","name":"Welding Cable","category":"Civil","specification":"RM:70","unit":"Nos","classification":"Consumable","reorderLevel":5,"maxLevel":50,"unitPriceEstimate":11950},
  {"id":"itm-5006","itemCode":"ITEM-5006","name":"Power Cable(grinding cable)","category":"Civil","specification":"Standard","unit":"Nos","classification":"Consumable","reorderLevel":5,"maxLevel":50,"unitPriceEstimate":10000},
  {"id":"itm-5007","itemCode":"ITEM-5007","name":"Gas Cutting","category":"Civil","specification":"Standard","unit":"Nos","classification":"Consumable","reorderLevel":5,"maxLevel":50,"unitPriceEstimate":6850},
  {"id":"itm-5008","itemCode":"ITEM-5008","name":"Argun Open Torch","category":"Civil","specification":"Standard","unit":"Nos","classification":"Consumable","reorderLevel":5,"maxLevel":50,"unitPriceEstimate":26750}
];`;

const startIdx = content.indexOf('export const INITIAL_ITEMS: ItemMaster[] = [');
const endIdx = content.indexOf('export const INITIAL_STOCKS: StoreStock[] = [');

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newInitialItems + '\n\n' + content.substring(endIdx);
  fs.writeFileSync('src/data/mockData.ts', content, 'utf8');
  console.log("Successfully replaced INITIAL_ITEMS.");
} else {
  console.log("Could not find start/end indices.");
}
