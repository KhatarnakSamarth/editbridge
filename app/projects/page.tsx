'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  FolderPlus,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { ProjectStatus } from '@/types';
import { retroSound } from '@/lib/soundEffects';

export default function ProjectsDashboardPage() {
  const { projects, setActiveProjectId } = useEditBridge();
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
        return <span className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold text-[11px] animate-pulse">● REVIEW REQUESTED</span>;
      case 'CHANGES_REQUESTED':
        return <span className="bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full font-bold text-[11px]">● CHANGES REQUESTED</span>;
      case 'FINAL_PAYMENT_PENDING':
        return <span className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold text-[11px] animate-pulse">● FINAL PAYMENT DUE</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold text-[11px]">✓ COMPLETED</span>;
      case 'EDITING':
        return <span className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold text-[11px]">● IN EDITING</span>;
      default:
        return <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-sans">
      <RetroWindow
        title="COLLABORATION PROJECT DIRECTORY"
        icon={<FolderKanban className="w-4 h-4 text-cyan-500" />}
      >
        <div className="space-y-6">
          {/* Header Strip with New Project button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                ACTIVE PRODUCTION PROJECTS
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage briefs, review drafts, milestone escrow, and final deliverables.
              </p>
            </div>

            <Link
              href="/projects/new"
              onClick={() => retroSound.playDing()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 self-start sm:self-center shadow-sm transition-all"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Project Brief</span>
            </Link>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mr-1 font-medium">
              <Filter className="w-3.5 h-3.5" /> Filter:
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Project Cards List */}
          <div className="space-y-4">
            {filteredProjects.map((project) => {
              const ms1 = project.milestones[0];
              const ms2 = project.milestones[1];
              const isHeroDemo = project.id === 'proj-demo-1';

              return (
                <div
                  key={project.id}
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isHeroDemo
                      ? 'border-cyan-400 dark:border-cyan-500/80 bg-white dark:bg-[#0e1526] shadow-lg shadow-cyan-500/10'
                      : 'bg-white dark:bg-[#0e1526] border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/40'
                  }`}
                >
                  {/* Left Column: Title & Meta */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-300 dark:border-cyan-500/30 font-semibold uppercase">
                        {project.category}
                      </span>
                      {getStatusBadge(project.status)}
                      {isHeroDemo && (
                        <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-2.5 py-0.5 text-[10px] rounded-full font-bold">
                          ★ HACKATHON HERO DEMO
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-sans">
                      {project.brief}
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span>Client: <strong className="text-slate-800 dark:text-slate-200">{project.creator_name}</strong></span>
                      <span>•</span>
                      <span>Editor: <strong className="text-slate-800 dark:text-slate-200">{project.editor_name || 'Unassigned'}</strong></span>
                      <span>•</span>
                      <span>Budget: <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">${project.budget} USD</strong></span>
                      <span>•</span>
                      <span>Due: <strong className="text-slate-800 dark:text-slate-200">{project.deadline}</strong></span>
                    </div>
                  </div>

                  {/* Right Column: Escrow & CTA */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-right">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">MILESTONE ESCROW:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
                        30% [${ms1?.amount}] + 70% [${ms2?.amount}]
                      </span>
                    </div>

                    <Link
                      href="/workspace"
                      onClick={() => {
                        retroSound.playDing();
                        setActiveProjectId(project.id);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
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
