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
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

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

  const ms1 = activeProject.milestones[0];
  const ms2 = activeProject.milestones[1];

  const isMs1Released = ms1 && (ms1.status === 'RELEASED' || ms1.status === 'ESCROW_FUNDED');
  const isMs2Released = ms2 && ms2.status === 'RELEASED';

  return (
    <div className="flex flex-col gap-4">
      {/* Escrow summary banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-lg border border-indigo-900/60 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>TRANSPARENT MILESTONE PROTECTION</span>
          </div>
          <p className="text-sm text-slate-200 mt-1">
            Total Project Budget: <strong className="text-white font-mono text-base">${activeProject.budget}.00 USD</strong>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured 30% / 70% payment milestone protects both Creator &amp; Editor against scope creep and non-payment.
          </p>
        </div>

        {isMs2Released ? (
          <button
            onClick={() => {
              retroSound.playDing();
              setShowReceiptModal(true);
            }}
            className="win95-button win95-button-success px-4 py-2 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center shadow-xs"
          >
            <Receipt className="w-4 h-4" />
            <span>View Receipt &amp; Invoice</span>
          </button>
        ) : (
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-4 py-2 text-xs text-right">
            <span className="text-slate-400 block text-[10px] font-mono">PENDING FINAL PAYOUT:</span>
            <span className="text-amber-400 font-bold font-mono text-sm">
              ${ms2 ? ms2.amount : 0}.00 USD
            </span>
          </div>
        )}
      </div>

      {/* Two Milestones breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Milestone 1 */}
        <div
          className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
            isMs1Released
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-slate-900 border-slate-700/80 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-semibold text-xs text-slate-200">
                MILESTONE 1 (30%)
              </span>
              <span className="font-mono font-bold text-xs text-blue-400">
                ${ms1 ? ms1.amount : 0}.00 USD
              </span>
            </div>

            <p className="text-xs text-slate-200 mt-2.5 font-medium">
              Kickoff Deposit &amp; Raw Footage Access
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Secures editor&apos;s schedule and authorizes raw footage and project asset downloads.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                isMs1Released ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isMs1Released ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
                className="win95-button win95-button-primary px-3.5 py-1.5 text-xs font-semibold"
              >
                Deposit 30% (${ms1?.amount})
              </button>
            )}
          </div>
        </div>

        {/* Milestone 2 */}
        <div
          className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
            isMs2Released
              ? 'bg-slate-900/90 border-emerald-800/80'
              : 'bg-slate-900 border-amber-700/60 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-semibold text-xs text-slate-200">
                MILESTONE 2 (70%)
              </span>
              <span className="font-mono font-bold text-xs text-blue-400">
                ${ms2 ? ms2.amount : 0}.00 USD
              </span>
            </div>

            <p className="text-xs text-slate-200 mt-2.5 font-medium">
              Final Master Approval &amp; Commercial Delivery
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Releasing this payout grants the creator immediate download access to uncompressed 4K master files and marks project complete.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                isMs2Released ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isMs2Released ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
                className="win95-button win95-button-amber px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Release 70% (${ms2?.amount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="win95-window max-w-lg w-full border border-slate-700 shadow-2xl">
            <div className="win95-titlebar">
              <span className="flex items-center gap-2 font-semibold text-slate-100">
                <Receipt className="w-4 h-4 text-emerald-400" />
                OFFICIAL EDITBRIDGE TRANSACTION RECEIPT
              </span>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-5 font-sans text-xs space-y-4 text-slate-200">
              <div className="border-b border-slate-700 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-white">EDITBRIDGE SETTLEMENT INVOICE</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Receipt ID: EB-INV-{activeProject.id.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded font-semibold text-[11px]">
                    PAID IN FULL
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Project:</span>
                  <span className="font-semibold text-white">{activeProject.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Client / Creator:</span>
                  <span className="text-white">{activeProject.creator_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Assigned Editor:</span>
                  <span className="text-white">{activeProject.editor_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Milestone 1 (30% Upfront):</span>
                  <span className="font-mono text-emerald-400">${ms1?.amount}.00 USD (Settled)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Milestone 2 (70% Final Master):</span>
                  <span className="font-mono text-emerald-400">${ms2?.amount}.00 USD (Settled)</span>
                </div>
                <div className="flex justify-between py-2 border-t border-slate-700 font-bold text-sm">
                  <span className="text-white">TOTAL SETTLED:</span>
                  <span className="font-mono text-emerald-300">${activeProject.budget}.00 USD</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded text-[11px] text-slate-400 leading-relaxed">
                ✓ Master 4K files, project archives, and full commercial distribution rights transferred to client.
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="win95-button win95-button-primary px-4 py-1.5 text-xs font-semibold"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
