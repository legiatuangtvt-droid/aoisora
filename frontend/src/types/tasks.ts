// Task Status Types
export type TaskStatus = 'NOT_YET' | 'DONE' | 'DRAFT';
export type HQCheckStatus = 'NOT_YET' | 'DONE' | 'DRAFT';

// Status Display Config
export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  NOT_YET: { label: 'Not Yet', color: 'bg-red-100 text-red-700' },
  DONE: { label: 'Done', color: 'bg-blue-100 text-blue-700' },
  DRAFT: { label: 'Draft', color: 'bg-green-100 text-green-700' }
};

// Sub Task Interface
export interface SubTask {
  id: string;
  name: string;
  status: TaskStatus;
  assignee?: string;
  completedAt?: string;
}

// Task Group Interface
export interface TaskGroup {
  id: string;
  no: number;
  dept: string;
  taskGroupName: string;
  startDate: string;
  endDate: string;
  progress: {
    completed: number;
    total: number;
  };
  unable: number;
  status: TaskStatus;
  hqCheck: HQCheckStatus;
  subTasks?: SubTask[];
  isExpanded?: boolean;
}

// Filter Interface
export interface TaskFilters {
  viewScope: string;
  departments: string[];
  status: TaskStatus[];
  hqCheck: HQCheckStatus[];
}

// Date Mode Types
export type DateMode = 'DAY' | 'WEEK' | 'CUSTOM';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

// Pagination Interface
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Department Tree Structure
export interface Department {
  id: string;
  name: string;
  code: string;
  level: number;
  children?: Department[];
}
