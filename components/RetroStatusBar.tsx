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
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-9 bg-[#0D0618]/95 border-t border-[rgba(255,46,147,0.22)] shadow-xl backdrop-blur-md select-none font-mono text-[11px] text-[#C8A8C9] transition-colors">
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-2 overflow-x-hidden">
        {/* State 1: GUEST USER */}
        {!isAuthenticated ? (
          <>
            {/* Left: Network & Architecture Status */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-[#170B29] border border-[rgba(255,46,147,0.25)] rounded-lg px-2.5 py-1 flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse"></span>
                <span className="font-semibold text-[#FFF5F9] text-[10px] sm:text-xs tracking-tight">
                  Vice City Network
                </span>
                <span className="text-[10px] text-[#00F5A0] font-bold hidden sm:inline">
                  • Online
                </span>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-[#C8A8C9] text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF2E93]" />
                <span>30/70 Escrow Protocol Enforced</span>
              </div>
            </div>

            {/* Right: Guest session status with 1-click Sign In */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-[#FFD166]/15 border border-[#FFD166]/30 rounded-lg px-2 py-1 flex items-center gap-1.5 text-[#FFD166] text-[10px] font-semibold">
                <Lock className="w-3 h-3 text-[#FFD166]" />
                <span>Guest Preview</span>
              </div>

              <Link
                href="/signin"
                className="bg-gradient-to-r from-[#FF2E93] to-[#FF7B54] hover:opacity-90 text-[#FFF5F9] font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 transition-all shadow-xs"
              >
                <LogIn className="w-3 h-3" />
                <span className="hidden xs:inline">Sign In</span>
              </Link>

              <div className="bg-[#170B29] border border-[rgba(255,46,147,0.2)] rounded-lg px-2 py-1 font-mono font-medium text-[#C8A8C9] min-w-[70px] text-center text-[10px] sm:text-[11px] hidden sm:block">
                {timeStr || '12:00:00 PM'}
              </div>
            </div>
          </>
        ) : (
          /* State 2: AUTHENTICATED USER */
          <>
            {/* Left: Active project info */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-[#170B29] border border-[rgba(255,46,147,0.25)] rounded-lg px-2.5 py-1 flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#FF2E93] animate-ping"></span>
                <span className="text-[#8E6B93] font-sans font-medium text-[10px] uppercase hidden sm:inline">Active:</span>
                <span className="font-semibold text-[#FFF5F9] truncate max-w-[140px] sm:max-w-[260px] text-[10px] sm:text-xs">
                  {activeProject ? activeProject.title : 'No Project Active'}
                </span>
              </div>

              <div className="bg-[#170B29] border border-[rgba(255,46,147,0.25)] rounded-lg px-2 py-1 hidden md:flex items-center gap-1.5 shrink-0">
                <span className="text-[#8E6B93] font-sans font-medium text-[10px] uppercase">Status:</span>
                <span className="font-semibold text-[#FFD166] font-mono text-[10px]">{activeProject?.status || 'IDLE'}</span>
              </div>
            </div>

            {/* Right: Escrow Vault & Authenticated User Profile */}
            <div className="flex items-center gap-2 shrink-0">
              {activeProject && (
                <div className="bg-[#170B29] border border-[#00F5A0]/30 rounded-lg px-2 py-1 hidden sm:flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F5A0]" />
                  <span className="text-[#C8A8C9] font-sans font-medium text-[10px] uppercase hidden lg:inline">Escrow Vault:</span>
                  <span className="font-bold text-[#00F5A0] font-mono text-[10px] sm:text-xs">
                    ${activeProject.budget}.00
                  </span>
                </div>
              )}

              <div className="bg-[#170B29] border border-[rgba(255,46,147,0.25)] rounded-lg px-2 py-1 hidden xl:flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#FF2E93]" />
                <span className="text-[#FFF5F9] text-[10px] font-bold">AWS ap-south-1</span>
              </div>

              <div className="bg-[#170B29] border border-[rgba(255,46,147,0.25)] rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                <UserCheck className="w-3 h-3 text-[#FF7B54]" />
                <span className="text-[#FFF5F9] font-bold truncate max-w-[90px] hidden sm:inline text-[10px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[#FF2E93] font-bold text-[9px] uppercase">
                  ({activeRole})
                </span>
              </div>

              <div className="bg-[#170B29] border border-[rgba(255,46,147,0.25)] rounded-lg px-2 py-1 font-mono font-medium text-[#C8A8C9] min-w-[70px] text-center text-[10px] sm:text-[11px] hidden sm:block">
                {timeStr || '12:00:00 PM'}
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
