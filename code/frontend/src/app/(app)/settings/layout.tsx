'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Sliders, Shield, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation('settings');

  const settingsTabs = [
    { name: t('tabs.profile'), href: '/settings', icon: User },
    { name: t('tabs.preferences'), href: '/settings/preferences', icon: Sliders },
    { name: t('tabs.security'), href: '/settings/security', icon: Shield },
    { name: t('tabs.notifications'), href: '/settings/notifications', icon: Bell },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="border-b border-surface-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-text-primary font-heading">
          {t('title')}
        </h1>
        <p className="text-xs text-text-secondary mt-1">{t('subtitle')}</p>
      </div>

      {/* Settings Navigation Bar */}
      <div className="flex border-b border-surface-border overflow-x-auto space-x-1">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href as any}
              className={`flex items-center space-x-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
                isActive
                  ? 'border-primary text-primary bg-menu-active rounded-t-xl font-bold shadow-xs'
                  : 'border-transparent text-text-secondary hover:border-surface-border hover:text-text-primary'
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
