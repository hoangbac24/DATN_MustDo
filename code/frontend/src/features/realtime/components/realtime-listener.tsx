'use client';

import React, { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRealtimeConnection, useProjectTaskRealtime } from '../hooks/use-realtime';
import type { RealtimeEvent } from '../types';

interface RealtimeListenerProps {
  projectId?: string;
  children?: React.ReactNode;
}

export function RealtimeListener({ projectId, children }: RealtimeListenerProps) {
  const queryClient = useQueryClient();

  useRealtimeConnection();

  const handleTaskEvent = useCallback(
    (event: RealtimeEvent) => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        queryClient.invalidateQueries({ queryKey: ['timeline', 'project', projectId] });
        queryClient.invalidateQueries({ queryKey: ['board', 'project', projectId] });
      }
    },
    [projectId, queryClient]
  );

  useProjectTaskRealtime(projectId || '', handleTaskEvent);

  return <>{children}</>;
}
