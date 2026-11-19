'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  X,
  PhoneOff,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';
import { Portal } from '@/components/Portal';

interface LiveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveReviewModal({ isOpen, onClose }: LiveReviewModalProps) {
  const { activeProject } = useEditBridge();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !activeProject) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="glass-panel max-w-4xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col bg-[#170B29] border border-pink-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/10 my-auto">
          {/* Titlebar */}
          <div className="px-4 sm:px-5 py-3 bg-[#0D0618] border-b border-pink-500/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Video className="w-4 h-4 text-vice-mint shrink-0" />
              <span className="font-mono font-bold text-xs text-white truncate">
                LIVE REVIEW ROOM [WEBRTC] — {activeProject.title}
              </span>
            </div>
            <button
              onClick={() => {
                retroSound.playClick();
                onClose();
              }}
              className="w-7 h-7 rounded-lg bg-[#211038] hover:bg-[#2c174a] text-vice-muted hover:text-white border border-pink-500/25 text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title="Close modal"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Main Room Viewport (Scrollable if vertically constrained) */}
          <div className="flex-1 min-h-0 bg-black p-3 flex flex-col md:flex-row gap-3 overflow-y-auto">
            {/* Left/Main: Shared Screen / Video Timeline */}
            <div className="flex-1 flex flex-col bg-[#170B29] border border-pink-500/20 rounded-xl relative overflow-hidden min-h-[220px] sm:min-h-[280px]">
              <div className="bg-[#0D0618] px-3 py-1.5 text-[11px] font-mono text-vice-muted flex items-center justify-between border-b border-pink-500/20 shrink-0">
                <span className="flex items-center gap-1.5 text-vice-gold truncate">
                  <ScreenShare className="w-3.5 h-3.5 text-vice-gold shrink-0" />
                  <span>{activeProject.editor_name || 'Alex Rivera'}&apos;s Screen (DaVinci Resolve)</span>
                </span>
                <span className="bg-vice-pink text-white px-2 py-0.5 text-[9px] font-bold rounded animate-pulse shrink-0 ml-2">
                  LIVE 60FPS
                </span>
              </div>

              {/* Screen Content Preview */}
              <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden min-h-[200px]">
                {activeProject.active_draft_url ? (
                  <video
                    src={activeProject.active_draft_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-vice-dim gap-2 p-6 text-center">
                    <Video className="w-8 h-8 text-vice-dim" />
                    <span className="text-xs font-mono">No active video draft uploaded yet.</span>
                  </div>
                )}

                {/* Watermark badge */}
                <div className="absolute bottom-2.5 left-2.5 bg-black/85 backdrop-blur-xs px-2 py-1 text-[10px] font-mono text-vice-mint border border-vice-mint/40 rounded">
                  Synchronized Review Feed • Low Latency &lt;45ms
                </div>
              </div>
            </div>

            {/* Right: Participant Video Feeds */}
            <div className="w-full md:w-52 flex flex-row md:flex-col gap-2 shrink-0">
              {/* Participant 1: Creator */}
              <div className="flex-1 bg-[#211038] border border-pink-500/20 rounded-xl p-2.5 relative flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-mono text-vice-muted">
                  <span className="truncate">{activeProject.creator_name} (Client)</span>
                  <span className="w-2 h-2 rounded-full bg-vice-mint shrink-0 ml-1"></span>
                </div>
                <div className="flex-1 flex items-center justify-center my-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-vice-pink overflow-hidden bg-[#0D0618]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeProject.creator_avatar}
                      alt={activeProject.creator_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-[9px] font-mono text-center text-vice-dim">
                  Audio: Active
                </div>
              </div>

              {/* Participant 2: Editor */}
              <div className="flex-1 bg-[#211038] border border-pink-500/20 rounded-xl p-2.5 relative flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-mono text-vice-muted">
                  <span className="truncate">{activeProject.editor_name || 'Editor'}</span>
                  <span className="w-2 h-2 rounded-full bg-vice-mint shrink-0 ml-1"></span>
                </div>
                <div className="flex-1 flex items-center justify-center my-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-vice-coral overflow-hidden bg-[#0D0618]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeProject.editor_avatar}
                      alt={activeProject.editor_name || 'Editor'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-[9px] font-mono text-center text-vice-mint">
                  Presenting Timeline
                </div>
              </div>
            </div>
          </div>

          {/* Call Action Controls */}
          <div className="p-3 bg-[#0D0618] border-t border-pink-500/20 flex items-center justify-between flex-wrap gap-2 shrink-0">
            <div className="text-[11px] font-mono text-vice-dim hidden sm:block truncate">
              Room Code: <strong className="text-vice-gold">EB-ROOM-{activeProject.id.slice(-6).toUpperCase()}</strong>
            </div>

            <div className="flex items-center gap-2 mx-auto sm:mx-0 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  retroSound.playClick();
                  setMicOn(!micOn);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                  micOn ? 'bg-[#211038] border-pink-500/25 text-white hover:bg-[#2c174a]' : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                }`}
              >
                {micOn ? <Mic className="w-3.5 h-3.5 text-white" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                <span>{micOn ? 'Mute' : 'Unmuted'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  retroSound.playClick();
                  setCameraOn(!cameraOn);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                  cameraOn ? 'bg-[#211038] border-pink-500/25 text-white hover:bg-[#2c174a]' : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                }`}
              >
                {cameraOn ? <Video className="w-3.5 h-3.5 text-white" /> : <VideoOff className="w-3.5 h-3.5 text-rose-400" />}
                <span>{cameraOn ? 'Cam On' : 'Cam Off'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  retroSound.playClick();
                  setIsSharingScreen(!isSharingScreen);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                  isSharingScreen ? 'bg-vice-gradient text-white border-pink-500/40 shadow-sm shadow-pink-500/20' : 'bg-[#211038] border-pink-500/25 text-white hover:bg-[#2c174a]'
                }`}
              >
                <ScreenShare className="w-3.5 h-3.5" />
                <span>{isSharingScreen ? 'Sharing' : 'Share'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  retroSound.playClick();
                  onClose();
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Leave</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
