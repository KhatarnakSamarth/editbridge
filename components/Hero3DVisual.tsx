'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  MessageSquare,
  Play,
  Lock,
} from 'lucide-react';

interface Hero3DVisualProps {
  inBackground?: boolean;
}

export function Hero3DVisual({ inBackground = false }: Hero3DVisualProps) {
  const [rotate, setRotate] = useState({ x: 6, y: -8 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Smooth window-level mouse tracking for ambient 3D parallax
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Subtle, refined 3D tilt angles between -9 and 9 degrees
      const rotateY = ((e.clientX - centerX) / centerX) * 9;
      const rotateX = -((e.clientY - centerY) / centerY) * 7;

      setRotate({ x: rotateX + (inBackground ? 4 : 0), y: rotateY - (inBackground ? 4 : 0) });
    };

    const handleMouseLeave = () => {
      setRotate({ x: 5, y: -6 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [inBackground]);

  return (
    <div
      aria-hidden="true"
      className={`relative w-full max-w-4xl mx-auto perspective-1000 select-none pointer-events-none transition-all duration-700 ${
        inBackground
          ? 'scale-90 sm:scale-100 md:scale-110 opacity-25 dark:opacity-35 hover:opacity-45'
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
        {/* Ambient Back Glow */}
        <div className="absolute -inset-6 bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-purple-500/20 rounded-3xl blur-3xl opacity-60 -z-10" />

        {/* Base 3D Video Studio Mockup Card */}
        <div className="bg-white/90 dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-cyan-500/25 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Top Studio Control Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
                editbridge://studio/workspace/the-great-ai-bubble-2026
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>30/70 ESCROW SECURED</span>
            </div>
          </div>

          {/* Video Preview Frame */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
              alt="Video timeline preview"
              className="w-full h-full object-cover opacity-80"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Center Play Button Overlay */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-2xl bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 backdrop-blur-xs">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>

            {/* Bottom Scrubber Timeline */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-200">
                <span className="font-bold text-cyan-400">00:43</span>
                <span className="text-slate-400">08:24 (4K ProRes)</span>
              </div>

              {/* Progress Scrubber with Frame Pin */}
              <div className="relative h-2 rounded-full bg-slate-800/90 overflow-visible">
                <div className="absolute top-0 left-0 h-full w-[38%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                <div className="absolute top-1/2 left-[38%] -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md shadow-cyan-500/50 border-2 border-cyan-400" />
                <div className="absolute top-0 left-[38%] -top-1 w-0.5 h-4 bg-amber-400" />
              </div>
            </div>
          </div>

          {/* Bottom Audio & Revision Track */}
          <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                REV ROUND 1/2
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">
                2 pins addressed • 1 pending approval
              </span>
            </div>

            <div className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              <span>Timeline Synchronized</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            3D FLOATING FOREGROUND LAYERS (Parallax Depth)
            ======================================================== */}

        {/* Floating Layer 1: Frame-Accurate Comment Pin (Top-Right) */}
        <div
          className="absolute -top-3 -right-2 sm:-right-6 bg-white dark:bg-[#0f172a] border border-cyan-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md hidden sm:flex items-start gap-2.5 max-w-[240px] transition-transform duration-300"
          style={{
            transform: 'translateZ(45px)',
          }}
        >
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-1 rounded">
                00:43
              </span>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white">Marcus</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
              &ldquo;Replace stock B-roll with 3D Nvidia chart.&rdquo;
            </p>
          </div>
        </div>

        {/* Floating Layer 2: Escrow Protection Badge (Bottom-Left) */}
        <div
          className="absolute -bottom-3 -left-2 sm:-left-6 bg-white dark:bg-[#0f172a] border border-emerald-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center gap-2.5 transition-transform duration-300"
          style={{
            transform: 'translateZ(55px)',
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold">
              30/70 Escrow Contract
            </div>
            <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
              <span>$165 Released</span>
              <span className="text-slate-400 font-normal">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">$385 Vaulted</span>
            </div>
          </div>
        </div>

        {/* Floating Layer 3: Master File Delivery Lock (Center-Right) */}
        <div
          className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 bg-white dark:bg-[#0f172a] border border-purple-500/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md hidden md:flex items-center gap-2 transition-transform duration-300"
          style={{
            transform: 'translateZ(35px)',
          }}
        >
          <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div className="text-[10px] font-sans">
            <span className="font-bold text-slate-900 dark:text-white block">4K Master Locked</span>
            <span className="text-slate-500 dark:text-slate-400 text-[9px]">Unlocks on final escrow release</span>
          </div>
        </div>
      </div>
    </div>
  );
}
