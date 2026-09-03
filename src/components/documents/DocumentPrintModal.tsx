import React from 'react';
import { Printer, X, Download, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { Logo } from '../common/Logo';

export type PrintableDocumentType = 
  | 'MR'
  | 'MAR'
  | 'PR'
  | 'CS'
  | 'PO'
  | 'GRN'
  | 'GP'
  | 'MIV'
  | 'MTV'
  | 'ASSET'
  | 'FAMS_REGISTER'
  | 'FAMS_DEPRECIATION';

interface DocumentPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: PrintableDocumentType;
  data: any;
}

export const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({
  isOpen,
  onClose,
  docType,
  data
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
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
      pdf.save(`${docType}_${docNo}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const renderCommonHeader = () => (
    <div className="flex flex-col mb-4">
      <div className="flex items-center gap-2 justify-center mb-1">
        <Logo showTagline={false} />
        <h1 className="text-3xl font-bold italic tracking-tight text-black" style={{ fontFamily: 'Times New Roman, serif' }}>
          Construction Company Ltd.
        </h1>
      </div>
      <div className="text-center text-[10px] font-bold italic border-b border-black pb-1 mb-2">
        * Expertise in Pipeline Construction * Gas RMS * Fabrication & Plant Erection * Civil * Electric * Corrosion Engineering * Thermit Welding
      </div>
      
      <div className="flex justify-between gap-4 text-[11px] text-black leading-tight">
        <div>
          <span className="font-bold underline block mb-1">HEAD OFFICE:</span>
          House # 221, Road # 2, DOHS<br />
          Baridhara, Dhaka-1206<br />
          Mobile : +88 01844-143001<br />
          Tel : +880-2-8412871, Fax: +880-2-8411564
        </div>
        <div>
          <span className="font-bold underline block mb-1">REGISTERED ADDRESS:</span>
          House # 516/1, Road # 10<br />
          DOHS Baridhara, Dhaka-1206
        </div>
        <div>
          <span className="font-bold underline block mb-1">CAMP & STORE:</span>
          (a) Aukpara, Ashulia, Savar, Dhaka.<br />
          (b) Kalapur, Sreemangal<br />
          &nbsp;&nbsp;&nbsp;&nbsp;Moulabibazar, Sylhet
        </div>
      </div>
    </div>
  );

  const renderDocHeader = (docNo: string = 'TCCL/PUR/04/01') => (
    <div className="border border-black flex justify-between items-center mb-4 text-xs">
      <div className="p-1 px-2 border-r border-black flex-[0.3]">
        <div className="font-bold">Document No.: {docNo}</div>
        <div className="border-t border-black mt-1 pt-1 font-bold">Revision No.: 00</div>
      </div>
      <div className="p-1 flex-[0.4] flex justify-center items-center gap-2">
        <Logo showTagline={false} />
        <h1 className="text-lg font-bold tracking-tight text-black" style={{ fontFamily: 'Times New Roman, serif' }}>
          Construction Company Ltd.
        </h1>
      </div>
      <div className="p-1 px-2 border-l border-black flex-[0.3]">
        <div className="font-bold">Status: Proposed.</div>
        <div className="border-t border-black mt-1 pt-1 font-bold">Issue Date: 20.11.2016</div>
      </div>
    </div>
  );

  const renderMR = () => (
    <>
      {renderDocHeader()}
      <h2 className="text-center font-bold text-xl underline uppercase mb-4 tracking-wide font-serif">
        MATERIAL REQUISITION
      </h2>
      <table className="w-full text-sm mb-2">
        <tbody>
          <tr>
            <td className="w-1/2 align-top">Project Name: {data.projectName}</td>
            <td className="w-1/2 align-top">Location: {data.location}</td>
          </tr>
          <tr>
            <td className="align-top">Requisition No.: {data.mrNumber}</td>
            <td className="align-top">Department: {data.department}</td>
          </tr>
          <tr>
            <td className="align-top">Date: {data.date}</td>
            <td className="align-top">Due Date: {data.dueDate}</td>
          </tr>
        </tbody>
      </table>
      
      <div className="border border-black p-1 text-sm mb-0.5">
        Purchase Type: Tools / Tackle / Consumable [ ] Goods / Materials [ ] Equipment / Machineries [ ]<br/>
        Service [ ] Hire Purchase / Rental [ ]
      </div>

      <table className="w-full border-collapse border border-black text-sm mb-4">
        <thead>
          <tr>
            <th className="border border-black p-1 w-10 text-center font-bold">Sl. #</th>
            <th className="border border-black p-1 text-center font-bold">Items Description</th>
            <th className="border border-black p-1 text-center font-bold">Specification</th>
            <th className="border border-black p-1 w-16 text-center font-bold">Unit</th>
            <th className="border border-black p-1 w-16 text-center font-bold">Qty</th>
            <th className="border border-black p-1 w-20 text-center font-bold">Ledger</th>
            <th className="border border-black p-1 w-24 text-center font-bold">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || []).map((it: any, idx: number) => (
            <tr key={idx} className="h-6">
              <td className="border border-black p-1 text-center">{idx + 1}</td>
              <td className="border border-black p-1">{it.itemName || it.itemDescription}</td>
              <td className="border border-black p-1">{it.specification || ''}</td>
              <td className="border border-black p-1 text-center">{it.unit}</td>
              <td className="border border-black p-1 text-center">{it.quantity}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1">{it.remarks}</td>
            </tr>
          ))}
          {(!data.items || data.items.length === 0) && (
            <tr className="h-6"><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
          )}
        </tbody>
      </table>

      <div className="flex border border-black font-bold text-sm h-32 items-start pt-1 px-2 mb-4">
        <div className="flex-1 border-r border-black h-full">Initiated By</div>
        <div className="flex-1 border-r border-black h-full pl-2">Checked & Verified By:</div>
        <div className="flex-1 h-full pl-2">Authorized Signatory:</div>
      </div>
    </>
  );

  const renderPR = () => (
    <>
      {renderDocHeader()}
      <h2 className="text-center font-bold text-xl underline uppercase mb-4 tracking-wide font-serif">
        PURCHASE REQUISITION
      </h2>
      <table className="w-full text-sm mb-2">
        <tbody>
          <tr>
            <td className="w-1/2 align-top">Project Name: {data.projectName}</td>
            <td className="w-1/2 align-top">Location: {data.location}</td>
          </tr>
          <tr>
            <td className="align-top">Requisition No.: {data.prNumber || data.mrNumber}</td>
            <td className="align-top">Department: {data.department}</td>
          </tr>
          <tr>
            <td className="align-top">Date: {data.date}</td>
            <td className="align-top">Due Date: {data.dueDate}</td>
          </tr>
        </tbody>
      </table>
      
      <div className="border border-black p-1 text-sm mb-0.5">
        Purchase Type: Tools / Tackle / Consumable [ ] Goods / Materials [ ] Equipment / Machineries [ ]<br/>
        Service [ ] Hire Purchase / Rental [ ]
      </div>

      <table className="w-full border-collapse border border-black text-sm mb-0.5">
        <thead>
          <tr>
            <th className="border border-black p-1 w-10 text-center font-bold">Sl. #</th>
            <th className="border border-black p-1 text-center font-bold">Items Description</th>
            <th className="border border-black p-1 text-center font-bold">Specification</th>
            <th className="border border-black p-1 w-16 text-center font-bold">Unit</th>
            <th className="border border-black p-1 w-16 text-center font-bold">Qty</th>
            <th className="border border-black p-1 w-20 text-center font-bold">Ledger</th>
            <th className="border border-black p-1 w-24 text-center font-bold">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || []).map((it: any, idx: number) => (
            <tr key={idx} className="h-6">
              <td className="border border-black p-1 text-center">{idx + 1}</td>
              <td className="border border-black p-1">{it.itemName || it.itemDescription}</td>
              <td className="border border-black p-1">{it.specification || ''}</td>
              <td className="border border-black p-1 text-center">{it.unit}</td>
              <td className="border border-black p-1 text-center">{it.quantity}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1">{it.remarks}</td>
            </tr>
          ))}
          {(!data.items || data.items.length === 0) && (
            <tr className="h-6"><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
          )}
        </tbody>
      </table>

      <div className="flex border-x border-black text-sm h-24 items-start pt-1">
        <div className="flex-1 border-r border-black h-full px-2">Initiated By:</div>
        <div className="flex-1 border-r border-black h-full px-2">Checked & Verified By:</div>
        <div className="flex-1 h-full px-2">Authorized Signatory:</div>
      </div>
      
      <div className="border border-black text-sm">
        <div className="p-1 border-b border-black">Recommended Supplier (s): (If any)</div>
        <div className="flex border-b border-black text-center font-bold">
          <div className="w-12 border-r border-black p-1">Sl. #</div>
          <div className="w-1/4 border-r border-black p-1">Supplier (s) Name</div>
          <div className="flex-1 border-r border-black p-1">Address, Phone No. etc.</div>
          <div className="w-1/4 p-1">Category of Supplier (s)</div>
        </div>
        <div className="flex border-b border-black text-center">
          <div className="w-12 border-r border-black p-1 h-6">01</div>
          <div className="w-1/4 border-r border-black p-1 h-6"></div>
          <div className="flex-1 border-r border-black p-1 h-6"></div>
          <div className="w-1/4 p-1 h-6"></div>
        </div>
        <div className="flex h-20 text-center">
          <div className="flex-1 border-r border-black p-1">First Approval: Supplier (s) Qualified</div>
          <div className="flex-1 border-r border-black p-1">Second Approval: RFQ</div>
          <div className="flex-1 p-1">Third Approval: PO / WO</div>
        </div>
      </div>
    </>
  );

  const renderMAR = () => (
    <>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold font-serif text-black mb-1">Technic Construction Company Ltd.</h1>
        <div className="text-xs">
          H/O Address: House: 221, Road: 02, DOHS, Baridhara, Dhaka- 1206.<br />
          Ashulia Store Address: Ward: 03, Aukpara, Ashulia Road, Savara, Dhaka.<br />
          Sreemangal Store Address: Vagolpur, Kalampur, Sreemangal
        </div>
      </div>
      <h2 className="text-center font-bold text-xl underline mb-4 font-serif">
        Material Availability Report
      </h2>
      <table className="w-full border-collapse border border-black text-sm mb-2">
        <tbody>
          <tr>
            <td className="border border-black p-1 w-1/2">Report No.: {data.marNumber}</td>
            <td className="border border-black p-1 w-1/2">Report Date: {data.date}</td>
          </tr>
          <tr>
            <td className="border border-black p-1" colSpan={2}>Project Name: {data.projectName}</td>
          </tr>
          <tr>
            <td className="border border-black p-1" colSpan={2}>Project Location: {data.location}</td>
          </tr>
          <tr>
            <td className="border border-black p-1">Material Requisition No.: {data.mrNumber}</td>
            <td className="border border-black p-1">Material Requisition Date: {data.mrDate}</td>
          </tr>
          <tr>
            <td className="border border-black p-1" colSpan={2}>Materials Due Date: {data.dueDate}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-black text-xs mb-4">
        <thead>
          <tr>
            <th className="border border-black p-1 w-10 text-center font-bold" rowSpan={2}>SL#</th>
            <th className="border border-black p-1 text-center font-bold" rowSpan={2}>Item Name</th>
            <th className="border border-black p-1 text-center font-bold" rowSpan={2}>Specification</th>
            <th className="border border-black p-1 w-12 text-center font-bold" rowSpan={2}>Unit</th>
            <th className="border border-black p-1 w-16 text-center font-bold" rowSpan={2}>Required<br/>Qty</th>
            <th className="border border-black p-1 text-center font-bold" colSpan={3}>Availability in Store or Any Others</th>
            <th className="border border-black p-1 w-20 text-center font-bold" rowSpan={2}>Remark</th>
          </tr>
          <tr>
            <th className="border border-black p-1 w-16 text-center font-bold">Ashulia</th>
            <th className="border border-black p-1 w-16 text-center font-bold">Sreemangal</th>
            <th className="border border-black p-1 w-16 text-center font-bold">Other<br/>Place</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || []).map((it: any, idx: number) => (
            <tr key={idx} className="h-6">
              <td className="border border-black p-1 text-center">{idx + 1}</td>
              <td className="border border-black p-1">{it.itemName || it.itemDescription}</td>
              <td className="border border-black p-1">{it.specification || ''}</td>
              <td className="border border-black p-1 text-center">{it.unit}</td>
              <td className="border border-black p-1 text-center">{it.quantity}</td>
              <td className="border border-black p-1 text-center">{it.ashuliaStock || ''}</td>
              <td className="border border-black p-1 text-center">{it.sreemangalStock || ''}</td>
              <td className="border border-black p-1 text-center">{it.otherStock || ''}</td>
              <td className="border border-black p-1">{it.remarks || ''}</td>
            </tr>
          ))}
          {(!data.items || data.items.length === 0) && (
            <tr className="h-6"><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
          )}
        </tbody>
      </table>

      <div className="text-sm">
        <div className="underline mb-2">Any Comments:</div>
        <div className="underline mb-2">Report Prepared By:</div>
        <div className="mb-2">Name:</div>
        <div className="mb-2">Designation:</div>
        <div className="mb-2">Date:</div>
      </div>
    </>
  );

  const renderGatePass = () => (
    <>
      {renderCommonHeader()}
      <div className="text-center mb-4 relative">
        <div className="inline-block border border-black rounded-[20px] bg-gray-200 px-8 py-1 shadow-sm">
          <h2 className="text-xl font-bold uppercase tracking-wider font-serif">
            GATE PASS/CHALLAN
          </h2>
        </div>
        <div className="font-bold mt-1 text-sm text-center w-full block">Customer Copy</div>
      </div>
      <div className="flex justify-between text-sm mb-2 font-bold">
        <div>Memo No. {data.memoNo || data.gatePassNo}</div>
        <div>Date : {data.date}</div>
      </div>
      <div className="text-sm mb-2 border-b border-dotted border-black pb-1 w-full">To....................... {data.toParty}</div>
      <div className="text-sm mb-2 border-b border-dotted border-black pb-1 w-full">Project Name : ........ {data.projectName}</div>
      <div className="text-sm mb-4 border-b border-dotted border-black pb-1 w-full">From : .................. {data.fromParty}</div>

      <table className="w-full border-collapse border border-black text-sm mb-1">
        <thead>
          <tr>
            <th className="border border-black p-2 w-16 text-center font-bold">Sl. No.</th>
            <th className="border border-black p-2 text-center font-bold">Particulars</th>
            <th className="border border-black p-2 w-24 text-center font-bold">Unit</th>
            <th className="border border-black p-2 w-24 text-center font-bold">Quantity</th>
            <th className="border border-black p-2 w-32 text-center font-bold">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || []).map((it: any, idx: number) => (
            <tr key={idx} className="h-8">
              <td className="border border-black p-2 text-center border-b-0 border-t-0">{idx + 1}</td>
              <td className="border border-black p-2 border-b-0 border-t-0">{it.particulars || it.itemName || it.itemDescription}</td>
              <td className="border border-black p-2 text-center border-b-0 border-t-0">{it.unit}</td>
              <td className="border border-black p-2 text-center border-b-0 border-t-0">{it.quantity}</td>
              <td className="border border-black p-2 border-b-0 border-t-0">{it.remarks}</td>
            </tr>
          ))}
          {Array.from({ length: Math.max(0, 10 - (data.items?.length || 0)) }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="h-8">
              <td className="border border-black border-b-0 border-t-0"></td>
              <td className="border border-black border-b-0 border-t-0"></td>
              <td className="border border-black border-b-0 border-t-0"></td>
              <td className="border border-black border-b-0 border-t-0"></td>
              <td className="border border-black border-b-0 border-t-0"></td>
            </tr>
          ))}
          <tr className="h-0"><td className="border-t border-black"></td><td className="border-t border-black"></td><td className="border-t border-black"></td><td className="border-t border-black"></td><td className="border-t border-black"></td></tr>
        </tbody>
      </table>
      <div className="text-[11px] font-bold italic mb-16">
        N.B. It is only for carrying of materials. It does not mean the ownership.
      </div>
      <div className="flex justify-between text-sm mt-8 pt-4">
        <div className="border-t border-black px-4">Issued by</div>
        <div className="border-t border-black px-4">Authorised Signature</div>
        <div className="border-t border-black px-4">Receiver</div>
        <div className="border-t border-black px-4">Care Taker/Guard</div>
      </div>
    </>
  );

  const renderMIV = () => (
    <>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold font-serif text-black mb-1">Technic Construction Company Ltd.</h1>
        <div className="text-xs font-bold">
          HO: House# 221, Road # 02, DOHS Baridhara, Dhaka-1206<br />
          Central Store: Road# Aukpara, Village# Aukpara, Ward# 03, Ashulia.<br />
          Sreemangol Store: Bhagolpur, Moulvibazar
        </div>
      </div>
      
      <div className="text-center mb-4">
        <h2 className="inline-block text-lg font-bold underline underline-offset-4">
          {docType === 'MIV' ? 'Material Issue Voucher (MIV)' : 'Material Transfer Voucher (MTV)'}
        </h2>
      </div>

      <table className="w-full border-collapse border border-black text-sm font-bold mb-4">
        <tbody>
          <tr>
            <td className="border border-black p-1 w-1/2">{docType === 'MIV' ? 'MIV No.:' : 'MTV No.:'} {data.mivNo || data.mtvNo}</td>
            <td className="border border-black p-1 w-1/2">Date: {data.date || data.issueDate || data.transferDate}</td>
          </tr>
          <tr>
            <td className="border border-black p-1">MR No.: {data.mrNo || ''}</td>
            <td className="border border-black p-1">MAR No.: {data.marNo || ''}</td>
          </tr>
          <tr>
            <td className="border border-black p-1" colSpan={2}>Project Name: {data.projectName}</td>
          </tr>
          <tr>
            <td className="border border-black p-1">From: {data.storeName || data.fromStore}</td>
            <td className="border border-black p-1">To: {data.toProject || data.toStore || ''}</td>
          </tr>
          <tr>
            <td className="border border-black p-1" colSpan={2}>Receiver's Details (Name, Phone): {data.issuedTo || data.receivedBy || ''}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-black text-sm mb-4">
        <thead>
          <tr>
            <th className="border border-black p-1 w-10 text-center font-bold">SL#</th>
            <th className="border border-black p-1 text-center font-bold">Item Name</th>
            <th className="border border-black p-1 text-center font-bold">Specification</th>
            <th className="border border-black p-1 w-16 text-center font-bold">Unit</th>
            <th className="border border-black p-1 w-16 text-center font-bold">Qty</th>
            <th className="border border-black p-1 w-24 text-center font-bold">Remark</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || []).map((it: any, idx: number) => (
            <tr key={idx} className="h-6">
              <td className="border border-black p-1 text-center">{idx + 1}</td>
              <td className="border border-black p-1">{it.itemName || it.itemDescription}</td>
              <td className="border border-black p-1">{it.specification || ''}</td>
              <td className="border border-black p-1 text-center">{it.unit}</td>
              <td className="border border-black p-1 text-center">{it.quantity || it.issueQty || it.transferQty}</td>
              <td className="border border-black p-1">{it.remarks}</td>
            </tr>
          ))}
          {Array.from({ length: Math.max(0, 5 - (data.items?.length || 0)) }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="h-6"><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td></tr>
          ))}
        </tbody>
      </table>

      <div className="border border-black p-2 h-24 mb-16 text-sm font-bold flex flex-col">
        <div>Note/Comments: {data.remarks || data.comments}</div>
      </div>

      <div className="flex justify-between text-sm mt-8 pt-4">
        <div className="border-t border-black px-2">Preprad by</div>
        <div className="border-t border-black px-2">Checked by</div>
        <div className="border-t border-black px-2">Recommended by</div>
        <div className="border-t border-black px-2">Approved by</div>
        <div className="border-t border-black px-2">Received by</div>
      </div>
    </>
  );

  const renderPO = () => (
    <>
      <div className="border border-black flex justify-between items-center mb-4 text-xs font-bold">
        <div className="p-1 border-r border-black flex-[0.3]">
          <div>Doc. No.: PUR/3/2</div>
          <div className="border-t border-black mt-1 pt-1">Rev. No.: 00</div>
        </div>
        <div className="p-1 flex-[0.4] flex justify-center items-center gap-2">
          <Logo showTagline={false} />
          <h1 className="text-lg font-bold italic tracking-tight text-black" style={{ fontFamily: 'Times New Roman, serif' }}>
            Construction Company Ltd.
          </h1>
        </div>
        <div className="p-1 border-l border-black flex-[0.3]">
          <div>Status: Proposed</div>
          <div className="border-t border-black mt-1 pt-1">Issue Date: 01/01/2016</div>
        </div>
      </div>
      <h2 className="text-center font-bold text-lg underline uppercase mb-4 tracking-wide font-serif">
        PURCHASE ORDER / WORK ORDER / SERVICE ORDER
      </h2>
      <table className="w-full border-collapse border border-black text-sm font-bold mb-0 text-left align-top">
        <tbody>
          <tr>
            <td className="border border-black p-1 w-1/2 h-12 align-top">Vendor / Supplier / Service Provider:<br/><span className="font-normal">{data.vendorName}</span></td>
            <td className="border border-black p-1 w-1/2 h-12 align-top">Address:<br/><span className="font-normal">{data.vendorAddress || ''}</span></td>
          </tr>
          <tr>
            <td className="border border-black p-1 h-12 align-top">Contact Person & Mob.:<br/><span className="font-normal">{data.vendorContact || ''}</span></td>
            <td className="border border-black p-1 h-12 align-top">Quotation Reference:<br/><span className="font-normal">{data.quotationRef || ''}</span><br/>Date: <span className="font-normal">{data.quotationDate || ''}</span></td>
          </tr>
          <tr>
            <td className="border border-black p-1 h-12 align-top" colSpan={2}>Delivery Location:<br/><span className="font-normal">{data.deliveryLocation || ''}</span><br/>Alternative Contact Person: <span className="font-normal"></span></td>
          </tr>
        </tbody>
      </table>
      <table className="w-full border-collapse border border-black text-sm font-bold mb-4 border-t-0">
        <tbody>
          <tr>
            <td className="border border-black p-1 text-center w-1/4">PO/WO No.: <span className="font-normal">{data.poNumber}</span></td>
            <td className="border border-black p-1 text-center w-1/4">PO/WO Date: <span className="font-normal">{data.date}</span></td>
            <td className="border border-black p-1 text-center w-1/4">PR No.: <span className="font-normal">{data.prNumber || ''}</span></td>
            <td className="border border-black p-1 text-center w-1/4">MR No.: <span className="font-normal">{data.mrNumber || ''}</span></td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-black text-sm mb-4">
        <thead>
          <tr>
            <th className="border border-black p-1 w-10 text-center font-bold">Sl. #</th>
            <th className="border border-black p-1 text-center font-bold">Item Description</th>
            <th className="border border-black p-1 text-center font-bold">Specification</th>
            <th className="border border-black p-1 w-16 text-center font-bold">Unit</th>
            <th className="border border-black p-1 w-12 text-center font-bold">Qty.</th>
            <th className="border border-black p-1 w-20 text-center font-bold">Unit Rate</th>
            <th className="border border-black p-1 w-24 text-center font-bold">Amount (Tk)</th>
            <th className="border border-black p-1 w-20 text-center font-bold">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || []).map((it: any, idx: number) => (
            <tr key={idx} className="h-6">
              <td className="border border-black p-1 text-center">{idx + 1}</td>
              <td className="border border-black p-1">{it.itemName || it.itemDescription}</td>
              <td className="border border-black p-1">{it.specification || ''}</td>
              <td className="border border-black p-1 text-center">{it.unit}</td>
              <td className="border border-black p-1 text-center">{it.quantity}</td>
              <td className="border border-black p-1 text-right">{it.unitPrice}</td>
              <td className="border border-black p-1 text-right">{it.totalPrice}</td>
              <td className="border border-black p-1">{it.remarks}</td>
            </tr>
          ))}
          {Array.from({ length: Math.max(0, 3 - (data.items?.length || 0)) }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="h-6"><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td></tr>
          ))}
          <tr>
            <td className="border border-black p-1 font-bold text-center" colSpan={6}>Grand Total (BDT)</td>
            <td className="border border-black p-1 font-bold text-right">{data.grandTotal}</td>
            <td className="border border-black p-1"></td>
          </tr>
        </tbody>
      </table>

      <div className="text-sm font-bold mb-4">
        In Word (BDT): ..........................................................................................
      </div>

      <div className="border border-black font-bold text-sm mb-4">
        <div className="border-b border-black p-1 underline">TERMS & CONDITIONS</div>
        <div className="flex min-h-[120px]">
          <div className="flex-1 border-r border-black p-1 underline underline-offset-2">General:</div>
          <div className="flex-1 p-1 underline underline-offset-2">Financial:</div>
        </div>
      </div>

      <div className="flex border border-black font-bold text-sm h-24 items-end pb-1 px-2 text-left mb-2">
        <div className="flex-1 border-r border-black h-full pt-1">Prepared By:</div>
        <div className="flex-1 h-full pt-1 pl-2">Checked By:</div>
      </div>
      
      <div className="flex border border-black font-bold text-sm h-28 items-end pb-1 px-2 text-left">
        <div className="flex-1 border-r border-black h-full pt-1">AUTHORIZED SIGNATORY:</div>
        <div className="flex-1 text-xs h-full pt-1 pl-2">
          ACCEPTANCE OF VENDOR / SUPPLIER / SERVICE PROVIDER:<br/>
          (Please read the terms & condition carefully & sign in acceptance thereof.)
        </div>
      </div>
    </>
  );

  const renderFamsRegister = () => {
    const assets = Array.isArray(data) ? data : [];
    const totalCost = assets.reduce((s, a) => s + (a.purchaseCost || 0), 0);
    const totalNBV = assets.reduce((s, a) => s + (a.currentNetBookValue || 0), 0);
    return (
      <>
        {renderCommonHeader()}
        <div className="text-center my-4">
          <h2 className="inline-block text-xl font-bold tracking-wider uppercase px-6 py-1 border-2 border-black bg-gray-200">
            FIXED ASSET REGISTER REPORT
          </h2>
        </div>
        <div className="mb-4 flex justify-between text-sm">
          <div><strong>Date of Report:</strong> {new Date().toISOString().substring(0,10)}</div>
          <div><strong>Total Assets:</strong> {assets.length}</div>
        </div>
        <table className="w-full text-left text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2">Asset Code</th>
              <th className="border border-black p-2">Name & Make</th>
              <th className="border border-black p-2">Category</th>
              <th className="border border-black p-2">Location</th>
              <th className="border border-black p-2">Status</th>
              <th className="border border-black p-2 text-right">Purchase Cost</th>
              <th className="border border-black p-2 text-right">Net Book Value</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset: any) => (
              <tr key={asset.id}>
                <td className="border border-black p-2 font-mono">{asset.assetCode}</td>
                <td className="border border-black p-2">{asset.name}<br/><span className="text-[10px] text-gray-500">{asset.makeModel}</span></td>
                <td className="border border-black p-2">{asset.category}</td>
                <td className="border border-black p-2">{asset.currentLocation}</td>
                <td className="border border-black p-2">{asset.status}</td>
                <td className="border border-black p-2 text-right">{asset.purchaseCost?.toLocaleString()}</td>
                <td className="border border-black p-2 text-right font-bold">{asset.currentNetBookValue?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={5} className="border border-black p-2 text-right">GRAND TOTAL (BDT)</td>
              <td className="border border-black p-2 text-right">{totalCost.toLocaleString()}</td>
              <td className="border border-black p-2 text-right">{totalNBV.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <div className="mt-20 grid grid-cols-2 gap-32 text-center text-sm font-bold">
          <div className="border-t border-black pt-2">Prepared By (FAMS Admin)</div>
          <div className="border-t border-black pt-2">Approved By (Head of Finance)</div>
        </div>
      </>
    );
  };

  const renderFamsDepreciation = () => {
    const assets = Array.isArray(data) ? data : [];
    const DEP_RATE = 0.05;
    const totalCost = assets.reduce((s, a) => s + (a.purchaseCost || 0), 0);
    const totalDepreciation = assets.reduce((s, a) => s + ((a.purchaseCost || 0) * DEP_RATE), 0);
    const totalNBV = assets.reduce((s, a) => s + ((a.purchaseCost || 0) - ((a.purchaseCost || 0) * DEP_RATE)), 0);
    return (
      <>
        {renderCommonHeader()}
        <div className="text-center my-4">
          <h2 className="inline-block text-xl font-bold tracking-wider uppercase px-6 py-1 border-2 border-black bg-gray-200">
            FIXED ASSET DEPRECIATION REPORT (5% RATE)
          </h2>
        </div>
        <div className="mb-4 flex justify-between text-sm">
          <div><strong>Date of Report:</strong> {new Date().toISOString().substring(0,10)}</div>
          <div><strong>Depreciation Rate Applied:</strong> 5.00% (Straight Line)</div>
        </div>
        <table className="w-full text-left text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2">Asset Code</th>
              <th className="border border-black p-2">Name</th>
              <th className="border border-black p-2">Acquisition Date</th>
              <th className="border border-black p-2 text-right">Original Cost</th>
              <th className="border border-black p-2 text-right">Depreciation (5%)</th>
              <th className="border border-black p-2 text-right">Revised NBV</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset: any) => {
              const cost = asset.purchaseCost || 0;
              const dep = cost * DEP_RATE;
              const nbv = cost - dep;
              return (
                <tr key={asset.id}>
                  <td className="border border-black p-2 font-mono">{asset.assetCode}</td>
                  <td className="border border-black p-2">{asset.name}</td>
                  <td className="border border-black p-2">{asset.capitalizationDate}</td>
                  <td className="border border-black p-2 text-right">{cost.toLocaleString()}</td>
                  <td className="border border-black p-2 text-right text-red-700">({dep.toLocaleString()})</td>
                  <td className="border border-black p-2 text-right font-bold text-emerald-700">{nbv.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={3} className="border border-black p-2 text-right">TOTAL (BDT)</td>
              <td className="border border-black p-2 text-right">{totalCost.toLocaleString()}</td>
              <td className="border border-black p-2 text-right text-red-700">({totalDepreciation.toLocaleString()})</td>
              <td className="border border-black p-2 text-right text-emerald-700">{totalNBV.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <div className="mt-20 grid grid-cols-2 gap-32 text-center text-sm font-bold">
          <div className="border-t border-black pt-2">Prepared By (FAMS Admin)</div>
          <div className="border-t border-black pt-2">Approved By (Head of Finance)</div>
        </div>
      </>
    );
  };

  
  const renderGRN = () => {
    const grn = data;
    return (
      <>
        {renderCommonHeader()}
        <div className="border border-black flex justify-between items-center mb-4 text-xs">
          <div className="p-1 px-2 border-r border-black flex-[0.3]">
            <div className="font-bold">Document No.: TCCL/STR/GRN/01</div>
            <div className="border-t border-black mt-1 pt-1 font-bold">Revision No.: 01</div>
          </div>
          <div className="p-1 flex-[0.4] flex justify-center items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-black" style={{ fontFamily: 'Times New Roman, serif' }}>
              GOODS RECEIVED NOTE (GRN)
            </h1>
          </div>
          <div className="p-1 px-2 border-l border-black flex-[0.3] text-right">
            <div className="font-bold">GRN No.: {grn.grnNumber}</div>
            <div className="border-t border-black mt-1 pt-1">Date: {grn.date}</div>
          </div>
        </div>

        <table className="w-full text-xs border-collapse border border-black mb-4">
          <tbody>
            <tr>
              <td className="border border-black p-1.5 font-bold bg-gray-100 w-1/4">Project Name:</td>
              <td className="border border-black p-1.5 w-1/4">{grn.projectName}</td>
              <td className="border border-black p-1.5 font-bold bg-gray-100 w-1/4">PO Number:</td>
              <td className="border border-black p-1.5 w-1/4 font-mono font-bold">{grn.poNumber || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold bg-gray-100">Supplier / Vendor:</td>
              <td className="border border-black p-1.5 font-bold">{grn.vendorName || grn.supplierName || 'N/A'}</td>
              <td className="border border-black p-1.5 font-bold bg-gray-100">Supplier Challan No:</td>
              <td className="border border-black p-1.5 font-mono">{grn.supplierChallanNo || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold bg-gray-100">Receiving Store / Yard:</td>
              <td className="border border-black p-1.5">{grn.receivingStore || 'Site Store'}</td>
              <td className="border border-black p-1.5 font-bold bg-gray-100">Carrier / Vehicle No:</td>
              <td className="border border-black p-1.5 font-mono">{grn.vehicleNo} ({grn.driverName || 'Driver'})</td>
            </tr>
          </tbody>
        </table>

        <div className="text-xs font-bold mb-1">RECEIVED & INSPECTED ITEMS:</div>
        <table className="w-full text-xs border-collapse border border-black mb-6">
          <thead>
            <tr className="bg-gray-100 text-center font-bold">
              <th className="border border-black p-1.5 w-8">SL</th>
              <th className="border border-black p-1.5 text-left">Item Description & Technical Spec</th>
              <th className="border border-black p-1.5 w-14">Unit</th>
              <th className="border border-black p-1.5 w-16">Challan Qty</th>
              <th className="border border-black p-1.5 w-16">Received Qty</th>
              <th className="border border-black p-1.5 w-16">Accepted Qty</th>
              <th className="border border-black p-1.5 w-16">Rejected</th>
              <th className="border border-black p-1.5 w-20">QC Result</th>
            </tr>
          </thead>
          <tbody>
            {(grn.items || []).map((it: any, idx: number) => (
              <tr key={idx} className="text-center">
                <td className="border border-black p-1.5">{idx + 1}</td>
                <td className="border border-black p-1.5 text-left">
                  <div className="font-bold">{it.itemDescription || it.itemName}</div>
                  <div className="text-[10px] text-gray-700">{it.specification || it.remarks}</div>
                </td>
                <td className="border border-black p-1.5">{it.unit}</td>
                <td className="border border-black p-1.5">{it.orderedQty || it.quantity}</td>
                <td className="border border-black p-1.5 font-bold">{it.receivedQty || it.quantity}</td>
                <td className="border border-black p-1.5 font-bold text-emerald-700">{it.acceptedQty || it.quantity}</td>
                <td className="border border-black p-1.5 text-red-700">{it.rejectedQty || 0}</td>
                <td className="border border-black p-1.5 font-bold text-emerald-700">{it.inspectionResult || 'Passed'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border border-black p-2 text-xs mb-8">
          <span className="font-bold">Quality Inspection Remarks: </span>
          <span>Material physically inspected, dimensions and test certificates verified. Accepted for project inventory stock.</span>
        </div>

        <div className="grid grid-cols-3 gap-8 text-center text-xs font-bold pt-6">
          <div className="border-t border-black pt-1.5">
            <div>{grn.inspectedBy || 'Quality Control Engineer'}</div>
            <div className="text-[10px] text-gray-600 font-normal">QC Inspector</div>
          </div>
          <div className="border-t border-black pt-1.5">
            <div>{grn.storeOfficer || 'Site Store Officer'}</div>
            <div className="text-[10px] text-gray-600 font-normal">Store Keeper / Receiver</div>
          </div>
          <div className="border-t border-black pt-1.5">
            <div>Engr. Tanvir Ahmed</div>
            <div className="text-[10px] text-gray-600 font-normal">Project Manager / Authorizer</div>
          </div>
        </div>
      </>
    );
  };

  const renderAssetCard = () => {
    const asset = data;
    const buyingDate = asset.buyingDate || asset.capitalizationDate || 'N/A';
    const capDate = asset.capitalizationDate || asset.buyingDate || 'N/A';
    const cost = Number(asset.purchaseCost || 0);
    const nbv = Number(asset.currentNetBookValue ?? asset.purchaseCost ?? 0);
    const accumulatedDep = Math.max(0, cost - nbv);
    const transferHistory = Array.isArray(asset.transferHistory) ? asset.transferHistory : [];
    const maintenanceSchedule = Array.isArray(asset.maintenanceSchedule) ? asset.maintenanceSchedule : [];

    return (
      <>
        {renderCommonHeader()}
        <div className="border border-black flex justify-between items-center mb-4 text-xs">
          <div className="p-1 px-2 border-r border-black flex-[0.3]">
            <div className="font-bold">Document No.: TCCL/FAMS/FAR/02</div>
            <div className="border-t border-black mt-1 pt-1 font-bold">Revision No.: 01</div>
          </div>
          <div className="p-1 flex-[0.4] flex justify-center items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-black text-center" style={{ fontFamily: 'Times New Roman, serif' }}>
              FIXED ASSET REGISTRATION & VERIFICATION REPORT
            </h1>
          </div>
          <div className="p-1 px-2 border-l border-black flex-[0.3] text-right">
            <div className="font-bold font-mono text-sm">{asset.assetCode}</div>
            <div className="border-t border-black mt-1 pt-1 text-[11px]">Date: {new Date().toISOString().substring(0,10)}</div>
          </div>
        </div>

        <div className="border border-black p-3 mb-4 relative bg-gray-50/50">
          <div className="absolute top-3 right-3 border border-black p-2 w-24 h-24 flex flex-col items-center justify-center bg-white shadow-xs">
            <QrCode className="w-12 h-12 text-black mb-1" />
            <span className="text-[8px] font-mono text-center leading-tight">{asset.assetCode}</span>
          </div>

          <h3 className="font-bold text-xs uppercase tracking-wider text-black border-b border-black pb-1 mb-2 w-3/4">
            1. Asset Identification & Technical Profile
          </h3>
          <table className="w-3/4 text-xs mb-3">
            <tbody>
              <tr>
                <td className="w-1/3 py-1 font-bold text-gray-700">Asset Name:</td>
                <td className="font-bold text-black text-sm">{asset.name}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold text-gray-700">Category:</td>
                <td className="font-semibold">{asset.category}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold text-gray-700">Make / Model:</td>
                <td>{asset.makeModel || 'N/A'}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold text-gray-700">Serial / Chassis / Engine No:</td>
                <td className="font-mono font-bold text-[#174A7E]">{asset.serialChassisNo || 'N/A'}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold text-gray-700">Operational Engine Hours:</td>
                <td>{asset.operationalHours ? `${asset.operationalHours} Hours` : 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-bold text-xs uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
            2. Procurement & Financial Capitalization
          </h3>
          <table className="w-full text-xs border-collapse border border-black mb-3">
            <tbody>
              <tr className="bg-gray-100">
                <td className="border border-black p-1.5 font-bold w-1/4">Buying Date:</td>
                <td className="border border-black p-1.5 font-mono font-bold text-blue-900 w-1/4">{buyingDate}</td>
                <td className="border border-black p-1.5 font-bold w-1/4">Capitalization Date:</td>
                <td className="border border-black p-1.5 font-mono w-1/4">{capDate}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold">Purchase Cost (BDT):</td>
                <td className="border border-black p-1.5 font-mono font-bold">৳{cost.toLocaleString()}</td>
                <td className="border border-black p-1.5 font-bold">Useful Life:</td>
                <td className="border border-black p-1.5">{asset.usefulLifeYears || 5} Years</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold">Depreciation Method:</td>
                <td className="border border-black p-1.5">{asset.depreciationMethod || 'Straight Line Method (5% p.a.)'}</td>
                <td className="border border-black p-1.5 font-bold">Residual / Salvage Value:</td>
                <td className="border border-black p-1.5 font-mono">৳{(asset.residualValue || asset.salvageValue || cost * 0.1).toLocaleString()}</td>
              </tr>
              <tr className="bg-emerald-50">
                <td className="border border-black p-1.5 font-bold text-emerald-900">Accumulated Depreciation:</td>
                <td className="border border-black p-1.5 font-mono text-red-700">৳{accumulatedDep.toLocaleString()}</td>
                <td className="border border-black p-1.5 font-bold text-emerald-900">Current Net Book Value (NBV):</td>
                <td className="border border-black p-1.5 font-mono font-black text-emerald-800 text-sm">৳{nbv.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-bold text-xs uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
            3. Project Deployment & Custodian Assignment
          </h3>
          <table className="w-full text-xs border-collapse border border-black mb-3">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-100 w-1/4">Current Project:</td>
                <td className="border border-black p-1.5 font-bold w-1/4">{asset.projectName || 'Head Office Fleet Reserve'}</td>
                <td className="border border-black p-1.5 font-bold bg-gray-100 w-1/4">Current Yard / Site:</td>
                <td className="border border-black p-1.5 font-semibold w-1/4">{asset.currentLocation || 'Central Yard'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-100">Designated Custodian:</td>
                <td className="border border-black p-1.5 font-bold">{asset.custodianName || 'Md. Delwar Hossain'}</td>
                <td className="border border-black p-1.5 font-bold bg-gray-100">Custodian Contact:</td>
                <td className="border border-black p-1.5 font-mono">{asset.custodianPhone || '+880 1711-224466'}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-gray-100">Operational Status:</td>
                <td colSpan={3} className="border border-black p-1.5 font-bold text-emerald-700">{asset.status}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-bold text-xs uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
            4. Inter-Site & Inter-Office Movement History (Transfer Log)
          </h3>
          {transferHistory.length === 0 ? (
            <div className="text-[11px] text-gray-500 italic p-2 border border-gray-300 mb-3 bg-white">
              No inter-site or inter-office transfers recorded. Asset remains at initial capital mobilization location ({asset.currentLocation}).
            </div>
          ) : (
            <table className="w-full text-xs border-collapse border border-black mb-3">
              <thead>
                <tr className="bg-gray-100 text-center font-bold text-[11px]">
                  <th className="border border-black p-1.5">Date</th>
                  <th className="border border-black p-1.5">Transfer Type</th>
                  <th className="border border-black p-1.5 text-left">Origin (From)</th>
                  <th className="border border-black p-1.5 text-left">Destination (To)</th>
                  <th className="border border-black p-1.5">MTV Number</th>
                  <th className="border border-black p-1.5">Receiver Custodian</th>
                </tr>
              </thead>
              <tbody>
                {transferHistory.map((th: any, idx: number) => (
                  <tr key={idx} className="text-center text-[11px]">
                    <td className="border border-black p-1.5 font-mono">{th.transferDate}</td>
                    <td className="border border-black p-1.5 font-bold text-blue-900">{th.transferType}</td>
                    <td className="border border-black p-1.5 text-left">{th.fromLocation}</td>
                    <td className="border border-black p-1.5 text-left font-bold">{th.toLocation}</td>
                    <td className="border border-black p-1.5 font-mono text-blue-700">{th.mtvNumber || 'MTV-N/A'}</td>
                    <td className="border border-black p-1.5">{th.custodianName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 className="font-bold text-xs uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
            5. Maintenance, Servicing & Calibration Record
          </h3>
          {maintenanceSchedule.length === 0 ? (
            <div className="text-[11px] text-gray-500 italic p-2 border border-gray-300 mb-2 bg-white">
              No major maintenance scheduled or recorded for this period. Equipment certified in good operational condition.
            </div>
          ) : (
            <table className="w-full text-xs border-collapse border border-black mb-2">
              <thead>
                <tr className="bg-gray-100 text-center font-bold text-[11px]">
                  <th className="border border-black p-1.5 text-left">Maintenance / Service Scope</th>
                  <th className="border border-black p-1.5">Last Service</th>
                  <th className="border border-black p-1.5">Next Due</th>
                  <th className="border border-black p-1.5">Workshop / Vendor</th>
                  <th className="border border-black p-1.5 text-right">Cost (BDT)</th>
                  <th className="border border-black p-1.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceSchedule.map((ms: any, idx: number) => (
                  <tr key={idx} className="text-center text-[11px]">
                    <td className="border border-black p-1.5 text-left font-bold">{ms.serviceType}</td>
                    <td className="border border-black p-1.5 font-mono">{ms.lastServiceDate}</td>
                    <td className="border border-black p-1.5 font-mono text-amber-700">{ms.nextServiceDueDate}</td>
                    <td className="border border-black p-1.5">{ms.mechanicOrVendor}</td>
                    <td className="border border-black p-1.5 text-right font-mono">৳{(ms.cost || 0).toLocaleString()}</td>
                    <td className="border border-black p-1.5 font-bold text-emerald-700">{ms.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-8 text-center text-xs font-bold pt-4">
          <div className="border-t border-black pt-2">
            <div>{asset.custodianName || 'Asset Custodian'}</div>
            <div className="text-[10px] text-gray-600 font-normal">Site Plant In-Charge / Operator</div>
          </div>
          <div className="border-t border-black pt-2">
            <div>Md. Khorshed Alam</div>
            <div className="text-[10px] text-gray-600 font-normal">FAMS Registration Officer</div>
          </div>
          <div className="border-t border-black pt-2">
            <div>Engr. Tanvir Ahmed</div>
            <div className="text-[10px] text-gray-600 font-normal">Head of Plant, Machinery & Equipment</div>
          </div>
        </div>
      </>
    );
  };


  const renderGeneric = () => (
    <>
      {renderCommonHeader()}
      <div className="text-center my-4">
        <h2 className="inline-block text-xl font-bold tracking-wider uppercase px-6 py-1 border-2 border-black bg-gray-200">
          {docType === 'GRN' && 'GOODS RECEIVED NOTE (GRN)'}
          
        </h2>
      </div>
      <div className="mt-8 border border-black p-4 text-sm font-mono whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-200 w-full max-w-5xl h-[95vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="bg-slate-900 text-white p-3 flex justify-between items-center no-print">
          <div className="font-bold flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            Document Viewer
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#174A7E] hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-200 p-4 sm:p-8">
          <div id="printable-canvas" className="p-8 bg-white text-black printable-document font-sans selection:bg-slate-200 mx-auto shadow-xl w-full max-w-[210mm] min-h-[297mm]">
            {docType === 'MR' && renderMR()}
            {docType === 'PR' && renderPR()}
            {docType === 'MAR' && renderMAR()}
            {docType === 'GP' && renderGatePass()}
            {(docType === 'MIV' || docType === 'MTV') && renderMIV()}
            {docType === 'PO' && renderPO()}
            {docType === 'GRN' && renderGRN()}
            {docType === 'FAMS_REGISTER' && renderFamsRegister()}
            {docType === 'FAMS_DEPRECIATION' && renderFamsDepreciation()}
            {docType === 'ASSET' && renderAssetCard()}
            {docType !== 'MR' && docType !== 'PR' && docType !== 'MAR' && docType !== 'GP' && docType !== 'MIV' && docType !== 'MTV' && docType !== 'PO' && docType !== 'GRN' && docType !== 'FAMS_REGISTER' && docType !== 'FAMS_DEPRECIATION' && docType !== 'ASSET' && renderGeneric()}
          </div>
        </div>
      </div>
    </div>
  );
};
