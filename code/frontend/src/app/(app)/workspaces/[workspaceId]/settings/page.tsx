'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Trash2, Users, Settings, ShieldAlert } from 'lucide-react';
import {
  useDeleteWorkspace,
  useUpdateWorkspace,
  useWorkspaceDetails,
  useWorkspaceMembers,
} from '@/features/workspace/hooks/use-workspace';

const updateWorkspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters'),
  description: z.string().optional(),
  themeColor: z.string().optional(),
});

type UpdateWorkspaceFormData = z.infer<typeof updateWorkspaceSchema>;

export default function WorkspaceSettingsPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const router = useRouter();

  const { data: workspace, isLoading } = useWorkspaceDetails(workspaceId);
  const { data: members = [] } = useWorkspaceMembers(workspaceId);

  const updateMutation = useUpdateWorkspace(workspaceId);
  const deleteMutation = useDeleteWorkspace();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateWorkspaceFormData>({
    resolver: zodResolver(updateWorkspaceSchema),
    values: {
      name: workspace?.name || '',
      description: workspace?.description || '',
      themeColor: workspace?.themeColor || '#6366f1',
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center text-xs text-gray-400">
        Workspace not found or access denied.
      </div>
    );
  }

  const isOwner = workspace.userRole === 'OWNER';

  const onSubmit = (data: UpdateWorkspaceFormData) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    updateMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        themeColor: data.themeColor || undefined,
      },
      {
        onSuccess: () => {
          setSuccessMsg('Workspace settings saved successfully!');
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Failed to update workspace.');
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(workspaceId, {
      onSuccess: () => {
        router.push('/workspaces' as any);
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
          Workspace Settings
        </h1>
        <p className="text-xs text-gray-400">Manage workspace parameters, theme colors, and active members</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">General Information</h2>
              <p className="text-[11px] text-gray-400">Update workspace name and description</p>
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
              <label className="text-xs font-medium text-gray-300">Workspace Name</label>
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
              <label className="text-xs font-medium text-gray-300">Theme Color</label>
              <div className="flex items-center space-x-3">
                <input
                  {...register('themeColor')}
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-transparent p-0"
                />
                <span className="text-xs font-mono text-gray-400">{workspace.themeColor}</span>
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

        {/* Member Structure */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Members & Roles</h2>
              <p className="text-[11px] text-gray-400">Invite-ready architecture structure</p>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-white/5 space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-xs font-semibold text-white">{m.fullName || 'Member'}</p>
                  <p className="text-[10px] text-gray-400">{m.email}</p>
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-purple-400 uppercase">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone (Owner Only) */}
      {isOwner && (
        <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-red-400 flex items-center">
                <ShieldAlert className="mr-2 h-4 w-4" /> Danger Zone
              </h3>
              <p className="text-xs text-gray-400">
                Soft-delete this workspace. All members will lose access.
              </p>
            </div>

            <button
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="flex items-center space-x-2 rounded-xl bg-red-600/20 px-4 py-2 text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-white">Confirm Deletion</h3>
            <p className="text-xs text-gray-300">
              Are you sure you want to delete <span className="font-bold text-white">{workspace.name}</span>? This action can be audited via soft delete.
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
                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Workspace'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
