// ============================================
// Staff Types - HQ and Store Classification
// ============================================

// Staff Type classification
export type StaffType = 'HQ' | 'STORE';

// ============================================
// HQ JOB GRADES (G2 - G9)
// ============================================
export type HQJobGrade = 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8' | 'G9';

export const HQ_JOB_GRADES: Record<HQJobGrade, { name: string; nameVi: string; level: number }> = {
  G2: { name: 'Officer', nameVi: 'Nhan vien', level: 1 },
  G3: { name: 'Executive', nameVi: 'Chuyen vien', level: 2 },
  G4: { name: 'Deputy Manager', nameVi: 'Pho Truong phong', level: 3 },
  G5: { name: 'Manager', nameVi: 'Truong phong', level: 4 },
  G6: { name: 'General Manager', nameVi: 'Tong Giam doc phong', level: 5 },
  G7: { name: 'Senior General Manager', nameVi: 'Giam doc khoi', level: 6 },
  G8: { name: 'CCO', nameVi: 'Giam doc dieu hanh', level: 7 },
  G9: { name: 'General Director', nameVi: 'Tong Giam doc', level: 8 },
};

export const HQ_JOB_GRADE_COLORS: Record<HQJobGrade, string> = {
  G2: '#9CA3AF', // Gray
  G3: '#22A6A1', // Teal
  G4: '#1F7BF2', // Blue
  G5: '#8B5CF6', // Purple
  G6: '#FF9900', // Orange
  G7: '#DC2626', // Red
  G8: '#991B1B', // Dark Red
  G9: '#7C3AED', // Violet
};

// ============================================
// STORE JOB GRADES (S1 - S6)
// ============================================
export type StoreJobGrade = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';

export const STORE_JOB_GRADES: Record<StoreJobGrade, { name: string; nameVi: string; level: number; scope: string }> = {
  S1: { name: 'Staff', nameVi: 'Nhan vien cua hang', level: 1, scope: 'NONE' },
  S2: { name: 'Store Leader G2', nameVi: 'Pho Truong cua hang', level: 2, scope: 'STORE' },
  S3: { name: 'Store Leader G3', nameVi: 'Truong cua hang', level: 3, scope: 'STORE' },
  S4: { name: 'Store In-charge', nameVi: 'Truong cum cua hang', level: 4, scope: 'MULTI_STORE' },
  S5: { name: 'Area Manager', nameVi: 'Quan ly khu vuc', level: 5, scope: 'AREA' },
  S6: { name: 'Region Manager', nameVi: 'Quan ly mien', level: 6, scope: 'REGION' },
};

export const STORE_JOB_GRADE_COLORS: Record<StoreJobGrade, string> = {
  S1: '#9CA3AF', // Gray
  S2: '#81AADB', // Light Blue
  S3: '#22A6A1', // Teal
  S4: '#1F7BF2', // Blue
  S5: '#8B5CF6', // Purple
  S6: '#FF9900', // Orange
};

// ============================================
// COMBINED JOB GRADE (for backward compatibility)
// ============================================
export type JobGrade = HQJobGrade | StoreJobGrade;

// Combined colors for all grades
export const JOB_GRADE_COLORS: Record<string, string> = {
  ...HQ_JOB_GRADE_COLORS,
  ...STORE_JOB_GRADE_COLORS,
  // Legacy G1-G8 mapping (for existing data)
  G1: '#9CA3AF',
};

// ============================================
// SYSTEM ROLES
// ============================================
export type SystemRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'STAFF' | 'VIEWER';

export const SYSTEM_ROLES: Record<SystemRole, { name: string; level: number }> = {
  SUPER_ADMIN: { name: 'Super Admin', level: 100 },
  ADMIN: { name: 'Admin', level: 90 },
  MANAGER: { name: 'Manager', level: 70 },
  SUPERVISOR: { name: 'Supervisor', level: 50 },
  STAFF: { name: 'Staff', level: 30 },
  VIEWER: { name: 'Viewer', level: 10 },
};

// ============================================
// MANAGEMENT SCOPES
// ============================================
export type ManagementScope =
  | 'NONE'
  | 'TEAM'
  | 'DEPARTMENT'
  | 'STORE'
  | 'MULTI_STORE'
  | 'AREA'
  | 'REGION'
  | 'COMPANY';

export const MANAGEMENT_SCOPES: Record<ManagementScope, { name: string; level: number }> = {
  NONE: { name: 'No Management', level: 0 },
  TEAM: { name: 'Team', level: 1 },
  DEPARTMENT: { name: 'Department', level: 2 },
  STORE: { name: 'Single Store', level: 3 },
  MULTI_STORE: { name: 'Multi Store', level: 4 },
  AREA: { name: 'Area', level: 5 },
  REGION: { name: 'Region', level: 6 },
  COMPANY: { name: 'Company', level: 7 },
};

