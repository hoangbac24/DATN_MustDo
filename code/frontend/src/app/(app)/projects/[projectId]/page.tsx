'use client';

import React, { use } from 'react';
import { Loader2, CheckSquare, Clock, BarChart3 } from 'lucide-react';
import { useProjectDetails, useProjectStats } from '@/features/project/hooks/use-project';
import { ProjectHeader } from '@/features/project/components/project-header';
import { TaskList } from '@/features/task/components/task-list';

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;

  const { data: project, isLoading } = useProjectDetails(projectId);
  const { data: stats } = useProjectStats(projectId);

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

  return (
    <div className="space-y-8">
      {/* Project Header Banner */}
      <ProjectHeader project={project} />

      {/* Project Statistics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Total Tasks</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white font-heading">
            {stats?.totalTasks || 0}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">Tasks in this project</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Completed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white font-heading">
            {stats?.completedTasks || 0}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">Resolved task items</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">In Progress</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white font-heading">
            {stats?.inProgressTasks || 0}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">Active execution tasks</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Progress</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white font-heading">
            {stats?.progressPercentage || 0}%
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-800">
            <div
              className="h-1.5 rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${stats?.progressPercentage || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Execution Board View */}
      <TaskList projectId={projectId} />
    </div>
  );
}
