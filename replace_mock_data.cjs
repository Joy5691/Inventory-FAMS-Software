const fs = require('fs');
const content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const itemsStart = content.indexOf('export const INITIAL_ITEMS: ItemMaster[] = [');
const itemsEnd = content.indexOf('export const INITIAL_STOCKS: StoreStock[] = [');
const assetsStart = content.indexOf('export const INITIAL_ASSETS: FixedAsset[] = [');
const assetsEnd = content.indexOf('export const INITIAL_APPROVAL_TASKS: ApprovalTask[] = [');

const newItems = `export const INITIAL_ITEMS: ItemMaster[] = [
  {
    id: 'itm-1',
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
    id: 'itm-2',
    itemCode: 'MAT-CPS-ANODE',
    name: 'Magnesium Sacrificial Anode (CP System)',
    category: 'Electrical & CP',
    specification: 'High Potential Magnesium Anode (32 lbs) with backfill',
    unit: 'Nos',
    classification: 'Consumable',
    reorderLevel: 50,
    maxLevel: 200,
    unitPriceEstimate: 4500
  }
];

`;

const newAssets = `export const INITIAL_ASSETS: FixedAsset[] = [
  {
    id: 'ast-1',
    assetCode: 'TCCL-AST-WELD-001',
    qrCode: 'TCCL-FAMS:TCCL-AST-WELD-001',
    name: 'Lincoln Electric Vantage 500 Engine-Driven Welder',
    category: 'Pipeline Equipment',
    makeModel: 'Lincoln Vantage 500',
    serialChassisNo: 'LN500-9921',
    sourceGrnNo: 'GRN-2025-001',
    purchaseCost: 2500000,
    capitalizationDate: '2025-01-15',
    usefulLifeYears: 8,
    residualValue: 250000,
    depreciationMethod: 'Straight-Line (SLM)',
    currentNetBookValue: 2200000,
    projectId: 'proj-1',
    projectName: 'Shabazpur Gas Field Pipeline',
    currentLocation: 'Bhola Site Yard',
    custodianName: 'Md. Rafiqul Islam (Lead Welder)',
    custodianPhone: '+880 1711-000000',
    commissioningDate: '2025-01-20',
    warrantyExpiry: '2027-01-15',
    operationalHours: 1200,
    fuelLogLitersTotal: 4500,
    status: 'Active / Deployed',
    maintenanceSchedule: []
  },
  {
    id: 'ast-2',
    assetCode: 'TCCL-AST-CRN-001',
    qrCode: 'TCCL-FAMS:TCCL-AST-CRN-001',
    name: 'Tadano 50-Ton Rough Terrain Crane',
    category: 'Plant Erection',
    makeModel: 'Tadano GR-500EXL',
    serialChassisNo: 'TD-GR500-4422',
    sourceGrnNo: 'GRN-2024-055',
    purchaseCost: 35000000,
    capitalizationDate: '2024-11-10',
    usefulLifeYears: 15,
    residualValue: 3500000,
    depreciationMethod: 'Straight-Line (SLM)',
    currentNetBookValue: 31000000,
    projectId: 'proj-2',
    projectName: 'BSEZ Pipeline Works',
    currentLocation: 'Araihazar SEZ',
    custodianName: 'Jamal Uddin (Crane Operator)',
    custodianPhone: '+880 1912-000000',
    commissioningDate: '2024-11-15',
    warrantyExpiry: '2026-11-10',
    operationalHours: 800,
    fuelLogLitersTotal: 3200,
    status: 'Active / Deployed',
    maintenanceSchedule: []
  }
];

`;

const result = content.substring(0, itemsStart) + newItems + content.substring(itemsEnd, assetsStart) + newAssets + content.substring(assetsEnd);

fs.writeFileSync('src/data/mockData.ts', result);
console.log('Successfully replaced items and assets.');
