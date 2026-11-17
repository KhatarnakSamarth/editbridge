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
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
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
    return <div className="text-xs text-neutral-600 font-mono">No active project.</div>;
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
        return <FileVideo className="w-4 h-4 text-blue-700" />;
      case 'ASSET':
        return <FileArchive className="w-4 h-4 text-amber-700" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-700" />;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Vault header with upload button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-400">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#000080]" />
          <span className="font-bold text-xs font-mono text-neutral-900 uppercase">
            Project File Storage &amp; Asset Vault
          </span>
          <span className="text-[10px] bg-neutral-200 border border-neutral-400 px-1.5 py-0.2 font-mono">
            {activeProjectFiles.length} Records
          </span>
        </div>

        <button
          onClick={() => {
            retroSound.playClick();
            setShowUploadModal(true);
          }}
          className="win95-button win95-button-primary px-2.5 py-1 text-xs font-bold font-mono flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File / Master</span>
        </button>
      </div>

      {/* Files Table / List */}
      <div className="space-y-2">
        {activeProjectFiles.map((file) => {
          const isFinalLocked = file.is_locked;

          return (
            <div
              key={file.id}
              className={`win95-window p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isFinalLocked
                  ? 'border-2 border-red-800 bg-red-50/70'
                  : 'bg-[#c0c0c0]'
              }`}
            >
              {/* File Info */}
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <div className="p-2 bg-neutral-100 border border-neutral-400 flex-shrink-0 mt-0.5">
                  {getFileIcon(file.file_type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs font-mono text-neutral-900 truncate">
                      {file.file_name}
                    </span>
                    <span className="bg-neutral-200 border border-neutral-400 text-[10px] px-1 font-mono text-neutral-700">
                      {file.version}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-600">
                      [{file.formatted_size}]
                    </span>
                  </div>

                  <div className="text-[10px] text-neutral-600 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>Uploaded by: {file.uploader_name}</span>
                    <span>•</span>
                    <span>Type: {file.file_type}</span>
                    {file.checksum && (
                      <span className="text-neutral-500 hidden sm:inline">
                        • Hash: {file.checksum}
                      </span>
                    )}
                  </div>

                  {/* Lock Warning Notice */}
                  {isFinalLocked && (
                    <div className="mt-1.5 p-1.5 bg-red-100 border border-red-400 text-red-900 text-[11px] font-mono flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-red-700 flex-shrink-0" />
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
                      className="win95-button win95-button-amber px-3 py-1.5 text-xs font-bold font-mono flex items-center gap-1.5 animate-pulse"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Release Milestone 2 to Unlock</span>
                    </button>
                  ) : (
                    <span className="px-2 py-1 bg-neutral-200 border border-neutral-400 text-[11px] font-mono text-neutral-600 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-red-600" />
                      Awaiting Client Payment
                    </span>
                  )
                ) : (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => retroSound.playClick()}
                    className="win95-button win95-button-success px-3 py-1 text-xs font-bold font-mono flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="win95-window max-w-md w-full">
            <div className="win95-titlebar">
              <span className="flex items-center gap-1 font-bold">
                <Upload className="w-4 h-4" />
                UPLOAD PROJECT ASSET / VIDEO FILE
              </span>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-5 h-5 bg-[#c0c0c0] text-black border border-black text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSimulateUpload} className="p-4 bg-[#c0c0c0] space-y-3 font-sans text-xs">
              <div>
                <label className="block font-bold text-neutral-800 font-mono mb-1">
                  File Name:
                </label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. AI_Bubble_Final_Export_v2.mov"
                  className="win95-sunken w-full px-2 py-1 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 font-mono mb-1">
                  File Category:
                </label>
                <select
                  value={newFileType}
                  onChange={(e) =>
                    setNewFileType(e.target.value as ProjectFile['file_type'])
                  }
                  className="win95-sunken w-full px-2 py-1 text-xs bg-white"
                >
                  <option value="DRAFT_VIDEO">Draft Video Version</option>
                  <option value="FINAL_MASTER">Final Master Export (Locked until payment)</option>
                  <option value="RAW_FOOTAGE">Raw Footage Package</option>
                  <option value="REFERENCE">Reference / Style Asset</option>
                  <option value="ASSET">Thumbnail / Sound Design Assets</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 font-mono mb-1">
                  Version Label:
                </label>
                <input
                  type="text"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="win95-sunken w-full px-2 py-1 text-xs"
                />
              </div>

              <div className="p-2 bg-blue-50 border border-blue-400 font-mono text-[11px] text-blue-900">
                🔒 In production, large files are streamed to private S3/GCS buckets via signed URLs.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="win95-button px-3 py-1 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="win95-button win95-button-primary px-4 py-1 font-bold"
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
