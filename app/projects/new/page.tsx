'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FolderPlus,
  ArrowRight,
  ShieldCheck,
  Film,
  Sparkles,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { DeliverableSpec, Project } from '@/types';
import { retroSound } from '@/lib/soundEffects';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject, currentUser } = useEditBridge();

  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [category, setCategory] = useState<Project['category']>('YouTube Long-form');
  const [budget, setBudget] = useState(550);
  const [deadline, setDeadline] = useState('2026-12-05');
  const [revisionLimit, setRevisionLimit] = useState(2);
  const [references, setReferences] = useState(
    'https://youtube.com/watch?v=sample-vox-explainer'
  );
  const [rawFootageLinks, setRawFootageLinks] = useState(
    'https://drive.google.com/drive/folders/sample-raw-footage-4k'
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

    const projectId = createProject({
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
      status: 'PAID', // Upfront funded in demo
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
      active_draft_url:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    });

    router.push('/workspace');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      <div className="mb-3">
        <Link
          href="/projects"
          onClick={() => retroSound.playClick()}
          className="win95-button px-2.5 py-1 text-xs font-mono font-bold inline-flex items-center gap-1 text-neutral-800"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      <RetroWindow
        title="NEW_PROJECT_WIZARD.EXE — CREATE STRUCTURED BRIEF"
        icon={<FolderPlus className="w-4 h-4 text-yellow-300" />}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-xs text-neutral-900">
          {/* Section 1: Basic Info */}
          <div className="win95-window p-3 bg-white space-y-3">
            <h3 className="font-bold text-xs font-mono text-[#000080] border-b border-neutral-300 pb-1 flex items-center gap-1.5">
              <span>01. PROJECT OVERVIEW &amp; FORMAT</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-mono font-bold mb-1">
                  Project Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Inside Quantum Computing Episode 2"
                  className="win95-sunken w-full px-2.5 py-1.5 text-xs text-neutral-900"
                />
              </div>

              <div>
                <label className="block font-mono font-bold mb-1">
                  Video Category:
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Project['category'])
                  }
                  className="win95-sunken w-full px-2 py-1.5 text-xs bg-white text-neutral-900"
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
              <label className="block font-mono font-bold mb-1">
                Detailed Brief &amp; Narrative Goal:
              </label>
              <textarea
                required
                rows={4}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Explain the pacing, hook requirements (first 15 seconds), B-roll tone, and audio vibes..."
                className="win95-sunken w-full px-2.5 py-1.5 text-xs text-neutral-900"
              />
            </div>
          </div>

          {/* Section 2: Technical Deliverables Specs */}
          <div className="win95-window p-3 bg-white space-y-3">
            <h3 className="font-bold text-xs font-mono text-[#000080] border-b border-neutral-300 pb-1 flex items-center gap-1.5">
              <span>02. DELIVERABLES SPECIFICATION</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-mono font-bold mb-1">Aspect Ratio:</label>
                <select
                  value={aspectRatio}
                  onChange={(e) =>
                    setAspectRatio(e.target.value as DeliverableSpec['aspect_ratio'])
                  }
                  className="win95-sunken w-full px-2 py-1 text-xs bg-white"
                >
                  <option value="16:9">16:9 (Horizontal)</option>
                  <option value="9:16">9:16 (Vertical)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Social)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono font-bold mb-1">Target Duration (Mins):</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(parseInt(e.target.value) || 10)}
                  className="win95-sunken w-full px-2 py-1 text-xs"
                />
              </div>

              <div>
                <label className="block font-mono font-bold mb-1">Master Resolution:</label>
                <select
                  value={resolution}
                  onChange={(e) =>
                    setResolution(e.target.value as DeliverableSpec['resolution'])
                  }
                  className="win95-sunken w-full px-2 py-1 text-xs bg-white"
                >
                  <option value="4K (3840x2160)">4K (3840x2160)</option>
                  <option value="1080p (1920x1080)">1080p FHD</option>
                  <option value="720p">720p HD</option>
                </select>
              </div>

              <div>
                <label className="block font-mono font-bold mb-1">Included Revisions:</label>
                <select
                  value={revisionLimit}
                  onChange={(e) => setRevisionLimit(parseInt(e.target.value))}
                  className="win95-sunken w-full px-2 py-1 text-xs bg-white"
                >
                  <option value={1}>1 Revision Round</option>
                  <option value={2}>2 Revision Rounds (Standard)</option>
                  <option value={3}>3 Revision Rounds</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={captionsIncluded}
                  onChange={(e) => setCaptionsIncluded(e.target.checked)}
                />
                <span>Dynamic Captions</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundDesign}
                  onChange={(e) => setSoundDesign(e.target.checked)}
                />
                <span>Full Sound Design</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colorGrading}
                  onChange={(e) => setColorGrading(e.target.checked)}
                />
                <span>Color Grading LUT</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={thumbnailConcept}
                  onChange={(e) => setThumbnailConcept(e.target.checked)}
                />
                <span>Thumbnail Concept</span>
              </label>
            </div>
          </div>

          {/* Section 3: Budget & Milestone Split */}
          <div className="win95-window p-3 bg-white space-y-3">
            <h3 className="font-bold text-xs font-mono text-[#000080] border-b border-neutral-300 pb-1 flex items-center justify-between">
              <span>03. BUDGET &amp; 30/70 MILESTONE PROTECTION</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-mono font-bold mb-1">
                  Agreed Project Budget ($ USD):
                </label>
                <input
                  type="number"
                  min="50"
                  step="25"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value) || 300)}
                  className="win95-sunken w-full px-2 py-1 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-mono font-bold mb-1">
                  Estimated Delivery Deadline:
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="win95-sunken w-full px-2 py-1 text-xs"
                />
              </div>

              <div className="bg-neutral-50 p-2 border border-neutral-300 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Milestone 1 (30% Upfront):</span>
                  <strong className="text-blue-900">${upfrontAmount} USD</strong>
                </div>
                <div className="flex justify-between">
                  <span>Milestone 2 (70% Master):</span>
                  <strong className="text-amber-900">${finalAmount} USD</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Assets & References */}
          <div className="win95-window p-3 bg-white space-y-3">
            <h3 className="font-bold text-xs font-mono text-[#000080] border-b border-neutral-300 pb-1">
              04. ASSETS &amp; REFERENCE LINKS
            </h3>

            <div>
              <label className="block font-mono font-bold mb-1">
                Raw Footage / Assets Folder URL (Drive, Dropbox, Frame.io):
              </label>
              <textarea
                rows={2}
                value={rawFootageLinks}
                onChange={(e) => setRawFootageLinks(e.target.value)}
                className="win95-sunken w-full px-2.5 py-1 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-mono font-bold mb-1">
                Style References / Video Links (One per line):
              </label>
              <textarea
                rows={2}
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                className="win95-sunken w-full px-2.5 py-1 text-xs font-mono"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-between items-center">
            <Link
              href="/projects"
              className="win95-button px-4 py-2 font-mono font-bold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="win95-button win95-button-primary px-6 py-2 text-xs font-mono font-bold flex items-center gap-2 text-yellow-300 shadow-md"
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
