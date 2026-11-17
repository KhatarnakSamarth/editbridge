'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
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
      <div className="win95-sunken p-3 flex-1 overflow-y-auto space-y-3 bg-[#e8e8e8]">
        {activeProjectMessages.map((msg) => {
          const isMe = msg.sender_id === currentUser.id;
          const isSystem = msg.message.startsWith('[SYSTEM');

          if (isSystem) {
            return (
              <div
                key={msg.id}
                className="p-2 bg-yellow-100 border-2 border-yellow-500 font-mono text-[11px] text-yellow-900 rounded-none shadow-sm"
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
              <div className="flex items-center gap-1.5 mb-0.5 text-[10px] font-mono text-neutral-600">
                <span className="font-bold text-neutral-900">{msg.sender_name}</span>
                <span className="bg-neutral-300 border border-neutral-400 px-1 text-[9px]">
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
                className={`max-w-[85%] p-2.5 text-xs font-sans border ${
                  isMe
                    ? 'bg-[#000080] text-white border-[#000050] shadow-sm'
                    : 'bg-white text-neutral-900 border-neutral-400 shadow-sm'
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
      <div className="py-1.5 flex items-center gap-1 overflow-x-auto text-[10px] font-mono text-neutral-700">
        <span className="text-neutral-500 flex-shrink-0 flex items-center gap-0.5">
          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
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
            className="win95-button px-1.5 py-0.5 flex-shrink-0 hover:bg-neutral-100"
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
          className="win95-sunken flex-1 px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="win95-button win95-button-primary px-3 py-1 text-xs font-bold font-mono flex items-center gap-1 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
