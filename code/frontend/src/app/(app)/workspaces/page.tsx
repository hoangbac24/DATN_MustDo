'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Plus, Settings, Users, ArrowRight } from 'lucide-react';
import { useWorkspaces } from '@/features/workspace/hooks/use-workspace';
import { useWorkspaceStore } from '@/store/workspace-store';
import { CreateWorkspaceDialog } from '@/features/workspace/components/create-workspace-dialog';

export default function WorkspacesDirectoryPage() {
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
            Workspaces Directory
          </h1>
          <p className="text-xs text-gray-400">View and manage all workspaces you own or participate in</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>New Workspace</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => {
            const isActive = activeWorkspace?.id === workspace.id;
            return (
              <div
                key={workspace.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-md transition ${
                  isActive
                    ? 'border-indigo-500/50 bg-indigo-900/10 shadow-xl'
                    : 'border-white/10 bg-[#111827]/70 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
                      style={{ backgroundColor: workspace.themeColor || '#6366f1' }}
                    >
                      {workspace.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-gray-300 capitalize">
                      {workspace.userRole}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-white font-heading">{workspace.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                    {workspace.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    <span>{workspace.memberCount} Members</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/workspaces/${workspace.id}/settings` as any}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white"
                      title="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setActiveWorkspace(workspace)}
                      className={`flex items-center space-x-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/10 text-gray-200 hover:bg-white/20'
                      }`}
                    >
                      <span>{isActive ? 'Active' : 'Switch'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateWorkspaceDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
