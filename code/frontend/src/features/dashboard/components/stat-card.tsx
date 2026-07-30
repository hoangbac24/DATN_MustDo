'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  badgeColor?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, badgeColor = 'bg-indigo-500/20 text-indigo-400' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md transition hover:border-white/20 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">{title}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${badgeColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-white font-heading">{value}</p>
      <p className="mt-1 text-[11px] text-gray-400">{subtitle}</p>
    </div>
  );
}
