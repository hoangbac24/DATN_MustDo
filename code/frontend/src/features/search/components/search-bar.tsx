'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onOpenModal: () => void;
}

export function SearchBar({ onOpenModal }: SearchBarProps) {
  return (
    <button
      type="button"
      onClick={onOpenModal}
      className="flex h-9 w-64 items-center justify-between rounded-xl border border-white/10 bg-gray-900/60 px-3 text-xs text-gray-400 hover:border-indigo-500/50 hover:bg-gray-900 hover:text-gray-200 transition"
    >
      <div className="flex items-center space-x-2 truncate">
        <Search className="h-3.5 w-3.5 text-gray-400" />
        <span className="truncate">Search tasks, projects...</span>
      </div>
      <kbd className="hidden sm:inline-block rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-gray-400">
        Ctrl K
      </kbd>
    </button>
  );
}
