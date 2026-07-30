'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Folder, Loader2, X, Briefcase, Code, Layout, Terminal, CheckSquare } from 'lucide-react';
import { useCreateProject } from '../hooks/use-project';

const COLOR_OPTIONS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
const ICON_OPTIONS = [
  { name: 'Folder', icon: Folder },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Code', icon: Code },
  { name: 'Layout', icon: Layout },
  { name: 'Terminal', icon: Terminal },
  { name: 'CheckSquare', icon: CheckSquare },
];

const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectDialogProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectDialog({ workspaceId, isOpen, onClose }: CreateProjectDialogProps) {
  const createMutation = useCreateProject(workspaceId);
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [selectedIcon, setSelectedIcon] = useState('Folder');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
  });

  if (!isOpen) return null;

  const onSubmit = (data: CreateProjectFormData) => {
    setErrorMessage(null);
    createMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        color: selectedColor,
        icon: selectedIcon,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (err: any) => {
          setErrorMessage(err.response?.data?.message || 'Failed to create project.');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold"
              style={{ backgroundColor: selectedColor }}
            >
              <Folder className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-white font-heading">Create New Project</h2>
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
            <label className="text-xs font-medium text-gray-300">Project Name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. Website Redesign"
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none"
            />
            {errors.name && <p className="text-[11px] text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Description (Optional)</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Brief summary of project scope..."
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Color Palette Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Color Tag</label>
            <div className="flex items-center space-x-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className="flex h-7 w-7 items-center justify-center rounded-full transition transform hover:scale-110"
                  style={{ backgroundColor: c }}
                >
                  {selectedColor === c && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Project Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = selectedIcon === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setSelectedIcon(opt.name)}
                    className={`flex items-center justify-center rounded-lg p-2 transition ${
                      isSelected
                        ? 'bg-indigo-600/30 border border-indigo-500 text-indigo-400'
                        : 'bg-gray-900/60 border border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <IconComp className="h-4 w-4" />
                  </button>
                );
              })}
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
              disabled={createMutation.isPending}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
