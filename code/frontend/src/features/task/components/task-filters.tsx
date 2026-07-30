'use client';

import React from 'react';
import { Search, Filter, Archive } from 'lucide-react';
import type { TaskFilterState, TaskPriority, TaskStatus } from '../types';

interface TaskFiltersProps {
  filters: TaskFilterState;
  onChange: (filters: TaskFilterState) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl border border-white/10 bg-[#111827]/70 p-4 backdrop-blur-md">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search task title or description..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
          className="w-full rounded-xl border border-white/10 bg-gray-900/60 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Filter Selectors */}
      <div className="flex items-center space-x-3 overflow-x-auto">
        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
          className="rounded-xl border border-white/10 bg-gray-900/60 px-3 py-2 text-xs text-gray-300 transition focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={filters.priority || ''}
          onChange={(e) => onChange({ ...filters, priority: e.target.value || undefined })}
          className="rounded-xl border border-white/10 bg-gray-900/60 px-3 py-2 text-xs text-gray-300 transition focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        <button
          onClick={() => onChange({ ...filters, archived: !filters.archived })}
          className={`flex items-center space-x-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
            filters.archived
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              : 'border-white/10 bg-gray-900/60 text-gray-400 hover:text-white'
          }`}
        >
          <Archive className="h-3.5 w-3.5" />
          <span>Archived</span>
        </button>
      </div>
    </div>
  );
}
