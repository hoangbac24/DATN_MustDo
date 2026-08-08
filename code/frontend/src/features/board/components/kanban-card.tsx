'use client';

import React from 'react';
import { Calendar, GripVertical, User } from 'lucide-react';
import type { TaskDto } from '@/features/task/types';
import { TaskPriorityBadge } from '@/features/task/components/task-priority-badge';

interface KanbanCardProps {
  task: TaskDto;
  onSelect: (task: TaskDto) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export function KanbanCard({ task, onSelect, onDragStart }: KanbanCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, task.id);
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(task)}
      className="group relative cursor-grab active:cursor-grabbing rounded-xl border border-white/10 bg-[#1e293b]/80 p-3.5 shadow-md backdrop-blur-md transition-all duration-200 hover:border-indigo-500/50 hover:bg-[#1e293b] hover:shadow-indigo-500/10"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-1 text-gray-500 group-hover:text-gray-400">
          <GripVertical className="h-3.5 w-3.5 shrink-0" />
          <h4 className="text-xs font-semibold text-white line-clamp-2">{task.title}</h4>
        </div>
        <TaskPriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="mt-2 text-[11px] text-gray-400 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-gray-400">
        {formattedDueDate ? (
          <div className="flex items-center space-x-1 text-indigo-300">
            <Calendar className="h-3 w-3" />
            <span>{formattedDueDate}</span>
          </div>
        ) : (
          <span />
        )}

        {task.assignee ? (
          <div className="flex items-center space-x-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              {task.assignee.fullName ? task.assignee.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-gray-500">
            <User className="h-3 w-3" />
          </div>
        )}
      </div>
    </div>
  );
}
