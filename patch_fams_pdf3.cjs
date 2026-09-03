const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

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

const insertAfterStr = "const totalDepreciation = totalCapCost - totalNBV;";
if (code.includes(insertAfterStr)) {
    code = code.replace(insertAfterStr, insertAfterStr + "\\n\\n" + handleDownloadFn);
    console.log("Injected function");
} else {
    console.log("Could not find insert point");
}

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
