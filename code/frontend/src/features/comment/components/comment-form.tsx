'use client';

import React, { useState } from 'react';
import { Bold, Italic, Code, AtSign, Send } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialValue?: string;
  onCancel?: () => void;
  submitLabel?: string;
}

export function CommentForm({
  onSubmit,
  isLoading,
  placeholder = 'Write a comment...',
  initialValue = '',
  onCancel,
  submitLabel = 'Comment',
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed) {
      onSubmit(trimmed);
      if (!initialValue) {
        setContent('');
      }
    }
  };

  const insertFormat = (prefix: string, suffix: string = prefix) => {
    setContent((prev) => `${prev}${prefix}${suffix}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-xl border border-white/10 bg-gray-950/60 p-3">
      {/* Formatting Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 text-gray-400">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => insertFormat('**', '**')}
            className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white transition"
            title="Bold (**bold**)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat('*', '*')}
            className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white transition"
            title="Italic (*italic*)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat('`', '`')}
            className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white transition"
            title="Code (`code`)"
          >
            <Code className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat('@')}
            className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-indigo-400 transition"
            title="Mention (@user)"
          >
            <AtSign className="h-3.5 w-3.5" />
          </button>
        </div>

        <span className="text-[10px] text-gray-500">{content.length}/5000</span>
      </div>

      {/* Textarea Input */}
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full resize-none bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
      />

      {/* Footer Controls */}
      <div className="flex items-center justify-end space-x-2 pt-1 border-t border-white/5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5 hover:text-white transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="flex items-center space-x-1 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 transition"
        >
          <Send className="h-3 w-3" />
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
