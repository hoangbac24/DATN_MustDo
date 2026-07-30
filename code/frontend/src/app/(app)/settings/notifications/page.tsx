'use client';

import React, { useState } from 'react';
import { Bell, Mail, Monitor, Check } from 'lucide-react';
import { useSettingsStore } from '@/store/settings-store';
import { useUpdateUserSettings } from '@/features/user/hooks/use-settings';

export default function NotificationsPage() {
  const currentSettings = useSettingsStore();
  const updateSettingsMutation = useUpdateUserSettings();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggle = (key: string, value: boolean) => {
    setSuccessMsg(null);
    updateSettingsMutation.mutate(
      { [key]: value },
      {
        onSuccess: () => {
          setSuccessMsg('Notification preference updated!');
          setTimeout(() => setSuccessMsg(null), 2500);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {successMsg && (
        <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
          <Check className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-6">
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white font-heading">Notification Preferences</h2>
            <p className="text-[11px] text-gray-400">Manage how you receive alerts and task updates</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <p className="text-xs font-semibold text-white">Email Notifications</p>
              <p className="text-[11px] text-gray-400">Receive email alerts when tasks are assigned or updated</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications', !currentSettings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentSettings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  currentSettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Desktop Alerts */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <p className="text-xs font-semibold text-white">Desktop Push Alerts</p>
              <p className="text-[11px] text-gray-400">Show browser pop-up notifications for overdue tasks</p>
            </div>
            <button
              onClick={() => handleToggle('desktopNotifications', !currentSettings.desktopNotifications)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentSettings.desktopNotifications ? 'bg-indigo-600' : 'bg-gray-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  currentSettings.desktopNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Weekly Digest */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Weekly Productivity Digest</p>
              <p className="text-[11px] text-gray-400">Receive a weekly summary email of completed task statistics</p>
            </div>
            <button
              onClick={() => handleToggle('weeklyDigest', !currentSettings.weeklyDigest)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentSettings.weeklyDigest ? 'bg-indigo-600' : 'bg-gray-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  currentSettings.weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
