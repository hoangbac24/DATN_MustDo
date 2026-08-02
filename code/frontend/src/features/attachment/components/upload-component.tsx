'use client';

import React, { useRef, useState } from 'react';
import { Paperclip, Loader2 } from 'lucide-react';
import { useUploadAttachment } from '../hooks/use-attachment';

interface UploadComponentProps {
  taskId: string;
  maxSizeBytes?: number; // Default 10MB
}

export function UploadComponent({ taskId, maxSizeBytes = 10485760 }: UploadComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const uploadMutation = useUploadAttachment(taskId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeBytes) {
      const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      setErrorMsg(`File exceeds max limit of ${maxMb}MB`);
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      onError: (err: any) => {
        setErrorMsg(err?.response?.data?.message || 'Failed to upload file');
      },
    });
  };

  return (
    <div className="space-y-1">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id={`file-upload-${taskId}`}
      />

      <label
        htmlFor={`file-upload-${taskId}`}
        className={`inline-flex items-center space-x-1.5 rounded-lg border border-white/10 bg-gray-900/60 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-indigo-500/50 hover:text-white transition cursor-pointer ${
          uploadMutation.isPending ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {uploadMutation.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
        ) : (
          <Paperclip className="h-3.5 w-3.5 text-indigo-400" />
        )}
        <span>{uploadMutation.isPending ? 'Uploading...' : 'Attach File'}</span>
      </label>

      {errorMsg && <p className="text-[10px] text-red-400 font-medium">{errorMsg}</p>}
    </div>
  );
}
