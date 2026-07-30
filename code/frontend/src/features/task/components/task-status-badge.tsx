'use client';

import React from 'react';
import type { TaskStatus } from '../types';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: 'To Do',
    className: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  IN_REVIEW: {
    label: 'In Review',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.TODO;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${config.className}`}
    >
      {config.label}
    </span>
  );
}
