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
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-9 bg-vice-bg/95 border-t border-vice-border shadow-xs backdrop-blur-md select-none font-mono text-[11px] text-vice-muted transition-colors">
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-2 overflow-x-hidden">
        {/* State 1: GUEST USER */}
        {!isAuthenticated ? (
          <>
            {/* Left: Network & Architecture Status */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-vice-surface border border-vice-border rounded-lg px-2.5 py-1 flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-vice-mint animate-pulse"></span>
                <span className="font-semibold text-vice-text text-[10px] sm:text-xs tracking-tight">
                  EditBridge Network
                </span>
                <span className="text-[10px] text-vice-mint font-bold hidden sm:inline">
                  • Online
                </span>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-vice-muted text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-vice-pink" />
                <span>30/70 Escrow Protocol Enforced</span>
              </div>
            </div>

            {/* Right: Guest session status with 1-click Sign In */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1 flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
                <Lock className="w-3 h-3" />
                <span>Guest Preview</span>
              </div>

              <Link
                href="/signin"
                className="bg-vice-gradient hover:opacity-90 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 transition-all shadow-xs"
              >
                <LogIn className="w-3 h-3" />
                <span className="hidden xs:inline">Sign In</span>
              </Link>

              <div className="bg-vice-surface border border-vice-border rounded-lg px-2 py-1 font-mono font-medium text-vice-muted min-w-[70px] text-center text-[10px] sm:text-[11px] hidden sm:block">
                {timeStr || '12:00:00 PM'}
              </div>
            </div>
          </>
        ) : (
          /* State 2: AUTHENTICATED USER */
          <>
            {/* Left: Active project info */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-vice-surface border border-vice-border rounded-lg px-2.5 py-1 flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-vice-pink animate-ping"></span>
                <span className="text-vice-dim font-sans font-medium text-[10px] uppercase hidden sm:inline">Active:</span>
                <span className="font-semibold text-vice-text truncate max-w-[140px] sm:max-w-[260px] text-[10px] sm:text-xs">
                  {activeProject ? activeProject.title : 'No Project Active'}
                </span>
              </div>

              <div className="bg-vice-surface border border-vice-border rounded-lg px-2 py-1 hidden md:flex items-center gap-1.5 shrink-0">
                <span className="text-vice-dim font-sans font-medium text-[10px] uppercase">Status:</span>
                <span className="font-semibold text-vice-gold font-mono text-[10px]">{activeProject?.status || 'IDLE'}</span>
              </div>
            </div>

            {/* Right: Escrow Vault & Authenticated User Profile */}
            <div className="flex items-center gap-2 shrink-0">
              {activeProject && (
                <div className="bg-vice-surface border border-emerald-500/20 rounded-lg px-2 py-1 hidden sm:flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-vice-mint" />
                  <span className="text-vice-muted font-sans font-medium text-[10px] uppercase hidden lg:inline">Escrow Vault:</span>
                  <span className="font-bold text-vice-mint font-mono text-[10px] sm:text-xs">
                    ${activeProject.budget}.00
                  </span>
                </div>
              )}

              <div className="bg-vice-surface border border-vice-border rounded-lg px-2 py-1 hidden xl:flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-vice-pink" />
                <span className="text-vice-text text-[10px] font-bold">AWS ap-south-1</span>
              </div>

              <div className="bg-vice-surface border border-vice-border rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                <UserCheck className="w-3 h-3 text-vice-coral" />
                <span className="text-vice-text font-bold truncate max-w-[90px] hidden sm:inline text-[10px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-vice-pink font-bold text-[9px] uppercase">
                  ({activeRole})
                </span>
              </div>

              <div className="bg-vice-surface border border-vice-border rounded-lg px-2 py-1 font-mono font-medium text-vice-muted min-w-[70px] text-center text-[10px] sm:text-[11px] hidden sm:block">
                {timeStr || '12:00:00 PM'}
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
