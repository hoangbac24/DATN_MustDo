'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Sliders, Shield, Bell } from 'lucide-react';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const settingsTabs = [
    { name: 'Profile & Account', href: '/settings', icon: User },
    { name: 'Preferences', href: '/settings/preferences', icon: Sliders },
    { name: 'Security', href: '/settings/security', icon: Shield },
    { name: 'Notifications', href: '/settings/notifications', icon: Bell },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-heading">
          Settings & Preferences
        </h1>
        <p className="text-xs text-gray-400">Manage your profile, workspace preferences, theme, and security settings</p>
      </div>

      {/* Settings Navigation Bar */}
      <div className="flex border-b border-white/10 overflow-x-auto space-x-1">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href as any}
              className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
                  : 'border-transparent text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">{children}</div>
    </div>
  );
}
