'use client';

import React from 'react';
import { Activity, CheckCircle2, PlusCircle } from 'lucide-react';
import type { ActivityItemDto } from '../types';

interface RecentActivityProps {
  activities: ActivityItemDto[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-5 shadow-sm space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary font-heading">Recent Activity</h3>
          <p className="text-[11px] text-text-secondary">Latest actions across your workspace tasks</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <p className="py-6 text-center text-xs text-text-muted italic">No recent activity recorded</p>
      ) : (
        <div className="divide-y divide-surface-border space-y-2">
          {activities.map((act) => {
            const isCompleted = act.type === 'TASK_COMPLETED';
            return (
              <div key={act.id} className="flex items-start space-x-3 pt-2.5">
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-status-success" />
                  ) : (
                    <PlusCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs font-semibold text-text-primary truncate">{act.title}</p>
                  <p className="text-[10px] text-text-secondary truncate">{act.description}</p>
                </div>
                <span className="text-[10px] text-text-muted font-mono shrink-0">
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
