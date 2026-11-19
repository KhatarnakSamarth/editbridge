'use client';

import React, { useState, useEffect } from 'react';
import { Award, Star, CheckCircle2 } from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';
import { Portal } from '@/components/Portal';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TAG_OPTIONS = [
  'Fast Turnaround (<24h)',
  'Insane Pacing & Retention',
  'DaVinci Color Grading Master',
  'Sound Design & Foley Pro',
  'Followed Brief Perfectly',
  'Zero Revision Round Needed',
  'Kinetic Typography',
];

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const { activeProject, currentUser, submitReview } = useEditBridge();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Insane Pacing & Retention',
    'Followed Brief Perfectly',
  ]);
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <Portal>
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="glass-panel max-w-lg w-full max-h-[92vh] flex flex-col bg-vice-surface border border-vice-border rounded-2xl overflow-hidden shadow-xl transition-colors my-auto">
          {/* Titlebar */}
          <div className="px-5 py-3.5 bg-vice-cardElevated border-b border-vice-border flex items-center justify-between shrink-0">
            <span className="flex items-center gap-2 font-bold text-xs text-vice-text truncate pr-2">
              <Award className="w-4 h-4 text-vice-gold shrink-0" />
              <span>SUBMIT VERIFIED PROJECT REVIEW</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-vice-surface hover:bg-vice-hover text-vice-muted hover:text-vice-text border border-vice-border text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-sm space-y-4 overflow-y-auto flex-1 min-h-0">
            {submitted ? (
              <div className="p-5 bg-vice-mint/10 border border-vice-mint/30 rounded-xl text-vice-text text-center space-y-3">
                <CheckCircle2 className="w-9 h-9 text-vice-mint mx-auto" />
                <p className="font-bold text-sm text-vice-mint">Review Recorded on EditBridge Chain!</p>
                <p className="text-xs text-vice-muted">
                  Your feedback has been verified and added to {activeProject.editor_name}&apos;s verified track record.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="bg-vice-gradient hover:opacity-95 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="font-semibold text-vice-text text-xs block mb-2">
                    Overall Rating for {activeProject.editor_name}:
                  </span>
                  <div className="flex items-center gap-2 bg-vice-cardElevated p-3.5 rounded-xl border border-vice-border">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => {
                            retroSound.playClick();
                            setRating(star);
                          }}
                          className="p-1 text-vice-gold hover:scale-115 transition-transform cursor-pointer"
                          title={`${star} stars`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'fill-vice-gold text-vice-gold'
                                : 'text-vice-dim'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="font-mono font-bold text-sm text-vice-gold ml-2">
                      {rating}.0 / 5.0
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-vice-text text-xs block mb-2">
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
                          className={`px-3 py-1 rounded-xl text-xs transition-colors border cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'bg-vice-gradient border-vice-pink text-white font-medium shadow-xs'
                              : 'bg-vice-cardElevated hover:bg-vice-hover border-vice-border text-vice-muted hover:text-vice-text'
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
                  <label className="block font-semibold text-vice-text text-xs mb-1.5">
                    Written Feedback:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share details about pacing, communication, and adherence to brief..."
                    className="w-full px-3.5 py-2 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden placeholder:text-vice-dim"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-vice-muted hover:text-vice-text transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-vice-gradient hover:opacity-95 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
