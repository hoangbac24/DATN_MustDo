'use client';

import React from 'react';
import type { TaskPriority } from '../types';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  LOW: {
    label: 'Low',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  HIGH: {
    label: 'High',
    className: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  URGENT: {
    label: 'Urgent',
    className: 'bg-red-500/20 text-red-400 border-red-500/30 font-bold animate-pulse',
  },
};

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
