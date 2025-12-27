'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user data for testing
export interface MockUser {
  staff_id: number;
  staff_name: string;
  staff_code: string;
  email: string;
  role: 'manager' | 'supervisor' | 'staff';
  store_id: number;
  store_name: string;
  department_id: number;
  department_name: string;
}

// Predefined mock users for different roles
export const MOCK_USERS: MockUser[] = [
  {
    staff_id: 1,
    staff_name: 'Nguyen Van Admin',
    staff_code: 'MGR001',
    email: 'admin@optichain.com',
    role: 'manager',
    store_id: 1,
    store_name: 'AMPM_D1_NCT',
    department_id: 1,
    department_name: 'Management',
  },
  {
    staff_id: 2,
    staff_name: 'Tran Thi Supervisor',
    staff_code: 'SUP001',
    email: 'supervisor@optichain.com',
    role: 'supervisor',
    store_id: 1,
    store_name: 'AMPM_D1_NCT',
    department_id: 2,
    department_name: 'Operations',
  },
  {
    staff_id: 3,
    staff_name: 'Le Van Staff',
    staff_code: 'STF001',
    email: 'staff@optichain.com',
    role: 'staff',
    store_id: 1,
    store_name: 'AMPM_D1_NCT',
    department_id: 3,
    department_name: 'Sales',
  },
  {
    staff_id: 4,
    staff_name: 'Pham Thi Staff 2',
    staff_code: 'STF002',
    email: 'staff2@optichain.com',
    role: 'staff',
    store_id: 2,
    store_name: 'AMPM_D3_LVT',
    department_id: 3,
    department_name: 'Sales',
  },
];

interface UserContextType {
  currentUser: MockUser;
  setCurrentUser: (user: MockUser) => void;
  availableUsers: MockUser[];
  isUserSwitcherOpen: boolean;
  setIsUserSwitcherOpen: (open: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'optichain_mock_user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<MockUser>(MOCK_USERS[0]);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  // Load saved user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUserId) {
        const savedUser = MOCK_USERS.find(u => u.staff_id === parseInt(savedUserId));
        if (savedUser) {
          setCurrentUserState(savedUser);
        }
      }
    }
  }, []);

  const setCurrentUser = (user: MockUser) => {
    setCurrentUserState(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, user.staff_id.toString());
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: MOCK_USERS,
        isUserSwitcherOpen,
        setIsUserSwitcherOpen,
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
