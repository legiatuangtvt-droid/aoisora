'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobGrade, JOB_GRADE_TITLES, JOB_GRADE_SCOPE, ManagementScope } from '@/types/userInfo';

// Mock user data for testing - now with Job Grade system
export interface MockUser {
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

// Helper to get scope from job grade
const getScope = (grade: JobGrade): ManagementScope => JOB_GRADE_SCOPE[grade];

// Predefined mock users for different Job Grades
// HQ Grades (G2-G9) and Store Grades (S1-S6)
export const MOCK_USERS: MockUser[] = [
  // === HQ Job Grades (G9 → G2) ===
  {
    staff_id: 1,
    staff_name: 'Trần Văn Tổng',
    staff_code: 'HQ-G9-001',
    email: 'tong.gd@aoisora.com',
    job_grade: 'G9',
    scope: getScope('G9'),
    store_id: null,
    store_name: 'HQ - Văn phòng chính',
    department_id: null,
    department_name: 'Ban Giám đốc',
  },
  {
    staff_id: 2,
    staff_name: 'Nguyễn Thị CCO',
    staff_code: 'HQ-G8-001',
    email: 'cco@aoisora.com',
    job_grade: 'G8',
    scope: getScope('G8'),
    store_id: null,
    store_name: 'HQ - Văn phòng chính',
    department_id: null,
    department_name: 'Ban Điều hành',
  },
  {
    staff_id: 3,
    staff_name: 'Lê Văn Khối',
    staff_code: 'HQ-G7-001',
    email: 'gd.khoi@aoisora.com',
    job_grade: 'G7',
    scope: getScope('G7'),
    store_id: null,
    store_name: 'HQ - Văn phòng chính',
    department_id: 1,
    department_name: 'Khối Kinh doanh',
  },
  {
    staff_id: 4,
    staff_name: 'Phạm Thị Phòng',
    staff_code: 'HQ-G6-001',
    email: 'tgd.phong@aoisora.com',
    job_grade: 'G6',
    scope: getScope('G6'),
    store_id: null,
    store_name: 'HQ - Văn phòng chính',
    department_id: 1,
    department_name: 'Phòng Marketing',
  },
  {
    staff_id: 5,
    staff_name: 'Hoàng Văn Trưởng',
    staff_code: 'HQ-G5-001',
    email: 'truong.phong@aoisora.com',
    job_grade: 'G5',
    scope: getScope('G5'),
    store_id: null,
    store_name: 'HQ - Văn phòng chính',
    department_id: 2,
    department_name: 'Phòng Nhân sự',
  },
  {
    staff_id: 6,
    staff_name: 'Vũ Thị Phó',
    staff_code: 'HQ-G4-001',
    email: 'pho.phong@aoisora.com',
    job_grade: 'G4',
    scope: getScope('G4'),
    store_id: null,
    store_name: 'HQ - Văn phòng chính',
    department_id: 2,
    department_name: 'Phòng Nhân sự',
  },
  {
    staff_id: 7,
    staff_name: 'Đặng Văn Chuyên',
    staff_code: 'HQ-G3-001',
    email: 'chuyen.vien@aoisora.com',
    job_grade: 'G3',
    scope: getScope('G3'),
    store_id: null,
    store_name: 'HQ - Văn phòng chính',
    department_id: 3,
    department_name: 'Phòng IT',
  },
  {
    staff_id: 8,
    staff_name: 'Bùi Thị Nhân',
    staff_code: 'HQ-G2-001',
    email: 'nhan.vien@aoisora.com',
    job_grade: 'G2',
    scope: getScope('G2'),
    store_id: null,
    store_name: 'HQ - Văn phòng chính',
    department_id: 3,
    department_name: 'Phòng IT',
  },

  // === Store Job Grades (S6 → S1) ===
  {
    staff_id: 9,
    staff_name: 'Ngô Văn Miền',
    staff_code: 'ST-S6-001',
    email: 'ql.mien@aoisora.com',
    job_grade: 'S6',
    scope: getScope('S6'),
    store_id: null,
    store_name: 'Miền Nam',
    department_id: 6,
    department_name: 'Store Operations',
  },
  {
    staff_id: 10,
    staff_name: 'Trịnh Thị Khu',
    staff_code: 'ST-S5-001',
    email: 'ql.khuvuc@aoisora.com',
    job_grade: 'S5',
    scope: getScope('S5'),
    store_id: null,
    store_name: 'Khu vực HCM',
    department_id: 6,
    department_name: 'Store Operations',
  },
  {
    staff_id: 11,
    staff_name: 'Lý Văn Cụm',
    staff_code: 'ST-S4-001',
    email: 'truong.cum@aoisora.com',
    job_grade: 'S4',
    scope: getScope('S4'),
    store_id: 1,
    store_name: 'Cụm Q1-Q3',
    department_id: 6,
    department_name: 'Store Operations',
  },
  {
    staff_id: 12,
    staff_name: 'Mai Thị Hàng',
    staff_code: 'ST-S3-001',
    email: 'truong.ch@aoisora.com',
    job_grade: 'S3',
    scope: getScope('S3'),
    store_id: 1,
    store_name: 'AEON Mall Tân Phú',
    department_id: 6,
    department_name: 'Store Operations',
  },
  {
    staff_id: 13,
    staff_name: 'Cao Văn Phó',
    staff_code: 'ST-S2-001',
    email: 'pho.ch@aoisora.com',
    job_grade: 'S2',
    scope: getScope('S2'),
    store_id: 1,
    store_name: 'AEON Mall Tân Phú',
    department_id: 6,
    department_name: 'Store Operations',
  },
  {
    staff_id: 14,
    staff_name: 'Đinh Thị Viên',
    staff_code: 'ST-S1-001',
    email: 'nv.cuahang@aoisora.com',
    job_grade: 'S1',
    scope: getScope('S1'),
    store_id: 1,
    store_name: 'AEON Mall Tân Phú',
    department_id: 6,
    department_name: 'Store Operations',
  },

  // === Additional Store users (different stores) ===
  {
    staff_id: 15,
    staff_name: 'Phan Văn Hai',
    staff_code: 'ST-S3-002',
    email: 'truong.ch2@aoisora.com',
    job_grade: 'S3',
    scope: getScope('S3'),
    store_id: 2,
    store_name: 'AEON Mall Bình Tân',
    department_id: 6,
    department_name: 'Store Operations',
  },
  {
    staff_id: 16,
    staff_name: 'Dương Thị Ba',
    staff_code: 'ST-S1-002',
    email: 'nv.cuahang2@aoisora.com',
    job_grade: 'S1',
    scope: getScope('S1'),
    store_id: 2,
    store_name: 'AEON Mall Bình Tân',
    department_id: 6,
    department_name: 'Store Operations',
  },
];

// Group users by type for easier display
export const HQ_USERS = MOCK_USERS.filter(u => u.job_grade.startsWith('G'));
export const STORE_USERS = MOCK_USERS.filter(u => u.job_grade.startsWith('S'));

interface UserContextType {
  currentUser: MockUser;
  setCurrentUser: (user: MockUser) => void;
  availableUsers: MockUser[];
  hqUsers: MockUser[];
  storeUsers: MockUser[];
  isUserSwitcherOpen: boolean;
  setIsUserSwitcherOpen: (open: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'aoisora_test_user';

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
        hqUsers: HQ_USERS,
        storeUsers: STORE_USERS,
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
