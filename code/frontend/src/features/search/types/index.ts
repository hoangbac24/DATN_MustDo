export type SearchEntityType = 'ALL' | 'TASK' | 'PROJECT' | 'TAG' | 'COMMENT';

export interface SearchResultItemDto {
  id: string;
  title: string;
  description?: string;
  type: 'TASK' | 'PROJECT' | 'TAG' | 'COMMENT';
  link: string;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
  status?: string;
  priority?: string;
  color?: string;
  createdAt?: string;
}

export interface GlobalSearchResultDto {
  items: SearchResultItemDto[];
  totalTasks: number;
  totalProjects: number;
  totalTags: number;
  totalComments: number;
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
}

export interface SearchQueryParams {
  q?: string;
  type?: SearchEntityType;
  workspaceId?: string;
  projectId?: string;
  status?: string;
  priority?: string;
  sortBy?: 'relevance' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  size?: number;
}
