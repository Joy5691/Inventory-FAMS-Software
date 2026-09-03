const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.ts', 'utf-8');

const newCS = `export const INITIAL_CS: ComparativeStatement[] = [
  {
    id: 'cs-1',
    csNumber: 'CS-2026-0009',
    date: '2026-08-27',
    prId: 'pr-1',
    prNumber: 'PR-2026-0019',
    projectId: 'proj-1',
    projectName: 'Dhaka Elevated Expressway Phase-3 (DEEP-03)',
    quotations: [
      {
        vendorId: 'vnd-1',
        vendorName: 'BSRM Steels Limited',
        quoteRef: 'BSRM/CORP/2026/Q-8891',
        quoteDate: '2026-08-27',
        items: [{
          slNo: 1,
          itemId: 'item-2',
          itemDescription: 'Deformed Steel Rebar 500W (16mm) - 30 MT',
          specification: 'High-Strength TMT Rebar Grade 500W, BDS ISO 6935-2:2006 with Mill Test Certificate',
          quantity: 30,
          unit: 'MT',
          unitPrice: 96000,
          totalAmount: 2880000
        }],
        vatTaxAmount: 144000,
        freightCost: 35000,
        grandTotal: 3059000,
        leadTimeDays: 4,
        warrantyPeriod: 'Standard Mill Test Guarantee',
        paymentTerms: '45 Days Deferred Cheque',
        technicalCompliance: 'Full Compliance',
        score: 96
      },
      {
        vendorId: 'vnd-5',
        vendorName: 'Bashundhara Industrial Complex (Steel Div)',
        quoteRef: 'BG-STL/2026/5521',
        quoteDate: '2026-08-27',
        items: [{
          slNo: 1,
          itemId: 'item-2',
          itemDescription: 'Deformed Steel Rebar 500W (16mm) - 30 MT',
          specification: 'High-Strength TMT Rebar Grade 500W, BDS ISO 6935-2:2006 with Mill Test Certificate',
          quantity: 30,
          unit: 'MT',
          unitPrice: 97500,
          totalAmount: 2925000
        }],
        vatTaxAmount: 146250,
        freightCost: 40000,
        grandTotal: 3111250,
        leadTimeDays: 7,
        warrantyPeriod: 'Standard Quality Certificate',
        paymentTerms: '30 Days Credit',
        technicalCompliance: 'Full Compliance',
        score: 88
      }
    ],
    preparedBy: 'Shahidul Karim (Procurement Officer)',
    checkedBy: 'Engr. Tanvir Ahmed (Project Manager)',
    approvedBy: 'Brig. Gen. (Retd.) M. A. Hasan (MD)',
    status: 'Approved',
    poIds: ['po-1']
  }
];`;

code = code.replace(/export const INITIAL_CS: ComparativeStatement\[\] = \[[\s\S]*?\];/m, newCS);

fs.writeFileSync('src/data/mockData.ts', code);
