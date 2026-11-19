'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Send,
  Sparkles,
  Film,
  FastForward,
  Rewind,
  CheckCircle2,
  Sliders,
  Upload,
  FolderPlus,
  FileVideo,
  Lock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { CommentCategory, ProjectFile } from '@/types';
import { retroSound } from '@/lib/soundEffects';

interface TimestampPlayerProps {
  onSelectTimestamp?: (seconds: number) => void;
  externalSeekSeconds?: number | null;
  initialVideoUrl?: string;
  showSampleSelector?: boolean;
}

export interface ProjectVideoCut {
  id: string;
  label: string;
  tag: string;
  url: string;
  aspect: string;
  fileName?: string;
  fileSize?: string;
  isCustom?: boolean;
  isLocked?: boolean;
}

const CATEGORIES: { label: string; value: CommentCategory; color: string; ringColor: string }[] = [
  { label: 'B-Roll & Visuals', value: 'B_ROLL', color: '#f59e0b', ringColor: 'ring-amber-400' },
  { label: 'Audio / Music', value: 'AUDIO', color: '#00f5ff', ringColor: 'ring-cyan-400' },
  { label: 'Pacing & Cuts', value: 'PACING', color: '#10b981', ringColor: 'ring-emerald-400' },
  { label: 'Text & Graphics', value: 'TEXT_GRAPHICS', color: '#f43f5e', ringColor: 'ring-rose-400' },
  { label: 'Color / Lighting', value: 'COLOR', color: '#a855f7', ringColor: 'ring-purple-400' },
  { label: 'General Feedback', value: 'GENERAL', color: '#64748b', ringColor: 'ring-slate-400' },
];

