'use client';

import React, { useState } from 'react';
import { X, History, Clock, FileText } from 'lucide-react';
import type { WikiPageVersionDto } from '../types';

interface VersionHistoryDialogProps {
  versions: WikiPageVersionDto[];
  isOpen: boolean;
  onClose: () => void;
}

export function VersionHistoryDialog({ versions, isOpen, onClose }: VersionHistoryDialogProps) {
  const [selectedVersion, setSelectedVersion] = useState<WikiPageVersionDto | null>(null);

  if (!isOpen) return null;

  const activeVersion = selectedVersion || versions[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white font-heading">Version History Snapshots</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex h-[400px] overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {/* Left Version List */}
          <div className="w-56 shrink-0 border-r border-white/10 bg-[#111827]/80 overflow-y-auto p-2 divide-y divide-white/5">
            {versions.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVersion(v)}
                className={`p-2.5 rounded-xl cursor-pointer transition text-xs ${
                  activeVersion?.id === v.id
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Version {v.version}</span>
                  <div className="flex items-center space-x-1 text-[10px] text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-gray-400 truncate">{v.changeSummary || 'Edit'}</p>
              </div>
            ))}
          </div>

          {/* Right Snapshot Content View */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeVersion ? (
              <div className="space-y-3">
                <div className="border-b border-white/10 pb-2">
                  <h4 className="text-sm font-bold text-white font-heading">{activeVersion.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Saved on {new Date(activeVersion.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                  {activeVersion.content || <span className="text-gray-500 italic">Empty content</span>}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-500">
                Select a version to inspect snapshot
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
