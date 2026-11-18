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

const CATEGORIES: { label: string; value: CommentCategory; color: string }[] = [
  { label: 'B-Roll & Visuals', value: 'B_ROLL', color: '#f59e0b' },
  { label: 'Audio / Music', value: 'AUDIO', color: '#06b6d4' },
  { label: 'Pacing & Cuts', value: 'PACING', color: '#10b981' },
  { label: 'Text & Graphics', value: 'TEXT_GRAPHICS', color: '#ec4899' },
  { label: 'Color / Lighting', value: 'COLOR', color: '#a855f7' },
  { label: 'General Feedback', value: 'GENERAL', color: '#94a3b8' },
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
    <div className="flex flex-col gap-3">
      {/* Video Display Container */}
      <div className="relative overflow-hidden bg-black rounded-lg border border-slate-700/80 shadow-md flex flex-col items-center justify-center">
        {/* Top Watermark / Status Header */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
          <span className="bg-black/80 backdrop-blur-xs text-amber-300 font-mono text-[11px] px-2.5 py-1 rounded border border-amber-500/40 font-semibold shadow-xs">
            DRAFT V1 PREVIEW • TIME-SYNCED
          </span>
          <span className="bg-black/80 backdrop-blur-xs text-emerald-400 font-mono text-[11px] px-2.5 py-1 rounded border border-emerald-500/40 font-semibold shadow-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-h-[380px] object-contain bg-black cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          playsInline
        />

        {/* Video Scrubber with Marker Pins */}
        <div className="w-full px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex flex-col gap-1.5">
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
                    className="absolute -top-1 w-3 h-4 -translate-x-1/2 cursor-pointer pointer-events-auto bg-amber-400 hover:bg-amber-300 border border-slate-950 rounded-xs shadow-md hover:scale-125 transition-transform"
                  />
                );
              })}
            </div>

            {/* Native Slider */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleScrubberChange}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
            />
          </div>

          {/* Player controls strip */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="win95-button px-3 py-1 flex items-center gap-1.5 font-bold"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => seekRelative(-5)}
                className="win95-button px-2 py-1 text-[11px]"
                title="Rewind 5 seconds"
              >
                -5s
              </button>

              <button
                onClick={() => seekRelative(5)}
                className="win95-button px-2 py-1 text-[11px]"
                title="Forward 5 seconds"
              >
                +5s
              </button>

              <button
                onClick={toggleMute}
                className="win95-button px-2 py-1"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <span className="text-emerald-400 font-bold ml-1">
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
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    playbackRate === rate
                      ? 'bg-blue-600 text-white font-bold'
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
      <div className="win95-window p-4 border border-slate-700/80 bg-slate-900/90 rounded-lg">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-xs text-slate-200">
              Add Revision Note at Timecode:
            </span>
            <span className="px-2 py-0.5 bg-blue-600/30 text-blue-300 font-mono font-bold text-xs rounded border border-blue-500/40">
              {formatTime(currentTime)}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Pins directly to video timeline
          </span>
        </div>

        {/* Category Pill Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-xs text-slate-400 mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                retroSound.playClick();
                setActiveCategory(cat.value);
              }}
              className={`px-2.5 py-1 text-xs rounded-md flex items-center gap-1.5 font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/80'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Input & Submit */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`e.g., "${formatTime(currentTime)} - Replace B-roll with chart animation from Google Drive"`}
            className="win95-sunken flex-1 px-3 py-2 text-xs font-sans text-slate-100 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="win95-button win95-button-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Drop Note</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-400 mt-2">
          💡 Click along the video scrubber or pause anywhere to capture a frame note.
        </p>
      </div>
    </div>
  );
}
