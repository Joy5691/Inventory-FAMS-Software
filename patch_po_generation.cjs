const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

const handleGeneratePO = `
  const handleGeneratePO = (cs: ComparativeStatement) => {
    const recommendedQuote = cs.quotations.find(q => q.vendorId === cs.recommendedVendorId);
    if (!recommendedQuote) return;
    
    const vendor = vendors.find(v => v.id === cs.recommendedVendorId);

    createPurchaseOrder({
      date: new Date().toISOString().substring(0, 10),
      orderType: 'Purchase Order',
      vendorId: cs.recommendedVendorId,
      vendorName: recommendedQuote.vendorName,
      vendorAddress: vendor?.address || 'Vendor Address',
      contactPerson: vendor?.contactPerson || 'Vendor Contact',
      contactMobile: vendor?.phone || 'N/A',
      quotationRef: recommendedQuote.quoteRef,
      quotationDate: recommendedQuote.quoteDate,
      deliveryLocation: cs.projectName + ' Site',
      alternativeContact: 'Project Engineer',
      prNo: cs.prNumber,
      mrNo: 'N/A', // Assuming from PR
      projectId: cs.projectId,
      projectName: cs.projectName,
      items: [
        {
          slNo: 1,
          itemDescription: cs.itemDescription,
          specification: cs.specification,
          unit: cs.unit,
          qty: cs.quantity,
          unitRate: recommendedQuote.unitPrice,
          totalAmount: recommendedQuote.unitPrice * cs.quantity,
          remarks: ''
        }
      ],
      grossAmount: recommendedQuote.totalAmount,
      vatTaxAmount: recommendedQuote.vatTaxAmount,
      grandTotal: recommendedQuote.grandTotal,
      amountInWords: 'Amount as per quotation',
      deliveryLeadTime: \`\${recommendedQuote.leadTimeDays} Days\`,
      paymentTerms: recommendedQuote.paymentTerms || 'As per standard terms',
      warranty: 'Standard Warranty',
      preparedBy: currentUser?.name || 'Procurement',
      checkedBy: 'Procurement Head',
      authorizedSignatory: '',
      status: 'Pending Approval'
    });
    
    setActiveSubTab('po');
  };
`;

code = code.replace(/const handleOpenCSModal/, handleGeneratePO + '\n  const handleOpenCSModal');

// Update onClick
code = code.replace(/alert\("Please open the PO creation form manually[^"]*"\);\s*setActiveSubTab\('po'\);/, 'handleGeneratePO(cs);');

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
