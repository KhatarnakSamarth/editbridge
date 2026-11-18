'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
} from 'lucide-react';
import { retroSound } from '@/lib/soundEffects';

export function Hero3DVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 4, y: -6 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTime, setActiveTime] = useState('00:43');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation between -12 and 12 deg
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = -((y - centerY) / centerY) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 4, y: -6 }); // Return to gentle resting 3D perspective
  };

  const togglePlay = () => {
    retroSound.playClick();
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-2xl mx-auto perspective-1000 py-6 select-none"
    >
      {/* 3D Tilt Wrapper */}
      <div
        className="preserve-3d transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Ambient Back Glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-purple-500/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity -z-10" />

        {/* Base 3D Video Studio Mockup Card */}
        <div className="bg-white/95 dark:bg-[#0c1222]/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 ml-2 hidden sm:inline">
                editbridge://studio/workspace/the-great-ai-bubble-2026
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>30/70 ESCROW SECURED</span>
            </div>
          </div>

          {/* Video Preview Frame (Interactive) */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner group">
            {/* Sample Video Background Mockup */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
              alt="Video timeline preview"
              className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark Gradient Overlay for Control Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Center Play Button Overlay */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause demo' : 'Play demo'}
              className="absolute inset-0 m-auto w-14 h-14 rounded-2xl bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer z-20 backdrop-blur-xs"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            {/* Bottom Scrubber Timeline */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-2 z-10">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-200">
                <span className="font-bold text-cyan-400">{activeTime}</span>
                <span className="text-slate-400">08:24 (4K ProRes)</span>
              </div>

              {/* Progress Scrubber with Frame Pin */}
              <div className="relative h-2 rounded-full bg-slate-800/90 overflow-visible cursor-pointer">
                <div className="absolute top-0 left-0 h-full w-[38%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                
                {/* Active Scrubber Marker */}
                <div className="absolute top-1/2 left-[38%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-md shadow-cyan-500/50 border-2 border-cyan-400" />
                
                {/* Milestone Pin marker */}
                <div className="absolute top-0 left-[38%] -top-1 w-0.5 h-4 bg-amber-400" />
              </div>
            </div>
          </div>

          {/* Bottom Audio & Revision Track */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                REV ROUND 1/2
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">
                2 pins addressed • 1 pending approval
              </span>
            </div>

            <Link
              href="/workspace"
              className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Inspect Workspace</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* ========================================================
            3D FLOATING FOREGROUND LAYERS (Parallax Depth)
            ======================================================== */}

        {/* Floating Layer 1: Frame-Accurate Comment Pin (Top-Right) */}
        <div
          className="absolute -top-3 -right-2 sm:-right-6 bg-white dark:bg-[#0f172a] border border-cyan-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md hidden sm:flex items-start gap-2.5 max-w-[240px] pointer-events-none transition-transform duration-300"
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
          className="absolute -bottom-3 -left-2 sm:-left-6 bg-white dark:bg-[#0f172a] border border-emerald-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-2.5 pointer-events-none transition-transform duration-300"
          style={{
            transform: 'translateZ(55px)',
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-semibold">
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
          className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 bg-white dark:bg-[#0f172a] border border-purple-500/40 rounded-2xl p-2.5 shadow-xl backdrop-blur-md hidden md:flex items-center gap-2 pointer-events-none transition-transform duration-300"
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
