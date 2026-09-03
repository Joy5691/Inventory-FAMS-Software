const fs = require('fs');
let code = fs.readFileSync('src/pages/ProcurementPage.tsx', 'utf-8');

// 1. Destructure issueMARToGRN from useApp
code = code.replace(
  "    createPRFromMAR,",
  "    createPRFromMAR,\n    issueMARToGRN,"
);

// 2. Add the new button next to "Create PR for Shortage"
// The target is:
/*
                    {mar.items.some(i => i.shortageQty > 0) && (
                      <button
                        onClick={() => {
                          createPRFromMAR(mar.id);
                          setActiveSubTab('pr');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> Auto-Create PR for Shortage
                      </button>
                    )}
*/

const btnHtml = `
                    {mar.items.some(i => i.actionTaken === 'Reserve & Issue') && mar.status !== 'Issued to GRN' && (
                      <button
                        onClick={() => {
                          issueMARToGRN(mar.id);
                          alert("GRN has been generated and sent for Site Approval.");
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Reserve & Issue to GRN
                      </button>
                    )}
`;

// Insert after Print Official MAR button (or before Create PR for Shortage)
const targetBtnStr = '<Printer className="w-3.5 h-3.5" /> Print Official MAR\n                    </button>';
const insertIndex = code.indexOf(targetBtnStr);

if (insertIndex !== -1) {
  const insertPos = insertIndex + targetBtnStr.length;
  code = code.slice(0, insertPos) + btnHtml + code.slice(insertPos);
} else {
  console.log("Failed to find insertion point for button");
}

fs.writeFileSync('src/pages/ProcurementPage.tsx', code);
console.log("ProcurementPage updated successfully!");
