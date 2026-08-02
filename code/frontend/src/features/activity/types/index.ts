import type { UserDto } from '@/features/auth/types';

export type ActivityEntityType = 'TASK' | 'PROJECT' | 'WORKSPACE' | 'COMMENT' | 'CHECKLIST' | 'TAG' | 'USER';

export interface ActivityLogDto {
  id: string;
  action: string;
  entityType: ActivityEntityType;
  entityId: string;
  userId: string;
  user?: UserDto;
  details?: string;
  workspaceId?: string;
  projectId?: string;
  createdAt: string;
}

export interface CreateActivityLogInput {
  action: string;
  entityType: ActivityEntityType;
  entityId: string;
  details?: string;
  workspaceId?: string;
  projectId?: string;
}

export interface PaginatedActivitiesResponse {
  items: ActivityLogDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
