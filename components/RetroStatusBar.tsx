'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEditBridge } from '@/lib/store';
import { ShieldCheck, Wifi, UserCheck, Lock, LogIn } from 'lucide-react';

export function RetroStatusBar() {
  const { activeProject, activeRole, currentUser, isAuthenticated } = useEditBridge();
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
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-9 bg-white/95 dark:bg-[#070b14]/95 border-t border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md select-none font-mono text-[11px] text-slate-600 dark:text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-2 overflow-x-hidden">
        {/* State 1: GUEST USER (Strict Privacy - Zero Confidential Leakage) */}
        {!isAuthenticated ? (
          <>
            {/* Left: Network & Architecture Status */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1 flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[10px] sm:text-xs tracking-tight">
                  EditBridge Cloud
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
                  • Online
                </span>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span>30/70 Escrow Protocol Enforced</span>
              </div>
            </div>

            {/* Right: Guest session status with 1-click Sign In */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg px-2 py-1 flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">
                <Lock className="w-3 h-3 text-amber-500" />
                <span>Guest Preview</span>
              </div>

              <Link
                href="/signin"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 transition-all shadow-xs"
              >
                <LogIn className="w-3 h-3" />
                <span className="hidden xs:inline">Sign In</span>
              </Link>

              <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1 font-mono font-medium text-slate-600 dark:text-slate-300 min-w-[70px] text-center text-[10px] sm:text-[11px] hidden sm:block">
                {timeStr || '12:00:00 PM'}
              </div>
            </div>
          </>
        ) : (
          /* State 2: AUTHENTICATED USER (Scoped Project & Escrow Ledger) */
          <>
            {/* Left: Active project info */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1 flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-slate-400 dark:text-slate-500 font-sans font-medium text-[10px] uppercase hidden sm:inline">Active:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[140px] sm:max-w-[260px] text-[10px] sm:text-xs">
                  {activeProject ? activeProject.title : 'No Project Active'}
                </span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1 hidden md:flex items-center gap-1.5 shrink-0">
                <span className="text-slate-400 dark:text-slate-500 font-sans font-medium text-[10px] uppercase">Status:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono text-[10px]">{activeProject?.status || 'IDLE'}</span>
              </div>
            </div>

            {/* Right: Escrow Vault & Authenticated User Profile */}
            <div className="flex items-center gap-2 shrink-0">
              {activeProject && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-lg px-2 py-1 hidden sm:flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-sans font-medium text-[10px] uppercase hidden lg:inline">Escrow Vault:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-300 font-mono text-[10px] sm:text-xs">
                    ${activeProject.budget}.00
                  </span>
                </div>
              )}

              <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1 hidden xl:flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-cyan-700 dark:text-cyan-300 font-medium font-sans text-[10px] uppercase">Sync &lt;45ms</span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1 flex items-center gap-1.5">
                <UserCheck className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] sm:max-w-[130px] truncate text-[10px] sm:text-xs">
                  {currentUser.name}
                </span>
                <span className="text-[9px] bg-slate-200 dark:bg-slate-700/80 px-1 py-0.2 rounded font-sans font-bold text-slate-700 dark:text-slate-300 uppercase">
                  {activeRole}
                </span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1 font-mono font-medium text-slate-600 dark:text-slate-300 min-w-[70px] text-center text-[10px] sm:text-[11px] hidden sm:block">
                {timeStr || '12:00:00 PM'}
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
