'use client';

import React from 'react';
import { BookOpen, Sparkles, ChevronUp, ChevronDown, Edit3 } from 'lucide-react';
import { Project, UserRole } from '@/types';

interface ClientDirectivesDrawerProps {
  project: Project;
  creatorProfile: any;
  activeRole: UserRole;
  isOpen: boolean;
  onToggle: () => void;
  onOpenBriefTab: () => void;
  onOpenBriefEditor: () => void;
}

export function ClientDirectivesDrawer({
  project,
  creatorProfile,
  activeRole,
  isOpen,
  onToggle,
  onOpenBriefTab,
  onOpenBriefEditor,
}: ClientDirectivesDrawerProps) {
  return (
    <div className="glass-panel bg-white/90 dark:bg-[#0e1526]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all font-sans">
      <div
        className="flex items-center justify-between gap-3 cursor-pointer select-none"
        onClick={onToggle}
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
                {creatorProfile?.channel_name || project.creator_channel || 'Channel Brief'}
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
              onOpenBriefEditor();
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
              onOpenBriefTab();
            }}
            className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline hidden sm:inline cursor-pointer"
          >
            Full Brief →
          </button>
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            title={isOpen ? 'Collapse rules' : 'Expand rules'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5 animate-in fade-in duration-200">
          {/* Creator Pacing & Editing Rules Box */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Client Pacing &amp; Aesthetic Directives from {project.creator_name}:
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
                {project.deliverables?.aspect_ratio || '16:9'} • {project.deliverables?.target_duration_minutes || 10}m
              </strong>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Master Delivery</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {project.deliverables?.resolution || '4K (3840x2160)'}
              </strong>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Revision Scope</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {project.revisions_used ?? 0} of {project.revision_limit ?? 2} Rounds Used
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
