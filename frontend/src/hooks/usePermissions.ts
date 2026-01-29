'use client';

import { useAuth, UserPermissions } from '@/contexts/AuthContext';

/**
 * Permission hook for checking user permissions
 *
 * According to design spec (CLAUDE.md section 12.1):
 * - Only HQ users (G2-G9) can create tasks
 * - Store users (S1-S7) cannot create tasks
 *
 * Uses authenticated user from AuthContext
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const permissions = isAuthenticated ? user?.permissions ?? null : null;

  /**
   * Check if user can create tasks
   * Only HQ users (G2-G9) are allowed
   */
  const canCreateTask = (): boolean => {
    if (!isAuthenticated || !permissions) return false;
    return permissions.can_create_task === true;
  };

  /**
   * Check if user is HQ staff (G2-G9)
   */
  const isHQUser = (): boolean => {
    if (!isAuthenticated || !permissions) return false;
    return permissions.grade_type === 'HQ';
  };

  /**
   * Check if user is Store staff (S1-S7)
   */
  const isStoreUser = (): boolean => {
    if (!isAuthenticated || !permissions) return false;
    return permissions.grade_type === 'STORE';
  };

  /**
   * Check if user has company-wide access (G8, G9)
   */
  const hasCompanyAccess = (): boolean => {
    if (!isAuthenticated || !permissions) return false;
    return permissions.has_company_access === true;
  };

  /**
   * Get user's job grade
   */
  const getJobGrade = (): string | null => {
    return permissions?.job_grade ?? null;
  };

  /**
   * Get user's permission scope
   */
  const getScope = (): string => {
    return permissions?.scope ?? 'NONE';
  };

  /**
   * Get user's permission level (higher = more access)
   */
  const getLevel = (): number => {
    return permissions?.level ?? 0;
  };

  return {
    permissions,
    isAuthenticated,
    canCreateTask,
    isHQUser,
    isStoreUser,
    hasCompanyAccess,
    getJobGrade,
    getScope,
    getLevel,
  };
}

export type { UserPermissions };
