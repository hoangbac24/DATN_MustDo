'use client';

import React, { useState } from 'react';
import { Plus, Settings, Loader2, LayoutGrid } from 'lucide-react';
import type { BoardColumnDto } from '../types';
import type { TaskDto } from '@/features/task/types';
import {
  useProjectBoard,
  useCreateColumn,
  useUpdateColumn,
  useDeleteColumn,
  useMoveTask,
  useUpdateBoardSettings,
} from '../hooks/use-board';
import { KanbanColumn } from './kanban-column';
import { AddColumnDialog } from './add-column-dialog';
import { EditColumnDialog } from './edit-column-dialog';
import { BoardSettingsDialog } from './board-settings-dialog';
import { TaskDetailModal } from '@/features/task/components/task-detail-modal';
import { TaskFormDialog } from '@/features/task/components/task-form-dialog';

interface KanbanBoardProps {
  projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { data: board, isLoading } = useProjectBoard(projectId);

  const createColumn = useCreateColumn(projectId, board?.id || '');
  const updateColumn = useUpdateColumn(projectId);
  const deleteColumn = useDeleteColumn(projectId);
  const moveTask = useMoveTask(projectId, board?.id || '');
  const updateSettings = useUpdateBoardSettings(projectId, board?.id || '');

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<BoardColumnDto | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const handleDragStartTask = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDropTask = (e: React.DragEvent, targetColumnId: string) => {
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId || !board) return;

    const targetColumn = board.columns.find((c) => c.id === targetColumnId);
    if (!targetColumn) return;

    const lastTask = targetColumn.tasks[targetColumn.tasks.length - 1];
    const targetPosition = lastTask ? (lastTask.position || 1000.0) + 1000.0 : 1000.0;

    moveTask.mutate({
      taskId,
      targetColumnId,
      targetPosition,
    });
  };

  const handleToggleCollapse = (columnId: string, isCollapsed: boolean) => {
    updateColumn.mutate({ columnId, data: { isCollapsed } });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111827]/40 p-8 text-center backdrop-blur-md">
        <LayoutGrid className="h-8 w-8 text-indigo-400" />
        <h3 className="mt-3 text-sm font-semibold text-white font-heading">No board initialized</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Board Top Action Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-white font-heading">{board.name}</h2>
          <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            {board.columns.length} Columns
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setIsAddColumnOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Column</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Column Grid */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-2">
        {board.columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onSelectTask={setSelectedTask}
            onEditColumn={setEditingColumn}
            onToggleCollapse={handleToggleCollapse}
            onAddTask={() => setIsCreateTaskOpen(true)}
            onDragStartTask={handleDragStartTask}
            onDropTask={handleDropTask}
          />
        ))}
      </div>

      {/* Dialog Modals */}
      <AddColumnDialog
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        onSubmit={(payload) => createColumn.mutate(payload)}
        isLoading={createColumn.isPending}
      />

      <EditColumnDialog
        column={editingColumn}
        isOpen={!!editingColumn}
        onClose={() => setEditingColumn(null)}
        onSubmit={(columnId, payload) => updateColumn.mutate({ columnId, data: payload })}
        onDelete={(columnId) => deleteColumn.mutate(columnId)}
        isLoading={updateColumn.isPending}
      />

      <BoardSettingsDialog
        board={board}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSubmit={(payload) => updateSettings.mutate(payload)}
        isLoading={updateSettings.isPending}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      <TaskFormDialog
        projectId={projectId}
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />
    </div>
  );
}
