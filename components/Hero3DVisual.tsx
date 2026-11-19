'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Play,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MessageSquare,
  Flame,
} from 'lucide-react';

interface Hero3DVisualProps {
  inBackground?: boolean;
}

export function Hero3DVisual({ inBackground = false }: Hero3DVisualProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 10;
    const rotY = (x / (rect.width / 2)) * 12;

    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 w-full max-w-4xl mx-auto transition-all duration-300 ${
        inBackground
          ? 'scale-90 sm:scale-100 md:scale-110 opacity-25 dark:opacity-40 hover:opacity-50'
          : 'py-6'
      }`}
    >
      {/* 3D Tilt Wrapper */}
      <div
        className="preserve-3d transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Ambient Sunset Glow */}
        <div className="absolute -inset-6 bg-gradient-to-tr from-vice-pink/10 via-vice-coral/10 to-amber-500/5 rounded-3xl blur-2xl opacity-40 -z-10" />

        {/* Base 3D Video Studio Mockup Card */}
        <div className="bg-vice-surface/95 border border-vice-border rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Top Studio Control Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-vice-border">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-vice-pink" />
              <div className="w-2.5 h-2.5 rounded-full bg-vice-coral" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-[11px] font-mono text-vice-muted ml-2 hidden sm:inline">
                editbridge://vice-city/studio/the-great-ai-bubble-2026
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>30/70 ESCROW SECURED</span>
            </div>
          </div>

          {/* Video Preview Frame / Interactive Studio Monitor */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-vice-canvas border border-vice-border shadow-inner flex items-center justify-center">
            {/* Ambient Animated Studio Sunset Grid */}
            <div className="absolute inset-0 bg-radial-gradient from-vice-pink/10 via-vice-surface to-vice-canvas opacity-70" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(225,29,116,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Simulated Frame Playback Waveform */}
            <div className="relative z-10 flex items-center gap-1 opacity-70">
              {[40, 65, 30, 85, 55, 95, 70, 45, 80, 60, 90, 75, 50, 85, 65, 40, 70, 55, 90, 45].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-vice-pink to-vice-coral"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-vice-canvas/80 via-transparent to-transparent pointer-events-none" />

            {/* Center Play Indicator */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-2xl bg-vice-pink text-white flex items-center justify-center shadow-lg pointer-events-none">
              <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
            </div>

            {/* Frame Watermark Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="px-2.5 py-0.5 rounded-full bg-vice-cardElevated/90 backdrop-blur-md text-[10px] font-mono text-vice-pink border border-vice-border font-semibold shadow-xs">
                STUDIO WORKSPACE • ESCROW SECURED
              </span>
            </div>

            {/* Bottom Scrubber Timeline */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-1.5 pointer-events-none">
              <div className="flex items-center justify-between text-[11px] font-mono text-vice-text">
                <span className="font-bold text-vice-pink">00:43</span>
                <span className="text-vice-muted">08:24 (Vice Cut Review)</span>
              </div>

              {/* Progress Scrubber with Frame Pin */}
              <div className="relative h-2 rounded-full bg-vice-cardElevated overflow-visible">
                <div className="absolute top-0 left-0 h-full w-[38%] bg-gradient-to-r from-vice-pink to-vice-coral rounded-full" />
                <div className="absolute top-1/2 left-[38%] -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-vice-pink" />
                <div className="absolute top-0 left-[38%] -top-1 w-0.5 h-4 bg-amber-400" />
              </div>
            </div>
          </div>

          {/* Bottom Audio & Revision Track */}
          <div className="mt-3 pt-3 border-t border-vice-border flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vice-cardElevated text-amber-500 font-bold border border-amber-500/20">
                REV ROUND 1/3
              </span>
              <span className="text-vice-muted text-[11px] hidden sm:inline">
                2 pins addressed • 1 pending approval
              </span>
            </div>

            <div className="text-[11px] font-bold text-vice-pink flex items-center gap-1">
              <span>Timeline Synchronized</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            3D FLOATING FOREGROUND LAYERS (Parallax Depth)
            ======================================================== */}

        {/* Floating Layer 1: Frame-Accurate Comment Pin (Top-Right) */}
        <div
          className="absolute -top-3 -right-2 sm:-right-6 bg-vice-cardElevated border border-vice-border rounded-2xl p-3 shadow-2xl backdrop-blur-md hidden sm:flex items-start gap-2.5 max-w-[240px] transition-transform duration-300"
          style={{
            transform: 'translateZ(45px)',
          }}
        >
          <div className="w-7 h-7 rounded-lg bg-vice-pink/15 text-vice-pink flex items-center justify-center shrink-0">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div className="text-left text-xs min-w-0">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-vice-pink font-bold">
              <Clock className="w-3 h-3" />
              <span>00:43</span>
            </div>
            <p className="font-semibold text-vice-text text-[11px] leading-tight truncate mt-0.5">
              Punch in 12% on talking head
            </p>
            <span className="text-[9px] text-emerald-500 font-mono">Pinned to frame</span>
          </div>
        </div>

        {/* Floating Layer 2: 30/70 Escrow Milestone (Bottom-Left) */}
        <div
          className="absolute -bottom-4 -left-2 sm:-left-6 bg-vice-cardElevated border border-emerald-500/30 rounded-2xl p-3 shadow-2xl backdrop-blur-md hidden sm:flex items-center gap-3 transition-transform duration-300"
          style={{
            transform: 'translateZ(60px)',
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left text-xs">
            <span className="text-[9px] font-mono text-emerald-500 font-bold block uppercase tracking-wider">
              Milestone Escrow Active
            </span>
            <span className="font-bold text-vice-text text-xs block font-mono">
              30% Upfront Released • 70% Vault Locked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
