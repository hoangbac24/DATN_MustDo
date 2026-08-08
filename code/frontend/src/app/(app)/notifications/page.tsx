'use client';

import React, { useState } from 'react';
import { Bell, CheckCheck, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/features/notification/hooks/use-notification';
import { NotificationItem } from '@/features/notification/components/notification-item';

import { NotificationListSkeleton } from '@/components/ui/skeletons/notification-list-skeleton';
import { EmptyState } from '@/components/ui/empty-state';

export default function NotificationsPage() {
  const [page, setPage] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const router = useRouter();

  const { data, isLoading } = useNotifications(page, 15, unreadOnly);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.items || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  const handleNotificationClick = (id: string, link?: string, isRead?: boolean) => {
    if (!isRead) {
      markRead.mutate(id);
    }
    if (link) {
      router.push(link as any);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-heading">Notifications</h1>
            <p className="text-xs text-gray-400">Manage your system updates, reminders, and activity alerts</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => markAllRead.mutate()}
          className="flex items-center space-x-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition"
        >
          <CheckCheck className="h-4 w-4 text-indigo-400" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs & Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 rounded-xl border border-white/10 bg-gray-950/60 p-1">
          <button
            type="button"
            onClick={() => {
              setUnreadOnly(false);
              setPage(0);
            }}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              !unreadOnly
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              setUnreadOnly(true);
              setPage(0);
            }}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              unreadOnly
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Unread Only
          </button>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>
              Page {page + 1} of {totalPages} ({totalElements} total)
            </span>
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-lg p-1.5 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={data?.last}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg p-1.5 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Notification List */}
      {isLoading ? (
        <NotificationListSkeleton count={4} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="You're all caught up!"
          description={unreadOnly ? 'No unread notifications at the moment.' : 'No new notifications to display right now.'}
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={(id) => markRead.mutate(id)}
              onDelete={(id) => deleteNotification.mutate(id)}
              onClick={() => handleNotificationClick(notification.id, notification.link, notification.isRead)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
