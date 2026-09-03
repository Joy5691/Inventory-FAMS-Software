const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf-8');

code = code.replace(
  /export interface VendorQuotation \{[\s\S]*?score: number;\s*isRecommended\?: boolean;\s*\}/,
`export interface CSQuotedItem {
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
}`
);

code = code.replace(
  /export interface ComparativeStatement \{[\s\S]*?poId\?: string;\s*\}/,
`export interface ComparativeStatement {
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
}`
);

code = code.replace(
  /deliveryNoteRef: string;/,
  `deliveryNoteRef: string;
  challanFileUrl?: string;
  challanFileName?: string;
  approvedDate?: string;
  receivedDate?: string;`
);

code = code.replace(
  /export interface MaterialTransferVoucher \{/,
  `export interface MTVItem extends RequisitionItem {
  sourceItemName?: string;
}

export interface MaterialTransferVoucher {`
);

code = code.replace(
  /items: RequisitionItem\[\];\s*transportMode/,
  `items: MTVItem[];
  transportMode`
);

fs.writeFileSync('src/types/index.ts', code);
