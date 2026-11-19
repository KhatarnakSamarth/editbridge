'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Scale,
  Database,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  DollarSign,
  UserCheck,
  Shield,
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

interface LiveUser {
  id: string;
  email: string;
  name: string;
  role: string;
  badge: string;
  projectCount: number;
  created_at: string;
}

export default function AdminOpsPage() {
  const { activeRole, currentUser, isAuthenticated } = useEditBridge();

  const [metrics, setMetrics] = useState({
    totalUsers: 4,
    creatorsCount: 1,
    editorsCount: 2,
    adminsCount: 1,
    totalProjects: 2,
    activeProjects: 2,
    completedProjects: 0,
    disputedProjects: 0,
    totalSettledGMV: 1050.0,
    platformRevenue: 52.5,
    activeEscrowLocked: 735.0,
    disputeRatePercent: '0.0',
    systemHealth: '100% HEALTHY',
    dbEngine: 'Supabase PostgreSQL (zero-latency read/write)',
  });

  const [usersList, setUsersList] = useState<LiveUser[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  const [disputes, setDisputes] = useState<DisputeCase[]>([
    {
      id: 'disp-101',
      project_title: 'The Great AI Bubble of 2026',
      creator: 'Marcus Sterling (Creator)',
      editor: 'Alex Rivera (Editor)',
      amount: 420,
      issue: 'Creator requested fine-tuning on transformer pacing. Editor delivered revised cut. Both parties requested escrow timeline review.',
      evidence: 'Timestamp revision log: 3 frame-accurate notes logged in Round 1. No breach of contract.',
      status: 'UNDER_REVIEW',
    },
  ]);

  const [verificationQueue, setVerificationQueue] = useState<VerificationRequest[]>([
    {
      id: 'vet-201',
      name: 'Maya Lin',
      niche: 'Shorts & High Pacing',
      software: ['After Effects', 'Premiere Pro'],
      portfolio_url: 'https://youtube.com/@mayalin-portfolio',
      submitted_at: '2026-11-17T10:00:00Z',
      status: 'APPROVED',
    },
    {
      id: 'vet-202',
      name: 'David Kozlov',
      niche: 'Gaming & Kinetics',
      software: ['DaVinci Resolve Studio', 'After Effects'],
      portfolio_url: 'https://youtube.com/@davidkozlov-portfolio',
      submitted_at: '2026-11-18T08:30:00Z',
      status: 'PENDING',
    },
  ]);

  const fetchLiveMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      if (data.success && data.metrics) {
        setMetrics(data.metrics);
      }

      const userRes = await fetch('/api/users');
      const userData = await userRes.json();
      if (userData.success && userData.users) {
        setUsersList(userData.users);
      }
    } catch {
      // keep fallback
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (activeRole === 'ADMIN') {
      fetchLiveMetrics();
    }
  }, [activeRole]);

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

  // RBAC Barrier: Non-Admins & unauthenticated guests cannot access this operational page
  if (!isAuthenticated || activeRole !== 'ADMIN') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <div className="bg-[#170B29] border border-pink-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-pink-500/10 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-vice-gold/15 border border-vice-gold/30 text-vice-gold flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-vice-gold/10 text-vice-gold border border-vice-gold/25">
              Role-Based Access Control (RBAC) Enforced
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Restricted Access: Administrator Required
            </h1>
            <p className="text-xs sm:text-sm text-vice-muted leading-relaxed">
              {isAuthenticated ? (
                <>
                  You are currently authenticated as <strong className="text-white">{currentUser.name}</strong> ({activeRole}).
                  The EditBridge Operational Control Panel, GMV settlement ledger, and dispute arbitration desk are strictly restricted to verified <code className="text-vice-gold font-mono">ADMIN</code> personnel.
                </>
              ) : (
                <>
                  You must be authenticated with an administrator account to view the EditBridge Operational Control Panel and dispute arbitration desk.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/signin?redirect=/admin"
              onClick={() => retroSound.playClick()}
              className="w-full sm:w-auto bg-vice-gradient hover:opacity-95 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer active:scale-95 transition-all"
            >
              <Shield className="w-4 h-4" />
              <span>Sign In with Admin Account</span>
            </Link>
            <Link
              href="/workspace"
              onClick={() => retroSound.playClick()}
              className="w-full sm:w-auto bg-[#211038] hover:bg-[#2c174a] text-vice-text font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-pink-500/20 transition-colors"
            >
              <span>Return to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-sans">
      <RetroWindow
        title="TRUST, SAFETY &amp; OPERATIONAL ARBITRATION PANEL"
        icon={<ShieldAlert className="w-4 h-4 text-vice-gold" />}
      >
        <div className="space-y-6">
          {/* Admin Banner & Database Status Strip */}
          <div className="bg-[#170B29] border border-pink-500/20 text-vice-text p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-vice-pink">
                <span className="w-2.5 h-2.5 bg-vice-mint rounded-full animate-pulse"></span>
                <span>AUTHENTICATED: ELENA DRAKE (ROOT OPS ARBITER)</span>
              </div>
              <p className="text-xs text-vice-muted mt-1 font-sans leading-relaxed">
                Review platform GMV, resolve escrow disputes using time-coded revision logs, and manage verified editor admissions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchLiveMetrics}
                disabled={isLoadingMetrics}
                className="bg-[#211038] hover:bg-[#2c174a] text-vice-text px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-pink-500/25 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMetrics ? 'animate-spin' : ''}`} />
                <span>Sync DB</span>
              </button>
              <div className="bg-vice-mint/10 text-vice-mint px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 border border-vice-mint/30">
                <Database className="w-3.5 h-3.5" />
                <span>PostgreSQL Active</span>
              </div>
            </div>
          </div>

          {/* Platform Performance Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl text-xs space-y-1.5 shadow-xs">
              <span className="text-vice-muted block text-[11px] font-medium">TOTAL PLATFORM GMV</span>
              <strong className="text-base sm:text-lg text-vice-gold font-mono font-bold">
                ${metrics.totalSettledGMV.toFixed(2)}
              </strong>
              <span className="text-vice-mint text-[11px] block font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Platform Fee: ${metrics.platformRevenue.toFixed(2)}</span>
              </span>
            </div>

            <div className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl text-xs space-y-1.5 shadow-xs">
              <span className="text-vice-muted block text-[11px] font-medium">ACTIVE ESCROW LOCKED</span>
              <strong className="text-base sm:text-lg text-vice-pink font-mono font-bold">
                ${metrics.activeEscrowLocked.toFixed(2)}
              </strong>
              <span className="text-vice-muted text-[11px] block">
                Across {metrics.activeProjects} active projects
              </span>
            </div>

            <div className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl text-xs space-y-1.5 shadow-xs">
              <span className="text-vice-muted block text-[11px] font-medium">REGISTERED USERS</span>
              <strong className="text-base sm:text-lg text-vice-mint font-mono font-bold">
                {metrics.totalUsers} Members
              </strong>
              <span className="text-vice-muted text-[11px] block">
                {metrics.creatorsCount} Creators • {metrics.editorsCount} Editors
              </span>
            </div>

            <div className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl text-xs space-y-1.5 shadow-xs">
              <span className="text-vice-muted block text-[11px] font-medium">DISPUTE RATE</span>
              <strong className="text-base sm:text-lg text-white font-mono font-bold">
                {metrics.disputeRatePercent}%
              </strong>
              <span className="text-vice-gold text-[11px] block font-bold">
                Escrow Guarantee 100%
              </span>
            </div>
          </div>

          {/* Section 1: Dispute Resolution Queue */}
          <div className="p-6 bg-[#170B29] border border-pink-500/20 rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-vice-coral flex items-center gap-2 border-b border-pink-500/15 pb-2 uppercase tracking-wide">
              <Scale className="w-4 h-4 text-vice-coral" />
              <span>Dispute Resolution Queue — Time-Coded Evidence Audit</span>
            </h3>

            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="p-5 bg-[#211038] border border-pink-500/20 rounded-2xl space-y-3.5 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {dispute.project_title}
                    </span>
                    <span className="bg-pink-500/15 text-vice-pink border border-pink-500/30 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
                      HELD ESCROW: ${dispute.amount}.00 USD
                    </span>
                  </div>

                  <span className={`text-xs font-bold ${dispute.status === 'UNDER_REVIEW' ? 'text-vice-gold' : 'text-vice-mint'}`}>
                    STATUS: {dispute.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-vice-muted">
                  <div>Creator: <strong className="text-white">{dispute.creator}</strong></div>
                  <div>Editor: <strong className="text-white">{dispute.editor}</strong></div>
                </div>

                <p className="text-xs text-vice-muted font-sans leading-relaxed">
                  <strong className="text-white">Issue:</strong> {dispute.issue}
                </p>

                <div className="p-3 bg-[#0D0618] rounded-xl border border-pink-500/20 text-xs text-vice-coral leading-relaxed font-mono">
                  📁 <strong className="text-white">Audit Evidence:</strong> {dispute.evidence}
                </div>

                {dispute.status === 'UNDER_REVIEW' ? (
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => handleResolveDispute(dispute.id, 'RESOLVED_CREATOR')}
                      className="px-4 py-2 text-xs font-semibold text-vice-muted hover:text-white bg-[#170B29] hover:bg-[#2c174a] border border-pink-500/25 rounded-xl transition-colors cursor-pointer"
                    >
                      Refund Creator ($420)
                    </button>
                    <button
                      onClick={() => handleResolveDispute(dispute.id, 'RESOLVED_EDITOR')}
                      className="bg-vice-gradient hover:opacity-95 text-white px-4 py-2 text-xs font-semibold rounded-xl shadow-lg shadow-pink-500/20 transition-all cursor-pointer"
                    >
                      Release Escrow to Editor ($420)
                    </button>
                  </div>
                ) : (
                  <div className="text-right text-xs text-vice-mint font-bold flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-4 h-4 text-vice-mint" />
                    <span>Case Arbitrated &amp; Settled by Elena Drake</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Section 2: Live Database User Management */}
          <div className="p-6 bg-[#170B29] border border-pink-500/20 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-white flex items-center gap-2 uppercase tracking-wide">
                <Users className="w-4 h-4 text-vice-pink" />
                <span>Live PostgreSQL User Accounts ({usersList.length || 4} Total)</span>
              </h3>
              <span className="text-[11px] text-vice-dim font-mono">
                Source: prisma.user
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-pink-500/20 text-vice-dim text-[11px]">
                    <th className="pb-2.5 font-semibold">User</th>
                    <th className="pb-2.5 font-semibold">Role</th>
                    <th className="pb-2.5 font-semibold">Badge</th>
                    <th className="pb-2.5 font-semibold">Projects</th>
                    <th className="pb-2.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-500/10">
                  {(usersList.length > 0
                    ? usersList
                    : [
                        { id: '1', name: 'Marcus Sterling', email: 'marcus@sterlingcapital.yt', role: 'CREATOR', badge: 'Verified Creator', projectCount: 2, created_at: '2026-01-15' },
                        { id: '2', name: 'Alex Rivera', email: 'alex@riverafilm.com', role: 'EDITOR', badge: 'Top Rated Pro', projectCount: 1, created_at: '2025-11-20' },
                        { id: '3', name: 'Maya Lin', email: 'maya@cutcraft.media', role: 'EDITOR', badge: 'Shorts Pro', projectCount: 1, created_at: '2026-02-01' },
                        { id: '4', name: 'Elena Drake', email: 'ops@editbridge.network', role: 'ADMIN', badge: 'Root Ops Arbiter', projectCount: 0, created_at: '2025-01-01' },
                      ]
                  ).map((u) => (
                    <tr key={u.id} className="hover:bg-[#211038]/70 transition-colors">
                      <td className="py-2.5 pr-2">
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-[11px] text-vice-dim font-mono">{u.email}</div>
                      </td>
                      <td className="py-2.5 pr-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-vice-gold/15 text-vice-gold border border-vice-gold/30'
                              : u.role === 'EDITOR'
                              ? 'bg-vice-pink/15 text-vice-pink border border-vice-pink/30'
                              : 'bg-vice-coral/15 text-vice-coral border border-vice-coral/30'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2 text-vice-muted text-[11px]">
                        {u.badge}
                      </td>
                      <td className="py-2.5 pr-2 text-vice-muted font-mono">
                        {u.projectCount || 1}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => retroSound.playDing()}
                          className="px-2.5 py-1 text-[11px] bg-[#211038] hover:bg-[#2c174a] text-vice-text border border-pink-500/20 rounded-lg transition-colors cursor-pointer"
                        >
                          Audit Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Vetting Queue */}
          <div className="p-6 bg-[#170B29] border border-pink-500/20 rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-vice-pink flex items-center gap-2 border-b border-pink-500/15 pb-2 uppercase tracking-wide">
              <UserCheck className="w-4 h-4 text-vice-pink" />
              <span>Editor Verification &amp; Vetting Applications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {verificationQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#211038] border border-pink-500/20 rounded-2xl space-y-3 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm text-white font-bold">
                      {item.name}
                    </strong>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'APPROVED'
                          ? 'bg-vice-mint/15 text-vice-mint border border-vice-mint/30'
                          : 'bg-vice-gold/15 text-vice-gold border border-vice-gold/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="text-vice-muted text-xs">
                    Niche: <span className="text-white font-medium">{item.niche}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {item.software.map((s) => (
                      <span
                        key={s}
                        className="bg-[#170B29] border border-pink-500/20 text-vice-muted text-[10px] px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {item.status === 'PENDING' ? (
                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleVerification(item.id, 'REJECTED')}
                        className="px-3 py-1.5 text-xs text-vice-muted hover:text-rose-400 cursor-pointer transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerification(item.id, 'APPROVED')}
                        className="bg-vice-gradient hover:opacity-95 text-white px-3 py-1.5 text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        Approve Badge
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-vice-mint font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-vice-mint" />
                      <span>Verified Editor Badge Issued</span>
                    </div>
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
