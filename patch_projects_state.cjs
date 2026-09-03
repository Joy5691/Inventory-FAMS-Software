const fs = require('fs');
let code = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf-8');

code = code.replace(
  /const \{ projects, mrs, prs, grns, mivs, mtvs, stocks, addProject, items, createMR, currentUser, activeRole \} = useApp\(\);/,
  "const { projects, mrs, prs, grns, mivs, mtvs, stocks, addProject, items, createMR, postGRN, currentUser, activeRole } = useApp();"
);

const stateInsert = `
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanTargetGRN, setChallanTargetGRN] = useState<any>(null);
  const [challanData, setChallanData] = useState({ 
    receivedDate: new Date().toISOString().split('T')[0], 
    approvedDate: new Date().toISOString().split('T')[0], 
    challanFileName: '' 
  });
`;

code = code.replace(
  /const \[isLoading, setIsLoading\] = useState\(true\);/,
  "const [isLoading, setIsLoading] = useState(true);\n" + stateInsert
);

fs.writeFileSync('src/pages/ProjectsPage.tsx', code);
