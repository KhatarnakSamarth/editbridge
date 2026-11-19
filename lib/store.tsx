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
  activeProjectId: string | null;
  activeProject: Project | undefined;
  setActiveProjectId: (id: string | null) => void;
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
  addProjectFile: (file: Omit<ProjectFile, 'id' | 'created_at'> & { id?: string; created_at?: string }) => void;
  deleteProjectFile: (fileId: string) => Promise<boolean>;
  unlockMasterFile: (projectId: string) => void;
  refreshActiveProject: () => Promise<void>;

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

/**
 * Validates video URLs to prevent broken 404s and playback failures.
 * Rejects legacy '/videos/sample-...', 'blob:', empty strings, or strings containing 'sample-'.
 */
export function isValidVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed === '#' ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/videos/sample-') ||
    trimmed.includes('sample-draft-') ||
    trimmed.includes('sample-final-') ||
    trimmed.includes('sample-short-')
  ) {
    return false;
  }
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    (trimmed.startsWith('/') && !trimmed.startsWith('/videos/'))
  );
}

export function EditBridgeProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('CREATOR');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [customUser, setCustomUser] = useState<User | null>(null);

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [revisionComments, setRevisionComments] = useState<RevisionComment[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
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

  // Load from LocalStorage if available (with strict legacy sample video purging)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const isAuth = Boolean(parsed.isAuthenticated);
        if (parsed.isAuthenticated !== undefined) setIsAuthenticated(parsed.isAuthenticated);
        if (parsed.customUser) setCustomUser(parsed.customUser);
        if (parsed.activeRole) setActiveRole(parsed.activeRole);
        if (parsed.themeMode === 'DARK' || parsed.themeMode === 'LIGHT') {
          setThemeMode(parsed.themeMode);
        }
        if (parsed.soundEnabled !== undefined) {
          setSoundEnabled(parsed.soundEnabled);
          retroSound.enabled = parsed.soundEnabled;
        }

        if (isAuth) {
          // If authenticated, NEVER restore mock projects like 'proj-demo-1' or 'proj-1'
          if (parsed.projects && Array.isArray(parsed.projects)) {
            const realProjects = parsed.projects.filter(
              (p: Project) =>
                !p.id.startsWith('mock-') &&
                p.id !== 'proj-demo-1' &&
                p.id !== 'proj-demo-2' &&
                p.id !== 'proj-demo-3' &&
                p.id !== 'proj-demo-4' &&
                p.id !== 'proj-1'
            );
            if (realProjects.length > 0) {
              setProjects(realProjects);
              if (parsed.activeProjectId && realProjects.some((p: Project) => p.id === parsed.activeProjectId)) {
                setActiveProjectId(parsed.activeProjectId);
              } else {
                setActiveProjectId(realProjects[0].id);
              }
            } else {
              setProjects([]);
              setActiveProjectId(null);
            }
          } else {
            setProjects([]);
            setActiveProjectId(null);
          }
        } else {
          // Unauthenticated visitor
          if (parsed.projects && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
            setProjects(parsed.projects);
            setActiveProjectId(parsed.activeProjectId || parsed.projects[0]?.id || null);
          }
        }

        if (parsed.revisionComments) setRevisionComments(parsed.revisionComments);
        if (parsed.files && Array.isArray(parsed.files)) {
          const sanitizedFiles = parsed.files.filter((f: ProjectFile) => isValidVideoUrl(f.url));
          setFiles(sanitizedFiles);
        }
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.reviews) setReviews(parsed.reviews);
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
        if (res.success && Array.isArray(res.data)) {
          if (res.data.length > 0) {
            const sanitized = res.data.map((p: Project) => ({
              ...p,
              active_draft_url: isValidVideoUrl(p.active_draft_url) ? p.active_draft_url : undefined,
              current_draft_url: isValidVideoUrl(p.current_draft_url) ? p.current_draft_url : undefined,
              final_master_url: isValidVideoUrl(p.final_master_url) ? p.final_master_url : undefined,
            }));
            setProjects(sanitized);
            setActiveProjectId((prev) => {
              if (prev && sanitized.some((p: Project) => p.id === prev)) {
                return prev;
              }
              return sanitized[0].id;
            });
          } else {
            // DB returned empty list of projects: activeProjectId MUST be null
            setProjects([]);
            setActiveProjectId(null);
          }
        }
      })
      .catch((err) => console.warn('Could not sync projects from DB:', err));
  }, [isAuthenticated]);

  // Sync project, files, revisions & messages whenever activeProjectId changes
  useEffect(() => {
    if (!activeProjectId) return;

    fetch(`/api/projects/${activeProjectId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const sanitizedProject = {
            ...res.data,
            active_draft_url: isValidVideoUrl(res.data.active_draft_url) ? res.data.active_draft_url : undefined,
            current_draft_url: isValidVideoUrl(res.data.current_draft_url) ? res.data.current_draft_url : undefined,
            final_master_url: isValidVideoUrl(res.data.final_master_url) ? res.data.final_master_url : undefined,
          };
          setProjects((prev) =>
            prev.map((p) => (p.id === activeProjectId ? { ...p, ...sanitizedProject } : p))
          );
        }
      })
      .catch(() => {});

    fetch(`/api/files?projectId=${activeProjectId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const cleanFiles = res.data.filter((f: ProjectFile) => isValidVideoUrl(f.url));
          setFiles((prev) => {
            const otherFiles = prev.filter((f) => f.project_id !== activeProjectId);
            return [...cleanFiles, ...otherFiles];
          });
        }
      })
      .catch((err) => console.warn('Could not sync files from DB:', err));

    fetch(`/api/revisions?projectId=${activeProjectId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
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
        if (res.success && Array.isArray(res.data)) {
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

  // Active Project: NEVER fall back to mock data or projects[0]
  const activeProject = useMemo(() => {
    if (!activeProjectId) return undefined;
    return projects.find((p) => p.id === activeProjectId);
  }, [projects, activeProjectId]);

  // Active Project Comments
  const activeProjectComments = useMemo(() => {
    if (!activeProjectId) return [];
    return revisionComments
      .filter((c) => c.project_id === activeProjectId)
      .sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);
  }, [revisionComments, activeProjectId]);

  // Active Project Files
  const activeProjectFiles = useMemo(() => {
    if (!activeProjectId) return [];
    return files.filter((f) => f.project_id === activeProjectId);
  }, [files, activeProjectId]);

  // Active Project Messages
  const activeProjectMessages = useMemo(() => {
    if (!activeProjectId) return [];
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

  // Refresh Active Project & Files directly from PostgreSQL Database
  const refreshActiveProject = useCallback(async () => {
    if (!activeProjectId) return;
    try {
      const [projRes, filesRes] = await Promise.all([
        fetch(`/api/projects/${activeProjectId}`),
        fetch(`/api/files?projectId=${activeProjectId}`),
      ]);
      const projData = await projRes.json();
      const filesData = await filesRes.json();

      if (projData.success && projData.data) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === activeProjectId
              ? {
                  ...p,
                  ...projData.data,
                  active_draft_url: isValidVideoUrl(projData.data.active_draft_url)
                    ? projData.data.active_draft_url
                    : undefined,
                  current_draft_url: isValidVideoUrl(projData.data.current_draft_url)
                    ? projData.data.current_draft_url
                    : undefined,
                }
              : p
          )
        );
      }

      if (filesData.success && Array.isArray(filesData.data)) {
        const cleanFiles = filesData.data.filter((f: ProjectFile) => isValidVideoUrl(f.url));
        setFiles((prev) => {
          const otherFiles = prev.filter((f) => f.project_id !== activeProjectId);
          return [...cleanFiles, ...otherFiles];
        });
      }
    } catch (err) {
      console.warn('Failed to refresh active project from DB:', err);
    }
  }, [activeProjectId]);

  // Helper to detect if a file is a video
  const isVideoFile = (fileName: string, fileType?: string): boolean => {
    if (fileType === 'DRAFT_VIDEO' || fileType === 'FINAL_MASTER') return true;
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return ['mp4', 'mov', 'webm', 'mkv', 'm4v', 'avi'].includes(ext);
  };

  // Add Project File (Persists to PostgreSQL Database & Updates activeDraftUrl for ANY video)
  const addProjectFile = (
    fileData: Omit<ProjectFile, 'id' | 'created_at'> & { id?: string; created_at?: string }
  ) => {
    retroSound.playDing();
    const tempId = fileData.id || `file-${Date.now()}`;
    const newFile: ProjectFile = {
      ...fileData,
      id: tempId,
      created_at: fileData.created_at || new Date().toISOString(),
    };

    const isVideo = isVideoFile(fileData.file_name, fileData.file_type);

    // Optimistically update local files
    setFiles((prev) => [
      newFile,
      ...prev.filter((f) => f.id !== tempId && f.url !== fileData.url),
    ]);

    // If this is a video with a valid URL, immediately update activeDraftUrl
    if (isVideo && isValidVideoUrl(fileData.url)) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === fileData.project_id
            ? {
                ...p,
                active_draft_url: fileData.url,
                current_draft_url: fileData.url,
                updated_at: new Date().toISOString(),
              }
            : p
        )
      );
    }

    // If file was already saved by /api/files/upload, avoid duplicate POST
    if (fileData.id && !fileData.id.startsWith('temp-')) {
      refreshActiveProject().catch(() => {});
      return;
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
          const updatedDraftUrl = res.activeDraftUrl || (isVideo ? fileData.url : undefined);
          if (updatedDraftUrl && isValidVideoUrl(updatedDraftUrl)) {
            setProjects((prev) =>
              prev.map((p) =>
                p.id === fileData.project_id
                  ? { ...p, active_draft_url: updatedDraftUrl, current_draft_url: updatedDraftUrl }
                  : p
              )
            );
          }
          // Immediate database sync
          refreshActiveProject().catch(() => {});
        }
      })
      .catch((err) => console.error('Failed to save file to DB:', err));
  };

  // Delete Project File (Persists to PostgreSQL Database & Updates activeDraftUrl if video)
  const deleteProjectFile = async (fileId: string): Promise<boolean> => {
    retroSound.playClick();
    try {
      const res = await fetch(`/api/files?id=${fileId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        if (data.activeDraftUrl !== undefined) {
          const nextDraftUrl = isValidVideoUrl(data.activeDraftUrl) ? data.activeDraftUrl : undefined;
          setProjects((prev) =>
            prev.map((p) =>
              p.id === activeProjectId
                ? {
                    ...p,
                    active_draft_url: nextDraftUrl,
                    current_draft_url: nextDraftUrl,
                  }
                : p
            )
          );
        }
        refreshActiveProject().catch(() => {});
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete file from DB:', err);
      return false;
    }
  };

  // Set Project Active Draft URL (persists in DB)
  const setProjectActiveDraftUrl = (projectId: string, url: string) => {
    retroSound.playDing();
    const cleanUrl = isValidVideoUrl(url) ? url : undefined;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, active_draft_url: cleanUrl, current_draft_url: cleanUrl, updated_at: new Date().toISOString() }
          : p
      )
    );

    fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active_draft_url: cleanUrl || null }),
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
      deleteProjectFile,
      unlockMasterFile,
      refreshActiveProject,
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
      refreshActiveProject,
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
