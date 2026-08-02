'use client';

import React from 'react';
import Link from 'next/link';
import { CheckSquare, FolderKanban, Tag, MessageSquare } from 'lucide-react';
import type { SearchResultItemDto } from '../types';

interface SearchResultItemProps {
  item: SearchResultItemDto;
  onSelect?: () => void;
}

export function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  const getTypeBadge = () => {
    switch (item.type) {
      case 'TASK':
        return (
          <span className="flex items-center space-x-1 rounded bg-indigo-600/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400">
            <CheckSquare className="h-3 w-3" />
            <span>TASK</span>
          </span>
        );
      case 'PROJECT':
        return (
          <span className="flex items-center space-x-1 rounded bg-emerald-600/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
            <FolderKanban className="h-3 w-3" />
            <span>PROJECT</span>
          </span>
        );
      case 'TAG':
        return (
          <span className="flex items-center space-x-1 rounded bg-amber-600/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
            <Tag className="h-3 w-3" />
            <span>TAG</span>
          </span>
        );
      case 'COMMENT':
        return (
          <span className="flex items-center space-x-1 rounded bg-blue-600/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">
            <MessageSquare className="h-3 w-3" />
            <span>COMMENT</span>
          </span>
        );
    }
  };

  return (
    <Link
      href={item.link as any}
      onClick={onSelect}
      className="group flex items-start justify-between rounded-xl border border-white/5 bg-gray-900/40 p-3 text-xs transition hover:border-indigo-500/40 hover:bg-gray-900/80"
    >
      <div className="space-y-1 min-w-0 flex-1 pr-3">
        <div className="flex items-center space-x-2">
          {getTypeBadge()}
          <h4 className="font-bold text-white group-hover:text-indigo-400 transition truncate">{item.title}</h4>
        </div>

        {item.description && (
          <p className="text-[11px] text-gray-400 line-clamp-2">{item.description}</p>
        )}
      </div>

      {item.createdAt && (
        <span className="text-[10px] text-gray-500 shrink-0">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      )}
    </Link>
  );
}
