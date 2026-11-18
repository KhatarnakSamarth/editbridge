'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  FolderOpen,
  MessageSquare,
  CreditCard,
  FileText,
  Video,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  UserPlus,
  Award,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  Lock,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { TimestampPlayer } from '@/components/TimestampPlayer';
import { RevisionChecklist } from '@/components/RevisionChecklist';
import { FileVault } from '@/components/FileVault';
import { ProjectChat } from '@/components/ProjectChat';
import { MilestoneCard } from '@/components/MilestoneCard';
import { LiveReviewModal } from '@/components/LiveReviewModal';
import { InviteEditorModal } from '@/components/InviteEditorModal';
import { ReviewModal } from '@/components/ReviewModal';
import { useEditBridge } from '@/lib/store';
import { ProjectStatus } from '@/types';
import { retroSound } from '@/lib/soundEffects';

type WorkspaceTab = 'REVIEW' | 'FILES' | 'CHAT' | 'MILESTONES' | 'BRIEF';

const LIFECYCLE_STEPS: { status: ProjectStatus; label: string }[] = [
  { status: 'PAID', label: '1. Upfront Paid' },
  { status: 'EDITOR_ASSIGNED', label: '2. Assigned' },
  { status: 'EDITING', label: '3. Editing' },
  { status: 'REVIEW_REQUESTED', label: '4. Draft Review' },
  { status: 'CHANGES_REQUESTED', label: '5. Revisions' },
  { status: 'FINAL_UPLOADED', label: '6. Master Uploaded' },
  { status: 'FINAL_PAYMENT_PENDING', label: '7. Final Payment' },
  { status: 'COMPLETED', label: '8. Completed' },
];

