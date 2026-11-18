'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Star,
  Film,
  ChevronLeft,
  Play,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export default function EditorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { editors, reviews } = useEditBridge();
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const editorId = (params?.id as string) || '';
  const editor = editors.find((e) => e.user_id === editorId) || editors[0];

  const editorReviews = reviews.filter((r) => r.reviewee_id === editor.user_id);

  const handleHireClick = () => {
    retroSound.playDing();
    router.push('/projects/new');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div className="mb-2">
        <Link
          href="/editors"
          onClick={() => retroSound.playClick()}
          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs hover:border-cyan-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Editor Directory</span>
        </Link>
      </div>

      {/* Editor Profile Header Window */}
      <RetroWindow
        title={`TALENT PROFILE — ${editor.name.toUpperCase()}`}
        icon={<Users className="w-4 h-4 text-cyan-500" />}
      >
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-6 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editor.portfolio_items[0]?.thumbnail_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={editor.name}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {editor.name}
                  </h1>
                  <span className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    ✓ VERIFIED PRO
                  </span>
                  <span className="bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    99% RETENTION SCORE
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {editor.headline}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-0.5">
                  <span className="text-amber-500 font-semibold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {editor.rating} Rating ({editor.reviews_count} reviews)
                  </span>
                  <span>•</span>
                  <span>Completed: <strong className="text-slate-800 dark:text-white">{editor.completed_projects_count} projects</strong></span>
                  <span>•</span>
                  <span>Location: <strong className="text-slate-800 dark:text-white">{editor.location}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Hire CTA */}
            <div className="flex flex-col items-start md:items-end gap-1.5 flex-shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">STANDARD RATE:</span>
              <span className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {editor.price_range}
              </span>
              <button
                onClick={handleHireClick}
                className="bg-blue-600 hover:bg-blue-500 text-white w-full md:w-auto px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all"
              >
                <span>Hire {editor.name.split(' ')[0]} for Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bio & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 p-6 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <h3 className="font-bold text-xs text-cyan-600 dark:text-cyan-400 border-b border-slate-200 dark:border-slate-800 pb-2 uppercase tracking-wide">
                EDITORIAL PHILOSOPHY &amp; BACKGROUND
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {editor.bio}
              </p>

              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
                  Core Editing Capabilities:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {editor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs rounded-xl text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
                  Software Stack:
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {editor.software.map((sw) => (
                    <span
                      key={sw}
                      className="bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 px-3 py-1 rounded-xl font-bold"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Turnaround & Policy */}
            <div className="p-6 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 text-xs">
              <h3 className="font-bold text-xs text-cyan-600 dark:text-cyan-400 border-b border-slate-200 dark:border-slate-800 pb-2 uppercase tracking-wide">
                ENGAGEMENT TERMS
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 bg-white dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">TURNAROUND TIME:</span>
                  <strong className="text-slate-900 dark:text-white text-xs">{editor.turnaround_time}</strong>
                </div>

                <div className="p-3.5 bg-white dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">SCHEDULE AVAILABILITY:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-xs">{editor.availability}</strong>
                </div>

                <div className="p-3.5 bg-white dark:bg-[#0e1526] rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">MILESTONE MODEL:</span>
                  <strong className="text-slate-900 dark:text-white text-xs">30% Upfront / 70% Final Master</strong>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs rounded-xl leading-relaxed">
                Protected by EditBridge milestone hold. Client reviews timestamped draft proxy prior to final master unlock.
              </div>
            </div>
          </div>

          {/* Interactive Showreel Portfolio Section */}
          <div className="p-6 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-cyan-600 dark:text-cyan-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-wide">
              <Film className="w-4 h-4" />
              <span>VERIFIED PORTFOLIO SHOWREEL SAMPLES</span>
            </h3>

            {/* If video selected, show video player */}
            {activeVideoUrl && (
              <div className="p-3 bg-black rounded-2xl border border-slate-700 mb-4 shadow-xl">
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[380px] object-contain bg-black rounded-xl"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editor.portfolio_items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    retroSound.playDing();
                    setActiveVideoUrl(item.video_url);
                  }}
                  className="p-4 rounded-2xl cursor-pointer bg-white dark:bg-[#0e1526] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all group shadow-sm"
                >
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-slate-900 fill-slate-900 ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold">
                      {item.duration}
                    </span>
                  </div>

                  <div className="mt-3.5">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>Client: {item.client || 'Verified Creator'}</span>
                      {item.views && <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{item.views}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Client Reviews */}
          <div className="p-6 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-cyan-600 dark:text-cyan-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-wide">
              <Award className="w-4 h-4 text-amber-500" />
              <span>AUTHENTIC CLIENT REVIEWS &amp; RETENTION AUDITS</span>
            </h3>

            {editorReviews.length === 0 ? (
              <p className="text-xs text-slate-500">
                No public reviews recorded yet for this editor.
              </p>
            ) : (
              <div className="space-y-3.5">
                {editorReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {rev.reviewer_name}
                        </span>
                        <span className="text-amber-500 text-xs">
                          {'★'.repeat(rev.rating)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
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
