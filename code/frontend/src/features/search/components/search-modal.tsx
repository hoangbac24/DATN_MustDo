'use client';

import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { SearchEntityType, SearchQueryParams } from '../types';
import { useGlobalSearch } from '../hooks/use-search';
import { FilterPanel } from './filter-panel';
import { SearchResults } from './search-results';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<SearchEntityType>('ALL');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');
  const [page, setPage] = useState(0);

  const searchParams: SearchQueryParams = {
    q: query,
    type: selectedType,
    sortBy,
    page,
    size: 10,
  };

  const { data, isLoading } = useGlobalSearch(searchParams, isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-16 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-4 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Search Input Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
          <Search className="h-5 w-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Type to search tasks, projects, tags, comments..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          selectedType={selectedType}
          onSelectType={(t) => {
            setSelectedType(t);
            setPage(0);
          }}
          sortBy={sortBy}
          onSelectSortBy={(s) => {
            setSortBy(s);
            setPage(0);
          }}
          counts={{
            tasks: data?.totalTasks || 0,
            projects: data?.totalProjects || 0,
            tags: data?.totalTags || 0,
            comments: data?.totalComments || 0,
          }}
        />

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          <SearchResults
            data={data}
            isLoading={isLoading}
            onSelectResult={onClose}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </div>
  );
}
