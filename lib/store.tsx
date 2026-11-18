'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
  // Roles & Current User
  currentUser: User;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;

  // Projects
  projects: Project[];
  activeProjectId: string;
  activeProject: Project | undefined;
  setActiveProjectId: (id: string) => void;
  updateProjectStatus: (projectId: string, newStatus: ProjectStatus) => void;
  createProject: (newProject: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'revisions_used'>) => string;

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

  // Messages / Retro Chat
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
  crtMode: boolean;
  toggleCrtMode: () => void;
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

const STORAGE_KEY = 'editbridge_state_v2';

export function EditBridgeProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('CREATOR');
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-demo-1');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [revisionComments, setRevisionComments] = useState<RevisionComment[]>(INITIAL_REVISION_COMMENTS);
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  const [messages, setMessages] = useState<ProjectMessage[]>(INITIAL_MESSAGES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [crtMode, setCrtMode] = useState<boolean>(false);
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
          themeMode,
          soundEnabled,
        })
      );
    } catch {
      // ignore
    }
  }, [projects, revisionComments, files, messages, reviews, activeRole, themeMode, soundEnabled]);

  // Apply dark / light class to root document & body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
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

  const toggleCrtMode = () => {
    // Legacy stub preserved for API compatibility
    setCrtMode(false);
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Derive Current User based on role
  const currentUser: User = useMemo(() => {
    if (activeRole === 'CREATOR') {
      return INITIAL_USERS[0]; // Marcus Sterling
    }
    if (activeRole === 'EDITOR') {
      return INITIAL_USERS[1]; // Alex Rivera
    }
    return INITIAL_USERS[5]; // System Admin
  }, [activeRole]);

  const switchRole = (role: UserRole) => {
    retroSound.playClick();
    setActiveRole(role);
  };

  // Active Project
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  const activeProjectComments = useMemo(() => {
    return revisionComments.filter((c) => c.project_id === activeProjectId);
  }, [revisionComments, activeProjectId]);

  const activeProjectFiles = useMemo(() => {
    return files.filter((f) => f.project_id === activeProjectId);
  }, [files, activeProjectId]);

  const activeProjectMessages = useMemo(() => {
    return messages.filter((m) => m.project_id === activeProjectId);
  }, [messages, activeProjectId]);

  // Project Status Transitions
  const updateProjectStatus = (projectId: string, newStatus: ProjectStatus) => {
    retroSound.playDing();
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            status: newStatus,
            updated_at: new Date().toISOString(),
          };
        }
        return proj;
      })
    );
  };

  // Create Project Brief
  const createProject = (
    newProject: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'revisions_used'>
  ): string => {
    retroSound.playDing();
    const id = `proj-${Date.now()}`;
    const fullProject: Project = {
      ...newProject,
      id,
      revisions_used: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects((prev) => [fullProject, ...prev]);
    setActiveProjectId(id);
    return id;
  };

  // Add Timestamp Comment
  const addRevisionComment = (data: {
    projectId: string;
    videoVersion: string;
    timestampSeconds: number;
    comment: string;
    category: CommentCategory;
  }) => {
    retroSound.playClick();
    const mins = Math.floor(data.timestampSeconds / 60);
    const secs = Math.floor(data.timestampSeconds % 60);
    const formatted_time = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const newComment: RevisionComment = {
      id: `rev-${Date.now()}`,
      project_id: data.projectId,
      video_version: data.videoVersion,
      timestamp_seconds: data.timestampSeconds,
      formatted_time,
      comment: data.comment,
      category: data.category,
      status: 'PENDING',
      created_by_name: currentUser.name,
      created_by_role: currentUser.role,
      created_at: new Date().toISOString(),
    };

    setRevisionComments((prev) => [newComment, ...prev]);

    // Automatically advance project status to CHANGES_REQUESTED if currently in REVIEW_REQUESTED
    const targetProj = projects.find((p) => p.id === data.projectId);
    if (targetProj && targetProj.status === 'REVIEW_REQUESTED') {
      updateProjectStatus(data.projectId, 'CHANGES_REQUESTED');
    }
  };

  // Update Comment Status (Pending -> In Progress -> Resolved)
  const updateCommentStatus = (commentId: string, status: RevisionCommentStatus) => {
    retroSound.playClick();
    setRevisionComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            status,
            resolved_at: status === 'RESOLVED' ? new Date().toISOString() : undefined,
          };
        }
        return c;
      })
    );
  };

  // File Upload
  const addProjectFile = (file: Omit<ProjectFile, 'id' | 'created_at'>) => {
    retroSound.playDing();
    const newFile: ProjectFile = {
      ...file,
      id: `file-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setFiles((prev) => [newFile, ...prev]);
  };

  // Unlock Master File
  const unlockMasterFile = (projectId: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.project_id === projectId && f.file_type === 'FINAL_MASTER') {
          return {
            ...f,
            is_locked: false,
            lock_reason: undefined,
          };
        }
        return f;
      })
    );
  };

  // Chat / Messages
  const sendMessage = (projectId: string, text: string) => {
    if (!text.trim()) return;
    retroSound.playClick();
    const newMsg: ProjectMessage = {
      id: `msg-${Date.now()}`,
      project_id: projectId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_role: currentUser.role,
      sender_avatar: currentUser.avatar,
      message: text.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Milestone 1 (30% Upfront Funding)
  const fundUpfrontMilestone = (projectId: string) => {
    retroSound.playKaChing();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedMilestones = p.milestones.map((m, idx) => {
            if (idx === 0) {
              return { ...m, status: 'ESCROW_FUNDED' as const, released_at: new Date().toISOString() };
            }
            return m;
          });
          return {
            ...p,
            status: 'EDITOR_ASSIGNED',
            milestones: updatedMilestones,
            updated_at: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  // Milestone 2 (70% Final Delivery Payout) - THE CROWN JEWEL HACKATHON EVENT!
  const releaseFinalMilestone = (projectId: string) => {
    retroSound.playKaChing();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00ff66', '#00f0ff', '#ff9900', '#ffffff'],
      });
    } catch {}

    // Unlock files
    unlockMasterFile(projectId);

    // Update milestone and project state
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedMilestones = p.milestones.map((m) => {
            return {
              ...m,
              status: 'RELEASED' as const,
              released_at: m.released_at || new Date().toISOString(),
            };
          });
          return {
            ...p,
            status: 'COMPLETED',
            milestones: updatedMilestones,
            updated_at: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Add automated receipt message
    sendMessage(
      projectId,
      `[SYSTEM NOTIFICATION]: Milestone 2 (70% Final Payment) confirmed by Client. Master uncompressed deliverables unlocked for immediate download. Project marked as COMPLETED!`
    );
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

  return (
    <EditBridgeContext.Provider
      value={{
        currentUser,
        activeRole,
        switchRole,
        projects,
        activeProjectId,
        activeProject,
        setActiveProjectId,
        updateProjectStatus,
        createProject,
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
        crtMode,
        toggleCrtMode,
        soundEnabled,
        toggleSound,
        themeMode,
        toggleThemeMode,
        resetDemoData,
        notifications,
        markNotificationRead,
      }}
    >
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
