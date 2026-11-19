'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  KeyRound,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export default function SignInPage() {
  const router = useRouter();
  const { login } = useEditBridge();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        setSuccessMessage('Authentication verified! Redirecting...');
        setTimeout(() => {
          if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('ops')) {
            router.push('/admin');
          } else {
            router.push('/workspace');
          }
        }, 500);
      } else {
        setErrorMessage(result.error || 'Invalid email or password. Please verify your credentials.');
      }
    } catch {
      setErrorMessage('Unable to reach authentication service. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-vice-gradient text-white shadow-lg shadow-pink-500/25 mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-vice-text">
            Welcome to <span className="inline-block bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">EditBridge</span>
          </h1>
          <p className="text-xs sm:text-sm text-vice-muted max-w-sm mx-auto">
            Log in to manage video revisions, 30/70 escrow milestones, and master deliverables.
          </p>
        </div>

        {/* Login Form Container */}
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
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-vice-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. marcus@sterlingcapital.yt"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl focus:outline-hidden focus:border-vice-pink focus:ring-2 focus:ring-vice-pink/20 text-vice-text transition-all placeholder:text-vice-dim"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-vice-text">
                  Password
                </label>
                <span className="text-[11px] text-vice-pink hover:text-vice-coral hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-vice-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-vice-input border border-vice-border rounded-xl focus:outline-hidden focus:border-vice-pink focus:ring-2 focus:ring-vice-pink/20 text-vice-text transition-all placeholder:text-vice-dim"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-vice-dim hover:text-vice-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-vice-gradient hover:opacity-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
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

          <div className="pt-2 text-center text-xs text-vice-muted border-t border-vice-border">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              onClick={() => retroSound.playClick()}
              className="font-semibold text-vice-pink hover:text-vice-coral hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Production Trust & Security Footer */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-vice-dim pt-2">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-vice-mint" />
            <span>256-Bit Escrow Vault</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-vice-pink" />
            <span>Supabase Cloud Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
