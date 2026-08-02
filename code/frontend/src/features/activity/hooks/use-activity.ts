import { useQuery } from '@tanstack/react-query';
import { activityService } from '../services/activity-service';

export const ACTIVITY_QUERY_KEYS = {
  user: (page: number, entityType?: string) => ['user-activities', page, entityType] as const,
  project: (projectId: string, page: number) => ['project-activities', projectId, page] as const,
  workspace: (workspaceId: string, page: number) => ['workspace-activities', workspaceId, page] as const,
};

export function useUserActivities(page = 0, size = 20, entityType?: string) {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.user(page, entityType),
    queryFn: () => activityService.getUserActivities(page, size, entityType),
  });
}

export function useProjectActivities(projectId: string | null, page = 0, size = 20) {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.project(projectId || '', page),
    queryFn: () => activityService.getProjectActivities(projectId!, page, size),
    enabled: !!projectId,
  });
}

export function useWorkspaceActivities(workspaceId: string | null, page = 0, size = 20) {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.workspace(workspaceId || '', page),
    queryFn: () => activityService.getWorkspaceActivities(workspaceId!, page, size),
    enabled: !!workspaceId,
  });
}
