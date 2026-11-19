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
      className={`glass-panel flex flex-col overflow-hidden text-vice-text bg-vice-surface border border-vice-border rounded-2xl shadow-xl transition-all ${className}`}
    >
      {/* Vice Sunset Window Titlebar */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b border-vice-border bg-vice-cardElevated/80 backdrop-blur-md ${headerClassName}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden truncate">
          {/* Vice City Sunset dots */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-vice-pink inline-block shadow-xs"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-vice-coral inline-block shadow-xs"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-vice-gold inline-block shadow-xs"></span>
          </div>

          {icon && <span className="flex-shrink-0 text-vice-pink">{icon}</span>}
          <span className="truncate text-xs md:text-sm font-bold tracking-wide text-vice-text">
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
            className="w-6 h-6 rounded-md bg-vice-surface hover:bg-vice-hover text-vice-muted hover:text-vice-text border border-vice-border text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onMaximize?.();
            }}
            aria-label="Maximize"
            className="w-6 h-6 rounded-md bg-vice-surface hover:bg-vice-hover text-vice-muted hover:text-vice-text border border-vice-border text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onClose?.();
            }}
            aria-label="Close"
            className="w-6 h-6 rounded-md bg-vice-surface hover:bg-vice-pink hover:text-white text-vice-muted border border-vice-border text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer"
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
        <div className="px-4 py-2 border-t border-vice-border bg-vice-cardElevated/60 text-[11px] font-mono text-vice-muted flex items-center justify-between">
          <span className="truncate">{statusText}</span>
          <span className="flex items-center gap-1.5 text-[10px] text-vice-mint shrink-0 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-vice-mint animate-pulse"></span>
            SYNCED
          </span>
        </div>
      )}
    </div>
  );
}
