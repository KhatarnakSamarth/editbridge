'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Mail,
  KeyRound,
  Film,
  Scissors,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useEditBridge();

  const [role, setRole] = useState<'CREATOR' | 'EDITOR'>('CREATOR');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Creator fields
  const [channelName, setChannelName] = useState('');
  const [platform, setPlatform] = useState('YouTube');

  // Editor fields
  const [bio, setBio] = useState('');
  const [niches, setNiches] = useState('Tech & Finance, Documentaries');
  const [primarySoftware, setPrimarySoftware] = useState('DaVinci Resolve Studio');
  const [hourlyRate, setHourlyRate] = useState('60');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !email || !password) {
      setErrorMessage('Full name, email, and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
          channelName,
          platform,
          bio,
          niches,
          primarySoftware,
          hourlyRate: Number(hourlyRate) || 50,
        }),
      });

      const data = await res.json();
      if (data.success) {
        retroSound.playDing();
        setSuccessMessage('Account created successfully! Logging you in...');
        await login(email, password);
        setTimeout(() => {
          router.push(role === 'CREATOR' ? '/projects/new' : '/workspace');
        }, 800);
      } else {
        setErrorMessage(data.error || 'Failed to create account.');
      }
    } catch {
      setErrorMessage('Error connecting to registration server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-lg w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-vice-gradient text-white shadow-lg shadow-pink-500/25 mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-vice-text">
            Join <span className="inline-block bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">EditBridge</span>
          </h1>
          <p className="text-xs sm:text-sm text-vice-muted max-w-sm mx-auto">
            Choose your role to get started with verified milestones and escrow-protected video workflows.
          </p>
        </div>

        {/* Role Selection Segmented Pill */}
        <div className="bg-vice-cardElevated p-1 rounded-2xl border border-vice-border grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              retroSound.playClick();
              setRole('CREATOR');
            }}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'CREATOR'
                ? 'bg-vice-gradient text-white shadow-xs'
                : 'text-vice-muted hover:text-vice-text'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>I am a Content Creator</span>
          </button>

          <button
            type="button"
            onClick={() => {
              retroSound.playClick();
              setRole('EDITOR');
            }}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'EDITOR'
                ? 'bg-gradient-to-r from-vice-coral to-vice-gold text-white shadow-xs'
                : 'text-vice-muted hover:text-vice-text'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>I am a Video Editor</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-vice-surface border border-vice-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 transition-colors">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-500 dark:text-rose-400 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-vice-mint shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-vice-text mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jordan Brooks"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl focus:outline-hidden focus:border-vice-pink focus:ring-2 focus:ring-vice-pink/20 text-vice-text transition-all placeholder:text-vice-dim"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-vice-text mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-vice-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jordan@channel.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl focus:outline-hidden focus:border-vice-pink focus:ring-2 focus:ring-vice-pink/20 text-vice-text transition-all placeholder:text-vice-dim"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-vice-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-vice-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl focus:outline-hidden focus:border-vice-pink focus:ring-2 focus:ring-vice-pink/20 text-vice-text transition-all placeholder:text-vice-dim"
                />
              </div>
            </div>

            {/* Role Specific Additional Fields */}
            {role === 'CREATOR' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-vice-text mb-1.5">
                    Channel / Show Name
                  </label>
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="e.g. Tech Horizon"
                    className="w-full px-3.5 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl text-vice-text focus:border-vice-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-vice-text mb-1.5">
                    Primary Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl text-vice-text focus:border-vice-pink"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok / Reels</option>
                    <option value="Podcasting">Podcasting</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-vice-text mb-1.5">
                    Editor Headline / Bio
                  </label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. Documentary Storyteller & Sound Foley Specialist"
                    className="w-full px-3.5 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl text-vice-text focus:border-vice-pink"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-vice-text mb-1.5">
                      Primary Software
                    </label>
                    <select
                      value={primarySoftware}
                      onChange={(e) => setPrimarySoftware(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl text-vice-text focus:border-vice-pink"
                    >
                      <option value="DaVinci Resolve Studio">DaVinci Resolve Studio</option>
                      <option value="Adobe Premiere Pro">Adobe Premiere Pro</option>
                      <option value="Final Cut Pro">Final Cut Pro</option>
                      <option value="After Effects">After Effects Focus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-vice-text mb-1.5">
                      Hourly Rate ($ USD)
                    </label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="60"
                      className="w-full px-3.5 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl text-vice-text focus:border-vice-pink"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-vice-gradient hover:opacity-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>Creating Account in Database...</span>
              ) : (
                <>
                  <span>Create Account &amp; Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-vice-muted border-t border-vice-border">
            Already have an account?{' '}
            <Link
              href="/signin"
              onClick={() => retroSound.playClick()}
              className="font-semibold text-vice-pink hover:text-vice-coral hover:underline"
            >
              Sign In with Demo Credentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
