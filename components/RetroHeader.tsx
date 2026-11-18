'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Monitor,
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
  Palette,
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
    crtMode,
    toggleCrtMode,
    soundEnabled,
    toggleSound,
    themeMode,
    toggleThemeMode,
    resetDemoData,
  } = useEditBridge();

  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Monitor },
    { href: '/workspace', label: 'Workspace', icon: Film, highlight: true },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/editors', label: 'Editors', icon: Users },
    { href: '/admin', label: 'Admin Ops', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#111827] border-b border-[#1f2937] shadow-lg select-none">
      {/* Top utility notification strip */}
      <div className="bg-[#0f172a] text-slate-300 text-xs px-3 py-1 flex items-center justify-between border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="font-semibold tracking-wide text-slate-200">
            EDITBRIDGE WORKSPACE
          </span>
          <span className="hidden sm:inline text-slate-400">
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
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded text-[11px] font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-3 h-3" />
            <span>Hackathon Demo Guide</span>
          </button>
          <span className="text-[11px] text-emerald-400 font-mono hidden md:inline">
            ● System Status: Online
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">
                  EditBridge
                </span>
                <span className="bg-indigo-900/60 text-indigo-300 text-[10px] px-1.5 py-0.2 rounded font-mono uppercase font-semibold border border-indigo-700/50">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block -mt-0.5">
                Streamlined Video Production Hub
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
                className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Persona Switcher & Toggles */}
        <div className="flex items-center gap-2">
          {/* Role switcher segmented pill */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-lg p-0.5 flex items-center gap-0.5 text-xs">
            <button
              onClick={() => switchRole('CREATOR')}
              className={`px-2.5 py-1 rounded font-medium text-[11px] transition-all ${
                activeRole === 'CREATOR'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Marcus Sterling (Finance Creator)"
            >
              👤 Creator
            </button>
            <button
              onClick={() => switchRole('EDITOR')}
              className={`px-2.5 py-1 rounded font-medium text-[11px] transition-all ${
                activeRole === 'EDITOR'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Alex Rivera (Video Editor)"
            >
              🎬 Editor
            </button>
            <button
              onClick={() => switchRole('ADMIN')}
              className={`px-2 py-1 rounded font-medium text-[11px] transition-all ${
                activeRole === 'ADMIN'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="EditBridge Ops Administrator"
            >
              🛡️ Admin
            </button>
          </div>

          {/* Quick theme & sound toggles */}
          <div className="flex items-center gap-1">
            {/* Theme switcher toggle */}
            <button
              onClick={toggleThemeMode}
              title={`Switch UI Mode: Currently ${themeMode === 'MODERN' ? 'Modern Clean' : 'Retro 90s'}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 h-8 px-2 rounded-lg flex items-center gap-1.5 text-xs transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline font-medium text-[11px]">
                {themeMode === 'MODERN' ? 'Modern' : 'Retro 90s'}
              </span>
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              title={soundEnabled ? 'Audio: ON' : 'Audio: OFF'}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* CRT scanlines toggle */}
            <button
              onClick={toggleCrtMode}
              title={crtMode ? 'CRT Effect: ON' : 'CRT Effect: OFF'}
              className={`border w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                crtMode
                  ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={resetDemoData}
              title="Reset Demo Data to pristine initial state"
              className="bg-slate-800 hover:bg-red-950/50 border border-slate-700 hover:border-red-600 text-slate-400 hover:text-red-400 w-8 h-8 rounded-lg hidden sm:flex items-center justify-center text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 lg:hidden bg-slate-800 border border-slate-700 rounded-lg text-slate-300 flex items-center justify-center"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
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
                className={`p-2 rounded-lg text-xs flex items-center gap-2 font-medium ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Current: {currentUser.name}</span>
            <button
              onClick={resetDemoData}
              className="px-2 py-1 bg-red-900/40 text-red-300 rounded border border-red-700 text-xs"
            >
              Reset Demo
            </button>
          </div>
        </div>
      )}

      {/* Hackathon Demo Guide Modal */}
      {showDemoGuide && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="win95-window max-w-2xl w-full border border-slate-700 shadow-2xl">
            <div className="win95-titlebar">
              <span className="flex items-center gap-2 font-bold text-slate-100">
                <Sparkles className="w-4 h-4 text-amber-400" />
                HACKATHON DEMO WALKTHROUGH — SECTION 19 SCENARIO
              </span>
              <button
                onClick={() => {
                  retroSound.playClick();
                  setShowDemoGuide(false);
                }}
                className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-5 text-sm space-y-3 max-h-[80vh] overflow-y-auto">
              <div className="p-3 bg-blue-950/60 border border-blue-800 text-blue-200 rounded-lg text-xs leading-relaxed">
                💡 <strong>Judges Pitch Tip:</strong> &ldquo;EditBridge is not just another freelance directory. It is the full operational workspace where video projects are briefed, timestamp-reviewed, approved, and unlocked with milestone payments.&rdquo;
              </div>

              <h4 className="font-bold text-slate-200 border-b border-slate-700 pb-1.5">
                Step-by-Step Hackathon Demo Story:
              </h4>

              <ol className="space-y-2.5 text-xs text-slate-300 list-decimal pl-4">
                <li>
                  <strong className="text-white">1. Editor Discovery:</strong> Visit <em>Editor Directory</em> to see Alex Rivera&apos;s verified profile (Finance & Tech retention specialist with showreel clips and rate packages).
                </li>
                <li>
                  <strong className="text-white">2. Project Brief:</strong> Open <em>Project Workspace</em> or <em>New Project</em>. Notice the structured brief: deliverables (16:9, 4K, 14 min, Captions, Sound Design), budget ($600), and 30%/70% milestone breakdown.
                </li>
                <li>
                  <strong className="text-white">3. Interactive Video Player & Timestamps:</strong> On the Workspace &gt; Review tab, play the video. Click on the scrubber or pause at any point, enter a revision note (e.g. &ldquo;00:43 - Replace B-Roll&rdquo;), and watch it tag the exact frame!
                </li>
                <li>
                  <strong className="text-white">4. Editor Checklist:</strong> Switch persona to <em>Editor (Alex)</em>. Alex can mark revision comments from <em>Pending</em> to <em>In Progress</em> to <em>Resolved</em>.
                </li>
                <li>
                  <strong className="text-white">5. Controlled Master Delivery & Milestone 2:</strong> In the File Vault, note that the uncompressed 4K Master is <strong>LOCKED</strong>. Click &ldquo;Release Milestone 2 (70% - $420.00)&rdquo; as Creator to trigger verified payout, celebration confetti, and instantly unlock the master download!
                </li>
                <li>
                  <strong className="text-white">6. Review & Reputation:</strong> Leave a structured 5-star review, building Alex&apos;s verified track record.
                </li>
              </ol>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => {
                    retroSound.playDing();
                    setShowDemoGuide(false);
                  }}
                  className="win95-button win95-button-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
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
