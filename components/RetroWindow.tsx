'use client';

import React, { ReactNode } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { retroSound } from '@/lib/soundEffects';

interface RetroWindowProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  onClose?: () => void;
  onMaximize?: () => void;
  onMinimize?: () => void;
  statusText?: string;
  isActive?: boolean;
}

export function RetroWindow({
  title,
  icon,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  onClose,
  onMaximize,
  onMinimize,
  statusText,
  isActive = true,
}: RetroWindowProps) {
  return (
    <div
      className={`glass-panel flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 bg-white/90 dark:bg-[#0e1526]/90 border border-slate-200 dark:border-slate-800/90 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-cyan-950/20 transition-all ${className}`}
    >
      {/* Titlebar */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#090e1a]/80 backdrop-blur-md ${headerClassName}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden truncate">
          {/* Subtle OS-style dots */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          {icon && <span className="flex-shrink-0 text-cyan-600 dark:text-cyan-400">{icon}</span>}
          <span className="truncate text-xs md:text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">
            {title}
          </span>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => {
              retroSound.playClick();
              onMinimize?.();
            }}
            aria-label="Minimize"
            className="w-6 h-6 rounded-md bg-slate-200/70 dark:bg-slate-800/70 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onMaximize?.();
            }}
            aria-label="Maximize"
            className="w-6 h-6 rounded-md bg-slate-200/70 dark:bg-slate-800/70 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center transition-colors"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onClose?.();
            }}
            aria-label="Close"
            className="w-6 h-6 rounded-md bg-slate-200/70 dark:bg-slate-800/70 hover:bg-rose-600 hover:text-white text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Body content */}
      <div
        className={`p-4 md:p-5 flex-1 bg-transparent ${
          bodyClassName.includes('overflow-') ? '' : 'overflow-auto'
        } ${bodyClassName}`}
      >
        {children}
      </div>

      {/* Optional window status bar */}
      {statusText && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#070b14]/60 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="truncate flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>{statusText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
