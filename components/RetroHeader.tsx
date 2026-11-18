'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Film,
  FolderKanban,
  Users,
  ShieldAlert,
  Menu,
  X,
  PlusCircle,
  FileCheck2,
  LogIn,
  LogOut,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export function RetroHeader() {
  const pathname = usePathname();
  const {
    activeRole,
    currentUser,
    isAuthenticated,
    logout,
    soundEnabled,
    toggleSound,
    themeMode,
    toggleThemeMode,
  } = useEditBridge();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Dynamic Navigation Links strictly tailored by Authentication & Role
  const navLinks = React.useMemo(() => {
    if (!isAuthenticated) {
      return [
        { href: '/', label: 'Overview', icon: Film, requiresAuth: false },
        { href: '/editors', label: 'Explore Editors', icon: Users, requiresAuth: false },
        { href: '/workspace', label: 'Workspace', icon: Sparkles, requiresAuth: true },
        { href: '/projects', label: 'Projects', icon: FolderKanban, requiresAuth: true },
      ];
    }

    if (activeRole === 'CREATOR') {
      return [
        { href: '/workspace', label: 'Creator Studio', icon: Sparkles, requiresAuth: false },
        { href: '/projects', label: 'My Projects', icon: FolderKanban, requiresAuth: false },
        { href: '/editors', label: 'Find Editors', icon: Users, requiresAuth: false },
        { href: '/projects/new', label: '+ Post Brief', icon: PlusCircle, requiresAuth: false },
      ];
    }
    if (activeRole === 'EDITOR') {
      return [
        { href: '/workspace', label: 'Editor Studio', icon: Sparkles, requiresAuth: false },
        { href: '/projects', label: 'Assigned Jobs', icon: FolderKanban, requiresAuth: false },
        { href: '/workspace?tab=files', label: 'Vault & Master Delivery', icon: FileCheck2, requiresAuth: false },
      ];
    }
    // ADMIN role
    return [
      { href: '/admin', label: 'Operational Control (Admin Ops)', icon: ShieldAlert, requiresAuth: false },
      { href: '/workspace', label: 'Workspace Inspector', icon: Sparkles, requiresAuth: false },
      { href: '/projects', label: 'All Projects', icon: FolderKanban, requiresAuth: false },
      { href: '/editors', label: 'Vetting Queue', icon: Users, requiresAuth: false },
    ];
  }, [isAuthenticated, activeRole]);

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/95 dark:bg-[#070b14]/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md select-none transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/"
            onClick={() => retroSound.playClick()}
            className="flex items-center gap-2.5 group focus-visible:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Edit<span className="text-cyan-600 dark:text-cyan-400">Bridge</span>
                </span>
                <span className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold border border-cyan-500/20">
                  SaaS
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block mt-0.5">
                Creator–Editor Collaboration
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Desktop Navigation links (Stable, No Layout Shift) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => retroSound.playClick()}
                className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
                {!isAuthenticated && item.requiresAuth && (
                  <Lock className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0 ml-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Controls & User Authentication Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Mode Toggle */}
          <button
            onClick={toggleThemeMode}
            title={themeMode === 'DARK' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light and Dark Mode"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            {themeMode === 'DARK' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* User Profile Section (Locked Identity - No Unauthorized Role Switching) */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {/* User Avatar */}
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600">
                  {currentUser.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* User Name & Locked Role Pill */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      activeRole === 'ADMIN'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        : activeRole === 'EDITOR'
                        ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30'
                        : 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {activeRole}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                        {currentUser.email}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            activeRole === 'ADMIN'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : activeRole === 'EDITOR'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          Role: {activeRole}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={activeRole === 'ADMIN' ? '/admin' : '/workspace'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2 font-medium transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{activeRole === 'ADMIN' ? 'Operational Control' : 'Active Workspace'}</span>
                    </Link>

                    <Link
                      href="/signin"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2 font-medium transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-400" />
                      <span>Switch Account</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-semibold transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                onClick={() => retroSound.playClick()}
                className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-500" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                onClick={() => retroSound.playClick()}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 md:hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] p-3 space-y-2 shadow-xl">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  retroSound.playClick();
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs flex items-center justify-between font-medium ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {!isAuthenticated && item.requiresAuth && (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            {isAuthenticated ? (
              <>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {currentUser.name} ({activeRole})
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-bold"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-cyan-600 text-white rounded-xl font-bold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
