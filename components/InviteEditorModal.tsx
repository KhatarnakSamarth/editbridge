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
        <div className="glass-panel max-w-lg w-full max-h-[92vh] flex flex-col bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-colors my-auto">
          {/* Titlebar */}
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#070b14] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100 truncate pr-2">
              {role === 'EDITOR' ? (
                <Share2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              ) : (
                <UserPlus className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              )}
              <span>{modalHeading}</span>
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
          <div className="p-5 sm:p-6 text-sm space-y-4 overflow-y-auto flex-1 min-h-0">
            {/* Informational banner */}
            <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 rounded-xl text-xs text-cyan-900 dark:text-cyan-200 leading-relaxed">
              💡 <strong className="text-cyan-950 dark:text-white">Custom Invite Engine:</strong> Generate custom direct onboarding links with customized permissions, roles, and project tokens to invite external editors, clients, or agency reviewers.
            </div>

            {invited ? (
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-900 dark:text-emerald-200 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-emerald-700 dark:text-emerald-300">🎉 Direct Invitation Dispatched!</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-200">
                  We sent a customized invitation link to <strong className="text-slate-900 dark:text-white">{editorEmail}</strong> for project <strong className="text-slate-900 dark:text-white">{project?.title || 'Active Project'}</strong> as <strong>{targetRole}</strong>.
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
              <div className="space-y-4">
                {/* 1. Target Role Selection */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1.5 flex items-center gap-1.5">
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
                            ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-950 dark:text-white shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-bold text-xs">{item.label}</span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Link Slug & Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1.5">
                      2. Custom Link Slug / Referral Code:
                    </label>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                      placeholder="e.g. alex-cut1"
                      className="w-full px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1.5">
                      3. Permission Scope:
                    </label>
                    <select
                      value={permission}
                      onChange={(e) => setPermission(e.target.value as PermissionLevel)}
                      className="w-full px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    >
                      <option value="FULL_WORKSPACE">Full Access (Review, Upload, Chat)</option>
                      <option value="REVIEW_ONLY">Review &amp; Pin Timestamps Only</option>
                      <option value="VIEW_ONLY">View Only (Watermarked Demo)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Live Custom Generated Link Display */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Custom Invite Link (Ready to Share):</span>
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Role: {targetRole} • Scope: {permission}
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={dynamicInviteUrl}
                      className="flex-1 px-3.5 py-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl select-all truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-xl font-mono font-bold flex items-center gap-1.5 text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-xs transition-all shrink-0 cursor-pointer active:scale-95"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* 4. Or Send Direct Email */}
                <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs">
                    Or Dispatch Direct Email Invitation:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={editorEmail}
                      onChange={(e) => setEditorEmail(e.target.value)}
                      placeholder="collaborator@studio.com"
                      className="flex-1 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!editorEmail.trim()}
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Send Invite</span>
                    </button>
                  </div>
                </form>

                {/* Footer buttons */}
                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
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
