'use client';

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import {
  useDashboardSummary,
  useOverdueTasks,
  useProductivityStats,
  useTodayTasks,
  useUpcomingTasks,
} from '@/features/dashboard/hooks/use-dashboard';
import { StatCard } from '@/features/dashboard/components/stat-card';
import { ProductivityChart } from '@/features/dashboard/components/productivity-chart';
import { RecentActivity } from '@/features/dashboard/components/recent-activity';
import { QuickAddTaskWidget } from '@/features/dashboard/components/quick-add-task-widget';
import { TaskCard } from '@/features/task/components/task-card';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

  const { data: summary } = useDashboardSummary();
  const { data: todayTasks = [] } = useTodayTasks();
  const { data: upcomingTasks = [] } = useUpcomingTasks();
  const { data: overdueTasks = [] } = useOverdueTasks();
  const { data: productivity = [] } = useProductivityStats();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-gray-900/50 p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white font-heading">
              Welcome back, <span className="text-indigo-400">{user?.fullName || 'User'}</span> 👋
            </h1>
            <p className="text-xs text-gray-300 max-w-xl">
              Here is your personal productivity overview across your active workspaces.
            </p>
          </div>

          {activeWorkspace && (
            <div className="flex items-center space-x-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white text-xs"
                style={{ backgroundColor: activeWorkspace.themeColor || '#6366f1' }}
              >
                {activeWorkspace.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{activeWorkspace.name}</p>
                <p className="text-[10px] text-gray-400">Active Workspace</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Tasks"
          value={summary?.todayTasksCount ?? todayTasks.length}
          subtitle="Tasks due today"
          icon={Calendar}
          badgeColor="bg-indigo-500/20 text-indigo-400"
        />

        <StatCard
          title="Upcoming Tasks"
          value={summary?.upcomingTasksCount ?? upcomingTasks.length}
          subtitle="Due next 7 days"
          icon={Clock}
          badgeColor="bg-purple-500/20 text-purple-400"
        />

        <StatCard
          title="Overdue Tasks"
          value={summary?.overdueTasksCount ?? overdueTasks.length}
          subtitle="Requires attention"
          icon={AlertTriangle}
          badgeColor="bg-rose-500/20 text-rose-400"
        />

        <StatCard
          title="Completion Rate"
          value={`${summary?.completionRate ?? 0}%`}
          subtitle={`${summary?.completedTasksCount ?? 0} of ${summary?.totalTasksCount ?? 0} completed`}
          icon={TrendingUp}
          badgeColor="bg-emerald-500/20 text-emerald-400"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Productivity Chart */}
          <ProductivityChart stats={productivity} />

          {/* Today & Overdue Task Focus List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-heading">Task Focus</h2>
              {activeWorkspace && (
                <Link
                  href={`/workspaces/${activeWorkspace.id}/projects` as any}
                  className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {overdueTasks.length > 0 && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-rose-400 flex items-center">
                  <AlertTriangle className="mr-1.5 h-4 w-4" /> Overdue Tasks ({overdueTasks.length})
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {overdueTasks.slice(0, 4).map((task) => (
                    <TaskCard key={task.id} task={task} onSelect={() => {}} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-3">Due Today ({todayTasks.length})</h3>
              {todayTasks.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111827]/40 p-4 text-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  <p className="mt-2 text-xs text-gray-400">All clear! No tasks due today.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {todayTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onSelect={() => {}} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-8">
          <QuickAddTaskWidget />
          <RecentActivity activities={summary?.recentActivities || []} />
        </div>
      </div>
    </div>
  );
}
