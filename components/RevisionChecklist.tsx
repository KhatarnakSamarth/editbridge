'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
  Filter,
  CheckSquare,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { RevisionComment, RevisionCommentStatus, CommentCategory } from '@/types';
import { retroSound } from '@/lib/soundEffects';

interface RevisionChecklistProps {
  onSeekToTimestamp: (seconds: number) => void;
}

export function RevisionChecklist({ onSeekToTimestamp }: RevisionChecklistProps) {
  const {
    activeProject,
    activeProjectComments,
    updateCommentStatus,
    activeRole,
    updateProjectStatus,
  } = useEditBridge();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  if (!activeProject) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 font-mono bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
        No active project selected.
      </div>
    );
  }

  const filteredComments = activeProjectComments.filter((c) => {
    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  const totalCount = activeProjectComments.length;
  const resolvedCount = activeProjectComments.filter((c) => c.status === 'RESOLVED').length;
  const inProgressCount = activeProjectComments.filter((c) => c.status === 'IN_PROGRESS').length;
  const pendingCount = activeProjectComments.filter((c) => c.status === 'PENDING').length;
  const progressPercent = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  const handleStatusChange = (commentId: string, currentStatus: RevisionCommentStatus) => {
    let nextStatus: RevisionCommentStatus = 'PENDING';
    if (currentStatus === 'PENDING') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'RESOLVED';
    else if (currentStatus === 'RESOLVED') nextStatus = 'PENDING';

    updateCommentStatus(commentId, nextStatus);

    if (nextStatus === 'RESOLVED') {
      retroSound.playDing();
    } else {
      retroSound.playClick();
    }
  };

  const getCategoryBadge = (cat: CommentCategory) => {
    switch (cat) {
      case 'B_ROLL':
        return (
          <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            B-Roll
          </span>
        );
      case 'AUDIO':
        return (
          <span className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/25 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Audio
          </span>
        );
      case 'PACING':
        return (
          <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Pacing
          </span>
        );
      case 'TEXT_GRAPHICS':
        return (
          <span className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/25 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Text/GFX
          </span>
        );
      case 'COLOR':
        return (
          <span className="bg-pink-500/10 text-pink-700 dark:text-pink-400 border border-pink-500/25 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Color
          </span>
        );
      default:
        return (
          <span className="bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/25 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            General
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-full overflow-hidden">
      {/* Revision Scope Card */}
      <div className="p-4 bg-white/95 dark:bg-[#0e1526]/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 w-full">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 tracking-wide truncate">
              REVISION ROUND {activeProject.revisions_used} OF {activeProject.revision_limit}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Contract scope: {activeProject.revision_limit} revision rounds included in 30/70 escrow brief.
          </p>
        </div>

        {/* Progress meter */}
        <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[180px] shrink-0">
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-700/80">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(0,245,255,0.3)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
            {resolvedCount}/{totalCount} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Filter and control strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs w-full">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 text-[11px] bg-white dark:bg-[#070b14] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden shrink-0"
            title="Filter by comment status"
          >
            <option value="ALL">All Status ({totalCount})</option>
            <option value="PENDING">Pending ({pendingCount})</option>
            <option value="IN_PROGRESS">In Progress ({inProgressCount})</option>
            <option value="RESOLVED">Resolved ({resolvedCount})</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1 text-[11px] bg-white dark:bg-[#070b14] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden shrink-0"
            title="Filter by revision category"
          >
            <option value="ALL">All Categories</option>
            <option value="B_ROLL">B-Roll &amp; Visuals</option>
            <option value="AUDIO">Audio / Music</option>
            <option value="PACING">Pacing &amp; Cuts</option>
            <option value="TEXT_GRAPHICS">Text &amp; GFX</option>
            <option value="COLOR">Color / Lighting</option>
            <option value="GENERAL">General</option>
          </select>
        </div>

        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
          Click timecode badge to jump playhead
        </span>
      </div>

      {/* Checklist items list */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 w-full scrollbar-thin">
        {filteredComments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono bg-white/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800">
            No revision comments match selected filters.
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isResolved = comment.status === 'RESOLVED';
            const isInProgress = comment.status === 'IN_PROGRESS';

            return (
              <div
                key={comment.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 w-full overflow-hidden hover:shadow-xs ${
                  isResolved
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-emerald-500/25 opacity-75'
                    : isInProgress
                    ? 'bg-white dark:bg-[#0e1526] border-blue-500/40 shadow-xs'
                    : 'bg-white dark:bg-[#0e1526] border-slate-200 dark:border-slate-800 shadow-xs hover:border-cyan-500/40'
                }`}
              >
                {/* Header: Timecode + Category + Author + Status Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 w-full">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        retroSound.playClick();
                        onSeekToTimestamp(comment.timestamp_seconds);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                      title="Jump video to this timecode"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{comment.formatted_time}</span>
                    </button>

                    {getCategoryBadge(comment.category)}

                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      by {comment.created_by_name}
                    </span>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(comment.id, comment.status)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0 ${
                      isResolved
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                        : isInProgress
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700/60 shadow-2xs hover:bg-blue-100 dark:hover:bg-blue-900/50'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-2xs hover:bg-amber-100 dark:hover:bg-amber-900/50'
                    }`}
                    title="Click to toggle status: Pending → In Progress → Resolved"
                  >
                    {isResolved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>RESOLVED</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>IN PROGRESS</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>PENDING</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Comment body */}
                <div className="p-3 bg-slate-50 dark:bg-[#070b14] rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed break-words overflow-hidden">
                  <p className={isResolved ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                    {comment.comment}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Editor action helper */}
      {activeRole === 'EDITOR' && (
        <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <strong>Editor Step:</strong> Once all notes are marked Resolved, prepare Final Render cut.
          </div>
          <button
            type="button"
            onClick={() => {
              retroSound.playDing();
              updateProjectStatus(activeProject.id, 'FINAL_RENDER');
            }}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 text-xs font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto shrink-0 cursor-pointer"
          >
            Mark Ready for Master
          </button>
        </div>
      )}
    </div>
  );
}
