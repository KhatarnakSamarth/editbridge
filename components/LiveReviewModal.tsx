'use client';

import React, { useState } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  X,
  PhoneOff,
  Users,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

interface LiveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveReviewModal({ isOpen, onClose }: LiveReviewModalProps) {
  const { activeProject, currentUser } = useEditBridge();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(true);

  if (!isOpen || !activeProject) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm">
      <div className="glass-panel max-w-4xl w-full h-[85vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Titlebar */}
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold text-xs text-slate-200">
              LIVE REVIEW ROOM [WEBRTC PROTOTYPE] — {activeProject.title}
            </span>
          </div>
          <button
            onClick={() => {
              retroSound.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center"
            title="Close modal"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Main Room Viewport */}
        <div className="flex-1 bg-black p-3 flex flex-col md:flex-row gap-3 overflow-hidden">
          {/* Left/Main: Shared Screen / Video Timeline */}
          <div className="flex-1 flex flex-col bg-neutral-900 border-2 border-neutral-700 relative overflow-hidden">
            <div className="bg-neutral-800 px-3 py-1 text-[11px] font-mono text-neutral-300 flex items-center justify-between border-b border-neutral-700">
              <span className="flex items-center gap-1.5 text-yellow-300">
                <ScreenShare className="w-3.5 h-3.5 text-yellow-400" />
                Alex Rivera&apos;s Screen (DaVinci Resolve Studio 19)
              </span>
              <span className="bg-red-600 text-white px-1.5 py-0.2 text-[9px] font-bold animate-pulse">
                LIVE 60FPS
              </span>
            </div>

            {/* Screen Content Preview */}
            <div className="flex-1 relative flex items-center justify-center bg-neutral-950 overflow-hidden">
              <video
                src={
                  activeProject.active_draft_url ||
                  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                }
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />

              {/* Watermark badge */}
              <div className="absolute bottom-3 left-3 bg-black/80 px-2 py-1 text-[10px] font-mono text-green-400 border border-green-500/40">
                Synchronized Review Feed • Low Latency &lt;45ms
              </div>
            </div>
          </div>

          {/* Right: Participant Video Feeds */}
          <div className="w-full md:w-56 flex flex-row md:flex-col gap-2 flex-shrink-0">
            {/* Participant 1: Creator */}
            <div className="flex-1 bg-neutral-900 border border-neutral-700 p-2 relative flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300">
                <span className="truncate">{activeProject.creator_name} (Client)</span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
              <div className="flex-1 flex items-center justify-center my-2">
                <div className="w-14 h-14 rounded-full border-2 border-blue-500 overflow-hidden bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeProject.creator_avatar}
                    alt={activeProject.creator_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-[9px] font-mono text-center text-neutral-400">
                Audio: Active
              </div>
            </div>

            {/* Participant 2: Editor */}
            <div className="flex-1 bg-neutral-900 border border-neutral-700 p-2 relative flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300">
                <span className="truncate">{activeProject.editor_name} (Editor)</span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
              <div className="flex-1 flex items-center justify-center my-2">
                <div className="w-14 h-14 rounded-full border-2 border-emerald-500 overflow-hidden bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeProject.editor_avatar}
                    alt={activeProject.editor_name || 'Editor'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-[9px] font-mono text-center text-emerald-400">
                Presenting Timeline
              </div>
            </div>
          </div>
        </div>

        {/* Call Action Controls */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            Room Code: <strong className="text-slate-200">EB-ROOM-{activeProject.id.slice(-6).toUpperCase()}</strong>
          </div>

          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={() => {
                retroSound.playClick();
                setMicOn(!micOn);
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border ${
                micOn ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-red-950 border-red-800 text-red-200'
              }`}
            >
              {micOn ? <Mic className="w-4 h-4 text-slate-200" /> : <MicOff className="w-4 h-4 text-red-400" />}
              <span>{micOn ? 'Mute' : 'Unmuted'}</span>
            </button>

            <button
              onClick={() => {
                retroSound.playClick();
                setCameraOn(!cameraOn);
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border ${
                cameraOn ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-red-950 border-red-800 text-red-200'
              }`}
            >
              {cameraOn ? <Video className="w-4 h-4 text-slate-200" /> : <VideoOff className="w-4 h-4 text-red-400" />}
              <span>{cameraOn ? 'Cam On' : 'Cam Off'}</span>
            </button>

            <button
              onClick={() => {
                retroSound.playClick();
                setIsSharingScreen(!isSharingScreen);
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border ${
                isSharingScreen ? 'bg-blue-900/60 border-blue-600 text-blue-200' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <ScreenShare className="w-4 h-4" />
              <span>{isSharingScreen ? 'Sharing' : 'Share'}</span>
            </button>

            <button
              onClick={() => {
                retroSound.playClick();
                onClose();
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
