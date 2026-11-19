'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  FolderPlus,
  ArrowRight,
  Filter,
  Lock,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { ProjectStatus } from '@/types';
import { retroSound } from '@/lib/soundEffects';

export default function ProjectsDashboardPage() {
  const { projects = [], setActiveProjectId, isAuthenticated } = useEditBridge();
  const [filter, setFilter] = useState<string>('ALL');

  const filteredProjects = (projects || []).filter((p) => {
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
        return <span className="bg-vice-pink/10 text-vice-pink border border-vice-pink/20 px-2.5 py-0.5 rounded-full font-bold text-[11px]">● REVIEW REQUESTED</span>;
      case 'CHANGES_REQUESTED':
        return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold text-[11px]">● CHANGES REQUESTED</span>;
      case 'FINAL_PAYMENT_PENDING':
        return <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2.5 py-0.5 rounded-full font-bold text-[11px]">● FINAL PAYMENT DUE</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold text-[11px]">✓ COMPLETED</span>;
      case 'EDITING':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold text-[11px]">● IN EDITING</span>;
      default:
        return <span className="bg-vice-cardElevated text-vice-muted border border-vice-border px-2.5 py-0.5 rounded-full font-semibold text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-sans">
      <RetroWindow
        title="COLLABORATION PROJECT DIRECTORY"
        icon={<FolderKanban className="w-4 h-4 text-vice-pink" />}
      >
        <div className="space-y-6">
          {/* Header Strip with New Project button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-vice-border">
            <div>
              <h2 className="font-extrabold text-lg text-vice-text">
                ACTIVE PRODUCTION PROJECTS
              </h2>
              <p className="text-xs text-vice-muted mt-1">
                Manage briefs, review drafts, milestone escrow, and final deliverables.
              </p>
            </div>

            <Link
              href={isAuthenticated ? "/projects/new" : "/signin?redirect=/projects/new"}
              onClick={() => retroSound.playDing()}
              className="bg-vice-pink hover:bg-vice-pinkHover text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 self-start sm:self-center shadow-sm transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Project Brief</span>
            </Link>
          </div>

          {!isAuthenticated && (
            <div className="p-4 bg-vice-surface border border-vice-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-vice-muted">
                <Lock className="w-4 h-4 text-vice-pink shrink-0" />
                <span>You are browsing as <strong>Guest</strong>. Sign in as Creator or Editor to manage private deliverables and release payments.</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/signin"
                  className="px-4 py-1.5 bg-vice-pink hover:bg-vice-pinkHover text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-vice-muted text-xs flex items-center gap-1 mr-1 font-medium">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: 'ALL', label: `All (${(projects || []).length})` },
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filter === f.id
                    ? 'bg-vice-pink text-white shadow-sm font-bold'
                    : 'bg-vice-cardElevated text-vice-muted hover:text-vice-text hover:bg-vice-hover border border-vice-border'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Project Cards List */}
          <div className="space-y-4">
            {filteredProjects.map((project) => {
              const ms1Amount = project.milestones?.[0]?.amount ?? Math.round((project.budget || 500) * 0.3);
              const ms2Amount = project.milestones?.[1]?.amount ?? Math.round((project.budget || 500) * 0.7);
              const isFeatured = project.id === 'proj-demo-1';

              return (
                <div
                  key={project.id}
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isFeatured
                      ? 'border-vice-pink/60 bg-vice-surface shadow-lg'
                      : 'bg-vice-surface border-vice-border shadow-xs hover:border-vice-border/80'
                  }`}
                >
                  {/* Left Column: Title & Meta */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono bg-vice-pink/10 text-vice-pink px-2.5 py-0.5 rounded-full border border-vice-pink/20 font-semibold uppercase">
                        {project.category}
                      </span>
                      {getStatusBadge(project.status)}
                      {isFeatured && (
                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 text-[10px] rounded-full font-bold">
                          ★ FEATURED PRODUCTION
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base text-vice-text truncate">
                      {project.title}
                    </h3>

                    <p className="text-xs text-vice-muted line-clamp-2 leading-relaxed font-sans">
                      {project.brief}
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-xs text-vice-muted flex-wrap">
                      <span>Client: <strong className="text-vice-text">{project.creator_name}</strong></span>
                      <span>•</span>
                      <span>Editor: <strong className="text-vice-text">{project.editor_name || 'Unassigned'}</strong></span>
                      <span>•</span>
                      <span>Budget: <strong className="text-vice-coral font-mono font-bold">${project.budget} USD</strong></span>
                      <span>•</span>
                      <span>Due: <strong className="text-vice-text">{project.deadline}</strong></span>
                    </div>
                  </div>

                  {/* Right Column: Escrow & CTA */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-vice-border">
                    <div className="text-xs text-right">
                      <span className="text-vice-muted block text-[11px] font-medium">MILESTONE ESCROW:</span>
                      <span className="text-amber-500 font-mono font-bold">
                        30% [${ms1Amount}] + 70% [${ms2Amount}]
                      </span>
                    </div>

                    <Link
                      href="/workspace"
                      onClick={() => {
                        retroSound.playDing();
                        setActiveProjectId(project.id);
                      }}
                      className="bg-vice-pink hover:bg-vice-pinkHover text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
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
