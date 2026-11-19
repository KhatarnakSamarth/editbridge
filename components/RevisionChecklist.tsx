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
      <div className="p-8 text-center text-xs text-vice-muted font-mono bg-[#170B29]/90 rounded-2xl border border-pink-500/20">
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
          <span className="bg-[#FFD166]/15 text-[#FFD166] border border-[#FFD166]/30 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            B-Roll
          </span>
        );
      case 'AUDIO':
        return (
          <span className="bg-[#FF2E93]/15 text-[#FF2E93] border border-[#FF2E93]/30 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Audio
          </span>
        );
      case 'PACING':
        return (
          <span className="bg-[#00F5A0]/15 text-[#00F5A0] border border-[#00F5A0]/30 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Pacing
          </span>
        );
      case 'TEXT_GRAPHICS':
        return (
          <span className="bg-[#FF7B54]/15 text-[#FF7B54] border border-[#FF7B54]/30 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Text/GFX
          </span>
        );
      case 'COLOR':
        return (
          <span className="bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            Color
          </span>
        );
      default:
        return (
          <span className="bg-pink-300/10 text-vice-muted border border-pink-500/20 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
            General
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-full overflow-hidden">
      {/* Revision Scope Card */}
      <div className="p-4 bg-[#170B29]/95 border border-pink-500/20 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 w-full">
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
          <div className="flex-1 bg-[#211038] rounded-full h-2.5 overflow-hidden border border-pink-500/20">
            <div
              className="bg-vice-gradient h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(255,46,147,0.4)]"
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
            className="px-2.5 py-1 text-[11px] bg-[#211038] text-vice-text border border-pink-500/30 rounded-xl focus:border-vice-pink focus:outline-hidden shrink-0"
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
            className="px-2.5 py-1 text-[11px] bg-[#211038] text-vice-text border border-pink-500/30 rounded-xl focus:border-vice-pink focus:outline-hidden shrink-0"
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
          <div className="p-8 text-center text-xs text-vice-muted font-mono bg-[#170B29]/60 rounded-2xl border border-pink-500/20">
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
                    ? 'bg-[#170B29]/60 border-emerald-500/30 opacity-75'
                    : isInProgress
                    ? 'bg-[#211038] border-pink-500/40 shadow-xs shadow-pink-500/10'
                    : 'bg-[#170B29] border-pink-500/20 shadow-xs hover:border-pink-500/40'
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
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-2xs hover:bg-emerald-900/50'
                        : isInProgress
                        ? 'bg-pink-950/60 text-pink-300 border border-pink-500/40 shadow-2xs hover:bg-pink-900/50'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-500/40 shadow-2xs hover:bg-amber-900/50'
                    }`}
                    title="Click to toggle status: Pending → In Progress → Resolved"
                  >
                    {isResolved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>RESOLVED</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span>IN PROGRESS</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>PENDING</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Comment body */}
                <div className="p-3 bg-[#0D0618] rounded-xl border border-pink-500/20 text-xs text-vice-text font-sans leading-relaxed break-words overflow-hidden">
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
        <div className="p-3.5 bg-[#211038] border border-vice-gold/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="text-xs text-vice-gold">
            <strong>Editor Step:</strong> Once all notes are marked Resolved, prepare Final Render cut.
          </div>
          <button
            type="button"
            onClick={() => {
              retroSound.playDing();
              updateProjectStatus(activeProject.id, 'FINAL_RENDER');
            }}
            className="bg-vice-gradient hover:opacity-95 text-white px-4 py-1.5 text-xs font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto shrink-0 cursor-pointer"
          >
            Mark Ready for Master
          </button>
        </div>
      )}
    </div>
  );
}
