'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Copy,
  Check,
  Sparkles,
  Send,
  Share2,
  Link2,
  Shield,
  Clock,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { retroSound } from '@/lib/soundEffects';
import { Portal } from '@/components/Portal';
import { UserRole, Project } from '@/types';

interface InviteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: UserRole;
  project?: Project;
}

type InviteRoleTarget = 'EDITOR' | 'CREATOR' | 'REVIEWER';
type PermissionLevel = 'FULL_WORKSPACE' | 'REVIEW_ONLY' | 'VIEW_ONLY';
type ExpirationOption = '7_DAYS' | '30_DAYS' | 'NEVER';

export function InviteEditorModal({
  isOpen,
  onClose,
  role = 'CREATOR',
  project,
}: InviteEditorModalProps) {
  // Determine default target role based on who is opening the modal
  const defaultTarget: InviteRoleTarget = role === 'EDITOR' ? 'CREATOR' : 'EDITOR';

  const [targetRole, setTargetRole] = useState<InviteRoleTarget>(defaultTarget);
  const [customSlug, setCustomSlug] = useState<string>('');
  const [permission, setPermission] = useState<PermissionLevel>('FULL_WORKSPACE');
  const [expiration, setExpiration] = useState<ExpirationOption>('30_DAYS');
  const [editorEmail, setEditorEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [invited, setInvited] = useState(false);
  const [signedToken, setSignedToken] = useState<string>('');

  // Fetch cryptographically signed invite token
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/invite/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: project?.id || 'proj-demo-1',
        role: targetRole,
        permission,
        expiration,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.token) {
          setSignedToken(res.token);
        }
      })
      .catch(() => {});
  }, [isOpen, project?.id, targetRole, permission, expiration]);

  // Initialize slug when project loads or changes
  useEffect(() => {
    if (project) {
      const baseSlug = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 24)
        .replace(/^-+|-+$/g, '');
      setCustomSlug(`${baseSlug || 'project'}-collab`);
    } else {
      setCustomSlug('editbridge-collab');
    }
  }, [project]);

  // Sync default target when role prop changes
  useEffect(() => {
    setTargetRole(role === 'EDITOR' ? 'CREATOR' : 'EDITOR');
  }, [role]);

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

  // Build Dynamic Custom Invite URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://editbridge.network';
  const projectId = project?.id || 'active-project';
  const roleParam = targetRole.toLowerCase();
  const permParam = permission.toLowerCase();
  const cleanSlug = customSlug.trim() ? encodeURIComponent(customSlug.trim()) : 'invite';
  const dynamicInviteUrl = signedToken
    ? `${origin}/join?project=${projectId}&role=${roleParam}&token=${signedToken}`
    : `${origin}/join?project=${projectId}&role=${roleParam}&ref=${cleanSlug}&perm=${permParam}&exp=${expiration.toLowerCase()}`;

  const handleCopy = () => {
    retroSound.playDing();
    navigator.clipboard.writeText(dynamicInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorEmail.trim()) return;
    retroSound.playDing();
    setInvited(true);
  };

  // Modal Title and descriptions tailored to current active role
  const modalHeading =
    role === 'CREATOR'
      ? 'INVITE VIDEO EDITOR OR COLLABORATOR'
      : role === 'EDITOR'
      ? 'GENERATE COLLABORATION & CLIENT INVITE LINK'
      : 'GENERATE WORKSPACE ACCESS LINK';

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="glass-panel max-w-lg w-full max-h-[92vh] flex flex-col bg-[#170B29] border border-pink-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/10 transition-colors my-auto">
          {/* Titlebar */}
          <div className="px-5 py-3.5 bg-[#0D0618] border-b border-pink-500/20 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-2 font-bold text-xs text-white truncate pr-2">
              {role === 'EDITOR' ? (
                <Share2 className="w-4 h-4 text-vice-pink shrink-0" />
              ) : (
                <UserPlus className="w-4 h-4 text-vice-pink shrink-0" />
              )}
              <span>{modalHeading}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                retroSound.playClick();
                onClose();
              }}
              className="w-7 h-7 rounded-lg bg-[#211038] hover:bg-[#2c174a] text-vice-muted hover:text-white border border-pink-500/25 text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 text-sm space-y-4 overflow-y-auto flex-1 min-h-0">
            {/* Informational banner */}
            <div className="p-3.5 bg-pink-500/10 border border-pink-500/25 rounded-xl text-xs text-vice-text leading-relaxed">
              💡 <strong className="text-white">Custom Invite Engine:</strong> Generate custom direct onboarding links with customized permissions, roles, and project tokens to invite external editors, clients, or agency reviewers.
            </div>

            {invited ? (
              <div className="p-5 bg-vice-mint/10 border border-vice-mint/30 rounded-xl text-white text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-vice-mint/20 text-vice-mint flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-vice-mint">🎉 Direct Invitation Dispatched!</p>
                <p className="text-xs text-vice-muted">
                  We sent a customized invitation link to <strong className="text-white">{editorEmail}</strong> for project <strong className="text-white">{project?.title || 'Active Project'}</strong> as <strong>{targetRole}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setInvited(false);
                    setEditorEmail('');
                    onClose();
                  }}
                  className="bg-vice-gradient hover:opacity-95 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-500/25 cursor-pointer active:scale-95"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Target Role Selection */}
                <div>
                  <label className="block font-semibold text-white text-xs mb-1.5 flex items-center gap-1.5">
                    <span>1. Select Target Role to Invite:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: 'EDITOR' as const, label: 'Video Editor', desc: 'Edits & Uploads' },
                      { role: 'CREATOR' as const, label: 'Client / Creator', desc: 'Reviews & Approves' },
                      { role: 'REVIEWER' as const, label: 'Reviewer', desc: 'Timestamp Notes Only' },
                    ].map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => {
                          retroSound.playClick();
                          setTargetRole(item.role);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          targetRole === item.role
                            ? 'border-pink-500 bg-pink-500/20 text-white shadow-xs'
                            : 'border-pink-500/20 bg-[#211038] text-vice-muted hover:border-pink-500/40'
                        }`}
                      >
                        <span className="block font-bold text-xs">{item.label}</span>
                        <span className="block text-[10px] text-vice-dim mt-0.5">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Link Slug & Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-white text-xs mb-1.5">
                      2. Custom Link Slug / Referral Code:
                    </label>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                      placeholder="e.g. alex-cut1"
                      className="w-full px-3.5 py-2 text-xs font-mono text-white bg-[#0D0618] border border-pink-500/30 rounded-xl focus:border-pink-500 focus:outline-hidden placeholder:text-vice-dim"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-white text-xs mb-1.5">
                      3. Permission Scope:
                    </label>
                    <select
                      value={permission}
                      onChange={(e) => setPermission(e.target.value as PermissionLevel)}
                      className="w-full px-3 py-2 text-xs text-white bg-[#0D0618] border border-pink-500/30 rounded-xl focus:border-pink-500 focus:outline-hidden"
                    >
                      <option value="FULL_WORKSPACE" className="bg-[#170B29] text-white">Full Access (Review, Upload, Chat)</option>
                      <option value="REVIEW_ONLY" className="bg-[#170B29] text-white">Review &amp; Pin Timestamps Only</option>
                      <option value="VIEW_ONLY" className="bg-[#170B29] text-white">View Only (Watermarked Demo)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Live Custom Generated Link Display */}
                <div>
                  <label className="block font-semibold text-white text-xs mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-vice-pink" />
                      <span>Custom Invite Link (Ready to Share):</span>
                    </span>
                    <span className="text-[10px] text-vice-dim font-mono">
                      Role: {targetRole} • Scope: {permission}
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={dynamicInviteUrl}
                      className="flex-1 px-3.5 py-2 text-xs font-mono text-vice-muted bg-[#0D0618] border border-pink-500/30 rounded-xl select-all truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-xl font-mono font-bold flex items-center gap-1.5 text-xs bg-vice-gradient hover:opacity-95 text-white shadow-md shadow-pink-500/25 transition-all shrink-0 cursor-pointer active:scale-95"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-vice-mint" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* 4. Or Send Direct Email */}
                <form onSubmit={handleSubmit} className="pt-2 border-t border-pink-500/15 space-y-3">
                  <label className="block font-semibold text-white text-xs">
                    Or Dispatch Direct Email Invitation:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={editorEmail}
                      onChange={(e) => setEditorEmail(e.target.value)}
                      placeholder="collaborator@studio.com"
                      className="flex-1 px-3.5 py-2 text-xs text-white bg-[#0D0618] border border-pink-500/30 rounded-xl focus:border-pink-500 focus:outline-hidden placeholder:text-vice-dim transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!editorEmail.trim()}
                      className="bg-vice-gradient hover:opacity-95 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Send Invite</span>
                    </button>
                  </div>
                </form>

                {/* Footer buttons */}
                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-vice-muted hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
