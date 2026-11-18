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
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export function RetroHeader() {
  const pathname = usePathname();
  const {
    activeRole,
    switchRole,
    currentUser,
    soundEnabled,
    toggleSound,
    themeMode,
    toggleThemeMode,
    resetDemoData,
  } = useEditBridge();

  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Film },
    { href: '/workspace', label: 'Workspace', icon: Sparkles, highlight: true },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/editors', label: 'Editors', icon: Users },
    { href: '/admin', label: 'Admin Ops', icon: ShieldAlert },
  ];

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
            • Creator–Editor Collaboration Platform
          </span>
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              retroSound.playDing();
              setShowDemoGuide(true);
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3 py-0.5 rounded-full text-[11px] font-bold transition-all shadow-sm hover:shadow-amber-500/20 active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-slate-950" />
            <span>Hackathon Demo Guide</span>
          </button>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono hidden md:inline flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            System Online
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
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5 font-medium">
                Streamlined Video Hub
              </p>
            </div>
          </Link>
        </div>

        {/* Middle: Desktop Nav tabs */}
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

        {/* Right: Persona Switcher & Modern Controls */}
        <div className="flex items-center gap-2.5">
          {/* Role switcher segmented pill */}
          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-0.5 flex items-center gap-0.5 text-xs shadow-xs">
            <button
              onClick={() => switchRole('CREATOR')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                activeRole === 'CREATOR'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
              title="Marcus Sterling (Finance Creator)"
            >
              👤 Creator
            </button>
            <button
              onClick={() => switchRole('EDITOR')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                activeRole === 'EDITOR'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
              title="Alex Rivera (Video Editor)"
            >
              🎬 Editor
            </button>
            <button
              onClick={() => switchRole('ADMIN')}
              className={`px-2 py-1 rounded-lg font-medium text-[11px] transition-all ${
                activeRole === 'ADMIN'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
              title="EditBridge Ops Administrator"
            >
              🛡️ Admin
            </button>
          </div>

          {/* Theme & Audio Controls */}
          <div className="flex items-center gap-1.5">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleThemeMode}
              title={`Switch Theme: currently ${themeMode === 'DARK' ? 'Dark Mode' : 'Light Mode'}`}
              aria-label="Toggle Light and Dark Mode"
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-xs transition-colors shadow-xs"
            >
              {themeMode === 'DARK' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline font-semibold text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline font-semibold text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              title={soundEnabled ? 'Audio: ON' : 'Audio: OFF'}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-colors shadow-xs"
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
              className="bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 hover:border-rose-400 text-slate-500 hover:text-rose-600 w-8 h-8 rounded-xl hidden sm:flex items-center justify-center text-xs transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 lg:hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 flex items-center justify-center"
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
            <span>Current: {currentUser.name}</span>
            <button
              onClick={resetDemoData}
              className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-800 text-xs font-semibold"
            >
              Reset Demo
            </button>
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
                className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-sm space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200 rounded-xl text-xs leading-relaxed">
                💡 <strong className="text-cyan-950 dark:text-white">Judges Pitch Tip:</strong> &ldquo;EditBridge is not just a freelance directory. It is the full operational workstation where video projects are briefed, timestamp-reviewed, approved, and unlocked through 30/70 escrow protection.&rdquo;
              </div>

              <h4 className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                Step-by-Step Hackathon Demo Story:
              </h4>

              <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300 list-decimal pl-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">1. Editor Discovery:</strong> Visit <em>Editor Directory</em> to see Alex Rivera&apos;s verified profile (Finance & Tech retention specialist with showreel clips and rate packages).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">2. Project Brief:</strong> Open <em>Project Workspace</em> or <em>New Project</em>. Notice the structured brief: deliverables (16:9, 4K, 14 min, Captions, Sound Design), budget ($600), and 30%/70% milestone breakdown.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">3. Interactive Video Player & Timestamps:</strong> On the Workspace &gt; Review tab, play the video. Click on the scrubber or pause at any point, enter a revision note (e.g. &ldquo;00:43 - Replace B-Roll&rdquo;), and watch it tag the exact frame!
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">4. Editor Checklist:</strong> Switch persona to <em>Editor (Alex)</em>. Alex can mark revision comments from <em>Pending</em> to <em>In Progress</em> to <em>Resolved</em>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">5. Controlled Master Delivery & Milestone 2:</strong> In the File Vault, note that the uncompressed 4K Master is <strong>LOCKED</strong>. Click &ldquo;Release Milestone 2 (70% - $420.00)&rdquo; as Creator to trigger verified payout, celebration confetti, and instantly unlock the master download!
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">6. Review & Reputation:</strong> Leave a structured 5-star review, building Alex&apos;s verified track record.
                </li>
              </ol>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => {
                    retroSound.playDing();
                    setShowDemoGuide(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
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
