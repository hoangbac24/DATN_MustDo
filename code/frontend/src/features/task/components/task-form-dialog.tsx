'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Loader2, X } from 'lucide-react';
import type { TaskDto, TaskPriority, TaskStatus } from '../types';
import { useCreateTask, useUpdateTask } from '../hooks/use-task';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormDialogProps {
  projectId: string;
  task?: TaskDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskFormDialog({ projectId, task, isOpen, onClose }: TaskFormDialogProps) {
  const isEditing = !!task;

  const createMutation = useCreateTask(projectId);
  const updateMutation = useUpdateTask(task?.id || '');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
      });
    }
  }, [task, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = (data: TaskFormData) => {
    setErrorMessage(null);
    const dueDateInstant = data.dueDate ? new Date(data.dueDate).toISOString() : undefined;

    if (isEditing) {
      updateMutation.mutate(
        {
          title: data.title,
          description: data.description || undefined,
          status: data.status as TaskStatus,
          priority: data.priority as TaskPriority,
          dueDate: dueDateInstant,
        },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || 'Failed to update task.');
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          title: data.title,
          description: data.description || undefined,
          status: data.status as TaskStatus,
          priority: data.priority as TaskPriority,
          dueDate: dueDateInstant,
        },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
          onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || 'Failed to create task.');
          },
        }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <CheckSquare className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-white font-heading">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Task Title</label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g. Implement authentication flow"
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none"
            />
            {errors.title && <p className="text-[11px] text-red-400">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Task details and acceptance criteria..."
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Status</label>
              <select
                {...register('status')}
                className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Priority</label>
              <select
                {...register('priority')}
                className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Due Date</label>
              <input
                {...register('dueDate')}
                type="date"
                className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                'Save Task'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
