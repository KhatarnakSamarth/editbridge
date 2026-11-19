'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, UserPlus } from 'lucide-react';

export function WorkspaceAuthGate() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 font-sans">
      <div className="bg-[#170B29] border border-pink-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-pink-500/10 border border-pink-500/30 text-vice-pink flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-pink-500/15 text-vice-pink border border-pink-500/30">
            Authentication Required
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-vice-text">
            Sign In to Enter Project Workspace
          </h1>
          <p className="text-xs sm:text-sm text-vice-muted leading-relaxed">
            Project media assets, frame-accurate timeline reviews, and 30/70 escrow payment releases are securely restricted to authenticated project members.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left text-xs">
          <div className="p-3.5 rounded-2xl bg-[#211038] border border-pink-500/20">
            <span className="font-bold text-vice-text block mb-1">30/70 Escrow</span>
            <span className="text-[11px] text-vice-muted">Upfront deposits held until final master review is approved.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#211038] border border-pink-500/20">
            <span className="font-bold text-vice-text block mb-1">Frame Accuracy</span>
            <span className="text-[11px] text-vice-muted">Pin exact revision notes to video frames and export EDL.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#211038] border border-pink-500/20">
            <span className="font-bold text-vice-text block mb-1">Role Security</span>
            <span className="text-[11px] text-vice-muted">Verified permissions for creators, editors, and ops arbiters.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/signin"
            className="w-full sm:w-auto bg-vice-gradient hover:opacity-95 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 transition-all"
          >
            <span>Sign In with Password</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-[#211038] hover:bg-[#2c174a] text-vice-text font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-pink-500/20"
          >
            <UserPlus className="w-4 h-4 text-vice-pink" />
            <span>Create New Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
