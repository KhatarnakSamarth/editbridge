'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  UserRole,
  Project,
  ProjectStatus,
  RevisionComment,
  RevisionCommentStatus,
  CommentCategory,
  ProjectFile,
  ProjectMessage,
  EditorProfile,
  Review,
  Notification,
  Milestone,
  DeliverableSpec,
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_EDITORS,
  INITIAL_PROJECTS,
  INITIAL_REVISION_COMMENTS,
  INITIAL_FILES,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS,
} from '@/lib/mockData';
import { retroSound } from '@/lib/soundEffects';

interface EditBridgeContextType {
  // Roles & Authentication
  currentUser: User;
  activeRole: UserRole;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;

  // Projects
  projects: Project[];
  activeProjectId: string;
  activeProject: Project | undefined;
  setActiveProjectId: (id: string) => void;
  updateProjectStatus: (projectId: string, newStatus: ProjectStatus) => void;
  createProject: (newProject: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'revisions_used'>) => string;
  setProjectActiveDraftUrl: (projectId: string, url: string) => void;
  updateProjectBrief: (
    projectId: string,
    data: {
      brief: string;
      aspectRatio?: '16:9' | '9:16';
      targetDuration?: number;
      resolution?: string;
      references?: string[];
      rawFootageLinks?: string[];
    }
  ) => void;

  // Revisions & Timestamps
  revisionComments: RevisionComment[];
  activeProjectComments: RevisionComment[];
  addRevisionComment: (data: {
    projectId: string;
    videoVersion: string;
    timestampSeconds: number;
    comment: string;
    category: CommentCategory;
  }) => void;
  updateCommentStatus: (commentId: string, status: RevisionCommentStatus) => void;

  // Files
  files: ProjectFile[];
  activeProjectFiles: ProjectFile[];
  addProjectFile: (file: Omit<ProjectFile, 'id' | 'created_at'>) => void;
  unlockMasterFile: (projectId: string) => void;

  // Messages / Chat
  messages: ProjectMessage[];
  activeProjectMessages: ProjectMessage[];
  sendMessage: (projectId: string, text: string) => void;

  // Payment Milestones
  fundUpfrontMilestone: (projectId: string) => void;
  releaseFinalMilestone: (projectId: string) => void;

  // Reviews
  reviews: Review[];
  submitReview: (data: Omit<Review, 'id' | 'created_at'>) => void;

  // Editors Directory
  editors: EditorProfile[];

  // Modern Theme & Audio Controls
  soundEnabled: boolean;
  toggleSound: () => void;
  themeMode: 'DARK' | 'LIGHT';
  toggleThemeMode: () => void;
  resetDemoData: () => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
}

const EditBridgeContext = createContext<EditBridgeContextType | null>(null);

const STORAGE_KEY = 'editbridge_state_v3';

