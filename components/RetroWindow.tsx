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
      className={`win95-window flex flex-col overflow-hidden text-neutral-900 ${className}`}
    >
      {/* Titlebar */}
      <div
        className={`win95-titlebar ${
          isActive ? '' : 'win95-titlebar-inactive'
        } ${headerClassName}`}
      >
        <div className="flex items-center gap-2 overflow-hidden truncate">
          {icon && <span className="flex-shrink-0 text-sm">{icon}</span>}
          <span className="truncate text-xs md:text-sm font-bold tracking-wider font-mono">
            {title}
          </span>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => {
              retroSound.playClick();
              onMinimize?.();
            }}
            aria-label="Minimize"
            className="w-5 h-5 bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black border text-[10px] font-bold flex items-center justify-center hover:bg-[#d0d0d0] active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onMaximize?.();
            }}
            aria-label="Maximize"
            className="w-5 h-5 bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black border text-[10px] font-bold flex items-center justify-center hover:bg-[#d0d0d0] active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onClose?.();
            }}
            aria-label="Close"
            className="w-5 h-5 bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black border text-[10px] font-bold flex items-center justify-center hover:bg-[#e04040] hover:text-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Body content */}
      <div className={`p-3 md:p-4 bg-[#c0c0c0] flex-1 overflow-auto ${bodyClassName}`}>
        {children}
      </div>

      {/* Optional window status bar */}
      {statusText && (
        <div className="px-2 py-1 bg-[#c0c0c0] border-t border-[#808080] text-[11px] font-mono text-neutral-700 flex items-center justify-between">
          <div className="win95-statusbar-cell w-full truncate">{statusText}</div>
        </div>
      )}
    </div>
  );
}
