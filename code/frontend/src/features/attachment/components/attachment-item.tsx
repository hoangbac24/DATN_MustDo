'use client';

import React from 'react';
import { FileText, Image as ImageIcon, FileArchive, Download, Trash2, Eye } from 'lucide-react';
import type { AttachmentDto } from '../types';

interface AttachmentItemProps {
  attachment: AttachmentDto;
  onPreview?: (attachment: AttachmentDto) => void;
  onDelete: (id: string) => void;
}

export function AttachmentItem({ attachment, onPreview, onDelete }: AttachmentItemProps) {
  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isImage = attachment.mimeType?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(attachment.fileExtension?.toLowerCase() || '');

  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="h-4 w-4 text-emerald-400" />;
    if (attachment.fileExtension === 'zip' || attachment.fileExtension === 'rar') {
      return <FileArchive className="h-4 w-4 text-amber-400" />;
    }
    return <FileText className="h-4 w-4 text-indigo-400" />;
  };

  return (
    <div className="group flex items-center justify-between rounded-xl border border-white/5 bg-gray-900/40 p-2.5 text-xs transition hover:border-white/10 hover:bg-gray-900/70">
      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
          {getFileIcon()}
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="font-semibold text-white truncate text-xs">{attachment.fileName}</p>
          <p className="text-[10px] text-gray-500">{formatBytes(attachment.fileSize)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-1 ml-2">
        {isImage && onPreview && (
          <button
            type="button"
            onClick={() => onPreview(attachment)}
            className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-indigo-400 transition"
            title="Preview image"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}

        <a
          href={attachment.fileUrl}
          download={attachment.fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white transition"
          title="Download file"
        >
          <Download className="h-3.5 w-3.5" />
        </a>

        <button
          type="button"
          onClick={() => onDelete(attachment.id)}
          className="rounded p-1 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition"
          title="Delete attachment"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
