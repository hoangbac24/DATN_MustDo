'use client';

import React from 'react';
import { SearchResultItem } from './search-result-item';
import type { GlobalSearchResultDto } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchResultsProps {
  data?: GlobalSearchResultDto;
  isLoading: boolean;
  onSelectResult?: () => void;
  onPageChange: (page: number) => void;
}

export function SearchResults({ data, isLoading, onSelectResult, onPageChange }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 py-4">
        <div className="h-14 animate-pulse rounded-xl bg-gray-900/60" />
        <div className="h-14 animate-pulse rounded-xl bg-gray-900/60" />
        <div className="h-14 animate-pulse rounded-xl bg-gray-900/60" />
      </div>
    );
  }

  const items = data?.items || [];
  const totalElements = data?.totalElements || 0;
  const page = data?.page || 0;
  const totalPages = data?.totalPages || 0;

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-xs italic">
        No results found matching your search criteria.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {items.map((item) => (
          <SearchResultItem key={item.id} item={item} onSelect={onSelectResult} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-gray-400">
          <span>
            {totalElements} results found (Page {page + 1} of {totalPages})
          </span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
              className="rounded p-1 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={data?.last}
              onClick={() => onPageChange(page + 1)}
              className="rounded p-1 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
