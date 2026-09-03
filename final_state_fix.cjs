const fs = require('fs');
let code = fs.readFileSync('src/pages/InventoryPage.tsx', 'utf-8');

// The component is "export const InventoryPage: React.FC<InventoryPageProps> = ({ onOpenDocPrint }) => {"
const exportLine = "export const InventoryPage: React.FC<InventoryPageProps> = ({ onOpenDocPrint }) => {";
const injectedState = `
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanTargetGRN, setChallanTargetGRN] = useState<any>(null);
  const [challanData, setChallanData] = useState({ 
    receivedDate: new Date().toISOString().split('T')[0], 
    approvedDate: new Date().toISOString().split('T')[0], 
    challanFileName: '' 
  });
`;

code = code.replace(/const \[showChallanModal, setShowChallanModal\] = useState\(false\);\s*const \[challanTargetGRN, setChallanTargetGRN\] = useState<any>\(null\);\s*const \[challanData, setChallanData\] = useState\(\{[\s\S]*?\}\);/m, "");

code = code.replace(exportLine, exportLine + "\\n" + injectedState);

fs.writeFileSync('src/pages/InventoryPage.tsx', code);
