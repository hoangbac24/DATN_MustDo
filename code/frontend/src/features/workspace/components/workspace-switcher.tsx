'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, Plus, Settings, Layers } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useWorkspaces } from '../hooks/use-workspace';
import { CreateWorkspaceDialog } from './create-workspace-dialog';
import Link from 'next/link';

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: workspaces = [] } = useWorkspaces();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-gray-900/60 p-2.5 text-left text-xs transition hover:bg-white/5"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-sm"
              style={{ backgroundColor: activeWorkspace?.themeColor || '#6366f1' }}
            >
              {activeWorkspace?.name?.substring(0, 2).toUpperCase() || 'TF'}
            </div>
            <div className="truncate">
              <p className="font-semibold text-white truncate">{activeWorkspace?.name || 'Select Workspace'}</p>
              <p className="text-[10px] text-gray-400 capitalize">{activeWorkspace?.userRole || 'Member'}</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-full z-40 mt-2 w-full rounded-xl border border-white/10 bg-[#111827] p-1.5 shadow-2xl backdrop-blur-xl"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="mb-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Workspaces
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition ${
                    activeWorkspace?.id === ws.id
                      ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                      style={{ backgroundColor: ws.themeColor || '#6366f1' }}
                    >
                      {ws.name.substring(0, 1).toUpperCase()}
                    </div>
                    <span className="truncate">{ws.name}</span>
                  </div>
                  {activeWorkspace?.id === ws.id && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="mt-1.5 border-t border-white/10 pt-1.5 space-y-0.5">
              {activeWorkspace && (
                <Link
                  href={`/workspaces/${activeWorkspace.id}/settings` as any}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center space-x-2 rounded-lg px-2.5 py-2 text-xs text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Workspace Settings</span>
                </Link>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsCreateOpen(true);
                }}
                className="flex w-full items-center space-x-2 rounded-lg px-2.5 py-2 text-xs text-indigo-400 hover:bg-indigo-600/10"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateWorkspaceDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
