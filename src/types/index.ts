export type UserRole = 
  | 'Super Admin'
  | 'Managing Director'
  | 'Project Manager'
  | 'Store Officer'
  | 'Site Engineer'
  | 'Procurement Officer'
  | 'Internal Auditor'
  | 'FAMS Officer'
  | 'Accounts / Finance';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  department: string;
  avatar: string;
  employeeId: string;
  phone: string;
  assignedProjects: string[];
}

export type ItemClassification = 
  | 'Consumable' 
  | 'Raw Material' 
  | 'Returnable Tool' 
  | 'Fixed Asset' 
  | 'Service' 
  | 'Rental Equipment';

export interface ItemMaster {
  id: string;
  itemCode: string;
  name: string;
  category: 'Civil' | 'Electrical' | 'Mechanical' | 'Safety & PPE' | 'Heavy Equipment' | 'Tools';
  specification: string;
  unit: string;
  classification: ItemClassification;
  reorderLevel: number;
  maxLevel: number;
  unitPriceEstimate: number;
}

export interface StoreStock {
  itemId: string;
  itemCode: string;
  itemName: string;
  unit: string;
  storeName: string;
  projectId?: string;
  availableQty: number;
  reservedQty: number;
  inTransitQty: number;
  binCardNumber: string;
  lastUpdated: string;
}

export type DocumentStatus = 
  | 'Draft' 
  | 'Pending Verification' 
  | 'Pending Approval' 
  | 'Approved' 
  | 'Rejected' 
  | 'Returned' 
  | 'In Transit' 
  | 'Received' 
  | 'Completed' 
  | 'Cancelled';

export type PriorityLevel = 'Normal' | 'High' | 'Emergency' | 'Critical';

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  location: string;
  manager: string;
  budget: number;
  committedBudget: number;
  spentBudget: number;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Mobilization' | 'Finishing' | 'Completed';
  workPackages: string[];
  costCodes: string[];
}

export interface RequisitionItem {
  id: string;
  itemId?: string;
  itemDescription: string;
  specification: string;
  unit: string;
  quantity: number;
  classification: ItemClassification;
  estimatedUnitPrice?: number;
  ledger?: string;
  remarks?: string;
}

export interface MaterialRequisition {
  id: string;
  mrNumber: string; // e.g. MR-2026-0045
  documentNo: string; // e.g. TCCL/PUR/04/01
  date: string;
  dueDate: string;
  projectId: string;
  projectName: string;
  location: string;
  department: string;
  wbsCode: string;
  costCode: string;
  purchaseType: 'Tools / Tackle / Consumable' | 'Goods / Materials' | 'Equipment / Machineries' | 'Service' | 'Hire Purchase / Rental';
  priority: PriorityLevel;
  items: RequisitionItem[];
  initiatedBy: string;
  initiatedByRole: string;
  checkedBy?: string;
  authorizedBy?: string;
  status: DocumentStatus;
  remarks?: string;
  marId?: string;
  prId?: string;
  createdAt: string;
}

export interface StoreAvailabilityDetail {
  storeName: string;
  projectId?: string;
  availableQty: number;
  reservedQty: number;
}

export interface MARItem {
  slNo: number;
  itemId: string;
  itemName: string;
  specification: string;
  unit: string;
  requiredQty: number;
  ashuliaQty: number;
  sreemangalQty: number;
  otherStoreQty: number;
  totalAvailable: number;
  reservedQty: number;
  shortageQty: number;
  actionTaken: 'Reserve & Issue' | 'Transfer from Store' | 'Issue Partial & Create PR' | 'Create PR for Full Shortage' | 'Transfer / Assign Asset';
  remarks?: string;
}

export interface MaterialAvailabilityReport {
  id: string;
  reportNo: string; // MAR-2026-0032
  reportDate: string;
  mrId: string;
  mrNumber: string;
  mrDate: string;
  projectId: string;
  projectName: string;
  projectLocation: string;
  materialsDueDate: string;
  items: MARItem[];
  preparedBy: string;
  designation: string;
  status: 'Completed' | 'Partially Fulfilled' | 'Shortage Identified' | 'Issued to GRN';
  comments?: string;
  linkedMIVs?: string[];
  linkedMTVs?: string[];
  linkedPRs?: string[];
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string; // PR-2026-0019
  documentNo: string; // TCCL/PUR/04/01
  date: string;
  dueDate: string;
  sourceMrId?: string;
  sourceMrNumber?: string;
  projectId: string;
  projectName: string;
  location: string;
  department: string;
  purchaseType: string;
  items: (RequisitionItem & { shortageQty: number })[];
  recommendedSuppliers?: { name: string; contact: string; category: string }[];
  initiatedBy: string;
  checkedBy?: string;
  authorizedBy?: string;
  status: DocumentStatus;
  rfqId?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  code: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  taxId: string;
  rating: number;
  qualificationStatus: 'Approved' | 'Under Review' | 'Blacklisted';
  paymentTerms: string;
}

