'use client';

import React, { useState } from 'react';
import { X, UserPlus, Mail, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { InviteMemberPayload, WorkspaceRole } from '../types';

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: InviteMemberPayload) => void;
  isLoading?: boolean;
}

export function InviteDialog({ isOpen, onClose, onSubmit, isLoading }: InviteDialogProps) {
  const { t } = useTranslation('team');
  const { t: tCommon } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceRole>('MEMBER');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    onSubmit({ email: email.trim(), role });
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white font-heading">{t('inviteModalTitle')}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300">{t('emailLabel')}</label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300">{t('roleLabel')}</label>
            <div className="relative mt-1.5">
              <Shield className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="MEMBER" className="bg-[#111827]">{t('roles.MEMBER')}</option>
                <option value="ADMIN" className="bg-[#111827]">{t('roles.ADMIN')}</option>
                <option value="OWNER" className="bg-[#111827]">{t('roles.OWNER')}</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10"
            >
              {tCommon('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              <span>{t('actions.sendInvite')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
