'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Star,
  Film,
  UserPlus,
  Sparkles,
  ChevronRight,
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-sans">
      <RetroWindow
        title="VERIFIED VIDEO EDITOR ROSTER"
        icon={<Users className="w-4 h-4 text-vice-pink" />}
      >
        <div className="space-y-6">
          {/* Header & Invite existing editor strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-500/20">
            <div>
              <h2 className="font-extrabold text-lg text-vice-text">
                HIGH-RETENTION VIDEO EDITORS
              </h2>
              <p className="text-xs text-vice-muted mt-1">
                Vetted by channel view duration, pacing, kinetic motion, and verified project deliveries.
              </p>
            </div>

            <button
              onClick={() => {
                retroSound.playDing();
                setIsInviteOpen(true);
              }}
              className="bg-vice-gradient hover:opacity-95 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 self-start sm:self-center shadow-md shadow-pink-500/25 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite My Existing Editor</span>
            </button>
          </div>

          {/* Search & Multi-filter Bar */}
          <div className="p-4 bg-[#170B29] border border-pink-500/20 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-vice-dim" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by editor name, storytelling style, or skills (e.g. 'Pacing', 'DaVinci', 'Retention')..."
                  className="w-full pl-10 pr-4 py-2 text-xs text-vice-text bg-[#0D0618] border border-pink-500/30 rounded-xl focus:border-vice-pink focus:outline-hidden placeholder:text-vice-dim"
                />
              </div>

              {/* Niche selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-vice-dim whitespace-nowrap font-medium">Niche:</span>
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold bg-[#0D0618] text-vice-text border border-pink-500/30 rounded-xl focus:border-vice-pink focus:outline-hidden"
                >
                  {niches.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Software selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-vice-dim whitespace-nowrap font-medium">Software:</span>
                <select
                  value={selectedSoftware}
                  onChange={(e) => setSelectedSoftware(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold bg-[#0D0618] text-vice-text border border-pink-500/30 rounded-xl focus:border-vice-pink focus:outline-hidden"
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
                  className="p-5 bg-[#170B29] border border-pink-500/20 rounded-2xl flex flex-col justify-between space-y-4 hover:border-pink-500/40 transition-all shadow-sm"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3.5 border-b border-pink-500/20">
                      <div className="flex items-start gap-3.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sampleItem?.thumbnail_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=150'}
                          alt={editor.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-pink-500/30 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-sm text-vice-text">
                              {editor.name}
                            </h3>
                            <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              ✓ VERIFIED PRO
                            </span>
                          </div>
                          <p className="text-xs text-vice-gold font-semibold flex items-center gap-1 mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-[#FFD166] text-vice-gold" />
                            <span>
                              {editor.rating} ({editor.reviews_count} verified projects)
                            </span>
                          </p>
                          <p className="text-[11px] text-vice-dim">
                            {editor.location} • Turnaround: {editor.turnaround_time}
                          </p>
                        </div>
                      </div>

                      <div className="self-end sm:self-auto text-right flex-shrink-0">
                        <span className="text-[10px] text-vice-dim block font-mono font-medium">FROM</span>
                        <strong className="text-sm font-mono text-vice-gold font-bold">
                          ${editor.fixed_rate_starting}
                        </strong>
                      </div>
                    </div>

                    {/* Headline & bio */}
                    <p className="text-xs font-bold text-vice-text mt-3">
                      {editor.headline}
                    </p>
                    <p className="text-xs text-vice-muted mt-1 line-clamp-2 leading-relaxed">
                      {editor.bio}
                    </p>

                    {/* Skills pills */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {editor.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-[#211038] border border-pink-500/20 text-[10px] px-2 py-0.5 rounded-md text-vice-text font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Software tags */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-vice-dim">
                      <span>NLEs:</span>
                      <span className="text-vice-text font-medium">
                        {editor.software.join(' • ')}
                      </span>
                    </div>

                    {/* Sample Showreel Box */}
                    {sampleItem && (
                      <div className="mt-3.5 p-3 bg-[#0D0618] rounded-xl border border-pink-500/20 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <Film className="w-4 h-4 text-vice-pink flex-shrink-0" />
                          <span className="text-xs truncate text-vice-text font-medium">
                            {sampleItem.title}
                          </span>
                        </div>
                        {sampleItem.views && (
                          <span className="text-[10px] font-mono bg-pink-500/15 text-vice-pink border border-pink-500/30 px-2 py-0.5 rounded-md flex-shrink-0 font-bold">
                            {sampleItem.views}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card bottom actions */}
                  <div className="pt-3.5 border-t border-pink-500/20 flex items-center justify-between text-xs">
                    <span className="text-vice-dim font-medium">
                      Availability:{' '}
                      <strong className="text-vice-mint">{editor.availability}</strong>
                    </span>

                    <Link
                      href={`/editors/${editor.user_id}`}
                      onClick={() => retroSound.playClick()}
                      className="bg-vice-gradient hover:opacity-95 text-white px-4 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      View Showreel &amp; Rates →
                    </Link>
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
