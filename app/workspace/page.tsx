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
  } = useEditBridge();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('REVIEW');
  const [seekSeconds, setSeekSeconds] = useState<number | null>(null);
  const [isLiveReviewOpen, setIsLiveReviewOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (!activeProject) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center win95-window">
        <p className="text-slate-300">No project selected.</p>
        <Link href="/projects" className="win95-button win95-button-primary px-4 py-2 mt-4 inline-block font-semibold">
          View Projects
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
        return <span className="bg-amber-950/70 text-amber-300 border border-amber-500/60 px-2.5 py-0.5 rounded font-semibold text-xs animate-pulse">● REVIEW REQUESTED</span>;
      case 'CHANGES_REQUESTED':
        return <span className="bg-orange-950/70 text-orange-300 border border-orange-500/60 px-2.5 py-0.5 rounded font-semibold text-xs">● CHANGES REQUESTED</span>;
      case 'FINAL_PAYMENT_PENDING':
        return <span className="bg-purple-950/70 text-purple-300 border border-purple-500/60 px-2.5 py-0.5 rounded font-semibold text-xs animate-pulse">● FINAL PAYMENT DUE</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-500/60 px-2.5 py-0.5 rounded font-semibold text-xs">✓ COMPLETED</span>;
      case 'EDITING':
        return <span className="bg-blue-950/70 text-blue-300 border border-blue-500/60 px-2.5 py-0.5 rounded font-semibold text-xs">● IN EDITING</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded font-semibold text-xs">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 font-sans">
      {/* Top Project Selector & State Banner */}
      <div className="win95-window p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Project Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-semibold uppercase">
                {activeProject.category}
              </span>
              {getStatusBadge(activeProject.status)}

              {/* Project Switcher Selector */}
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <span className="hidden sm:inline">Switch Project:</span>
                <select
                  value={activeProject.id}
                  onChange={(e) => {
                    retroSound.playClick();
                    setActiveProjectId(e.target.value);
                  }}
                  className="win95-sunken px-2.5 py-1 text-xs font-semibold bg-slate-900 text-slate-100"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {activeProject.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
              <span>Client: <strong className="text-white">{activeProject.creator_name}</strong></span>
              <span>•</span>
              <span>Editor: <strong className="text-white">{activeProject.editor_name || 'Unassigned'}</strong></span>
              <span>•</span>
              <span>Budget: <strong className="text-emerald-400 font-mono">${activeProject.budget}.00 USD</strong></span>
              <span>•</span>
              <span>Deadline: <strong className="text-white">{activeProject.deadline}</strong></span>
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
              className="win95-button win95-button-primary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              title="Launch synchronized screen & video review session"
            >
              <Video className="w-4 h-4 text-emerald-300" />
              <span>Review Room</span>
            </button>

            {/* Invite Editor */}
            <button
              onClick={() => {
                retroSound.playClick();
                setIsInviteOpen(true);
              }}
              className="win95-button px-3 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4 text-slate-300" />
              <span>Invite Editor</span>
            </button>

            {/* Leave Review (if completed) */}
            {activeProject.status === 'COMPLETED' ? (
              <button
                onClick={() => {
                  retroSound.playClick();
                  setIsReviewModalOpen(true);
                }}
                className="win95-button win95-button-amber px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Rate Project</span>
              </button>
            ) : null}

            {/* Release Milestone 2 Shortcut */}
            {activeProject.status !== 'COMPLETED' && activeRole === 'CREATOR' ? (
              <button
                onClick={() => {
                  releaseFinalMilestone(activeProject.id);
                }}
                className="win95-button win95-button-amber px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Release 70% ($420)</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Section 9: State Machine Lifecycle Strip */}
        <div className="pt-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-[720px] text-[11px] font-mono">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const currentIdx = LIFECYCLE_STEPS.findIndex(
                (s) => s.status === activeProject.status
              );
              const isPast = currentIdx >= idx;
              const isCurrent = activeProject.status === step.status;

              return (
                <div
                  key={step.status}
                  className={`flex-1 px-2 py-1.5 text-center rounded text-xs transition-colors ${
                    isCurrent
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500 font-bold shadow-xs'
                      : isPast
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-slate-900/40 text-slate-600 border border-slate-800'
                  }`}
                >
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modern Workspace Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto select-none">
        <button
          onClick={() => handleTabChange('REVIEW')}
          className={`px-4 py-2 text-xs rounded-lg font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'REVIEW'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Review &amp; Timestamps</span>
        </button>

        <button
          onClick={() => handleTabChange('FILES')}
          className={`px-4 py-2 text-xs rounded-lg font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'FILES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>File &amp; Asset Vault</span>
        </button>

        <button
          onClick={() => handleTabChange('CHAT')}
          className={`px-4 py-2 text-xs rounded-lg font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'CHAT'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Project Messages</span>
        </button>

        <button
          onClick={() => handleTabChange('MILESTONES')}
          className={`px-4 py-2 text-xs rounded-lg font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'MILESTONES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>30/70 Milestones &amp; Escrow</span>
        </button>

        <button
          onClick={() => handleTabChange('BRIEF')}
          className={`px-4 py-2 text-xs rounded-lg font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'BRIEF'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
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
                icon={<Film className="w-4 h-4 text-blue-400" />}
              >
                <TimestampPlayer
                  externalSeekSeconds={seekSeconds}
                  onSelectTimestamp={(sec) => setSeekSeconds(sec)}
                />
              </RetroWindow>
            </div>

            {/* Right 5 Cols: Revision Checklist & Scope Tracker */}
            <div className="lg:col-span-5">
              <RetroWindow
                title="REVISION CHECKLIST &amp; SCOPE TRACKER"
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
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
            icon={<FolderOpen className="w-4 h-4 text-amber-400" />}
          >
            <FileVault onRequestReleaseMilestone={() => setActiveTab('MILESTONES')} />
          </RetroWindow>
        )}

        {/* Tab 3: Project Chat */}
        {activeTab === 'CHAT' && (
          <RetroWindow
            title="PROJECT COLLABORATION CHANNEL"
            icon={<MessageSquare className="w-4 h-4 text-cyan-400" />}
          >
            <ProjectChat />
          </RetroWindow>
        )}

        {/* Tab 4: Milestones & Settlements */}
        {activeTab === 'MILESTONES' && (
          <RetroWindow
            title="ESCROW &amp; MILESTONE SETTLEMENT TERMINAL"
            icon={<CreditCard className="w-4 h-4 text-emerald-400" />}
          >
            <MilestoneCard />
          </RetroWindow>
        )}

        {/* Tab 5: Brief & Deliverables Specs */}
        {activeTab === 'BRIEF' && (
          <RetroWindow
            title="PROJECT SPECIFICATION BRIEF"
            icon={<FileText className="w-4 h-4 text-blue-400" />}
          >
            <div className="p-5 bg-slate-900 rounded-lg text-xs space-y-5 text-slate-200 border border-slate-800">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-bold text-sm text-blue-400">PROJECT BRIEF &amp; NARRATIVE GOAL</h3>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                  {activeProject.brief}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-xs uppercase text-slate-300 mb-2.5">
                  Agreed Technical Deliverables:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Aspect Ratio:</span>
                    <strong className="text-white text-xs">{activeProject.deliverables.aspect_ratio}</strong>
                  </div>
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Target Duration:</span>
                    <strong className="text-white text-xs">{activeProject.deliverables.target_duration_minutes} minutes</strong>
                  </div>
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Master Resolution:</span>
                    <strong className="text-white text-xs">{activeProject.deliverables.resolution}</strong>
                  </div>
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Captions:</span>
                    <strong className="text-white text-xs">
                      {activeProject.deliverables.captions_included ? 'Included (SRT + Burned)' : 'No'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Sound Design:</span>
                    <strong className="text-white text-xs">
                      {activeProject.deliverables.sound_design ? 'Full Foley & Riser Mix' : 'Basic'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Color Grading:</span>
                    <strong className="text-white text-xs">
                      {activeProject.deliverables.color_grading ? 'Custom Film Emulation' : 'Standard'}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs uppercase text-slate-300 mb-2">
                  Style References &amp; Visual Inspiration:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-blue-400">
                  {activeProject.references.length > 0 ? (
                    activeProject.references.map((ref, idx) => (
                      <li key={idx}>
                        <a href={ref} target="_blank" rel="noreferrer" className="underline hover:text-blue-300">
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
                <h4 className="font-semibold text-xs uppercase text-slate-300 mb-2">
                  Revision Policy Scope:
                </h4>
                <div className="p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-lg text-amber-200 text-xs leading-relaxed">
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
