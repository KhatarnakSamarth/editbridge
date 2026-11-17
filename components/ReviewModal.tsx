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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="win95-window max-w-lg w-full">
        <div className="win95-titlebar">
          <span className="flex items-center gap-1 font-bold">
            <Award className="w-4 h-4 text-yellow-300" />
            SUBMIT VERIFIED PROJECT REVIEW &amp; RATING
          </span>
          <button
            onClick={onClose}
            className="w-5 h-5 bg-[#c0c0c0] text-black border border-black text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-4 bg-[#c0c0c0] text-xs font-sans space-y-3">
          {submitted ? (
            <div className="p-4 bg-green-50 border-2 border-green-600 text-green-900 font-mono text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-700 mx-auto" />
              <p className="font-bold text-sm">Review Recorded on EditBridge Chain!</p>
              <p className="text-xs">
                Your feedback has been added to {activeProject.editor_name}&apos;s verified track record.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="win95-button win95-button-primary px-4 py-1 text-xs font-bold"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <span className="font-bold font-mono text-neutral-800 block mb-1">
                  Overall Rating for {activeProject.editor_name}:
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => {
                        retroSound.playClick();
                        setRating(star);
                      }}
                      className="p-1 text-amber-500 hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-600'
                            : 'text-neutral-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono font-bold text-sm text-neutral-800 ml-2">
                    {rating}.0 / 5.0
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold font-mono text-neutral-800 block mb-1">
                  Select Highlight Badges:
                </span>
                <div className="flex flex-wrap gap-1">
                  {TAG_OPTIONS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`win95-button px-2 py-0.5 text-[10px] font-mono ${
                          isSelected
                            ? 'bg-[#000080] text-white border-blue-400 font-bold'
                            : 'text-neutral-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 font-mono mb-1">
                  Written Feedback:
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about pacing, communication, and adherence to brief..."
                  className="win95-sunken w-full px-2 py-1.5 text-xs text-neutral-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="win95-button px-3 py-1 font-bold font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="win95-button win95-button-primary px-4 py-1 font-bold font-mono"
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
