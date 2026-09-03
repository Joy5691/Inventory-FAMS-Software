const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const replacement = `
  const postGRN = (grnId: string, options?: { receivedDate: string, approvedDate: string, challanFileName: string }) => {
    const targetGRN = grns.find(g => g.id === grnId);
    if (!targetGRN) return;

    // Update stock levels or create asset for accepted items
    targetGRN.items.forEach(it => {
      if (it.acceptedQty > 0 || it.orderedQty > 0) { // Fallback to orderedQty if acceptedQty not filled yet
        const qtyToReceive = it.acceptedQty > 0 ? it.acceptedQty : it.orderedQty;
        
        // If it's heavy equipment, create a Fixed Asset
        if (it.itemDescription.toLowerCase().includes('equipment') || it.itemDescription.toLowerCase().includes('machine') || it.itemDescription.toLowerCase().includes('vehicle')) {
          const po = pos.find(p => p.id === targetGRN.poId);
          const unitCost = po?.items.find((pi: any) => pi.itemDescription === it.itemDescription)?.unitPrice || 0;
          
          for(let i=0; i < qtyToReceive; i++) {
             createAsset({
                name: it.itemDescription,
                category: 'Heavy Equipment',
                purchaseCost: unitCost,
                purchaseDate: options?.receivedDate || new Date().toISOString().substring(0, 10),
                vendorName: targetGRN.vendorName,
                assignedToProject: targetGRN.projectName,
                assignedToProjectId: targetGRN.projectId,
                location: targetGRN.projectName + ' Site',
                status: 'Available',
                maintenanceSchedule: [],
                buyingDate: options?.receivedDate || new Date().toISOString().substring(0, 10)
             });
          }
        } else {
          // Increment Store Stock
          setStocks(prev => {
            const storeName = targetGRN.receivingStore as any;
            const existing = prev.find(s => s.storeName === storeName && s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase()));
            if (existing) {
              return prev.map(s => s === existing ? { ...s, availableQty: s.availableQty + qtyToReceive, lastUpdated: new Date().toISOString().substring(0, 10) } : s);
            } else {
              return [
                ...prev,
                {
                  itemId: \\\`itm-\\\${Date.now()}\\\`,
                  itemCode: \\\`MAT-\\\${it.itemDescription.substring(0, 3).toUpperCase()}-NEW\\\`,
                  itemName: it.itemDescription,
                  unit: it.unit,
                  storeName: storeName || 'Ashulia Central Store',
                  availableQty: qtyToReceive,
                  reservedQty: 0,
                  inTransitQty: 0,
                  binCardNumber: \\\`BIN-\\\${Date.now().toString().slice(-4)}\\\`,
                  lastUpdated: new Date().toISOString().substring(0, 10)
                }
              ];
            }
          });
        }
      }
    });

    setGrns(prev => prev.map(g => g.id === grnId ? { 
      ...g, 
      status: 'Inspected & Posted', 
      supplierChallanNo: options?.challanFileName || g.supplierChallanNo,
      date: options?.receivedDate || g.date
    } : g));

    addAuditLog({
      userName: currentUser?.name || 'Inspector',
      userRole: activeRole,
      action: 'POST_GRN_RECEIPT',
      documentType: 'Goods Received Note',
      documentCode: targetGRN.grnNumber,
      projectName: targetGRN.projectName,
      previousStatus: 'Draft',
      newStatus: 'Inspected & Posted',
      details: \\\`GRN \\\${targetGRN.grnNumber} quality inspection passed. Stock updated in \\\${targetGRN.receivingStore}.\\\`
    });
  };
`;

code = code.replace(
  /const postGRN = \(grnId: string, options\?: \{ receivedDate: string, approvedDate: string, challanFileName: string \}\) => \{[\s\S]*?\}\s*\};\s*const createMIV/m,
  replacement.trim() + "\n\n  const createMIV"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
