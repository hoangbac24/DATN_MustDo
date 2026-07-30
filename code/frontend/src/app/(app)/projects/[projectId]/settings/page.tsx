'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Trash2, Settings, ShieldAlert, Archive, Star } from 'lucide-react';
import {
  useDeleteProject,
  useProjectDetails,
  useToggleArchiveProject,
  useToggleFavoriteProject,
  useUpdateProject,
} from '@/features/project/hooks/use-project';

const COLOR_OPTIONS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

const updateProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
});

type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;

export default function ProjectSettingsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;
  const router = useRouter();

  const { data: project, isLoading } = useProjectDetails(projectId);
  const updateMutation = useUpdateProject(projectId);
  const deleteMutation = useDeleteProject();
  const toggleArchive = useToggleArchiveProject();
  const toggleFavorite = useToggleFavoriteProject();

  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProjectFormData>({
    resolver: zodResolver(updateProjectSchema),
    values: {
      name: project?.name || '',
      description: project?.description || '',
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center text-xs text-gray-400">
        Project not found or access denied.
      </div>
    );
  }

  const onSubmit = (data: UpdateProjectFormData) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    updateMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        color: selectedColor,
      },
      {
        onSuccess: () => {
          setSuccessMsg('Project settings saved successfully!');
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Failed to update project.');
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(projectId, {
      onSuccess: () => {
        router.push(`/workspaces/${project.workspaceId}/projects` as any);
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
          Project Settings
        </h1>
        <p className="text-xs text-gray-400">Update project name, description, color theme, and status</p>
      </div>

      {/* General Settings */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md">
        <div className="mb-4 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">General Information</h2>
            <p className="text-[11px] text-gray-400">Basic properties for this project</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-4 flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <Check className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Project Name</label>
            <input
              {...register('name')}
              type="text"
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            />
            {errors.name && <p className="text-[11px] text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            />
          </div>

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

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-4">
        <h2 className="text-sm font-semibold text-white">Project Actions</h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-xs font-medium text-white">Archive Project</p>
            <p className="text-[11px] text-gray-400">Move project to archived status</p>
          </div>
          <button
            onClick={() => toggleArchive.mutate(projectId)}
            className="flex items-center space-x-2 rounded-xl bg-purple-600/20 px-4 py-2 text-xs font-semibold text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition"
          >
            <Archive className="h-4 w-4" />
            <span>{project.isArchived ? 'Unarchive Project' : 'Archive Project'}</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-xs font-medium text-white">Favorite Status</p>
            <p className="text-[11px] text-gray-400">Bookmark this project for quick access</p>
          </div>
          <button
            onClick={() => toggleFavorite.mutate(projectId)}
            className="flex items-center space-x-2 rounded-xl bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-white transition"
          >
            <Star className="h-4 w-4" />
            <span>{project.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-red-400 flex items-center">
              <ShieldAlert className="mr-2 h-4 w-4" /> Danger Zone
            </h3>
            <p className="text-xs text-gray-400">
              Soft-delete this project.
            </p>
          </div>

          <button
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="flex items-center space-x-2 rounded-xl bg-red-600/20 px-4 py-2 text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Project</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-white">Confirm Project Deletion</h3>
            <p className="text-xs text-gray-300">
              Are you sure you want to delete <span className="font-bold text-white">{project.name}</span>?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
              >
                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
