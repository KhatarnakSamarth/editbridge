'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Scale,
  Sparkles,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

interface DisputeCase {
  id: string;
  project_title: string;
  creator: string;
  editor: string;
  amount: number;
  issue: string;
  evidence: string;
  status: 'UNDER_REVIEW' | 'RESOLVED_CREATOR' | 'RESOLVED_EDITOR';
}

interface VerificationRequest {
  id: string;
  name: string;
  niche: string;
  software: string[];
  portfolio_url: string;
  submitted_at: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function AdminOpsPage() {
  const { switchRole, activeRole } = useEditBridge();

  const [disputes, setDisputes] = useState<DisputeCase[]>([
    {
      id: 'disp-101',
      project_title: 'Crypto Market Crash Documentary Part 3',
      creator: 'Dan Crypto (Creator)',
      editor: 'Vikram S. (Editor)',
      amount: 450,
      issue: 'Creator claims revision requested 5 days ago was not completed; editor claims revision exceeded agreed 2-round scope.',
      evidence: 'Timestamp comment log shows 4 revision requests made after round 2 approval.',
      status: 'UNDER_REVIEW',
    },
  ]);

  const [verificationQueue, setVerificationQueue] = useState<VerificationRequest[]>([
    {
      id: 'vet-201',
      name: 'Liam Vance',
      niche: 'Gaming & High Pacing',
      software: ['Premiere Pro', 'After Effects'],
      portfolio_url: 'https://youtube.com/@liamcuts_showreel',
      submitted_at: '2026-11-17T10:00:00Z',
      status: 'PENDING',
    },
    {
      id: 'vet-202',
      name: 'Sofia Chen',
      niche: 'Podcasts & Multi-Cam',
      software: ['DaVinci Resolve Studio', 'Pro Tools'],
      portfolio_url: 'https://vimeo.com/sofiachen_multicam',
      submitted_at: '2026-11-17T12:30:00Z',
      status: 'PENDING',
    },
  ]);

  const handleResolveDispute = (id: string, outcome: 'RESOLVED_CREATOR' | 'RESOLVED_EDITOR') => {
    retroSound.playDing();
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: outcome } : d))
    );
  };

  const handleVerification = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    retroSound.playDing();
    setVerificationQueue((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: decision } : v))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-sans">
      <RetroWindow
        title="TRUST, SAFETY &amp; DISPUTE OPERATIONS"
        icon={<ShieldAlert className="w-4 h-4 text-amber-500" />}
      >
        <div className="space-y-6">
          {/* Admin Banner & Role indicator */}
          <div className="bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>EDITBRIDGE OPERATIONAL CONTROL PANEL (ADMIN OPS)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-sans leading-relaxed">
                Review platform GMV, resolve project disputes based on logged timecodes, and verify editor talent applications.
              </p>
            </div>

            {activeRole !== 'ADMIN' && (
              <button
                onClick={() => switchRole('ADMIN')}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-xs font-semibold rounded-xl self-start sm:self-center shadow-xs transition-all"
              >
                Switch to Admin Persona
              </button>
            )}
          </div>

          {/* Platform Performance Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-1.5 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">TOTAL PLATFORM GMV</span>
              <strong className="text-base sm:text-lg text-slate-900 dark:text-white font-mono font-bold">$284,500.00</strong>
              <span className="text-emerald-600 dark:text-emerald-400 text-[11px] block font-bold">
                ↑ +18.4% MoM Growth
              </span>
            </div>

            <div className="p-5 bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-1.5 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">ACTIVE ESCROW HELD</span>
              <strong className="text-base sm:text-lg text-blue-600 dark:text-cyan-400 font-mono font-bold">$14,250.00</strong>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                Across 24 Active Projects
              </span>
            </div>

            <div className="p-5 bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-1.5 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">DISPUTE RATE</span>
              <strong className="text-base sm:text-lg text-emerald-600 dark:text-emerald-400 font-mono font-bold">0.38%</strong>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                Target: &lt;1.00%
              </span>
            </div>

            <div className="p-5 bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-1.5 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">VETTED EDITORS</span>
              <strong className="text-base sm:text-lg text-slate-900 dark:text-white font-mono font-bold">385 Pros</strong>
              <span className="text-blue-600 dark:text-cyan-400 text-[11px] block font-bold">
                12 Pending Review
              </span>
            </div>
          </div>

          {/* Section 1: Dispute Resolution Queue */}
          <div className="p-6 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 uppercase tracking-wide">
              <Scale className="w-4 h-4 text-rose-500" />
              <span>Dispute Resolution Queue — Time-Coded Evidence Audit</span>
            </h3>

            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="p-5 bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3.5 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {dispute.project_title}
                    </span>
                    <span className="bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
                      HELD ESCROW: ${dispute.amount}.00 USD
                    </span>
                  </div>

                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    STATUS: {dispute.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div>Creator: <strong className="text-slate-900 dark:text-white">{dispute.creator}</strong></div>
                  <div>Editor: <strong className="text-slate-900 dark:text-white">{dispute.editor}</strong></div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                  <strong>Issue:</strong> {dispute.issue}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-blue-700 dark:text-cyan-300 leading-relaxed">
                  📁 <strong>Audit Trail Evidence:</strong> {dispute.evidence}
                </div>

                {dispute.status === 'UNDER_REVIEW' ? (
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => handleResolveDispute(dispute.id, 'RESOLVED_CREATOR')}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
                    >
                      Refund Creator ($450)
                    </button>
                    <button
                      onClick={() => handleResolveDispute(dispute.id, 'RESOLVED_EDITOR')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold rounded-xl shadow-xs transition-all"
                    >
                      Release to Editor ($450)
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold text-right pt-1">
                    ✓ Case Closed: {dispute.status}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Section 2: Editor Verification Queue */}
          <div className="p-6 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 uppercase tracking-wide">
              <Users className="w-4 h-4 text-cyan-500" />
              <span>New Editor Verification &amp; Showreel Audit</span>
            </h3>

            <div className="space-y-3.5">
              {verificationQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.name}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] px-2.5 py-0.5 rounded-full text-slate-700 dark:text-slate-300 font-medium">
                        {item.niche}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Submitted: {new Date(item.submitted_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Software: {item.software.join(', ')} • Showreel:{' '}
                      <a
                        href={item.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-600 dark:text-cyan-400 underline hover:text-cyan-500"
                      >
                        {item.portfolio_url}
                      </a>
                    </p>
                  </div>

                  {item.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleVerification(item.id, 'REJECTED')}
                        className="px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerification(item.id, 'APPROVED')}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold rounded-xl shadow-xs transition-all"
                      >
                        Approve &amp; Grant Verified Badge
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-xs font-bold ${
                        item.status === 'APPROVED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
