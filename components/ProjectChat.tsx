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
    <div className="flex flex-col h-[500px]">
      {/* Messages Scroll Area */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3.5 bg-slate-50 dark:bg-[#070b14] rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        {activeProjectMessages.map((msg) => {
          const isMe = msg.sender_id === currentUser.id;
          const isSystem = msg.message.startsWith('[SYSTEM');

          if (isSystem) {
            return (
              <div
                key={msg.id}
                className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 font-mono text-xs text-amber-900 dark:text-amber-200 rounded-xl shadow-xs leading-relaxed"
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
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{msg.sender_name}</span>
                <span className="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-1.5 py-0.2 rounded-md text-[10px] font-mono">
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
                className={`max-w-[85%] p-3 text-xs leading-relaxed rounded-2xl break-words overflow-hidden ${
                  isMe
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs'
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
      <div className="py-2.5 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex-shrink-0 flex items-center gap-1 font-semibold text-cyan-600 dark:text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
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
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex-shrink-0 transition-all shadow-xs"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="pt-1 flex gap-2.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${
            currentUser.role === 'CREATOR'
              ? activeProject.editor_name || 'Editor'
              : activeProject.creator_name
          }...`}
          className="flex-1 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-40 transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