export function EditBridgeProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('CREATOR');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [customUser, setCustomUser] = useState<User | null>(null);

  const [activeProjectId, setActiveProjectId] = useState<string>('proj-demo-1');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [revisionComments, setRevisionComments] = useState<RevisionComment[]>(INITIAL_REVISION_COMMENTS);
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  const [messages, setMessages] = useState<ProjectMessage[]>(INITIAL_MESSAGES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [themeMode, setThemeMode] = useState<'DARK' | 'LIGHT'>('DARK');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      user_id: 'user-creator-1',
      title: 'Draft v1 Uploaded',
      message: 'Alex Rivera uploaded Draft v1 for "The Great AI Bubble of 2026". Ready for your review.',
      type: 'STATUS_CHANGE',
      read: false,
      created_at: '2026-11-17T14:05:00Z',
    },
  ]);

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.revisionComments) setRevisionComments(parsed.revisionComments);
        if (parsed.files) setFiles(parsed.files);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.reviews) setReviews(parsed.reviews);
        if (parsed.activeRole) setActiveRole(parsed.activeRole);
        if (parsed.isAuthenticated !== undefined) setIsAuthenticated(parsed.isAuthenticated);
        if (parsed.customUser) setCustomUser(parsed.customUser);
        if (parsed.themeMode === 'DARK' || parsed.themeMode === 'LIGHT') {
          setThemeMode(parsed.themeMode);
        }
        if (parsed.soundEnabled !== undefined) {
          setSoundEnabled(parsed.soundEnabled);
          retroSound.enabled = parsed.soundEnabled;
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Check active server-side session cookie on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.user && res.authenticated) {
          setCustomUser(res.user);
          setActiveRole(res.user.role);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {});
  }, []);

  // Two-way Database Sync: Load live projects from PostgreSQL
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data);
        }
      })
      .catch((err) => console.warn('Could not sync projects from DB:', err));
  }, []);

  // Sync files & revisions whenever activeProjectId changes
  useEffect(() => {
    if (!activeProjectId) return;

    fetch(`/api/files?projectId=${activeProjectId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setFiles((prev) => {
            const otherFiles = prev.filter((f) => f.project_id !== activeProjectId);
            return [...res.data, ...otherFiles];
          });
        }
      })
      .catch((err) => console.warn('Could not sync files from DB:', err));

    fetch(`/api/revisions?projectId=${activeProjectId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setRevisionComments((prev) => {
            const otherComments = prev.filter((c) => c.project_id !== activeProjectId);
            return [...res.data, ...otherComments];
          });
        }
      })
      .catch((err) => console.warn('Could not sync revisions from DB:', err));

    fetch(`/api/messages?projectId=${activeProjectId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setMessages((prev) => {
            const otherMessages = prev.filter((m) => m.project_id !== activeProjectId);
            return [...res.data, ...otherMessages];
          });
        }
      })
      .catch((err) => console.warn('Could not sync messages from DB:', err));
  }, [activeProjectId]);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          projects,
          revisionComments,
          files,
          messages,
          reviews,
          activeRole,
          isAuthenticated,
          customUser,
          themeMode,
          soundEnabled,
        })
      );
    } catch {
      // ignore
    }
  }, [projects, revisionComments, files, messages, reviews, activeRole, isAuthenticated, customUser, themeMode, soundEnabled]);

  // Apply dark / light class to root document & body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('theme-cyan', 'theme-purple', 'theme-emerald', 'theme-amber', 'theme-rose');
      if (themeMode === 'DARK') {
        root.classList.add('dark');
        root.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light', 'theme-retro');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark', 'theme-retro');
      }
    }
  }, [themeMode]);

  const toggleThemeMode = () => {
    retroSound.playClick();
    setThemeMode((prev) => (prev === 'DARK' ? 'LIGHT' : 'DARK'));
  };

  // Sound sync
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    retroSound.enabled = next;
    if (next) retroSound.playDing();
  };

  const resetDemoData = () => {
    retroSound.playDing();
    setProjects(INITIAL_PROJECTS);
    setRevisionComments(INITIAL_REVISION_COMMENTS);
    setFiles(INITIAL_FILES);
    setMessages(INITIAL_MESSAGES);
    setReviews(INITIAL_REVIEWS);
    setActiveProjectId('proj-demo-1');
    setActiveRole('CREATOR');
    setIsAuthenticated(false);
    setCustomUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Derive Current User based on authentication and active role
  const currentUser: User = useMemo(() => {
    if (!isAuthenticated) {
      return {
        id: 'guest',
        name: 'Guest Visitor',
        email: 'guest@editbridge.network',
        role: 'CREATOR',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
        account_status: 'ACTIVE',
        badge: 'Guest (Sign in to unlock)',
      };
    }
    if (customUser && customUser.role === activeRole) {
      return customUser;
    }
    if (activeRole === 'CREATOR') {
      return INITIAL_USERS[0]; // Marcus Sterling
    }
    if (activeRole === 'EDITOR') {
      return INITIAL_USERS[1]; // Alex Rivera
    }
    return INITIAL_USERS[5]; // Elena Drake (Root Admin)
  }, [isAuthenticated, activeRole, customUser]);

  const switchRole = (role: UserRole) => {
    retroSound.playClick();
    setActiveRole(role);
  };

  const loginAsDemo = (role: UserRole) => {
    retroSound.playDing();
    setActiveRole(role);
    setIsAuthenticated(true);
    setCustomUser(null);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        retroSound.playDing();
        setCustomUser(data.user);
        setActiveRole(data.user.role as UserRole);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err: any) {
      // Fallback for offline demo
      const normalized = email.toLowerCase().trim();
      if (normalized.includes('creator') || normalized.includes('marcus')) {
        loginAsDemo('CREATOR');
        return { success: true };
      }
      if (normalized.includes('editor') || normalized.includes('alex')) {
        loginAsDemo('EDITOR');
        return { success: true };
      }
      if (normalized.includes('admin') || normalized.includes('ops')) {
        loginAsDemo('ADMIN');
        return { success: true };
      }
      return { success: false, error: 'Authentication service unavailable' };
    }
  };

  const logout = useCallback(() => {
    retroSound.playClick();
    setIsAuthenticated(false);
    setCustomUser(null);
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  }, []);

  // Active Project
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  // Active Project Comments
  const activeProjectComments = useMemo(() => {
    return revisionComments
      .filter((c) => c.project_id === activeProjectId)
      .sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);
  }, [revisionComments, activeProjectId]);

  // Active Project Files
  const activeProjectFiles = useMemo(() => {
    return files.filter((f) => f.project_id === activeProjectId);
  }, [files, activeProjectId]);

  // Active Project Messages
  const activeProjectMessages = useMemo(() => {
    return messages
      .filter((m) => m.project_id === activeProjectId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [messages, activeProjectId]);

  // Update Project Status
  const updateProjectStatus = (projectId: string, newStatus: ProjectStatus) => {
    retroSound.playDing();
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus, updated_at: new Date().toISOString() } : p))
    );

    // Call API in background
    fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
  };

  // Create Project
  const createProject = (newProjectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'revisions_used'>) => {
    retroSound.playDing();
    const newId = `proj-${Date.now()}`;

    const deliverables: DeliverableSpec = Object.assign(
      {
        aspect_ratio: '16:9' as const,
        target_duration_minutes: 10,
        resolution: '4K (3840x2160)' as const,
        captions_included: true,
        thumbnail_concept: true,
        sound_design: true,
        color_grading: true,
      },
      newProjectData.deliverables
    );

    const milestones: Milestone[] =
      newProjectData.milestones && newProjectData.milestones.length > 0
        ? newProjectData.milestones
        : [
            {
              id: `ms-${newId}-1`,
              name: 'Milestone 1: 30% Upfront Kickoff',
              description: '30% Kickoff Escrow',
              percentage: 30,
              amount: Math.round((newProjectData.budget || 500) * 0.3),
              status: 'ESCROW_FUNDED',
            },
            {
              id: `ms-${newId}-2`,
              name: 'Milestone 2: 70% Final Master Release',
              description: '70% Final Master Release',
              percentage: 70,
              amount: Math.round((newProjectData.budget || 500) * 0.7),
              status: 'PENDING',
            },
          ];

    const newProj: Project = {
      ...newProjectData,
      deliverables,
      milestones,
      references: newProjectData.references || [],
      raw_footage_links: newProjectData.raw_footage_links || [],
      id: newId,
      revisions_used: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newId);

    // Call API in background
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj),
    }).catch(() => {});

    return newId;
  };

  // Add Revision Comment
  const addRevisionComment = (data: {
    projectId: string;
    videoVersion: string;
    timestampSeconds: number;
    comment: string;
    category: CommentCategory;
  }) => {
    retroSound.playDing();
    const mins = Math.floor(data.timestampSeconds / 60);
    const secs = Math.floor(data.timestampSeconds % 60);
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const newComment: RevisionComment = {
      id: `rev-${Date.now()}`,
      project_id: data.projectId,
      video_version: data.videoVersion,
      timestamp_seconds: data.timestampSeconds,
      formatted_time: formatted,
      comment: data.comment,
      category: data.category,
      status: 'PENDING',
      created_by_name: currentUser.name,
      created_by_role: activeRole,
      created_at: new Date().toISOString(),
    };

    setRevisionComments((prev) => [...prev, newComment]);

    // Send to API
    fetch('/api/revisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: data.projectId,
        time_seconds: data.timestampSeconds,
        comment: data.comment,
        category: data.category,
        author_id: currentUser.id,
      }),
    }).catch(() => {});
  };

  // Update Comment Status
  const updateCommentStatus = (commentId: string, status: RevisionCommentStatus) => {
    retroSound.playClick();
    setRevisionComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, status, resolved_at: status === 'RESOLVED' ? new Date().toISOString() : undefined }
          : c
      )
    );

    fetch('/api/revisions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: commentId, status }),
    }).catch(() => {});
  };

  // Add Project File (Persists to PostgreSQL Database & Updates activeDraftUrl if video)
  const addProjectFile = (fileData: Omit<ProjectFile, 'id' | 'created_at'>) => {
    retroSound.playDing();
    const tempId = `file-${Date.now()}`;
    const newFile: ProjectFile = {
      ...fileData,
      id: tempId,
      created_at: new Date().toISOString(),
    };

    // Optimistically update local files
    setFiles((prev) => [newFile, ...prev]);

    // If this is a draft video, update the project's active draft URL immediately!
    if (fileData.file_type === 'DRAFT_VIDEO') {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === fileData.project_id
            ? { ...p, active_draft_url: fileData.url, updated_at: new Date().toISOString() }
            : p
        )
      );
    }

    // Persist to Database API
    fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setFiles((prev) => prev.map((f) => (f.id === tempId ? res.data : f)));
          if (res.activeDraftUrl) {
            setProjects((prev) =>
              prev.map((p) =>
                p.id === fileData.project_id
                  ? { ...p, active_draft_url: res.activeDraftUrl }
                  : p
              )
            );
          }
        }
      })
      .catch((err) => console.error('Failed to save file to DB:', err));
  };

  // Set Project Active Draft URL (persists in DB)
  const setProjectActiveDraftUrl = (projectId: string, url: string) => {
    retroSound.playDing();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, active_draft_url: url, updated_at: new Date().toISOString() }
          : p
      )
    );

    fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active_draft_url: url }),
    }).catch((err) => console.error('Failed to update activeDraftUrl in DB:', err));
  };

  // Update Project Brief (persists in DB)
  const updateProjectBrief = (
    projectId: string,
    data: {
      brief: string;
      aspectRatio?: '16:9' | '9:16';
      targetDuration?: number;
      resolution?: string;
      references?: string[];
      rawFootageLinks?: string[];
    }
  ) => {
    retroSound.playDing();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          brief: data.brief,
          deliverables: {
            ...p.deliverables,
            aspect_ratio: data.aspectRatio || p.deliverables?.aspect_ratio || '16:9',
            target_duration_minutes: data.targetDuration || p.deliverables?.target_duration_minutes || 10,
            resolution: (data.resolution as any) || p.deliverables?.resolution || '4K (3840x2160)',
          },
          references: data.references || p.references || [],
          raw_footage_links: data.rawFootageLinks || p.raw_footage_links || [],
          updated_at: new Date().toISOString(),
        };
      })
    );

    fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brief: data.brief,
        aspectRatio: data.aspectRatio,
        targetDuration: data.targetDuration ? `${data.targetDuration} min` : undefined,
      }),
    }).catch((err) => console.error('Failed to update brief in DB:', err));
  };

  // Unlock Master File
  const unlockMasterFile = (projectId: string) => {
    retroSound.playDing();
    setFiles((prev) =>
      prev.map((f) =>
        f.project_id === projectId && (f.file_type === 'FINAL_MASTER' || f.is_master_delivery)
          ? { ...f, is_locked: false }
          : f
      )
    );
  };

  // Send Message
  const sendMessage = (projectId: string, text: string) => {
    retroSound.playDing();
    const newMsg: ProjectMessage = {
      id: `msg-${Date.now()}`,
      project_id: projectId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_avatar: currentUser.avatar,
      sender_role: activeRole,
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: projectId,
        sender_id: currentUser.id,
        text,
      }),
    }).catch(() => {});
  };

  // Fund Upfront Milestone
  const fundUpfrontMilestone = (projectId: string) => {
    retroSound.playDing();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedMilestones = p.milestones.map((m) =>
            m.percentage === 30 ? { ...m, status: 'RELEASED' as const, released_at: new Date().toISOString() } : m
          );
          return {
            ...p,
            status: 'EDITING',
            milestones: updatedMilestones,
            escrow: {
              total_budget: p.budget,
              upfront_percentage: 30,
              upfront_amount: p.budget * 0.3,
              final_percentage: 70,
              final_amount: p.budget * 0.7,
              final_released: p.escrow?.final_released ?? false,
              ...p.escrow,
              upfront_released: true,
            },
          };
        }
        return p;
      })
    );
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  // Release Final Milestone (Master File Unlocked!)
  const releaseFinalMilestone = (projectId: string) => {
    retroSound.playDing();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedMilestones = p.milestones.map((m) =>
            m.percentage === 70 ? { ...m, status: 'RELEASED' as const, released_at: new Date().toISOString() } : m
          );
          return {
            ...p,
            status: 'COMPLETED',
            watermark_active: false,
            milestones: updatedMilestones,
            escrow: {
              total_budget: p.budget,
              upfront_percentage: 30,
              upfront_amount: p.budget * 0.3,
              upfront_released: p.escrow?.upfront_released ?? true,
              final_percentage: 70,
              final_amount: p.budget * 0.7,
              ...p.escrow,
              final_released: true,
            },
          };
        }
        return p;
      })
    );
    unlockMasterFile(projectId);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {}
  };

  // Submit Review
  const submitReview = (data: Omit<Review, 'id' | 'created_at'>) => {
    retroSound.playDing();
    const newRev: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const contextValue = useMemo<EditBridgeContextType>(
    () => ({
      currentUser,
      activeRole,
      isAuthenticated,
      switchRole,
      login,
      loginAsDemo,
      logout,
      projects,
      activeProjectId,
      activeProject,
      setActiveProjectId,
      updateProjectStatus,
      createProject,
      setProjectActiveDraftUrl,
      updateProjectBrief,
      revisionComments,
      activeProjectComments,
      addRevisionComment,
      updateCommentStatus,
      files,
      activeProjectFiles,
      addProjectFile,
      unlockMasterFile,
      messages,
      activeProjectMessages,
      sendMessage,
      fundUpfrontMilestone,
      releaseFinalMilestone,
      reviews,
      submitReview,
      editors: INITIAL_EDITORS,
      soundEnabled,
      toggleSound,
      themeMode,
      toggleThemeMode,
      resetDemoData,
      notifications,
      markNotificationRead,
    }),
    [
      currentUser,
      activeRole,
      isAuthenticated,
      projects,
      activeProjectId,
      activeProject,
      revisionComments,
      activeProjectComments,
      files,
      activeProjectFiles,
      messages,
      activeProjectMessages,
      reviews,
      soundEnabled,
      themeMode,
      notifications,
      logout,
    ]
  );

  return (
    <EditBridgeContext.Provider value={contextValue}>
      {children}
    </EditBridgeContext.Provider>
  );
}

export function useEditBridge() {
  const context = useContext(EditBridgeContext);
  if (!context) {
    throw new Error('useEditBridge must be used within an EditBridgeProvider');
  }
  return context;
}
