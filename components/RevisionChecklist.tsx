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
      <div className="p-8 text-center text-xs text-vice-muted font-mono bg-vice-surface rounded-2xl border border-vice-border">
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
          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            B-Roll
          </span>
        );
      case 'AUDIO':
        return (
          <span className="bg-vice-pink/10 text-vice-pink border border-vice-pink/20 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Audio
          </span>
        );
      case 'PACING':
        return (
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Pacing
          </span>
        );
      case 'TEXT_GRAPHICS':
        return (
          <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Text/GFX
          </span>
        );
      case 'COLOR':
        return (
          <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Color
          </span>
        );
      default:
        return (
          <span className="bg-vice-cardElevated text-vice-muted border border-vice-border px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            General
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-full overflow-hidden">
      {/* Revision Scope Card */}
      <div className="p-4 bg-vice-surface border border-vice-border rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 w-full">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-vice-pink shrink-0" />
            <span className="font-bold text-xs text-vice-text tracking-wide truncate">
              REVISION ROUND {activeProject.revisions_used} OF {activeProject.revision_limit}
            </span>
          </div>
          <p className="text-[11px] text-vice-muted mt-1">
            Contract scope: {activeProject.revision_limit} revision rounds included in 30/70 escrow brief.
          </p>
        </div>

        {/* Progress meter */}
        <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[180px] shrink-0">
          <div className="flex-1 bg-vice-cardElevated rounded-full h-2.5 overflow-hidden border border-vice-border">
            <div
              className="bg-vice-gradient h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-vice-gold shrink-0">
            {resolvedCount}/{totalCount} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Filter and control strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs w-full">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <Filter className="w-3.5 h-3.5 text-vice-dim shrink-0" />
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 text-[11px] bg-vice-cardElevated text-vice-text border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden shrink-0"
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
            className="px-2.5 py-1 text-[11px] bg-vice-cardElevated text-vice-text border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden shrink-0"
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

        <span className="text-[10px] text-vice-muted font-medium hidden sm:inline">
          Click timecode badge to jump playhead
        </span>
      </div>

      {/* Checklist items list */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 w-full scrollbar-thin">
        {filteredComments.length === 0 ? (
          <div className="p-8 text-center text-xs text-vice-muted font-mono bg-vice-surface rounded-2xl border border-vice-border">
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
                    ? 'bg-vice-surface/60 border-emerald-500/30 opacity-75'
                    : isInProgress
                    ? 'bg-vice-cardElevated border-vice-pink/50 shadow-xs'
                    : 'bg-vice-surface border-vice-border shadow-xs hover:border-vice-borderHover'
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
                      className="px-2.5 py-1 rounded-lg bg-vice-gradient hover:opacity-95 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                      title="Jump video to this timecode"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-vice-gold shrink-0" />
                      <span>{comment.formatted_time}</span>
                    </button>

                    {getCategoryBadge(comment.category)}

                    <span className="text-[11px] text-vice-muted truncate">
                      by {comment.created_by_name}
                    </span>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(comment.id, comment.status)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0 ${
                      isResolved
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : isInProgress
                        ? 'bg-vice-pink/10 text-vice-pink border border-vice-pink/20 hover:bg-vice-pink/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
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
                        <Clock className="w-3.5 h-3.5 text-vice-pink shrink-0" />
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
                <div className="p-3 bg-vice-cardElevated rounded-xl border border-vice-border text-xs text-vice-text font-sans leading-relaxed break-words overflow-hidden">
                  <p className={isResolved ? 'line-through text-vice-dim' : ''}>
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
        <div className="p-3.5 bg-vice-cardElevated border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="text-xs text-amber-500">
            <strong>Editor Step:</strong> Once all notes are marked Resolved, prepare Final Render cut.
          </div>
          <button
            type="button"
            onClick={() => {
              retroSound.playDing();
              updateProjectStatus(activeProject.id, 'FINAL_RENDER');
            }}
            className="bg-vice-pink hover:bg-vice-pinkHover text-white px-4 py-1.5 text-xs font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto shrink-0 cursor-pointer"
          >
            Mark Ready for Master
          </button>
        </div>
      )}
    </div>
  );
}