function ProjectWorkspaceContent() {
  const {
    activeProject,
    projects,
    setActiveProjectId,
    updateProjectStatus,
    activeRole,
    releaseFinalMilestone,
    isAuthenticated,
  } = useEditBridge();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('REVIEW');
  const [seekSeconds, setSeekSeconds] = useState<number | null>(null);
  const [isLiveReviewOpen, setIsLiveReviewOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [guestPlaygroundMode, setGuestPlaygroundMode] = useState(false);

  // Authentication Gate: Users must be logged in to access workstation & escrow vaults (unless previewing playground)
  if (!isAuthenticated && !guestPlaygroundMode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-[#0c1222] border border-cyan-500/30 dark:border-cyan-500/20 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Authentication Required
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Sign In to Enter Project Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Video assets, frame-accurate timeline reviews, and 30/70 escrow payment releases are securely restricted to authenticated project members.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">30/70 Escrow</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Upfront deposits held until final master review is approved.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Frame Accuracy</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Pin exact revision notes to video frames and export EDL.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Role Security</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Verified permissions for creators, editors, and ops arbiters.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signin"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
            >
              <span>Sign In with Password</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                retroSound.playDing();
                setGuestPlaygroundMode(true);
              }}
              className="w-full sm:w-auto bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Film className="w-4 h-4 text-cyan-500" />
              <span>Test Interactive Video Playground</span>
            </button>
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!activeProject) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center glass-panel mt-12 bg-white dark:bg-[#0e1526] rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-600 dark:text-slate-300 text-sm">No project currently selected.</p>
        <Link href="/projects" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 mt-4 inline-block font-semibold rounded-xl text-xs transition-all shadow-sm">
          View Projects Directory
        </Link>
      </div>
    );
  }

  const handleTabChange = (tab: WorkspaceTab) => {
    retroSound.playClick();
    setActiveTab(tab);
  };

  const handleSeekFromChecklist = (seconds: number) => {
    setSeekSeconds(seconds);
    setActiveTab('REVIEW');
  };

  // Status badge coloring
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'REVIEW_REQUESTED':
        return <span className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold text-xs animate-pulse">● REVIEW REQUESTED</span>;
      case 'CHANGES_REQUESTED':
        return <span className="bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full font-bold text-xs">● CHANGES REQUESTED</span>;
      case 'FINAL_PAYMENT_PENDING':
        return <span className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full font-bold text-xs animate-pulse">● FINAL PAYMENT DUE</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold text-xs">✓ COMPLETED</span>;
      case 'EDITING':
        return <span className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-bold text-xs">● IN EDITING</span>;
      default:
        return <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-full font-semibold text-xs">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      {/* Guest Interactive Playground Notice */}
      {!isAuthenticated && guestPlaygroundMode && (
        <div className="p-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 text-cyan-900 dark:text-cyan-200">
            <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>
              <strong>Interactive Video Playground Mode:</strong> You are exploring the video monitor, sample cuts, and revision checklist in guest mode.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/signin"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition-all shadow-xs"
            >
              Sign In for Full Escrow Access →
            </Link>
            <button
              onClick={() => setGuestPlaygroundMode(false)}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80 cursor-pointer"
            >
              Exit Demo
            </button>
          </div>
        </div>
      )}

      {/* Top Project Selector & State Banner */}
      <div className="glass-panel p-5 sm:p-6 bg-white/90 dark:bg-[#0e1526]/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-cyan-950/10 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100 dark:border-slate-800/80">
          {/* Project Details */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-mono bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-300 dark:border-cyan-500/30 font-semibold uppercase">
                {activeProject.category}
              </span>
              {getStatusBadge(activeProject.status)}

              {/* Project Switcher Selector */}
              <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="hidden sm:inline font-medium">Switch Project:</span>
                <select
                  value={activeProject.id}
                  onChange={(e) => {
                    retroSound.playClick();
                    setActiveProjectId(e.target.value);
                  }}
                  className="px-3 py-1 text-xs font-semibold bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {activeProject.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
              <span>Client: <strong className="text-slate-900 dark:text-white">{activeProject.creator_name}</strong></span>
              <span>•</span>
              <span>Editor: <strong className="text-slate-900 dark:text-white">{activeProject.editor_name || 'Unassigned'}</strong></span>
              <span>•</span>
              <span>Budget: <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">${activeProject.budget}.00 USD</strong></span>
              <span>•</span>
              <span>Deadline: <strong className="text-slate-900 dark:text-white">{activeProject.deadline}</strong></span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
            {/* Live Review Room Button */}
            <button
              onClick={() => {
                retroSound.playDing();
                setIsLiveReviewOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
              title="Launch synchronized screen & video review session"
            >
              <Video className="w-4 h-4 text-cyan-300" />
              <span>Review Room</span>
            </button>

            {/* Invite Editor */}
            <button
              onClick={() => {
                retroSound.playClick();
                setIsInviteOpen(true);
              }}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Invite Editor</span>
            </button>

            {/* Leave Review (if completed) */}
            {activeProject.status === 'COMPLETED' ? (
              <button
                onClick={() => {
                  retroSound.playClick();
                  setIsReviewModalOpen(true);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <Award className="w-4 h-4 text-white" />
                <span>Rate Project</span>
              </button>
            ) : null}

            {/* Release Milestone 2 Shortcut */}
            {activeProject.status !== 'COMPLETED' && activeRole === 'CREATOR' ? (
              <button
                onClick={() => {
                  releaseFinalMilestone(activeProject.id);
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Release 70% ($420)</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Section 9: State Machine Lifecycle Strip */}
        <div className="pt-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-[760px] text-[11px] font-mono">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const currentIdx = LIFECYCLE_STEPS.findIndex(
                (s) => s.status === activeProject.status
              );
              const isPast = currentIdx >= idx;
              const isCurrent = activeProject.status === step.status;

              return (
                <div
                  key={step.status}
                  className={`flex-1 px-2.5 py-1.5 text-center rounded-xl text-xs transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25 border border-blue-400'
                      : isPast
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      : 'bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border border-slate-100 dark:border-slate-800/80'
                  }`}
                >
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Role Workspace Context Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          {activeRole === 'CREATOR' && (
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 px-3.5 py-1.5 rounded-xl w-full">
              <span className="font-bold">👤 Creator Perspective:</span>
              <span>You hold 30/70 escrow release authority. Review video frames, log feedback markers, and approve final master delivery.</span>
            </div>
          )}
          {activeRole === 'EDITOR' && (
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 px-3.5 py-1.5 rounded-xl w-full">
              <span className="font-bold">🎬 Editor Perspective:</span>
              <span>Check off revision pins in the checklist, upload watermarked draft cuts, and deposit locked master deliverables to trigger the 70% payout.</span>
            </div>
          )}
          {activeRole === 'ADMIN' && (
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-3.5 py-1.5 rounded-xl w-full">
              <span className="font-bold">🛡️ Platform Ops Inspector:</span>
              <span>Monitoring project escrow, revision round limits, and file integrity. For dispute arbitration, visit <Link href="/admin" className="underline font-bold">Admin Ops</Link>.</span>
            </div>
          )}
        </div>
      </div>

      {/* Modern Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto select-none no-scrollbar">
        <button
          onClick={() => handleTabChange('REVIEW')}
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
            activeTab === 'REVIEW'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Review &amp; Timestamps</span>
        </button>

        <button
          onClick={() => handleTabChange('FILES')}
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
            activeTab === 'FILES'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>File &amp; Asset Vault</span>
        </button>

        <button
          onClick={() => handleTabChange('CHAT')}
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
            activeTab === 'CHAT'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Project Messages</span>
        </button>

        <button
          onClick={() => handleTabChange('MILESTONES')}
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
            activeTab === 'MILESTONES'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>30/70 Milestones &amp; Escrow</span>
        </button>

        <button
          onClick={() => handleTabChange('BRIEF')}
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
            activeTab === 'BRIEF'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Brief &amp; Deliverables</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[500px]">
        {/* Tab 1: Video Review & Timestamp Feedback */}
        {activeTab === 'REVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7 Cols: Interactive Video Player */}
            <div className="lg:col-span-7">
              <RetroWindow
                title="VIDEO REVIEW MONITOR — DRAFT V1"
                icon={<Film className="w-4 h-4 text-cyan-500" />}
              >
                <TimestampPlayer
                  externalSeekSeconds={seekSeconds}
                  onSelectTimestamp={(sec) => setSeekSeconds(sec)}
                  showSampleSelector={true}
                />
              </RetroWindow>
            </div>

            {/* Right 5 Cols: Revision Checklist & Scope Tracker */}
            <div className="lg:col-span-5">
              <RetroWindow
                title="REVISION CHECKLIST &amp; SCOPE TRACKER"
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              >
                <RevisionChecklist onSeekToTimestamp={handleSeekFromChecklist} />
              </RetroWindow>
            </div>
          </div>
        )}

        {/* Tab 2: File & Asset Vault */}
        {activeTab === 'FILES' && (
          <RetroWindow
            title="STORAGE MANAGER — RAW FOOTAGE &amp; MASTER VAULT"
            icon={<FolderOpen className="w-4 h-4 text-amber-500" />}
          >
            <FileVault onRequestReleaseMilestone={() => setActiveTab('MILESTONES')} />
          </RetroWindow>
        )}

        {/* Tab 3: Project Chat */}
        {activeTab === 'CHAT' && (
          <RetroWindow
            title="PROJECT COLLABORATION CHANNEL"
            icon={<MessageSquare className="w-4 h-4 text-cyan-500" />}
          >
            <ProjectChat />
          </RetroWindow>
        )}

        {/* Tab 4: Milestones & Settlements */}
        {activeTab === 'MILESTONES' && (
          <RetroWindow
            title="ESCROW &amp; MILESTONE SETTLEMENT TERMINAL"
            icon={<CreditCard className="w-4 h-4 text-emerald-500" />}
          >
            <MilestoneCard />
          </RetroWindow>
        )}

        {/* Tab 5: Brief & Deliverables Specs */}
        {activeTab === 'BRIEF' && (
          <RetroWindow
            title="PROJECT SPECIFICATION BRIEF"
            icon={<FileText className="w-4 h-4 text-blue-500" />}
          >
            <div className="p-6 bg-white dark:bg-[#070b14] rounded-2xl text-xs space-y-5 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <h3 className="font-bold text-sm text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">Project Brief &amp; Narrative Goal</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {activeProject.brief}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-3">
                  Agreed Technical Deliverables:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Aspect Ratio:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">{activeProject.deliverables.aspect_ratio}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Target Duration:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">{activeProject.deliverables.target_duration_minutes} minutes</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Master Resolution:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">{activeProject.deliverables.resolution}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Captions:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">
                      {activeProject.deliverables.captions_included ? 'Included (SRT + Burned)' : 'No'}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Sound Design:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">
                      {activeProject.deliverables.sound_design ? 'Full Foley & Riser Mix' : 'Basic'}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Color Grading:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">
                      {activeProject.deliverables.color_grading ? 'Custom Film Emulation' : 'Standard'}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-2">
                  Style References &amp; Visual Inspiration:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-blue-600 dark:text-cyan-400">
                  {activeProject.references.length > 0 ? (
                    activeProject.references.map((ref, idx) => (
                      <li key={idx}>
                        <a href={ref} target="_blank" rel="noreferrer" className="underline hover:text-cyan-500">
                          {ref}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500">None specified</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-2">
                  Revision Policy Scope:
                </h4>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                  Included Revisions: <strong>{activeProject.revision_limit} rounds</strong>. Changes must be documented through timestamp pins on the review player. Additional revisions beyond scope require written mutual agreement and price adjustment.
                </div>
              </div>
            </div>
          </RetroWindow>
        )}
      </div>

      {/* Modals */}
      <LiveReviewModal
        isOpen={isLiveReviewOpen}
        onClose={() => setIsLiveReviewOpen(false)}
      />

      <InviteEditorModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}

export default function WorkspacePage() {
  return <ProjectWorkspaceContent />;
}
