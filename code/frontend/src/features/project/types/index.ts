export interface ProjectStatsDto {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  progressPercentage: number;
}

export interface ProjectDto {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  color: string;
  icon: string;
  isArchived: boolean;
  isFavorite: boolean;
  statistics?: ProjectStatsDto;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateProjectInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}
