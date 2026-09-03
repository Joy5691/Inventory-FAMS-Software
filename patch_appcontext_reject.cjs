const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const impl = `
  const rejectPurchaseRequisition = (prId: string, reason?: string) => {
    setPrs(prev => prev.map(p => p.id === prId ? { ...p, status: 'Rejected' } : p));
  };
`;
// Let's just manually patch it below rejectMR
code = code.replace(/const rejectMR = [^{]+{([\s\S]*?)\n  };/, `$&${impl}`);

code = code.replace(/if \(task\.documentType === 'Material Requisition'\) {\n      rejectMR\(task.documentId, comment\);\n    }/, `if (task.documentType === 'Material Requisition') {
      rejectMR(task.documentId, comment);
    } else if (task.documentType === 'Purchase Requisition') {
      setPrs(prev => prev.map(p => p.id === task.documentId ? { ...p, status: 'Rejected' } : p));
    } else if (task.documentType === 'Comparative Statement') {
      setCsList(prev => prev.map(p => p.id === task.documentId ? { ...p, status: 'Rejected' } : p));
    } else if (task.documentType === 'Purchase Order') {
      setPos(prev => prev.map(p => p.id === task.documentId ? { ...p, status: 'Rejected' } : p));
    }`);
fs.writeFileSync('src/context/AppContext.tsx', code);
