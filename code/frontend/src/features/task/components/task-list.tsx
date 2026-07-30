'use client';

import React, { useState } from 'react';
import { Plus, LayoutGrid, List as ListIcon, CheckSquare } from 'lucide-react';
import type { TaskDto, TaskFilterState, TaskStatus } from '../types';
import { useProjectTasks } from '../hooks/use-task';
import { TaskCard } from './task-card';
import { TaskFilters } from './task-filters';
import { TaskFormDialog } from './task-form-dialog';
import { TaskDetailModal } from './task-detail-modal';

interface TaskListProps {
  projectId: string;
}

const KANBAN_COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'TODO', label: 'To Do', color: '#64748b' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: '#6366f1' },
  { status: 'IN_REVIEW', label: 'In Review', color: '#f59e0b' },
  { status: 'COMPLETED', label: 'Completed', color: '#10b981' },
];

export function TaskList({ projectId }: TaskListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filters, setFilters] = useState<TaskFilterState>({});

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDto | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  const { data: tasks = [], isLoading } = useProjectTasks(projectId, filters);

  const handleCardClick = (task: TaskDto) => {
    setSelectedTask(task);
  };

  const handleEditTask = (task: TaskDto) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCreateOpen = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <TaskFilters filters={filters} onChange={setFilters} />

        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center rounded-xl border border-white/10 bg-[#111827]/70 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleCreateOpen}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111827]/40 p-8 text-center backdrop-blur-md">
          <CheckSquare className="h-8 w-8 text-indigo-400" />
          <h3 className="mt-3 text-sm font-semibold text-white font-heading">No tasks found</h3>
          <p className="mt-1 text-xs text-gray-400">Add a task or adjust your search filters</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={handleCardClick} />
          ))}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid gap-6 md:grid-cols-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className="flex flex-col rounded-2xl border border-white/10 bg-[#111827]/60 p-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-xs font-bold text-white font-heading">{col.label}</span>
                  </div>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-gray-400">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 min-h-48">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onSelect={handleCardClick} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog Modals */}
      <TaskFormDialog
        projectId={projectId}
        task={editingTask}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={handleEditTask}
      />
    </div>
  );
}
