'use client';

import React from 'react';
import { MousePointer, StickyNote, Square, Circle, ArrowUpRight, Trash2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { WhiteboardElementType } from '../types';

interface WhiteboardToolbarProps {
  activeTool: 'SELECT' | WhiteboardElementType;
  onSelectTool: (tool: 'SELECT' | WhiteboardElementType) => void;
  onDeleteSelected?: () => void;
  onSaveCanvas: () => void;
  isSaving?: boolean;
}

export function WhiteboardToolbar({
  activeTool,
  onSelectTool,
  onDeleteSelected,
  onSaveCanvas,
  isSaving,
}: WhiteboardToolbarProps) {
  const { t } = useTranslation('whiteboard');
  const { t: tCommon } = useTranslation('common');

  const tools: { id: 'SELECT' | WhiteboardElementType; labelKey: string; icon: React.ElementType }[] = [
    { id: 'SELECT', labelKey: 'tools.select', icon: MousePointer },
    { id: 'STICKY_NOTE', labelKey: 'tools.stickyNote', icon: StickyNote },
    { id: 'SHAPE_RECT', labelKey: 'tools.rectangle', icon: Square },
    { id: 'SHAPE_CIRCLE', labelKey: 'tools.circle', icon: Circle },
    { id: 'CONNECTOR', labelKey: 'tools.line', icon: ArrowUpRight },
  ];

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 rounded-2xl border border-white/10 bg-[#111827]/80 p-2 shadow-2xl backdrop-blur-md">
      {tools.map((item) => {
        const Icon = item.icon;
        const isActive = activeTool === item.id;
        const label = t(item.labelKey);
        return (
          <button
            key={item.id}
            onClick={() => onSelectTool(item.id)}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title={label}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{label}</span>
          </button>
        );
      })}

      <div className="h-4 w-px bg-white/10" />

      {onDeleteSelected && (
        <button
          onClick={onDeleteSelected}
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition"
          title={tCommon('actions.delete')}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <button
        onClick={onSaveCanvas}
        disabled={isSaving}
        className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50 transition"
      >
        <Save className="h-4 w-4" />
        <span>{tCommon('actions.save')}</span>
      </button>
    </div>
  );
}
