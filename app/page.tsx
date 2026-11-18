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
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export default function LandingPage() {
  const { switchRole, editors } = useEditBridge();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedPath, setSelectedPath] = useState<'CREATOR' | 'EDITOR'>('CREATOR');

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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Hero Container */}
      <RetroWindow
        title="EDITBRIDGE WORKSPACE — CREATOR &amp; EDITOR COLLABORATION HUB"
        icon={<Film className="w-4 h-4 text-blue-400" />}
        className="w-full shadow-2xl"
      >
        <div className="space-y-6">
          {/* Main Hero Banner */}
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-900 text-white p-6 sm:p-10 rounded-xl border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>THE DIGITAL WORKSPACE FOR MODERN VIDEO CREATORS &amp; EDITORS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
              One Workspace to Brief, Review &amp; Deliver High-Retention Videos.
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
              Stop scattering instructions across WhatsApp, Drive links, and messy notes. EditBridge brings editor discovery, timestamp video feedback, revision limits, and 30/70 milestone payments into one structured workspace.
            </p>

            {/* Two Action Paths */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-lg">
              <Link
                href="/workspace"
                onClick={() => {
                  retroSound.playDing();
                  switchRole('CREATOR');
                }}
                className="win95-button win95-button-primary w-full py-3 px-5 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
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
                className="win95-button win95-button-amber w-full py-3 px-5 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Enter as Editor (Alex)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hackathon instant demo pill */}
            <div className="mt-5 flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Preloaded Demo Scenario: &ldquo;The Great AI Bubble of 2026&rdquo; Ready</span>
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
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                selectedPath === 'CREATOR'
                  ? 'border-blue-500 bg-slate-900/90 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-xs text-blue-400 flex items-center gap-2 uppercase tracking-wide">
                  <Film className="w-4 h-4" />
                  FOR CONTENT CREATORS
                </span>
                <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-semibold">
                  YOUTUBE &amp; PODCASTS
                </span>
              </div>
              <ul className="mt-3.5 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Frame-Accurate Timestamps:</strong> Click anywhere on draft video to capture exact frame notes (e.g. 00:43 - Replace B-Roll).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Revision Scope Boundaries:</strong> Prevent endless rounds with clear pre-agreed limits (e.g. 2 revision rounds).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Bring Your Editor:</strong> One-click invite link to onboard your trusted editor into the platform without switching talent.</span>
                </li>
              </ul>
              <div className="mt-5 pt-3 border-t border-slate-800">
                <Link
                  href="/projects/new"
                  onClick={() => switchRole('CREATOR')}
                  className="win95-button win95-button-primary w-full py-2 text-xs font-semibold text-center block"
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
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                selectedPath === 'EDITOR'
                  ? 'border-amber-500 bg-slate-900/90 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-xs text-amber-400 flex items-center gap-2 uppercase tracking-wide">
                  <Film className="w-4 h-4" />
                  FOR VIDEO EDITORS
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-semibold">
                  FREELANCE &amp; STUDIOS
                </span>
              </div>
              <ul className="mt-3.5 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Milestone Escrow Protection:</strong> 30% upfront deposit funded before editing starts to secure your time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Master File Access Lock:</strong> Client receives watermarked review proxy; uncompressed 4K master unlocks only upon final 70% payment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Structured Feedback Checklist:</strong> No vague &ldquo;make it punchier&rdquo; WhatsApp voice notes. Every note is pinned to a timecode.</span>
                </li>
              </ul>
              <div className="mt-5 pt-3 border-t border-slate-800">
                <Link
                  href="/editors"
                  onClick={() => switchRole('EDITOR')}
                  className="win95-button win95-button-amber w-full py-2 text-xs font-semibold text-center block text-white"
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
        icon={<Layers className="w-4 h-4 text-emerald-400" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Step 1 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 bg-blue-600 text-white font-bold text-xs rounded-full flex items-center justify-center mb-2.5">
                01
              </div>
              <h3 className="font-bold text-xs text-white mb-1">
                Discover or Invite
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Filter editors by niche, software, and retention score, or send a direct link to bring your current editor.
              </p>
            </div>
            <div className="mt-3.5 pt-2 border-t border-slate-800 text-[10px] text-blue-400 font-semibold">
              Directory / Direct URL
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 bg-blue-600 text-white font-bold text-xs rounded-full flex items-center justify-center mb-2.5">
                02
              </div>
              <h3 className="font-bold text-xs text-white mb-1">
                Structured Brief
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Define duration, 16:9/9:16 aspect ratio, captions, style references, and set strict revision limits.
              </p>
            </div>
            <div className="mt-3.5 pt-2 border-t border-slate-800 text-[10px] text-blue-400 font-semibold">
              Scope &amp; Deliverables
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 bg-blue-600 text-white font-bold text-xs rounded-full flex items-center justify-center mb-2.5">
                03
              </div>
              <h3 className="font-bold text-xs text-white mb-1">
                30% Upfront Kickoff
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Client funds Milestone 1 deposit in protected escrow. Editor downloads raw footage and begins cut.
              </p>
            </div>
            <div className="mt-3.5 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-semibold">
              Escrow Protection
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 bg-blue-600 text-white font-bold text-xs rounded-full flex items-center justify-center mb-2.5">
                04
              </div>
              <h3 className="font-bold text-xs text-white mb-1">
                Timestamp Feedback
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Client plays draft proxy and drops pinned timecode notes. Editor checks off items: Pending → In Progress → Resolved.
              </p>
            </div>
            <div className="mt-3.5 pt-2 border-t border-slate-800 text-[10px] text-amber-400 font-semibold">
              Synced Video Player
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 bg-blue-600 text-white font-bold text-xs rounded-full flex items-center justify-center mb-2.5">
                05
              </div>
              <h3 className="font-bold text-xs text-white mb-1">
                Final Payout &amp; Master
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Final master uploaded. Client releases remaining 70% milestone, unlocking verified uncompressed 4K download!
              </p>
            </div>
            <div className="mt-3.5 pt-2 border-t border-slate-800 text-[10px] text-purple-400 font-semibold">
              Master Unlock &amp; Review
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Editor Showcase Preview */}
      <RetroWindow
        title="FEATURED VERIFIED VIDEO EDITORS"
        icon={<Users className="w-4 h-4 text-cyan-400" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-300">
              Showing top vetted editors specializing in high-retention creator workflows:
            </span>
            <Link
              href="/editors"
              onClick={() => retroSound.playClick()}
              className="win95-button win95-button-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1"
            >
              <span>View Full Directory ({editors.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {editors.map((editor) => (
              <div
                key={editor.user_id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editor.portfolio_items[0]?.thumbnail_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=150'}
                      alt={editor.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">
                        {editor.name}
                      </h4>
                      <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                        ★ {editor.rating} ({editor.reviews_count} reviews)
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {editor.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 line-clamp-2">
                    {editor.headline}
                  </p>

                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {editor.niches.slice(0, 2).map((n) => (
                      <span
                        key={n}
                        className="bg-slate-800 border border-slate-700 text-[10px] px-1.5 py-0.5 rounded text-slate-300"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 font-mono">
                    {editor.price_range}
                  </span>
                  <Link
                    href={`/editors/${editor.user_id}`}
                    onClick={() => retroSound.playClick()}
                    className="win95-button px-2.5 py-1 text-xs font-semibold"
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
            icon={<HelpCircle className="w-4 h-4 text-amber-400" />}
          >
            <div className="space-y-2.5">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        retroSound.playClick();
                        setActiveFaq(isOpen ? null : index);
                      }}
                      className="w-full p-3.5 text-left font-semibold text-xs text-white flex items-center justify-between hover:bg-slate-800/60 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-sm font-bold text-slate-400 ml-2">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-2.5">
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
            icon={<Monitor className="w-4 h-4 text-emerald-400" />}
          >
            <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-2.5 text-slate-300">
              <div className="border-b border-slate-800 pb-2 text-emerald-400 font-semibold">
                [PLATFORM INTEGRITY STATUS]
              </div>
              <div className="flex justify-between">
                <span>ACTIVE CLIENTS:</span>
                <span className="text-white font-mono font-semibold">1,420</span>
              </div>
              <div className="flex justify-between">
                <span>VETTED EDITORS:</span>
                <span className="text-white font-mono font-semibold">385</span>
              </div>
              <div className="flex justify-between">
                <span>ESCROW VALUE HELD:</span>
                <span className="text-white font-mono font-semibold">$148,500</span>
              </div>
              <div className="flex justify-between">
                <span>AVG TURNAROUND:</span>
                <span className="text-white font-mono font-semibold">48 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>DISPUTE RATE:</span>
                <span className="text-emerald-400 font-mono font-semibold">&lt;0.4%</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
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
                className="win95-button win95-button-primary w-full py-2.5 text-xs font-semibold text-center block"
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
