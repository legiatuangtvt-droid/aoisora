// User Information Types - SCR_USER_INFO

// Job Grades - Two parallel systems
// HQ Job Grades (G2-G9): Headquarter staff
// Store Job Grades (S1-S6): Store staff
export type HQJobGrade = 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8' | 'G9';
export type StoreJobGrade = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7';
export type JobGrade = HQJobGrade | StoreJobGrade;

export type DepartmentId = 'SMBU' | 'Admin' | 'OP' | 'CONTROL' | 'IMPROVEMENT' | 'HR' | 'MG' | 'MD';

export interface Employee {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  jobGrade: JobGrade;
  sapCode?: string;
  phone?: string;
  email?: string;
  joiningDate?: string;
  lineManager?: {
    id: string;
    name: string;
    sapCode: string;
    avatar?: string;
  };
  organization?: {
    division: string;
    department: string;
    section?: string;
    location?: string;
  };
  status?: 'Active' | 'Inactive';
}

export interface Team {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  members: Employee[];
  gradeRange: string;
  isExpanded?: boolean;
}

export interface Department {
  id: DepartmentId;
  name: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  memberCount: number;
  gradeRange: string;
  head?: Employee;
  teams?: Team[];
  isExpanded?: boolean;
}

export interface HierarchyNode {
  rootUser: Employee;
  departments: Department[];
}

// Job Grade colors (from spec - app-general-detail.md Section 10)
// HQ Grades: G2-G9
// Store Grades: S1-S6
export const JOB_GRADE_COLORS: Record<JobGrade, string> = {
  // HQ Job Grades (G2-G9)
  'G2': '#9CA3AF', // gray - Officer
  'G3': '#22A6A1', // teal - Executive
  'G4': '#1F7BF2', // blue - Deputy Manager
  'G5': '#8B5CF6', // purple - Manager
  'G6': '#FF9900', // orange - General Manager
  'G7': '#DC2626', // red - Senior General Manager
  'G8': '#991B1B', // dark red - CCO
  'G9': '#7C3AED', // purple - General Director
  // Store Job Grades (S1-S7)
  'S1': '#9CA3AF', // gray - Staff
  'S2': '#81AADB', // light blue - Deputy Store Leader
  'S3': '#22A6A1', // teal - Store Leader
  'S4': '#1F7BF2', // blue - Store In-charge
  'S5': '#8B5CF6', // purple - Area Manager
  'S6': '#FF9900', // orange - Zone Manager
  'S7': '#DC2626', // red - Regional Manager
};

// Job Grade titles (Vietnamese)
export const JOB_GRADE_TITLES_VI: Record<JobGrade, string> = {
  // HQ Job Grades
  'G2': 'Nhân viên',
  'G3': 'Chuyên viên',
  'G4': 'Phó Trưởng phòng',
  'G5': 'Trưởng phòng',
  'G6': 'Tổng Giám đốc phòng',
  'G7': 'Giám đốc khối',
  'G8': 'Giám đốc điều hành',
  'G9': 'Tổng Giám đốc',
  // Store Job Grades
  'S1': 'Nhân viên cửa hàng',
  'S2': 'Phó Trưởng cửa hàng',
  'S3': 'Trưởng cửa hàng',
  'S4': 'Trưởng cụm cửa hàng',
  'S5': 'Quản lý khu vực',
  'S6': 'Quản lý zone',
  'S7': 'Quản lý miền',
};

// Job Grade titles (English)
export const JOB_GRADE_TITLES: Record<JobGrade, string> = {
  // HQ Job Grades
  'G2': 'Officer',
  'G3': 'Executive',
  'G4': 'Deputy Manager',
  'G5': 'Manager',
  'G6': 'General Manager',
  'G7': 'Senior General Manager',
  'G8': 'CCO',
  'G9': 'General Director',
  // Store Job Grades
  'S1': 'Staff',
  'S2': 'Deputy Store Leader',
  'S3': 'Store Leader',
  'S4': 'Store In-charge',
  'S5': 'Area Manager',
  'S6': 'Zone Manager',
  'S7': 'Regional Manager',
};

// Management Scope by Job Grade
export type ManagementScope = 'NONE' | 'TEAM' | 'DEPARTMENT' | 'DIVISION' | 'COMPANY' | 'STORE' | 'MULTI_STORE' | 'AREA' | 'REGION';

export const JOB_GRADE_SCOPE: Record<JobGrade, ManagementScope> = {
  // HQ Job Grades
  'G2': 'NONE',
  'G3': 'NONE',
  'G4': 'TEAM',
  'G5': 'DEPARTMENT',
  'G6': 'DEPARTMENT',
  'G7': 'DIVISION',
  'G8': 'COMPANY',
  'G9': 'COMPANY',
  // Store Job Grades
  'S1': 'NONE',
  'S2': 'STORE',
  'S3': 'STORE',
  'S4': 'MULTI_STORE',
  'S5': 'AREA',
  'S6': 'AREA', // Zone Manager - manages zones within area
  'S7': 'REGION',
};

// Job Grade Level (for comparison/hierarchy)
export const JOB_GRADE_LEVEL: Record<JobGrade, number> = {
  // HQ Job Grades (1-8)
  'G2': 1,
  'G3': 2,
  'G4': 3,
  'G5': 4,
  'G6': 5,
  'G7': 6,
  'G8': 7,
  'G9': 8,
  // Store Job Grades (1-7)
  'S1': 1,
  'S2': 2,
  'S3': 3,
  'S4': 4,
  'S5': 5,
  'S6': 6,
  'S7': 7,
};

// Department icons and colors
export const DEPARTMENT_CONFIG: Record<DepartmentId, { icon: string; color: string; bg: string }> = {
  'SMBU': { icon: 'building', color: '#C5055B', bg: 'rgba(197, 5, 91, 0.1)' },
  'Admin': { icon: 'admin', color: '#233D62', bg: 'rgba(35, 61, 98, 0.1)' },
  'OP': { icon: 'cog', color: '#0D9488', bg: 'rgba(13, 148, 136, 0.1)' },
  'CONTROL': { icon: 'controller', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)' },
  'IMPROVEMENT': { icon: 'rocket', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)' },
  'HR': { icon: 'users', color: '#E11D48', bg: 'rgba(225, 29, 72, 0.1)' },
  'MG': { icon: 'chart', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  'MD': { icon: 'crown', color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)' },
};
