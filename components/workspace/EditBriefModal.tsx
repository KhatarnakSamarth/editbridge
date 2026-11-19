'use client';

import React, { useState, useEffect } from 'react';
import { FileText, X, CheckCircle2 } from 'lucide-react';
import { Portal } from '@/components/Portal';
import { Project } from '@/types';

interface EditBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSave: (data: {
    brief: string;
    aspectRatio?: '16:9' | '9:16';
    targetDuration?: number;
    resolution?: string;
    references?: string[];
    rawFootageLinks?: string[];
  }) => void;
}

export function EditBriefModal({
  isOpen,
  onClose,
  project,
  onSave,
}: EditBriefModalProps) {
  const [briefFormText, setBriefFormText] = useState('');
  const [briefAspectRatio, setBriefAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [briefTargetDuration, setBriefTargetDuration] = useState(10);
  const [briefResolution, setBriefResolution] = useState('4K (3840x2160)');
  const [briefReferencesText, setBriefReferencesText] = useState('');
  const [briefFootageLinksText, setBriefFootageLinksText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (project && isOpen) {
      setBriefFormText(project.brief || '');
      setBriefAspectRatio(project.deliverables?.aspect_ratio === '9:16' ? '9:16' : '16:9');
      setBriefTargetDuration(project.deliverables?.target_duration_minutes || 10);
      setBriefResolution(project.deliverables?.resolution || '4K (3840x2160)');
      setBriefReferencesText((project.references || []).join('\n'));
      setBriefFootageLinksText((project.raw_footage_links || []).join('\n'));
      setIsSaving(false);
    }
  }, [project, isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const refs = briefReferencesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const footage = briefFootageLinksText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      brief: briefFormText,
      aspectRatio: briefAspectRatio,
      targetDuration: Number(briefTargetDuration) || 10,
      resolution: briefResolution,
      references: refs,
      rawFootageLinks: footage,
    });

    setIsSaving(false);
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
        <div className="bg-white dark:bg-[#0c1222] border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Edit / Add Creative Brief
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Directives, story arc, deliverables specs, and raw assets for {project.title}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Brief Narrative */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-900 dark:text-slate-200 block">
                Story Arc &amp; Creative Directive
              </label>
              <textarea
                rows={4}
                value={briefFormText}
                onChange={(e) => setBriefFormText(e.target.value)}
                placeholder="Describe the storyline, hook, pacing, tone of voice, visual energy, motion graphics style, and core call to action..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500 font-sans leading-relaxed"
                required
              />
            </div>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Aspect Ratio</label>
                <select
                  value={briefAspectRatio}
                  onChange={(e) => setBriefAspectRatio(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 focus:border-cyan-500"
                >
                  <option value="16:9">16:9 (Landscape YouTube)</option>
                  <option value="9:16">9:16 (Vertical Shorts/Reels)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Target Duration (min)</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={briefTargetDuration}
                  onChange={(e) => setBriefTargetDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Master Resolution</label>
                <select
                  value={briefResolution}
                  onChange={(e) => setBriefResolution(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 focus:border-cyan-500"
                >
                  <option value="4K (3840x2160)">4K (3840x2160)</option>
                  <option value="1080p (1920x1080)">1080p (1920x1080)</option>
                  <option value="1440p (2560x1440)">1440p 2K</option>
                  <option value="8K Master">8K Master</option>
                </select>
              </div>
            </div>

            {/* Raw Footage Links */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-900 dark:text-slate-200 block">
                Raw Footage Cloud Links (Google Drive, Dropbox, S3)
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enter one cloud URL per line.
              </p>
              <textarea
                rows={2}
                value={briefFootageLinksText}
                onChange={(e) => setBriefFootageLinksText(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/sample-raw-footage&#10;https://storage.editbridge.network/raw/a-cam.mp4"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* Style References */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-900 dark:text-slate-200 block">
                Style References &amp; Visual Inspiration Links
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                YouTube or Vimeo links representing desired pacing or graphics (one per line).
              </p>
              <textarea
                rows={2}
                value={briefReferencesText}
                onChange={(e) => setBriefReferencesText(e.target.value)}
                placeholder="https://youtube.com/watch?v=sample-vox-explainer&#10;https://youtube.com/watch?v=sample-visual-pacing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSaving ? 'Saving to Database...' : 'Save & Sync Brief'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
