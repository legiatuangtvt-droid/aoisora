// Task Library Types - SCR_TASK_LIBRARY

export type TaskType = 'Daily' | 'Weekly' | 'Ad hoc';

export type TaskStatus = 'In progress' | 'Draft' | 'Available';

export type TaskCategory = 'office' | 'store';

export type DepartmentType = 'Admin' | 'HR' | 'Legal';

export interface TaskOwner {
  id: string;
  name: string;
  avatar?: string;
}

export interface TaskTemplate {
  id: string;
  no: number;
  type: TaskType;
  taskName: string;
  owner: TaskOwner;
  lastUpdate: string;
  status: TaskStatus;
  usage: number;
  department: DepartmentType;
  category: TaskCategory;
}

export interface TaskGroup {
  department: DepartmentType;
  icon: string;
  color: string;
  tasks: TaskTemplate[];
  isExpanded: boolean;
}

export interface TaskLibraryFilters {
  category: TaskCategory;
  departments: DepartmentType[];
  searchQuery: string;
}

// Status color mapping
export const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string }> = {
  'In progress': { bg: 'bg-orange-100', text: 'text-orange-600' },
  'Draft': { bg: 'bg-green-100', text: 'text-green-600' },
  'Available': { bg: 'bg-blue-100', text: 'text-blue-600' },
};

// Department color mapping
export const DEPARTMENT_COLORS: Record<DepartmentType, string> = {
  'Admin': '#E91E63',
  'HR': '#9C27B0',
  'Legal': '#4CAF50',
};

// Department icons
export const DEPARTMENT_ICONS: Record<DepartmentType, string> = {
  'Admin': '/icons/admin.png',
  'HR': '/icons/hr.png',
  'Legal': '/icons/legal.png',
};
