'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Shield, Lock, Laptop } from 'lucide-react';
import { useChangePassword } from '@/features/auth/hooks/use-auth';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function SecurityPage() {
  const changePasswordMutation = useChangePassword();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          setSuccessMsg('Password updated successfully!');
          reset();
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Failed to update password.');
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Change Password */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white font-heading">Change Password</h2>
            <p className="text-[11px] text-gray-400">Ensure your account uses a strong, unique password</p>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Current Password</label>
            <input
              {...register('currentPassword')}
              type="password"
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            />
            {errors.currentPassword && <p className="text-[11px] text-red-400">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">New Password</label>
            <input
              {...register('newPassword')}
              type="password"
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            />
            {errors.newPassword && <p className="text-[11px] text-red-400">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Confirm New Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 p-2.5 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            />
            {errors.confirmPassword && <p className="text-[11px] text-red-400">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {changePasswordMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Active Sessions Overview Structure */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
            <Laptop className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white font-heading">Active Sessions</h2>
            <p className="text-[11px] text-gray-400">Devices currently logged into your TaskFlow account</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-gray-900/40 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Laptop className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="text-xs font-semibold text-white">Current Web Browser Session</p>
              <p className="text-[10px] text-gray-400">JWT Token Security • Active Now</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
            Current Device
          </span>
        </div>
      </div>
    </div>
  );
}