export function TimestampPlayer({
  onSelectTimestamp,
  externalSeekSeconds,
  initialVideoUrl,
  showSampleSelector = true,
}: TimestampPlayerProps) {
  const {
    activeProject,
    activeProjectFiles,
    activeProjectComments,
    addRevisionComment,
    addProjectFile,
    currentUser,
    activeRole,
  } = useEditBridge();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Derive Project-Specific Video Cuts: ONLY genuine videos belonging to THIS active project!
  const projectCuts = useMemo<ProjectVideoCut[]>(() => {
    if (!activeProject) return [];

    const cuts: ProjectVideoCut[] = [];
    const isVertical =
      activeProject.category === 'Shorts / Reels' ||
      activeProject.deliverables?.aspect_ratio === '9:16';
    const aspect = isVertical ? '9/16' : '16/9';

    // 1. Primary active draft video of THIS project (saved in DB on Project table)
    if (activeProject.active_draft_url && !activeProject.active_draft_url.startsWith('blob:')) {
      cuts.push({
        id: `primary-draft-${activeProject.id}`,
        label: `${activeProject.title.length > 20 ? activeProject.title.slice(0, 18) + '...' : activeProject.title} (Draft)`,
        tag: isVertical ? 'Vertical 9:16' : 'Active Draft',
        url: activeProject.active_draft_url,
        aspect,
      });
    }

    // 2. Video files stored in PostgreSQL database for THIS specific project
    const videoFiles = activeProjectFiles.filter(
      (f) =>
        f.file_type === 'DRAFT_VIDEO' ||
        f.file_type === 'FINAL_MASTER' ||
        (f.file_type === 'RAW_FOOTAGE' &&
          f.url &&
          (f.url.endsWith('.mp4') || f.url.endsWith('.mov') || f.url.endsWith('.webm')))
    );

    videoFiles.forEach((file) => {
      // Don't duplicate if URL is already in cuts or is invalid
      if (
        file.url &&
        file.url !== '#' &&
        !file.url.startsWith('blob:') &&
        !cuts.some((c) => c.url === file.url)
      ) {
        cuts.push({
          id: file.id,
          label: file.file_name,
          tag: file.file_type === 'FINAL_MASTER' ? 'Master Delivery' : file.version || 'Draft Cut',
          url: file.url,
          aspect,
          fileName: file.file_name,
          fileSize: file.formatted_size,
          isLocked: file.is_locked,
        });
      }
    });

    // NOTE: Zero fallback to sample videos! If no videos are uploaded, projectCuts remains empty.
    return cuts;
  }, [activeProject, activeProjectFiles]);

  // Active cut & player state
  const defaultCutUrl = initialVideoUrl || activeProject?.active_draft_url || projectCuts[0]?.url || '';
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>(defaultCutUrl);
  const [selectedCutId, setSelectedCutId] = useState<string>(projectCuts[0]?.id || '');
  const [activeFileName, setActiveFileName] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<CommentCategory>('B_ROLL');
  const [commentText, setCommentText] = useState<string>('');
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // When activeProject or project cuts change: switch cleanly to project's draft or reset
  useEffect(() => {
    if (!activeProject) return;

    const projectTargetUrl = activeProject.active_draft_url || projectCuts[0]?.url || '';
    setActiveVideoUrl(projectTargetUrl);
    setSelectedCutId(projectCuts[0]?.id || '');
    setActiveFileName(null);
    setCurrentTime(0);
    setIsPlaying(false);
    setDuration(0);
    setHasError(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (projectTargetUrl) {
        videoRef.current.load();
      }
    }
  }, [activeProject?.id, activeProject?.active_draft_url, projectCuts]);

  // Sync external seek requests (e.g. clicking on a comment from checklist)
  useEffect(() => {
    if (externalSeekSeconds !== undefined && externalSeekSeconds !== null && videoRef.current) {
      videoRef.current.currentTime = externalSeekSeconds;
      setCurrentTime(externalSeekSeconds);
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [externalSeekSeconds]);

  // Spacebar play/pause listener (guarded against inputs, textareas, modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tagName = target.tagName;
      if (
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        target.isContentEditable ||
        target.closest('[role="dialog"]') ||
        target.closest('.modal-content')
      ) {
        return;
      }

      e.preventDefault();
      togglePlay();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Video event handlers: strict event-driven state sync
  const handleTimeUpdate = () => {
    if (videoRef.current && !isScrubbing) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
        setDuration(dur);
      } else {
        setDuration(0);
      }
      // Re-apply preserved playback rate and mute preferences
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.muted = isMuted;
      setHasError(false);
    }
  };

  const handleVideoError = () => {
    setHasError(true);
    setIsPlaying(false);
  };

  const togglePlay = useCallback(() => {
    retroSound.playClick();
    if (!videoRef.current || !activeVideoUrl) return;

    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [activeVideoUrl]);

  const seekTo = (seconds: number) => {
    retroSound.playClick();
    if (!videoRef.current) return;
    const effectiveDur = duration > 0 ? duration : videoRef.current.duration || 0;
    const clamped = Math.max(0, Math.min(effectiveDur, seconds));
    videoRef.current.currentTime = clamped;
    setCurrentTime(clamped);
    onSelectTimestamp?.(clamped);
  };

  const seekRelative = (delta: number) => {
    retroSound.playClick();
    if (!videoRef.current) return;
    const effectiveDur = duration > 0 ? duration : videoRef.current.duration || 0;
    const newTime = Math.max(0, Math.min(effectiveDur, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    onSelectTimestamp?.(newTime);
  };

  const stepFrame = (delta: number) => {
    seekRelative(delta);
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (!isScrubbing && videoRef.current) {
      videoRef.current.currentTime = val;
      onSelectTimestamp?.(val);
    }
  };

  const handleSpeedChange = (speed: number) => {
    retroSound.playClick();
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    retroSound.playClick();
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const switchSampleCut = (cut: ProjectVideoCut) => {
    retroSound.playClick();
    setSelectedCutId(cut.id);
    setActiveVideoUrl(cut.url);
    setActiveFileName(cut.fileName || null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
    }
  };

  // Upload Video directly from Timeline Player to Supabase Storage & PostgreSQL
  const handlePlayerVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProject) return;

    setIsUploadingVideo(true);
    retroSound.playDing();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', activeProject.id);
      formData.append('fileType', 'DRAFT_VIDEO');
      formData.append('version', 'Draft Cut');
      formData.append('uploaderId', currentUser?.id || 'user-creator-1');
      formData.append('uploaderName', currentUser?.name || 'Creator');

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Video upload failed');
      }

      // Add to store (which updates activeDraftUrl and activeProjectFiles)
      addProjectFile(data.data);
      setActiveVideoUrl(data.data.url);
      setActiveFileName(file.name);
      setSelectedCutId(data.data.id);
      setCurrentTime(0);
      setIsPlaying(false);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.load();
      }

      retroSound.playDing();
    } catch (err: any) {
      console.error('Player upload error:', err);
      alert(err?.message || 'Failed to upload video to cloud storage.');
    } finally {
      setIsUploadingVideo(false);
      e.target.value = '';
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs) || secs < 0) return '00:00';
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Submit comment tied to project ID
  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim() || !activeProject) return;

    const versionName = activeFileName
      ? `Cut (${activeFileName.slice(0, 15)})`
      : 'Draft Cut';

    addRevisionComment({
      projectId: activeProject.id,
      videoVersion: versionName,
      timestampSeconds: Math.floor(currentTime),
      comment: commentText.trim(),
      category: activeCategory,
    });

    setCommentText('');
    retroSound.playDing();
  };

  const isCurrentCutVertical =
    selectedCutId.includes('short') ||
    activeProject?.category === 'Shorts / Reels' ||
    activeProject?.deliverables?.aspect_ratio === '9:16';

  const hasNoVideo = !activeVideoUrl || activeVideoUrl === '' || projectCuts.length === 0;

  return (
    <div className="flex flex-col gap-4 w-full max-w-full">
      {/* Project-Specific Video Cuts Bar */}
      {showSampleSelector && (
        <div className="p-3 bg-slate-100/90 dark:bg-[#070b14]/90 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-xs">
          <div className="flex items-center gap-2 shrink-0">
            <Film className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Project Cuts ({projectCuts.length}):
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-none">
            {projectCuts.map((cut) => {
              const isSelected = selectedCutId === cut.id;
              return (
                <button
                  key={cut.id}
                  type="button"
                  onClick={() => switchSampleCut(cut)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xs font-bold'
                      : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80'
                  }`}
                  title={`Switch to ${cut.label}`}
                >
                  {cut.isLocked ? (
                    <Lock className="w-3 h-3 text-rose-400" />
                  ) : (
                    <FileVideo className="w-3 h-3 text-cyan-300" />
                  )}
                  <span className="truncate max-w-[150px]">{cut.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected
                        ? 'bg-black/30 text-white'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cut.tag}
                  </span>
                </button>
              );
            })}

            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/m4v,video/*"
              onChange={handlePlayerVideoUpload}
              className="hidden"
            />

            {/* Upload Video Button: Directly persists to Supabase Storage & PostgreSQL */}
            <button
              type="button"
              disabled={isUploadingVideo}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs transition-all shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Upload video to Supabase Storage and sync with PostgreSQL"
            >
              {isUploadingVideo ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Upload Video</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Video Monitor Display */}
      <div className="relative overflow-hidden bg-black rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-xl dark:shadow-2xl dark:shadow-cyan-950/20 flex flex-col items-center justify-center">
        {/* Top Watermark / Status Header */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-black/80 backdrop-blur-md text-cyan-400 font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full border border-cyan-500/40 font-semibold shadow-xs">
              {hasNoVideo
                ? 'TIMELINE IDLE'
                : activeFileName
                ? `PROJECT FILE: ${activeFileName.length > 25 ? activeFileName.slice(0, 23) + '...' : activeFileName}`
                : isCurrentCutVertical
                ? 'VERTICAL 9:16 • SYNCED'
                : '1080P PRORES • SYNCED'}
            </span>
            <span className="bg-black/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full border border-emerald-500/40 font-semibold shadow-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <span className="bg-black/80 backdrop-blur-md text-amber-400 font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full border border-amber-500/40 font-semibold shadow-xs hidden sm:inline">
            30/70 ESCROW PROTECTED
          </span>
        </div>

        {/* Video Element OR Clean Empty State */}
        <div className="relative w-full flex items-center justify-center bg-black min-h-[260px] sm:min-h-[360px] max-h-[460px]">
          {hasNoVideo ? (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
                <FileVideo className="w-8 h-8 opacity-80" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  No video uploaded yet
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload a project video from the Files tab or player button to start frame-accurate timeline reviews.
                </p>
              </div>

              <button
                type="button"
                disabled={isUploadingVideo}
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                {isUploadingVideo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Video...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Video Now</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={activeVideoUrl}
                className={`w-full max-h-[440px] object-contain bg-black cursor-pointer ${
                  isCurrentCutVertical ? 'max-w-[280px] sm:max-w-[320px] aspect-[9/16]' : 'aspect-video'
                }`}
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={handleVideoError}
                playsInline
                preload="metadata"
              />

              {/* Center Play Overlay Indicator (When Paused) */}
              {!isPlaying && !hasError && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-2xl bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/40 cursor-pointer backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 z-10"
                  title="Click or press Space to Play"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Video Scrubber with Revision Pins */}
        <div className="w-full px-4 sm:px-5 py-3.5 bg-slate-900/95 dark:bg-[#080d19]/95 border-t border-slate-800 flex flex-col gap-2.5">
          {/* Active Frame Note Banner (if playhead is near a pin) */}
          {activeProjectComments.some((c) => Math.abs(c.timestamp_seconds - currentTime) < 2.5) && (
            <div className="px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between gap-2 animate-in fade-in duration-200">
              <span className="truncate">
                <strong className="font-mono text-cyan-300">
                  [{activeProjectComments.find((c) => Math.abs(c.timestamp_seconds - currentTime) < 2.5)?.formatted_time}]
                </strong>{' '}
                <span className="text-slate-100">
                  {activeProjectComments.find((c) => Math.abs(c.timestamp_seconds - currentTime) < 2.5)?.comment}
                </span>
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 shrink-0">
                Frame Note
              </span>
            </div>
          )}

          {/* Scrubber Pin Track */}
          <div className="relative w-full flex items-center h-7">
            {/* Scrubber Pin Markers for Revisions */}
            <div className="absolute inset-x-0 h-3 top-2 pointer-events-none z-10">
              {activeProjectComments.map((comment) => {
                const percent = duration > 0 ? (comment.timestamp_seconds / duration) * 100 : 0;
                return (
                  <div
                    key={comment.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      seekTo(comment.timestamp_seconds);
                    }}
                    title={`[${comment.formatted_time}] ${comment.comment}`}
                    style={{ left: `${Math.min(99, Math.max(1, percent))}%` }}
                    className="absolute -top-1.5 w-3.5 h-5 -translate-x-1/2 cursor-pointer pointer-events-auto bg-amber-400 hover:bg-cyan-400 border border-slate-950 rounded-sm shadow-md hover:scale-130 transition-all z-20 group"
                  >
                    {/* Hover tooltip */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 text-white text-[10px] font-sans px-2.5 py-1 rounded-md border border-cyan-500/40 whitespace-nowrap shadow-xl z-30 pointer-events-none max-w-[200px] truncate">
                      <span className="font-mono text-cyan-400 font-bold">[{comment.formatted_time}]</span> {comment.comment}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Range Slider with Anti-fighting Dragging State */}
            <input
              type="range"
              min="0"
              max={duration > 0 ? duration : 100}
              step="0.1"
              value={currentTime}
              disabled={hasNoVideo}
              onPointerDown={() => setIsScrubbing(true)}
              onPointerUp={(e) => {
                setIsScrubbing(false);
                seekTo(parseFloat((e.target as HTMLInputElement).value));
              }}
              onChange={handleScrubberChange}
              className="w-full h-2 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-hidden disabled:opacity-30 disabled:cursor-not-allowed"
            />
          </div>

          {/* Player controls toolbar (Fully Responsive) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-300">
            {/* Left Controls: Play, Skips, Mute, Timecode */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                disabled={hasNoVideo}
                onClick={togglePlay}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all shadow-sm hover:shadow-cyan-400/20 active:scale-95 text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                disabled={hasNoVideo}
                onClick={() => seekRelative(-5)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-40"
                title="Rewind 5s"
              >
                -5s
              </button>

              <button
                disabled={hasNoVideo}
                onClick={() => seekRelative(5)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-40"
                title="Forward 5s"
              >
                +5s
              </button>

              {/* Frame-by-frame buttons */}
              <button
                disabled={hasNoVideo}
                onClick={() => stepFrame(-0.04)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-1.5 py-1.5 rounded-lg text-[10px] transition-colors cursor-pointer hidden xs:inline disabled:opacity-40"
                title="Previous frame (0.04s)"
              >
                -1f
              </button>

              <button
                disabled={hasNoVideo}
                onClick={() => stepFrame(0.04)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-1.5 py-1.5 rounded-lg text-[10px] transition-colors cursor-pointer hidden xs:inline disabled:opacity-40"
                title="Next frame (0.04s)"
              >
                +1f
              </button>

              <button
                disabled={hasNoVideo}
                onClick={toggleMute}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              <span className="text-cyan-400 font-bold text-[11px] sm:text-xs ml-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls: Playback speed */}
            <div className="flex items-center gap-1.5 text-[11px] self-end sm:self-auto">
              <span className="text-slate-400 hidden sm:inline">SPEED:</span>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  disabled={hasNoVideo}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-40 ${
                    playbackRate === rate
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timestamp Feedback Input Box (The Core Coordination Engine) */}
      <div className="glass-panel p-4 sm:p-5 bg-white/90 dark:bg-[#0e1526]/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg transition-colors">
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/80 gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Pin Revision Note at Timecode:
            </span>
            <span className="px-2.5 py-0.5 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-mono font-bold text-xs rounded-full border border-cyan-300 dark:border-cyan-500/40 shadow-xs">
              {formatTime(currentTime)}
            </span>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Pins marker directly to project timeline in PostgreSQL
          </span>
        </div>

        {/* Category Pill Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 font-medium hidden xs:inline">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                retroSound.playClick();
                setActiveCategory(cat.value);
              }}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs rounded-xl flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                activeCategory === cat.value
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/25 scale-102'
                  : 'bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Input & Submit */}
        <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`e.g., "${formatTime(currentTime)} - Replace B-roll with chart animation"`}
            className="flex-1 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Drop Note</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-500 shrink-0" />
          <span>Real-time cross-client sync: Notes and videos uploaded by Creators are immediately reflected for Editors upon login.</span>
        </p>
      </div>
    </div>
  );
}
