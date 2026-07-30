import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task-service';
import type { CreateTaskInput, TaskFilterState, TaskStatus, UpdateTaskInput } from '../types';

export const TASK_QUERY_KEYS = {
  list: (projectId: string, filters?: object) => ['tasks', projectId, filters] as const,
  detail: (id: string) => ['task', id] as const,
};

export function useProjectTasks(projectId: string | null, filters?: TaskFilterState) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(projectId || '', filters),
    queryFn: () => taskService.getProjectTasks(projectId!, filters),
    enabled: !!projectId,
  });
}

export function useTaskDetails(taskId: string | null) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(taskId || ''),
    queryFn: () => taskService.getTaskDetails(taskId!),
    enabled: !!taskId,
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createTask(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
    },
  });
}

export function useUpdateTask(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskInput) => taskService.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(taskId) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskService.updateTaskStatus(taskId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
    },
  });
}

export function useToggleArchiveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.toggleArchiveTask(taskId),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(taskId) });
    },
  });
}

export function useReorderTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, position }: { taskId: string; position: number }) =>
      taskService.reorderTask(taskId, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
