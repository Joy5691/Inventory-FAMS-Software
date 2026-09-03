const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

code = code.replace("import html2pdf from 'html2pdf.js';", "import html2canvas from 'html2canvas-pro';\nimport jsPDF from 'jspdf';");

const oldHandleDownload = `  const handleDownloadPDF = () => {
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
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'landscape' as const }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
       // Restore classes
       printHiddenEls.forEach(el => {
         el.classList.remove('block');
         el.classList.add('hidden', 'print:block');
       });
    });
  };`;

const newHandleDownload = `  const handleDownloadPDF = async () => {
    const element = document.getElementById('site-wise-depreciation-report');
    if (!element) return;
    
    // Temporarily remove print-specific classes that hide elements on screen
    const printHiddenEls = element.querySelectorAll('.hidden.print\\\\:block');
    printHiddenEls.forEach(el => {
      el.classList.remove('hidden', 'print:block');
      el.classList.add('block');
    });
    
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
      pdf.save(\`Site_Wise_Depreciation_Report_\${new Date().toISOString().split('T')[0]}.pdf\`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      // Restore classes
      printHiddenEls.forEach(el => {
        el.classList.remove('block');
        el.classList.add('hidden', 'print:block');
      });
    }
  };`;

if (code.includes(oldHandleDownload)) {
    code = code.replace(oldHandleDownload, newHandleDownload);
    console.log("Patched FAMSPage.tsx successfully.");
} else {
    console.log("Could not find old handleDownloadPDF in FAMSPage.tsx");
}

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
