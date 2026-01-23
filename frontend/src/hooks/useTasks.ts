import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskProgress,
  submitTask,
  approveTask,
  rejectTask,
  pauseTask,
  getPendingApprovals,
  getDraftInfo,
  getTaskApprovalHistory,
  getTaskComments,
  createTaskComment,
  updateTaskComment,
  deleteTaskComment,
  type TaskQueryParamsExtended,
  type PaginatedTaskResponse,
  type DraftInfo,
  type TaskApprovalHistoryResponse,
  type TaskCommentsResponse,
} from '@/lib/api';
import type { Task, TaskCreate, TaskUpdate, TaskProgressResponse } from '@/types/api';

// Query Keys - centralized for consistency
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params: TaskQueryParamsExtended) => [...taskKeys.lists(), params] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
  progress: (id: number) => [...taskKeys.all, 'progress', id] as const,
  history: (id: number) => [...taskKeys.all, 'history', id] as const,
  comments: (id: number) => [...taskKeys.all, 'comments', id] as const,
  pendingApprovals: (params?: { page?: number; per_page?: number }) =>
    [...taskKeys.all, 'pending-approvals', params] as const,
  draftInfo: () => [...taskKeys.all, 'draft-info'] as const,
};

// ============================================
// Task List Hooks
// ============================================

/**
 * Fetch paginated task list with filters
 * Caches results by filter params
 */
export function useTasks(params?: TaskQueryParamsExtended, options?: { enabled?: boolean }) {
  return useQuery<PaginatedTaskResponse>({
    queryKey: taskKeys.list(params || {}),
    queryFn: () => getTasks(params),
    ...options,
  });
}

/**
 * Fetch single task detail
 */
export function useTask(id: number, options?: { enabled?: boolean }) {
  return useQuery<Task>({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTaskById(id),
    enabled: options?.enabled ?? id > 0,
  });
}

/**
 * Fetch task progress (store assignments summary)
 */
export function useTaskProgress(taskId: number, options?: { enabled?: boolean }) {
  return useQuery<TaskProgressResponse>({
    queryKey: taskKeys.progress(taskId),
    queryFn: () => getTaskProgress(taskId),
    enabled: options?.enabled ?? taskId > 0,
    // Progress changes frequently, shorter stale time
    staleTime: 10 * 1000,
  });
}

/**
 * Fetch task approval history
 */
export function useTaskHistory(taskId: number, options?: { enabled?: boolean }) {
  return useQuery<TaskApprovalHistoryResponse>({
    queryKey: taskKeys.history(taskId),
    queryFn: () => getTaskApprovalHistory(taskId),
    enabled: options?.enabled ?? taskId > 0,
  });
}

/**
 * Fetch tasks pending approval for current user
 */
export function usePendingApprovals(params?: { page?: number; per_page?: number }) {
  return useQuery<PaginatedTaskResponse>({
    queryKey: taskKeys.pendingApprovals(params),
    queryFn: () => getPendingApprovals(params),
  });
}

/**
 * Fetch draft info for current user
 */
export function useDraftInfo() {
  return useQuery<DraftInfo>({
    queryKey: taskKeys.draftInfo(),
    queryFn: () => getDraftInfo(),
    // Draft info is relatively static
    staleTime: 60 * 1000,
  });
}

// ============================================
// Task Comment Hooks
// ============================================

/**
 * Fetch task comments
 */
export function useTaskComments(taskId: number, options?: { enabled?: boolean }) {
  return useQuery<TaskCommentsResponse>({
    queryKey: taskKeys.comments(taskId),
    queryFn: () => getTaskComments(taskId),
    enabled: options?.enabled ?? taskId > 0,
  });
}

// ============================================
// Task Mutations
// ============================================

/**
 * Create new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskCreate) => createTask(data),
    onSuccess: () => {
      // Invalidate task lists to refetch
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      // Invalidate draft info
      queryClient.invalidateQueries({ queryKey: taskKeys.draftInfo() });
    },
  });
}

/**
 * Update existing task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) => updateTask(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate the specific task
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      // Invalidate task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * Delete task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      // Invalidate task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      // Invalidate draft info
      queryClient.invalidateQueries({ queryKey: taskKeys.draftInfo() });
    },
  });
}

/**
 * Submit task for approval
 */
export function useSubmitTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => submitTask(taskId),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.draftInfo() });
    },
  });
}

/**
 * Approve task
 */
export function useApproveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, comment }: { taskId: number; comment?: string }) =>
      approveTask(taskId, comment),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.pendingApprovals() });
      queryClient.invalidateQueries({ queryKey: taskKeys.history(taskId) });
    },
  });
}

/**
 * Reject task
 */
export function useRejectTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, reason }: { taskId: number; reason: string }) =>
      rejectTask(taskId, reason),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.pendingApprovals() });
      queryClient.invalidateQueries({ queryKey: taskKeys.history(taskId) });
    },
  });
}

/**
 * Pause task
 */
export function usePauseTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, reason }: { taskId: number; reason?: string }) =>
      pauseTask(taskId, reason),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.progress(taskId) });
    },
  });
}

// ============================================
// Comment Mutations
// ============================================

/**
 * Create comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      content,
      storeResultId,
    }: {
      taskId: number;
      content: string;
      storeResultId?: number;
    }) => createTaskComment(taskId, content, storeResultId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
    },
  });
}

/**
 * Update comment
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      commentId,
      content,
    }: {
      taskId: number;
      commentId: number;
      content: string;
    }) => updateTaskComment(taskId, commentId, content),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
    },
  });
}

/**
 * Delete comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, commentId }: { taskId: number; commentId: number }) =>
      deleteTaskComment(taskId, commentId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
    },
  });
}
