'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useEditBridge } from '@/lib/store';
import { retroSound } from '@/lib/soundEffects';

export function ProjectChat() {
  const { activeProject, activeProjectMessages, sendMessage, currentUser } = useEditBridge();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeProjectMessages]);

  if (!activeProject) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeProject.id, inputText.trim());
    setInputText('');
  };

  const quickReplies = [
    'Just updated the draft based on notes!',
    'Reviewed timestamps, releasing Milestone 2 now.',
    'Raw footage uploaded to file vault.',
    'Can we hop on a live review room?',
  ];

  return (
    <div className="flex flex-col h-[520px] max-h-[75vh] min-h-[380px] w-full min-w-0">
      {/* Messages Scroll Area */}
      <div className="p-3.5 sm:p-4 flex-1 min-h-0 overflow-y-auto space-y-3.5 bg-vice-surface rounded-2xl border border-vice-border transition-colors scrollbar-thin">
        {activeProjectMessages.map((msg) => {
          const isMe = msg.sender_id === currentUser.id;
          const isSystem = msg.message.startsWith('[SYSTEM');

          if (isSystem) {
            return (
              <div
                key={msg.id}
                className="p-3 bg-vice-gold/10 border border-vice-gold/30 font-mono text-xs text-vice-gold rounded-xl shadow-xs leading-relaxed break-words whitespace-pre-wrap overflow-hidden"
              >
                {msg.message}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-vice-dim">
                <span className="font-semibold text-vice-text">{msg.sender_name}</span>
                <span className="bg-vice-cardElevated border border-vice-border px-1.5 py-0.2 rounded-md text-[10px] font-mono text-vice-muted">
                  {msg.sender_role}
                </span>
                <span>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 text-xs leading-relaxed rounded-2xl break-words whitespace-pre-wrap shadow-xs ${
                  isMe
                    ? 'bg-vice-gradient text-white shadow-xs'
                    : 'bg-vice-cardElevated text-vice-text border border-vice-border'
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies bar */}
      <div className="py-2.5 flex items-center gap-2 overflow-x-auto text-[11px] text-vice-muted shrink-0 scrollbar-none">
        <span className="flex-shrink-0 flex items-center gap-1 font-semibold text-vice-pink">
          <Sparkles className="w-3.5 h-3.5 text-vice-gold" />
          Quick:
        </span>
        {quickReplies.map((reply, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              retroSound.playClick();
              setInputText(reply);
            }}
            className="px-3 py-1 rounded-full bg-vice-cardElevated hover:bg-vice-hover text-vice-muted hover:text-vice-text border border-vice-border flex-shrink-0 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="pt-1 flex gap-2.5 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${
            currentUser.role === 'CREATOR'
              ? activeProject.editor_name || 'Editor'
              : activeProject.creator_name
          }...`}
          className="flex-1 px-4 py-2.5 text-xs text-vice-text bg-vice-input border border-vice-border rounded-xl focus:border-vice-pink focus:outline-hidden placeholder:text-vice-dim transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-vice-gradient hover:opacity-95 text-white px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-md shadow-pink-500/20 disabled:opacity-40 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
