'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle2, Loader2, Users, ArrowRight } from 'lucide-react';
import { useGetInvitation, useAcceptInvitation } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/store/auth-store';

export default function AcceptInvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: invitation, isLoading, isError } = useGetInvitation(token);
  const acceptMutation = useAcceptInvitation();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAccept = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/invite/${token}` as any);
      return;
    }

    setErrorMsg(null);
    acceptMutation.mutate(token, {
      onSuccess: () => {
        router.push('/workspaces' as any);
      },
      onError: (err: any) => {
        setErrorMsg(err.response?.data?.message || 'Failed to accept invitation');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (isError || !invitation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#090d16] p-4 text-white">
        <div className="w-full max-w-md space-y-4 rounded-3xl border border-red-500/20 bg-gray-900/80 p-8 text-center backdrop-blur-xl">
          <h2 className="text-xl font-bold text-red-400 font-heading">Invalid or Expired Link</h2>
          <p className="text-xs text-gray-400">
            This workspace invitation link is invalid or has expired. Please ask the workspace owner to send a new invite link.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090d16] p-4 text-white">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-gray-900/80 p-8 text-center backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 shadow-xl border border-indigo-500/30">
          <Users className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white font-heading">You&apos;re Invited!</h1>
          <p className="text-xs text-gray-400">
            You have been invited to join a workspace on <strong className="text-white">TaskFlow</strong>.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-gray-950/60 p-4 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Invited Email</span>
            <span className="font-semibold text-white">{invitation.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Assigned Role</span>
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400 capitalize">
              {invitation.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleAccept}
          disabled={acceptMutation.isPending}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:opacity-50 active:scale-[0.98]"
        >
          {acceptMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Join Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
