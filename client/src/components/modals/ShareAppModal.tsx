import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Copy, Check, Download, ExternalLink, BookOpen, Smartphone } from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'info'>('qr');

  if (!isOpen) return null;

  // Use live origin or default deployment URL
  const appUrl = window.location.origin.includes('localhost')
    ? 'https://ethics-library.onrender.com'
    : window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById('ethics-app-qr-code');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 400, 400);
        ctx.drawImage(img, 20, 20, 360, 360);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'Ethics_Library_App_QR.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl border border-amber-500/30 bg-card p-6 shadow-2xl space-y-5 overflow-hidden text-center">
        {/* Top Glow Accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-36 w-36 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-xs">
              <BookOpen className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-black tracking-tight text-foreground leading-none">ETHICS LIBRARY</h3>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">Scan & Launch Portal</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-xs"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-accent/40 p-1 border border-border">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-amber-500 text-slate-950 shadow-2xs font-extrabold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>App QR Code</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'info'
                ? 'bg-amber-500 text-slate-950 shadow-2xs font-extrabold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>How to Scan</span>
          </button>
        </div>

        {activeTab === 'qr' ? (
          <div className="space-y-4">
            {/* Scannable QR Code Card */}
            <div className="p-4 rounded-xl bg-white border-2 border-amber-500/40 shadow-inner flex flex-col items-center justify-center gap-2 relative">
              <div className="relative p-2 bg-white rounded-lg">
                <QRCodeSVG
                  id="ethics-app-qr-code"
                  value={appUrl}
                  size={190}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mt-1">
                <Smartphone className="h-3 w-3 text-amber-500" />
                <span>Scan with any Camera / Google Lens</span>
              </div>
            </div>

            {/* App URL Link Box */}
            <div className="p-2.5 rounded-xl bg-accent/20 border border-border flex items-center justify-between gap-2">
              <div className="overflow-hidden text-left">
                <span className="text-[9px] font-extrabold uppercase text-muted-foreground block">App Link URL</span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 truncate block">{appUrl}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1.5 rounded-lg bg-card border border-border hover:bg-accent text-xs font-bold text-foreground transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                title="Copy App URL"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDownloadQr}
                className="flex-1 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-amber-500" />
                <span>Download QR</span>
              </button>
              <button
                onClick={() => window.open(appUrl, '_blank')}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open Link</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-left py-1">
            <div className="p-3 rounded-xl bg-accent/20 border border-border space-y-1.5 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">1</span>
                <span>Camera / Scanner Open Karein</span>
              </div>
              <p className="text-[11px] text-muted-foreground pl-6">
                Apne mobile camera, Google Lens ya Paytm scanner kholiye.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-accent/20 border border-border space-y-1.5 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">2</span>
                <span>QR Code ko Scan Karein</span>
              </div>
              <p className="text-[11px] text-muted-foreground pl-6">
                Camera ko QR code ke samne rakhein.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-accent/20 border border-border space-y-1.5 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">3</span>
                <span>Ethics Portal Open Karein</span>
              </div>
              <p className="text-[11px] text-muted-foreground pl-6">
                Aane wale link par tap karke Ethics Library Member App kholiye.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
