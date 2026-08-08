'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, User, Mail, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth-store';
import { useUpdateProfile } from '@/features/auth/hooks/use-auth';

const profileSchema = z.object({
  fullName: z.string().min(2),
  avatarUrl: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const { t } = useTranslation('settings');
  const { t: tVal } = useTranslation('validation');
  const user = useAuthStore((state) => state.user);
  const updateProfileMutation = useUpdateProfile();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.fullName || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    updateProfileMutation.mutate(
      {
        fullName: data.fullName,
        avatarUrl: data.avatarUrl || undefined,
      },
      {
        onSuccess: () => {
          setSuccessMsg(t('profile.successMsg'));
          setTimeout(() => setSuccessMsg(null), 3000);
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || t('profile.errorMsg'));
        },
      }
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Profile Form */}
      <div className="md:col-span-2 rounded-2xl border border-surface-border bg-surface p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 border-b border-surface-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary font-heading">{t('profile.title')}</h2>
            <p className="text-[11px] text-text-secondary">{t('profile.subtitle')}</p>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center space-x-2 rounded-lg border border-status-success/30 bg-status-success/10 p-3 text-xs text-status-success">
            <Check className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-lg border border-status-error/30 bg-status-error/10 p-3 text-xs text-status-error">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">{t('profile.emailLabel')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full rounded-lg border border-surface-border bg-surface-alt pl-9 pr-3 py-2.5 text-xs text-text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">{t('profile.fullNameLabel')}</label>
            <input
              {...register('fullName')}
              type="text"
              className="w-full rounded-lg border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none"
            />
            {errors.fullName && (
              <p className="text-[11px] text-status-error">
                {tVal('minName', { min: 2 })}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">{t('profile.avatarLabel')}</label>
            <input
              {...register('avatarUrl')}
              type="text"
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-lg border border-surface-border bg-surface-alt p-2.5 text-xs text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover active:scale-95 disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t('profile.saveBtn')
            )}
          </button>
        </form>
      </div>

      {/* Account Badge Card */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-xs space-y-4 h-fit">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-md">
            {user?.fullName?.substring(0, 1).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary font-heading">{user?.fullName}</h3>
            <p className="text-xs text-text-secondary">{user?.email}</p>
          </div>

          <div className="flex items-center space-x-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary border border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t('profile.badgeTitle')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
