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
  Share2,
  Link2,
  Award,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  Lock,
  BookOpen,
  ExternalLink,
  Youtube,
  Edit3,
  X,
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
import { Portal } from '@/components/Portal';
import { useEditBridge } from '@/lib/store';
import { ProjectStatus } from '@/types';
import { retroSound } from '@/lib/soundEffects';
import { INITIAL_CREATORS } from '@/lib/mockData';

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
    updateProjectBrief,
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
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(true);

  // Creative brief editing state
  const [isEditingBrief, setIsEditingBrief] = useState(false);
  const [briefFormText, setBriefFormText] = useState('');
  const [briefAspectRatio, setBriefAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [briefTargetDuration, setBriefTargetDuration] = useState(10);
  const [briefResolution, setBriefResolution] = useState('4K (3840x2160)');
  const [briefReferencesText, setBriefReferencesText] = useState('');
  const [briefFootageLinksText, setBriefFootageLinksText] = useState('');
  const [isSavingBrief, setIsSavingBrief] = useState(false);

  const openBriefEditor = () => {
    retroSound.playClick();
    if (activeProject) {
      setBriefFormText(activeProject.brief || '');
      setBriefAspectRatio(activeProject.deliverables?.aspect_ratio === '9:16' ? '9:16' : '16:9');
      setBriefTargetDuration(activeProject.deliverables?.target_duration_minutes || 10);
      setBriefResolution(activeProject.deliverables?.resolution || '4K (3840x2160)');
      setBriefReferencesText((activeProject.references || []).join('\n'));
      setBriefFootageLinksText((activeProject.raw_footage_links || []).join('\n'));
    }
    setIsEditingBrief(true);
  };

  const handleSaveBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    setIsSavingBrief(true);
    const refs = briefReferencesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const footage = briefFootageLinksText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    updateProjectBrief(activeProject.id, {
      brief: briefFormText,
      aspectRatio: briefAspectRatio,
      targetDuration: Number(briefTargetDuration) || 10,
      resolution: briefResolution,
      references: refs,
      rawFootageLinks: footage,
    });

    setIsSavingBrief(false);
    setIsEditingBrief(false);
  };

  // Creator profile info lookup
  const creatorProfile = activeProject
    ? INITIAL_CREATORS.find((c) => c.user_id === activeProject.creator_id) || INITIAL_CREATORS[0]
    : INITIAL_CREATORS[0];

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
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Review Requested (Draft v1)
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Changes Requested
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Project Completed &amp; Escrow Released
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Guest Mode Indicator Banner */}
      {!isAuthenticated && guestPlaygroundMode && (
        <div className="p-3 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300">
            <Film className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>
              <strong>Guest Playground Mode:</strong> You are testing the interactive frame-accurate video review monitor. Sign in to post live escrow contracts.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/signin"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
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
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Launch synchronized screen & video review session"
            >
              <Video className="w-4 h-4 text-cyan-300" />
              <span>Review Room</span>
            </button>

            {/* Role-based Invite / Share Collaboration Button */}
            {activeRole === 'CREATOR' ? (
              <button
                onClick={() => {
                  retroSound.playClick();
                  setIsInviteOpen(true);
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                title="Invite video editor or collaborator"
              >
                <UserPlus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Invite Editor</span>
              </button>
            ) : activeRole === 'EDITOR' ? (
              <button
                onClick={() => {
                  retroSound.playClick();
                  setIsInviteOpen(true);
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                title="Share collaboration invite link with client or reviewer"
              >
                <Share2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Share Collab Link</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  retroSound.playClick();
                  setIsInviteOpen(true);
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                title="Generate workspace access link"
              >
                <Link2 className="w-4 h-4 text-purple-500" />
                <span>Workspace Link</span>
              </button>
            )}

            {/* Leave Review (if completed) */}
            {activeProject.status === 'COMPLETED' ? (
              <button
                onClick={() => {
                  retroSound.playClick();
                  setIsReviewModalOpen(true);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
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
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
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
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="truncate block">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 dark:bg-[#070b14]/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto shadow-inner">
        <button
          onClick={() => handleTabChange('REVIEW')}
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
            activeTab === 'REVIEW'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Interactive Video Monitor</span>
        </button>

        <button
          onClick={() => handleTabChange('FILES')}
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
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
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
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
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
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
          className={`px-3.5 sm:px-4 py-2 text-xs rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
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
          <div className="space-y-4">
            {/* Creator Requirements & Style Rules Drawer (Crucial for Editors) */}
            <div className="glass-panel bg-white/90 dark:bg-[#0e1526]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all">
              <div
                className="flex items-center justify-between gap-3 cursor-pointer select-none"
                onClick={() => setIsRequirementsOpen(!isRequirementsOpen)}
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {activeRole === 'EDITOR'
                          ? 'CLIENT CREATIVE BRIEF & STYLE GUIDELINES'
                          : 'PROJECT CREATIVE DIRECTIVES & SPECS'}
                      </span>
                      <span className="text-[10px] bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 px-2 py-0.5 rounded-full font-semibold">
                        {creatorProfile?.channel_name || activeProject.creator_channel || 'Channel Brief'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Client expectations, pacing rules, and target deliverables for this video cut
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openBriefEditor();
                    }}
                    className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Brief</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('BRIEF');
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline hidden sm:inline cursor-pointer"
                  >
                    Full Brief →
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={isRequirementsOpen ? 'Collapse rules' : 'Expand rules'}
                  >
                    {isRequirementsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isRequirementsOpen && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5 animate-in fade-in duration-200">
                  {/* Creator Pacing & Editing Rules Box */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Client Pacing &amp; Aesthetic Directives from {activeProject.creator_name}:
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                          &ldquo;{creatorProfile?.requirements || 'Fast-paced documentary style, sophisticated kinetic typography, sound effects for every chart pop.'}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                    <div className="p-2.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Channel Niche</span>
                      <strong className="text-slate-800 dark:text-slate-200">{creatorProfile?.niche || 'Finance & Tech'}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Target Format</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {activeProject.deliverables?.aspect_ratio || '16:9'} • {activeProject.deliverables?.target_duration_minutes || 10}m
                      </strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Master Delivery</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {activeProject.deliverables?.resolution || '4K (3840x2160)'}
                      </strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Revision Scope</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {activeProject.revisions_used ?? 0} of {activeProject.revision_limit ?? 2} Rounds Used
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 7 Cols: Interactive Video Player */}
              <div className="lg:col-span-7">
                <RetroWindow
                  title={`VIDEO REVIEW MONITOR — ${activeProject.title.toUpperCase()}`}
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
                  title="FRAME REVISION CHECKLIST"
                  icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  bodyClassName="p-4 sm:p-5 overflow-visible"
                >
                  <RevisionChecklist onSeekToTimestamp={handleSeekFromChecklist} />
                </RetroWindow>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Project File & Master Vault */}
        {activeTab === 'FILES' && (
          <RetroWindow
            title="SECURE ASSET & MASTER DELIVERY VAULT"
            icon={<FolderOpen className="w-4 h-4 text-amber-500" />}
            bodyClassName="p-4 sm:p-5 overflow-visible"
          >
            <FileVault onRequestReleaseMilestone={() => releaseFinalMilestone(activeProject.id)} />
          </RetroWindow>
        )}

        {/* Tab 3: Encrypted Project Chat */}
        {activeTab === 'CHAT' && (
          <RetroWindow
            title="DIRECT PROJECT COMMS & NOTIFICATIONS"
            icon={<MessageSquare className="w-4 h-4 text-cyan-500" />}
            bodyClassName="p-4 sm:p-5 overflow-visible flex flex-col h-[600px]"
          >
            <ProjectChat />
          </RetroWindow>
        )}

        {/* Tab 4: 30/70 Escrow Milestone Ledger */}
        {activeTab === 'MILESTONES' && (
          <RetroWindow
            title="30/70 ESCROW CONTRACT LEDGER & PAYOUTS"
            icon={<CreditCard className="w-4 h-4 text-emerald-500" />}
            bodyClassName="p-4 sm:p-5 overflow-visible"
          >
            <MilestoneCard />
          </RetroWindow>
        )}

        {/* Tab 5: Brief & Comprehensive Deliverables Specs */}
        {activeTab === 'BRIEF' && (
          <RetroWindow
            title="PROJECT SPECIFICATION & CREATOR BRIEF"
            icon={<FileText className="w-4 h-4 text-blue-500" />}
            bodyClassName="p-4 sm:p-5 overflow-visible"
          >
            <div className="p-6 bg-white dark:bg-[#070b14] rounded-2xl text-xs space-y-6 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
              {/* Brief Controls & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Creative Brief &amp; Deliverables Blueprint</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Production specifications, narrative directives, reference cuts, and raw cloud footage repositories.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openBriefEditor}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0 active:scale-95 self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{activeProject.brief ? 'Edit / Update Creative Brief' : 'Add Creative Brief'}</span>
                </button>
              </div>

              {/* Creator Profile & Channel Details */}
              <div className="p-4 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activeProject.creator_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={activeProject.creator_name || 'Creator'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/40 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {activeProject.creator_name || 'Content Creator'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {creatorProfile?.channel_name || activeProject.creator_channel || 'Channel'}
                      </span>
                      <span>•</span>
                      <span>{creatorProfile?.subscribers || '480,000'} Subscribers</span>
                      <span>•</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                        {creatorProfile?.niche || 'Finance & Tech'}
                      </span>
                    </div>
                  </div>
                </div>

                {creatorProfile?.channel_url && (
                  <a
                    href={creatorProfile.channel_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-xl font-bold flex items-center gap-1.5 text-xs hover:bg-rose-100 self-start sm:self-auto shrink-0 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>View Channel</span>
                  </a>
                )}
              </div>

              {/* Creator's Editing Guidelines & Rules */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <h4 className="font-bold text-xs uppercase tracking-wide text-slate-900 dark:text-white">
                    Client Pacing &amp; Aesthetic Directives (Editor Rules):
                  </h4>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans pl-6">
                  &ldquo;{creatorProfile?.requirements || 'Fast-paced documentary style, sophisticated kinetic typography, sound effects for every chart pop.'}&rdquo;
                </p>
                <div className="pl-6 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Cadence: {creatorProfile?.publishing_frequency || '1 Long-form weekly + 3 Shorts'}
                </div>
              </div>

              {/* Narrative Goal */}
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300">
                    Project Narrative Brief &amp; Story Arc:
                  </h4>
                  <button
                    type="button"
                    onClick={openBriefEditor}
                    className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {activeProject.brief || 'No detailed brief narrative provided yet. Click "Edit / Update Creative Brief" above to set narrative directives.'}
                </p>
              </div>

              {/* Deliverables specs */}
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-3">
                  Agreed Technical Deliverables:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Aspect Ratio:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">{activeProject.deliverables?.aspect_ratio || '16:9'}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Target Duration:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">{activeProject.deliverables?.target_duration_minutes || 10} minutes</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Master Resolution:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">{activeProject.deliverables?.resolution || '4K (3840x2160)'}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Captions:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">
                      {activeProject.deliverables?.captions_included ? 'Included (SRT + Burned)' : 'No'}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Sound Design:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">
                      {activeProject.deliverables?.sound_design ? 'Full Foley & Riser Mix' : 'Basic'}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Color Grading:</span>
                    <strong className="text-slate-900 dark:text-white text-xs">
                      {activeProject.deliverables?.color_grading ? 'Custom Film Emulation' : 'Standard'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Raw Footage Links */}
              {activeProject.raw_footage_links && activeProject.raw_footage_links.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-2">
                    Raw Footage Cloud Links:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-blue-600 dark:text-cyan-400 font-mono text-[11px]">
                    {activeProject.raw_footage_links.map((link, idx) => (
                      <li key={idx}>
                        <a href={link} target="_blank" rel="noreferrer" className="underline hover:text-cyan-500">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* References */}
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-2">
                  Style References &amp; Visual Inspiration:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-blue-600 dark:text-cyan-400">
                  {activeProject.references && activeProject.references.length > 0 ? (
                    activeProject.references.map((ref, idx) => (
                      <li key={idx}>
                        <a href={ref} target="_blank" rel="noreferrer" className="underline hover:text-cyan-500">
                          {ref}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 list-none italic">None specified</li>
                  )}
                </ul>
              </div>

              {/* Revision Policy */}
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-2">
                  Revision Policy Scope &amp; Escrow Boundary:
                </h4>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                  Included Revisions: <strong>{activeProject.revision_limit ?? 2} rounds</strong> (Currently <strong>{activeProject.revisions_used ?? 0}</strong> used). Changes must be documented through timestamp pins on the review player. Additional revisions beyond scope require written mutual agreement and escrow adjustment.
                </div>
              </div>
            </div>
          </RetroWindow>
        )}
      </div>

      {/* Modals Mounted via Portal to document.body */}
      <LiveReviewModal
        isOpen={isLiveReviewOpen}
        onClose={() => setIsLiveReviewOpen(false)}
      />

      <InviteEditorModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        role={activeRole}
        project={activeProject}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      {/* Edit / Add Creative Brief Modal Mounted via Portal */}
      {isEditingBrief && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#0c1222] border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Edit / Add Creative Brief
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Directives, story arc, deliverables specs, and raw assets for {activeProject.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingBrief(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBrief} className="space-y-4 text-xs">
                {/* Brief Narrative */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900 dark:text-slate-200 block">
                    Story Arc &amp; Creative Directive
                  </label>
                  <textarea
                    rows={4}
                    value={briefFormText}
                    onChange={(e) => setBriefFormText(e.target.value)}
                    placeholder="Describe the storyline, hook, pacing, tone of voice, visual energy, motion graphics style, and core call to action..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500 font-sans leading-relaxed"
                    required
                  />
                </div>

                {/* Technical Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">Aspect Ratio</label>
                    <select
                      value={briefAspectRatio}
                      onChange={(e) => setBriefAspectRatio(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 focus:border-cyan-500"
                    >
                      <option value="16:9">16:9 (Landscape YouTube)</option>
                      <option value="9:16">9:16 (Vertical Shorts/Reels)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">Target Duration (min)</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={briefTargetDuration}
                      onChange={(e) => setBriefTargetDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">Master Resolution</label>
                    <select
                      value={briefResolution}
                      onChange={(e) => setBriefResolution(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 focus:border-cyan-500"
                    >
                      <option value="4K (3840x2160)">4K (3840x2160)</option>
                      <option value="1080p (1920x1080)">1080p (1920x1080)</option>
                      <option value="1440p (2560x1440)">1440p 2K</option>
                      <option value="8K Master">8K Master</option>
                    </select>
                  </div>
                </div>

                {/* Raw Footage Links */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900 dark:text-slate-200 block">
                    Raw Footage Cloud Links (Google Drive, Dropbox, S3)
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enter one URL per line.
                  </p>
                  <textarea
                    rows={2}
                    value={briefFootageLinksText}
                    onChange={(e) => setBriefFootageLinksText(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/sample-raw-footage&#10;https://storage.editbridge.network/raw/a-cam.mp4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                {/* Style References */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900 dark:text-slate-200 block">
                    Style References &amp; Visual Inspiration Links
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    YouTube or Vimeo links representing desired pacing or graphics (one per line).
                  </p>
                  <textarea
                    rows={2}
                    value={briefReferencesText}
                    onChange={(e) => setBriefReferencesText(e.target.value)}
                    placeholder="https://youtube.com/watch?v=sample-vox-explainer&#10;https://youtube.com/watch?v=sample-visual-pacing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingBrief(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingBrief}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSavingBrief ? 'Saving to Database...' : 'Save & Sync Brief'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

export default function WorkspacePage() {
  return <ProjectWorkspaceContent />;
}
