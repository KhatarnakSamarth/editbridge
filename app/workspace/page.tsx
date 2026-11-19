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
  Sparkles,
  UserPlus,
  Share2,
  Link2,
  Award,
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
import { WorkspaceAuthGate } from '@/components/workspace/WorkspaceAuthGate';
import { ClientDirectivesDrawer } from '@/components/workspace/ClientDirectivesDrawer';
import { WorkspaceBriefTab } from '@/components/workspace/WorkspaceBriefTab';
import { EditBriefModal } from '@/components/workspace/EditBriefModal';
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
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(true);
  const [isEditingBrief, setIsEditingBrief] = useState(false);

  // Creator profile info lookup
  const creatorProfile = activeProject
    ? INITIAL_CREATORS.find((c) => c.user_id === activeProject.creator_id) || INITIAL_CREATORS[0]
    : INITIAL_CREATORS[0];

  // Authentication Gate: Users must be authenticated to enter project workspace
  if (!isAuthenticated) {
    return <WorkspaceAuthGate />;
  }

  if (!activeProject) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center glass-panel mt-12 bg-white dark:bg-[#0e1526] rounded-2xl border border-slate-200 dark:border-slate-800 font-sans">
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

  const handleSaveBrief = (data: Parameters<typeof updateProjectBrief>[1]) => {
    updateProjectBrief(activeProject.id, data);
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
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
                <span>Release 70%</span>
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
            {/* Creator Requirements & Style Rules Drawer */}
            <ClientDirectivesDrawer
              project={activeProject}
              creatorProfile={creatorProfile}
              activeRole={activeRole}
              isOpen={isRequirementsOpen}
              onToggle={() => setIsRequirementsOpen(!isRequirementsOpen)}
              onOpenBriefTab={() => setActiveTab('BRIEF')}
              onOpenBriefEditor={() => setIsEditingBrief(true)}
            />

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
          <WorkspaceBriefTab
            project={activeProject}
            creatorProfile={creatorProfile}
            onOpenBriefEditor={() => setIsEditingBrief(true)}
          />
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

      <EditBriefModal
        isOpen={isEditingBrief}
        onClose={() => setIsEditingBrief(false)}
        project={activeProject}
        onSave={handleSaveBrief}
      />
    </div>
  );
}

export default function WorkspacePage() {
  return <ProjectWorkspaceContent />;
}
