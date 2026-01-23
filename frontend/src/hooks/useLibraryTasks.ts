import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWsLibraryTemplates,
  getWsLibraryTemplate,
  createWsLibraryTemplate,
  updateWsLibraryTemplate,
  deleteWsLibraryTemplate,
  submitWsLibraryTemplate,
  approveWsLibraryTemplate,
  rejectWsLibraryTemplate,
  dispatchWsLibraryTemplate,
  overrideWsLibraryCooldown,
  getWsLibraryPendingApproval,
  type WsLibraryTemplate,
  type WsLibraryTemplateCreate,
  type WsLibraryTemplateUpdate,
  type WsLibraryDispatchRequest,
  type PaginatedWsLibraryResponse,
} from '@/lib/api';
import { taskKeys } from './useTasks';

// Query Keys
export const libraryKeys = {
  all: ['library-tasks'] as const,
  lists: () => [...libraryKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...libraryKeys.lists(), params] as const,
  details: () => [...libraryKeys.all, 'detail'] as const,
  detail: (id: number) => [...libraryKeys.details(), id] as const,
  pendingApproval: (params?: { page?: number; per_page?: number }) =>
    [...libraryKeys.all, 'pending-approval', params] as const,
};

// ============================================
// Library Template Hooks
// ============================================

/**
 * Fetch paginated library templates
 */
export function useLibraryTemplates(
  params?: {
    page?: number;
    per_page?: number;
    status?: string;
    source?: string;
    dept_id?: number;
    task_name?: string;
    had_issues?: boolean;
    sort?: string;
  },
  options?: { enabled?: boolean }
) {
  return useQuery<PaginatedWsLibraryResponse>({
    queryKey: libraryKeys.list(params),
    queryFn: () => getWsLibraryTemplates(params),
    ...options,
  });
}

/**
 * Fetch single library template
 */
export function useLibraryTemplate(id: number, options?: { enabled?: boolean }) {
  return useQuery<WsLibraryTemplate>({
    queryKey: libraryKeys.detail(id),
    queryFn: () => getWsLibraryTemplate(id),
    enabled: options?.enabled ?? id > 0,
  });
}

/**
 * Fetch templates pending approval
 */
export function useLibraryPendingApproval(params?: { page?: number; per_page?: number }) {
  return useQuery<PaginatedWsLibraryResponse>({
    queryKey: libraryKeys.pendingApproval(params),
    queryFn: () => getWsLibraryPendingApproval(params),
  });
}

// ============================================
// Library Template Mutations
// ============================================

/**
 * Create library template
 */
export function useCreateLibraryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WsLibraryTemplateCreate) => createWsLibraryTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
    },
  });
}

/**
 * Update library template
 */
export function useUpdateLibraryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WsLibraryTemplateUpdate }) =>
      updateWsLibraryTemplate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
    },
  });
}

/**
 * Delete library template
 */
export function useDeleteLibraryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteWsLibraryTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
    },
  });
}

/**
 * Submit library template for approval
 */
export function useSubmitLibraryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => submitWsLibraryTemplate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
    },
  });
}

/**
 * Approve library template
 */
export function useApproveLibraryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => approveWsLibraryTemplate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.pendingApproval() });
    },
  });
}

/**
 * Reject library template
 */
export function useRejectLibraryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      rejectWsLibraryTemplate(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.pendingApproval() });
    },
  });
}

/**
 * Dispatch library template to stores
 */
export function useDispatchLibraryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WsLibraryDispatchRequest }) =>
      dispatchWsLibraryTemplate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
      // Also invalidate task lists since a new task was created
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * Override cooldown on library template
 */
export function useOverrideLibraryCooldown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      overrideWsLibraryCooldown(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
    },
  });
}
