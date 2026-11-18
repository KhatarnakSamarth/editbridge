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
      className={`win95-window flex flex-col overflow-hidden text-slate-100 ${className}`}
    >
      {/* Titlebar */}
      <div
        className={`win95-titlebar ${
          isActive ? '' : 'win95-titlebar-inactive'
        } ${headerClassName}`}
      >
        <div className="flex items-center gap-2 overflow-hidden truncate">
          {icon && <span className="flex-shrink-0 text-sm">{icon}</span>}
          <span className="truncate text-xs md:text-sm font-semibold tracking-wide">
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
            className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold flex items-center justify-center transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onMaximize?.();
            }}
            aria-label="Maximize"
            className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold flex items-center justify-center transition-colors"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onClose?.();
            }}
            aria-label="Close"
            className="w-5 h-5 rounded bg-slate-700 hover:bg-red-600 text-slate-200 text-[10px] font-bold flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Body content */}
      <div className={`p-4 md:p-5 bg-slate-900/90 text-slate-200 flex-1 overflow-auto ${bodyClassName}`}>
        {children}
      </div>

      {/* Optional window status bar */}
      {statusText && (
        <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <div className="win95-statusbar-cell w-full truncate">{statusText}</div>
        </div>
      )}
    </div>
  );
}
