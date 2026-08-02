'use client';

import React from 'react';
import type { SearchEntityType } from '../types';

interface FilterPanelProps {
  selectedType: SearchEntityType;
  onSelectType: (type: SearchEntityType) => void;
  sortBy: 'relevance' | 'date' | 'title';
  onSelectSortBy: (sort: 'relevance' | 'date' | 'title') => void;
  counts?: {
    tasks: number;
    projects: number;
    tags: number;
    comments: number;
  };
}

export function FilterPanel({
  selectedType,
  onSelectType,
  sortBy,
  onSelectSortBy,
  counts,
}: FilterPanelProps) {
  const tabs: { label: string; value: SearchEntityType; count?: number }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Tasks', value: 'TASK', count: counts?.tasks },
    { label: 'Projects', value: 'PROJECT', count: counts?.projects },
    { label: 'Tags', value: 'TAG', count: counts?.tags },
    { label: 'Comments', value: 'COMMENT', count: counts?.comments },
  ];

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onSelectType(tab.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedType === tab.value
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sorting Selector */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-gray-400">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSelectSortBy(e.target.value as any)}
          className="rounded-lg border border-white/10 bg-gray-900 px-2 py-1 text-xs text-gray-200 outline-none focus:border-indigo-500"
        >
          <option value="relevance">Relevance</option>
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
  );
}
