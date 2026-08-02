'use client';

import React from 'react';
import { CheckSquare, FolderKanban, LayoutGrid, MessageSquare, Tag, Activity } from 'lucide-react';
import type { ActivityEntityType, ActivityLogDto } from '../types';

interface ActivityItemProps {
  activity: ActivityLogDto;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const userName = activity.user?.fullName || 'TaskFlow User';
  const initial = userName.charAt(0).toUpperCase();

  const formatRelativeTime = (isoStr: string) => {
    if (!isoStr) return '';
    const now = new Date();
    const past = new Date(isoStr);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  };

  const getEntityIcon = (type: ActivityEntityType) => {
    switch (type) {
      case 'TASK':
        return <CheckSquare className="h-3.5 w-3.5 text-indigo-400" />;
      case 'PROJECT':
        return <FolderKanban className="h-3.5 w-3.5 text-emerald-400" />;
      case 'WORKSPACE':
        return <LayoutGrid className="h-3.5 w-3.5 text-purple-400" />;
      case 'COMMENT':
        return <MessageSquare className="h-3.5 w-3.5 text-blue-400" />;
      case 'TAG':
        return <Tag className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 rounded-xl border border-white/5 bg-gray-900/40 p-3 text-xs transition hover:border-white/10 hover:bg-gray-900/70">
      {/* User Avatar */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600/30 text-indigo-400 font-bold text-xs border border-indigo-500/20">
        {activity.user?.avatarUrl ? (
          <img src={activity.user.avatarUrl} alt={userName} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="font-bold text-white truncate">{userName}</span>
            <span className="text-gray-400">{activity.action.toLowerCase().replace('_', ' ')}</span>
            <div className="flex items-center space-x-1 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-300 font-medium">
              {getEntityIcon(activity.entityType)}
              <span className="uppercase">{activity.entityType}</span>
            </div>
          </div>

          <span className="text-[10px] text-gray-500 shrink-0 ml-2">
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>

        {activity.details && (
          <p className="text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed">
            {activity.details}
          </p>
        )}
      </div>
    </div>
  );
}