export interface CSQuotedItem {
  slNo: number;
  itemId?: string;
  itemDescription: string;
  specification: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface VendorQuotation {
  vendorId: string;
  vendorName: string;
  quoteRef: string;
  quoteDate: string;
  items: CSQuotedItem[];
  vatTaxAmount: number;
  freightCost: number;
  grandTotal: number;
  leadTimeDays: number;
  warrantyPeriod: string;
  paymentTerms: string;
  technicalCompliance: 'Full Compliance' | 'Minor Deviation' | 'Non-Compliant';
  score: number;
}

export interface ComparativeStatement {
  id: string;
  csNumber: string;
  date: string;
  prId: string;
  prNumber: string;
  projectId: string;
  projectName: string;
  quotations: VendorQuotation[];
  preparedBy: string;
  checkedBy?: string;
  approvedBy?: string;
  status: DocumentStatus;
  poIds?: string[];
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // PO-2026-0012
  docNo: string; // PUR/3/2
  date: string;
  orderType: 'Purchase Order' | 'Work Order' | 'Service Order';
  vendorId: string;
  vendorName: string;
  vendorAddress: string;
  contactPerson: string;
  contactMobile: string;
  quotationRef: string;
  quotationDate: string;
  deliveryLocation: string;
  alternativeContact: string;
  prNo: string;
  mrNo: string;
  projectId: string;
  projectName: string;
  items: {
    slNo: number;
    itemDescription: string;
    specification: string;
    unit: string;
    qty: number;
    unitRate: number;
    amount: number;
    remarks?: string;
  }[];
  subTotal: number;
  taxVat: number;
  grandTotal: number;
  inWords: string;
  generalTerms: string;
  financialTerms: string;
  preparedBy: string;
  checkedBy?: string;
  authorizedSignatory?: string;
  vendorAcceptanceDate?: string;
  status: DocumentStatus;
  deliveryDueDate: string;
  grnIds?: string[];
}

export interface GRNItem {
  slNo: number;
  itemId?: string;
  itemCode?: string;
  itemDescription: string;
  specification: string;
  unit: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  damagedQty: number;
  inspectionResult: 'Passed' | 'Rejected' | 'Conditional Acceptance';
  isAsset?: boolean;
  remarks?: string;
}

export interface GoodsReceivedNote {
  id: string;
  grnNumber: string; // GRN-2026-0024
  date: string;
  poId: string;
  poNumber: string;
  vendorName: string;
  supplierChallanNo: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  receivingStore: string;
  projectId: string;
  projectName: string;
  items: GRNItem[];
  inspectedBy: string;
  storeOfficer: string;
  status: 'Pending' | 'Draft' | 'Inspected & Posted' | 'Rejected';
  assetCreated?: boolean;
}

export interface MaterialIssueVoucher {
  id: string;
  mivNumber: string; // MIV-2026-0038
  date: string;
  mrNo: string;
  marNo: string;
  projectId: string;
  projectName: string;
  fromStore: string;
  toLocation: string;
  receiverName: string;
  receiverPhone: string;
  items: {
    slNo: number;
    itemName: string;
    specification: string;
    unit: string;
    qty: number;
    remarks?: string;
  }[];
  notesComments?: string;
  preparedBy: string;
  checkedBy?: string;
  recommendedBy?: string;
  approvedBy?: string;
  receivedBy?: string;
  status: DocumentStatus;
}

export interface MTVItem extends RequisitionItem {
  sourceItemName?: string;
}

export interface MaterialTransferVoucher {
  id: string;
  mtvNumber: string; // MTV-2026-0015
  date: string;
  mrNo?: string;
  marNo?: string;
  projectId?: string;
  projectName: string;
  sourceProjectId?: string;
  destinationProjectId?: string;
  transferType?: 'Office to Site' | 'Site to Site' | 'Site to Office' | 'Store to Store';
  transferCategory?: 'Product' | 'Fixed Asset';
  fromOfficeOrSite?: string;
  toOfficeOrSite?: string;
  fromStore: string;
  toStore: string;
  receiverName: string;
  receiverPhone: string;
  items: {
    slNo: number;
    itemId?: string;
    assetId?: string;
    assetCode?: string;
    itemName: string;
    specification: string;
    unit: string;
    qty: number;
    isAsset?: boolean;
    remarks?: string;
  }[];
  notesComments?: string;
  vehicleNo?: string;
  driverName?: string;
  driverPhone?: string;
  preparedBy: string;
  checkedBy?: string;
  recommendedBy?: string;
  approvedBy?: string;
  receivedBy?: string;
  status: 'Prepared' | 'Dispatched (In Transit)' | 'Received' | 'Cancelled';
}

export type GatePassType = 'Returnable Gate Pass (RGP)' | 'Non-Returnable Gate Pass (NRGP)' | 'Delivery Challan' | 'Non-Returnable Gate Pass' | 'Returnable Gate Pass';

export type AssetCategory = 'Heavy Construction Equipment' | 'Vehicles & Transport' | 'Power & Utility' | 'Engineering & Survey Tools' | 'Heavy Earthmoving' | 'Lifting & Cranes' | 'Concrete & Mixing' | 'Survey & Testing' | 'Power & Generator' | 'Site Vehicle';

export interface GatePass {
  id: string;
  gatePassNo: string; // GP-2026-0089
  memoNo: string;
  date: string;
  passType: 'Returnable Gate Pass (RGP)' | 'Non-Returnable Gate Pass (NRGP)' | 'Delivery Challan';
  toParty: string;
  fromParty: string;
  projectName: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  refDocument: string; // MIV / MTV / PO / Asset Transfer
  items: {
    slNo: number;
    particulars: string;
    unit: string;
    quantity: number;
    remarks?: string;
  }[];
  returnDueDate?: string;
  securityChecked: boolean;
  securityGuardName?: string;
  gateCheckInTime?: string;
  issuedBy: string;
  authorizedSignatory: string;
  receiver: string;
  caretakerGuard: string;
  status: 'Issued' | 'Security Verified' | 'Exited' | 'Returned';
  qrCodeValue: string;
}

export interface FixedAsset {
  id: string;
  assetCode: string; // e.g. TCCL-EQ-2026-004
  qrCode: string;
  name: string;
  category: 'Heavy Earthmoving' | 'Lifting & Cranes' | 'Concrete & Mixing' | 'Survey & Testing' | 'Power & Generator' | 'Site Vehicle';
  makeModel: string;
  serialChassisNo: string;
  sourceGrnNo?: string;
  purchaseCost: number;
  buyingDate?: string;
  capitalizationDate: string;
  usefulLifeYears: number;
  residualValue: number;
  depreciationMethod: 'Straight-Line (SLM)' | 'Written Down Value (WDV)';
  currentNetBookValue: number;
  projectId: string;
  projectName: string;
  currentLocation: string;
  custodianName: string;
  custodianPhone: string;
  commissioningDate: string;
  warrantyExpiry: string;
  operationalHours: number;
  fuelLogLitersTotal: number;
  status: 'Active / Deployed' | 'Under Maintenance' | 'Idle / In Store' | 'Due for Verification' | 'Disposed' | 'In-Transit' | 'Site-Deployed' | 'Retired';
  transferHistory?: {
    id: string;
    transferDate: string;
    transferType: 'Site to Site' | 'Office to Site' | 'Site to Office' | 'Store to Store';
    fromLocation: string;
    toLocation: string;
    fromProjectId?: string;
    toProjectId?: string;
    toProjectName?: string;
    mtvNumber?: string;
    custodianName?: string;
  }[];
  maintenanceSchedule: {
    id: string;
    serviceType: string;
    lastServiceDate: string;
    nextServiceDueDate: string;
    cost: number;
    mechanicOrVendor: string;
    status: 'Scheduled' | 'Completed' | 'Overdue';
  }[];
}

export interface AssetRequisition {
  id: string;
  requisitionNo: string; // e.g. AR-2026-0001
  date: string;
  assetId: string;
  assetCode: string;
  assetName: string;
  category: string;
  makeModel: string;
  serialChassisNo: string;
  sourceProjectId?: string;
  sourceProjectName: string;
  sourceLocation: string;
  targetProjectId: string;
  targetProjectName: string;
  targetLocation: string;
  requestedBy: string;
  requestedByRole: string;
  requiredDate: string;
  justification: string;
  targetCustodianName: string;
  targetCustodianPhone: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  approvalDate?: string;
  approvedBy?: string;
  approvalRemarks?: string;
  mtvNumber?: string;
  createdAt: string;
}

export interface ApprovalTask {
  id: string;
  documentType: 'Material Requisition' | 'Purchase Requisition' | 'Comparative Statement' | 'Purchase Order' | 'MIV' | 'MTV' | 'Asset Transfer' | 'Asset Requisition' | 'Goods Received Note';
  documentId: string;
  documentNumber: string;
  projectId: string;
  projectName: string;
  requestedBy: string;
  amount?: number;
  submittedDate: string;
  priority: PriorityLevel;
  requiredRole: UserRole;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  approvalStage: string;
  comments?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  documentType: string;
  documentCode: string;
  projectName?: string;
  previousStatus?: string;
  newStatus?: string;
  details: string;
}
