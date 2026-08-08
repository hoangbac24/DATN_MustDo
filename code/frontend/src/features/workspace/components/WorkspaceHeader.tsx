'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  ListTodo, 
  LayoutGrid, 
  Code2, 
  GitCommitHorizontal, 
  BookOpen, 
  FileSpreadsheet, 
  Plus, 
  UserPlus, 
  MoreHorizontal, 
  Share2, 
  Zap, 
  Maximize2,
  Edit3
} from 'lucide-react';
import type { WorkspaceDto } from '../types';

export type WorkspaceTab = 'summary' | 'backlog' | 'board' | 'code' | 'timeline' | 'docs' | 'forms';

interface WorkspaceHeaderProps {
  workspace: WorkspaceDto | null;
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onOpenInviteMember: () => void;
}

export function WorkspaceHeader({
  workspace,
  activeTab,
  onTabChange,
  onOpenInviteMember,
}: WorkspaceHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation('workspace');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const tabs: { id: WorkspaceTab; labelKey: string; defaultLabel: string; icon: React.ElementType }[] = [
    { id: 'summary', labelKey: 'tabs.summary', defaultLabel: 'Summary', icon: Globe },
    { id: 'backlog', labelKey: 'tabs.backlog', defaultLabel: 'Backlog', icon: ListTodo },
    { id: 'board', labelKey: 'tabs.board', defaultLabel: 'Board', icon: LayoutGrid },
    { id: 'code', labelKey: 'tabs.code', defaultLabel: 'Code', icon: Code2 },
    { id: 'timeline', labelKey: 'tabs.timeline', defaultLabel: 'Timeline', icon: GitCommitHorizontal },
    { id: 'docs', labelKey: 'tabs.docs', defaultLabel: 'Docs', icon: BookOpen },
    { id: 'forms', labelKey: 'tabs.forms', defaultLabel: 'Forms', icon: FileSpreadsheet },
  ];

  const handleGoToEdit = () => {
    setShowOptionsMenu(false);
    if (workspace?.id) {
      router.push(`/workspaces/${workspace.id}/settings`);
    }
  };

  return (
    <div className="space-y-4 border-b border-surface-border pb-1 text-text-primary">
      {/* Spaces Breadcrumb */}
      <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
        Spaces
      </div>

      {/* Main Title Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          {/* Badge Icon */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: workspace?.themeColor || '#EA580C' }}
          >
            {workspace?.name?.substring(0, 2).toUpperCase() || 'SP'}
          </div>

          {/* Title */}
          <h1 className="text-xl font-extrabold tracking-tight text-text-primary font-heading">
            {workspace?.name || 'Workspace'}
          </h1>

          {/* Add Member Button - Opens Invite Modal */}
          <button
            onClick={onOpenInviteMember}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-primary/10 hover:text-primary transition"
            title={t('addMember', { defaultValue: 'Thêm thành viên' })}
          >
            <UserPlus className="h-4 w-4" />
          </button>

          {/* More Options Dropdown (...) */}
          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-alt hover:text-text-primary transition"
              title="Options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showOptionsMenu && (
              <div
                className="absolute left-0 top-full z-40 mt-1 w-48 rounded-xl border border-surface-border bg-surface p-1.5 shadow-xl backdrop-blur-md"
                onMouseLeave={() => setShowOptionsMenu(false)}
              >
                <button
                  onClick={handleGoToEdit}
                  className="flex w-full items-center space-x-2 px-3 py-2 text-xs font-medium text-text-primary hover:bg-surface-alt rounded-lg transition"
                >
                  <Edit3 className="h-4 w-4 text-primary" />
                  <span>{t('editWorkspace', { defaultValue: 'Chỉnh sửa Workspace' })}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top Right Action Icons */}
        <div className="flex items-center space-x-1">
          <button className="rounded-lg p-2 text-text-muted hover:bg-surface-alt hover:text-text-primary transition">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-text-muted hover:bg-surface-alt hover:text-text-primary transition">
            <Zap className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-text-muted hover:bg-surface-alt hover:text-text-primary transition">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Tabs Bar */}
      <div className="flex items-center space-x-1 overflow-x-auto pt-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const label = t(tab.labelKey, { defaultValue: tab.defaultLabel });

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 border-b-2 px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-text-secondary hover:border-surface-border hover:text-text-primary'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          );
        })}

        <button
          onClick={() => alert('Add view')}
          className="p-2 text-text-muted hover:text-text-primary transition"
          title="Add view"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
