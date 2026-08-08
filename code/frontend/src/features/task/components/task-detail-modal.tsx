'use client';

import React from 'react';
import { Calendar, Trash2, Edit3, Archive, X, CheckSquare } from 'lucide-react';
import type { TaskDto, TaskStatus } from '../types';
import { TaskStatusBadge } from './task-status-badge';
import { TaskPriorityBadge } from './task-priority-badge';
import { useAssignTask, useDeleteTask, useToggleArchiveTask, useUpdateTaskStatus } from '../hooks/use-task';

import { AttachmentList } from '@/features/attachment/components/attachment-list';
import { ChecklistComponent } from '@/features/checklist/components/checklist-component';
import { CommentList } from '@/features/comment/components/comment-list';
import { ReminderList } from '@/features/reminder/components/reminder-list';
import { TagSelector } from '@/features/tag/components/tag-selector';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useWorkspaceMembers } from '@/features/workspace/hooks/use-workspace';

interface TaskDetailModalProps {
  task: TaskDto | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: TaskDto) => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onEdit }: TaskDetailModalProps) {
  const updateStatus = useUpdateTaskStatus();
  const toggleArchive = useToggleArchiveTask();
  const deleteTask = useDeleteTask();
  const assignTask = useAssignTask();
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const { data: members = [] } = useWorkspaceMembers(activeWorkspaceId);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleStatusChange = (status: TaskStatus) => {
    updateStatus.mutate({ taskId: task.id, status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-md">
      <div className="h-full w-full sm:h-auto sm:max-w-xl rounded-none sm:rounded-2xl border-0 sm:border border-white/10 bg-[#111827] p-6 shadow-2xl space-y-6 max-h-screen sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">{task.title}</h2>
              <div className="mt-1.5 flex items-center space-x-2">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
                {task.isArchived && (
                  <span className="flex items-center text-[10px] text-amber-400">
                    <Archive className="mr-1 h-3 w-3" /> Archived
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Task Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</h3>
            <p className="mt-1 text-xs text-gray-300 whitespace-pre-wrap">
              {task.description || 'No detailed description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-b border-white/5 py-4 text-xs">
            <div>
              <span className="text-gray-400">Assignee</span>
              <div className="mt-1 flex items-center space-x-2">
                <select
                  value={task.assigneeId || ''}
                  onChange={(e) => {
                    const val = e.target.value || null;
                    assignTask.mutate({ taskId: task.id, assigneeId: val });
                  }}
                  className="rounded-lg border border-white/10 bg-gray-900/80 px-2 py-1 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.fullName || m.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <span className="text-gray-400">Due Date</span>
              <p className="mt-1 text-white font-medium flex items-center">
                <Calendar className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </p>
            </div>

            <div>
              <span className="text-gray-400">Created At</span>
              <p className="mt-1 text-white font-medium">
                {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Tags Selector */}
          {activeWorkspaceId && (
            <TagSelector taskId={task.id} workspaceId={activeWorkspaceId} />
          )}

          {/* Scheduled Reminders */}
          <ReminderList taskId={task.id} />

          {/* File Attachments */}
          <AttachmentList taskId={task.id} />

          {/* Checklist Component */}
          <ChecklistComponent taskId={task.id} />

          {/* Comments Discussion Thread */}
          <CommentList taskId={task.id} />

          {/* Quick Status Update Buttons */}
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Update Status</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED'] as TaskStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition ${
                    task.status === s
                      ? 'border-indigo-500 bg-indigo-600/30 text-white font-bold'
                      : 'border-white/10 bg-gray-900/60 text-gray-400 hover:text-white'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleArchive.mutate(task.id)}
              className="flex items-center space-x-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <Archive className="h-3.5 w-3.5" />
              <span>{task.isArchived ? 'Unarchive' : 'Archive'}</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center space-x-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-600 hover:text-white transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onEdit) {
                onEdit(task);
              }
            }}
            className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}
