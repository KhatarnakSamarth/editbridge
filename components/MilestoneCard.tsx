'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  Receipt,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';
import { Portal } from '@/components/Portal';

interface MilestoneCardProps {
  onShowPaymentModal?: () => void;
}

export function MilestoneCard({ onShowPaymentModal }: MilestoneCardProps) {
  const {
    activeProject,
    fundUpfrontMilestone,
    releaseFinalMilestone,
    activeRole,
  } = useEditBridge();

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!activeProject) return null;

  const ms1 = activeProject.milestones?.[0] || {
    id: 'ms-1',
    name: 'Milestone 1: 30% Upfront Kickoff',
    percentage: 30,
    amount: Math.round(activeProject.budget * 0.3),
    status: 'ESCROW_FUNDED',
  };
  const ms2 = activeProject.milestones?.[1] || {
    id: 'ms-2',
    name: 'Milestone 2: 70% Final Master Release',
    percentage: 70,
    amount: Math.round(activeProject.budget * 0.7),
    status: 'PENDING',
  };

  const isMs1Released = ms1 && (ms1.status === 'RELEASED' || ms1.status === 'ESCROW_FUNDED');
  const isMs2Released = ms2 && ms2.status === 'RELEASED';

  return (
    <div className="flex flex-col gap-4">
      {/* Escrow summary banner */}
      <div className="p-5 bg-gradient-to-r from-blue-900/40 via-indigo-950/60 to-purple-900/40 dark:from-blue-950/60 dark:via-[#0e1526] dark:to-purple-950/60 text-slate-900 dark:text-white rounded-2xl border border-blue-500/20 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>TRANSPARENT 30/70 ESCROW PROTECTION</span>
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1.5">
            Total Project Budget: <strong className="text-slate-950 dark:text-white font-mono text-base">${activeProject.budget}.00 USD</strong>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured milestone protection prevents scope creep and guarantees payment security for both creator and editor.
          </p>
        </div>

        {isMs2Released ? (
          <button
            onClick={() => {
              retroSound.playDing();
              setShowReceiptModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 self-start sm:self-center shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Receipt className="w-4 h-4" />
            <span>View Receipt &amp; Invoice</span>
          </button>
        ) : (
          <div className="bg-white/80 dark:bg-[#070b14]/80 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-right shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-mono uppercase font-semibold">Pending Final Payout:</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold font-mono text-base">
              ${ms2 ? ms2.amount : 0}.00 USD
            </span>
          </div>
        )}
      </div>

      {/* Two Milestones breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Milestone 1 */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
            isMs1Released
              ? 'bg-white dark:bg-[#0e1526] border-slate-200 dark:border-slate-800 shadow-sm'
              : 'bg-white dark:bg-[#0e1526] border-blue-400/40 dark:border-blue-500/40 shadow-md shadow-blue-500/10'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                MILESTONE 1 (30%)
              </span>
              <span className="font-mono font-bold text-xs text-blue-600 dark:text-cyan-400">
                ${ms1 ? ms1.amount : 0}.00 USD
              </span>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 mt-3 font-semibold">
              Kickoff Deposit &amp; Raw Footage Access
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Secures editor&apos;s schedule and authorizes raw footage and project asset downloads.
            </p>
          </div>

          <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                isMs1Released ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isMs1Released ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>FUNDED IN ESCROW</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>PAYMENT DUE</span>
                </>
              )}
            </span>

            {!isMs1Released && activeRole === 'CREATOR' && (
              <button
                onClick={() => {
                  fundUpfrontMilestone(activeProject.id);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                Deposit 30% (${ms1?.amount})
              </button>
            )}
          </div>
        </div>

        {/* Milestone 2 */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
            isMs2Released
              ? 'bg-white dark:bg-[#0e1526] border-emerald-400/50 dark:border-emerald-600/50 shadow-md shadow-emerald-500/10'
              : 'bg-white dark:bg-[#0e1526] border-amber-300 dark:border-amber-600/40 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                MILESTONE 2 (70%)
              </span>
              <span className="font-mono font-bold text-xs text-blue-600 dark:text-cyan-400">
                ${ms2 ? ms2.amount : 0}.00 USD
              </span>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 mt-3 font-semibold">
              Final Master Approval &amp; Commercial Delivery
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Releasing this payout grants the creator immediate download access to uncompressed 4K master files and marks project complete.
            </p>
          </div>

          <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                isMs2Released ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isMs2Released ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>RELEASED TO EDITOR</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>HELD PENDING FINAL REVIEW</span>
                </>
              )}
            </span>

            {!isMs2Released && activeRole === 'CREATOR' && (
              <button
                onClick={() => {
                  releaseFinalMilestone(activeProject.id);
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/25 active:scale-95 transition-all"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Release 70% (${ms2?.amount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal (Portal to Document Body) */}
      {showReceiptModal && (
        <Portal>
          <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowReceiptModal(false);
            }}
          >
            <div className="glass-panel max-w-lg w-full max-h-[92vh] flex flex-col bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#070b14] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs truncate pr-2">
                  <Receipt className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>OFFICIAL EDITBRIDGE TRANSACTION RECEIPT</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  title="Close"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 font-sans text-xs space-y-4 text-slate-700 dark:text-slate-200 overflow-y-auto flex-1 min-h-0">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3.5 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">EDITBRIDGE SETTLEMENT INVOICE</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Receipt ID: EB-INV-{activeProject.id.toUpperCase()}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-3 py-1 rounded-full font-bold text-[11px]">
                      PAID IN FULL
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400">Project:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeProject.title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400">Client / Creator:</span>
                    <span className="text-slate-900 dark:text-white">{activeProject.creator_name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400">Assigned Editor:</span>
                    <span className="text-slate-900 dark:text-white">{activeProject.editor_name || 'Assigned Editor'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400">Milestone 1 (30% Upfront):</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">${ms1?.amount}.00 USD (Settled)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400">Milestone 2 (70% Final Master):</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">${ms2?.amount}.00 USD (Settled)</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm">
                    <span className="text-slate-900 dark:text-white">TOTAL SETTLED:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">${activeProject.budget}.00 USD</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  ✓ Master 4K ProRes files, project archives, and full commercial distribution rights transferred to client.
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(false)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Close Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
