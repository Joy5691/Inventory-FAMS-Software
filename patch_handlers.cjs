const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

const handlers = `
  const handleQuotationChange = (vendorIdx: number, field: string, value: any) => {
    const newQ = [...csQuotationsData];
    newQ[vendorIdx][field] = value;
    setCsQuotationsData(newQ);
  };
  
  const handleCSItemChange = (vendorIdx: number, itemIdx: number, field: string, value: any) => {
    const newQ = [...csQuotationsData];
    newQ[vendorIdx].items[itemIdx][field] = value;
    setCsQuotationsData(newQ);
  };
  
  const handleRemoveCSItem = (vendorIdx: number, itemIdx: number) => {
    const newQ = [...csQuotationsData];
    newQ[vendorIdx].items.splice(itemIdx, 1);
    setCsQuotationsData(newQ);
  };
  
  const handleRemoveCSQuotation = (idx: number) => {
    const newQ = [...csQuotationsData];
    newQ.splice(idx, 1);
    setCsQuotationsData(newQ);
  };

  const handleOpenCSModal =`;

code = code.replace(/const handleOpenCSModal =/, handlers);

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
