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
    return <div className="text-xs text-neutral-600 font-mono">No active project.</div>;
  }

  const filteredComments = activeProjectComments.filter((c) => {
    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  const totalCount = activeProjectComments.length;
  const resolvedCount = activeProjectComments.filter((c) => c.status === 'RESOLVED').length;
  const progressPercent = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  const handleStatusChange = (commentId: string, currentStatus: RevisionCommentStatus) => {
    let nextStatus: RevisionCommentStatus = 'PENDING';
    if (currentStatus === 'PENDING') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'RESOLVED';
    else if (currentStatus === 'RESOLVED') nextStatus = 'PENDING';

    updateCommentStatus(commentId, nextStatus);

    // If all comments are resolved and we're editor, suggest submitting Final Master
    if (nextStatus === 'RESOLVED' && resolvedCount + 1 === totalCount && activeRole === 'EDITOR') {
      retroSound.playDing();
    }
  };

  const getCategoryBadge = (cat: CommentCategory) => {
    switch (cat) {
      case 'B_ROLL':
        return <span className="bg-amber-100 text-amber-900 border border-amber-400 px-1.5 py-0.2 text-[10px] font-mono">B-Roll</span>;
      case 'AUDIO':
        return <span className="bg-cyan-100 text-cyan-900 border border-cyan-400 px-1.5 py-0.2 text-[10px] font-mono">Audio</span>;
      case 'PACING':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-400 px-1.5 py-0.2 text-[10px] font-mono">Pacing</span>;
      case 'TEXT_GRAPHICS':
        return <span className="bg-purple-100 text-purple-900 border border-purple-400 px-1.5 py-0.2 text-[10px] font-mono">Text/GFX</span>;
      case 'COLOR':
        return <span className="bg-pink-100 text-pink-900 border border-pink-400 px-1.5 py-0.2 text-[10px] font-mono">Color</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-800 border border-neutral-300 px-1.5 py-0.2 text-[10px] font-mono">General</span>;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Revision Scope Card */}
      <div className="win95-sunken p-2.5 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-neutral-400">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#000080]" />
            <span className="font-bold text-xs font-mono text-neutral-900">
              REVISION TRACKING: ROUND {activeProject.revisions_used} OF {activeProject.revision_limit}
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 mt-0.5">
            Agreed scope in brief: {activeProject.revision_limit} included revision rounds.
          </p>
        </div>

        {/* Progress meter */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <div className="flex-1 bg-neutral-200 border border-neutral-400 h-3 overflow-hidden">
            <div
              className="bg-[#008080] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-neutral-800">
            {resolvedCount}/{totalCount} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Filter and control strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-neutral-600 text-[11px]">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="win95-sunken px-1.5 py-0.5 text-[11px] text-neutral-800 bg-white"
          >
            <option value="ALL">All Statuses ({totalCount})</option>
            <option value="PENDING">Pending Only</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved Only</option>
          </select>
        </div>

        <span className="text-[11px] text-neutral-500">
          Click timestamp pill to jump video player
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {filteredComments.length === 0 ? (
          <div className="win95-sunken p-6 text-center text-xs text-neutral-500 font-mono">
            No timestamp revision comments matching current filter.
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isResolved = comment.status === 'RESOLVED';
            const isInProgress = comment.status === 'IN_PROGRESS';

            return (
              <div
                key={comment.id}
                className={`win95-window p-2.5 flex flex-col gap-2 transition-all ${
                  isResolved ? 'opacity-70 bg-[#d8d8d8]' : 'bg-[#c0c0c0]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Timestamp & category */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        retroSound.playClick();
                        onSeekToTimestamp(comment.timestamp_seconds);
                      }}
                      className="win95-button win95-button-primary px-2 py-0.5 text-xs font-mono font-bold flex items-center gap-1 hover:brightness-110"
                      title="Jump video to this timecode"
                    >
                      <PlayCircle className="w-3 h-3 text-yellow-300" />
                      <span>{comment.formatted_time}</span>
                    </button>

                    {getCategoryBadge(comment.category)}

                    <span className="text-[10px] text-neutral-600 font-mono">
                      by {comment.created_by_name} ({comment.created_by_role})
                    </span>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleStatusChange(comment.id, comment.status)}
                    className={`win95-button px-2 py-0.5 text-xs font-mono font-bold flex items-center gap-1 ${
                      isResolved
                        ? 'bg-green-700 text-white'
                        : isInProgress
                        ? 'bg-blue-700 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                    title="Click to advance status: Pending -> In Progress -> Resolved"
                  >
                    {isResolved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>RESOLVED</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>IN PROGRESS</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>PENDING</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Comment body */}
                <div className="win95-sunken p-2 bg-white text-xs text-neutral-900 font-sans leading-relaxed">
                  <p className={isResolved ? 'line-through text-neutral-500' : ''}>
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
        <div className="win95-window p-2.5 bg-neutral-100 flex items-center justify-between gap-2 border-t border-neutral-400">
          <div className="text-xs text-neutral-700 font-mono">
            <strong>Editor Workflow:</strong> Mark all items resolved, then prepare Final Render.
          </div>
          <button
            onClick={() => {
              updateProjectStatus(activeProject.id, 'FINAL_RENDER');
            }}
            className="win95-button win95-button-amber px-3 py-1 text-xs font-bold font-mono"
          >
            Mark Ready for Final Master
          </button>
        </div>
      )}
    </div>
  );
}
