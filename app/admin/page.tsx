'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertTriangle,
  Scale,
  HardDrive,
  FileText,
  DollarSign,
  TrendingUp,
  RotateCcw,
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
  const { projects, switchRole, activeRole } = useEditBridge();

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
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4 font-sans">
      <RetroWindow
        title="ROOT_ADMIN_TERMINAL.SYS — TRUST, SAFETY &amp; DISPUTE OPERATIONS"
        icon={<ShieldAlert className="w-4 h-4 text-amber-300" />}
      >
        <div className="space-y-4">
          {/* Admin Banner & Role indicator */}
          <div className="bg-[#000080] text-white p-3.5 border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-yellow-300">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-none animate-pulse"></span>
                <span>EDITBRIDGE OPERATIONAL CONTROL PANEL (ADMIN LEVEL 4)</span>
              </div>
              <p className="text-xs text-neutral-200 mt-1 font-sans">
                Review platform GMV, resolve project disputes based on recorded timecodes, and verify editor talent applications.
              </p>
            </div>

            {activeRole !== 'ADMIN' && (
              <button
                onClick={() => switchRole('ADMIN')}
                className="win95-button win95-button-amber px-3 py-1.5 text-xs font-mono font-bold text-white self-start sm:self-center"
              >
                Switch to Admin Persona
              </button>
            )}
          </div>

          {/* Platform Performance Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="win95-window p-3 bg-white font-mono text-xs">
              <span className="text-neutral-500 block text-[10px]">TOTAL PLATFORM GMV</span>
              <strong className="text-base sm:text-lg text-neutral-900">$284,500.00</strong>
              <span className="text-emerald-700 text-[10px] block mt-0.5 font-bold">
                ↑ +18.4% MoM Growth
              </span>
            </div>

            <div className="win95-window p-3 bg-white font-mono text-xs">
              <span className="text-neutral-500 block text-[10px]">ACTIVE ESCROW HELD</span>
              <strong className="text-base sm:text-lg text-[#000080]">$14,250.00</strong>
              <span className="text-neutral-600 text-[10px] block mt-0.5">
                Across 24 Active Projects
              </span>
            </div>

            <div className="win95-window p-3 bg-white font-mono text-xs">
              <span className="text-neutral-500 block text-[10px]">DISPUTE RATE</span>
              <strong className="text-base sm:text-lg text-emerald-700">0.38%</strong>
              <span className="text-neutral-600 text-[10px] block mt-0.5">
                Target: &lt;1.00%
              </span>
            </div>

            <div className="win95-window p-3 bg-white font-mono text-xs">
              <span className="text-neutral-500 block text-[10px]">VETTED EDITORS</span>
              <strong className="text-base sm:text-lg text-neutral-900">385 Pros</strong>
              <span className="text-blue-700 text-[10px] block mt-0.5 font-bold">
                12 Pending Review
              </span>
            </div>
          </div>

          {/* Section 1: Dispute Resolution Queue */}
          <div className="win95-window p-3.5 bg-white space-y-3">
            <h3 className="font-bold text-xs font-mono text-red-900 flex items-center gap-1.5 border-b border-neutral-300 pb-1.5">
              <Scale className="w-4 h-4 text-red-700" />
              <span>DISPUTE RESOLUTION QUEUE — TIME-CODED EVIDENCE AUDIT</span>
            </h3>

            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="win95-sunken p-3 bg-red-50/50 border border-red-300 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-neutral-900">
                      {dispute.project_title}
                    </span>
                    <span className="bg-red-100 text-red-900 border border-red-400 px-1.5 py-0.2 font-mono text-[10px] font-bold">
                      HELD ESCROW: ${dispute.amount}.00 USD
                    </span>
                  </div>

                  <span className="font-mono text-[11px] font-bold text-amber-900">
                    STATUS: {dispute.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-neutral-700">
                  <div>Creator: <strong>{dispute.creator}</strong></div>
                  <div>Editor: <strong>{dispute.editor}</strong></div>
                </div>

                <p className="text-xs text-neutral-800 font-sans">
                  <strong>Issue:</strong> {dispute.issue}
                </p>

                <div className="p-2 bg-white border border-neutral-300 font-mono text-[11px] text-blue-900">
                  📁 <strong>Audit Trail Evidence:</strong> {dispute.evidence}
                </div>

                {dispute.status === 'UNDER_REVIEW' ? (
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleResolveDispute(dispute.id, 'RESOLVED_CREATOR')}
                      className="win95-button px-3 py-1 text-xs font-mono font-bold text-neutral-800 hover:bg-neutral-100"
                    >
                      Refund Creator ($450)
                    </button>
                    <button
                      onClick={() => handleResolveDispute(dispute.id, 'RESOLVED_EDITOR')}
                      className="win95-button win95-button-success px-3 py-1 text-xs font-mono font-bold"
                    >
                      Release to Editor ($450)
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-green-800 font-bold text-right pt-1">
                    ✓ Case Closed: {dispute.status}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Section 2: Editor Verification Queue */}
          <div className="win95-window p-3.5 bg-white space-y-3">
            <h3 className="font-bold text-xs font-mono text-[#000080] flex items-center gap-1.5 border-b border-neutral-300 pb-1.5">
              <Users className="w-4 h-4 text-blue-700" />
              <span>NEW EDITOR VERIFICATION &amp; SHOWREEL AUDIT</span>
            </h3>

            <div className="space-y-2">
              {verificationQueue.map((item) => (
                <div
                  key={item.id}
                  className="win95-window p-3 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-neutral-900">
                        {item.name}
                      </span>
                      <span className="bg-neutral-200 border border-neutral-400 text-[10px] font-mono px-1">
                        {item.niche}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Submitted: {new Date(item.submitted_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-neutral-600">
                      Software: {item.software.join(', ')} • Showreel:{' '}
                      <a
                        href={item.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 underline"
                      >
                        {item.portfolio_url}
                      </a>
                    </p>
                  </div>

                  {item.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleVerification(item.id, 'REJECTED')}
                        className="win95-button px-2.5 py-1 text-[11px] font-mono font-bold text-red-700"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerification(item.id, 'APPROVED')}
                        className="win95-button win95-button-primary px-3 py-1 text-[11px] font-mono font-bold text-yellow-300"
                      >
                        Approve &amp; Grant Verified Badge
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        item.status === 'APPROVED' ? 'text-green-700' : 'text-red-700'
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
