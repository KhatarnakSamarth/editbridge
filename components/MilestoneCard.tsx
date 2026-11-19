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
      <div className="p-5 bg-gradient-to-r from-[#211038] via-[#170B29] to-[#211038] text-white rounded-2xl border border-pink-500/25 shadow-lg shadow-pink-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <div className="flex items-center gap-2 text-vice-pink font-bold text-xs tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-vice-mint" />
            <span>TRANSPARENT 30/70 ESCROW PROTECTION</span>
          </div>
          <p className="text-sm font-medium text-vice-text mt-1.5">
            Total Project Budget: <strong className="text-vice-gold font-mono text-base">${activeProject.budget}.00 USD</strong>
          </p>
          <p className="text-xs text-vice-muted mt-0.5">
            Structured milestone protection prevents scope creep and guarantees payment security for both creator and editor.
          </p>
        </div>

        {isMs2Released ? (
          <button
            onClick={() => {
              retroSound.playDing();
              setShowReceiptModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 self-start sm:self-center shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>View Receipt &amp; Invoice</span>
          </button>
        ) : (
          <div className="bg-[#0D0618]/80 border border-pink-500/25 rounded-xl px-4 py-2.5 text-xs text-right shadow-xs">
            <span className="text-vice-dim block text-[10px] font-mono uppercase font-semibold">Pending Final Payout:</span>
            <span className="text-vice-gold font-bold font-mono text-base">
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
              ? 'bg-[#170B29] border-pink-500/20 shadow-xs'
              : 'bg-[#170B29] border-pink-500/40 shadow-md shadow-pink-500/10'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-pink-500/20">
              <span className="font-bold text-xs text-vice-text uppercase tracking-wide">
                MILESTONE 1 (30%)
              </span>
              <span className="font-mono font-bold text-xs text-vice-gold">
                ${ms1 ? ms1.amount : 0}.00 USD
              </span>
            </div>

            <p className="text-xs text-vice-text mt-3 font-semibold">
              Kickoff Deposit &amp; Raw Footage Access
            </p>
            <p className="text-xs text-vice-muted mt-1 leading-relaxed">
              Secures editor&apos;s schedule and authorizes raw footage and project asset downloads.
            </p>
          </div>

          <div className="mt-6 pt-3.5 border-t border-pink-500/20 flex items-center justify-between">
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                isMs1Released ? 'text-vice-mint' : 'text-vice-gold'
              }`}
            >
              {isMs1Released ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-vice-mint" />
                  <span>FUNDED IN ESCROW</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-vice-gold" />
                  <span>PAYMENT DUE</span>
                </>
              )}
            </span>

            {!isMs1Released && activeRole === 'CREATOR' && (
              <button
                onClick={() => {
                  fundUpfrontMilestone(activeProject.id);
                }}
                className="bg-vice-gradient hover:opacity-95 text-white px-4 py-2 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
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
              ? 'bg-[#170B29] border-emerald-500/40 shadow-md shadow-emerald-500/10'
              : 'bg-[#170B29] border-pink-500/30 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-pink-500/20">
              <span className="font-bold text-xs text-vice-text uppercase tracking-wide">
                MILESTONE 2 (70%)
              </span>
              <span className="font-mono font-bold text-xs text-vice-gold">
                ${ms2 ? ms2.amount : 0}.00 USD
              </span>
            </div>

            <p className="text-xs text-vice-text mt-3 font-semibold">
              Final Master Approval &amp; Commercial Delivery
            </p>
            <p className="text-xs text-vice-muted mt-1 leading-relaxed">
              Releasing this payout grants the creator immediate download access to uncompressed 4K master files and marks project complete.
            </p>
          </div>

          <div className="mt-6 pt-3.5 border-t border-pink-500/20 flex items-center justify-between">
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                isMs2Released ? 'text-vice-mint' : 'text-vice-gold'
              }`}
            >
              {isMs2Released ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-vice-mint" />
                  <span>RELEASED TO EDITOR</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-vice-gold" />
                  <span>HELD PENDING FINAL REVIEW</span>
                </>
              )}
            </span>

            {!isMs2Released && activeRole === 'CREATOR' && (
              <button
                onClick={() => {
                  releaseFinalMilestone(activeProject.id);
                }}
                className="bg-gradient-to-r from-vice-pink via-vice-coral to-vice-gold hover:opacity-95 text-white px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
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
            <div className="glass-panel max-w-lg w-full max-h-[92vh] flex flex-col bg-[#170B29] border border-pink-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto">
              <div className="px-5 py-3.5 bg-[#211038] border-b border-pink-500/20 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-2 font-bold text-vice-text text-xs truncate pr-2">
                  <Receipt className="w-4 h-4 text-vice-mint shrink-0" />
                  <span>OFFICIAL EDITBRIDGE TRANSACTION RECEIPT</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="w-7 h-7 rounded-lg bg-[#2c174a] hover:bg-[#381e5e] text-vice-muted hover:text-vice-text text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  title="Close"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 font-sans text-xs space-y-4 text-vice-muted overflow-y-auto flex-1 min-h-0">
                <div className="border-b border-pink-500/20 pb-3.5 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-vice-text">EDITBRIDGE SETTLEMENT INVOICE</h3>
                    <p className="text-[11px] text-vice-dim font-mono mt-0.5">
                      Receipt ID: EB-INV-{activeProject.id.toUpperCase()}
                    </p>
                    <p className="text-[11px] text-vice-dim font-mono">
                      Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold text-[11px]">
                      PAID IN FULL
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-pink-500/10">
                    <span className="text-vice-dim">Project:</span>
                    <span className="font-semibold text-vice-text">{activeProject.title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-pink-500/10">
                    <span className="text-vice-dim">Client / Creator:</span>
                    <span className="text-vice-text">{activeProject.creator_name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-pink-500/10">
                    <span className="text-vice-dim">Assigned Editor:</span>
                    <span className="text-vice-text">{activeProject.editor_name || 'Assigned Editor'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-pink-500/10">
                    <span className="text-vice-dim">Milestone 1 (30% Upfront):</span>
                    <span className="font-mono font-semibold text-vice-mint">${ms1?.amount}.00 USD (Settled)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-pink-500/10">
                    <span className="text-vice-dim">Milestone 2 (70% Final Master):</span>
                    <span className="font-mono font-semibold text-vice-mint">${ms2?.amount}.00 USD (Settled)</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-pink-500/20 font-bold text-sm">
                    <span className="text-vice-text">TOTAL SETTLED:</span>
                    <span className="font-mono text-vice-gold text-base">${activeProject.budget}.00 USD</span>
                  </div>
                </div>

                <div className="p-3 bg-[#0D0618] border border-pink-500/20 rounded-xl text-[11px] text-vice-muted leading-relaxed">
                  ✓ Master 4K ProRes files, project archives, and full commercial distribution rights transferred to client.
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(false)}
                    className="bg-vice-gradient hover:opacity-95 text-white px-5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer"
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
