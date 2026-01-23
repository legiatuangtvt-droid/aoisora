import { useQuery } from '@tanstack/react-query';
import {
  getScopeHierarchy,
  getHQHierarchy,
  getDepartments,
  getCodeMaster,
  type ScopeHierarchyResponse,
  type HQHierarchyResponse,
  type Department,
  type CodeMaster,
} from '@/lib/api';

// Query Keys
export const scopeKeys = {
  all: ['scope'] as const,
  storeHierarchy: () => [...scopeKeys.all, 'store-hierarchy'] as const,
  hqHierarchy: () => [...scopeKeys.all, 'hq-hierarchy'] as const,
  departments: () => [...scopeKeys.all, 'departments'] as const,
  codeMaster: (codeType?: string) => [...scopeKeys.all, 'code-master', codeType] as const,
};

// ============================================
// Scope Hierarchy Hooks
// ============================================

/**
 * Fetch store geographic hierarchy (Region → Zone → Area → Store)
 * This data rarely changes, so we use a long stale time
 */
export function useScopeHierarchy(options?: { enabled?: boolean }) {
  return useQuery<ScopeHierarchyResponse>({
    queryKey: scopeKeys.storeHierarchy(),
    queryFn: () => getScopeHierarchy(),
    // Geographic data is very stable, cache for 10 minutes
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch HQ organizational hierarchy (Division → Dept → Team → User)
 */
export function useHQHierarchy(options?: { enabled?: boolean }) {
  return useQuery<HQHierarchyResponse>({
    queryKey: scopeKeys.hqHierarchy(),
    queryFn: () => getHQHierarchy(),
    // Org data is relatively stable, cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch departments list
 */
export function useDepartments(options?: { enabled?: boolean }) {
  return useQuery<Department[]>({
    queryKey: scopeKeys.departments(),
    queryFn: () => getDepartments(),
    // Departments rarely change
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch code master data (task types, status codes, etc.)
 */
export function useCodeMaster(codeType?: string, options?: { enabled?: boolean }) {
  return useQuery<CodeMaster[]>({
    queryKey: scopeKeys.codeMaster(codeType),
    queryFn: () => getCodeMaster(codeType),
    // Master data rarely changes
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

// ============================================
// Convenience Hooks for Common Use Cases
// ============================================

/**
 * Get task type options from code master
 */
export function useTaskTypeOptions() {
  return useCodeMaster('TASK_TYPE');
}

/**
 * Get task status options from code master
 */
export function useTaskStatusOptions() {
  return useCodeMaster('TASK_STATUS');
}

/**
 * Get response type options from code master
 */
export function useResponseTypeOptions() {
  return useCodeMaster('RESPONSE_TYPE');
}
