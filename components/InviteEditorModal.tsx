'use client';

import React, { useState } from 'react';
import { UserPlus, Copy, Check, Sparkles, Send } from 'lucide-react';
import { retroSound } from '@/lib/soundEffects';

interface InviteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteEditorModal({ isOpen, onClose }: InviteEditorModalProps) {
  const [editorEmail, setEditorEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [invited, setInvited] = useState(false);

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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="win95-window max-w-lg w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="win95-titlebar px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-2 font-bold text-xs text-slate-200">
            <UserPlus className="w-4 h-4 text-blue-400" />
            INVITE YOUR EXISTING VIDEO EDITOR TO EDITBRIDGE
          </span>
          <button
            onClick={() => {
              retroSound.playClick();
              onClose();
            }}
            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center"
            title="Close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 text-sm space-y-4">
          <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs text-blue-200 leading-relaxed">
            💡 <strong className="text-white">Bring Your Own Editor:</strong> EditBridge lets you onboard your trusted editors into one organized workspace for timestamp reviews, revision limits, and 30/70 escrow protection.
          </div>

          {invited ? (
            <div className="p-5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-200 text-center space-y-3">
              <p className="font-bold text-sm text-emerald-300">🎉 Invitation Dispatched!</p>
              <p className="text-xs text-emerald-100">
                We sent a fast-onboarding link to <strong className="text-white">{editorEmail}</strong>. When they click the link, they will automatically join your active workspace.
              </p>
              <button
                onClick={() => {
                  setInvited(false);
                  setEditorEmail('');
                  onClose();
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 text-xs mb-1.5">
                  Editor&apos;s Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={editorEmail}
                  onChange={(e) => setEditorEmail(e.target.value)}
                  placeholder="editor@studio.com"
                  className="w-full px-3 py-2 text-xs text-slate-100 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 text-xs mb-1.5">
                  Or Share Custom Direct Link:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="flex-1 px-3 py-2 text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded-lg select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-lg font-mono font-medium flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
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
  );
}
