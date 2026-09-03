import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'compact' | 'white';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  className = '',
  showTagline = false
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src="/assets/technic.png"
        alt="TECHNIC Construction"
        className={`h-9 w-auto object-contain transition-transform ${variant === 'white' ? 'brightness-0 invert' : ''}`}
      />

      {showTagline && (
        <div className="hidden sm:flex flex-col border-l border-slate-300 dark:border-slate-700 pl-3">
          <span className={`text-xs font-bold uppercase tracking-wider ${variant === 'white' ? 'text-slate-600' : 'text-slate-800'}`}>
            TECHNIC Construction Company Ltd.
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Integrated Inventory, Procurement & FAMS
          </span>
        </div>
      )}
    </div>
  );
};
