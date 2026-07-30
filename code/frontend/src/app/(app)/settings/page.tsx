'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, User, Mail, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useUpdateProfile } from '@/features/auth/hooks/use-auth';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  avatarUrl: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
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
          setSuccessMsg('Profile updated successfully!');
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
        },
      }
    );
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Profile Form */}
      <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white font-heading">Personal Information</h2>
            <p className="text-[11px] text-gray-400">Update your public display name and avatar URL</p>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <Check className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Email Address (Read-only)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full rounded-lg border border-white/10 bg-gray-900/40 pl-9 pr-3 py-2.5 text-xs text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Full Name</label>
            <input
              {...register('fullName')}
              type="text"
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            />
            {errors.fullName && <p className="text-[11px] text-red-400">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Avatar Image URL (Optional)</label>
            <input
              {...register('avatarUrl')}
              type="text"
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Save Profile'
            )}
          </button>
        </form>
      </div>

      {/* Account Badge Card */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-4 h-fit">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-xl">
            {user?.fullName?.substring(0, 1).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">{user?.fullName}</h3>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>

          <div className="flex items-center space-x-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Authenticated User</span>
          </div>
        </div>
      </div>
    </div>
  );
}
