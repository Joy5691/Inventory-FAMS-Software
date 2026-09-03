const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

// Fix 1: literal \n
code = code.replace("lucide-react';\\nimport html2pdf", "lucide-react';\\nimport html2pdf"); // actually let's just replace the literal '\\n'
code = code.replace(/lucide-react';\\\\nimport html2pdf/, "lucide-react';\\nimport html2pdf");

// Fix 2: literal \n in function injection
code = code.replace(/const totalDepreciation = totalCapCost - totalNBV;\\\\n\\\\n  const handleDownloadPDF/, "const totalDepreciation = totalCapCost - totalNBV;\\n\\n  const handleDownloadPDF");

// Fix 3: literal \n in div
code = code.replace(/<div id="site-wise-depreciation-report" className="bg-white p-4">\\\\n          <div className="hidden print:block mb-6 text-center">/, '<div id="site-wise-depreciation-report" className="bg-white p-4">\\n          <div className="hidden print:block mb-6 text-center">');

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
