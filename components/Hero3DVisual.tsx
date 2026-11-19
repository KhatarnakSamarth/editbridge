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
        <div className="absolute -inset-6 bg-gradient-to-tr from-[#FF2E93]/25 via-[#FF7B54]/20 to-[#FFD166]/15 rounded-3xl blur-3xl opacity-75 -z-10" />

        {/* Base 3D Video Studio Mockup Card */}
        <div className="bg-[#170B29]/95 border border-[rgba(255,46,147,0.3)] rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Top Studio Control Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(255,46,147,0.2)]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF2E93] shadow-xs shadow-[#FF2E93]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF7B54] shadow-xs shadow-[#FF7B54]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFD166] shadow-xs shadow-[#FFD166]" />
              <span className="text-[11px] font-mono text-[#C8A8C9] ml-2 hidden sm:inline">
                editbridge://vice-city/studio/the-great-ai-bubble-2026
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#00F5A0]/15 text-[#00F5A0] border border-[#00F5A0]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse" />
              <span>30/70 ESCROW SECURED</span>
            </div>
          </div>

          {/* Video Preview Frame / Interactive Studio Monitor */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0D0618] border border-[rgba(255,46,147,0.25)] shadow-inner flex items-center justify-center">
            {/* Ambient Animated Studio Sunset Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF2E93]/15 via-[#170B29] to-[#0D0618] opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,46,147,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,123,84,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Simulated Frame Playback Waveform */}
            <div className="relative z-10 flex items-center gap-1 opacity-70">
              {[40, 65, 30, 85, 55, 95, 70, 45, 80, 60, 90, 75, 50, 85, 65, 40, 70, 55, 90, 45].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-[#FF2E93] to-[#FF7B54] animate-pulse"
                  style={{ height: `${h}px`, animationDelay: `${(i * 100) % 1000}ms` }}
                />
              ))}
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0618] via-[#0D0618]/20 to-transparent pointer-events-none" />

            {/* Center Play Indicator */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF2E93] to-[#FF7B54] text-[#0D0618] flex items-center justify-center shadow-lg shadow-[#FF2E93]/40 backdrop-blur-xs pointer-events-none">
              <Play className="w-5 h-5 fill-current ml-0.5 text-[#0D0618]" />
            </div>

            {/* Frame Watermark Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0D0618]/90 backdrop-blur-md text-[10px] font-mono text-[#FF2E93] border border-[#FF2E93]/40 font-semibold shadow-xs">
                STUDIO WORKSPACE • ESCROW SECURED
              </span>
            </div>

            {/* Bottom Scrubber Timeline */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-1.5 pointer-events-none">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#FFF5F9]">
                <span className="font-bold text-[#FF2E93]">00:43</span>
                <span className="text-[#C8A8C9]">08:24 (Vice Cut Review)</span>
              </div>

              {/* Progress Scrubber with Frame Pin */}
              <div className="relative h-2 rounded-full bg-[#211038] overflow-visible">
                <div className="absolute top-0 left-0 h-full w-[38%] bg-gradient-to-r from-[#FF2E93] via-[#FF7B54] to-[#FFD166] rounded-full" />
                <div className="absolute top-1/2 left-[38%] -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md shadow-[#FF2E93]/60 border-2 border-[#FF2E93]" />
                <div className="absolute top-0 left-[38%] -top-1 w-0.5 h-4 bg-[#FFD166]" />
              </div>
            </div>
          </div>

          {/* Bottom Audio & Revision Track */}
          <div className="mt-3 pt-3 border-t border-[rgba(255,46,147,0.2)] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#211038] text-[#FFD166] font-bold border border-[#FFD166]/30">
                REV ROUND 1/3
              </span>
              <span className="text-[#C8A8C9] text-[11px] hidden sm:inline">
                2 pins addressed • 1 pending approval
              </span>
            </div>

            <div className="text-[11px] font-bold text-[#FF2E93] flex items-center gap-1">
              <span>Timeline Synchronized</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            3D FLOATING FOREGROUND LAYERS (Parallax Depth)
            ======================================================== */}

        {/* Floating Layer 1: Frame-Accurate Comment Pin (Top-Right) */}
        <div
          className="absolute -top-3 -right-2 sm:-right-6 bg-[#211038] border border-[rgba(255,46,147,0.35)] rounded-2xl p-3 shadow-2xl backdrop-blur-md hidden sm:flex items-start gap-2.5 max-w-[240px] transition-transform duration-300"
          style={{
            transform: 'translateZ(45px)',
          }}
        >
          <div className="w-7 h-7 rounded-lg bg-[#FF2E93]/15 text-[#FF2E93] flex items-center justify-center shrink-0">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div className="text-left text-xs min-w-0">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#FF2E93] font-bold">
              <Clock className="w-3 h-3" />
              <span>00:43</span>
            </div>
            <p className="font-semibold text-[#FFF5F9] text-[11px] leading-tight truncate mt-0.5">
              Punch in 12% on talking head
            </p>
            <span className="text-[9px] text-[#00F5A0] font-mono">Pinned to frame</span>
          </div>
        </div>

        {/* Floating Layer 2: 30/70 Escrow Milestone (Bottom-Left) */}
        <div
          className="absolute -bottom-4 -left-2 sm:-left-6 bg-[#211038] border border-[#00F5A0]/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md hidden sm:flex items-center gap-3 transition-transform duration-300"
          style={{
            transform: 'translateZ(60px)',
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-[#00F5A0]/15 text-[#00F5A0] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left text-xs">
            <span className="text-[9px] font-mono text-[#00F5A0] font-bold block uppercase tracking-wider">
              Milestone Escrow Active
            </span>
            <span className="font-bold text-[#FFF5F9] text-xs block font-mono">
              30% Upfront Released • 70% Vault Locked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
