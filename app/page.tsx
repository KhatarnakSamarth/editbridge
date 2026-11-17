'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Sparkles,
  ShieldCheck,
  Clock,
  PlayCircle,
  FileCheck,
  ChevronRight,
  ArrowRight,
  Users,
  CheckCircle2,
  Lock,
  Unlock,
  Layers,
  HelpCircle,
  Video,
  Monitor,
  ExternalLink,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export default function LandingPage() {
  const { switchRole, editors, resetDemoData } = useEditBridge();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedPath, setSelectedPath] = useState<'CREATOR' | 'EDITOR'>('CREATOR');

  const faqs = [
    {
      q: 'How is EditBridge different from freelance directories like Fiverr or Upwork?',
      a: 'EditBridge is not just a marketplace directory—it is a purpose-built operational workspace. We provide frame-accurate timestamp video commenting, enforced revision boundaries, organized raw-file vaults, and 30%/70% milestone payouts that lock uncompressed masters until final release. You can even invite your existing editor.',
    },
    {
      q: 'Can I bring my existing video editor onto EditBridge?',
      a: 'Yes! Section 15 of our product philosophy encourages inviting your existing trusted editors. Generating a creator invitation bypasses discovery and immediately establishes your private project workspace with structured briefs and milestone protections.',
    },
    {
      q: 'How does the milestone protection and master file locking work?',
      a: 'Projects split into an initial 30% upfront deposit (which authorizes editor schedule and raw footage downloads) and a 70% final delivery release. While editing and reviewing, the creator watches a draft proxy. The uncompressed 4K master is access-controlled until the client confirms the revisions and releases the final milestone.',
    },
    {
      q: 'What video editing software do editors use?',
      a: 'Editing happens outside in professional NLEs like DaVinci Resolve Studio, Adobe Premiere Pro, Final Cut Pro, or CapCut. EditBridge manages the coordination layer: briefs, raw footage handoff, versioned review drafts, timestamp feedback, and deliverables.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-8 font-sans">
      {/* Hero Retro Window Container */}
      <RetroWindow
        title="EDITBRIDGE_OS_SETUP.EXE — CREATOR & EDITOR COLLABORATION WORKSPACE"
        icon={<Film className="w-4 h-4 text-yellow-300" />}
        className="w-full shadow-2xl"
      >
        <div className="space-y-6">
          {/* Main Hero Banner */}
          <div className="bg-gradient-to-b from-[#000080] to-[#082040] text-white p-6 md:p-10 border-2 border-black flex flex-col items-center text-center relative overflow-hidden">
            {/* Background grid texture */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 font-mono text-xs font-black uppercase tracking-wider mb-4 border border-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE 1990s RETRO WORKSTATION FOR MODERN VIDEO TEAMS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-yellow-300 max-w-4xl leading-tight">
              One Workspace to Brief, Review &amp; Deliver High-Retention Videos.
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-neutral-200 max-w-2xl font-sans leading-relaxed">
              Stop scattering instructions across WhatsApp, Drive links, and messy notes. EditBridge brings discovery, timestamp feedback, revision limits, and 30/70 milestone payments into one structured desktop.
            </p>

            {/* Two Action Paths (Section 7.A) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
              <Link
                href="/workspace"
                onClick={() => {
                  retroSound.playDing();
                  switchRole('CREATOR');
                }}
                className="win95-button win95-button-primary w-full py-3 px-5 text-sm font-mono font-bold flex items-center justify-center gap-2 text-yellow-300 hover:brightness-110 shadow-lg"
              >
                <span>Launch Creator Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/workspace"
                onClick={() => {
                  retroSound.playDing();
                  switchRole('EDITOR');
                }}
                className="win95-button win95-button-amber w-full py-3 px-5 text-sm font-mono font-bold flex items-center justify-center gap-2 text-white hover:brightness-110 shadow-lg"
              >
                <span>Enter as Editor (Alex)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hackathon instant demo pill */}
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Hackathon Hero Project Ready: &ldquo;The Great AI Bubble of 2026&rdquo;</span>
            </div>
          </div>

          {/* Interactive Role Switcher & Persona Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* For Creators */}
            <div
              onClick={() => {
                retroSound.playClick();
                setSelectedPath('CREATOR');
              }}
              className={`win95-window p-4 cursor-pointer transition-all ${
                selectedPath === 'CREATOR'
                  ? 'border-2 border-blue-900 bg-blue-50/80 shadow-md'
                  : 'hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-400">
                <span className="font-bold text-xs font-mono text-[#000080] flex items-center gap-1.5">
                  <Film className="w-4 h-4" />
                  FOR CONTENT CREATORS
                </span>
                <span className="text-[10px] font-mono bg-blue-100 border border-blue-400 px-1.5 py-0.2 text-blue-900 font-bold">
                  YOUTUBERS &amp; PODCASTERS
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-neutral-800 font-sans">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Accurate Timestamp Feedback:</strong> Click anywhere on draft video to capture exact frame notes (e.g. 00:43 - Replace B-Roll).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Enforced Revision Scope:</strong> Prevent endless rounds with clear pre-agreed limits (e.g. 2 revision cycles).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Bring Your Editor:</strong> One-click invite link to onboard your trusted editor into the platform without switching talent.</span>
                </li>
              </ul>
              <div className="mt-4 pt-2 border-t border-neutral-300">
                <Link
                  href="/projects/new"
                  onClick={() => switchRole('CREATOR')}
                  className="win95-button win95-button-primary w-full py-1.5 text-xs font-mono font-bold text-center block"
                >
                  Create Structured Brief →
                </Link>
              </div>
            </div>

            {/* For Editors */}
            <div
              onClick={() => {
                retroSound.playClick();
                setSelectedPath('EDITOR');
              }}
              className={`win95-window p-4 cursor-pointer transition-all ${
                selectedPath === 'EDITOR'
                  ? 'border-2 border-amber-900 bg-amber-50/80 shadow-md'
                  : 'hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-400">
                <span className="font-bold text-xs font-mono text-[#b87000] flex items-center gap-1.5">
                  <Film className="w-4 h-4" />
                  FOR VIDEO EDITORS
                </span>
                <span className="text-[10px] font-mono bg-amber-100 border border-amber-400 px-1.5 py-0.2 text-amber-900 font-bold">
                  FREELANCE &amp; BOUTIQUES
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-neutral-800 font-sans">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Guaranteed Milestone Protection:</strong> 30% upfront deposit funded in escrow before editing begins.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Master File Access Lock:</strong> Client receives watermarked review proxy; uncompressed 4K master unlocks only upon 70% final payout.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Structured Feedback Checklist:</strong> No vague &ldquo;make it cooler&rdquo; WhatsApp texts. Every note is pinned to a timecode.</span>
                </li>
              </ul>
              <div className="mt-4 pt-2 border-t border-neutral-300">
                <Link
                  href="/editors"
                  onClick={() => switchRole('EDITOR')}
                  className="win95-button win95-button-amber w-full py-1.5 text-xs font-mono font-bold text-center block text-white"
                >
                  Explore Editor Roster →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* How It Works (Section 7.A - The 5-Step Pipeline) */}
      <RetroWindow
        title="WORKFLOW_ENGINE.SYS — THE 5-STEP END-TO-END PROJECT PIPELINE"
        icon={<Layers className="w-4 h-4 text-emerald-300" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          {/* Step 1 */}
          <div className="win95-window p-3 bg-white flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 bg-[#000080] text-yellow-300 font-bold text-xs flex items-center justify-center mb-2">
                01
              </div>
              <h3 className="font-bold text-xs text-neutral-900 mb-1">
                Discover or Invite
              </h3>
              <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">
                Filter editors by niche, software, and retention score, or send a direct link to bring your current editor.
              </p>
            </div>
            <div className="mt-3 pt-1 border-t border-neutral-200 text-[10px] text-blue-800 font-bold">
              Directory / Direct URL
            </div>
          </div>

          {/* Step 2 */}
          <div className="win95-window p-3 bg-white flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 bg-[#000080] text-yellow-300 font-bold text-xs flex items-center justify-center mb-2">
                02
              </div>
              <h3 className="font-bold text-xs text-neutral-900 mb-1">
                Structured Brief
              </h3>
              <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">
                Define duration, 16:9/9:16 aspect ratio, captions, style references, and set strict revision limits.
              </p>
            </div>
            <div className="mt-3 pt-1 border-t border-neutral-200 text-[10px] text-blue-800 font-bold">
              Scope &amp; Deliverables
            </div>
          </div>

          {/* Step 3 */}
          <div className="win95-window p-3 bg-white flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 bg-[#000080] text-yellow-300 font-bold text-xs flex items-center justify-center mb-2">
                03
              </div>
              <h3 className="font-bold text-xs text-neutral-900 mb-1">
                30% Upfront Kickoff
              </h3>
              <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">
                Client funds Milestone 1 deposit in protected escrow. Editor downloads raw footage and begins cut.
              </p>
            </div>
            <div className="mt-3 pt-1 border-t border-neutral-200 text-[10px] text-emerald-800 font-bold">
              Escrow Protection
            </div>
          </div>

          {/* Step 4 */}
          <div className="win95-window p-3 bg-white flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 bg-[#000080] text-yellow-300 font-bold text-xs flex items-center justify-center mb-2">
                04
              </div>
              <h3 className="font-bold text-xs text-neutral-900 mb-1">
                Timestamp Feedback
              </h3>
              <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">
                Client plays draft proxy and drops pinned timecode notes. Editor checks off items: Pending → In Progress → Resolved.
              </p>
            </div>
            <div className="mt-3 pt-1 border-t border-neutral-200 text-[10px] text-amber-800 font-bold">
              Synced Video Player
            </div>
          </div>

          {/* Step 5 */}
          <div className="win95-window p-3 bg-white flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 bg-[#000080] text-yellow-300 font-bold text-xs flex items-center justify-center mb-2">
                05
              </div>
              <h3 className="font-bold text-xs text-neutral-900 mb-1">
                Final Payout &amp; Master
              </h3>
              <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">
                Final master uploaded. Client releases remaining 70% milestone, unlocking verified uncompressed 4K download!
              </p>
            </div>
            <div className="mt-3 pt-1 border-t border-neutral-200 text-[10px] text-purple-800 font-bold">
              Master Unlock &amp; Review
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Editor Showcase Preview (Section 7.A & 7.C) */}
      <RetroWindow
        title="TALENT_ROSTER.DAT — FEATURED VERIFIED EDITORS"
        icon={<Users className="w-4 h-4 text-cyan-300" />}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-neutral-400">
            <span className="text-xs font-mono text-neutral-700">
              Showing top vetted editors specializing in high-retention creator workflows:
            </span>
            <Link
              href="/editors"
              onClick={() => retroSound.playClick()}
              className="win95-button win95-button-primary px-3 py-1 text-xs font-mono font-bold flex items-center gap-1"
            >
              <span>View Full Directory ({editors.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {editors.map((editor) => (
              <div
                key={editor.user_id}
                className="win95-window p-3 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editor.portfolio_items[0]?.thumbnail_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=150'}
                      alt={editor.name}
                      className="w-12 h-12 object-cover border border-black flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs font-mono text-neutral-900 truncate">
                        {editor.name}
                      </h4>
                      <p className="text-[10px] font-mono text-emerald-700 font-bold">
                        ★ {editor.rating} ({editor.reviews_count} reviews)
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        {editor.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-700 font-sans mt-2 line-clamp-2">
                    {editor.headline}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {editor.niches.slice(0, 2).map((n) => (
                      <span
                        key={n}
                        className="bg-neutral-100 border border-neutral-300 text-[9px] px-1 font-mono"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-900">
                    {editor.price_range}
                  </span>
                  <Link
                    href={`/editors/${editor.user_id}`}
                    onClick={() => retroSound.playClick()}
                    className="win95-button px-2 py-0.5 text-[11px] font-bold"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RetroWindow>

      {/* Interactive FAQ & System Manifesto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left 2 Cols: FAQ Accordion */}
        <div className="md:col-span-2">
          <RetroWindow
            title="HELP_FAQ.HLP — FREQUENTLY ASKED QUESTIONS"
            icon={<HelpCircle className="w-4 h-4 text-yellow-300" />}
          >
            <div className="space-y-2">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="win95-window bg-white">
                    <button
                      onClick={() => {
                        retroSound.playClick();
                        setActiveFaq(isOpen ? null : index);
                      }}
                      className="w-full p-2.5 text-left font-mono font-bold text-xs flex items-center justify-between hover:bg-neutral-100"
                    >
                      <span className="text-neutral-900">{faq.q}</span>
                      <span className="text-sm font-black text-neutral-600">
                        {isOpen ? '[-]' : '[+]'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-3 bg-neutral-50 border-t border-neutral-300 text-xs font-sans text-neutral-700 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </RetroWindow>
        </div>

        {/* Right Col: 90s System Stats Box */}
        <div className="md:col-span-1">
          <RetroWindow
            title="SYSTEM_METRICS.NFO"
            icon={<Monitor className="w-4 h-4 text-emerald-400" />}
          >
            <div className="win95-sunken-dark p-3 text-[11px] font-mono space-y-2 text-green-400">
              <div className="border-b border-green-800 pb-1 text-yellow-300 font-bold">
                [PLATFORM INTEGRITY STATUS]
              </div>
              <div className="flex justify-between">
                <span>ACTIVE CLIENTS:</span>
                <span className="text-white">1,420</span>
              </div>
              <div className="flex justify-between">
                <span>VETTED EDITORS:</span>
                <span className="text-white">385</span>
              </div>
              <div className="flex justify-between">
                <span>ESCROW VALUE HELD:</span>
                <span className="text-white">$148,500</span>
              </div>
              <div className="flex justify-between">
                <span>AVG TURNAROUND:</span>
                <span className="text-white">48 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>DISPUTE RATE:</span>
                <span className="text-white">&lt;0.4%</span>
              </div>
              <div className="pt-2 border-t border-green-800 text-[10px] text-neutral-400">
                Operating under strict milestone state machine v1.0. All transitions validated server-side.
              </div>
            </div>

            <div className="mt-3">
              <Link
                href="/workspace"
                onClick={() => {
                  retroSound.playDing();
                  switchRole('CREATOR');
                }}
                className="win95-button win95-button-primary w-full py-2 text-xs font-mono font-bold text-center block text-yellow-300"
              >
                Open Project Workspace →
              </Link>
            </div>
          </RetroWindow>
        </div>
      </div>
    </div>
  );
}
