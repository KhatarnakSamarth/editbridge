'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Users,
  CheckCircle2,
  Layers,
  HelpCircle,
  Monitor,
  Zap,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { Hero3DVisual } from '@/components/Hero3DVisual';
import { TimestampPlayer } from '@/components/TimestampPlayer';
import { RevisionChecklist } from '@/components/RevisionChecklist';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export default function LandingPage() {
  const { switchRole, editors } = useEditBridge();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedPath, setSelectedPath] = useState<'CREATOR' | 'EDITOR'>('CREATOR');
  const [selectedSeekTime, setSelectedSeekTime] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How is EditBridge different from freelance directories like Fiverr or Upwork?',
      a: 'EditBridge is not just a directory—it is a purpose-built operational workspace. We provide frame-accurate timestamp video commenting, enforced revision boundaries, organized raw-file vaults, and 30%/70% milestone escrow that protects both sides. You can also invite your existing editor with one click.',
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
      a: 'Editing happens in professional external NLEs like DaVinci Resolve Studio, Adobe Premiere Pro, Final Cut Pro, or CapCut. EditBridge manages the collaboration layer: briefs, raw footage handoff, versioned review drafts, timestamp feedback, and deliverables.',
    },
  ];

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Hero Container */}
      <RetroWindow
        title="EDITBRIDGE WORKSPACE — CREATOR &amp; EDITOR COLLABORATION HUB"
        icon={<Film className="w-4 h-4 text-vice-pink" />}
        className="w-full shadow-2xl relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Main Hero Banner with Ambient 3D Prop in Background */}
          <div className="bg-gradient-to-b from-[#211038] via-[#170B29] to-[#0D0618] text-white p-6 sm:p-12 md:p-16 rounded-2xl border border-pink-500/25 flex flex-col items-center text-center relative overflow-hidden transition-colors min-h-[480px] sm:min-h-[520px] justify-center">
            
            {/* Ambient 3D Perspective Studio Prop in the Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
              <Hero3DVisual inBackground={true} />
            </div>

            {/* Ambient Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-64 bg-gradient-to-b from-pink-500/20 via-orange-500/15 to-transparent blur-3xl pointer-events-none z-0" />

            {/* Foreground Content */}
            <div className="relative z-10 flex flex-col items-center max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-[#170B29]/80 text-vice-pink border border-pink-500/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 shadow-xs backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-vice-gold" />
                <span>THE DIGITAL WORKSPACE FOR MODERN VIDEO CREATORS &amp; EDITORS</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
                One Workspace to Brief, Review &amp; Deliver High-Retention Videos.
              </h1>

              <p className="mt-4 text-sm sm:text-base md:text-lg text-vice-muted max-w-2xl font-sans leading-relaxed">
                Stop scattering instructions across WhatsApp, Drive links, and messy notes. EditBridge brings editor discovery, timestamp video feedback, revision limits, and 30/70 milestone payments into one structured workspace.
              </p>

              {/* Two Action Paths */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
                <Link
                  href="/workspace"
                  onClick={() => retroSound.playDing()}
                  className="bg-vice-gradient hover:opacity-95 text-white w-full py-3.5 px-6 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 transition-all hover:scale-102 active:scale-98"
                >
                  <span>Launch Creator Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/editors"
                  onClick={() => retroSound.playDing()}
                  className="bg-gradient-to-r from-purple-700 via-pink-700 to-rose-600 hover:opacity-95 text-white w-full py-3.5 px-6 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:scale-102 active:scale-98"
                >
                  <span>Discover Vetted Editors</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Production trust pill */}
              <div className="mt-8 flex items-center gap-2 text-xs text-vice-mint font-semibold bg-[#0D0618]/80 px-4 py-1.5 rounded-full border border-pink-500/25 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-vice-mint animate-pulse" />
                <span>Production Infrastructure • 30/70 Escrow Protocol • Supabase Cloud Active</span>
              </div>
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
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedPath === 'CREATOR'
                  ? 'border-vice-pink bg-[#170B29] shadow-lg shadow-pink-500/20 ring-2 ring-pink-500/30'
                  : 'bg-[#211038] border-pink-500/20 hover:border-vice-pink'
              }`}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-pink-500/20">
                <span className="font-bold text-xs text-vice-pink flex items-center gap-2 uppercase tracking-wide">
                  <Film className="w-4 h-4" />
                  FOR CONTENT CREATORS
                </span>
                <span className="text-[10px] bg-pink-500/15 text-vice-pink border border-pink-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  YOUTUBE &amp; PODCASTS
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-xs text-vice-text">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-vice-pink flex-shrink-0 mt-0.5" />
                  <span><strong>Frame-Accurate Timestamps:</strong> Click anywhere on draft video to capture exact frame notes (e.g. 00:43 - Replace B-Roll).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-vice-pink flex-shrink-0 mt-0.5" />
                  <span><strong>Revision Scope Boundaries:</strong> Prevent endless rounds with clear pre-agreed limits (e.g. 2 revision rounds).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-vice-pink flex-shrink-0 mt-0.5" />
                  <span><strong>Bring Your Editor:</strong> One-click invite link to onboard your trusted editor into the platform without switching talent.</span>
                </li>
              </ul>
              <div className="mt-6 pt-3.5 border-t border-pink-500/20">
                <Link
                  href="/projects/new"
                  onClick={() => switchRole('CREATOR')}
                  className="bg-vice-gradient hover:opacity-95 text-white w-full py-2.5 text-xs font-semibold text-center block rounded-xl transition-all shadow-xs"
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
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedPath === 'EDITOR'
                  ? 'border-vice-coral bg-[#170B29] shadow-lg shadow-orange-500/20 ring-2 ring-orange-500/30'
                  : 'bg-[#211038] border-pink-500/20 hover:border-vice-coral'
              }`}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-pink-500/20">
                <span className="font-bold text-xs text-vice-coral flex items-center gap-2 uppercase tracking-wide">
                  <Film className="w-4 h-4" />
                  FOR VIDEO EDITORS
                </span>
                <span className="text-[10px] bg-orange-500/15 text-vice-coral border border-orange-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  FREELANCE &amp; STUDIOS
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-xs text-vice-text">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-vice-coral flex-shrink-0 mt-0.5" />
                  <span><strong>Milestone Escrow Protection:</strong> 30% upfront deposit funded before editing starts to secure your time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-vice-coral flex-shrink-0 mt-0.5" />
                  <span><strong>Master File Access Lock:</strong> Client receives watermarked review proxy; uncompressed 4K master unlocks only upon final 70% payment.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-vice-coral flex-shrink-0 mt-0.5" />
                  <span><strong>Structured Feedback Checklist:</strong> No vague &ldquo;make it punchier&rdquo; WhatsApp voice notes. Every note is pinned to a timecode.</span>
                </li>
              </ul>
              <div className="mt-6 pt-3.5 border-t border-pink-500/20">
                <Link
                  href="/editors"
                  onClick={() => switchRole('EDITOR')}
                  className="bg-gradient-to-r from-vice-coral to-vice-gold hover:opacity-95 text-slate-950 font-bold w-full py-2.5 text-xs text-center block rounded-xl transition-all shadow-xs"
                >
                  Explore Editor Roster →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* How It Works (The 5-Step Pipeline) */}
      <RetroWindow
        title="THE 5-STEP END-TO-END PROJECT PIPELINE"
        icon={<Layers className="w-4 h-4 text-vice-gold" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Step 1 */}
          <div className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl flex flex-col justify-between shadow-xs hover:border-pink-500/40 transition-all">
            <div>
              <div className="w-8 h-8 bg-vice-gradient text-white font-bold text-xs rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-pink-500/25">
                01
              </div>
              <h3 className="font-bold text-xs text-vice-text mb-1.5">
                Discover or Invite
              </h3>
              <p className="text-[11px] text-vice-muted leading-relaxed">
                Filter editors by niche, software, and retention score, or send a direct link to bring your current editor.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-pink-500/20 text-[10px] text-vice-pink font-bold uppercase tracking-wider">
              Directory / Direct URL
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl flex flex-col justify-between shadow-xs hover:border-pink-500/40 transition-all">
            <div>
              <div className="w-8 h-8 bg-vice-gradient text-white font-bold text-xs rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-pink-500/25">
                02
              </div>
              <h3 className="font-bold text-xs text-vice-text mb-1.5">
                Structured Brief
              </h3>
              <p className="text-[11px] text-vice-muted leading-relaxed">
                Define duration, 16:9/9:16 aspect ratio, captions, style references, and set strict revision limits.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-pink-500/20 text-[10px] text-vice-pink font-bold uppercase tracking-wider">
              Scope &amp; Deliverables
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl flex flex-col justify-between shadow-xs hover:border-pink-500/40 transition-all">
            <div>
              <div className="w-8 h-8 bg-vice-gradient text-white font-bold text-xs rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-pink-500/25">
                03
              </div>
              <h3 className="font-bold text-xs text-vice-text mb-1.5">
                30% Upfront Kickoff
              </h3>
              <p className="text-[11px] text-vice-muted leading-relaxed">
                Client funds Milestone 1 deposit in protected escrow. Editor downloads raw footage and begins cut.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-pink-500/20 text-[10px] text-vice-mint font-bold uppercase tracking-wider">
              Escrow Protection
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl flex flex-col justify-between shadow-xs hover:border-pink-500/40 transition-all">
            <div>
              <div className="w-8 h-8 bg-vice-gradient text-white font-bold text-xs rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-pink-500/25">
                04
              </div>
              <h3 className="font-bold text-xs text-vice-text mb-1.5">
                Timestamp Feedback
              </h3>
              <p className="text-[11px] text-vice-muted leading-relaxed">
                Client plays draft proxy and drops pinned timecode notes. Editor checks off items: Pending → In Progress → Resolved.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-pink-500/20 text-[10px] text-vice-gold font-bold uppercase tracking-wider">
              Synced Video Player
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl flex flex-col justify-between shadow-xs hover:border-pink-500/40 transition-all">
            <div>
              <div className="w-8 h-8 bg-gradient-to-r from-vice-coral to-vice-gold text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-orange-500/25">
                05
              </div>
              <h3 className="font-bold text-xs text-vice-text mb-1.5">
                Final Payout &amp; Master
              </h3>
              <p className="text-[11px] text-vice-muted leading-relaxed">
                Final master uploaded. Client releases remaining 70% milestone, unlocking verified uncompressed 4K download!
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-pink-500/20 text-[10px] text-vice-coral font-bold uppercase tracking-wider">
              Master Unlock &amp; Review
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Live Interactive Video Review Monitor Playground */}
      <RetroWindow
        title="INTERACTIVE VIDEO REVIEW MONITOR PLAYGROUND — TEST IT LIVE"
        icon={<Film className="w-4 h-4 text-vice-pink" />}
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-pink-500/20">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-vice-text flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-vice-pink" />
                Live Video Review &amp; Timestamp Revision Engine
              </h2>
              <p className="text-[11px] text-vice-muted mt-0.5">
                Switch sample cuts, click jump buttons, pause anywhere to drop frame-accurate revision notes, and check off revision items in real time.
              </p>
            </div>
            <Link
              href="/workspace"
              onClick={() => retroSound.playDing()}
              className="bg-vice-gradient hover:opacity-95 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-pink-500/25 transition-all shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>Open in Full Studio Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 7 Cols: Video Monitor Player */}
            <div className="lg:col-span-7">
              <TimestampPlayer
                onSelectTimestamp={(sec) => setSelectedSeekTime(sec)}
                externalSeekSeconds={selectedSeekTime}
                showSampleSelector={true}
              />
            </div>

            {/* Right 5 Cols: Revision Checklist & Scope Tracker */}
            <div className="lg:col-span-5">
              <RevisionChecklist onSeekToTimestamp={(sec) => setSelectedSeekTime(sec)} />
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Editor Showcase Preview */}
      <RetroWindow
        title="FEATURED VERIFIED VIDEO EDITORS"
        icon={<Users className="w-4 h-4 text-vice-coral" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3.5 border-b border-pink-500/20">
            <span className="text-xs text-vice-muted font-medium">
              Showing top vetted editors specializing in high-retention creator workflows:
            </span>
            <Link
              href="/editors"
              onClick={() => retroSound.playClick()}
              className="bg-vice-gradient hover:opacity-95 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-pink-500/25 transition-all cursor-pointer"
            >
              <span>View Full Directory ({editors.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {editors.map((editor) => (
              <div
                key={editor.user_id}
                className="p-4 bg-[#170B29] border border-pink-500/20 rounded-2xl flex flex-col justify-between hover:border-pink-500/40 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editor.portfolio_items[0]?.thumbnail_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=150'}
                      alt={editor.name}
                      className="w-12 h-12 rounded-xl object-cover border border-pink-500/30 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-vice-text truncate">
                        {editor.name}
                      </h4>
                      <p className="text-[11px] text-vice-gold font-semibold flex items-center gap-1">
                        ★ {editor.rating} ({editor.reviews_count} reviews)
                      </p>
                      <p className="text-[10px] text-vice-dim">
                        {editor.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-vice-muted mt-3 line-clamp-2">
                    {editor.headline}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {editor.niches.slice(0, 2).map((n) => (
                      <span
                        key={n}
                        className="bg-[#211038] border border-pink-500/20 text-[10px] px-2 py-0.5 rounded-md text-vice-text font-medium"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-pink-500/20 flex items-center justify-between text-xs">
                  <span className="font-bold text-vice-gold font-mono">
                    {editor.price_range}
                  </span>
                  <Link
                    href={`/editors/${editor.user_id}`}
                    onClick={() => retroSound.playClick()}
                    className="bg-[#211038] hover:bg-[#2c174a] text-vice-text border border-pink-500/20 px-3 py-1 text-xs font-semibold rounded-lg transition-colors"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left 2 Cols: FAQ Accordion */}
        <div className="md:col-span-2">
          <RetroWindow
            title="FREQUENTLY ASKED QUESTIONS"
            icon={<HelpCircle className="w-4 h-4 text-vice-gold" />}
          >
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="bg-[#170B29] border border-pink-500/20 rounded-xl overflow-hidden transition-all">
                    <button
                      onClick={() => {
                        retroSound.playClick();
                        setActiveFaq(isOpen ? null : index);
                      }}
                      className="w-full p-4 text-left font-bold text-xs text-vice-text flex items-center justify-between hover:bg-[#211038] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-sm font-bold text-vice-pink ml-2">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-vice-muted leading-relaxed border-t border-pink-500/20 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </RetroWindow>
        </div>

        {/* Right Col: System Stats Box */}
        <div className="md:col-span-1">
          <RetroWindow
            title="PLATFORM METRICS"
            icon={<Monitor className="w-4 h-4 text-vice-mint" />}
          >
            <div className="p-5 bg-[#170B29] rounded-2xl border border-pink-500/25 text-xs space-y-3 text-vice-muted">
              <div className="border-b border-pink-500/20 pb-2 text-vice-mint font-bold uppercase tracking-wider text-[11px]">
                [PLATFORM INTEGRITY STATUS]
              </div>
              <div className="flex justify-between">
                <span>ACTIVE CLIENTS:</span>
                <span className="text-vice-text font-mono font-bold">1,420</span>
              </div>
              <div className="flex justify-between">
                <span>VETTED EDITORS:</span>
                <span className="text-vice-text font-mono font-bold">385</span>
              </div>
              <div className="flex justify-between">
                <span>ESCROW VALUE HELD:</span>
                <span className="text-vice-gold font-mono font-bold">$148,500</span>
              </div>
              <div className="flex justify-between">
                <span>AVG TURNAROUND:</span>
                <span className="text-vice-text font-mono font-bold">48 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>DISPUTE RATE:</span>
                <span className="text-vice-mint font-mono font-bold">&lt;0.4%</span>
              </div>
              <div className="pt-2 border-t border-pink-500/20 text-[11px] text-vice-dim leading-relaxed">
                Operating under milestone state machine v1.0. All transitions validated server-side.
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/workspace"
                onClick={() => {
                  retroSound.playDing();
                  switchRole('CREATOR');
                }}
                className="bg-vice-gradient hover:opacity-95 text-white w-full py-3 text-xs font-semibold text-center block rounded-xl shadow-md shadow-pink-500/25 transition-all"
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
