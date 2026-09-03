const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const oldApprovePO = `  const approvePurchaseOrder = (poId: string) => {
    setPos(prev => prev.map(p => p.id === poId ? { ...p, status: 'Approved', authorizedSignatory: currentUser?.name } : p));
    setApprovalTasks(prev => prev.map(t => t.documentId === poId ? { ...t, status: 'Approved' } : t));

    // Get the PO details from the current closure state
    const po = pos.find(p => p.id === poId);
    if (po) {
      setGrns(currentGrns => {
        const grnNum = \`GRN-2026-\${String(currentGrns.length + 25).padStart(4, "0")}\`;
        const newGRN = {
          id: \`grn-\${Date.now()}\`,
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
            orderedQty: (it as any).qty || (it as any).quantity || (it as any).orderedQty || 0,
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

    addAuditLog({`;

const newApprovePO = `  const approvePurchaseOrder = (poId: string) => {
    setPos(prev => prev.map(p => p.id === poId ? { ...p, status: 'Approved', authorizedSignatory: currentUser?.name } : p));
    setApprovalTasks(prev => prev.map(t => t.documentId === poId ? { ...t, status: 'Approved' } : t));

    const po = pos.find(p => p.id === poId);
    if (po) {
      // 1) Initialize correctly for the Project Challan
      const mappedItems = po.items.map(it => {
        const qty = (it as any).qty || (it as any).quantity || (it as any).orderedQty || 0;
        return {
          slNo: it.slNo,
          itemDescription: it.itemDescription,
          specification: it.specification,
          unit: it.unit,
          orderedQty: qty,
          receivedQty: qty, // Correctly initialized
          acceptedQty: qty, // Correctly initialized
          rejectedQty: 0,
          damagedQty: 0,
          inspectionResult: 'Passed' as const,
          isAsset: it.itemDescription.toLowerCase().includes('equipment') || it.itemDescription.toLowerCase().includes('machine') || it.itemDescription.toLowerCase().includes('vehicle')
        };
      });

      // 2) Decrement from main warehouse & Increment receiving project inventory/asset log simultaneously
      const newAssetsToCreate: any[] = [];
      const receivingStoreName = po.deliveryLocation || po.projectName + ' Site Store';

      setStocks(prev => {
        let updatedStocks = [...prev];

        mappedItems.forEach(it => {
          if (it.acceptedQty > 0) {
            // Decrement from Central Warehouse
            const centralIndex = updatedStocks.findIndex(s => s.storeName === 'Ashulia Central Store' && s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase()));
            if (centralIndex !== -1) {
              updatedStocks[centralIndex] = {
                ...updatedStocks[centralIndex],
                availableQty: Math.max(0, updatedStocks[centralIndex].availableQty - it.acceptedQty),
                lastUpdated: new Date().toISOString().substring(0, 10)
              };
            }

            // Increment Receiving Project or Asset
            if (it.isAsset) {
              for (let i = 0; i < it.acceptedQty; i++) {
                newAssetsToCreate.push({
                  id: \`asset-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
                  assetCode: \`TCCL-EQ-\${new Date().getFullYear()}-\${Math.floor(Math.random()*1000).toString().padStart(3, '0')}\`,
                  qrCode: \`QR-EQ-\${Date.now()}-\${i}\`,
                  name: it.itemDescription,
                  category: 'Heavy Earthmoving',
                  makeModel: 'TBD',
                  serialChassisNo: \`SN-TBD-\${Date.now()}-\${i}\`,
                  sourceGrnNo: \`PO-\${po.poNumber}\`,
                  purchaseCost: 0,
                  capitalizationDate: new Date().toISOString().substring(0, 10),
                  usefulLifeYears: 5,
                  residualValue: 0,
                  depreciationMethod: 'Straight-Line (SLM)',
                  currentNetBookValue: 0,
                  projectId: po.projectId,
                  projectName: po.projectName,
                  currentLocation: receivingStoreName,
                  custodianName: 'Site Engineer',
                  custodianPhone: 'N/A',
                  status: 'Active / Deployed',
                  operationalHours: 0,
                  maintenanceSchedule: [],
                  transferHistory: []
                });
              }
            } else {
              // Increment Project Store Inventory
              const projectStoreIndex = updatedStocks.findIndex(s => s.storeName === receivingStoreName && s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase()));
              if (projectStoreIndex !== -1) {
                updatedStocks[projectStoreIndex] = {
                  ...updatedStocks[projectStoreIndex],
                  availableQty: updatedStocks[projectStoreIndex].availableQty + it.acceptedQty,
                  projectId: po.projectId,
                  lastUpdated: new Date().toISOString().substring(0, 10)
                };
              } else {
                updatedStocks.push({
                  itemId: \`itm-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
                  itemCode: \`MAT-\${it.itemDescription.substring(0, 3).toUpperCase()}-NEW\`,
                  itemName: it.itemDescription,
                  unit: it.unit,
                  storeName: receivingStoreName as any,
                  projectId: po.projectId,
                  availableQty: it.acceptedQty,
                  reservedQty: 0,
                  inTransitQty: 0,
                  binCardNumber: \`BIN-\${Date.now().toString().slice(-4)}\`,
                  lastUpdated: new Date().toISOString().substring(0, 10)
                });
              }
            }
          }
        });

        return updatedStocks;
      });

      if (newAssetsToCreate.length > 0) {
        setAssets(prev => [...prev, ...newAssetsToCreate]);
      }

      setGrns(currentGrns => {
        const grnNum = \`GRN-2026-\${String(currentGrns.length + 25).padStart(4, "0")}\`;
        const newGRN = {
          id: \`grn-\${Date.now()}\`,
          grnNumber: grnNum,
          date: new Date().toISOString().substring(0, 10),
          poId: po.id,
          poNumber: po.poNumber,
          vendorName: po.vendorName,
          supplierChallanNo: 'Auto-Issued from PO',
          vehicleNo: 'N/A',
          driverName: 'N/A',
          driverPhone: 'N/A',
          receivingStore: receivingStoreName,
          projectId: po.projectId,
          projectName: po.projectName,
          items: mappedItems,
          inspectedBy: 'Auto-Approved',
          status: 'Inspected & Posted' as const, // Pre-posted as it's fully transactional
          receivedBy: currentUser?.name || 'System',
          comments: 'Auto-generated and auto-posted from Approved PO.'
        };
        return [newGRN, ...currentGrns];
      });
    }

    addAuditLog({`;

code = code.replace(oldApprovePO, newApprovePO);
fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("Updated approvePurchaseOrder successfully");
