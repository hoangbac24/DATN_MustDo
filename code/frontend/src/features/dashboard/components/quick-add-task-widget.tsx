'use client';

import React, { useState } from 'react';
import { Plus, Zap, ArrowRight } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useProjects } from '@/features/project/hooks/use-project';
import { CreateTaskInput } from '@/features/task/types';
import { useCreateTask } from '@/features/task/hooks/use-task';

export function QuickAddTaskWidget() {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const { data: projects = [] } = useProjects(activeWorkspace?.id || null);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [taskTitle, setTaskTitle] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const createTaskMutation = useCreateTask(activeProject?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeProject) return;

    createTaskMutation.mutate(
      {
        title: taskTitle.trim(),
        priority: 'MEDIUM',
        status: 'TODO',
      },
      {
        onSuccess: () => {
          setTaskTitle('');
          setSuccessMsg(true);
          setTimeout(() => setSuccessMsg(false), 2500);
        },
      }
    );
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white font-heading">Quick Add Task</h3>
          <p className="text-[11px] text-gray-400">Create a task directly into active workspace</p>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs text-emerald-400">
          Task added successfully!
        </div>
      )}

      {projects.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Create a project first to add tasks.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <select
              value={selectedProjectId || activeProject?.id || ''}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-gray-900/60 p-2 text-xs text-gray-300 transition focus:border-indigo-500 focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  Project: {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white placeholder-gray-500 transition focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!taskTitle.trim() || createTaskMutation.isPending}
              className="flex items-center space-x-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
