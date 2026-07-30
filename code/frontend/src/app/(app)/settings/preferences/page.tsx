'use client';

import React, { useState } from 'react';
import { Check, Loader2, Moon, Sun, Monitor, Globe, Clock, Calendar } from 'lucide-react';
import { useSettingsStore } from '@/store/settings-store';
import { useUpdateUserSettings } from '@/features/user/hooks/use-settings';

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark Mode', icon: Moon },
  { value: 'light', label: 'Light Mode', icon: Sun },
  { value: 'system', label: 'System Default', icon: Monitor },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English (US)' },
  { value: 'vi', label: 'Tiếng Việt (Vietnamese)' },
];

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: '(UTC+00:00) UTC' },
  { value: 'Asia/Ho_Chi_Minh', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'America/New_York', label: '(UTC-05:00) Eastern Time (US & Canada)' },
  { value: 'Europe/London', label: '(UTC+00:00) London, Edinburgh' },
];

const DATE_FORMAT_OPTIONS = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-07-30)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (30/07/2026)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (07/30/2026)' },
];

export default function PreferencesPage() {
  const currentSettings = useSettingsStore();
  const updateSettingsMutation = useUpdateUserSettings();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = (key: string, value: any) => {
    setSuccessMsg(null);
    updateSettingsMutation.mutate(
      { [key]: value },
      {
        onSuccess: () => {
          setSuccessMsg('Preference updated successfully!');
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

      {/* Theme Switcher */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white font-heading">Appearance Theme</h2>
          <p className="text-[11px] text-gray-400">Select interface color scheme</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {THEME_OPTIONS.map((t) => {
            const Icon = t.icon;
            const isSelected = currentSettings.theme === t.value;

            return (
              <button
                key={t.value}
                onClick={() => handleSave('theme', t.value)}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 transition ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-400 font-semibold'
                    : 'border-white/10 bg-gray-900/60 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-6 w-6 mb-2" />
                <span className="text-xs">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regional & Timezone Preferences */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-white font-heading">Language & Region</h2>
          <p className="text-[11px] text-gray-400">Configure language, timezone, and date format</p>
        </div>

        <div className="space-y-4">
          {/* Language Switch */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-indigo-400" />
              <div>
                <p className="text-xs font-medium text-white">Language</p>
                <p className="text-[11px] text-gray-400">Select application language</p>
              </div>
            </div>

            <select
              value={currentSettings.language}
              onChange={(e) => handleSave('language', e.target.value)}
              className="rounded-xl border border-white/10 bg-gray-900/60 px-3 py-2 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <div>
                <p className="text-xs font-medium text-white">Timezone</p>
                <p className="text-[11px] text-gray-400">Set local timezone for task due dates</p>
              </div>
            </div>

            <select
              value={currentSettings.timezone}
              onChange={(e) => handleSave('timezone', e.target.value)}
              className="rounded-xl border border-white/10 bg-gray-900/60 px-3 py-2 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Format */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-xs font-medium text-white">Date Format</p>
                <p className="text-[11px] text-gray-400">Choose date display format</p>
              </div>
            </div>

            <select
              value={currentSettings.dateFormat}
              onChange={(e) => handleSave('dateFormat', e.target.value)}
              className="rounded-xl border border-white/10 bg-gray-900/60 px-3 py-2 text-xs text-white transition focus:border-indigo-500 focus:outline-none"
            >
              {DATE_FORMAT_OPTIONS.map((df) => (
                <option key={df.value} value={df.value}>
                  {df.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
