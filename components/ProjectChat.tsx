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
    'Can we hop on a quick review room?',
  ];

  return (
    <div className="flex flex-col h-[480px]">
      {/* Messages Scroll Area */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-950/80 rounded-lg border border-slate-800">
        {activeProjectMessages.map((msg) => {
          const isMe = msg.sender_id === currentUser.id;
          const isSystem = msg.message.startsWith('[SYSTEM');

          if (isSystem) {
            return (
              <div
                key={msg.id}
                className="p-3 bg-amber-950/40 border border-amber-700/60 font-mono text-xs text-amber-200 rounded-lg shadow-xs leading-relaxed"
              >
                {msg.message}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">{msg.sender_name}</span>
                <span className="bg-slate-800 border border-slate-700 px-1.5 py-0.2 rounded text-[10px]">
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
                className={`max-w-[85%] p-3 text-xs leading-relaxed rounded-lg ${
                  isMe
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-100 border border-slate-700 shadow-xs'
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
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-400">
        <span className="text-slate-400 flex-shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
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
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex-shrink-0 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="pt-1 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${
            currentUser.role === 'CREATOR'
              ? activeProject.editor_name || 'Editor'
              : activeProject.creator_name
          }...`}
          className="win95-sunken flex-1 px-3 py-2 text-xs font-sans text-slate-100 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="win95-button win95-button-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
