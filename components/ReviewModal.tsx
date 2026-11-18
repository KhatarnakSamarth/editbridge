'use client';

import React, { useState } from 'react';
import { Star, Award, CheckCircle2 } from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TAG_OPTIONS = [
  'Superb Pacing',
  'Fast Turnaround',
  'Pro Sound Design',
  'Clear Communication',
  'Kinetic Graphics',
  'Followed Style Guide',
  'Great Color Grade',
];

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const { activeProject, submitReview, currentUser } = useEditBridge();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Superb Pacing',
    'Pro Sound Design',
  ]);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !activeProject) return null;

  const toggleTag = (tag: string) => {
    retroSound.playClick();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitReview({
      project_id: activeProject.id,
      project_title: activeProject.title,
      reviewer_id: currentUser.id,
      reviewer_name: currentUser.name,
      reviewer_role: currentUser.role,
      reviewee_id:
        currentUser.role === 'CREATOR'
          ? activeProject.editor_id || 'editor-1'
          : activeProject.creator_id,
      rating,
      comment: comment.trim(),
      tags: selectedTags,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full bg-white dark:bg-[#0e1526] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#070b14] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100">
            <Award className="w-4 h-4 text-amber-500" />
            SUBMIT VERIFIED PROJECT REVIEW &amp; RATING
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-center"
            title="Close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 text-sm space-y-4">
          {submitted ? (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-900 dark:text-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-emerald-600 dark:text-emerald-300">Review Recorded on EditBridge Chain!</p>
              <p className="text-xs text-emerald-800 dark:text-emerald-100">
                Your feedback has been verified and added to {activeProject.editor_name}&apos;s verified track record.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs block mb-2">
                  Overall Rating for {activeProject.editor_name}:
                </span>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#070b14] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => {
                          retroSound.playClick();
                          setRating(star);
                        }}
                        className="p-1 text-amber-400 hover:scale-115 transition-transform"
                        title={`${star} stars`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="font-mono font-bold text-sm text-amber-500 ml-2">
                    {rating}.0 / 5.0
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs block mb-2">
                  Select Highlight Badges:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-xl text-xs transition-colors border ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white font-medium shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1.5">
                  Written Feedback:
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about pacing, communication, and adherence to brief..."
                  className="w-full px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