// ============================================
// STAFF INTERFACE (Extended)
// ============================================
export interface Staff {
  id: string;
  staffCode: string;
  sapCode?: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;

  // Classification
  staffType: StaffType;
  jobGrade: string; // G2-G9 for HQ, S1-S6 for Store
  position: string;
  role: SystemRole;

  // Organization (HQ)
  departmentId?: string;
  departmentName?: string;
  teamId?: string;
  teamName?: string;

  // Store Assignment (Store staff)
  storeId?: string;
  storeName?: string;
  storeCode?: string;

  // Reporting
  lineManagerId?: string;
  lineManagerName?: string;

  // Status
  status: 'active' | 'inactive' | 'on_leave' | 'suspended' | 'terminated';
  joiningDate?: string;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a staff member is HQ staff
 */
export const isHQStaff = (staff: { staffType?: StaffType; storeId?: string | null }): boolean => {
  if (staff.staffType) return staff.staffType === 'HQ';
  return !staff.storeId || staff.storeId === null;
};

/**
 * Check if a staff member is Store staff
 */
export const isStoreStaff = (staff: { staffType?: StaffType; storeId?: string | null }): boolean => {
  if (staff.staffType) return staff.staffType === 'STORE';
  return !!staff.storeId;
};

/**
 * Get grade info from grade code
 */
export const getGradeInfo = (gradeCode: string): { name: string; nameVi: string; color: string; type: StaffType } | null => {
  if (gradeCode in HQ_JOB_GRADES) {
    const grade = HQ_JOB_GRADES[gradeCode as HQJobGrade];
    return {
      name: grade.name,
      nameVi: grade.nameVi,
      color: HQ_JOB_GRADE_COLORS[gradeCode as HQJobGrade],
      type: 'HQ',
    };
  }
  if (gradeCode in STORE_JOB_GRADES) {
    const grade = STORE_JOB_GRADES[gradeCode as StoreJobGrade];
    return {
      name: grade.name,
      nameVi: grade.nameVi,
      color: STORE_JOB_GRADE_COLORS[gradeCode as StoreJobGrade],
      type: 'STORE',
    };
  }
  return null;
};

/**
 * Get grade color (supports both HQ and Store grades, plus legacy G1-G8)
 */
export const getGradeColor = (gradeCode: string): string => {
  return JOB_GRADE_COLORS[gradeCode] || '#9CA3AF';
};

/**
 * Get grade display name
 */
export const getGradeName = (gradeCode: string): string => {
  if (gradeCode in HQ_JOB_GRADES) {
    return HQ_JOB_GRADES[gradeCode as HQJobGrade].name;
  }
  if (gradeCode in STORE_JOB_GRADES) {
    return STORE_JOB_GRADES[gradeCode as StoreJobGrade].name;
  }
  return gradeCode;
};

/**
 * Check if grade is a management level
 */
export const isManagementGrade = (gradeCode: string): boolean => {
  // HQ: G4+ (Deputy Manager and above)
  if (gradeCode in HQ_JOB_GRADES) {
    return HQ_JOB_GRADES[gradeCode as HQJobGrade].level >= 3;
  }
  // Store: S2+ (Store Leader G2 and above)
  if (gradeCode in STORE_JOB_GRADES) {
    return STORE_JOB_GRADES[gradeCode as StoreJobGrade].level >= 2;
  }
  return false;
};

/**
 * Get management scope for a grade
 */
export const getGradeManagementScope = (gradeCode: string): ManagementScope => {
  if (gradeCode in STORE_JOB_GRADES) {
    return STORE_JOB_GRADES[gradeCode as StoreJobGrade].scope as ManagementScope;
  }
  // HQ grades
  const hqScopes: Record<string, ManagementScope> = {
    G2: 'NONE',
    G3: 'NONE',
    G4: 'TEAM',
    G5: 'DEPARTMENT',
    G6: 'DEPARTMENT',
    G7: 'COMPANY',
    G8: 'COMPANY',
    G9: 'COMPANY',
  };
  return hqScopes[gradeCode] || 'NONE';
};

/**
 * Compare two grades (returns positive if grade1 > grade2)
 */
export const compareGrades = (grade1: string, grade2: string): number => {
  const getLevel = (grade: string): number => {
    if (grade in HQ_JOB_GRADES) return HQ_JOB_GRADES[grade as HQJobGrade].level + 10; // HQ grades are higher
    if (grade in STORE_JOB_GRADES) return STORE_JOB_GRADES[grade as StoreJobGrade].level;
    return 0;
  };
  return getLevel(grade1) - getLevel(grade2);
};
