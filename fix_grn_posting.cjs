const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const targetGRNReplaceOld = `    const newAssetsToCreate: any[] = [];
    
    targetGRN.items.forEach(it => {
      if (it.acceptedQty > 0) {
        if (it.isAsset) {`;

const targetGRNReplaceNew = `    const newAssetsToCreate: any[] = [];
    
    // Auto-fill received/accepted quantities if they were left as 0 during direct posting
    const updatedItems = targetGRN.items.map(it => {
       const qtyToAccept = it.acceptedQty > 0 ? it.acceptedQty : (it.orderedQty || (it as any).quantity || 0);
       return {
         ...it,
         receivedQty: it.receivedQty > 0 ? it.receivedQty : qtyToAccept,
         acceptedQty: qtyToAccept
       };
    });

    updatedItems.forEach(it => {
      if (it.acceptedQty > 0) {
        if (it.isAsset) {`;

code = code.replace(targetGRNReplaceOld, targetGRNReplaceNew);

const setGrnReplaceOld = `    setGrns(prev => prev.map(g => g.id === grnId ? { ...g, status: 'Inspected & Posted' } : g));`;
const setGrnReplaceNew = `    setGrns(prev => prev.map(g => g.id === grnId ? { 
      ...g, 
      items: updatedItems, 
      status: 'Inspected & Posted',
      date: options?.receivedDate || g.date,
      supplierChallanNo: options?.challanFileName || g.supplierChallanNo
    } : g));`;

code = code.replace(setGrnReplaceOld, setGrnReplaceNew);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("AppContext updated successfully!");
