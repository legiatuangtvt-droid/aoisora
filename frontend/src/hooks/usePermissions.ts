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
 * This hook supports TWO modes:
 * 1. User Switcher Mode (for testing): Uses currentUser from UserContext
 *    - Works INDEPENDENTLY without requiring AuthContext login
 *    - Allows testing different job grades without authentication
 * 2. Authenticated Mode (for production): Uses user from AuthContext
 *    - Requires proper login via /auth/signin
 *
 * Priority: User Switcher > Authenticated User
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  const { currentUser } = useUser();

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

  // Check if User Switcher has a valid user selected
  const hasUserSwitcherUser = currentUser && currentUser.job_grade && currentUser.staff_name !== 'Loading...';

  // Determine effective permissions based on switched user OR authenticated user
  // User Switcher takes priority and works INDEPENDENTLY (no auth required)
  const getEffectivePermissions = (): UserPermissions | null => {
    // Priority 1: User Switcher (works independently without login)
    if (hasUserSwitcherUser) {
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

    // Priority 2: Fall back to authenticated user's permissions
    return user?.permissions ?? null;
  };

  const permissions = getEffectivePermissions();

  // Effective authentication: User Switcher OR real auth
  const isEffectivelyAuthenticated = hasUserSwitcherUser || isAuthenticated;

  /**
   * Check if user can create tasks
   * Only HQ users (G2-G9) are allowed
   * Works with User Switcher (no real auth required)
   */
  const canCreateTask = (): boolean => {
    if (!isEffectivelyAuthenticated || !permissions) return false;
    return permissions.can_create_task === true;
  };

  /**
   * Check if user is HQ staff (G2-G9)
   * Works with User Switcher (no real auth required)
   */
  const isHQUser = (): boolean => {
    if (!isEffectivelyAuthenticated || !permissions) return false;
    return permissions.grade_type === 'HQ';
  };

  /**
   * Check if user is Store staff (S1-S7)
   * Works with User Switcher (no real auth required)
   */
  const isStoreUser = (): boolean => {
    if (!isEffectivelyAuthenticated || !permissions) return false;
    return permissions.grade_type === 'STORE';
  };

  /**
   * Check if user has company-wide access (G8, G9)
   * Works with User Switcher (no real auth required)
   */
  const hasCompanyAccess = (): boolean => {
    if (!isEffectivelyAuthenticated || !permissions) return false;
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
    isEffectivelyAuthenticated,
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
