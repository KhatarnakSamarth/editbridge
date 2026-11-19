'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Trophy,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Save,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  Flame,
  CheckCircle2,
  Lock,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { RetroWindow } from '@/components/RetroWindow';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';
import { SocialLinks, EditorStats } from '@/types';

type ActiveTab = 'OVERVIEW' | 'VAULT_DELIVERY';

export default function EditorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { editors, reviews, currentUser, isAuthenticated, activeRole } = useEditBridge();
  const [activeTab, setActiveTab] = useState<ActiveTab>('VAULT_DELIVERY');
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const editorId = (params?.id as string) || '';
  const editor = editors.find((e) => e.user_id === editorId) || editors[0];
  const editorReviews = reviews.filter((r) => r.reviewee_id === editor.user_id);

  // Social handles state
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    twitterHandle: 'alexriveracuts',
    instagramHandle: 'alexrivera.film',
    youtubeUrl: 'https://youtube.com/@alexrivera-edits',
    linkedinUrl: 'https://linkedin.com/in/alexrivera-nle',
    portfolioUrl: 'https://alexrivera.work',
  });
  const [isEditingHandles, setIsEditingHandles] = useState(false);
  const [isSavingHandles, setIsSavingHandles] = useState(false);
  const [handlesSavedToast, setHandlesSavedToast] = useState(false);

  // Live Stats state
  const [stats, setStats] = useState<EditorStats>({
    mastersDelivered: 8,
    milestonesReleasedCount: 14,
    milestonesReleasedAmount: 6450,
    clientRating: editor.rating || 5.0,
    reviewsCount: editor.reviews_count || 14,
    revisionResolutionRate: 98,
    completedProjectsCount: editor.completed_projects_count || 12,
  });

  const [vaultFiles, setVaultFiles] = useState<
    Array<{
      id: string;
      name: string;
      size: number;
      projectTitle: string;
      createdAt: string;
      url: string;
    }>
  >([
    {
      id: 'vf-1',
      name: 'The_Great_AI_Bubble_Master_4K_ProRes.mov',
      size: 4294967296,
      projectTitle: 'The Great AI Bubble of 2026',
      createdAt: '2026-11-18T16:00:00Z',
      url: 'https://storage.editbridge.network/project-videos/proj-demo-1/master.mp4',
    },
    {
      id: 'vf-2',
      name: 'Quantum_Computing_Ep2_Master_Rec709.mp4',
      size: 1887436800,
      projectTitle: 'Quantum Computing Episode 2',
      createdAt: '2026-11-15T12:30:00Z',
      url: 'https://storage.editbridge.network/project-videos/proj-demo-2/master.mp4',
    },
    {
      id: 'vf-3',
      name: 'High_Velocity_Shorts_9x16_Master.mp4',
      size: 345600000,
      projectTitle: 'SaaS Launch Hype Reel',
      createdAt: '2026-11-10T09:15:00Z',
      url: 'https://storage.editbridge.network/project-videos/proj-demo-3/master.mp4',
    },
  ]);

  // Dynamic share text
  const [shareCopyText, setShareCopyText] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Determine if viewing own profile
  const isOwner =
    isAuthenticated &&
    (currentUser?.id === editor.user_id ||
      currentUser?.id === 'user-editor-1' ||
      activeRole === 'EDITOR');

  // Load live DB data from API
  useEffect(() => {
    if (!editorId) return;

    fetch(`/api/editors/${editorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.editor) {
          if (data.editor.social_links) {
            setSocialLinks(data.editor.social_links);
          }
          if (data.editor.stats) {
            setStats(data.editor.stats);
          }
          if (Array.isArray(data.editor.vault_files) && data.editor.vault_files.length > 0) {
            setVaultFiles(data.editor.vault_files);
          }
        }
      })
      .catch((err) => console.warn('Could not fetch editor API details:', err));
  }, [editorId]);

  // Update share copy whenever stats or social links change
  useEffect(() => {
    const handleTag = socialLinks.twitterHandle ? ` @${socialLinks.twitterHandle}` : '';
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://editbridge.network/editors/${editor.user_id}`;
    const blurb = `Just delivered ${stats.mastersDelivered} verified master cuts with a ${stats.clientRating}★ rating on @EditBridge! Escrow secured, 0 missed deadlines.${handleTag}\n\nInspect my delivery vault & showreel: ${shareUrl}`;
    setShareCopyText(blurb);
  }, [stats, socialLinks, editor.user_id]);

  const handleHireClick = () => {
    retroSound.playDing();
    router.push('/projects/new');
  };

  const handleSaveHandles = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHandles(true);
    retroSound.playClick();

    try {
      const res = await fetch(`/api/editors/${editor.user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update handles');
      }

      setSocialLinks(data.socialLinks);
      setIsEditingHandles(false);
      setHandlesSavedToast(true);
      retroSound.playDing();
      setTimeout(() => setHandlesSavedToast(false), 3500);
    } catch (err: any) {
      alert(err?.message || 'Error updating handles');
    } finally {
      setIsSavingHandles(false);
    }
  };

  const copyToClipboard = (text: string, typeKey: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(typeKey);
      retroSound.playDing();
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const getProfileUrl = () => {
    return typeof window !== 'undefined'
      ? window.location.href
      : `https://editbridge.network/editors/${editor.user_id}`;
  };

  const handleShareTwitter = () => {
    retroSound.playClick();
    const url = getProfileUrl();
    const tweetText = `Delivered ${stats.mastersDelivered} master cuts with ${stats.clientRating}★ rating on @EditBridge! Check my verified delivery vault:`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    retroSound.playClick();
    const url = getProfileUrl();
    copyToClipboard(shareCopyText, 'linkedin');
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    retroSound.playClick();
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareCopyText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div className="mb-2">
        <Link
          href="/editors"
          onClick={() => retroSound.playClick()}
          className="bg-vice-cardElevated text-vice-text border border-vice-border px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs hover:border-vice-pink transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Editor Directory</span>
        </Link>
      </div>

      {/* Editor Profile Header Window */}
      <RetroWindow
        title={`TALENT PROFILE — ${editor.name.toUpperCase()}`}
        icon={<Users className="w-4 h-4 text-vice-pink" />}
      >
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  editor.portfolio_items[0]?.thumbnail_url ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
                }
                alt={editor.name}
                className="w-20 h-20 rounded-2xl object-cover border border-vice-border shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-vice-text">
                    {editor.name}
                  </h1>
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    ✓ VERIFIED PRO
                  </span>
                  <span className="bg-vice-pink/10 text-vice-pink border border-vice-pink/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    99% RETENTION SCORE
                  </span>
                </div>

                <p className="text-xs font-semibold text-vice-muted">{editor.headline}</p>

                <div className="flex items-center gap-3 text-xs text-vice-muted flex-wrap pt-0.5">
                  <span className="text-amber-500 font-semibold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {stats.clientRating} Rating ({stats.reviewsCount} reviews)
                  </span>
                  <span>•</span>
                  <span>
                    Masters: <strong className="text-vice-text">{stats.mastersDelivered} delivered</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Location: <strong className="text-vice-text">{editor.location}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Hire CTA */}
            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-vice-border">
              <span className="text-xs text-vice-muted font-mono font-medium">STANDARD RATE:</span>
              <span className="text-2xl font-mono font-bold text-vice-coral">
                {editor.price_range}
              </span>
              <button
                onClick={handleHireClick}
                className="bg-vice-pink hover:bg-vice-pinkHover text-white w-full md:w-auto px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Hire {editor.name.split(' ')[0]} for Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 border-b border-vice-border pb-3">
            <button
              type="button"
              onClick={() => {
                retroSound.playClick();
                setActiveTab('VAULT_DELIVERY');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'VAULT_DELIVERY'
                  ? 'bg-vice-pink text-white shadow-sm'
                  : 'bg-vice-cardElevated text-vice-muted hover:text-vice-text border border-vice-border'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Vaults &amp; Master Delivery</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
                {stats.mastersDelivered}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                retroSound.playClick();
                setActiveTab('OVERVIEW');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'OVERVIEW'
                  ? 'bg-vice-pink text-white shadow-sm'
                  : 'bg-vice-cardElevated text-vice-muted hover:text-vice-text border border-vice-border'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Showreel &amp; Editorial Bio</span>
            </button>
          </div>

          {/* =========================================================================
              TAB 1: VAULTS & MASTER DELIVERY (STATS, SOCIAL HANDLES, SHARING & VAULT)
              ========================================================================= */}
          {activeTab === 'VAULT_DELIVERY' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Section 1: Live Delivery Stats & Achievements Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-vice-pink flex items-center gap-2 uppercase tracking-wide">
                    <TrendingUp className="w-4 h-4 text-vice-pink" />
                    <span>Verified Delivery Performance &amp; Escrow Stats</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>On-Chain Verified</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {/* Metric 1: Masters Delivered */}
                  <div className="p-4 bg-vice-surface border border-vice-border rounded-2xl space-y-1 shadow-xs">
                    <span className="text-vice-muted block text-[11px] font-medium uppercase font-mono">
                      Masters Delivered
                    </span>
                    <strong className="text-xl sm:text-2xl text-vice-text font-mono font-bold block">
                      {stats.mastersDelivered}
                    </strong>
                    <span className="text-[11px] text-emerald-500 font-semibold block">
                      100% 4K ProRes Verified
                    </span>
                  </div>

                  {/* Metric 2: Escrow Released */}
                  <div className="p-4 bg-vice-surface border border-vice-border rounded-2xl space-y-1 shadow-xs">
                    <span className="text-vice-muted block text-[11px] font-medium uppercase font-mono">
                      Escrow Released
                    </span>
                    <strong className="text-xl sm:text-2xl text-vice-coral font-mono font-bold block">
                      ${stats.milestonesReleasedAmount.toLocaleString()}
                    </strong>
                    <span className="text-[11px] text-vice-muted block">
                      Across {stats.milestonesReleasedCount} milestones
                    </span>
                  </div>

                  {/* Metric 3: Client Satisfaction */}
                  <div className="p-4 bg-vice-surface border border-vice-border rounded-2xl space-y-1 shadow-xs">
                    <span className="text-vice-muted block text-[11px] font-medium uppercase font-mono">
                      Client Rating
                    </span>
                    <strong className="text-xl sm:text-2xl text-amber-500 font-mono font-bold flex items-center gap-1">
                      <span>{stats.clientRating}</span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </strong>
                    <span className="text-[11px] text-vice-muted block">
                      From {stats.reviewsCount} verified clients
                    </span>
                  </div>

                  {/* Metric 4: Revision Resolution Rate */}
                  <div className="p-4 bg-vice-surface border border-vice-border rounded-2xl space-y-1 shadow-xs">
                    <span className="text-vice-muted block text-[11px] font-medium uppercase font-mono">
                      Resolution Rate
                    </span>
                    <strong className="text-xl sm:text-2xl text-emerald-500 font-mono font-bold block">
                      {stats.revisionResolutionRate}%
                    </strong>
                    <span className="text-[11px] text-vice-muted block">
                      Notes cleared inside scope
                    </span>
                  </div>
                </div>

                {/* Achievement Badges Row */}
                <div className="p-4 bg-vice-surface border border-vice-border rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-vice-text block uppercase tracking-wide">
                    Earned Deliverer Badges &amp; Escrow Credentials:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vice-cardElevated border border-amber-500/30 text-amber-500 font-bold shadow-xs">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Verified Vault Deliverer</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vice-cardElevated border border-emerald-500/30 text-emerald-500 font-bold shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>30/70 Escrow Trusted Pro</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vice-cardElevated border border-vice-pink/30 text-vice-pink font-bold shadow-xs">
                      <Flame className="w-3.5 h-3.5 text-vice-pink" />
                      <span>High Retention Cutmaster (99%)</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vice-cardElevated border border-vice-border text-vice-muted font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-vice-coral" />
                      <span>{editor.turnaround_time} Lightning Turnaround</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Connected Social Handles Manager */}
              <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-vice-border">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-vice-pink" />
                    <div>
                      <h3 className="font-bold text-xs text-vice-text uppercase tracking-wide">
                        Connected Social Handles &amp; Creator Repositories
                      </h3>
                      <p className="text-[11px] text-vice-muted">
                        Public channels and social proofs for clients reviewing this editor profile.
                      </p>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        retroSound.playClick();
                        setIsEditingHandles(!isEditingHandles);
                      }}
                      className="px-3 py-1.5 bg-vice-cardElevated hover:bg-vice-hover text-vice-text border border-vice-border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-vice-pink" />
                      <span>{isEditingHandles ? 'Cancel Editing' : 'Manage Handles'}</span>
                    </button>
                  )}
                </div>

                {handlesSavedToast && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Social handles saved to PostgreSQL successfully!</span>
                  </div>
                )}

                {/* Inline Editing Form for Owner */}
                {isOwner && isEditingHandles ? (
                  <form onSubmit={handleSaveHandles} className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-vice-text flex items-center gap-1.5">
                          <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                          <span>X (Twitter) Handle:</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-vice-muted font-mono">@</span>
                          <input
                            type="text"
                            value={socialLinks.twitterHandle || ''}
                            onChange={(e) =>
                              setSocialLinks({ ...socialLinks, twitterHandle: e.target.value })
                            }
                            placeholder="alexriveracuts"
                            className="w-full pl-7 pr-3 py-2 bg-vice-input border border-vice-border rounded-xl text-vice-text text-xs focus:border-vice-pink focus:outline-hidden font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-vice-text flex items-center gap-1.5">
                          <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
                          <span>Instagram Handle:</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-vice-muted font-mono">@</span>
                          <input
                            type="text"
                            value={socialLinks.instagramHandle || ''}
                            onChange={(e) =>
                              setSocialLinks({ ...socialLinks, instagramHandle: e.target.value })
                            }
                            placeholder="alexrivera.film"
                            className="w-full pl-7 pr-3 py-2 bg-vice-input border border-vice-border rounded-xl text-vice-text text-xs focus:border-vice-pink focus:outline-hidden font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-vice-text flex items-center gap-1.5">
                          <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                          <span>YouTube Channel URL:</span>
                        </label>
                        <input
                          type="url"
                          value={socialLinks.youtubeUrl || ''}
                          onChange={(e) =>
                            setSocialLinks({ ...socialLinks, youtubeUrl: e.target.value })
                          }
                          placeholder="https://youtube.com/@alexrivera-edits"
                          className="w-full px-3 py-2 bg-vice-input border border-vice-border rounded-xl text-vice-text text-xs focus:border-vice-pink focus:outline-hidden font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-vice-text flex items-center gap-1.5">
                          <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                          <span>LinkedIn Profile URL:</span>
                        </label>
                        <input
                          type="url"
                          value={socialLinks.linkedinUrl || ''}
                          onChange={(e) =>
                            setSocialLinks({ ...socialLinks, linkedinUrl: e.target.value })
                          }
                          placeholder="https://linkedin.com/in/alexrivera-nle"
                          className="w-full px-3 py-2 bg-vice-input border border-vice-border rounded-xl text-vice-text text-xs focus:border-vice-pink focus:outline-hidden font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-semibold text-vice-text flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Portfolio / Personal Website:</span>
                        </label>
                        <input
                          type="url"
                          value={socialLinks.portfolioUrl || ''}
                          onChange={(e) =>
                            setSocialLinks({ ...socialLinks, portfolioUrl: e.target.value })
                          }
                          placeholder="https://alexrivera.work"
                          className="w-full px-3 py-2 bg-vice-input border border-vice-border rounded-xl text-vice-text text-xs focus:border-vice-pink focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingHandles(false)}
                        className="px-4 py-2 bg-vice-cardElevated hover:bg-vice-hover text-vice-muted hover:text-vice-text border border-vice-border rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingHandles}
                        className="px-5 py-2 bg-vice-pink hover:bg-vice-pinkHover text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingHandles ? 'Saving to Database...' : 'Save Social Handles'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Read-only / Visitor Social Pills */
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {socialLinks.twitterHandle && (
                      <a
                        href={`https://x.com/${socialLinks.twitterHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-vice-cardElevated hover:bg-vice-hover border border-vice-border text-vice-text text-xs font-semibold flex items-center gap-2 transition-colors group cursor-pointer"
                      >
                        <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                        <span>@{socialLinks.twitterHandle}</span>
                        <ExternalLink className="w-3 h-3 text-vice-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {socialLinks.instagramHandle && (
                      <a
                        href={`https://instagram.com/${socialLinks.instagramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-vice-cardElevated hover:bg-vice-hover border border-vice-border text-vice-text text-xs font-semibold flex items-center gap-2 transition-colors group cursor-pointer"
                      >
                        <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
                        <span>@{socialLinks.instagramHandle}</span>
                        <ExternalLink className="w-3 h-3 text-vice-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {socialLinks.youtubeUrl && (
                      <a
                        href={socialLinks.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-vice-cardElevated hover:bg-vice-hover border border-vice-border text-vice-text text-xs font-semibold flex items-center gap-2 transition-colors group cursor-pointer"
                      >
                        <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                        <span>YouTube Channel</span>
                        <ExternalLink className="w-3 h-3 text-vice-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {socialLinks.linkedinUrl && (
                      <a
                        href={socialLinks.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-vice-cardElevated hover:bg-vice-hover border border-vice-border text-vice-text text-xs font-semibold flex items-center gap-2 transition-colors group cursor-pointer"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3 text-vice-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {socialLinks.portfolioUrl && (
                      <a
                        href={socialLinks.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-vice-cardElevated hover:bg-vice-hover border border-vice-border text-vice-text text-xs font-semibold flex items-center gap-2 transition-colors group cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Portfolio Site</span>
                        <ExternalLink className="w-3 h-3 text-vice-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {/* Empty fallback if no links */}
                    {!socialLinks.twitterHandle &&
                      !socialLinks.instagramHandle &&
                      !socialLinks.youtubeUrl &&
                      !socialLinks.linkedinUrl &&
                      !socialLinks.portfolioUrl && (
                        <span className="text-xs text-vice-muted italic">
                          No external social accounts linked yet.
                        </span>
                      )}
                  </div>
                )}
              </div>

              {/* Section 3: Direct One-Click Achievement Share Buttons */}
              <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-vice-border">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-vice-pink" />
                    <div>
                      <h3 className="font-bold text-xs text-vice-text uppercase tracking-wide">
                        Share Your Verified Achievements &amp; Vault Link
                      </h3>
                      <p className="text-[11px] text-vice-muted">
                        One-click distribution to your audience across X, LinkedIn, WhatsApp, and Instagram.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(getProfileUrl(), 'direct-link')}
                    className="px-3 py-1.5 bg-vice-cardElevated hover:bg-vice-hover text-vice-text border border-vice-border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedType === 'direct-link' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-vice-muted" />
                        <span>Copy Profile URL</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Editable Preview Blurb */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-vice-text uppercase font-mono block">
                    Achievement Share Copy (Auto-Generated):
                  </label>
                  <textarea
                    rows={3}
                    value={shareCopyText}
                    onChange={(e) => setShareCopyText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-vice-input border border-vice-border rounded-xl text-vice-text text-xs leading-relaxed focus:border-vice-pink focus:outline-hidden font-sans"
                  />
                </div>

                {/* Share CTAs Grid */}
                <div className="flex items-center gap-2.5 flex-wrap pt-1">
                  {/* Share on X */}
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Twitter className="w-3.5 h-3.5 fill-current text-white" />
                    <span>Share on X (Twitter)</span>
                  </button>

                  {/* Share on LinkedIn */}
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current text-white" />
                    <span>
                      {copiedType === 'linkedin' ? 'Caption Copied + Open LinkedIn' : 'Share on LinkedIn'}
                    </span>
                  </button>

                  {/* Share on WhatsApp */}
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Share on WhatsApp</span>
                  </button>

                  {/* Copy Instagram / YouTube Kit */}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(shareCopyText, 'kit')}
                    className="px-4 py-2 rounded-xl bg-vice-cardElevated hover:bg-vice-hover text-vice-text border border-vice-border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedType === 'kit' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied for IG / YouTube!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-vice-pink" />
                        <span>Copy IG / YouTube Kit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Section 4: Verified Vault & Master Deliverables List */}
              <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-vice-border">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    <div>
                      <h3 className="font-bold text-xs text-vice-text uppercase tracking-wide">
                        Verified Vault Master Deliveries ({vaultFiles.length})
                      </h3>
                      <p className="text-[11px] text-vice-muted">
                        High-bitrate master files unlocked and verified upon final 70% milestone release.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Full Bitrate Available
                  </span>
                </div>

                <div className="space-y-2.5">
                  {vaultFiles.map((vf) => (
                    <div
                      key={vf.id}
                      className="p-3.5 bg-vice-cardElevated border border-vice-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Film className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-vice-text block truncate font-mono text-xs">
                            {vf.name}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-vice-muted flex-wrap">
                            <span>Project: <strong className="text-vice-text">{vf.projectTitle}</strong></span>
                            <span>•</span>
                            <span>Delivered: {new Date(vf.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-vice-surface border border-vice-border text-vice-muted font-bold">
                          {(vf.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                        </span>
                        <a
                          href={vf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-vice-pink hover:bg-vice-pinkHover text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Inspect Master</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: SHOWREEL & OVERVIEW (BIO, CAPABILITIES, SHOWREEL, REVIEWS)
              ========================================================================= */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Bio & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
                  <h3 className="font-bold text-xs text-vice-pink border-b border-vice-border pb-2 uppercase tracking-wide">
                    EDITORIAL PHILOSOPHY &amp; BACKGROUND
                  </h3>
                  <p className="text-xs text-vice-text leading-relaxed font-sans">{editor.bio}</p>

                  <div>
                    <h4 className="font-bold text-xs text-vice-text mb-2">
                      Core Editing Capabilities:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {editor.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-vice-cardElevated border border-vice-border px-3 py-1 text-xs rounded-xl text-vice-text font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-vice-text mb-2">Software Stack:</h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {editor.software.map((sw) => (
                        <span
                          key={sw}
                          className="bg-vice-pink/10 text-vice-pink border border-vice-pink/20 px-3 py-1 rounded-xl font-bold"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Turnaround & Policy */}
                <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4 text-xs">
                  <h3 className="font-bold text-xs text-vice-pink border-b border-vice-border pb-2 uppercase tracking-wide">
                    ENGAGEMENT TERMS
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-vice-cardElevated rounded-xl border border-vice-border">
                      <span className="text-vice-muted block text-[11px]">TURNAROUND TIME:</span>
                      <strong className="text-vice-text text-xs">{editor.turnaround_time}</strong>
                    </div>

                    <div className="p-3.5 bg-vice-cardElevated rounded-xl border border-vice-border">
                      <span className="text-vice-muted block text-[11px]">SCHEDULE AVAILABILITY:</span>
                      <strong className="text-emerald-500 text-xs">{editor.availability}</strong>
                    </div>

                    <div className="p-3.5 bg-vice-cardElevated rounded-xl border border-vice-border">
                      <span className="text-vice-muted block text-[11px]">MILESTONE MODEL:</span>
                      <strong className="text-vice-text text-xs">30% Upfront / 70% Final Master</strong>
                    </div>
                  </div>

                  <div className="p-3.5 bg-vice-cardElevated border border-amber-500/30 text-amber-500 text-xs rounded-xl leading-relaxed">
                    Protected by EditBridge milestone hold. Client reviews timestamped draft proxy
                    prior to final master unlock.
                  </div>
                </div>
              </div>

              {/* Interactive Showreel Portfolio Section */}
              <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
                <h3 className="font-bold text-xs text-vice-pink border-b border-vice-border pb-2 flex items-center gap-2 uppercase tracking-wide">
                  <Film className="w-4 h-4" />
                  <span>VERIFIED PORTFOLIO SHOWREEL SAMPLES</span>
                </h3>

                {/* If video selected, show video player */}
                {activeVideoUrl && (
                  <div className="p-3 bg-black rounded-2xl border border-vice-border mb-4 shadow-xl">
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
                      className="p-4 rounded-2xl cursor-pointer bg-vice-cardElevated hover:bg-vice-hover border border-vice-border hover:border-vice-pink transition-all group shadow-sm"
                    >
                      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-vice-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-vice-pink flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/80 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold">
                          {item.duration}
                        </span>
                      </div>

                      <div className="mt-3.5">
                        <h4 className="font-bold text-xs text-vice-text group-hover:text-vice-pink transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-vice-muted mt-1">
                          <span>Client: {item.client || 'Verified Creator'}</span>
                          {item.views && (
                            <span className="font-bold text-vice-pink font-mono">{item.views}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Client Reviews */}
              <div className="p-6 bg-vice-surface border border-vice-border rounded-2xl space-y-4">
                <h3 className="font-bold text-xs text-vice-pink border-b border-vice-border pb-2 flex items-center gap-2 uppercase tracking-wide">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>AUTHENTIC CLIENT REVIEWS &amp; RETENTION AUDITS</span>
                </h3>

                {editorReviews.length === 0 ? (
                  <p className="text-xs text-vice-muted">
                    No public reviews recorded yet for this editor.
                  </p>
                ) : (
                  <div className="space-y-3.5">
                    {editorReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 bg-vice-cardElevated border border-vice-border rounded-2xl space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-vice-text">
                              {rev.reviewer_name}
                            </span>
                            <span className="text-amber-500 text-xs">
                              {'★'.repeat(rev.rating)}
                            </span>
                          </div>
                          <span className="text-[11px] text-vice-muted font-mono">
                            {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-xs text-vice-muted leading-relaxed font-sans">
                          &ldquo;{rev.comment}&rdquo;
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {rev.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
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
          )}
        </div>
      </RetroWindow>
    </div>
  );
}
