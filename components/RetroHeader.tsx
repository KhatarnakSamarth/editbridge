'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Film,
  FolderKanban,
  Users,
  ShieldAlert,
  Menu,
  X,
  CheckCircle2,
  PlusCircle,
  FileCheck2,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export function RetroHeader() {
  const pathname = usePathname();
  const {
    activeRole,
    switchRole,
    currentUser,
    isAuthenticated,
    logout,
    soundEnabled,
    toggleSound,
    themeMode,
    toggleThemeMode,
    resetDemoData,
  } = useEditBridge();

  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Navigation Links tailored by Role
  const navLinks = React.useMemo(() => {
    if (activeRole === 'CREATOR') {
      return [
        { href: '/', label: 'Overview', icon: Film },
        { href: '/workspace', label: 'Creator Studio', icon: Sparkles, highlight: true },
        { href: '/projects', label: 'My Projects', icon: FolderKanban },
        { href: '/editors', label: 'Find Editors', icon: Users },
        { href: '/projects/new', label: '+ Post Brief', icon: PlusCircle },
      ];
    }
    if (activeRole === 'EDITOR') {
      return [
        { href: '/', label: 'Overview', icon: Film },
        { href: '/workspace', label: 'Editor Studio', icon: Sparkles, highlight: true },
        { href: '/projects', label: 'Assigned Jobs', icon: FolderKanban },
        { href: '/workspace?tab=files', label: 'Vault & Delivery', icon: FileCheck2 },
      ];
    }
    // ADMIN role
    return [
      { href: '/', label: 'Overview', icon: Film },
      { href: '/workspace', label: 'Workspace Inspector', icon: Sparkles, highlight: true },
      { href: '/projects', label: 'All Projects', icon: FolderKanban },
      { href: '/editors', label: 'Vetting Queue', icon: Users },
      { href: '/admin', label: 'Admin Ops & Arbiter', icon: ShieldAlert },
    ];
  }, [activeRole]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#080d19]/90 border-b border-slate-200 dark:border-slate-800/90 backdrop-blur-xl shadow-xs dark:shadow-md select-none transition-colors">
      {/* Top neon utility strip */}
      <div className="bg-slate-100/80 dark:bg-[#060a14]/90 text-slate-600 dark:text-slate-400 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
          <span className="font-semibold tracking-wide text-slate-800 dark:text-slate-200 text-[11px] uppercase">
            EditBridge Network
          </span>
          <span className="hidden sm:inline text-slate-400 dark:text-slate-500 text-[11px]">
            • Role: <span className="font-bold text-slate-700 dark:text-slate-300">{activeRole}</span> ({currentUser.name})
          </span>
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              retroSound.playDing();
              setShowDemoGuide(true);
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3 py-0.5 rounded-full text-[11px] font-bold transition-all shadow-sm hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-slate-950" />
            <span>Hackathon Demo Guide</span>
          </button>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono hidden md:inline flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            SQLite dev.db Online
          </span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={() => retroSound.playClick()}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-cyan-500/35 transition-all">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white bg-clip-text">
                  Edit<span className="text-cyan-600 dark:text-cyan-400">Bridge</span>
                </span>
                <span className="bg-cyan-500/10 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold border border-cyan-500/20">
                  {activeRole}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5 font-medium">
                Streamlined Video Hub
              </p>
            </div>
          </Link>
        </div>

        {/* Middle: Desktop Nav tabs (Dynamic by Role) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => retroSound.playClick()}
                className={`px-3 py-1.5 text-xs rounded-xl flex items-center gap-1.5 font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 shadow-xs dark:shadow-[0_0_12px_rgba(0,245,255,0.15)] font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Persona Switcher & Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Role switch segmented buttons */}
          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-0.5 flex items-center gap-0.5 text-xs shadow-xs">
            <button
              onClick={() => switchRole('CREATOR')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                activeRole === 'CREATOR'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
              title="Marcus Sterling (Creator)"
            >
              👤 Creator
            </button>
            <button
              onClick={() => switchRole('EDITOR')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                activeRole === 'EDITOR'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
              title="Alex Rivera (Editor)"
            >
              🎬 Editor
            </button>
            <button
              onClick={() => switchRole('ADMIN')}
              className={`px-2 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                activeRole === 'ADMIN'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
              title="Elena Drake (Admin Ops)"
            >
              🛡️ Admin
            </button>
          </div>

          {/* User Sign In / Credentials Shortcut */}
          <Link
            href="/signin"
            onClick={() => retroSound.playClick()}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors shadow-xs"
            title="View Judge Test Credentials or Switch Account"
          >
            <LogIn className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-[11px]">Sign In</span>
          </Link>

          {/* Theme & Audio Controls */}
          <div className="flex items-center gap-1">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleThemeMode}
              title={`Switch Theme: currently ${themeMode === 'DARK' ? 'Dark Mode' : 'Light Mode'}`}
              aria-label="Toggle Light and Dark Mode"
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 h-8 px-2 rounded-xl flex items-center gap-1 text-xs transition-colors shadow-xs cursor-pointer"
            >
              {themeMode === 'DARK' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xl:inline font-semibold text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden xl:inline font-semibold text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              title={soundEnabled ? 'Audio: ON' : 'Audio: OFF'}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-colors shadow-xs cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={resetDemoData}
              title="Reset Demo Data to initial state"
              className="bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 hover:border-rose-400 text-slate-500 hover:text-rose-600 w-8 h-8 rounded-xl hidden sm:flex items-center justify-center text-xs transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 lg:hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-3 bg-white dark:bg-[#0d1424] border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  retroSound.playClick();
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2.5 font-medium ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Signed in: {currentUser.name} ({activeRole})</span>
            <Link
              href="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg text-xs font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* Hackathon Demo Guide Modal */}
      {showDemoGuide && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#070b14] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
                <Sparkles className="w-4 h-4 text-amber-500" />
                HACKATHON DEMO WALKTHROUGH — SECTION 19 SCENARIO
              </span>
              <button
                onClick={() => {
                  retroSound.playClick();
                  setShowDemoGuide(false);
                }}
                className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-sm space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200 rounded-xl text-xs leading-relaxed">
                💡 <strong className="text-cyan-950 dark:text-white">Judges Pitch Tip:</strong> &ldquo;EditBridge connects Creators and Editors through milestone escrow protection, frame-accurate timecoded revision feedback, and master file locking. Now powered by SQLite database persistence with RBAC!&rdquo;
              </div>

              <h4 className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                Sample User Roles &amp; Credentials:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl space-y-1">
                  <div className="font-bold text-blue-700 dark:text-blue-300">Creator Account</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">Marcus Sterling</div>
                  <div className="font-mono text-[10px] text-slate-500">marcus@sterlingcapital.yt</div>
                  <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400">pass: creator123</div>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl space-y-1">
                  <div className="font-bold text-purple-700 dark:text-purple-300">Editor Account</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">Alex Rivera</div>
                  <div className="font-mono text-[10px] text-slate-500">alex@riverafilm.com</div>
                  <div className="font-mono text-[10px] text-purple-600 dark:text-purple-400">pass: editor123</div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1">
                  <div className="font-bold text-amber-700 dark:text-amber-300">Ops Admin Account</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">Elena Drake</div>
                  <div className="font-mono text-[10px] text-slate-500">ops@editbridge.network</div>
                  <div className="font-mono text-[10px] text-amber-600 dark:text-amber-400">pass: admin123</div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => {
                    retroSound.playDing();
                    setShowDemoGuide(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Got it! Let&apos;s Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
