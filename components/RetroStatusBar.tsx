'use client';

import React, { useState, useEffect } from 'react';
import { useEditBridge } from '@/lib/store';
import { ShieldCheck, Wifi, UserCheck } from 'lucide-react';

export function RetroStatusBar() {
  const { activeProject, activeRole, currentUser } = useEditBridge();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 shadow-md backdrop-blur-md select-none font-mono text-[11px] text-slate-300">
      <div className="px-3 py-1.5 flex items-center justify-between gap-3 overflow-x-auto">
        {/* Left: Active project info */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="win95-statusbar-cell flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-400">ACTIVE:</span>
            <span className="font-semibold text-slate-100 truncate max-w-[200px] sm:max-w-[320px]">
              {activeProject ? activeProject.title : 'No Project Active'}
            </span>
          </div>

          <div className="win95-statusbar-cell hidden md:flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">STATUS:</span>
            <span className="font-semibold text-amber-400">{activeProject?.status || 'IDLE'}</span>
          </div>
        </div>

        {/* Center / Right: System stats & status */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="win95-statusbar-cell hidden lg:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">ESCROW PROTECTED:</span>
            <span className="font-bold text-emerald-300 font-mono">
              ${activeProject ? activeProject.budget : 0}.00 USD
            </span>
          </div>

          <div className="win95-statusbar-cell hidden sm:flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-300 font-medium">NETWORK READY</span>
          </div>

          <div className="win95-statusbar-cell flex items-center gap-1.5">
            <UserCheck className="w-3 h-3 text-indigo-400" />
            <span className="font-semibold text-white">{currentUser.name}</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700 text-slate-300">
              {activeRole}
            </span>
          </div>

          <div className="win95-statusbar-cell font-mono font-medium text-slate-300 min-w-[75px] text-center">
            {timeStr || '12:00:00 PM'}
          </div>
        </div>
      </div>
    </footer>
  );
}
