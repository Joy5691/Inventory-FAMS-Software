const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

if (!code.includes("import html2pdf from 'html2pdf.js';")) {
    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1} from 'lucide-react';\\nimport html2pdf from 'html2pdf.js';");
}

const handleDownloadFn = `  const handleDownloadPDF = () => {
    const element = document.getElementById('site-wise-depreciation-report');
    if (!element) return;
    
    // Temporarily remove print-specific classes that hide elements on screen
    const printHiddenEls = element.querySelectorAll('.hidden.print\\\\:block');
    printHiddenEls.forEach(el => {
      el.classList.remove('hidden', 'print:block');
      el.classList.add('block');
    });

    const opt = {
      margin:       10,
      filename:     \`Site_Wise_Depreciation_Report_\${new Date().toISOString().split('T')[0]}.pdf\`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
       // Restore classes
       printHiddenEls.forEach(el => {
         el.classList.remove('block');
         el.classList.add('hidden', 'print:block');
       });
    });
  };`;

// Insert the function after const siteWiseData = ...
const insertAfterStr = "accumDep };\\n  });";
if (code.includes(insertAfterStr)) {
    code = code.replace(insertAfterStr, insertAfterStr + "\\n\\n" + handleDownloadFn);
} else {
    console.log("Could not find insert point for handleDownloadFn");
}

// Replace window.print() with handleDownloadPDF()
code = code.replace("onClick={() => window.print()}", "onClick={handleDownloadPDF}");

// Add the ID to the container wrapping the report content (just below the header with the button)
const beforeId = `<div className="hidden print:block mb-6">`;
if (code.includes(beforeId)) {
    code = code.replace(beforeId, `<div id="site-wise-depreciation-report" className="bg-white p-4">\\n          <div className="hidden print:block mb-6 text-center">`);
    // And we need to close this new div after the table.
    const tableEnd = `</table>\\n          </div>`;
    code = code.replace(tableEnd, tableEnd + `\\n          </div>`);
}

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
console.log("Patched FAMSPage for PDF");
