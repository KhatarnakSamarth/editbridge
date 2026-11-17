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
      <div className="max-w-4xl mx-auto p-6 font-mono text-center win95-window">
        <p>No project selected.</p>
        <Link href="/projects" className="win95-button px-4 py-2 mt-4 inline-block">
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
        return <span className="bg-amber-400 text-black border border-black px-2 py-0.5 font-bold font-mono text-xs animate-pulse">● REVIEW REQUESTED</span>;
      case 'CHANGES_REQUESTED':
        return <span className="bg-orange-500 text-white border border-black px-2 py-0.5 font-bold font-mono text-xs">● CHANGES REQUESTED</span>;
      case 'FINAL_PAYMENT_PENDING':
        return <span className="bg-purple-600 text-white border border-black px-2 py-0.5 font-bold font-mono text-xs animate-pulse">● FINAL PAYMENT PENDING</span>;
      case 'COMPLETED':
        return <span className="bg-green-600 text-white border border-black px-2 py-0.5 font-bold font-mono text-xs">✓ COMPLETED</span>;
      case 'EDITING':
        return <span className="bg-blue-600 text-white border border-black px-2 py-0.5 font-bold font-mono text-xs">● IN EDITING</span>;
      default:
        return <span className="bg-neutral-600 text-white border border-black px-2 py-0.5 font-bold font-mono text-xs">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 md:py-6 space-y-4 font-sans">
      {/* Top Project Selector & State Banner */}
      <div className="win95-window p-3 md:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b-2 border-neutral-400">
          {/* Project Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono bg-[#000080] text-yellow-300 px-1.5 py-0.2 font-bold uppercase">
                {activeProject.category}
              </span>
              {getStatusBadge(activeProject.status)}

              {/* Project Switcher Selector */}
              <div className="inline-flex items-center gap-1 font-mono text-xs">
                <span className="text-neutral-600 hidden sm:inline">Switch Project:</span>
                <select
                  value={activeProject.id}
                  onChange={(e) => {
                    retroSound.playClick();
                    setActiveProjectId(e.target.value);
                  }}
                  className="win95-sunken px-2 py-1 text-xs font-bold text-neutral-900 bg-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h1 className="text-lg sm:text-2xl font-black font-mono tracking-tight text-neutral-900">
              {activeProject.title}
            </h1>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-700 flex-wrap">
              <span>Client: <strong>{activeProject.creator_name}</strong></span>
              <span>•</span>
              <span>Editor: <strong>{activeProject.editor_name || 'Unassigned'}</strong></span>
              <span>•</span>
              <span>Budget: <strong className="text-green-800">${activeProject.budget} USD</strong></span>
              <span>•</span>
              <span>Deadline: <strong>{activeProject.deadline}</strong></span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
            {/* Live Review Room Button */}
            <button
              onClick={() => {
                retroSound.playDing();
                setIsLiveReviewOpen(true);
              }}
              className="win95-button win95-button-primary px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
              title="Launch synchronized screen & video review session"
            >
              <Video className="w-3.5 h-3.5 text-emerald-300" />
              <span>Review Room</span>
            </button>

            {/* Invite Editor */}
            <button
              onClick={() => {
                retroSound.playClick();
                setIsInviteOpen(true);
              }}
              className="win95-button px-2.5 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-neutral-700" />
              <span>Invite Editor</span>
            </button>

            {/* Leave Review (if completed) */}
            {activeProject.status === 'COMPLETED' ? (
              <button
                onClick={() => {
                  retroSound.playClick();
                  setIsReviewModalOpen(true);
                }}
                className="win95-button win95-button-amber px-2.5 py-1.5 text-xs font-mono font-bold flex items-center gap-1 text-white"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Rate Project</span>
              </button>
            ) : null}

            {/* Release Milestone 2 Shortcut */}
            {activeProject.status !== 'COMPLETED' && activeRole === 'CREATOR' ? (
              <button
                onClick={() => {
                  releaseFinalMilestone(activeProject.id);
                }}
                className="win95-button win95-button-amber px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1 text-white shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Release 70% ($420)</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Section 9: State Machine Lifecycle Strip */}
        <div className="pt-2 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-[700px] text-[10px] font-mono">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const currentIdx = LIFECYCLE_STEPS.findIndex(
                (s) => s.status === activeProject.status
              );
              const isPast = currentIdx >= idx;
              const isCurrent = activeProject.status === step.status;

              return (
                <div
                  key={step.status}
                  className={`flex-1 px-1.5 py-1 text-center border ${
                    isCurrent
                      ? 'bg-[#000080] text-yellow-300 border-blue-400 font-bold shadow-xs'
                      : isPast
                      ? 'bg-neutral-200 text-neutral-700 border-neutral-400'
                      : 'bg-neutral-100 text-neutral-400 border-neutral-300'
                  }`}
                >
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Retro Workspace Tabs */}
      <div className="flex items-center gap-1 border-b-2 border-black overflow-x-auto select-none pt-1">
        <button
          onClick={() => handleTabChange('REVIEW')}
          className={`win95-button px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 border-b-0 ${
            activeTab === 'REVIEW'
              ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-r-2 border-black -mb-[2px] z-10 text-[#000080]'
              : 'bg-[#a0a0a0] text-neutral-700 hover:bg-[#b0b0b0]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Review &amp; Timestamps</span>
        </button>

        <button
          onClick={() => handleTabChange('FILES')}
          className={`win95-button px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 border-b-0 ${
            activeTab === 'FILES'
              ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-r-2 border-black -mb-[2px] z-10 text-[#000080]'
              : 'bg-[#a0a0a0] text-neutral-700 hover:bg-[#b0b0b0]'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>File &amp; Asset Vault</span>
        </button>

        <button
          onClick={() => handleTabChange('CHAT')}
          className={`win95-button px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 border-b-0 ${
            activeTab === 'CHAT'
              ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-r-2 border-black -mb-[2px] z-10 text-[#000080]'
              : 'bg-[#a0a0a0] text-neutral-700 hover:bg-[#b0b0b0]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Project Messages</span>
        </button>

        <button
          onClick={() => handleTabChange('MILESTONES')}
          className={`win95-button px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 border-b-0 ${
            activeTab === 'MILESTONES'
              ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-r-2 border-black -mb-[2px] z-10 text-[#000080]'
              : 'bg-[#a0a0a0] text-neutral-700 hover:bg-[#b0b0b0]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>30/70 Milestones &amp; Escrow</span>
        </button>

        <button
          onClick={() => handleTabChange('BRIEF')}
          className={`win95-button px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 border-b-0 ${
            activeTab === 'BRIEF'
              ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-r-2 border-black -mb-[2px] z-10 text-[#000080]'
              : 'bg-[#a0a0a0] text-neutral-700 hover:bg-[#b0b0b0]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Brief &amp; Deliverables</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[500px]">
        {/* Tab 1: Video Review & Timestamp Feedback (THE STAR FEATURE) */}
        {activeTab === 'REVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 7 Cols: Interactive Video Player */}
            <div className="lg:col-span-7">
              <RetroWindow
                title="VIDEO_REVIEW_MONITOR.EXE — DRAFT V1"
                icon={<Film className="w-4 h-4 text-yellow-300" />}
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
                title="REVISION_CHECKLIST.LOG — SCOPE CONTROL"
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
            title="STORAGE_MANAGER.EXE — RAW FOOTAGE & MASTER VAULT"
            icon={<FolderOpen className="w-4 h-4 text-yellow-300" />}
          >
            <FileVault onRequestReleaseMilestone={() => setActiveTab('MILESTONES')} />
          </RetroWindow>
        )}

        {/* Tab 3: Project IRC Chat */}
        {activeTab === 'CHAT' && (
          <RetroWindow
            title="IRC_COLLABORATION_CHANNEL.IRC — #PROJECT-ROOM"
            icon={<MessageSquare className="w-4 h-4 text-cyan-300" />}
          >
            <ProjectChat />
          </RetroWindow>
        )}

        {/* Tab 4: Milestones & Settlements */}
        {activeTab === 'MILESTONES' && (
          <RetroWindow
            title="ESCROW_SETTLEMENT_TERMINAL.EXE"
            icon={<CreditCard className="w-4 h-4 text-yellow-300" />}
          >
            <MilestoneCard />
          </RetroWindow>
        )}

        {/* Tab 5: Brief & Deliverables Specs */}
        {activeTab === 'BRIEF' && (
          <RetroWindow
            title="PROJECT_SPECIFICATION_BRIEF.DOC"
            icon={<FileText className="w-4 h-4 text-yellow-300" />}
          >
            <div className="p-4 bg-white font-mono text-xs space-y-4 text-neutral-900 border border-neutral-400">
              <div className="border-b border-neutral-300 pb-3">
                <h3 className="font-bold text-sm text-[#000080]">PROJECT BRIEF</h3>
                <p className="mt-1 font-sans text-xs text-neutral-700 leading-relaxed">
                  {activeProject.brief}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-neutral-800 mb-2">
                  Agreed Technical Deliverables:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="win95-sunken p-2">
                    <span className="text-neutral-500 block">Aspect Ratio:</span>
                    <strong className="text-neutral-900">{activeProject.deliverables.aspect_ratio}</strong>
                  </div>
                  <div className="win95-sunken p-2">
                    <span className="text-neutral-500 block">Target Duration:</span>
                    <strong className="text-neutral-900">{activeProject.deliverables.target_duration_minutes} minutes</strong>
                  </div>
                  <div className="win95-sunken p-2">
                    <span className="text-neutral-500 block">Master Resolution:</span>
                    <strong className="text-neutral-900">{activeProject.deliverables.resolution}</strong>
                  </div>
                  <div className="win95-sunken p-2">
                    <span className="text-neutral-500 block">Captions:</span>
                    <strong className="text-neutral-900">
                      {activeProject.deliverables.captions_included ? 'Included (SRT + Burned)' : 'No'}
                    </strong>
                  </div>
                  <div className="win95-sunken p-2">
                    <span className="text-neutral-500 block">Sound Design:</span>
                    <strong className="text-neutral-900">
                      {activeProject.deliverables.sound_design ? 'Full Foley & Riser Mix' : 'Basic'}
                    </strong>
                  </div>
                  <div className="win95-sunken p-2">
                    <span className="text-neutral-500 block">Color Grading:</span>
                    <strong className="text-neutral-900">
                      {activeProject.deliverables.color_grading ? 'Custom Film Emulation' : 'Standard'}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-neutral-800 mb-1">
                  Style References &amp; Visual Inspiration:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  {activeProject.references.length > 0 ? (
                    activeProject.references.map((ref, idx) => (
                      <li key={idx}>
                        <a href={ref} target="_blank" rel="noreferrer" className="underline">
                          {ref}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-neutral-500">None specified</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-neutral-800 mb-1">
                  Revision Policy Scope:
                </h4>
                <div className="p-2.5 bg-yellow-50 border border-yellow-400 text-yellow-900 text-xs font-sans">
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
