'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCreateWorkspace } from '../hooks/use-workspace';

const createWorkspaceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkspaceDialog({ isOpen, onClose }: CreateWorkspaceDialogProps) {
  const { t } = useTranslation('workspace');
  const { t: tCommon } = useTranslation('common');
  const { t: tVal } = useTranslation('validation');
  const createMutation = useCreateWorkspace();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  if (!isOpen) return null;

  const onSubmit = (data: CreateWorkspaceFormData) => {
    setErrorMessage(null);
    createMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (err: any) => {
          setErrorMessage(err.response?.data?.message || tCommon('messages.genericError'));
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl text-text-primary">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-text-primary font-heading">{t('createModalTitle')}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-surface-alt hover:text-text-primary transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-lg border border-status-error/30 bg-status-error/10 p-3 text-xs text-status-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">{t('nameLabel')}</label>
            <input
              {...register('name')}
              type="text"
              placeholder={t('namePlaceholder')}
              className="w-full rounded-lg border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none"
            />
            {errors.name && (
              <p className="text-[11px] text-status-error">
                {tVal('minName', { min: 2 })}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">{t('descriptionLabel')}</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder={t('descriptionPlaceholder')}
              className="w-full rounded-lg border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 border-t border-surface-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-surface-border px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-alt"
            >
              {tCommon('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('createWorkspace')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
