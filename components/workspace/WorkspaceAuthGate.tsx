'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, UserPlus } from 'lucide-react';

export function WorkspaceAuthGate() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 font-sans">
      <div className="bg-white dark:bg-[#0c1222] border border-cyan-500/30 dark:border-cyan-500/20 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            Authentication Required
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Sign In to Enter Project Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Project media assets, frame-accurate timeline reviews, and 30/70 escrow payment releases are securely restricted to authenticated project members.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">30/70 Escrow</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Upfront deposits held until final master review is approved.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Frame Accuracy</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Pin exact revision notes to video frames and export EDL.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Role Security</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Verified permissions for creators, editors, and ops arbiters.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/signin"
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
          >
            <span>Sign In with Password</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
