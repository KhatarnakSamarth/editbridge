'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  KeyRound,
  Mail,
  ArrowRight,
  Sparkles,
  UserCheck,
  Film,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export default function SignInPage() {
  const router = useRouter();
  const { login, loginAsDemo } = useEditBridge();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const sampleAccounts = [
    {
      role: 'CREATOR' as const,
      name: 'Marcus Sterling',
      badge: 'Creator (480K Subs)',
      email: 'marcus@sterlingcapital.yt',
      password: 'creator123',
      color: 'blue',
      icon: Film,
      desc: 'Escrow release, revision review, editor hiring',
    },
    {
      role: 'EDITOR' as const,
      name: 'Alex Rivera',
      badge: 'Top Rated Pro Editor',
      email: 'alex@riverafilm.com',
      password: 'editor123',
      color: 'purple',
      icon: Scissors,
      desc: 'Timecode checklist, master uploads, payout vault',
    },
    {
      role: 'ADMIN' as const,
      name: 'Elena Drake',
      badge: 'Chief Ops Arbiter',
      email: 'ops@editbridge.network',
      password: 'admin123',
      color: 'amber',
      icon: Shield,
      desc: 'GMV audit, dispute resolution, editor verification',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        setSuccessMessage('Authentication verified! Redirecting to workspace...');
        setTimeout(() => {
          router.push('/workspace');
        }, 600);
      } else {
        setErrorMessage(result.error || 'Invalid credentials. Please try sample accounts below.');
      }
    } catch {
      setErrorMessage('Unable to reach server. You can click 1-Click Demo Login below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: 'CREATOR' | 'EDITOR' | 'ADMIN', credEmail: string, credPass: string) => {
    setEmail(credEmail);
    setPassword(credPass);
    loginAsDemo(role);
    setSuccessMessage(`Logged in as ${credEmail}! Redirecting...`);
    setTimeout(() => {
      if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/workspace');
      }
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome to <span className="text-cyan-600 dark:text-cyan-400">EditBridge</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            Log in to manage video revisions, 30/70 escrow milestones, and master deliverables.
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-none space-y-5 transition-colors">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/70 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/70 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. marcus@sterlingcapital.yt"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              onClick={() => retroSound.playClick()}
              className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Hackathon Judge / Demo Credentials Card */}
        <div className="bg-slate-100/80 dark:bg-[#070b14]/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>JUDGES &amp; HACKATHON TEST CREDENTIALS</span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-300 font-mono font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
              Instant 1-Click
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Click any demo profile to instantly authenticate into their scoped dashboard:
          </p>

          <div className="space-y-2">
            {sampleAccounts.map((acc) => {
              const Icon = acc.icon;
              return (
                <div
                  key={acc.role}
                  className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-cyan-400/50 transition-colors shadow-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        acc.role === 'CREATOR'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : acc.role === 'EDITOR'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="text-xs text-slate-900 dark:text-white">
                          {acc.name}
                        </strong>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-medium">
                          {acc.role}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {acc.email} • pass: <code className="text-slate-800 dark:text-slate-200">{acc.password}</code>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickLogin(acc.role, acc.email, acc.password)}
                    className="self-end sm:self-center px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800 dark:hover:bg-cyan-950/60 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-400/40 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Demo 1-Click</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
