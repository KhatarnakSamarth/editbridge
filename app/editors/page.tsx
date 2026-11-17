'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Star,
  Film,
  ExternalLink,
  UserPlus,
  Play,
  Sparkles,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { InviteEditorModal } from '@/components/InviteEditorModal';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export default function EditorsDirectoryPage() {
  const { editors } = useEditBridge();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('ALL');
  const [selectedSoftware, setSelectedSoftware] = useState('ALL');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const niches = ['ALL', 'Finance & Investing', 'Tech & AI', 'Shorts / Reels / TikTok', 'Documentaries', 'Gaming'];
  const softwares = ['ALL', 'DaVinci Resolve Studio', 'Adobe Premiere Pro', 'CapCut Pro', 'After Effects'];

  const filteredEditors = editors.filter((editor) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = editor.name.toLowerCase().includes(q);
      const matchBio = editor.bio.toLowerCase().includes(q);
      const matchSkill = editor.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchSkill) return false;
    }
    if (selectedNiche !== 'ALL' && !editor.niches.includes(selectedNiche)) return false;
    if (selectedSoftware !== 'ALL' && !editor.software.includes(selectedSoftware)) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4 font-sans">
      <RetroWindow
        title="EDITOR_ROSTER_VETTING.DB — DISCOVER SPECIALIST VIDEO EDITORS"
        icon={<Users className="w-4 h-4 text-cyan-300" />}
      >
        <div className="space-y-4">
          {/* Header & Invite existing editor strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-400">
            <div>
              <h2 className="font-bold text-sm sm:text-base font-mono text-neutral-900">
                VERIFIED HIGH-RETENTION EDITORS
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Vetted by channel view duration, pacing, kinetic motion, and verified project deliveries.
              </p>
            </div>

            <button
              onClick={() => {
                retroSound.playDing();
                setIsInviteOpen(true);
              }}
              className="win95-button win95-button-amber px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 text-white self-start sm:self-center shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite My Existing Editor</span>
            </button>
          </div>

          {/* Search & Multi-filter Bar */}
          <div className="win95-window p-3 bg-white space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by editor name, storytelling style, or skills (e.g. 'Pacing', 'DaVinci', 'Retention')..."
                  className="win95-sunken w-full pl-8 pr-3 py-1.5 text-xs text-neutral-900"
                />
              </div>

              {/* Niche selector */}
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className="text-neutral-600 text-[11px] whitespace-nowrap">Niche:</span>
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="win95-sunken px-2 py-1 text-xs bg-white text-neutral-900"
                >
                  {niches.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Software selector */}
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className="text-neutral-600 text-[11px] whitespace-nowrap">Software:</span>
                <select
                  value={selectedSoftware}
                  onChange={(e) => setSelectedSoftware(e.target.value)}
                  className="win95-sunken px-2 py-1 text-xs bg-white text-neutral-900"
                >
                  {softwares.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Editors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEditors.map((editor) => {
              const sampleItem = editor.portfolio_items[0];

              return (
                <div
                  key={editor.user_id}
                  className="win95-window p-4 bg-white flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 pb-2 border-b border-neutral-300">
                      <div className="flex items-start gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sampleItem?.thumbnail_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=150'}
                          alt={editor.name}
                          className="w-14 h-14 object-cover border-2 border-black flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-sm font-mono text-neutral-900">
                              {editor.name}
                            </h3>
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-400 text-[9px] font-mono px-1 py-0.2 font-bold">
                              ✓ VERIFIED PRO
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-amber-700 font-bold flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                            <span>
                              {editor.rating} ({editor.reviews_count} verified projects)
                            </span>
                          </p>
                          <p className="text-[10px] text-neutral-500 font-mono">
                            {editor.location} • Turnaround: {editor.turnaround_time}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 font-mono">
                        <span className="text-[10px] text-neutral-500 block">STARTING AT</span>
                        <strong className="text-sm text-[#000080]">
                          ${editor.fixed_rate_starting}
                        </strong>
                      </div>
                    </div>

                    {/* Headline & bio */}
                    <p className="text-xs font-bold text-neutral-800 font-mono mt-2">
                      {editor.headline}
                    </p>
                    <p className="text-xs text-neutral-600 font-sans mt-1 line-clamp-2">
                      {editor.bio}
                    </p>

                    {/* Skills pills */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {editor.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-neutral-100 border border-neutral-300 text-[10px] px-1.5 py-0.5 font-mono text-neutral-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Software tags */}
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                      <span>NLEs:</span>
                      <span className="text-neutral-800 font-bold">
                        {editor.software.join(' • ')}
                      </span>
                    </div>

                    {/* Sample Showreel Box */}
                    {sampleItem && (
                      <div className="mt-3 win95-sunken p-2 bg-neutral-50 flex items-center justify-between gap-2 border border-neutral-300">
                        <div className="flex items-center gap-2 truncate">
                          <Film className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                          <span className="text-[11px] font-mono truncate text-neutral-800">
                            {sampleItem.title}
                          </span>
                        </div>
                        {sampleItem.views && (
                          <span className="text-[10px] font-mono bg-blue-100 text-blue-900 border border-blue-400 px-1 py-0.2 flex-shrink-0">
                            {sampleItem.views}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card bottom actions */}
                  <div className="pt-3 border-t border-neutral-300 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-600">
                      Availability:{' '}
                      <strong className="text-emerald-700">{editor.availability}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/editors/${editor.user_id}`}
                        onClick={() => retroSound.playClick()}
                        className="win95-button win95-button-primary px-3 py-1 text-xs font-mono font-bold text-yellow-300"
                      >
                        View Showreel &amp; Rates →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RetroWindow>

      <InviteEditorModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
