'use client';

import React, { useState, useEffect } from 'react';
import { useEditBridge } from '@/lib/store';
import { ShieldCheck, HardDrive, Cpu, Wifi } from 'lucide-react';

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
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#c0c0c0] border-t-2 border-[#ffffff] shadow-inner select-none font-mono text-[11px] text-neutral-800">
      <div className="px-2 py-1 flex items-center justify-between gap-2 overflow-x-auto">
        {/* Left: Active project info */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="win95-statusbar-cell flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-[#000080]">PROJECT:</span>
            <span className="truncate max-w-[200px] sm:max-w-[320px]">
              {activeProject ? activeProject.title : 'No Project Active'}
            </span>
          </div>

          <div className="win95-statusbar-cell hidden md:flex items-center gap-1 text-neutral-700">
            <span>STATUS:</span>
            <span className="font-bold text-[#b87000]">{activeProject?.status || 'IDLE'}</span>
          </div>
        </div>

        {/* Center / Right: System stats & status */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="win95-statusbar-cell hidden lg:flex items-center gap-1 text-neutral-700">
            <ShieldCheck className="w-3 h-3 text-green-700" />
            <span>ESCROW SECURE:</span>
            <span className="font-bold text-green-800 font-mono">
              ${activeProject ? activeProject.budget : 0} USD
            </span>
          </div>

          <div className="win95-statusbar-cell hidden sm:flex items-center gap-1">
            <Wifi className="w-3 h-3 text-teal-700" />
            <span className="text-teal-800 font-bold">V.90 56K DIALUP</span>
          </div>

          <div className="win95-statusbar-cell flex items-center gap-1.5">
            <span className="font-bold text-[#000080]">{currentUser.name}</span>
            <span className="text-[9px] bg-neutral-300 px-1 border border-neutral-400">
              {activeRole}
            </span>
          </div>

          <div className="win95-statusbar-cell font-bold text-neutral-900 min-w-[70px] text-center">
            {timeStr || '12:00:00 PM'}
          </div>
        </div>
      </div>
    </footer>
  );
}
