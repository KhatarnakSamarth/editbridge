'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Tag,
  Clock,
  Send,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { CommentCategory } from '@/types';
import { retroSound } from '@/lib/soundEffects';

interface TimestampPlayerProps {
  onSelectTimestamp?: (seconds: number) => void;
  externalSeekSeconds?: number | null;
}

const CATEGORIES: { label: string; value: CommentCategory; color: string }[] = [
  { label: 'B-Roll & Visuals', value: 'B_ROLL', color: '#ff9900' },
  { label: 'Audio / Music', value: 'AUDIO', color: '#00ccff' },
  { label: 'Pacing & Cuts', value: 'PACING', color: '#00ff66' },
  { label: 'Text & Graphics', value: 'TEXT_GRAPHICS', color: '#ff00aa' },
  { label: 'Color / Lighting', value: 'COLOR', color: '#aa00ff' },
  { label: 'General Feedback', value: 'GENERAL', color: '#ffffff' },
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
  const [isHoveringScrubber, setIsHoveringScrubber] = useState<boolean>(false);
  const [hoverTime, setHoverTime] = useState<number>(0);

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
      <div className="win95-sunken-dark relative overflow-hidden bg-black flex flex-col items-center justify-center border-2 border-neutral-700">
        {/* Top Watermark / Status Header */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-2 pointer-events-none">
          <span className="bg-black/80 text-yellow-400 font-mono text-[10px] px-2 py-0.5 border border-yellow-500/50">
            DRAFT V1 PREVIEW — TIME-CODE SYNCED
          </span>
          <span className="bg-black/80 text-green-400 font-mono text-[10px] px-2 py-0.5 border border-green-500/50">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-h-[380px] object-contain bg-black"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          playsInline
        />

        {/* Video Scrubber with Marker Pins */}
        <div className="w-full px-3 py-1.5 bg-[#1a1a1a] border-t border-neutral-800 flex flex-col gap-1">
          <div className="relative w-full flex items-center h-5">
            {/* Scrubber Pin Markers for Revisions */}
            <div className="absolute inset-x-0 h-2 top-1.5 pointer-events-none z-10">
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
                    className="absolute -top-1 w-2.5 h-4 -translate-x-1/2 cursor-pointer pointer-events-auto bg-amber-400 border border-black hover:scale-125 transition-transform"
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
              onMouseEnter={() => setIsHoveringScrubber(true)}
              onMouseLeave={() => setIsHoveringScrubber(false)}
              className="w-full h-2 bg-neutral-700 rounded-none accent-[#ff9900] cursor-pointer"
            />
          </div>

          {/* Player controls strip */}
          <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
            <div className="flex items-center gap-1.5">
              <button
                onClick={togglePlay}
                className="win95-button px-2 py-0.5 text-black flex items-center gap-1 font-bold"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => seekRelative(-5)}
                className="win95-button px-1.5 py-0.5 text-black text-[11px]"
                title="Rewind 5 seconds"
              >
                -5s
              </button>

              <button
                onClick={() => seekRelative(5)}
                className="win95-button px-1.5 py-0.5 text-black text-[11px]"
                title="Forward 5 seconds"
              >
                +5s
              </button>

              <button
                onClick={toggleMute}
                className="win95-button px-1.5 py-0.5 text-black"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <span className="text-green-400 font-bold ml-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-neutral-400 hidden sm:inline">SPEED:</span>
              {[1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-1.5 py-0.2 border text-[10px] ${
                    playbackRate === rate
                      ? 'bg-[#000080] text-white border-blue-400 font-bold'
                      : 'bg-[#2a2a2a] text-neutral-300 border-neutral-600 hover:bg-neutral-700'
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
      <div className="win95-window p-3 border-2 border-black">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#000080]" />
            <span className="font-bold text-xs font-mono uppercase text-[#000080]">
              Add Revision Note at Timecode:
            </span>
            <span className="px-2 py-0.5 bg-[#000080] text-yellow-300 font-mono font-bold text-xs border border-blue-400">
              {formatTime(currentTime)}
            </span>
          </div>

          <span className="text-[11px] text-neutral-600 hidden sm:inline">
            Pins directly to video timeline
          </span>
        </div>

        {/* Category Pill Selectors */}
        <div className="flex flex-wrap items-center gap-1 mb-2">
          <span className="text-[11px] font-mono text-neutral-600 mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                retroSound.playClick();
                setActiveCategory(cat.value);
              }}
              className={`win95-button px-2 py-0.5 text-[11px] flex items-center gap-1 font-mono ${
                activeCategory === cat.value
                  ? 'bg-[#000080] text-white border-blue-400 font-bold'
                  : 'text-neutral-800'
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
            className="win95-sunken flex-1 px-2.5 py-1.5 text-xs text-neutral-900 font-sans focus:outline-none"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="win95-button win95-button-primary px-3 py-1 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Drop Note</span>
          </button>
        </form>

        <p className="text-[10px] text-neutral-500 mt-1 font-mono">
          Tip: You can pause anywhere or click along the scrubber to capture an exact frame note.
        </p>
      </div>
    </div>
  );
}
