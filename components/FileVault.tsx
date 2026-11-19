'use client';

import React, { useState, useRef } from 'react';
import {
  FileVideo,
  FileArchive,
  FileText,
  Lock,
  Unlock,
  Download,
  Upload,
  HardDrive,
  Sparkles,
  FileUp,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Loader2,
  Film,
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { ProjectFile } from '@/types';
import { retroSound } from '@/lib/soundEffects';
import { Portal } from '@/components/Portal';

interface FileVaultProps {
  onRequestReleaseMilestone?: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export function FileVault({ onRequestReleaseMilestone }: FileVaultProps) {
  const {
    activeProject,
    activeProjectFiles,
    addProjectFile,
    deleteProjectFile,
    refreshActiveProject,
    activeRole,
    currentUser,
  } = useEditBridge();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<ProjectFile['file_type']>('DRAFT_VIDEO');
  const [newVersion, setNewVersion] = useState('Draft v1');
  const [isDragOver, setIsDragOver] = useState(false);

  // Upload Progress & State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Delete Confirmation State
  const [fileToDelete, setFileToDelete] = useState<ProjectFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!activeProject) {
    return <div className="text-xs text-slate-400 font-mono">No active project.</div>;
  }

  // Auto-detect file category and set details when a file is selected
  const handleProcessSelectedFile = (file: File) => {
    setSelectedFile(file);
    setNewFileName(file.name);
    setUploadError(null);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (['mp4', 'mov', 'webm', 'mkv', 'm4v', 'avi'].includes(ext)) {
      setNewFileType('DRAFT_VIDEO');
      setNewVersion('Draft Cut');
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      setNewFileType('RAW_FOOTAGE');
      setNewVersion('Footage Pack');
    } else if (['pdf', 'docx', 'txt', 'md'].includes(ext)) {
      setNewFileType('REFERENCE');
      setNewVersion('Style Guide');
    } else if (['png', 'jpg', 'jpeg', 'psd', 'ai', 'prproj', 'drp'].includes(ext)) {
      setNewFileType('ASSET');
      setNewVersion('Project Asset');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      retroSound.playDing();
      handleProcessSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      retroSound.playDing();
      handleProcessSelectedFile(file);
    }
  };

  // Perform Real Persistent Cloud Upload (Supabase Storage + PostgreSQL)
  const handlePerformUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      // 1. Attempt signed URL direct upload first (avoids Next.js server body limit for large videos)
      let uploadSuccess = false;
      let finalPublicUrl = '';
      let storagePathKey = '';

      try {
        const urlRes = await fetch('/api/files/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: activeProject.id,
            fileName: selectedFile.name,
            fileType: newFileType,
          }),
        });

        if (urlRes.ok) {
          const urlData = await urlRes.json();
          if (urlData.success && urlData.signedUrl) {
            // Direct PUT to Supabase Storage signed URL
            await new Promise<void>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('PUT', urlData.signedUrl);
              xhr.setRequestHeader('Content-Type', selectedFile.type || 'video/mp4');

              xhr.upload.onprogress = (evt) => {
                if (evt.lengthComputable) {
                  const percent = Math.round((evt.loaded / evt.total) * 90);
                  setUploadProgress(Math.max(15, percent));
                }
              };

              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  uploadSuccess = true;
                  finalPublicUrl = urlData.publicUrl;
                  storagePathKey = urlData.path;
                  resolve();
                } else {
                  reject(new Error(`Storage PUT failed with status ${xhr.status}`));
                }
              };

              xhr.onerror = () => reject(new Error('Network error during upload'));
              xhr.send(selectedFile);
            });
          }
        }
      } catch (directErr) {
        console.warn('Direct signed upload note, falling back to server upload:', directErr);
      }

      // 2. Fallback to server-side multipart upload if direct signed upload did not complete
      if (!uploadSuccess) {
        setUploadProgress(30);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('projectId', activeProject.id);
        formData.append('fileType', newFileType);
        formData.append('version', newVersion);
        formData.append('uploaderId', currentUser?.id || 'user-creator-1');
        formData.append('uploaderName', currentUser?.name || 'Creator');

        const serverRes = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });

        const serverData = await serverRes.json();
        if (!serverRes.ok || !serverData.success) {
          throw new Error(serverData.error || 'Server upload failed');
        }

        setUploadProgress(100);
        addProjectFile(serverData.data);
        await refreshActiveProject();
      } else {
        // Direct upload succeeded, register file record in PostgreSQL
        setUploadProgress(95);
        addProjectFile({
          project_id: activeProject.id,
          uploader_id: currentUser?.id || 'user-creator-1',
          uploader_name: currentUser?.name || 'Creator',
          file_name: newFileName.trim() || selectedFile.name,
          storage_key: storagePathKey || `uploads/${selectedFile.name}`,
          file_type: newFileType,
          size_bytes: selectedFile.size,
          formatted_size: formatBytes(selectedFile.size),
          version: newVersion,
          url: finalPublicUrl,
          is_locked: newFileType === 'FINAL_MASTER' && activeProject.status !== 'COMPLETED',
          lock_reason:
            newFileType === 'FINAL_MASTER' && activeProject.status !== 'COMPLETED'
              ? 'Locked until Milestone 2 (70%) is released by client.'
              : undefined,
        });
        setUploadProgress(100);
        await refreshActiveProject();
      }

      retroSound.playDing();
      setIsUploading(false);
      setSelectedFile(null);
      setNewFileName('');
      setShowUploadModal(false);
    } catch (err: any) {
      console.error('Upload error:', err);
      setIsUploading(false);
      setUploadError(err?.message || 'Failed to complete video upload.');
    }
  };

  // Perform File Deletion
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);

    try {
      const ok = await deleteProjectFile(fileToDelete.id);
      if (ok) {
        retroSound.playDing();
        setFileToDelete(null);
      } else {
        alert('Failed to delete file from database. Please try again.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the file.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileIcon = (type: ProjectFile['file_type']) => {
    switch (type) {
      case 'RAW_FOOTAGE':
      case 'DRAFT_VIDEO':
      case 'FINAL_MASTER':
        return <FileVideo className="w-5 h-5 text-vice-pink" />;
      case 'ASSET':
        return <FileArchive className="w-5 h-5 text-vice-gold" />;
      default:
        return <FileText className="w-5 h-5 text-vice-muted" />;
    }
  };

  const canManageFiles = activeRole === 'CREATOR' || activeRole === 'ADMIN';

  return (
    <div className="flex flex-col gap-3.5">
      {/* Vault header with upload button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-vice-border">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-vice-pink" />
          <span className="font-bold text-xs text-vice-text uppercase tracking-wide">
            Project File Storage &amp; Asset Vault
          </span>
          <span className="text-[10px] bg-vice-cardElevated border border-vice-border px-2 py-0.5 rounded-full text-vice-gold font-mono font-semibold">
            {activeProjectFiles.length} Records
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold hidden sm:inline flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-vice-mint animate-pulse"></span>
            <span>Supabase Cloud Sync</span>
          </span>
        </div>

        {canManageFiles && (
          <button
            onClick={() => {
              retroSound.playClick();
              setShowUploadModal(true);
            }}
            className="bg-vice-gradient hover:opacity-95 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Video / Asset</span>
          </button>
        )}
      </div>

      {/* Files Table / List */}
      <div className="space-y-3">
        {activeProjectFiles.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-vice-border bg-vice-surface/40 space-y-3">
            <Film className="w-8 h-8 text-vice-pink/60 mx-auto" />
            <p className="text-xs font-semibold text-vice-text">
              No files uploaded to this project yet.
            </p>
            <p className="text-[11px] text-vice-muted max-w-sm mx-auto">
              Upload raw footage, project drafts, or master exports. Files are securely persisted to Supabase Storage and PostgreSQL.
            </p>
            {canManageFiles && (
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="bg-vice-gradient hover:opacity-95 text-white px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload First Video</span>
              </button>
            )}
          </div>
        ) : (
          activeProjectFiles.map((file) => {
            const isFinalLocked = file.is_locked;

            return (
              <div
                key={file.id}
                className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-all ${
                  isFinalLocked
                    ? 'border-rose-500/40 bg-rose-500/5 shadow-xs'
                    : 'bg-vice-surface border-vice-border shadow-xs hover:border-vice-borderHover'
                }`}
              >
                {/* File Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="p-3 bg-vice-cardElevated rounded-xl border border-vice-border shrink-0 mt-0.5 shadow-xs">
                    {getFileIcon(file.file_type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-vice-text truncate">
                        {file.file_name}
                      </span>
                      <span className="bg-vice-cardElevated border border-vice-border text-[10px] px-2 py-0.5 rounded-md font-mono text-vice-gold">
                        {file.version}
                      </span>
                      <span className="text-[11px] font-mono text-vice-dim">
                        [{file.formatted_size}]
                      </span>
                    </div>

                    <div className="text-[11px] text-vice-muted mt-1 flex items-center gap-2 flex-wrap">
                      <span>Uploaded by: <strong className="text-vice-text">{file.uploader_name}</strong></span>
                      <span>•</span>
                      <span>Type: {file.file_type}</span>
                    </div>

                    {/* Lock Warning Notice */}
                    {isFinalLocked && (
                      <div className="mt-2.5 p-2.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>
                          <strong>ACCESS PROTECTED:</strong> {file.lock_reason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {isFinalLocked ? (
                    activeRole === 'CREATOR' ? (
                      <button
                        onClick={() => {
                          retroSound.playDing();
                          onRequestReleaseMilestone?.();
                        }}
                        className="bg-gradient-to-r from-vice-pink via-vice-coral to-vice-gold hover:opacity-95 text-white px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-pink-500/25 transition-all cursor-pointer"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Release Milestone 2 to Unlock</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-vice-cardElevated border border-vice-border rounded-xl text-xs text-vice-muted flex items-center gap-1.5 font-medium">
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        Awaiting Client Payment
                      </span>
                    )
                  ) : (
                    <a
                      href={file.url}
                      download={file.file_name}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => retroSound.playClick()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}

                  {/* Creator Delete Video Button */}
                  {canManageFiles && (
                    <button
                      type="button"
                      onClick={() => {
                        retroSound.playClick();
                        setFileToDelete(file);
                      }}
                      className="p-1.5 text-vice-dim hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20 cursor-pointer"
                      title="Delete Video"
                      aria-label="Delete Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <Portal>
          <div
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isDeleting) setFileToDelete(null);
            }}
          >
            <div className="glass-panel max-w-md w-full bg-vice-surface border border-rose-500/40 rounded-2xl shadow-xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-500 dark:text-rose-400">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-vice-text">
                    Delete File &amp; Video Asset?
                  </h3>
                  <p className="text-xs text-vice-muted">This action cannot be undone.</p>
                </div>
              </div>

              <div className="p-3 bg-vice-cardElevated rounded-xl border border-vice-border text-xs space-y-1">
                <p className="font-semibold text-vice-text truncate">
                  {fileToDelete.file_name}
                </p>
                <p className="text-[11px] text-vice-gold font-mono">
                  {fileToDelete.version} • {fileToDelete.formatted_size}
                </p>
                {activeProject.active_draft_url === fileToDelete.url && (
                  <p className="text-vice-gold font-semibold pt-1">
                    ⚠️ This file is currently active on the timeline player. Deleting it will switch to the next available video or empty state.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setFileToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-vice-muted hover:text-vice-text transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Upload Modal (Mounted to Document Body via Portal) */}
      {showUploadModal && (
        <Portal>
          <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isUploading) setShowUploadModal(false);
            }}
          >
            <div className="glass-panel max-w-lg w-full max-h-[92vh] flex flex-col bg-vice-surface border border-vice-border rounded-2xl shadow-xl overflow-hidden my-auto">
              {/* Titlebar */}
              <div className="px-5 py-3.5 bg-vice-cardElevated border-b border-vice-border flex items-center justify-between shrink-0">
                <span className="flex items-center gap-2 font-bold text-vice-text text-xs truncate pr-2">
                  <Upload className="w-4 h-4 text-vice-pink shrink-0" />
                  <span>UPLOAD VIDEO TO CLOUD STORAGE</span>
                </span>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setShowUploadModal(false)}
                  className="w-7 h-7 rounded-lg bg-vice-surface hover:bg-vice-hover border border-vice-border text-vice-muted hover:text-vice-text text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
                  title="Close"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handlePerformUpload} className="p-6 space-y-4 text-xs text-vice-text overflow-y-auto flex-1 min-h-0">
                {uploadError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Drag and Drop Zone */}
                <div>
                  <label className="block font-semibold mb-1.5 text-vice-text">
                    Select Video or Footage File:
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!isUploading) setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (!isUploading) fileInputRef.current?.click();
                    }}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-vice-pink bg-vice-pink/5'
                        : selectedFile
                        ? 'border-emerald-500 bg-emerald-500/5'
                        : 'border-vice-border hover:border-vice-pink bg-vice-input'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      disabled={isUploading}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="video/*,.zip,.mov,.mp4,.webm,.mkv,.pdf,.drp,.prproj"
                    />

                    {selectedFile ? (
                      <div className="space-y-1.5">
                        <CheckCircle2 className="w-8 h-8 text-vice-mint mx-auto" />
                        <p className="font-bold text-vice-text truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] font-mono text-vice-gold">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • {selectedFile.type || 'Video'}
                        </p>
                        <p className="text-[10px] text-vice-muted">Click to replace file</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <FileUp className="w-8 h-8 text-vice-pink mx-auto" />
                        <p className="font-bold text-vice-text">
                          Click to browse or drag &amp; drop video here
                        </p>
                        <p className="text-[11px] text-vice-muted">
                          Supports .mp4, .mov, .webm (uploaded directly to Supabase Storage)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1.5 text-vice-text">
                    File Label / Title:
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isUploading}
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g. AI_Bubble_Final_Export_v1.mp4"
                    className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1.5 text-vice-text">
                      File Category:
                    </label>
                    <select
                      disabled={isUploading}
                      value={newFileType}
                      onChange={(e) =>
                        setNewFileType(e.target.value as ProjectFile['file_type'])
                      }
                      className="w-full px-3 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden disabled:opacity-50"
                    >
                      <option value="DRAFT_VIDEO">Draft Video Cut (Timeline Review)</option>
                      <option value="FINAL_MASTER">Final Master Export (Locked until payment)</option>
                      <option value="RAW_FOOTAGE">Raw Footage Package</option>
                      <option value="REFERENCE">Reference / Style Asset</option>
                      <option value="ASSET">Thumbnail / Sound Design Assets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1.5 text-vice-text">
                      Version Tag:
                    </label>
                    <input
                      type="text"
                      disabled={isUploading}
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      placeholder="e.g. Draft Cut 1"
                      className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="p-3.5 bg-vice-pink/10 border border-vice-pink/20 rounded-xl space-y-2">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="flex items-center gap-1.5 font-bold text-vice-pink">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Uploading to Supabase Storage...
                      </span>
                      <span className="font-bold text-vice-gold">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-vice-cardElevated h-2 rounded-full overflow-hidden border border-vice-border">
                      <div
                        className="bg-vice-gradient h-full rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs font-medium text-vice-muted hover:text-vice-text transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="bg-vice-gradient hover:opacity-95 text-white px-5 py-2 text-xs font-semibold rounded-xl shadow-md shadow-pink-500/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload to Cloud Storage</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
