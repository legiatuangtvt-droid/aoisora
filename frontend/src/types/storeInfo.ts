// Store Information Types - SCR_STORE_INFO

export type RegionId = 'SMBU' | 'OCEAN' | 'HA_NOI_CENTER' | 'ECO_PARK' | 'HA_DONG' | 'NGD';

export interface StoreStaff {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  jobGrade: string;
}

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
