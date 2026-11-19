'use client';

import React from 'react';
import { FileText, Edit3, Youtube, Sparkles } from 'lucide-react';
import { Project } from '@/types';
import { RetroWindow } from '@/components/RetroWindow';

interface WorkspaceBriefTabProps {
  project: Project;
  creatorProfile: any;
  onOpenBriefEditor: () => void;
}

export function WorkspaceBriefTab({
  project,
  creatorProfile,
  onOpenBriefEditor,
}: WorkspaceBriefTabProps) {
  return (
    <RetroWindow
      title="PROJECT SPECIFICATION & CREATOR BRIEF"
      icon={<FileText className="w-4 h-4 text-blue-500" />}
      bodyClassName="p-4 sm:p-5 overflow-visible font-sans"
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
            onClick={onOpenBriefEditor}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0 active:scale-95 self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{project.brief ? 'Edit / Update Creative Brief' : 'Add Creative Brief'}</span>
          </button>
        </div>

        {/* Creator Profile & Channel Details */}
        <div className="p-4 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={
                project.creator_avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={project.creator_name || 'Creator'}
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/40 shrink-0"
            />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {project.creator_name || 'Content Creator'}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {creatorProfile?.channel_name || project.creator_channel || 'Channel'}
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
              onClick={onOpenBriefEditor}
              className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
            {project.brief ||
              'No detailed brief narrative provided yet. Click "Edit / Update Creative Brief" above to set narrative directives.'}
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
              <strong className="text-slate-900 dark:text-white text-xs">
                {project.deliverables?.aspect_ratio || '16:9'}
              </strong>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Target Duration:</span>
              <strong className="text-slate-900 dark:text-white text-xs">
                {project.deliverables?.target_duration_minutes || 10} minutes
              </strong>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Master Resolution:</span>
              <strong className="text-slate-900 dark:text-white text-xs">
                {project.deliverables?.resolution || '4K (3840x2160)'}
              </strong>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Captions:</span>
              <strong className="text-slate-900 dark:text-white text-xs">
                {project.deliverables?.captions_included ? 'Included (SRT + Burned)' : 'No'}
              </strong>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Sound Design:</span>
              <strong className="text-slate-900 dark:text-white text-xs">
                {project.deliverables?.sound_design ? 'Full Foley & Riser Mix' : 'Basic'}
              </strong>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Color Grading:</span>
              <strong className="text-slate-900 dark:text-white text-xs">
                {project.deliverables?.color_grading ? 'Custom Film Emulation' : 'Standard'}
              </strong>
            </div>
          </div>
        </div>

        {/* Raw Footage Links */}
        {project.raw_footage_links && project.raw_footage_links.length > 0 && (
          <div>
            <h4 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-2">
              Raw Footage Cloud Links:
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-blue-600 dark:text-cyan-400 font-mono text-[11px]">
              {project.raw_footage_links.map((link, idx) => (
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
            {project.references && project.references.length > 0 ? (
              project.references.map((ref, idx) => (
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
            Included Revisions: <strong>{project.revision_limit ?? 2} rounds</strong> (Currently{' '}
            <strong>{project.revisions_used ?? 0}</strong> used). Changes must be documented through
            timestamp pins on the review player. Additional revisions beyond scope require written mutual
            agreement and escrow adjustment.
          </div>
        </div>
      </div>
    </RetroWindow>
  );
}
