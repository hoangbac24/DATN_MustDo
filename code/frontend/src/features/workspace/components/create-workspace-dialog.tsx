'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Plus, X, Layers } from 'lucide-react';
import { useCreateWorkspace } from '../hooks/use-workspace';

const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters'),
  description: z.string().optional(),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkspaceDialog({ isOpen, onClose }: CreateWorkspaceDialogProps) {
  const createMutation = useCreateWorkspace();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  if (!isOpen) return null;

  const onSubmit = (data: CreateWorkspaceFormData) => {
    setErrorMessage(null);
    createMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (err: any) => {
          setErrorMessage(err.response?.data?.message || 'Failed to create workspace.');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-white font-heading">Create New Workspace</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Workspace Name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. Engineering Team"
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none"
            />
            {errors.name && <p className="text-[11px] text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Description (Optional)</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Brief summary of workspace goals..."
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none"
            />
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
              disabled={createMutation.isPending}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Create Workspace'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
