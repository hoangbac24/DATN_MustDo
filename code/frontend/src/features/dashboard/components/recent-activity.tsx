'use client';

import React from 'react';
import { Activity, CheckCircle2, PlusCircle } from 'lucide-react';
import type { ActivityItemDto } from '../types';

interface RecentActivityProps {
  activities: ActivityItemDto[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 backdrop-blur-md space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white font-heading">Recent Activity</h3>
          <p className="text-[11px] text-gray-400">Latest actions across your workspace tasks</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <p className="py-6 text-center text-xs text-gray-500 italic">No recent activity recorded</p>
      ) : (
        <div className="divide-y divide-white/5 space-y-2">
          {activities.map((act) => {
            const isCompleted = act.type === 'TASK_COMPLETED';
            return (
              <div key={act.id} className="flex items-start space-x-3 pt-2.5">
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <PlusCircle className="h-4 w-4 text-indigo-400" />
                  )}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs font-semibold text-white truncate">{act.title}</p>
                  <p className="text-[10px] text-gray-400 truncate">{act.description}</p>
                </div>
                <span className="text-[10px] text-gray-500 font-mono shrink-0">
                  {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
