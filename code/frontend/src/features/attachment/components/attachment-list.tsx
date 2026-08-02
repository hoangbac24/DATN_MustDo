'use client';

import React, { useState } from 'react';
import { Paperclip } from 'lucide-react';
import type { AttachmentDto } from '../types';
import { useTaskAttachments, useDeleteAttachment } from '../hooks/use-attachment';
import { UploadComponent } from './upload-component';
import { AttachmentItem } from './attachment-item';
import { AttachmentPreviewModal } from './attachment-preview-modal';

interface AttachmentListProps {
  taskId: string;
}

export function AttachmentList({ taskId }: AttachmentListProps) {
  const { data: attachments = [], isLoading } = useTaskAttachments(taskId);
  const deleteAttachment = useDeleteAttachment(taskId);

  const [previewAttachment, setPreviewAttachment] = useState<AttachmentDto | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (attachment: AttachmentDto) => {
    setPreviewAttachment(attachment);
    setIsPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAttachment.mutate(id);
  };

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-gray-950/40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Paperclip className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Attachments ({attachments.length})
          </h3>
        </div>

        <UploadComponent taskId={taskId} />
      </div>

      {isLoading ? (
        <div className="h-10 animate-pulse rounded-lg bg-gray-900/60" />
      ) : (
        <div className="space-y-2 pt-1">
          {attachments.map((attachment) => (
            <AttachmentItem
              key={attachment.id}
              attachment={attachment}
              onPreview={handlePreview}
              onDelete={handleDelete}
            />
          ))}

          {attachments.length === 0 && (
            <p className="text-center py-2 text-xs text-gray-500 italic">No attachments added to this task.</p>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      <AttachmentPreviewModal
        attachment={previewAttachment}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
