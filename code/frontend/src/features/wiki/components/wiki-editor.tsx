'use client';

import React, { useState } from 'react';
import { Eye, Edit3, Save, History, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { WikiPageDto, UpdateWikiPagePayload } from '../types';

interface WikiEditorProps {
  page: WikiPageDto;
  onSave: (payload: UpdateWikiPagePayload) => void;
  onDelete: (pageId: string) => void;
  onOpenVersions: () => void;
  isSaving?: boolean;
}

export function WikiEditor({
  page,
  onSave,
  onDelete,
  onOpenVersions,
  isSaving,
}: WikiEditorProps) {
  const { t } = useTranslation('wiki');
  const { t: tCommon } = useTranslation('common');
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content || '');
  const [changeSummary, setChangeSummary] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  React.useEffect(() => {
    setTitle(page.title);
    setContent(page.content || '');
  }, [page]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      content,
      changeSummary: changeSummary.trim() || 'Updated content',
    });
    setChangeSummary('');
  };

  return (
    <div className="flex-1 space-y-4 rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md">
      {/* Editor Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('pageTitlePlaceholder')}
          className="bg-transparent text-xl font-extrabold text-white font-heading focus:outline-none placeholder-gray-600"
        />

        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center rounded-xl border border-white/10 bg-[#111827]/70 p-1">
            <button
              onClick={() => setMode('edit')}
              className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                mode === 'edit' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{tCommon('actions.edit')}</span>
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                mode === 'preview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{tCommon('actions.view')}</span>
            </button>
          </div>

          <button
            onClick={onOpenVersions}
            className="flex items-center space-x-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-white/10"
            title={t('versionHistory')}
          >
            <History className="h-3.5 w-3.5 text-indigo-400" />
            <span>v{page.version}</span>
          </button>

          <button
            onClick={() => onDelete(page.id)}
            className="rounded-xl border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20"
            title={tCommon('actions.delete')}
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{tCommon('actions.save')}</span>
          </button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      {mode === 'edit' ? (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write markdown documentation here..."
            className="min-h-[400px] w-full resize-y rounded-xl border border-white/10 bg-white/5 p-4 text-xs font-mono text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />

          <input
            type="text"
            value={changeSummary}
            onChange={(e) => setChangeSummary(e.target.value)}
            placeholder="Edit summary..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      ) : (
        <div className="min-h-[400px] rounded-xl border border-white/10 bg-white/5 p-6 text-xs text-gray-200 whitespace-pre-wrap font-sans">
          {content || <span className="text-gray-500 italic">{tCommon('emptyState.description')}</span>}
        </div>
      )}
    </div>
  );
}
