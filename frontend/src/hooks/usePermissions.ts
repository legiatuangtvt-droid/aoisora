'use client';

import { useAuth, UserPermissions } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { JOB_GRADE_SCOPE, ManagementScope } from '@/types/userInfo';

/**
 * Permission hook for checking user permissions
 *
 * According to design spec (CLAUDE.md section 12.1):
 * - Only HQ users (G2-G9) can create tasks
 * - Store users (S1-S7) cannot create tasks
 *
 * This hook respects the User Switcher:
 * - If user is switched via User Switcher, use the switched user's permissions
 * - Otherwise, use the authenticated user's permissions from AuthContext
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  const { currentUser } = useUser();

  // Determine effective permissions based on switched user
  // User Switcher allows testing different job grades without re-authenticating
  const getEffectivePermissions = (): UserPermissions | null => {
    // If User Switcher is active (currentUser from UserContext)
    if (currentUser && currentUser.job_grade) {
      const jobGrade = currentUser.job_grade;
      const isHQ = jobGrade.startsWith('G');
      const scope = JOB_GRADE_SCOPE[jobGrade] || 'NONE';

      // Build permissions object based on switched user's job grade
      return {
        job_grade: jobGrade,
        grade_type: isHQ ? 'HQ' : 'STORE',
        scope: scope,
        level: getGradeLevel(jobGrade),
        has_company_access: ['G8', 'G9'].includes(jobGrade),
        can_create_task: isHQ, // Only HQ users (G2-G9) can create tasks
        department_id: currentUser.department_id,
        store_id: currentUser.store_id,
      };
    }

    // Fall back to authenticated user's permissions
    return user?.permissions ?? null;
  };

  // Helper to get grade level
  const getGradeLevel = (grade: string): number => {
    const HQ_LEVELS: Record<string, number> = {
      'G9': 8, 'G8': 7, 'G7': 6, 'G6': 5, 'G5': 4, 'G4': 3, 'G3': 2, 'G2': 1,
    };
    const STORE_LEVELS: Record<string, number> = {
      'S7': 7, 'S6': 6, 'S5': 5, 'S4': 4, 'S3': 3, 'S2': 2, 'S1': 1,
    };
    return HQ_LEVELS[grade] || STORE_LEVELS[grade] || 0;
  };

  const permissions = getEffectivePermissions();

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
    if (!permissions) return false;
    return permissions.grade_type === 'HQ';
  };

  /**
   * Check if user is Store staff (S1-S7)
   */
  const isStoreUser = (): boolean => {
    if (!permissions) return false;
    return permissions.grade_type === 'STORE';
  };

  /**
   * Check if user has company-wide access (G8, G9)
   */
  const hasCompanyAccess = (): boolean => {
    if (!permissions) return false;
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
