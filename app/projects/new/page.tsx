'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FolderPlus,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { DeliverableSpec, Project } from '@/types';
import { retroSound } from '@/lib/soundEffects';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject, currentUser, isAuthenticated } = useEditBridge();

  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [category, setCategory] = useState<Project['category']>('YouTube Long-form');
  const [budget, setBudget] = useState(550);
  const [deadline, setDeadline] = useState('2026-12-05');
  const [revisionLimit, setRevisionLimit] = useState(2);
  const [references, setReferences] = useState(
    'https://youtube.com/watch?v=visual-pacing-guide'
  );
  const [rawFootageLinks, setRawFootageLinks] = useState(
    'https://drive.google.com/drive/folders/footage-archive-4k'
  );

  // Deliverables specs
  const [aspectRatio, setAspectRatio] = useState<DeliverableSpec['aspect_ratio']>('16:9');
  const [targetDuration, setTargetDuration] = useState(12);
  const [resolution, setResolution] = useState<DeliverableSpec['resolution']>('4K (3840x2160)');
  const [captionsIncluded, setCaptionsIncluded] = useState(true);
  const [soundDesign, setSoundDesign] = useState(true);
  const [colorGrading, setColorGrading] = useState(true);
  const [thumbnailConcept, setThumbnailConcept] = useState(false);

  const upfrontAmount = Math.round(budget * 0.3);
  const finalAmount = budget - upfrontAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brief.trim()) return;

    createProject({
      title: title.trim(),
      brief: brief.trim(),
      category,
      creator_id: currentUser.id,
      creator_name: currentUser.name,
      creator_avatar: currentUser.avatar,
      creator_channel: 'Sterling Capital',
      budget,
      currency: 'USD',
      deadline,
      revision_limit: revisionLimit,
      status: 'PAID',
      deliverables: {
        aspect_ratio: aspectRatio,
        target_duration_minutes: targetDuration,
        resolution,
        captions_included: captionsIncluded,
        thumbnail_concept: thumbnailConcept,
        sound_design: soundDesign,
        color_grading: colorGrading,
      },
      references: references.split('\n').filter((r) => r.trim().length > 0),
      raw_footage_links: rawFootageLinks.split('\n').filter((l) => l.trim().length > 0),
      milestones: [
        {
          id: `ms-${Date.now()}-1`,
          name: 'Milestone 1: Kickoff Deposit (30%)',
          description: 'Secures schedule and raw footage downloads',
          percentage: 30,
          amount: upfrontAmount,
          status: 'ESCROW_FUNDED',
          released_at: new Date().toISOString(),
        },
        {
          id: `ms-${Date.now()}-2`,
          name: 'Milestone 2: Final Delivery Master (70%)',
          description: 'Released after approval of revisions to unlock 4K Master',
          percentage: 70,
          amount: finalAmount,
          status: 'PENDING',
        },
      ],
      active_draft_url: undefined,
    });

    router.push('/workspace');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-vice-surface border border-vice-border rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-vice-pink/10 text-vice-pink flex items-center justify-center mx-auto">
            <FolderPlus className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-vice-text">
              Sign In to Post a Video Project Brief
            </h1>
            <p className="text-xs text-vice-muted">
              Only authenticated creators can fund escrow milestones and assign video editors.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signin?redirect=/projects/new"
              className="w-full sm:w-auto bg-vice-pink hover:bg-vice-pinkHover text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Sign In to Post Brief</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-vice-cardElevated hover:bg-vice-hover text-vice-text font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center border border-vice-border"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div className="mb-2">
        <Link
          href="/projects"
          onClick={() => retroSound.playClick()}
          className="bg-vice-cardElevated text-vice-text border border-vice-border px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs hover:border-vice-pink transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      <RetroWindow
        title="NEW PROJECT WIZARD — CREATE STRUCTURED BRIEF"
        icon={<FolderPlus className="w-4 h-4 text-vice-pink" />}
      >
        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-vice-text">
          {/* Section 1: Basic Info */}
          <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-vice-pink border-b border-vice-border pb-2 uppercase tracking-wide">
              01. Project Overview &amp; Format
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1.5 text-vice-text">
                  Project Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Inside Quantum Computing Episode 2"
                  className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-vice-text">
                  Video Category:
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Project['category'])
                  }
                  className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
                >
                  <option value="YouTube Long-form">YouTube Long-form (16:9)</option>
                  <option value="Shorts / Reels">Shorts / Reels / TikTok (9:16)</option>
                  <option value="Podcast">Podcast Multicam</option>
                  <option value="Documentary">Cinematic Documentary</option>
                  <option value="Gaming">Gaming / Stream Highlights</option>
                  <option value="Commercial">Brand Commercial / Ad</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1.5 text-vice-text">
                Detailed Brief &amp; Narrative Goal:
              </label>
              <textarea
                required
                rows={4}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Explain the pacing, hook requirements (first 15 seconds), B-roll tone, and audio vibes..."
                className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 2: Technical Deliverables Specs */}
          <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-vice-pink border-b border-vice-border pb-2 uppercase tracking-wide">
              02. Deliverables Specification
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1.5 text-vice-text">Aspect Ratio:</label>
                <select
                  value={aspectRatio}
                  onChange={(e) =>
                    setAspectRatio(e.target.value as DeliverableSpec['aspect_ratio'])
                  }
                  className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
                >
                  <option value="16:9">16:9 (Horizontal)</option>
                  <option value="9:16">9:16 (Vertical)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Social)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-vice-text">Target Duration (Mins):</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(parseInt(e.target.value) || 10)}
                  className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-vice-text">Master Resolution:</label>
                <select
                  value={resolution}
                  onChange={(e) =>
                    setResolution(e.target.value as DeliverableSpec['resolution'])
                  }
                  className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
                >
                  <option value="4K (3840x2160)">4K (3840x2160)</option>
                  <option value="1080p (1920x1080)">1080p FHD</option>
                  <option value="720p">720p HD</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-vice-text">Included Revisions:</label>
                <select
                  value={revisionLimit}
                  onChange={(e) => setRevisionLimit(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
                >
                  <option value={1}>1 Revision Round</option>
                  <option value={2}>2 Revision Rounds (Standard)</option>
                  <option value={3}>3 Revision Rounds</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-vice-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={captionsIncluded}
                  onChange={(e) => setCaptionsIncluded(e.target.checked)}
                  className="rounded text-vice-pink focus:ring-pink-500"
                />
                <span className="text-vice-muted">Dynamic Captions</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={soundDesign}
                  onChange={(e) => setSoundDesign(e.target.checked)}
                  className="rounded text-vice-pink focus:ring-pink-500"
                />
                <span className="text-vice-muted">Full Sound Design</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={colorGrading}
                  onChange={(e) => setColorGrading(e.target.checked)}
                  className="rounded text-vice-pink focus:ring-pink-500"
                />
                <span className="text-vice-muted">Color Grading LUT</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={thumbnailConcept}
                  onChange={(e) => setThumbnailConcept(e.target.checked)}
                  className="rounded text-vice-pink focus:ring-pink-500"
                />
                <span className="text-vice-muted">Thumbnail Concept</span>
              </label>
            </div>
          </div>

          {/* Section 3: Budget & Milestone Split */}
          <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-vice-pink border-b border-vice-border pb-2 flex items-center justify-between uppercase tracking-wide">
              <span>03. Budget &amp; 30/70 Milestone Protection</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1.5 text-vice-text">
                  Agreed Project Budget ($ USD):
                </label>
                <input
                  type="number"
                  min="50"
                  step="25"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value) || 300)}
                  className="w-full px-3.5 py-2 text-xs font-mono font-bold text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-vice-text">
                  Estimated Delivery Deadline:
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
                />
              </div>

              <div className="bg-vice-cardElevated p-4 rounded-xl border border-vice-border text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-vice-muted">Milestone 1 (30% Upfront):</span>
                  <strong className="text-emerald-500 font-mono">${upfrontAmount} USD</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-vice-muted">Milestone 2 (70% Master):</span>
                  <strong className="text-amber-500 font-mono">${finalAmount} USD</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Assets & References */}
          <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-vice-pink border-b border-vice-border pb-2 uppercase tracking-wide">
              04. Assets &amp; Reference Links
            </h3>

            <div>
              <label className="block font-semibold mb-1.5 text-vice-text">
                Raw Footage / Assets Folder URL (Drive, Dropbox, Frame.io):
              </label>
              <textarea
                rows={2}
                value={rawFootageLinks}
                onChange={(e) => setRawFootageLinks(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1.5 text-vice-text">
                Style References / Video Links (One per line):
              </label>
              <textarea
                rows={2}
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-between items-center">
            <Link
              href="/projects"
              className="bg-vice-cardElevated text-vice-muted hover:text-vice-text border border-vice-border px-4 py-2 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="bg-vice-pink hover:bg-vice-pinkHover text-white px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Initialize Project &amp; Fund Escrow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </RetroWindow>
    </div>
  );
}
