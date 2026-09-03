const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

// Update handleIssueMultiplePOs
const oldHandleIssue = `  const handleIssueMultiplePOs = () => {
    if (!poTargetCS) return;
    
    const newPoIds: string[] = [];
    poSelectedVendors.forEach((vendorId) => {
       const quote = poTargetCS.quotations.find((q: any) => q.vendorId === vendorId);
       if (!quote) return;
       
       const vendor = vendors.find(v => v.id === vendorId);
       
       createPurchaseOrder({`;

const newHandleIssue = `  const handleIssueMultiplePOs = () => {
    if (!poTargetCS) return;
    
    const newPoIds: string[] = [];
    poSelectedVendors.forEach((qRef) => {
       const quote = poTargetCS.quotations.find((q: any) => q.quoteRef === qRef);
       if (!quote) return;
       
       const vendor = vendors.find(v => v.id === quote.vendorId);
       
       createPurchaseOrder({`;

code = code.replace(oldHandleIssue, newHandleIssue);

// Fix createPurchaseOrder argument inside handleIssueMultiplePOs
const oldArgs = `         orderType: 'Purchase Order',
         vendorId: vendorId,`;

const newArgs = `         orderType: 'Purchase Order',
         vendorId: quote.vendorId,`;

code = code.replace(oldArgs, newArgs);

// Update render loop selection
const oldIsSelected = `const isSelected = poSelectedVendors.includes(q.vendorId);`;
const newIsSelected = `const isSelected = poSelectedVendors.includes(q.quoteRef);`;
code = code.replace(oldIsSelected, newIsSelected);

const oldOnChange = `                        onChange={(e) => {
                          if (e.target.checked) {
                            setPoSelectedVendors([...poSelectedVendors, q.vendorId]);
                          } else {
                            setPoSelectedVendors(poSelectedVendors.filter(id => id !== q.vendorId));
                          }
                        }}`;

const newOnChange = `                        onChange={(e) => {
                          if (e.target.checked) {
                            setPoSelectedVendors([...poSelectedVendors, q.quoteRef]);
                          } else {
                            setPoSelectedVendors(poSelectedVendors.filter(id => id !== q.quoteRef));
                          }
                        }}`;

code = code.replace(oldOnChange, newOnChange);

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
