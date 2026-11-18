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
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { ProjectFile } from '@/types';
import { retroSound } from '@/lib/soundEffects';
import { Portal } from '@/components/Portal';

interface FileVaultProps {
  onRequestReleaseMilestone?: () => void;
}

export function FileVault({ onRequestReleaseMilestone }: FileVaultProps) {
  const {
    activeProject,
    activeProjectFiles,
    addProjectFile,
    activeRole,
    currentUser,
  } = useEditBridge();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<ProjectFile['file_type']>('DRAFT_VIDEO');
  const [newVersion, setNewVersion] = useState('Draft v2');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!activeProject) {
    return <div className="text-xs text-slate-400 font-mono">No active project.</div>;
  }

  // Auto-detect file category and set details when a file is selected
  const handleProcessSelectedFile = (file: File) => {
    setSelectedFile(file);
    setNewFileName(file.name);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (['mp4', 'mov', 'webm', 'mkv', 'm4v', 'avi'].includes(ext)) {
      setNewFileType('DRAFT_VIDEO');
      setNewVersion('Draft v2 (Local)');
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

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let fileUrl = '/videos/sample-draft-v1.mp4';
    let formattedSize = '840 MB';
    let sizeBytes = 840000000;

    if (selectedFile) {
      fileUrl = URL.createObjectURL(selectedFile);
      sizeBytes = selectedFile.size;
      const mb = selectedFile.size / (1024 * 1024);
      if (mb < 1) {
        formattedSize = `${(selectedFile.size / 1024).toFixed(0)} KB`;
      } else if (mb > 1024) {
        formattedSize = `${(mb / 1024).toFixed(2)} GB`;
      } else {
        formattedSize = `${mb.toFixed(1)} MB`;
      }
    } else {
      if (newFileType === 'FINAL_MASTER') {
        fileUrl = '/videos/sample-final-master.mp4';
      }
    }

    addProjectFile({
      project_id: activeProject.id,
      uploader_id: currentUser?.id || 'user-1',
      uploader_name: currentUser?.name || 'Authorized Member',
      file_name: newFileName.trim(),
      storage_key: `uploads/${newFileName.trim().toLowerCase().replace(/\s+/g, '-')}`,
      file_type: newFileType,
      size_bytes: sizeBytes,
      formatted_size: formattedSize,
      version: newVersion,
      url: fileUrl,
      is_locked: newFileType === 'FINAL_MASTER' && activeProject.status !== 'COMPLETED',
      lock_reason:
        newFileType === 'FINAL_MASTER' && activeProject.status !== 'COMPLETED'
          ? 'Locked until Milestone 2 (70%) is released by client.'
          : undefined,
    });

    setSelectedFile(null);
    setNewFileName('');
    setShowUploadModal(false);
    retroSound.playDing();
  };

  const getFileIcon = (type: ProjectFile['file_type']) => {
    switch (type) {
      case 'RAW_FOOTAGE':
      case 'DRAFT_VIDEO':
      case 'FINAL_MASTER':
        return <FileVideo className="w-5 h-5 text-blue-500 dark:text-cyan-400" />;
      case 'ASSET':
        return <FileArchive className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Vault header with upload button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            Project File Storage &amp; Asset Vault
          </span>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-300 font-mono font-semibold">
            {activeProjectFiles.length} Records
          </span>
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold hidden sm:inline flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PostgreSQL Sync</span>
          </span>
        </div>

        <button
          onClick={() => {
            retroSound.playClick();
            setShowUploadModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File / Master</span>
        </button>
      </div>

      {/* Files Table / List */}
      <div className="space-y-3">
        {activeProjectFiles.map((file) => {
          const isFinalLocked = file.is_locked;

          return (
            <div
              key={file.id}
              className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-all ${
                isFinalLocked
                  ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs'
                  : 'bg-white dark:bg-[#0e1526] border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/40'
              }`}
            >
              {/* File Info */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5 shadow-xs">
                  {getFileIcon(file.file_type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {file.file_name}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] px-2 py-0.5 rounded-md font-mono text-slate-700 dark:text-slate-300">
                      {file.version}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      [{file.formatted_size}]
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                    <span>Uploaded by: <strong className="text-slate-700 dark:text-slate-300">{file.uploader_name}</strong></span>
                    <span>•</span>
                    <span>Type: {file.file_type}</span>
                    {file.checksum && (
                      <span className="text-slate-400 font-mono hidden sm:inline">
                        • Hash: {file.checksum}
                      </span>
                    )}
                  </div>

                  {/* Lock Warning Notice */}
                  {isFinalLocked && (
                    <div className="mt-2.5 p-2.5 bg-rose-100/70 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
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
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 animate-pulse transition-all cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Release Milestone 2 to Unlock</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <Lock className="w-3.5 h-3.5 text-rose-500" />
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
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal (Mounted to Document Body via Portal) */}
      {showUploadModal && (
        <Portal>
          <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowUploadModal(false);
            }}
          >
            <div className="glass-panel max-w-lg w-full max-h-[92vh] flex flex-col bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
              {/* Titlebar */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#070b14] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs truncate pr-2">
                  <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>UPLOAD LOCAL FILE OR PROJECT MASTER</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  title="Close"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSimulateUpload} className="p-6 space-y-4 text-xs text-slate-800 dark:text-slate-200 overflow-y-auto flex-1 min-h-0">
                {/* Drag and Drop Zone */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                    Select Local Video, Audio, or Archive File:
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30'
                        : selectedFile
                        ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-slate-50/60 dark:bg-slate-900/40'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="video/*,.zip,.mov,.mp4,.webm,.mkv,.pdf,.drp,.prproj"
                    />

                    {selectedFile ? (
                      <div className="space-y-1.5">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                        <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB ready to add • Click to replace
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <FileUp className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mx-auto" />
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          Click to browse or drag &amp; drop your file here
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Accepts .mp4, .mov, .webm, .zip raw footage, or project archives
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                    File Label / Title:
                  </label>
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g. AI_Bubble_Final_Export_v2.mov"
                    className="w-full px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                      File Category:
                    </label>
                    <select
                      value={newFileType}
                      onChange={(e) =>
                        setNewFileType(e.target.value as ProjectFile['file_type'])
                      }
                      className="w-full px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    >
                      <option value="DRAFT_VIDEO">Draft Video Version</option>
                      <option value="FINAL_MASTER">Final Master Export (Locked until payment)</option>
                      <option value="RAW_FOOTAGE">Raw Footage Package</option>
                      <option value="REFERENCE">Reference / Style Asset</option>
                      <option value="ASSET">Thumbnail / Sound Design Assets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                      Version Tag:
                    </label>
                    <input
                      type="text"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      placeholder="e.g. Draft v2"
                      className="w-full px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200 rounded-xl text-xs leading-relaxed">
                  🔒 Uploaded files are immediately accessible in the local workspace, and master deliveries are automatically gated under the 30/70 escrow contract until final signoff.
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Confirm &amp; Add File
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
