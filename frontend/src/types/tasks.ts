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
  taskType?: TaskType;
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

// ========================================
// Task Detail Types (SCR_TASK_DETAIL)
// ========================================

// View modes for Task Detail
export type ViewMode = 'results' | 'comment' | 'staff';

// Task result status
export type TaskResultStatus = 'success' | 'failed' | 'in_progress' | 'not_started';

// Task type
export type TaskType = 'image' | 'yes_no' | 'text' | 'checklist';

// Image item
export interface ImageItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  count?: number;
}

// Comment
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userInitials: string;
  content: string;
  createdAt: string;
}

// Like info
export interface LikeInfo {
  count: number;
  users: { id: string; name: string; avatar?: string }[];
}

// Completed by user
export interface CompletedByUser {
  id: string;
  name: string;
  avatar?: string;
}

// Store result with images and comments
export interface StoreResult {
  id: string;
  storeId: string;
  storeName: string;
  storeLocation: string;
  startTime?: string;
  completedTime?: string;
  status: TaskResultStatus;
  completedBy?: CompletedByUser;
  images: ImageItem[];
  comments: Comment[];
  likes: LikeInfo;
}

// Requirement image (for staff card)
export interface RequirementImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  isCompleted: boolean;
}

// Staff result
export interface StaffResult {
  id: string;
  staffId: string;
  staffName: string;
  avatar?: string;
  position: string;
  store: string;
  storeId: string;
  progress: number;
  progressText: string;
  status: TaskResultStatus;
  requirements: RequirementImage[];
  comments: Comment[];
}

// Workflow step
export interface WorkflowStep {
  id: string;
  step: number;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  assignee?: CompletedByUser;
  startDay?: string;
  endDay?: string;
  comment?: string;
  skipInfo?: string;
}

// Task detail statistics
export interface TaskDetailStats {
  totalStaff: number;
  notStarted: number;
  completed: number;
  unableToComplete: number;
  avgCompletionTime: number;
}

// Task detail with full information
export interface TaskDetail {
  id: string;
  level: number;
  name: string;
  startDate: string;
  endDate: string;
  hqCheckCode: string;
  hqCheckStatus: HQCheckStatus;
  taskType: TaskType;
  manualLink?: string;
  stats: TaskDetailStats;
  storeResults: StoreResult[];
  staffResults: StaffResult[];
  workflowSteps: WorkflowStep[];
}

// Filter state for Task Detail
export interface TaskDetailFilters {
  region: string;
  area: string;
  store: string;
  location: string;
  status: string;
  search: string;
}
