'use client';

import React from 'react';
import { Bell, MessageSquare, CheckSquare, Tag, Info, Check, Trash2 } from 'lucide-react';
import type { NotificationDto, NotificationType } from '../types';

interface NotificationItemProps {
  notification: NotificationDto;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  onClick,
}: NotificationItemProps) {
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'REMINDER_TRIGGERED':
        return <Bell className="h-4 w-4 text-amber-400" />;
      case 'COMMENT_ADDED':
        return <MessageSquare className="h-4 w-4 text-indigo-400" />;
      case 'TASK_ASSIGNED':
      case 'TASK_DUE':
        return <CheckSquare className="h-4 w-4 text-emerald-400" />;
      case 'TAG_ADDED':
        return <Tag className="h-4 w-4 text-purple-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const formattedDate = notification.createdAt
    ? new Date(notification.createdAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-start space-x-3 rounded-xl border p-3 text-xs transition cursor-pointer ${
        !notification.isRead
          ? 'border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-950/40'
          : 'border-white/5 bg-gray-900/40 hover:bg-gray-900/70'
      }`}
    >
      {/* Icon Container */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
        {getTypeIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center justify-between">
          <h4 className={`font-semibold truncate ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-gray-500 shrink-0 ml-2">{formattedDate}</span>
        </div>
        <p className="text-gray-400 line-clamp-2 text-[11px] leading-relaxed">{notification.message}</p>
      </div>

      {/* Status Dot & Controls */}
      <div className="flex items-center space-x-1 shrink-0 pt-0.5">
        {!notification.isRead && (
          <span className="h-2 w-2 rounded-full bg-indigo-500" title="Unread" />
        )}

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notification.isRead && onMarkRead && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead(notification.id);
              }}
              className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-indigo-400"
              title="Mark as read"
            >
              <Check className="h-3 w-3" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="rounded p-1 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
              title="Delete notification"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
