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
        { href: '/signin', label: 'Editor Vaults', icon: FileCheck2, requiresAuth: true },
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
      const editorVaultHref = currentUser?.id ? `/editors/${currentUser.id}?tab=vault` : '/signin';
      return [
        { href: '/workspace', label: 'Editor Studio', icon: Sparkles, requiresAuth: false },
        { href: '/projects', label: 'Assigned Jobs', icon: FolderKanban, requiresAuth: false },
        { href: editorVaultHref, label: 'Editor Vaults', icon: FileCheck2, requiresAuth: false },
      ];
    }
    // ADMIN role
    return [
      { href: '/admin', label: 'Operational Control (Admin Ops)', icon: ShieldAlert, requiresAuth: false },
      { href: '/workspace', label: 'Workspace Inspector', icon: Sparkles, requiresAuth: false },
      { href: '/projects', label: 'All Projects', icon: FolderKanban, requiresAuth: false },
      { href: '/editors', label: 'Editor Directory & Vetting', icon: Users, requiresAuth: false },
    ];
  }, [isAuthenticated, activeRole, currentUser]);

  return (
    <header className="sticky top-0 z-50 h-16 bg-vice-bg/95 border-b border-vice-border backdrop-blur-md select-none transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/"
            onClick={() => retroSound.playClick()}
            className="flex items-center gap-2.5 group focus-visible:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-vice-pink via-vice-coral to-vice-gold flex items-center justify-center text-white font-extrabold text-sm shadow-xs group-hover:scale-105 transition-all">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base tracking-tight text-vice-text">
                  Edit<span className="text-vice-pink">Bridge</span>
                </span>
                <span className="bg-vice-pink/10 text-vice-pink text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold border border-vice-pink/20">
                  STUDIO
                </span>
              </div>
              <span className="text-[10px] text-vice-muted font-medium hidden sm:block mt-0.5">
                Creator–Editor Collaboration
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Desktop Navigation links (Stable, No Layout Shift) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {navLinks.map((item) => {
            const basePath = item.href.split('?')[0];
            const isActive = pathname === item.href || (basePath !== '/' && pathname === basePath);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => retroSound.playClick()}
                className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-vice-pink/10 text-vice-pink border border-vice-pink/30 shadow-xs font-bold'
                    : 'text-vice-muted hover:text-vice-text hover:bg-vice-hover border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-vice-pink' : 'text-vice-muted'
                  }`}
                />
                <span>{item.label}</span>
                {!isAuthenticated && item.requiresAuth && (
                  <Lock className="w-3 h-3 text-vice-dim shrink-0 ml-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Controls & User Authentication Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Mode Toggle (Dark & Light) */}
          <button
            onClick={toggleThemeMode}
            title={themeMode === 'DARK' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light and Dark Mode"
            className="w-9 h-9 rounded-xl bg-vice-surface hover:bg-vice-hover text-vice-gold border border-vice-border flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            {themeMode === 'DARK' ? (
              <Sun className="w-4 h-4 text-vice-gold" />
            ) : (
              <Moon className="w-4 h-4 text-vice-pink" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
            className="w-9 h-9 rounded-xl bg-vice-surface hover:bg-vice-hover text-vice-muted border border-vice-border hidden sm:flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-vice-mint" />
            ) : (
              <VolumeX className="w-4 h-4 text-vice-dim" />
            )}
          </button>

          {/* User Profile Section (Locked Identity - No Unauthorized Role Switching) */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="h-9 px-2.5 rounded-xl border border-vice-border bg-vice-surface hover:bg-vice-hover flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {/* User Avatar */}
                <div className="w-6 h-6 rounded-full bg-vice-cardElevated overflow-hidden shrink-0 border border-vice-border">
                  {currentUser.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-vice-text">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* User Name & Locked Role Pill */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-xs font-bold text-vice-text max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      activeRole === 'ADMIN'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : activeRole === 'EDITOR'
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                        : 'bg-vice-pink/10 text-vice-pink border border-vice-pink/20'
                    }`}
                  >
                    {activeRole}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-vice-muted" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-vice-surface border border-vice-border shadow-xl z-50 p-2 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-vice-border">
                      <div className="font-bold text-vice-text truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-vice-muted truncate font-mono">
                        {currentUser.email}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            activeRole === 'ADMIN'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : activeRole === 'EDITOR'
                              ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                              : 'bg-vice-pink/10 text-vice-pink'
                          }`}
                        >
                          Role: {activeRole}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={activeRole === 'ADMIN' ? '/admin' : '/workspace'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-vice-text hover:bg-vice-hover flex items-center gap-2 font-medium transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-vice-pink" />
                      <span>{activeRole === 'ADMIN' ? 'Operational Control' : 'Active Workspace'}</span>
                    </Link>

                    {activeRole === 'EDITOR' && (
                      <Link
                        href={currentUser?.id ? `/editors/${currentUser.id}?tab=vault` : '/signin'}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full px-3 py-2 rounded-xl text-vice-text hover:bg-vice-hover flex items-center gap-2 font-medium transition-colors"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-vice-coral" />
                        <span>My Vault & Stats</span>
                      </Link>
                    )}

                    <Link
                      href="/signin"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-vice-muted hover:text-vice-text hover:bg-vice-hover flex items-center gap-2 font-medium transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 text-vice-dim" />
                      <span>Switch Account</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 font-semibold transition-colors cursor-pointer text-left"
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
                className="h-9 px-3.5 rounded-xl border border-vice-border bg-vice-surface text-xs font-semibold text-vice-text hover:bg-vice-hover flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-vice-pink" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                onClick={() => retroSound.playClick()}
                className="h-9 px-4 rounded-xl bg-vice-gradient text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-xs hover:opacity-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 md:hidden bg-vice-surface border border-vice-border rounded-xl text-vice-text flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-vice-border bg-vice-surface p-3 space-y-2 shadow-xl">
          {navLinks.map((item) => {
            const basePath = item.href.split('?')[0];
            const isActive = pathname === item.href || (basePath !== '/' && pathname === basePath);
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
                    ? 'bg-vice-pink/10 text-vice-pink border border-vice-pink/30 font-bold'
                    : 'text-vice-muted hover:text-vice-text hover:bg-vice-hover'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {!isAuthenticated && item.requiresAuth && (
                  <Lock className="w-3.5 h-3.5 text-vice-dim" />
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-vice-border flex items-center justify-between text-xs">
            {isAuthenticated ? (
              <>
                <span className="text-vice-muted font-medium">
                  {currentUser.name} ({activeRole})
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-vice-surface text-vice-text rounded-xl font-bold border border-vice-border"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-vice-gradient text-white rounded-xl font-bold"
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
