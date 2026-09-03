import React, { useState } from 'react';
import { QrCode, Barcode, ShieldCheck, Check, Printer, X, Copy } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  codeValue: string;
  meta: {
    label: string;
    value: string;
  }[];
  onVerifySecurity?: () => void;
  isVerified?: boolean;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  codeValue,
  meta,
  onVerifySecurity,
  isVerified = false
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'barcode'>('qr');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#174A7E] to-[#102A43] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <QrCode className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{title}</h3>
              <p className="text-xs text-sky-200">On-Site Digital Verification Tag</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'qr'
                ? 'bg-white text-[#174A7E] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" /> 2D QR Code
          </button>
          <button
            onClick={() => setActiveTab('barcode')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'barcode'
                ? 'bg-white text-[#174A7E] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Barcode className="w-4 h-4" /> Code 128 Barcode
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Visual QR / Barcode Card */}
          <div className="bg-white border-2 border-slate-300 p-4 rounded-xl shadow-inner mb-4 flex flex-col items-center">
            {activeTab === 'qr' ? (
              <div className="relative p-2 bg-white flex flex-col items-center justify-center">
                {/* SVG High-Res QR code visualization */}
                <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#102A43" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="#174A7E" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#102A43" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="#174A7E" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#102A43" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="#174A7E" />

                  {/* Data patterns */}
                  <rect x="36" y="8" width="6" height="6" fill="#174A7E" />
                  <rect x="46" y="8" width="12" height="6" fill="#102A43" />
                  <rect x="36" y="18" width="12" height="6" fill="#102A43" />
                  <rect x="52" y="18" width="8" height="6" fill="#174A7E" />

                  <rect x="8" y="36" width="6" height="12" fill="#102A43" />
                  <rect x="18" y="36" width="6" height="6" fill="#174A7E" />
                  <rect x="8" y="52" width="12" height="6" fill="#102A43" />
                  <rect x="24" y="46" width="6" height="12" fill="#174A7E" />

                  {/* Center pattern & TECHNIC watermark */}
                  <rect x="35" y="35" width="30" height="30" rx="4" fill="#174A7E" />
                  <text x="50" y="53" fill="white" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">TCCL</text>

                  {/* Lower & Right matrix bits */}
                  <rect x="70" y="36" width="12" height="6" fill="#102A43" />
                  <rect x="86" y="36" width="6" height="12" fill="#174A7E" />
                  <rect x="70" y="46" width="6" height="16" fill="#174A7E" />
                  <rect x="80" y="52" width="12" height="8" fill="#102A43" />

                  <rect x="36" y="70" width="10" height="6" fill="#102A43" />
                  <rect x="50" y="70" width="12" height="10" fill="#174A7E" />
                  <rect x="36" y="80" width="6" height="12" fill="#174A7E" />
                  <rect x="46" y="84" width="16" height="8" fill="#102A43" />
                  <rect x="70" y="70" width="8" height="8" fill="#174A7E" />
                  <rect x="82" y="70" width="10" height="6" fill="#102A43" />
                  <rect x="72" y="82" width="20" height="10" fill="#102A43" />
                </svg>
                <span className="text-[10px] font-mono text-slate-500 mt-2 font-bold tracking-wider">
                  ENCRYPTED SITE AUTH TOKEN
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-3">
                {/* SVG Barcode visualization */}
                <svg className="w-64 h-24" viewBox="0 0 200 60" fill="#102A43">
                  <rect x="10" y="5" width="3" height="40" />
                  <rect x="15" y="5" width="2" height="40" />
                  <rect x="20" y="5" width="4" height="40" />
                  <rect x="26" y="5" width="1" height="40" />
                  <rect x="30" y="5" width="5" height="40" />
                  <rect x="38" y="5" width="2" height="40" />
                  <rect x="43" y="5" width="3" height="40" />
                  <rect x="48" y="5" width="6" height="40" />
                  <rect x="57" y="5" width="2" height="40" />
                  <rect x="62" y="5" width="4" height="40" />
                  <rect x="69" y="5" width="2" height="40" />
                  <rect x="74" y="5" width="5" height="40" />
                  <rect x="82" y="5" width="3" height="40" />
                  <rect x="88" y="5" width="1" height="40" />
                  <rect x="92" y="5" width="4" height="40" />
                  <rect x="99" y="5" width="6" height="40" />
                  <rect x="108" y="5" width="2" height="40" />
                  <rect x="113" y="5" width="3" height="40" />
                  <rect x="119" y="5" width="5" height="40" />
                  <rect x="127" y="5" width="2" height="40" />
                  <rect x="132" y="5" width="4" height="40" />
                  <rect x="139" y="5" width="2" height="40" />
                  <rect x="144" y="5" width="6" height="40" />
                  <rect x="153" y="5" width="3" height="40" />
                  <rect x="159" y="5" width="2" height="40" />
                  <rect x="164" y="5" width="5" height="40" />
                  <rect x="172" y="5" width="2" height="40" />
                  <rect x="177" y="5" width="4" height="40" />
                  <rect x="184" y="5" width="2" height="40" />
                  <text x="100" y="54" fontSize="8" fontFamily="monospace" textAnchor="middle" fill="#475569">
                    {codeValue.split('|')[0] || codeValue}
                  </text>
                </svg>
              </div>
            )}
          </div>

          {/* Meta Details */}
          <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 text-left mb-4 space-y-1.5">
            {meta.map((m, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">{m.label}:</span>
                <span className="font-semibold text-slate-800 font-mono">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Status and Action Buttons */}
          <div className="w-full flex flex-col gap-2">
            {onVerifySecurity && (
              <button
                onClick={onVerifySecurity}
                disabled={isVerified}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isVerified
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {isVerified ? 'Gate Security Verified ✓' : 'Simulate Security Guard Scan & Clear'}
              </button>
            )}

            <div className="flex gap-2 w-full">
              <button
                onClick={handleCopy}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Raw Code'}
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Tag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
