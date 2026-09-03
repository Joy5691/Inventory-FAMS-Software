const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const targetGRNReplaceOld = `    // Update stock levels or create asset for accepted items
    targetGRN.items.forEach(it => {
      if (it.acceptedQty > 0) {
        if (it.isAsset) {
          // Flag for FAMS creation
        } else {
          // Increment Store Stock
          setStocks(prev => {
            const storeName = targetGRN.receivingStore as any;
            const existing = prev.find(s => s.storeName === storeName && s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase()));
            if (existing) {
              return prev.map(s => s === existing ? { ...s, availableQty: s.availableQty + it.acceptedQty, lastUpdated: new Date().toISOString().substring(0, 10) } : s);
            } else {
              return [
                ...prev,
                {
                  itemId: \`itm-\${Date.now()}\`,
                  itemCode: \`MAT-\${it.itemDescription.substring(0, 3).toUpperCase()}-NEW\`,
                  itemName: it.itemDescription,
                  unit: it.unit,
                  storeName: storeName || 'Ashulia Central Store',
                  availableQty: it.acceptedQty,
                  reservedQty: 0,
                  inTransitQty: 0,
                  binCardNumber: \`BIN-\${Date.now().toString().slice(-4)}\`,
                  lastUpdated: new Date().toISOString().substring(0, 10)
                }
              ];
            }
          });
        }
      }
    });`;

const targetGRNReplaceNew = `    // Update stock levels or create asset for accepted items
    const newAssetsToCreate: any[] = [];
    
    targetGRN.items.forEach(it => {
      if (it.acceptedQty > 0) {
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
                sourceGrnNo: targetGRN.grnNumber,
                purchaseCost: 0,
                capitalizationDate: new Date().toISOString().substring(0, 10),
                usefulLifeYears: 5,
                residualValue: 0,
                depreciationMethod: 'Straight-Line (SLM)',
                currentNetBookValue: 0,
                projectId: targetGRN.projectId,
                projectName: targetGRN.projectName,
                currentLocation: targetGRN.receivingStore,
                custodianName: targetGRN.storeOfficer || 'Store Officer',
                custodianPhone: 'N/A',
                status: 'Active / Deployed',
                operationalHours: 0,
                maintenanceSchedule: [],
                transferHistory: []
             });
          }
        } else {
          // Increment Store Stock
          setStocks(prev => {
            const storeName = targetGRN.receivingStore as any;
            const existing = prev.find(s => s.storeName === storeName && s.itemName.toLowerCase().includes(it.itemDescription.toLowerCase()));
            if (existing) {
              return prev.map(s => s === existing ? { ...s, projectId: targetGRN.projectId || s.projectId, availableQty: s.availableQty + it.acceptedQty, lastUpdated: new Date().toISOString().substring(0, 10) } : s);
            } else {
              return [
                ...prev,
                {
                  itemId: \`itm-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
                  itemCode: \`MAT-\${it.itemDescription.substring(0, 3).toUpperCase()}-NEW\`,
                  itemName: it.itemDescription,
                  unit: it.unit,
                  storeName: storeName || 'Ashulia Central Store',
                  projectId: targetGRN.projectId,
                  availableQty: it.acceptedQty,
                  reservedQty: 0,
                  inTransitQty: 0,
                  binCardNumber: \`BIN-\${Date.now().toString().slice(-4)}\`,
                  lastUpdated: new Date().toISOString().substring(0, 10)
                }
              ];
            }
          });
        }
      }
    });
    
    if (newAssetsToCreate.length > 0) {
       setAssets(prev => [...prev, ...newAssetsToCreate]);
    }`;

code = code.replace(targetGRNReplaceOld, targetGRNReplaceNew);

// Now for confirmMTVReceipt
const mtvReplaceOld = `          const destItem = updated.find(s =>
            (s.storeName === toLoc || s.storeName.toLowerCase().includes(toLoc.toLowerCase())) &&
            s.itemName.toLowerCase().includes(it.itemName.toLowerCase())
          );
          if (destItem) {
            updated = updated.map(s => s === destItem ? { ...s, availableQty: s.availableQty + it.qty } : s);
          } else {
            updated.push({
              itemId: \`itm-\${Date.now()}\`,
              itemCode: \`MAT-TRANS-\${Date.now().toString().slice(-4)}\`,
              itemName: it.itemName,
              unit: it.unit,
              storeName: toLoc as any,
              projectId: targetMTV.destinationProjectId || targetMTV.projectId,
              availableQty: it.qty,
              reservedQty: 0,
              inTransitQty: 0,
              binCardNumber: \`BIN-\${Date.now().toString().slice(-4)}\`,
              lastUpdated: new Date().toISOString().substring(0, 10)
            });
          }`;

const mtvReplaceNew = `          const destItem = updated.find(s =>
            (s.storeName === toLoc || s.storeName.toLowerCase().includes(toLoc.toLowerCase())) &&
            s.itemName.toLowerCase().includes(it.itemName.toLowerCase())
          );
          if (destItem) {
            updated = updated.map(s => s === destItem ? { ...s, availableQty: s.availableQty + it.qty, projectId: targetMTV.destinationProjectId || targetMTV.projectId || s.projectId } : s);
          } else {
            updated.push({
              itemId: \`itm-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
              itemCode: \`MAT-TRANS-\${Date.now().toString().slice(-4)}\`,
              itemName: it.itemName,
              unit: it.unit,
              storeName: toLoc as any,
              projectId: targetMTV.destinationProjectId || targetMTV.projectId,
              availableQty: it.qty,
              reservedQty: 0,
              inTransitQty: 0,
              binCardNumber: \`BIN-\${Date.now().toString().slice(-4)}\`,
              lastUpdated: new Date().toISOString().substring(0, 10)
            });
          }`;

code = code.replace(mtvReplaceOld, mtvReplaceNew);

// Fix confirmMTVReceipt asset assignment (adding project updates)
const assetReplaceOld = `              ...a,
              status: 'Active / Deployed',
              currentLocation: toLoc,
              custodianName: targetMTV.receiverName || a.custodianName
            };`;

const assetReplaceNew = `              ...a,
              status: 'Active / Deployed',
              currentLocation: toLoc,
              projectId: targetMTV.destinationProjectId || targetMTV.projectId || a.projectId,
              projectName: targetMTV.destinationProjectName || targetMTV.projectName || a.projectName,
              custodianName: targetMTV.receiverName || a.custodianName
            };`;
            
code = code.replace(assetReplaceOld, assetReplaceNew);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log("AppContext updated successfully!");
