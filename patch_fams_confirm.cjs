const fs = require('fs');
let code = fs.readFileSync('src/pages/FAMSPage.tsx', 'utf-8');

// Add state
const stateStr = "const [showReallocateModal, setShowReallocateModal] = useState(false);";
if (code.includes(stateStr)) {
    code = code.replace(stateStr, stateStr + "\n  const [showPdfConfirm, setShowPdfConfirm] = useState(false);\n  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);");
}

// Modify handleDownloadPDF
const oldHandleDownload = `  const handleDownloadPDF = async () => {
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

const newHandleDownload = `  const handleDownloadPDF = async () => {
    const element = document.getElementById('site-wise-depreciation-report');
    if (!element) return;
    
    setIsGeneratingPdf(true);
    
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
      setIsGeneratingPdf(false);
      setShowPdfConfirm(false);
    }
  };`;

code = code.replace(oldHandleDownload, newHandleDownload);

// Change button click
code = code.replace("onClick={handleDownloadPDF}", "onClick={() => setShowPdfConfirm(true)}");

// Add Modal JSX at the end, just before the closing </div>  );
const modalJSX = `
      {/* PDF Download Confirmation Modal */}
      {showPdfConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Download PDF Report?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Would you like to generate and download the Site-Wise Depreciation Report in PDF format?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowPdfConfirm(false)}
                disabled={isGeneratingPdf}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="px-4 py-2 bg-[#174A7E] hover:bg-[#123a63] text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Yes, Download</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
`;

const insertIndex = code.lastIndexOf("    </div>\n  );\n};\n");
if (insertIndex !== -1) {
    code = code.substring(0, insertIndex) + modalJSX + code.substring(insertIndex);
}

fs.writeFileSync('src/pages/FAMSPage.tsx', code);
console.log("Patched FAMSPage successfully.");
