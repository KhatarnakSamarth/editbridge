'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  FolderPlus,
  Film,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { ProjectStatus } from '@/types';
import { retroSound } from '@/lib/soundEffects';

export default function ProjectsDashboardPage() {
  const { projects, setActiveProjectId, currentUser } = useEditBridge();
  const [filter, setFilter] = useState<string>('ALL');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'ALL') return true;
    if (filter === 'REVIEW_REQUESTED' && p.status === 'REVIEW_REQUESTED') return true;
    if (filter === 'EDITING' && (p.status === 'EDITING' || p.status === 'PAID')) return true;
    if (filter === 'FINAL_PAYMENT_PENDING' && p.status === 'FINAL_PAYMENT_PENDING') return true;
    if (filter === 'COMPLETED' && p.status === 'COMPLETED') return true;
    return false;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'REVIEW_REQUESTED':
        return <span className="bg-amber-400 text-black border border-black px-2 py-0.5 font-bold font-mono text-[11px] animate-pulse">● REVIEW REQUESTED</span>;
      case 'CHANGES_REQUESTED':
        return <span className="bg-orange-500 text-white border border-black px-2 py-0.5 font-bold font-mono text-[11px]">● CHANGES REQUESTED</span>;
      case 'FINAL_PAYMENT_PENDING':
        return <span className="bg-purple-600 text-white border border-black px-2 py-0.5 font-bold font-mono text-[11px] animate-pulse">● FINAL PAYMENT DUE</span>;
      case 'COMPLETED':
        return <span className="bg-green-600 text-white border border-black px-2 py-0.5 font-bold font-mono text-[11px]">✓ COMPLETED</span>;
      case 'EDITING':
        return <span className="bg-blue-600 text-white border border-black px-2 py-0.5 font-bold font-mono text-[11px]">● IN EDITING</span>;
      default:
        return <span className="bg-neutral-600 text-white border border-black px-2 py-0.5 font-bold font-mono text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4 font-sans">
      <RetroWindow
        title="PROJECT_EXPLORER.EXE — COLLABORATION DIRECTORY"
        icon={<FolderKanban className="w-4 h-4 text-yellow-300" />}
      >
        <div className="space-y-4">
          {/* Header Strip with New Project button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-400">
            <div>
              <h2 className="font-bold text-sm sm:text-base font-mono text-neutral-900">
                ACTIVE PRODUCTION PROJECTS
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Manage briefs, review drafts, milestone escrow, and final deliverables.
              </p>
            </div>

            <Link
              href="/projects/new"
              onClick={() => retroSound.playDing()}
              className="win95-button win95-button-primary px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 text-yellow-300 self-start sm:self-center shadow-sm"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Project Brief</span>
            </Link>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <span className="text-neutral-600 text-[11px] flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {[
              { id: 'ALL', label: `All (${projects.length})` },
              { id: 'REVIEW_REQUESTED', label: 'Review Drafts' },
              { id: 'EDITING', label: 'Active In Editing' },
              { id: 'FINAL_PAYMENT_PENDING', label: 'Pending Payout' },
              { id: 'COMPLETED', label: 'Completed' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  retroSound.playClick();
                  setFilter(f.id);
                }}
                className={`win95-button px-2.5 py-0.5 text-[11px] font-bold ${
                  filter === f.id
                    ? 'bg-[#000080] text-white border-blue-400'
                    : 'text-neutral-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Project Cards List */}
          <div className="space-y-3">
            {filteredProjects.map((project) => {
              const ms1 = project.milestones[0];
              const ms2 = project.milestones[1];
              const isHeroDemo = project.id === 'proj-demo-1';

              return (
                <div
                  key={project.id}
                  className={`win95-window p-3 sm:p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-blue-900 ${
                    isHeroDemo ? 'border-2 border-blue-900 bg-blue-50/30' : ''
                  }`}
                >
                  {/* Left Column: Title & Meta */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono bg-[#000080] text-yellow-300 px-1.5 py-0.2 font-bold uppercase">
                        {project.category}
                      </span>
                      {getStatusBadge(project.status)}
                      {isHeroDemo && (
                        <span className="bg-yellow-300 text-black border border-black px-1.5 py-0.2 text-[9px] font-mono font-bold">
                          ★ HACKATHON HERO DEMO
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base font-mono text-neutral-900 truncate">
                      {project.title}
                    </h3>

                    <p className="text-xs text-neutral-600 line-clamp-2 font-sans">
                      {project.brief}
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-xs font-mono text-neutral-600 flex-wrap">
                      <span>Client: <strong className="text-neutral-900">{project.creator_name}</strong></span>
                      <span>•</span>
                      <span>Editor: <strong className="text-neutral-900">{project.editor_name || 'Unassigned'}</strong></span>
                      <span>•</span>
                      <span>Budget: <strong className="text-green-800">${project.budget} USD</strong></span>
                      <span>•</span>
                      <span>Due: <strong>{project.deadline}</strong></span>
                    </div>
                  </div>

                  {/* Right Column: Escrow & CTA */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-200">
                    <div className="font-mono text-xs text-right">
                      <span className="text-neutral-500 block text-[10px]">ESCROW PROTECTION:</span>
                      <span className="text-neutral-900 font-bold">
                        30% [${ms1?.amount}] + 70% [${ms2?.amount}]
                      </span>
                    </div>

                    <Link
                      href="/workspace"
                      onClick={() => {
                        retroSound.playDing();
                        setActiveProjectId(project.id);
                      }}
                      className="win95-button win95-button-primary px-4 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 text-yellow-300 shadow-sm"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
