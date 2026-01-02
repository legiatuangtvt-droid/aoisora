// User Information Types - SCR_USER_INFO

export type JobGrade = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8';

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

// Job Grade colors (from Figma design)
export const JOB_GRADE_COLORS: Record<JobGrade, string> = {
  'G1': '#9CA3AF', // gray
  'G2': '#81AADB', // light blue
  'G3': '#22A6A1', // teal/green
  'G4': '#1F7BF2', // blue
  'G5': '#8B5CF6', // purple
  'G6': '#FF9900', // orange
  'G7': '#DC2626', // red
  'G8': '#991B1B', // dark red
};

// Job Grade titles
export const JOB_GRADE_TITLES: Record<JobGrade, string> = {
  'G1': 'Officer',
  'G2': 'Senior Officer',
  'G3': 'Executive',
  'G4': 'Deputy Manager',
  'G5': 'Manager',
  'G6': 'General Manager',
  'G7': 'Senior General Manager',
  'G8': 'CCO',
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
