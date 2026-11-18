'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { ProjectFile } from '@/types';
import { retroSound } from '@/lib/soundEffects';

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

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<ProjectFile['file_type']>('DRAFT_VIDEO');
  const [newVersion, setNewVersion] = useState('Draft v2');

  if (!activeProject) {
    return <div className="text-xs text-slate-400 font-mono">No active project.</div>;
  }

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    addProjectFile({
      project_id: activeProject.id,
      uploader_id: currentUser.id,
      uploader_name: currentUser.name,
      file_name: newFileName.trim(),
      storage_key: `uploads/${newFileName.trim().toLowerCase().replace(/\s+/g, '-')}`,
      file_type: newFileType,
      size_bytes: 840000000,
      formatted_size: '840 MB',
      version: newVersion,
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      is_locked: newFileType === 'FINAL_MASTER' && activeProject.status !== 'COMPLETED',
      lock_reason:
        newFileType === 'FINAL_MASTER' && activeProject.status !== 'COMPLETED'
          ? 'Locked until Milestone 2 is released by client.'
          : undefined,
    });

    setNewFileName('');
    setShowUploadModal(false);
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
        </div>

        <button
          onClick={() => {
            retroSound.playClick();
            setShowUploadModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
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
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0 mt-0.5 shadow-xs">
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
                      <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                      <span>
                        <strong>ACCESS PROTECTED:</strong> {file.lock_reason}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                {isFinalLocked ? (
                  activeRole === 'CREATOR' ? (
                    <button
                      onClick={() => {
                        retroSound.playDing();
                        onRequestReleaseMilestone?.();
                      }}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 animate-pulse transition-all"
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#070b14] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
                <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                UPLOAD PROJECT ASSET / VIDEO FILE
              </span>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSimulateUpload} className="p-6 space-y-4 text-xs text-slate-800 dark:text-slate-200">
              <div>
                <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  File Name:
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

              <div>
                <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  File Category:
                </label>
                <select
                  value={newFileType}
                  onChange={(e) =>
                    setNewFileType(e.target.value as ProjectFile['file_type'])
                  }
                  className="w-full px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden"
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
                  Version Label:
                </label>
                <input
                  type="text"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200 rounded-xl text-xs leading-relaxed">
                🔒 In production, large files are streamed to private S3/GCS buckets via signed URLs.
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
