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
        return <FileVideo className="w-5 h-5 text-blue-400" />;
      case 'ASSET':
        return <FileArchive className="w-5 h-5 text-amber-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Vault header with upload button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-xs text-slate-200 uppercase tracking-wide">
            Project File Storage &amp; Asset Vault
          </span>
          <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300 font-mono">
            {activeProjectFiles.length} Records
          </span>
        </div>

        <button
          onClick={() => {
            retroSound.playClick();
            setShowUploadModal(true);
          }}
          className="win95-button win95-button-primary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File / Master</span>
        </button>
      </div>

      {/* Files Table / List */}
      <div className="space-y-2.5">
        {activeProjectFiles.map((file) => {
          const isFinalLocked = file.is_locked;

          return (
            <div
              key={file.id}
              className={`p-3.5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                isFinalLocked
                  ? 'border-red-900/80 bg-red-950/20'
                  : 'bg-slate-900 border-slate-700/80'
              }`}
            >
              {/* File Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 flex-shrink-0 mt-0.5">
                  {getFileIcon(file.file_type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-slate-100 truncate">
                      {file.file_name}
                    </span>
                    <span className="bg-slate-800 border border-slate-700 text-[10px] px-1.5 py-0.2 rounded font-mono text-slate-300">
                      {file.version}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      [{file.formatted_size}]
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                    <span>Uploaded by: <strong className="text-slate-300">{file.uploader_name}</strong></span>
                    <span>•</span>
                    <span>Type: {file.file_type}</span>
                    {file.checksum && (
                      <span className="text-slate-500 font-mono hidden sm:inline">
                        • Hash: {file.checksum}
                      </span>
                    )}
                  </div>

                  {/* Lock Warning Notice */}
                  {isFinalLocked && (
                    <div className="mt-2 p-2 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
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
                      className="win95-button win95-button-amber px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 animate-pulse"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Release Milestone 2 to Unlock</span>
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-red-400" />
                      Awaiting Client Payment
                    </span>
                  )
                ) : (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => retroSound.playClick()}
                    className="win95-button win95-button-success px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="win95-window max-w-md w-full border border-slate-700 shadow-2xl">
            <div className="win95-titlebar">
              <span className="flex items-center gap-2 font-semibold text-slate-100">
                <Upload className="w-4 h-4 text-blue-400" />
                UPLOAD PROJECT ASSET / VIDEO FILE
              </span>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSimulateUpload} className="p-5 space-y-3.5 text-xs text-slate-200">
              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  File Name:
                </label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. AI_Bubble_Final_Export_v2.mov"
                  className="win95-sunken w-full"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  File Category:
                </label>
                <select
                  value={newFileType}
                  onChange={(e) =>
                    setNewFileType(e.target.value as ProjectFile['file_type'])
                  }
                  className="win95-sunken w-full"
                >
                  <option value="DRAFT_VIDEO">Draft Video Version</option>
                  <option value="FINAL_MASTER">Final Master Export (Locked until payment)</option>
                  <option value="RAW_FOOTAGE">Raw Footage Package</option>
                  <option value="REFERENCE">Reference / Style Asset</option>
                  <option value="ASSET">Thumbnail / Sound Design Assets</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  Version Label:
                </label>
                <input
                  type="text"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="win95-sunken w-full"
                />
              </div>

              <div className="p-3 bg-blue-950/60 border border-blue-800 text-blue-200 rounded-lg text-xs leading-relaxed">
                🔒 In production, large files are streamed to private S3/GCS buckets via signed URLs.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="win95-button px-3.5 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="win95-button win95-button-primary px-4 py-1.5 font-semibold"
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
