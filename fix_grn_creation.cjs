const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const regex = /const approvePurchaseOrder = \(\s*poId:\s*string\s*\) => \{[\s\S]*?\}\s*;\s*(?=const createGRN)/m;

const replacement = `
  const approvePurchaseOrder = (poId: string) => {
    setPos(prev => prev.map(p => p.id === poId ? { ...p, status: 'Approved', authorizedSignatory: currentUser?.name } : p));
    setApprovalTasks(prev => prev.map(t => t.documentId === poId ? { ...t, status: 'Approved' } : t));

    // Get the PO details from the current closure state
    const po = pos.find(p => p.id === poId);
    if (po) {
      setGrns(currentGrns => {
        const grnNum = \\\`GRN-2026-\\\${String(currentGrns.length + 25).padStart(4, '0')}\\\`;
        const newGRN = {
          id: \\\`grn-\\\${Date.now()}\\\`,
          grnNumber: grnNum,
          date: new Date().toISOString().substring(0, 10),
          poId: po.id,
          poNumber: po.poNumber,
          vendorName: po.vendorName,
          supplierChallanNo: 'Pending',
          vehicleNo: 'Pending',
          driverName: 'Pending',
          driverPhone: 'Pending',
          receivingStore: po.deliveryLocation || po.projectName + ' Site Store',
          projectId: po.projectId,
          projectName: po.projectName,
          items: po.items.map(it => ({
            slNo: it.slNo,
            itemDescription: it.itemDescription,
            specification: it.specification,
            unit: it.unit,
            orderedQty: it.quantity || (it as any).orderedQty || 0,
            receivedQty: 0,
            acceptedQty: 0,
            rejectedQty: 0,
            damagedQty: 0,
            inspectionResult: 'Passed',
            isAsset: it.itemDescription.toLowerCase().includes('equipment') || it.itemDescription.toLowerCase().includes('machine') || it.itemDescription.toLowerCase().includes('vehicle')
          })),
          inspectedBy: 'Pending',
          status: 'Pending',
          receivedBy: '',
          comments: 'Auto-generated from Approved PO.'
        };
        return [newGRN, ...currentGrns];
      });
    }

    addAuditLog({
      userName: currentUser?.name || 'Managing Director',
      userRole: activeRole,
      action: 'APPROVE_PURCHASE_ORDER',
      documentType: 'Purchase Order',
      documentCode: poId,
      newStatus: 'Approved',
      details: 'Purchase Order approved by Managing Director and issued to vendor. Pending GRN created for site.'
    });
  };
`;

code = code.replace(regex, replacement.trim() + "\n\n  ");
fs.writeFileSync('src/context/AppContext.tsx', code);
