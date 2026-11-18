'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
  Filter,
  CheckSquare,
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
    return <div className="text-xs text-slate-400 font-mono">No active project.</div>;
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

    if (nextStatus === 'RESOLVED' && resolvedCount + 1 === totalCount && activeRole === 'EDITOR') {
      retroSound.playDing();
    }
  };

  const getCategoryBadge = (cat: CommentCategory) => {
    switch (cat) {
      case 'B_ROLL':
        return <span className="bg-amber-950/60 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded text-[10px] font-medium">B-Roll</span>;
      case 'AUDIO':
        return <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-700/60 px-2 py-0.5 rounded text-[10px] font-medium">Audio</span>;
      case 'PACING':
        return <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded text-[10px] font-medium">Pacing</span>;
      case 'TEXT_GRAPHICS':
        return <span className="bg-purple-950/60 text-purple-300 border border-purple-700/60 px-2 py-0.5 rounded text-[10px] font-medium">Text/GFX</span>;
      case 'COLOR':
        return <span className="bg-pink-950/60 text-pink-300 border border-pink-700/60 px-2 py-0.5 rounded text-[10px] font-medium">Color</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">General</span>;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Revision Scope Card */}
      <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-xs text-slate-200">
              REVISION SCOPE: ROUND {activeProject.revisions_used} OF {activeProject.revision_limit}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Agreed scope: {activeProject.revision_limit} rounds included in brief.
          </p>
        </div>

        {/* Progress meter */}
        <div className="flex items-center gap-2.5 min-w-[180px]">
          <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-slate-200">
            {resolvedCount}/{totalCount} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Filter and control strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 text-xs">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="win95-sunken px-2 py-1 text-xs bg-slate-900 text-slate-200 border-slate-700"
          >
            <option value="ALL">All Notes ({totalCount})</option>
            <option value="PENDING">Pending Only</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved Only</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-400">
          Click timestamp pill to jump video
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {filteredComments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono bg-slate-900/50 rounded-lg border border-slate-800">
            No timestamp revision comments matching current filter.
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isResolved = comment.status === 'RESOLVED';
            const isInProgress = comment.status === 'IN_PROGRESS';

            return (
              <div
                key={comment.id}
                className={`p-3 rounded-lg border transition-all ${
                  isResolved
                    ? 'bg-slate-900/40 border-slate-800 opacity-75'
                    : 'bg-slate-900 border-slate-700/80 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  {/* Timestamp & category */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        retroSound.playClick();
                        onSeekToTimestamp(comment.timestamp_seconds);
                      }}
                      className="px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1 shadow-xs transition-colors"
                      title="Jump video to this timecode"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-amber-300" />
                      <span>{comment.formatted_time}</span>
                    </button>

                    {getCategoryBadge(comment.category)}

                    <span className="text-[11px] text-slate-400">
                      by {comment.created_by_name}
                    </span>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleStatusChange(comment.id, comment.status)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      isResolved
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/60'
                        : isInProgress
                        ? 'bg-blue-950/70 text-blue-300 border border-blue-700/60 hover:bg-blue-900/60'
                        : 'bg-amber-950/70 text-amber-300 border border-amber-700/60 hover:bg-amber-900/60'
                    }`}
                    title="Click to toggle: Pending -> In Progress -> Resolved"
                  >
                    {isResolved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>RESOLVED</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>IN PROGRESS</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>PENDING</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Comment body */}
                <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed">
                  <p className={isResolved ? 'line-through text-slate-400' : ''}>
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
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            <strong>Editor Action:</strong> Once all items are resolved, prepare Final Render.
          </div>
          <button
            onClick={() => {
              updateProjectStatus(activeProject.id, 'FINAL_RENDER');
            }}
            className="win95-button win95-button-amber px-3 py-1.5 text-xs font-semibold"
          >
            Mark Ready for Master
          </button>
        </div>
      )}
    </div>
  );
}
