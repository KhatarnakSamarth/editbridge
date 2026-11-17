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
  HelpCircle,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { UserRole } from '@/types';
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
    resetDemoData,
  } = useEditBridge();

  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Monitor },
    { href: '/workspace', label: 'Project Workspace', icon: Film, highlight: true },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/editors', label: 'Editor Directory', icon: Users },
    { href: '/admin', label: 'Admin Ops', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#c0c0c0] border-b-2 border-[#000000] shadow-md select-none">
      {/* Top utility strip: Start Menu / System branding */}
      <div className="bg-[#000080] text-white text-xs px-2 py-1 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#00ff66] inline-block animate-pulse rounded-none"></span>
          <span className="font-bold tracking-wider">EDITBRIDGE WORKSTATION v1.0.4 [BUILD 2026]</span>
          <span className="hidden md:inline text-neutral-300">| MIL-STD RETRO-SaaS WORKSPACE</span>
        </div>

        {/* Demo Scenario Guide trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              retroSound.playDing();
              setShowDemoGuide(true);
            }}
            className="hidden sm:flex items-center gap-1 bg-[#ff9900] text-black px-2 py-0.5 text-[11px] font-bold border border-yellow-200 hover:bg-yellow-400 active:translate-y-0.5"
          >
            <Sparkles className="w-3 h-3" />
            <span>Hackathon Demo Guide</span>
          </button>
          <span className="text-[11px] text-yellow-300">TCP/IP 56Kbps OK</span>
        </div>
      </div>

      {/* Main retro navigation bar */}
      <div className="px-3 py-2 flex items-center justify-between gap-3">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => retroSound.playClick()}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-black border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] flex items-center justify-center text-teal-400 font-mono font-black text-sm">
              EB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-neutral-900 font-mono">
                  EDITBRIDGE
                </span>
                <span className="bg-[#008080] text-white text-[10px] px-1 py-0.2 font-mono uppercase">
                  90s OS
                </span>
              </div>
              <p className="text-[10px] text-neutral-600 hidden sm:block -mt-0.5">
                Creator–Editor Collaboration Workspace
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
                className={`win95-button px-3 py-1.5 text-xs flex items-center gap-1.5 font-bold ${
                  isActive
                    ? 'bg-[#dfdfdf] border-t-[#000000] border-l-[#000000] border-r-[#ffffff] border-b-[#ffffff] text-[#000080]'
                    : 'text-neutral-800 hover:bg-[#d8d8d8]'
                } ${item.highlight && !isActive ? 'text-blue-900 border-blue-800' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#000080]' : 'text-neutral-600'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Persona Switcher & Retro Toggles */}
        <div className="flex items-center gap-2">
          {/* Role switcher dropdown / tabs */}
          <div className="win95-sunken px-2 py-1 flex items-center gap-1 text-xs">
            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase mr-1 hidden sm:inline">
              Persona:
            </span>
            <button
              onClick={() => switchRole('CREATOR')}
              className={`px-2 py-0.5 font-bold font-mono text-[11px] rounded-none transition-none ${
                activeRole === 'CREATOR'
                  ? 'bg-[#000080] text-white shadow-sm'
                  : 'bg-transparent text-neutral-700 hover:bg-neutral-200'
              }`}
              title="Marcus Sterling (Finance Creator)"
            >
              👤 Creator
            </button>
            <button
              onClick={() => switchRole('EDITOR')}
              className={`px-2 py-0.5 font-bold font-mono text-[11px] rounded-none transition-none ${
                activeRole === 'EDITOR'
                  ? 'bg-[#008080] text-white shadow-sm'
                  : 'bg-transparent text-neutral-700 hover:bg-neutral-200'
              }`}
              title="Alex Rivera (Video Editor)"
            >
              🎬 Editor
            </button>
            <button
              onClick={() => switchRole('ADMIN')}
              className={`px-2 py-0.5 font-bold font-mono text-[11px] rounded-none transition-none ${
                activeRole === 'ADMIN'
                  ? 'bg-[#b87000] text-white shadow-sm'
                  : 'bg-transparent text-neutral-700 hover:bg-neutral-200'
              }`}
              title="EditBridge Ops Administrator"
            >
              🛡️ Admin
            </button>
          </div>

          {/* Quick Sound & CRT toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute 90s Sounds' : 'Unmute 90s Sounds'}
              title={soundEnabled ? 'Retro Audio: ON' : 'Retro Audio: OFF'}
              className="win95-button w-7 h-7 flex items-center justify-center text-xs"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-neutral-800" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              )}
            </button>

            <button
              onClick={toggleCrtMode}
              title={crtMode ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
              className={`win95-button w-7 h-7 flex items-center justify-center text-xs ${
                crtMode ? 'bg-[#00ff66]/20 border-green-800' : ''
              }`}
            >
              <Monitor
                className={`w-3.5 h-3.5 ${crtMode ? 'text-green-700' : 'text-neutral-800'}`}
              />
            </button>

            <button
              onClick={resetDemoData}
              title="Reset Demo to Original State"
              className="win95-button w-7 h-7 hidden sm:flex items-center justify-center text-xs text-red-700 hover:bg-red-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="win95-button w-8 h-8 lg:hidden flex items-center justify-center"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-3 bg-[#c0c0c0] border-t border-[#808080] flex flex-col gap-2">
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
                className={`win95-button p-2 text-xs flex items-center gap-2 font-bold ${
                  isActive ? 'bg-[#dfdfdf] text-[#000080]' : 'text-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-neutral-400 flex items-center justify-between">
            <span className="text-xs font-mono">Current User: {currentUser.name}</span>
            <button
              onClick={resetDemoData}
              className="win95-button px-2 py-1 text-xs text-red-700 font-bold"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      )}

      {/* Hackathon Demo Guide Modal */}
      {showDemoGuide && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
          <div className="win95-window max-w-2xl w-full">
            <div className="win95-titlebar">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                HACKATHON DEMO WALKTHROUGH — SECTION 19 SCENARIO
              </span>
              <button
                onClick={() => {
                  retroSound.playClick();
                  setShowDemoGuide(false);
                }}
                className="w-5 h-5 bg-[#c0c0c0] text-black border border-black text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-[#c0c0c0] text-sm space-y-3 font-sans max-h-[80vh] overflow-y-auto">
              <div className="p-3 bg-blue-50 border-2 border-blue-900 text-blue-950 font-mono text-xs">
                💡 <strong>Judges Pitch Tip:</strong> &ldquo;EditBridge is not just a freelance directory. It is the full operational workspace where video projects are briefed, timestamp-reviewed, approved, and unlocked with milestone payments.&rdquo;
              </div>

              <h4 className="font-bold text-neutral-900 border-b border-neutral-400 pb-1 font-mono">
                Step-by-Step Hackathon Demo Story (from Blueprint §19):
              </h4>

              <ol className="space-y-2.5 text-xs text-neutral-800 list-decimal pl-4">
                <li>
                  <strong>1. Editor Discovery:</strong> Visit <em>Editor Directory</em> to see Alex Rivera&apos;s verified profile (Finance & Tech high-retention specialist with showreel clips and rate packages).
                </li>
                <li>
                  <strong>2. Project Brief:</strong> Open <em>Project Workspace</em> or <em>New Project</em>. Notice the structured brief: deliverables (16:9, 4K, 14 min, Captions, Sound Design), budget ($600), and 30%/70% milestone breakdown.
                </li>
                <li>
                  <strong>3. Interactive Video Player & Timestamps:</strong> On the Workspace &gt; Review tab, play the video. Click on the scrubber or pause at any point, enter a revision note (e.g. &ldquo;00:43 - Replace B-Roll&rdquo;), and watch it tag the exact frame!
                </li>
                <li>
                  <strong>4. Editor Checklist:</strong> Switch persona to <em>Editor (Alex)</em>. Alex can mark revision comments from <em>Pending</em> to <em>In Progress</em> to <em>Resolved</em>.
                </li>
                <li>
                  <strong>5. Controlled Master Delivery & Milestone 2:</strong> In the File Vault, note that the uncompressed 4K Master is <strong>LOCKED</strong>. Click &ldquo;Release Milestone 2 (70% - $420.00)&rdquo; as Creator to trigger verified payout, celebration confetti, and instantly unlock the master download!
                </li>
                <li>
                  <strong>6. Review & Reputation:</strong> Leave a structured 5-star review, building Alex&apos;s verified track record.
                </li>
              </ol>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    retroSound.playDing();
                    setShowDemoGuide(false);
                  }}
                  className="win95-button win95-button-primary px-4 py-1.5 text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                  Got it! Let&apos;s Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
