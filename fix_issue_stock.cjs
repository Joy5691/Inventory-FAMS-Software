const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// The issueMARToGRN function currently looks like:
// const issueMARToGRN = (marId: string): GoodsReceivedNote | null => { ... setGrns(prev => [newGRN, ...prev]); ...

// We want to add stock deduction logic right after setGrns.
const searchStr = 'setGrns(prev => [newGRN, ...prev]);';
const replaceStr = `setGrns(prev => [newGRN, ...prev]);

    // Deduct stock from central stores
    setStocks(prev => {
      let updated = [...prev];
      issueItems.forEach(it => {
        const qtyToIssue = it.reservedQty || it.requiredQty;
        if (qtyToIssue <= 0) return;
        
        let remaining = qtyToIssue;
        
        // Try Ashulia first
        const ashuliaIdx = updated.findIndex(s => s.storeName === 'Ashulia Central Store' && s.itemName.toLowerCase().includes(it.itemName.toLowerCase()));
        if (ashuliaIdx !== -1 && remaining > 0) {
           const deduct = Math.min(updated[ashuliaIdx].availableQty, remaining);
           updated[ashuliaIdx] = { ...updated[ashuliaIdx], availableQty: updated[ashuliaIdx].availableQty - deduct };
           remaining -= deduct;
        }
        
        // Then Sreemangal
        const sreeIdx = updated.findIndex(s => s.storeName === 'Sreemangal Regional Store' && s.itemName.toLowerCase().includes(it.itemName.toLowerCase()));
        if (sreeIdx !== -1 && remaining > 0) {
           const deduct = Math.min(updated[sreeIdx].availableQty, remaining);
           updated[sreeIdx] = { ...updated[sreeIdx], availableQty: updated[sreeIdx].availableQty - deduct };
           remaining -= deduct;
        }
      });
      return updated;
    });
`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("Updated issueMARToGRN to deduct stock");
