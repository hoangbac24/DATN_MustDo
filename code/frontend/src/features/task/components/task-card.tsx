'use client';

import React from 'react';
import { Calendar, CheckCircle2, Circle, MoreVertical, Archive } from 'lucide-react';
import type { TaskDto } from '../types';
import { TaskStatusBadge } from './task-status-badge';
import { TaskPriorityBadge } from './task-priority-badge';
import { useUpdateTaskStatus } from '../hooks/use-task';

interface TaskCardProps {
  task: TaskDto;
  onSelect: (task: TaskDto) => void;
}

export function TaskCard({ task, onSelect }: TaskCardProps) {
  const updateStatus = useUpdateTaskStatus();
  const isCompleted = task.status === 'COMPLETED';

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = isCompleted ? 'TODO' : 'COMPLETED';
    updateStatus.mutate({ taskId: task.id, status: nextStatus });
  };

  return (
    <div
      onClick={() => onSelect(task)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 backdrop-blur-md transition cursor-pointer ${
        isCompleted
          ? 'border-white/5 bg-[#111827]/40 opacity-75'
          : 'border-white/10 bg-[#111827]/80 hover:border-white/20 hover:shadow-lg'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3 truncate">
            <button
              onClick={handleToggleComplete}
              className="mt-0.5 text-gray-400 hover:text-emerald-400 transition shrink-0"
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="truncate">
              <h4
                className={`text-sm font-semibold transition ${
                  isCompleted ? 'line-through text-gray-400' : 'text-white group-hover:text-indigo-400'
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-gray-400">
        <div className="flex items-center space-x-3">
          <TaskStatusBadge status={task.status} />

          {task.dueDate && (
            <div className="flex items-center space-x-1 text-[11px] text-gray-400">
              <Calendar className="h-3.5 w-3.5 text-gray-500" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {task.isArchived && (
            <span className="flex items-center text-[10px] text-amber-400">
              <Archive className="mr-1 h-3 w-3" /> Archived
            </span>
          )}
        </div>

        {task.assignee && (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm"
            title={task.assignee.fullName}
          >
            {task.assignee.fullName?.substring(0, 1).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
