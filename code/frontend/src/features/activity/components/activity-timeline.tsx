'use client';

import React, { useState } from 'react';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUserActivities, useProjectActivities, useWorkspaceActivities } from '../hooks/use-activity';
import { ActivityItem } from './activity-item';
import { ActivityFilter } from './activity-filter';

interface ActivityTimelineProps {
  projectId?: string;
  workspaceId?: string;
  title?: string;
}

export function ActivityTimeline({ projectId, workspaceId, title = 'Activity Log' }: ActivityTimelineProps) {
  const [page, setPage] = useState(0);
  const [entityType, setEntityType] = useState<string | undefined>(undefined);

  const userQuery = useUserActivities(page, 15, entityType);
  const projectQuery = useProjectActivities(projectId || null, page, 15);
  const workspaceQuery = useWorkspaceActivities(workspaceId || null, page, 15);

  const activeQuery = projectId ? projectQuery : workspaceId ? workspaceQuery : userQuery;

  const { data, isLoading } = activeQuery;
  const activities = data?.items || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-gray-950/40 p-4">
      {/* Header & Filter Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            {title} ({totalElements})
          </h3>
        </div>

        {!projectId && !workspaceId && (
          <ActivityFilter
            selectedType={entityType}
            onSelectType={(type) => {
              setEntityType(type);
              setPage(0);
            }}
          />
        )}
      </div>

      {/* Timeline List */}
      {isLoading ? (
        <div className="space-y-2 py-2">
          <div className="h-14 animate-pulse rounded-xl bg-gray-900/60" />
          <div className="h-14 animate-pulse rounded-xl bg-gray-900/60" />
        </div>
      ) : (
        <div className="space-y-2 pt-1">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}

          {activities.length === 0 && (
            <p className="text-center py-6 text-xs text-gray-500 italic">No recent activity recorded.</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-gray-400">
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded p-1 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={data?.last}
              onClick={() => setPage((p) => p + 1)}
              className="rounded p-1 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
