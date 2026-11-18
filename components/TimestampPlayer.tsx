'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Tag,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { CommentCategory } from '@/types';
import { retroSound } from '@/lib/soundEffects';

interface TimestampPlayerProps {
  onSelectTimestamp?: (seconds: number) => void;
  externalSeekSeconds?: number | null;
}

const CATEGORIES: { label: string; value: CommentCategory; color: string; ringColor: string }[] = [
  { label: 'B-Roll & Visuals', value: 'B_ROLL', color: '#f59e0b', ringColor: 'ring-amber-400' },
  { label: 'Audio / Music', value: 'AUDIO', color: '#00f5ff', ringColor: 'ring-cyan-400' },
  { label: 'Pacing & Cuts', value: 'PACING', color: '#10b981', ringColor: 'ring-emerald-400' },
  { label: 'Text & Graphics', value: 'TEXT_GRAPHICS', color: '#f43f5e', ringColor: 'ring-rose-400' },
  { label: 'Color / Lighting', value: 'COLOR', color: '#a855f7', ringColor: 'ring-purple-400' },
  { label: 'General Feedback', value: 'GENERAL', color: '#64748b', ringColor: 'ring-slate-400' },
];

export function TimestampPlayer({ onSelectTimestamp, externalSeekSeconds }: TimestampPlayerProps) {
  const { activeProject, activeProjectComments, addRevisionComment } = useEditBridge();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<CommentCategory>('B_ROLL');
  const [commentText, setCommentText] = useState<string>('');

  // Sync external seek requests (e.g. clicking on a comment from the list)
  useEffect(() => {
    if (externalSeekSeconds !== undefined && externalSeekSeconds !== null && videoRef.current) {
      videoRef.current.currentTime = externalSeekSeconds;
      setCurrentTime(externalSeekSeconds);
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [externalSeekSeconds, isPlaying]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 100);
    }
  };

  const togglePlay = () => {
    retroSound.playClick();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const seekRelative = (delta: number) => {
    retroSound.playClick();
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
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
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Submit comment
  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim() || !activeProject) return;

    addRevisionComment({
      projectId: activeProject.id,
      videoVersion: 'Draft v1',
      timestampSeconds: Math.floor(currentTime),
      comment: commentText.trim(),
      category: activeCategory,
    });

    setCommentText('');
  };

  const videoUrl =
    activeProject?.active_draft_url ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div className="flex flex-col gap-4">
      {/* Video Display Container */}
      <div className="relative overflow-hidden bg-black rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-xl dark:shadow-2xl dark:shadow-cyan-950/20 flex flex-col items-center justify-center">
        {/* Top Watermark / Status Header */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 pointer-events-none">
          <span className="bg-black/80 backdrop-blur-md text-cyan-400 font-mono text-[11px] px-3 py-1 rounded-full border border-cyan-500/40 font-semibold shadow-xs">
            DRAFT V1 • SYNCED TIMELINE
          </span>
          <span className="bg-black/80 backdrop-blur-md text-emerald-400 font-mono text-[11px] px-3 py-1 rounded-full border border-emerald-500/40 font-semibold shadow-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-h-[400px] object-contain bg-black cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          playsInline
        />

        {/* Video Scrubber with Marker Pins */}
        <div className="w-full px-5 py-3.5 bg-slate-900/95 dark:bg-[#080d19]/95 border-t border-slate-800 flex flex-col gap-2">
          <div className="relative w-full flex items-center h-6">
            {/* Scrubber Pin Markers for Revisions */}
            <div className="absolute inset-x-0 h-2 top-2 pointer-events-none z-10">
              {activeProjectComments.map((comment) => {
                const percent = duration > 0 ? (comment.timestamp_seconds / duration) * 100 : 0;
                return (
                  <div
                    key={comment.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        videoRef.current.currentTime = comment.timestamp_seconds;
                        setCurrentTime(comment.timestamp_seconds);
                      }
                      onSelectTimestamp?.(comment.timestamp_seconds);
                    }}
                    title={`[${comment.formatted_time}] ${comment.comment}`}
                    style={{ left: `${Math.min(99, Math.max(1, percent))}%` }}
                    className="absolute -top-1.5 w-3.5 h-5 -translate-x-1/2 cursor-pointer pointer-events-auto bg-amber-400 hover:bg-cyan-400 border border-slate-950 rounded-sm shadow-md hover:scale-125 transition-all"
                  />
                );
              })}
            </div>

            {/* Native Slider with Neon Accent */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleScrubberChange}
              className="w-full h-2 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-hidden"
            />
          </div>

          {/* Player controls strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={togglePlay}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all shadow-sm hover:shadow-cyan-400/20 active:scale-95 text-xs"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => seekRelative(-5)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                title="Rewind 5 seconds"
              >
                -5s
              </button>

              <button
                onClick={() => seekRelative(5)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                title="Forward 5 seconds"
              >
                +5s
              </button>

              <button
                onClick={toggleMute}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-1.5 rounded-lg transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              <span className="text-cyan-400 font-bold text-[11px] sm:text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 hidden sm:inline">SPEED:</span>
              {[1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
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
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Add Revision Note at Timecode:
            </span>
            <span className="px-2.5 py-0.5 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-mono font-bold text-xs rounded-full border border-cyan-300 dark:border-cyan-500/40 shadow-xs">
              {formatTime(currentTime)}
            </span>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Pins directly to video timeline
          </span>
        </div>

        {/* Category Pill Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 font-medium hidden xs:inline">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                retroSound.playClick();
                setActiveCategory(cat.value);
              }}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs rounded-xl flex items-center gap-1.5 font-medium transition-all ${
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
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Drop Note</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-500" />
          <span>Click along the video scrubber or pause anywhere to capture a frame-accurate note.</span>
        </p>
      </div>
    </div>
  );
}
