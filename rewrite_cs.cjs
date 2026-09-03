const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

// 1. Replace state
code = code.replace(
  /const \[csSelectedItemIndex, setCsSelectedItemIndex\] = useState<number>\(0\);\n\s*const \[csQuotations, setCsQuotations\] = useState<any\[\]>\(\[\]\);/,
  `const [csQuotationsData, setCsQuotationsData] = useState<any[]>([]);
  const [showIssuePOModal, setShowIssuePOModal] = useState(false);
  const [poTargetCS, setPoTargetCS] = useState<any>(null);
  const [poSelectedVendors, setPoSelectedVendors] = useState<string[]>([]);`
);

// 2. Replace handleOpenCSModal and handleGenerateCS
const newCSHandlers = `
  const handleOpenCSModal = (pr: PurchaseRequisition) => {
    setCsTargetPR(pr);
    // Initialize with 2 empty vendor quotes
    const initItems = pr.items.map((it, i) => ({
      slNo: i + 1,
      itemId: it.itemId || it.id,
      itemDescription: it.itemDescription,
      specification: it.specification,
      unit: it.unit,
      quantity: it.quantity,
      unitPrice: 0,
      totalAmount: 0
    }));
    
    setCsQuotationsData([
      { vendorName: vendors[0]?.name || '', items: [...initItems] },
      { vendorName: vendors[1]?.name || '', items: JSON.parse(JSON.stringify(initItems)) }
    ]);
    setShowCSModal(true);
  };

  const handleAddCSQuotation = () => {
    if (!csTargetPR) return;
    const initItems = csTargetPR.items.map((it, i) => ({
      slNo: i + 1,
      itemId: it.itemId || it.id,
      itemDescription: it.itemDescription,
      specification: it.specification,
      unit: it.unit,
      quantity: it.quantity,
      unitPrice: 0,
      totalAmount: 0
    }));
    setCsQuotationsData([...csQuotationsData, { vendorName: '', items: initItems }]);
  };

  const handleGenerateCS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csTargetPR) return;

    const quotations = csQuotationsData.map((q, idx) => {
      const vendor = vendors.find(v => v.name === q.vendorName) || vendors[0];
      const grandTotal = q.items.reduce((sum: number, it: any) => sum + (it.unitPrice * it.quantity), 0);
      
      const items = q.items.map((it: any) => ({
        ...it,
        totalAmount: it.unitPrice * it.quantity
      }));
      
      return {
        vendorId: vendor?.id || \`vnd-\${Date.now()}-\${idx}\`,
        vendorName: q.vendorName,
        quoteRef: \`Q-\${Date.now()}-\${idx}\`,
        quoteDate: new Date().toISOString().substring(0, 10),
        items,
        vatTaxAmount: 0,
        freightCost: 0,
        grandTotal,
        leadTimeDays: 7,
        warrantyPeriod: 'Standard',
        paymentTerms: 'Standard terms',
        technicalCompliance: 'Full Compliance',
        score: 100
      };
    });

    createComparativeStatement({
      prId: csTargetPR.id,
      prNumber: csTargetPR.prNumber,
      projectId: csTargetPR.projectId,
      projectName: csTargetPR.projectName,
      quotations,
      preparedBy: 'Current User'
    });

    // Mark PR as Approved/CS Generated (The user mentioned: "after that if that requisition made from any projects there it will be uploaded and status is approved.")
    
    setShowCSModal(false);
    setActiveSubTab('cs');
  };

  const handleOpenIssuePOModal = (cs: ComparativeStatement) => {
    setPoTargetCS(cs);
    setPoSelectedVendors([]);
    setShowIssuePOModal(true);
  };

  const handleIssueMultiplePOs = () => {
    if (!poTargetCS) return;
    
    const newPoIds: string[] = [];
    poSelectedVendors.forEach((vendorId) => {
       const quote = poTargetCS.quotations.find((q: any) => q.vendorId === vendorId);
       if (!quote) return;
       
       const vendor = vendors.find(v => v.id === vendorId);
       
       createPurchaseOrder({
         date: new Date().toISOString().substring(0, 10),
         orderType: 'Purchase Order',
         vendorId: vendorId,
         vendorName: quote.vendorName,
         vendorAddress: vendor?.address || 'Vendor Address',
         contactPerson: vendor?.contactPerson || 'Vendor Contact',
         contactMobile: vendor?.phone || 'N/A',
         quotationRef: quote.quoteRef,
         quotationDate: quote.quoteDate,
         deliveryLocation: poTargetCS.projectName + ' Site',
         alternativeContact: 'Project Engineer',
         prNo: poTargetCS.prNumber,
         mrNo: 'N/A',
         projectId: poTargetCS.projectId,
         projectName: poTargetCS.projectName,
         items: quote.items.map((it: any) => ({
           slNo: it.slNo,
           itemDescription: it.itemDescription,
           specification: it.specification,
           unit: it.unit,
           qty: it.quantity,
           unitRate: it.unitPrice,
           totalAmount: it.totalAmount,
           remarks: ''
         })),
         grossAmount: quote.grandTotal,
         vatTaxAmount: quote.vatTaxAmount,
         grandTotal: quote.grandTotal,
         amountInWords: 'Amount as per quotation',
         deliveryLeadTime: \`\${quote.leadTimeDays} Days\`,
         paymentTerms: quote.paymentTerms || 'As per standard terms',
         warranty: 'Standard Warranty'
       });
       // Just generate an ID for tracking in CS (naive)
       newPoIds.push(\`PO-\${Date.now()}-\${Math.floor(Math.random()*1000)}\`);
    });
    
    setShowIssuePOModal(false);
  };
`;

code = code.replace(
  /const handleOpenCSModal = [\s\S]*?setActiveSubTab\('cs'\);\n\s*};\n/m,
  newCSHandlers
);

// We also need to remove the old handleGeneratePO function
code = code.replace(
  /const handleGeneratePO = \(cs: ComparativeStatement\) => \{[\s\S]*?\}\);\n  \};\n/,
  ''
);

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
