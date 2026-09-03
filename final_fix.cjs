const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

// There is one more onClick reference inside InventoryPage that wasn't correctly mapped
code = code.replace(
  /onClick=\{\(\) => \{ setChallanTargetGRN\(grn\); setShowChallanModal\(true\); \}\}/g,
  `onClick={() => postGRN(grn.id)}` 
  // Wait, I replaced it before but state is missing, let me manually inject state at the very top.
);

// We need to just inject state manually immediately after export default function InventoryPage() {
const exportLine = "export default function InventoryPage() {";
const injectedState = `
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanTargetGRN, setChallanTargetGRN] = useState<any>(null);
  const [challanData, setChallanData] = useState({ 
    receivedDate: new Date().toISOString().split('T')[0], 
    approvedDate: new Date().toISOString().split('T')[0], 
    challanFileName: '' 
  });
`;

if (!code.match(/const \[showChallanModal, setShowChallanModal\] = useState\(false\);/)) {
    code = code.replace(exportLine, exportLine + "\\n" + injectedState);
} else {
    // If it's somewhere else, remove it and put it at top.
    code = code.replace(/const \[showChallanModal, setShowChallanModal\] = useState\(false\);\s*const \[challanTargetGRN, setChallanTargetGRN\] = useState<any>\(null\);\s*const \[challanData, setChallanData\] = useState\(\{[\s\S]*?\}\);/m, "");
    code = code.replace(exportLine, exportLine + "\\n" + injectedState);
}

// Ensure the button actually has the correct onClick handler
code = code.replace(
  /onClick=\{\(\) => postGRN\(grn\.id\)\}/g,
  `onClick={() => { setChallanTargetGRN(grn); setShowChallanModal(true); }}`
);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
