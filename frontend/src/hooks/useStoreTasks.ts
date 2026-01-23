import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStoreTasks,
  getMyStoreTasks,
  getTaskStoreDetail,
  assignTaskToStaff,
  reassignTask,
  unassignTask,
  startStoreTask,
  completeStoreTask,
  markStoreTaskUnable,
  hqCheckStoreTask,
  hqRejectStoreTask,
  getHQCheckList,
  type GetStoreTasksParams,
  type PaginatedStoreTasksResponse,
  type StoreTaskAssignment,
  type PaginatedHQCheckResponse,
} from '@/lib/api';
import { taskKeys } from './useTasks';

// Query Keys
export const storeTaskKeys = {
  all: ['store-tasks'] as const,
  lists: () => [...storeTaskKeys.all, 'list'] as const,
  list: (storeId: number, params?: GetStoreTasksParams) =>
    [...storeTaskKeys.lists(), storeId, params] as const,
  myTasks: (storeId: number, params?: GetStoreTasksParams) =>
    [...storeTaskKeys.all, 'my-tasks', storeId, params] as const,
  detail: (taskId: number, storeId: number) =>
    [...storeTaskKeys.all, 'detail', taskId, storeId] as const,
  hqCheck: (params?: { page?: number; per_page?: number }) =>
    [...storeTaskKeys.all, 'hq-check', params] as const,
};

// ============================================
// Store Task List Hooks
// ============================================

/**
 * Fetch tasks assigned to a store
 */
export function useStoreTasks(storeId: number, params?: GetStoreTasksParams, options?: { enabled?: boolean }) {
  return useQuery<PaginatedStoreTasksResponse>({
    queryKey: storeTaskKeys.list(storeId, params),
    queryFn: () => getStoreTasks(storeId, params),
    enabled: options?.enabled ?? storeId > 0,
  });
}

/**
 * Fetch tasks assigned to current user in a store
 */
export function useMyStoreTasks(storeId: number, params?: GetStoreTasksParams, options?: { enabled?: boolean }) {
  return useQuery<PaginatedStoreTasksResponse>({
    queryKey: storeTaskKeys.myTasks(storeId, params),
    queryFn: () => getMyStoreTasks(storeId, params),
    enabled: options?.enabled ?? storeId > 0,
  });
}

/**
 * Fetch task detail for a specific store
 */
export function useTaskStoreDetail(taskId: number, storeId: number, options?: { enabled?: boolean }) {
  return useQuery<StoreTaskAssignment>({
    queryKey: storeTaskKeys.detail(taskId, storeId),
    queryFn: () => getTaskStoreDetail(taskId, storeId),
    enabled: options?.enabled ?? (taskId > 0 && storeId > 0),
  });
}

/**
 * Fetch tasks pending HQ check
 */
export function useHQCheckList(params?: { page?: number; per_page?: number }) {
  return useQuery<PaginatedHQCheckResponse>({
    queryKey: storeTaskKeys.hqCheck(params),
    queryFn: () => getHQCheckList(params),
    // HQ check list changes frequently
    staleTime: 15 * 1000,
  });
}

// ============================================
// Store Task Mutations
// ============================================

/**
 * Assign task to staff
 */
export function useAssignTaskToStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      storeId,
      staffId,
    }: {
      taskId: number;
      storeId: number;
      staffId: number;
    }) => assignTaskToStaff(taskId, storeId, staffId),
    onSuccess: (_, { taskId, storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.detail(taskId, storeId) });
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.progress(taskId) });
    },
  });
}

/**
 * Reassign task to different staff
 */
export function useReassignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      storeId,
      staffId,
    }: {
      taskId: number;
      storeId: number;
      staffId: number;
    }) => reassignTask(taskId, storeId, staffId),
    onSuccess: (_, { taskId, storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.detail(taskId, storeId) });
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.lists() });
    },
  });
}

/**
 * Unassign task (return to store leader)
 */
export function useUnassignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, storeId }: { taskId: number; storeId: number }) =>
      unassignTask(taskId, storeId),
    onSuccess: (_, { taskId, storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.detail(taskId, storeId) });
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.lists() });
    },
  });
}

/**
 * Start task execution
 */
export function useStartStoreTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, storeId }: { taskId: number; storeId: number }) =>
      startStoreTask(taskId, storeId),
    onSuccess: (_, { taskId, storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.detail(taskId, storeId) });
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.progress(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * Complete task
 */
export function useCompleteStoreTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      storeId,
      data,
    }: {
      taskId: number;
      storeId: number;
      data?: { notes?: string; evidence?: string[] };
    }) => completeStoreTask(taskId, storeId, data),
    onSuccess: (_, { taskId, storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.detail(taskId, storeId) });
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.progress(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.hqCheck() });
    },
  });
}

/**
 * Mark task as unable
 */
export function useMarkStoreTaskUnable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      storeId,
      reason,
      notes,
    }: {
      taskId: number;
      storeId: number;
      reason: string;
      notes?: string;
    }) => markStoreTaskUnable(taskId, storeId, reason, notes),
    onSuccess: (_, { taskId, storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.detail(taskId, storeId) });
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.progress(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * HQ Check - approve store completion
 */
export function useHQCheckStoreTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      storeId,
      comment,
    }: {
      taskId: number;
      storeId: number;
      comment?: string;
    }) => hqCheckStoreTask(taskId, storeId, comment),
    onSuccess: (_, { taskId, storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.detail(taskId, storeId) });
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.hqCheck() });
      queryClient.invalidateQueries({ queryKey: taskKeys.progress(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * HQ Reject - reject store completion
 */
export function useHQRejectStoreTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      storeId,
      reason,
    }: {
      taskId: number;
      storeId: number;
      reason: string;
    }) => hqRejectStoreTask(taskId, storeId, reason),
    onSuccess: (_, { taskId, storeId }) => {
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.detail(taskId, storeId) });
      queryClient.invalidateQueries({ queryKey: storeTaskKeys.hqCheck() });
      queryClient.invalidateQueries({ queryKey: taskKeys.progress(taskId) });
    },
  });
}
