// Todo Task Types - SCR_TODO_TASK

// Task status types
export type TaskStatus = 'in_process' | 'done' | 'draft' | 'not_yet';

// Task type categories
export type TaskType = 'personal' | 'team' | 'store';

// Status badge configuration
export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor?: string;
  dotColor?: string;
}

export const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  in_process: {
    label: 'In process',
    color: 'text-[#EDA600]',
    bgColor: 'bg-[#EDA600]/5',
    borderColor: 'border-[#EDA600]',
    dotColor: 'bg-[#EDA600]',
  },
  done: {
    label: 'Done',
    color: 'text-[#297EF6]',
    bgColor: 'bg-[#E5F0FF]',
    borderColor: 'border-[#297EF6]',
    dotColor: 'bg-[#297EF6]',
  },
  draft: {
    label: 'Draft',
    color: 'text-[#1BBA5E]',
    bgColor: 'bg-[#EBFFF3]',
    borderColor: 'border-[#1BBA5E]',
    dotColor: 'bg-[#1BBA5E]',
  },
  not_yet: {
    label: 'Not Yet',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
};

// Task type configuration
export interface TypeConfig {
  label: string;
  color: string;
}

export const TYPE_CONFIG: Record<TaskType, TypeConfig> = {
  personal: {
    label: 'Personal',
    color: 'bg-pink-500',
  },
  team: {
    label: 'Team',
    color: 'bg-cyan-500',
  },
  store: {
    label: 'Store',
    color: 'bg-green-500',
  },
};

// Individual task item
export interface TodoTask {
  id: string;
  name: string;
  type: TaskType;
  status: TaskStatus;
  dueDate: string;
}

// Location for a day
export interface DayLocation {
  code: string;
  region: string;
  zone: string;
  area?: string;
  store?: string;
}

// Daily task row data
export interface DailyTaskData {
  date: Date;
  dayOfWeek: string;
  dayNumber: number;
  month: string;
  isWeekend: boolean;
  location?: DayLocation;
  tasks: TodoTask[];
}

// Week overview task item
export interface WeekOverviewTask {
  id: string;
  name: string;
  method: string;
  target: string;
}

// Last week review task item
export interface LastWeekReviewTask {
  id: string;
  name: string;
  progress: string;
  output: string;
}

// Week info
export interface WeekInfo {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  dateRange: string;
}

// Filter options
export interface TodoFilters {
  user: string;
  status: TaskStatus | 'all';
  type: TaskType | 'all';
}

// Manager comment
export interface ManagerComment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

// Full Todo Task page data
export interface TodoTaskPageData {
  weekInfo: WeekInfo;
  overviewTasks: WeekOverviewTask[];
  lastWeekTasks: LastWeekReviewTask[];
  dailyTasks: DailyTaskData[];
  managerComments: ManagerComment[];
  otherComments: ManagerComment[];
}
