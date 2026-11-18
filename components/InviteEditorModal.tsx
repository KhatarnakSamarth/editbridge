'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Copy, Check, Sparkles, Send } from 'lucide-react';
import { retroSound } from '@/lib/soundEffects';
import { Portal } from '@/components/Portal';

interface InviteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteEditorModal({ isOpen, onClose }: InviteEditorModalProps) {
  const [editorEmail, setEditorEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [invited, setInvited] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const inviteLink = 'https://editbridge.network/join/invite?ref=creator_sterling_2026';

  const handleCopy = () => {
    retroSound.playDing();
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorEmail.trim()) return;
    retroSound.playDing();
    setInvited(true);
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="glass-panel max-w-lg w-full max-h-[92vh] flex flex-col bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-colors my-auto">
          {/* Titlebar */}
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#070b14] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100 truncate pr-2">
              <UserPlus className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>INVITE YOUR EXISTING VIDEO EDITOR</span>
            </span>
            <button
              type="button"
              onClick={() => {
                retroSound.playClick();
                onClose();
              }}
              className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-sm space-y-4 overflow-y-auto flex-1 min-h-0">
            <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 rounded-xl text-xs text-cyan-900 dark:text-cyan-200 leading-relaxed">
              💡 <strong className="text-cyan-950 dark:text-white">Bring Your Own Editor:</strong> EditBridge lets you onboard your trusted editors into one organized workspace for timestamp reviews, revision limits, and 30/70 escrow protection.
            </div>

            {invited ? (
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-900 dark:text-emerald-200 text-center space-y-3">
                <p className="font-bold text-sm text-emerald-600 dark:text-emerald-300">🎉 Invitation Dispatched!</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-100">
                  We sent a fast-onboarding link to <strong className="text-slate-900 dark:text-white">{editorEmail}</strong>. When they click the link, they will automatically join your active workspace.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setInvited(false);
                    setEditorEmail('');
                    onClose();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1.5">
                    Editor&apos;s Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    value={editorEmail}
                    onChange={(e) => setEditorEmail(e.target.value)}
                    placeholder="editor@studio.com"
                    className="w-full px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1.5">
                    Or Share Custom Direct Link:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteLink}
                      className="flex-1 px-3.5 py-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-xl font-mono font-medium flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Direct Invite</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
