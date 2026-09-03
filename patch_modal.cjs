const fs = require('fs');
let code = fs.readFileSync('src/components/documents/DocumentPrintModal.tsx', 'utf-8');

code = code.replace("import html2pdf from 'html2pdf.js';", "import html2canvas from 'html2canvas-pro';\nimport jsPDF from 'jspdf';");

const oldHandleDownload = `  const handleDownload = () => {
    const element = document.getElementById('printable-canvas');
    if (!element) return;
    
    // Find the relevant document number for the filename
    const docNo = data.mrNumber || data.prNumber || data.marNumber || data.poNumber || data.mivNo || data.mtvNo || data.memoNo || data.gatePassNo || 'document';
    
    const opt = {
      margin:       10,
      filename:     \`\${docType}_\${docNo}.pdf\`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };`;

const newHandleDownload = `  const handleDownload = async () => {
    const element = document.getElementById('printable-canvas');
    if (!element) return;
    
    // Find the relevant document number for the filename
    const docNo = data.mrNumber || data.prNumber || data.marNumber || data.poNumber || data.mivNo || data.mtvNo || data.memoNo || data.gatePassNo || 'document';
    
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
      pdf.save(\`\${docType}_\${docNo}.pdf\`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };`;

if (code.includes(oldHandleDownload)) {
    code = code.replace(oldHandleDownload, newHandleDownload);
    console.log("Patched DocumentPrintModal.tsx successfully.");
} else {
    console.log("Could not find old handleDownload in DocumentPrintModal.tsx");
}

fs.writeFileSync('src/components/documents/DocumentPrintModal.tsx', code);
