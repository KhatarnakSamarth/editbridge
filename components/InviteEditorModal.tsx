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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="win95-window max-w-lg w-full">
        <div className="win95-titlebar">
          <span className="flex items-center gap-1 font-bold">
            <UserPlus className="w-4 h-4 text-yellow-300" />
            INVITE YOUR EXISTING VIDEO EDITOR TO EDITBRIDGE
          </span>
          <button
            onClick={() => {
              retroSound.playClick();
              onClose();
            }}
            className="w-5 h-5 bg-[#c0c0c0] text-black border border-black text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-4 bg-[#c0c0c0] text-xs font-sans space-y-3">
          <div className="p-2.5 bg-blue-50 border border-blue-400 font-mono text-[11px] text-blue-900 leading-relaxed">
            💡 <strong>No need to replace your current editor:</strong> EditBridge lets you bring your trusted editors into one organized space for timestamp reviews, revision limits, and milestone protection.
          </div>

          {invited ? (
            <div className="p-4 bg-green-50 border-2 border-green-600 text-green-900 font-mono text-center space-y-2">
              <p className="font-bold text-sm">🎉 Invitation Dispatched!</p>
              <p className="text-xs">
                We sent a fast-onboarding link to <strong>{editorEmail}</strong>. When they join, they will be automatically connected to your workspace.
              </p>
              <button
                onClick={() => {
                  setInvited(false);
                  setEditorEmail('');
                  onClose();
                }}
                className="win95-button win95-button-primary px-4 py-1 text-xs font-bold"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-neutral-800 font-mono mb-1">
                  Editor&apos;s Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={editorEmail}
                  onChange={(e) => setEditorEmail(e.target.value)}
                  placeholder="editor@studio.com"
                  className="win95-sunken w-full px-2.5 py-1.5 text-xs text-neutral-900"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 font-mono mb-1">
                  Or Share Custom Direct Link:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="win95-sunken flex-1 px-2.5 py-1.5 text-xs font-mono text-neutral-700 bg-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="win95-button px-3 py-1 font-mono font-bold flex items-center gap-1 text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="win95-button px-3 py-1 font-bold font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="win95-button win95-button-primary px-4 py-1 font-bold font-mono flex items-center gap-1.5"
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
