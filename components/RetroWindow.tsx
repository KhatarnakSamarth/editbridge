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
      className={`glass-panel flex flex-col overflow-hidden text-[#FFF5F9] bg-[#170B29]/95 border border-[rgba(255,46,147,0.24)] rounded-2xl shadow-2xl shadow-black/60 transition-all ${className}`}
    >
      {/* Vice Sunset Window Titlebar */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b border-[rgba(255,46,147,0.2)] bg-[#211038]/85 backdrop-blur-md ${headerClassName}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden truncate">
          {/* Vice City Sunset Glow OS dots */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E93] inline-block shadow-sm shadow-[#FF2E93]/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF7B54] inline-block shadow-sm shadow-[#FF7B54]/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] inline-block shadow-sm shadow-[#FFD166]/60"></span>
          </div>

          {icon && <span className="flex-shrink-0 text-[#FF2E93]">{icon}</span>}
          <span className="truncate text-xs md:text-sm font-bold tracking-wide text-[#FFF5F9]">
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
            className="w-6 h-6 rounded-md bg-[#170B29] hover:bg-[#2D154B] text-[#C8A8C9] hover:text-white border border-[rgba(255,46,147,0.2)] text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onMaximize?.();
            }}
            aria-label="Maximize"
            className="w-6 h-6 rounded-md bg-[#170B29] hover:bg-[#2D154B] text-[#C8A8C9] hover:text-white border border-[rgba(255,46,147,0.2)] text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => {
              retroSound.playClick();
              onClose?.();
            }}
            aria-label="Close"
            className="w-6 h-6 rounded-md bg-[#170B29] hover:bg-[#FF2E93] hover:text-[#0D0618] text-[#C8A8C9] border border-[rgba(255,46,147,0.2)] text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer"
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
        <div className="px-4 py-2 border-t border-[rgba(255,46,147,0.18)] bg-[#0D0618]/70 text-[11px] font-mono text-[#C8A8C9] flex items-center justify-between">
          <span className="truncate">{statusText}</span>
          <span className="flex items-center gap-1.5 text-[10px] text-[#00F5A0] shrink-0 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse"></span>
            SYNCED
          </span>
        </div>
      )}
    </div>
  );
}
