import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CommandTileProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
}

export function CommandTile({ className, children, title, icon, ...props }: CommandTileProps) {
  return (
    <div
      className={twMerge(
        'relative flex flex-col h-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-500/20 group overflow-hidden',
        className
      )}
      {...props}
    >
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Subtle Top Shine */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {(title || icon) && (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800 relative z-10 shrink-0">
          {icon && (
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors shadow-sm shadow-blue-500/10">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-xs font-black italic tracking-widest uppercase text-slate-400 group-hover:text-slate-100 transition-colors">
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="relative z-10 flex-grow text-slate-300">
        {children}
      </div>
    </div>
  );
}
