import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyBlockProps {
  label: string;
  text: string;
}

export const CopyBlock: React.FC<CopyBlockProps> = ({ label, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
            copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {copied ? (
            <>
              <Check size={12} /> <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy size={12} /> <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <textarea
          readOnly
          value={text}
          className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300 resize-none"
        />
      </div>
    </div>
  );
};
