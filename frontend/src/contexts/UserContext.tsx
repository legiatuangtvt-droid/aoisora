'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobGrade, JOB_GRADE_SCOPE, ManagementScope } from '@/types/userInfo';
import { getUserSwitcherStaff, UserSwitcherStaff } from '@/lib/api';

// User interface matching the API response
export interface AppUser {
  staff_id: number;
  staff_name: string;
  staff_code: string;
  email: string;
  job_grade: JobGrade;
  scope: ManagementScope;
  store_id: number | null;
  store_name: string;
  department_id: number | null;
  department_name: string;
}

// Keep MockUser as alias for backward compatibility
export type MockUser = AppUser;

// Default user for initial state before API response
const DEFAULT_USER: AppUser = {
  staff_id: 1,
  staff_name: 'Loading...',
  staff_code: 'LOADING',
  email: '',
  job_grade: 'G9',
  scope: 'COMPANY',
  store_id: null,
  store_name: 'HQ',
  department_id: null,
  department_name: '',
};

interface UserContextType {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  availableUsers: AppUser[];
  hqUsers: AppUser[];
  storeUsers: AppUser[];
  isUserSwitcherOpen: boolean;
  setIsUserSwitcherOpen: (open: boolean) => void;
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'aoisora_test_user';
const SWITCHED_USER_ID_KEY = 'optichain_switched_user_id';

// Convert API response to AppUser
function mapApiUserToAppUser(apiUser: UserSwitcherStaff): AppUser {
  return {
    staff_id: apiUser.staff_id,
    staff_name: apiUser.staff_name,
    staff_code: apiUser.staff_code,
    email: apiUser.email,
    job_grade: apiUser.job_grade as JobGrade,
    scope: apiUser.scope as ManagementScope,
    store_id: apiUser.store_id,
    store_name: apiUser.store_name,
    department_id: apiUser.department_id,
    department_name: apiUser.department_name,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<AppUser>(DEFAULT_USER);
  const [availableUsers, setAvailableUsers] = useState<AppUser[]>([]);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUserSwitcherStaff();
      const users = response.data.map(mapApiUserToAppUser);
      setAvailableUsers(users);

      // Restore saved user from localStorage or use first user
      if (typeof window !== 'undefined') {
        const savedUserId = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUserId) {
          const savedUser = users.find(u => u.staff_id === parseInt(savedUserId));
          if (savedUser) {
            setCurrentUserState(savedUser);
            // Ensure switched user ID is set for API calls
            localStorage.setItem(SWITCHED_USER_ID_KEY, savedUser.staff_id.toString());
          } else if (users.length > 0) {
            setCurrentUserState(users[0]);
            localStorage.setItem(SWITCHED_USER_ID_KEY, users[0].staff_id.toString());
          }
        } else if (users.length > 0) {
          setCurrentUserState(users[0]);
          localStorage.setItem(SWITCHED_USER_ID_KEY, users[0].staff_id.toString());
        }
      }
    } catch (err) {
      console.error('Failed to fetch users for switcher:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
      // Keep current user if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const setCurrentUser = (user: AppUser) => {
    setCurrentUserState(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, user.staff_id.toString());
      // Also save the switched user ID for API calls (used by fetchWithAuth)
      localStorage.setItem(SWITCHED_USER_ID_KEY, user.staff_id.toString());
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  // Computed values
  const hqUsers = availableUsers.filter(u => u.job_grade.startsWith('G'));
  const storeUsers = availableUsers.filter(u => u.job_grade.startsWith('S'));

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
        hqUsers,
        storeUsers,
        isUserSwitcherOpen,
        setIsUserSwitcherOpen,
        isLoading,
        error,
        refreshUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Export for backward compatibility (deprecated - use availableUsers from context)
export const MOCK_USERS: AppUser[] = [];
export const HQ_USERS: AppUser[] = [];
export const STORE_USERS: AppUser[] = [];
