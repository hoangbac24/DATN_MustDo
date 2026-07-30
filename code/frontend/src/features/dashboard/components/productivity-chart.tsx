'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { ProductivityStatsDto } from '../types';

interface ProductivityChartProps {
  stats: ProductivityStatsDto[];
}

export function ProductivityChart({ stats }: ProductivityChartProps) {
  const maxVal = Math.max(...stats.map((s) => Math.max(s.completedCount, s.createdCount, 1)));

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-heading">Productivity Summary</h3>
            <p className="text-[11px] text-gray-400">Daily completed vs created tasks (Last 7 Days)</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-gray-300">Completed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span className="text-gray-300">Created</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 pt-6 pb-2 items-end h-44">
        {stats.map((s) => {
          const completedHeight = Math.round((s.completedCount / maxVal) * 100);
          const createdHeight = Math.round((s.createdCount / maxVal) * 100);
          const dateLabel = new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <div key={s.date} className="flex flex-col items-center space-y-2 h-full justify-end">
              <div className="flex items-end space-x-1 h-32 w-full justify-center">
                <div
                  style={{ height: `${Math.max(completedHeight, 8)}%` }}
                  className="w-3 rounded-t bg-emerald-500 transition-all duration-500"
                  title={`Completed: ${s.completedCount}`}
                />
                <div
                  style={{ height: `${Math.max(createdHeight, 8)}%` }}
                  className="w-3 rounded-t bg-indigo-500 transition-all duration-500"
                  title={`Created: ${s.createdCount}`}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-400">{dateLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
