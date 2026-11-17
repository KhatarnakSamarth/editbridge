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
    <div className="flex flex-col gap-3">
      {/* Escrow summary banner */}
      <div className="win95-sunken p-3 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-black">
        <div>
          <div className="flex items-center gap-1.5 text-yellow-300 font-mono text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>TRANSPARENT MILESTONE PROTECTION</span>
          </div>
          <p className="text-xs text-neutral-200 mt-1">
            Total Project Budget: <strong className="text-white font-mono text-sm">${activeProject.budget}.00 USD</strong>
          </p>
          <p className="text-[11px] text-neutral-300 font-mono">
            Structured 30% / 70% payment milestone to protect both Creator &amp; Editor.
          </p>
        </div>

        {isMs2Released ? (
          <button
            onClick={() => {
              retroSound.playDing();
              setShowReceiptModal(true);
            }}
            className="win95-button win95-button-success px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-center"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>View Receipt &amp; Invoice</span>
          </button>
        ) : (
          <div className="bg-black/40 border border-neutral-600 px-3 py-1.5 font-mono text-xs text-right">
            <span className="text-neutral-400 block text-[10px]">PENDING FINAL PAYOUT:</span>
            <span className="text-yellow-300 font-bold text-sm">
              ${ms2 ? ms2.amount : 0}.00 USD
            </span>
          </div>
        )}
      </div>

      {/* Two Milestones breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Milestone 1 */}
        <div
          className={`win95-window p-3 flex flex-col justify-between ${
            isMs1Released ? 'bg-[#d8d8d8]' : 'bg-[#c0c0c0]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-neutral-400">
              <span className="font-bold text-xs font-mono text-neutral-900">
                MILESTONE 1 (30%)
              </span>
              <span className="font-mono font-bold text-xs text-[#000080]">
                ${ms1 ? ms1.amount : 0}.00 USD
              </span>
            </div>

            <p className="text-xs text-neutral-700 mt-2 font-medium">
              Kickoff Deposit &amp; Raw Footage Access
            </p>
            <p className="text-[11px] text-neutral-600 mt-1">
              Secures editor&apos;s schedule and authorizes raw footage and project asset downloads.
            </p>
          </div>

          <div className="mt-4 pt-2 border-t border-neutral-400 flex items-center justify-between">
            <span
              className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
                isMs1Released ? 'text-green-800' : 'text-amber-800'
              }`}
            >
              {isMs1Released ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                  <span>FUNDED IN ESCROW</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>PAYMENT DUE</span>
                </>
              )}
            </span>

            {!isMs1Released && activeRole === 'CREATOR' && (
              <button
                onClick={() => {
                  fundUpfrontMilestone(activeProject.id);
                }}
                className="win95-button win95-button-primary px-3 py-1 text-xs font-bold font-mono"
              >
                Deposit 30% (${ms1?.amount})
              </button>
            )}
          </div>
        </div>

        {/* Milestone 2 */}
        <div
          className={`win95-window p-3 flex flex-col justify-between ${
            isMs2Released
              ? 'bg-[#d8d8d8] border-green-600'
              : 'bg-[#c0c0c0] border-2 border-amber-600'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-neutral-400">
              <span className="font-bold text-xs font-mono text-neutral-900">
                MILESTONE 2 (70%)
              </span>
              <span className="font-mono font-bold text-xs text-[#000080]">
                ${ms2 ? ms2.amount : 0}.00 USD
              </span>
            </div>

            <p className="text-xs text-neutral-700 mt-2 font-medium">
              Final Master Approval &amp; Commercial Delivery
            </p>
            <p className="text-[11px] text-neutral-600 mt-1">
              Releasing this payout grants the creator immediate download access to uncompressed 4K master files and marks project complete.
            </p>
          </div>

          <div className="mt-4 pt-2 border-t border-neutral-400 flex items-center justify-between">
            <span
              className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
                isMs2Released ? 'text-green-800' : 'text-amber-800'
              }`}
            >
              {isMs2Released ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                  <span>RELEASED TO EDITOR</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>HELD PENDING FINAL REVIEW</span>
                </>
              )}
            </span>

            {!isMs2Released && activeRole === 'CREATOR' && (
              <button
                onClick={() => {
                  releaseFinalMilestone(activeProject.id);
                }}
                className="win95-button win95-button-amber px-3 py-1.5 text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95"
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
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="win95-window max-w-lg w-full">
            <div className="win95-titlebar">
              <span className="flex items-center gap-1 font-bold">
                <Receipt className="w-4 h-4" />
                OFFICIAL EDITBRIDGE TRANSACTION RECEIPT
              </span>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-5 h-5 bg-[#c0c0c0] text-black border border-black text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-white font-mono text-xs space-y-3 text-neutral-900">
              <div className="border-b-2 border-black pb-2 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm">EDITBRIDGE SETTLEMENT INVOICE</h3>
                  <p className="text-[11px] text-neutral-600">
                    Receipt ID: EB-INV-{activeProject.id.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-800 border border-green-500 px-2 py-0.5 font-bold text-[11px]">
                    PAID IN FULL
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span>Project:</span>
                  <span className="font-bold">{activeProject.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span>Client / Creator:</span>
                  <span>{activeProject.creator_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span>Assigned Editor:</span>
                  <span>{activeProject.editor_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span>Milestone 1 (30% Upfront):</span>
                  <span>${ms1?.amount}.00 USD (Settled)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span>Milestone 2 (70% Final Master):</span>
                  <span>${ms2?.amount}.00 USD (Settled)</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-black font-bold text-sm">
                  <span>TOTAL SETTLED:</span>
                  <span>${activeProject.budget}.00 USD</span>
                </div>
              </div>

              <div className="p-2 bg-neutral-100 border border-neutral-300 text-[10px] text-neutral-600">
                Master 4K files, project archives, and full commercial distribution rights transferred to client.
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="win95-button win95-button-primary px-4 py-1 text-xs font-bold"
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
