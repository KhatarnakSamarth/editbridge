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
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#070b14]/90 border-t border-slate-200 dark:border-slate-800/80 shadow-lg backdrop-blur-md select-none font-mono text-[11px] text-slate-600 dark:text-slate-300 transition-colors">
      <div className="px-4 py-1.5 flex items-center justify-between gap-3 overflow-x-auto">
        {/* Left: Active project info */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-slate-400 dark:text-slate-500 font-sans font-medium text-[10px] uppercase">Active:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-[320px]">
              {activeProject ? activeProject.title : 'No Project Active'}
            </span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1 hidden md:flex items-center gap-1.5">
            <span className="text-slate-400 dark:text-slate-500 font-sans font-medium text-[10px] uppercase">Status:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">{activeProject?.status || 'IDLE'}</span>
          </div>
        </div>

        {/* Center / Right: System stats & status */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-lg px-2.5 py-1 hidden lg:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-400 font-sans font-medium text-[10px] uppercase">Escrow Vault:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-300 font-mono">
              ${activeProject ? activeProject.budget : 0}.00 USD
            </span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1 hidden sm:flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-cyan-700 dark:text-cyan-300 font-medium font-sans text-[10px] uppercase">Live Sync &lt;45ms</span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
            <UserCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.name}</span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-700/80 px-1.5 py-0.2 rounded font-sans font-bold text-slate-700 dark:text-slate-300">
              {activeRole}
            </span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1 font-mono font-medium text-slate-600 dark:text-slate-300 min-w-[75px] text-center">
            {timeStr || '12:00:00 PM'}
          </div>
        </div>
      </div>
    </footer>
  );
}
