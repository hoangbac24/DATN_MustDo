import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type {
  ActivityLogDto,
  CreateActivityLogInput,
  PaginatedActivitiesResponse,
} from '../types';

export const activityService = {
  getUserActivities: async (
    page = 0,
    size = 20,
    entityType?: string
  ): Promise<PaginatedActivitiesResponse> => {
    const res = await apiClient.get<ApiResponse<PaginatedActivitiesResponse>>('/activities', {
      params: { page, size, entityType },
    });
    return res.data.data;
  },

  getProjectActivities: async (
    projectId: string,
    page = 0,
    size = 20
  ): Promise<PaginatedActivitiesResponse> => {
    const res = await apiClient.get<ApiResponse<PaginatedActivitiesResponse>>(`/projects/${projectId}/activities`, {
      params: { page, size },
    });
    return res.data.data;
  },

  getWorkspaceActivities: async (
    workspaceId: string,
    page = 0,
    size = 20
  ): Promise<PaginatedActivitiesResponse> => {
    const res = await apiClient.get<ApiResponse<PaginatedActivitiesResponse>>(`/workspaces/${workspaceId}/activities`, {
      params: { page, size },
    });
    return res.data.data;
  },

  logActivity: async (data: CreateActivityLogInput): Promise<ActivityLogDto> => {
    const res = await apiClient.post<ApiResponse<ActivityLogDto>>('/activities', data);
    return res.data.data;
  },
};
