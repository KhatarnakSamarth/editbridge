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
    <div className="glass-panel bg-vice-surface border border-vice-border rounded-2xl p-4 sm:p-5 shadow-sm transition-all font-sans">
      <div
        className="flex items-center justify-between gap-3 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded-xl bg-vice-pink/10 border border-vice-pink/20 text-vice-pink flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs text-vice-text">
                {activeRole === 'EDITOR'
                  ? 'CLIENT CREATIVE BRIEF & STYLE GUIDELINES'
                  : 'PROJECT CREATIVE DIRECTIVES & SPECS'}
              </span>
              <span className="text-[10px] bg-vice-pink/10 text-vice-pink border border-vice-pink/20 px-2 py-0.5 rounded-full font-semibold">
                {creatorProfile?.channel_name || project.creator_channel || 'Channel Brief'}
              </span>
            </div>
            <p className="text-[11px] text-vice-muted">
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
            className="text-[11px] font-semibold text-vice-pink hover:text-vice-coral flex items-center gap-1 cursor-pointer"
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
            className="text-[11px] font-semibold text-vice-coral hover:underline hidden sm:inline cursor-pointer"
          >
            Full Brief →
          </button>
          <button
            type="button"
            className="p-1 rounded-lg text-vice-muted hover:text-vice-text cursor-pointer"
            title={isOpen ? 'Collapse rules' : 'Expand rules'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-vice-border space-y-3.5 animate-in fade-in duration-200">
          {/* Creator Pacing & Editing Rules Box */}
          <div className="p-3.5 bg-vice-cardElevated border border-vice-border rounded-xl">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-vice-coral shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-vice-text">
                  Client Pacing &amp; Aesthetic Directives from {project.creator_name}:
                </span>
                <p className="text-xs text-vice-text leading-relaxed font-sans">
                  &ldquo;{creatorProfile?.requirements || 'Fast-paced documentary style, sophisticated kinetic typography, sound effects for every chart pop.'}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
            <div className="p-2.5 bg-vice-cardElevated border border-vice-border rounded-xl">
              <span className="text-vice-muted block text-[10px] uppercase font-mono">Channel Niche</span>
              <strong className="text-vice-text">{creatorProfile?.niche || 'Finance & Tech'}</strong>
            </div>
            <div className="p-2.5 bg-vice-cardElevated border border-vice-border rounded-xl">
              <span className="text-vice-muted block text-[10px] uppercase font-mono">Target Format</span>
              <strong className="text-vice-text">
                {project.deliverables?.aspect_ratio || '16:9'} • {project.deliverables?.target_duration_minutes || 10}m
              </strong>
            </div>
            <div className="p-2.5 bg-vice-cardElevated border border-vice-border rounded-xl">
              <span className="text-vice-muted block text-[10px] uppercase font-mono">Master Delivery</span>
              <strong className="text-vice-text">
                {project.deliverables?.resolution || '4K (3840x2160)'}
              </strong>
            </div>
            <div className="p-2.5 bg-vice-cardElevated border border-vice-border rounded-xl">
              <span className="text-vice-muted block text-[10px] uppercase font-mono">Revision Scope</span>
              <strong className="text-vice-text">
                {project.revisions_used ?? 0} of {project.revision_limit ?? 2} Rounds Used
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
