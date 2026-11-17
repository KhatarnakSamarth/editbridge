'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Star,
  Film,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronLeft,
  Play,
  Award,
  ArrowRight,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export default function EditorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { editors, reviews, setActiveProjectId } = useEditBridge();
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const editorId = params.id as string;
  const editor = editors.find((e) => e.user_id === editorId) || editors[0];

  const editorReviews = reviews.filter((r) => r.reviewee_id === editor.user_id);

  const handleHireClick = () => {
    retroSound.playDing();
    router.push('/projects/new');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4 font-sans">
      <div className="mb-2">
        <Link
          href="/editors"
          onClick={() => retroSound.playClick()}
          className="win95-button px-2.5 py-1 text-xs font-mono font-bold inline-flex items-center gap-1 text-neutral-800"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Editor Directory</span>
        </Link>
      </div>

      {/* Editor Profile Header Window */}
      <RetroWindow
        title={`TALENT_PROFILE.EXE — ${editor.name.toUpperCase()} [VERIFIED]`}
        icon={<Users className="w-4 h-4 text-cyan-300" />}
      >
        <div className="space-y-4">
          {/* Top Banner */}
          <div className="win95-window p-4 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editor.portfolio_items[0]?.thumbnail_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={editor.name}
                className="w-20 h-20 object-cover border-2 border-black flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black font-mono text-neutral-900">
                    {editor.name}
                  </h1>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-400 px-2 py-0.5 text-[10px] font-mono font-bold">
                    ✓ VERIFIED PRO
                  </span>
                  <span className="bg-blue-100 text-blue-900 border border-blue-400 px-2 py-0.5 text-[10px] font-mono font-bold">
                    99% RETENTION SCORE
                  </span>
                </div>

                <p className="text-xs font-bold text-neutral-700 font-mono">
                  {editor.headline}
                </p>

                <div className="flex items-center gap-3 text-xs font-mono text-neutral-600 flex-wrap pt-0.5">
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                    {editor.rating} Rating ({editor.reviews_count} reviews)
                  </span>
                  <span>•</span>
                  <span>Completed: <strong>{editor.completed_projects_count} projects</strong></span>
                  <span>•</span>
                  <span>Location: <strong>{editor.location}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Hire CTA */}
            <div className="flex flex-col items-start md:items-end gap-1 flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-neutral-200">
              <span className="text-xs font-mono text-neutral-500">STANDARD RATE:</span>
              <span className="text-lg font-mono font-black text-[#000080]">
                {editor.price_range}
              </span>
              <button
                onClick={handleHireClick}
                className="win95-button win95-button-primary w-full md:w-auto px-5 py-2 text-xs font-mono font-bold flex items-center justify-center gap-2 text-yellow-300 shadow-sm"
              >
                <span>Hire {editor.name.split(' ')[0]} for Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bio & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 win95-window p-4 bg-white space-y-3">
              <h3 className="font-bold text-xs font-mono text-[#000080] border-b border-neutral-300 pb-1">
                EDITORIAL PHILOSOPHY &amp; BACKGROUND
              </h3>
              <p className="text-xs font-sans text-neutral-800 leading-relaxed">
                {editor.bio}
              </p>

              <div>
                <h4 className="font-bold text-xs font-mono text-neutral-700 mb-1.5">
                  Core Editing Capabilities:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {editor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-neutral-100 border border-neutral-300 px-2 py-0.5 text-xs font-mono text-neutral-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs font-mono text-neutral-700 mb-1.5">
                  Software Stack:
                </h4>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs text-neutral-700">
                  {editor.software.map((sw) => (
                    <span
                      key={sw}
                      className="bg-blue-50 border border-blue-300 px-2 py-0.5 text-blue-900 font-bold"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Turnaround & Policy */}
            <div className="win95-window p-4 bg-white space-y-3 font-mono text-xs">
              <h3 className="font-bold text-xs text-[#000080] border-b border-neutral-300 pb-1">
                ENGAGEMENT TERMS
              </h3>

              <div className="space-y-2">
                <div className="win95-sunken p-2">
                  <span className="text-neutral-500 block text-[10px]">TURNAROUND TIME:</span>
                  <strong className="text-neutral-900">{editor.turnaround_time}</strong>
                </div>

                <div className="win95-sunken p-2">
                  <span className="text-neutral-500 block text-[10px]">SCHEDULE AVAILABILITY:</span>
                  <strong className="text-emerald-700">{editor.availability}</strong>
                </div>

                <div className="win95-sunken p-2">
                  <span className="text-neutral-500 block text-[10px]">MILESTONE MODEL:</span>
                  <strong className="text-neutral-900">30% Upfront / 70% Final Master</strong>
                </div>
              </div>

              <div className="p-2 bg-yellow-50 border border-yellow-400 text-yellow-900 text-[10px] font-sans">
                Protected by EditBridge milestone hold. Client reviews timestamped draft proxy prior to final master unlock.
              </div>
            </div>
          </div>

          {/* Interactive Showreel Portfolio Section */}
          <div className="win95-window p-4 bg-white space-y-3">
            <h3 className="font-bold text-xs font-mono text-[#000080] border-b border-neutral-300 pb-1 flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              <span>VERIFIED PORTFOLIO SHOWREEL SAMPLES</span>
            </h3>

            {/* If video selected, show video player */}
            {activeVideoUrl && (
              <div className="win95-sunken-dark p-2 bg-black border-2 border-neutral-700 mb-3">
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[360px] object-contain bg-black"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {editor.portfolio_items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    retroSound.playDing();
                    setActiveVideoUrl(item.video_url);
                  }}
                  className="win95-window p-2.5 cursor-pointer hover:bg-neutral-50 transition-all border border-neutral-300 group"
                >
                  <div className="relative aspect-video bg-black overflow-hidden border border-neutral-400">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/90 border border-black flex items-center justify-center">
                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white font-mono text-[9px] px-1 py-0.2">
                      {item.duration}
                    </span>
                  </div>

                  <div className="mt-2">
                    <h4 className="font-bold text-xs font-mono text-neutral-900 group-hover:text-blue-900">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-0.5">
                      <span>Client: {item.client || 'Verified Creator'}</span>
                      {item.views && <span className="font-bold text-blue-800">{item.views}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Client Reviews */}
          <div className="win95-window p-4 bg-white space-y-3">
            <h3 className="font-bold text-xs font-mono text-[#000080] border-b border-neutral-300 pb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>AUTHENTIC CLIENT REVIEWS &amp; RETENTION AUDITS</span>
            </h3>

            {editorReviews.length === 0 ? (
              <p className="text-xs font-mono text-neutral-500">
                No public reviews recorded yet for this editor.
              </p>
            ) : (
              <div className="space-y-2">
                {editorReviews.map((rev) => (
                  <div key={rev.id} className="win95-sunken p-3 bg-neutral-50 space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-neutral-900">
                          {rev.reviewer_name}
                        </span>
                        <span className="text-amber-600 font-mono text-xs font-bold">
                          {'★'.repeat(rev.rating)}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs font-sans text-neutral-800 leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-emerald-50 border border-emerald-400 text-emerald-900 text-[9px] font-mono px-1 py-0.2"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
