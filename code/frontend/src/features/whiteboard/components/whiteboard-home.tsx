'use client';

import React, { useState } from 'react';
import { Palette, Plus, Loader2, Layout, Trash2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  useWorkspaceWhiteboards,
  useWhiteboardDetails,
  useCreateWhiteboard,
  useSyncWhiteboardElements,
  useDeleteWhiteboard,
} from '../hooks/use-whiteboard';
import { WhiteboardCanvas } from './whiteboard-canvas';

interface WhiteboardHomeProps {
  workspaceId: string;
}

export function WhiteboardHome({ workspaceId }: WhiteboardHomeProps) {
  const { t: tNav } = useTranslation('navigation');
  const { data: boards = [], isLoading: isLoadingList } = useWorkspaceWhiteboards(workspaceId);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

  const { data: activeBoard, isLoading: isLoadingBoard } = useWhiteboardDetails(activeBoardId);

  const createMutation = useCreateWhiteboard(workspaceId);
  const syncMutation = useSyncWhiteboardElements(activeBoardId || '');
  const deleteMutation = useDeleteWhiteboard(workspaceId);

  const handleCreateBoard = () => {
    createMutation.mutate(
      {
        title: 'Bảng vẽ ý tưởng & Sơ đồ kiến trúc mới',
        description: 'Bảng trắng trực quan để vẽ ý tưởng, sơ đồ quy trình và kiến trúc hệ thống',
      },
      {
        onSuccess: (newBoard) => {
          setActiveBoardId(newBoard.id);
        },
      }
    );
  };

  const handleDeleteBoard = (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(boardId, {
      onSuccess: () => {
        if (activeBoardId === boardId) setActiveBoardId(null);
      },
    });
  };

  if (isLoadingList) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center space-x-3">
          {activeBoardId && (
            <button
              onClick={() => setActiveBoardId(null)}
              className="rounded-xl border border-surface-border bg-surface p-2 text-text-secondary hover:bg-surface-alt hover:text-text-primary transition"
              title="Quay lại danh sách Bảng vẽ"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-text-primary font-heading">
              {activeBoard ? activeBoard.title : tNav('menu.whiteboard', { defaultValue: 'Bảng vẽ Whiteboard' })}
            </h2>
          </div>
        </div>

        {!activeBoardId && (
          <button
            onClick={handleCreateBoard}
            disabled={createMutation.isPending}
            className="flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover active:scale-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo Bảng vẽ mới</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {activeBoardId ? (
        isLoadingBoard || !activeBoard ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-surface-border bg-surface">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <WhiteboardCanvas
            initialElements={activeBoard.elements || []}
            onSave={(elements) => syncMutation.mutate({ elements })}
            isSaving={syncMutation.isPending}
          />
        )
      ) : boards.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface p-8 text-center shadow-xs">
          <Layout className="h-10 w-10 text-primary" />
          <h3 className="mt-3 text-sm font-bold text-text-primary font-heading">Chưa có Bảng vẽ nào</h3>
          <p className="mt-1 text-xs text-text-secondary">Tạo bảng vẽ ý tưởng trực quan để phát thảo quy trình và thiết kế sơ đồ nhóm</p>
          <button
            onClick={handleCreateBoard}
            className="mt-4 flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover active:scale-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo Bảng vẽ mới</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => setActiveBoardId(board.id)}
              className="group relative cursor-pointer rounded-xl border border-surface-border bg-surface p-5 hover:border-primary/50 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Palette className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary font-heading">{board.title}</h4>
                    <p className="text-[10px] text-text-muted">{board.elements.length} phần tử sơ đồ</p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteBoard(board.id, e)}
                  className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-text-muted hover:bg-status-error/10 hover:text-status-error transition"
                  title="Xóa Bảng vẽ"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 text-xs text-text-secondary line-clamp-2">
                {board.description || 'Bảng vẽ trực quan tương tác nhóm'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
