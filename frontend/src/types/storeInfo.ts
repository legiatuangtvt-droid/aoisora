// Store Information Types - SCR_STORE_INFO

// Import from centralized staff types
import {
  StaffType,
  StoreJobGrade as StoreGradeType,
  STORE_JOB_GRADES,
  STORE_JOB_GRADE_COLORS as STORE_GRADE_COLORS,
  getGradeColor,
  getGradeName,
} from './staff';

// Re-export for backward compatibility
export { getGradeColor, getGradeName };

// RegionId can be any string since it comes from database
export type RegionId = string;

// Legacy type - use StoreGradeType from staff.ts instead
export type StoreJobGrade = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8' | StoreGradeType;

export interface StoreStaff {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  jobGrade: string;
  staffType?: StaffType;
  sapCode?: string;
  phone?: string;
  email?: string;
  joiningDate?: string;
  storeName?: string;
  storeCode?: string;
  status?: 'Active' | 'Inactive';
}

// Job Grade colors for store staff (using centralized colors)
export const STORE_JOB_GRADE_COLORS: Record<string, string> = {
  // Store grades (S1-S6)
  ...STORE_GRADE_COLORS,
  // Legacy HQ grades displayed in store context (G1-G8)
  'G1': '#9CA3AF', // gray
  'G2': '#81AADB', // light blue
  'G3': '#22A6A1', // teal/green
  'G4': '#1F7BF2', // blue
  'G5': '#8B5CF6', // purple
  'G6': '#FF9900', // orange
  'G7': '#DC2626', // red
  'G8': '#991B1B', // dark red
};

// Job Grade titles for store staff
export const STORE_JOB_GRADE_TITLES: Record<string, string> = {
  // Store grades (S1-S6)
  'S1': STORE_JOB_GRADES.S1.name,
  'S2': STORE_JOB_GRADES.S2.name,
  'S3': STORE_JOB_GRADES.S3.name,
  'S4': STORE_JOB_GRADES.S4.name,
  'S5': STORE_JOB_GRADES.S5.name,
  'S6': STORE_JOB_GRADES.S6.name,
  // Legacy HQ grades (G1-G8)
  'G1': 'Officer',
  'G2': 'Senior Officer',
  'G3': 'Executive',
  'G4': 'Deputy Manager',
  'G5': 'Manager',
  'G6': 'General Manager',
  'G7': 'Senior General Manager',
  'G8': 'CCO',
};

export interface Store {
  id: string;
  code: string;
  name: string;
  manager?: StoreStaff;
  staffCount: number;
  staffList?: StoreStaff[];
  isExpanded?: boolean;
}

export interface StoreDepartment {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  staffList?: StoreStaff[];
  isExpanded?: boolean;
}

export interface Area {
  id: string;
  name: string;
  storeCount: number;
  stores: Store[];
  departments: StoreDepartment[];
  isExpanded?: boolean;
}

export interface Region {
  id: RegionId;
  name: string;
  label: string;
  areas: Area[];
}

export interface RegionTab {
  id: RegionId;
  label: string;
}

// Store Department configurations
export const STORE_DEPARTMENT_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  'ZEN_PARK': { icon: 'park', color: '#109A4A', bg: 'rgba(16, 154, 74, 0.1)' },
  'CONTROL': { icon: 'control', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)' },
  'IMPROVEMENT': { icon: 'rocket', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)' },
  'HR': { icon: 'hr', color: '#E11D48', bg: 'rgba(225, 29, 72, 0.1)' },
};
