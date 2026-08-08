'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  useWorkspaceWikiTree,
  useWikiPage,
  useWikiVersions,
  useCreateWikiPage,
  useUpdateWikiPage,
  useDeleteWikiPage,
} from '../hooks/use-wiki';
import { WikiTreeNavigation } from './wiki-tree-navigation';
import { WikiBreadcrumb } from './wiki-breadcrumb';
import { WikiEditor } from './wiki-editor';
import { VersionHistoryDialog } from './version-history-dialog';

interface WikiHomeProps {
  workspaceId: string;
}

export function WikiHome({ workspaceId }: WikiHomeProps) {
  const { t: tNav } = useTranslation('navigation');
  const { data: tree = [], isLoading: isLoadingTree } = useWorkspaceWikiTree(workspaceId);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);

  const { data: selectedPage, isLoading: isLoadingPage } = useWikiPage(selectedPageId);
  const { data: versions = [] } = useWikiVersions(selectedPageId);

  const createMutation = useCreateWikiPage(workspaceId);
  const updateMutation = useUpdateWikiPage(workspaceId, selectedPageId || '');
  const deleteMutation = useDeleteWikiPage(workspaceId);

  const handleCreatePage = (parentPageId?: string) => {
    createMutation.mutate(
      {
        title: 'Tài liệu Wiki mới',
        content: '# Tài liệu Wiki mới\n\nBắt đầu nhập nội dung hướng dẫn hoặc ghi chú tại đây...',
        parentPageId,
      },
      {
        onSuccess: (newPage) => {
          setSelectedPageId(newPage.id);
        },
      }
    );
  };

  const handleDeletePage = (pageId: string) => {
    deleteMutation.mutate(pageId, {
      onSuccess: () => {
        setSelectedPageId(null);
      },
    });
  };

  // Auto-select first page if available
  React.useEffect(() => {
    if (!selectedPageId && tree.length > 0) {
      setSelectedPageId(tree[0].id);
    }
  }, [tree, selectedPageId]);

  if (isLoadingTree) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WikiBreadcrumb pageTitle={selectedPage?.title} />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar Tree */}
        <WikiTreeNavigation
          tree={tree}
          selectedPageId={selectedPageId || undefined}
          onSelectPage={setSelectedPageId}
          onCreatePage={handleCreatePage}
        />

        {/* Right Editor / Details */}
        {isLoadingPage ? (
          <div className="flex flex-1 h-64 items-center justify-center rounded-2xl border border-surface-border bg-surface">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedPage ? (
          <WikiEditor
            page={selectedPage}
            onSave={(payload) => updateMutation.mutate(payload)}
            onDelete={handleDeletePage}
            onOpenVersions={() => setIsVersionsOpen(true)}
            isSaving={updateMutation.isPending}
          />
        ) : (
          <div className="flex flex-1 h-64 flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface p-8 text-center shadow-xs">
            <BookOpen className="h-10 w-10 text-primary" />
            <h3 className="mt-3 text-sm font-bold text-text-primary font-heading">Chưa chọn trang tài liệu nào</h3>
            <p className="mt-1 text-xs text-text-secondary">Chọn một trang từ cây danh mục bên trái hoặc tạo trang Wiki mới</p>
            <button
              onClick={() => handleCreatePage()}
              className="mt-4 flex items-center space-x-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover active:scale-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo trang mới</span>
            </button>
          </div>
        )}
      </div>

      <VersionHistoryDialog
        versions={versions}
        isOpen={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
      />
    </div>
  );
}
