// ============================================
// API Types for OptiChain WS & DWS
// ============================================

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  staff_id: number;
  staff_name: string;
  role: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

// ============================================
// Staff & Organization Types
// ============================================

export interface Region {
  region_id: number;
  region_name: string;
  region_code: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Department {
  department_id: number;
  department_name: string;
  department_code: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Store {
  store_id: number;
  store_name: string;
  store_code: string | null;
  region_id: number | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  manager_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  region?: Region;
}

export interface Staff {
  staff_id: number;
  staff_name: string;
  staff_code: string | null;
  email: string;
  phone: string | null;
  store_id: number | null;
  department_id: number | null;
  role: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  store?: Store;
  department?: Department;
}

export interface StaffCreate {
  staff_name: string;
  staff_code?: string;
  email: string;
  phone?: string;
  store_id?: number;
  department_id?: number;
  role?: string;
  password?: string;
}

export interface StaffUpdate {
  staff_name?: string;
  staff_code?: string;
  email?: string;
  phone?: string;
  store_id?: number;
  department_id?: number;
  role?: string;
  is_active?: boolean;
}

// ============================================
// Task Types (WS - Work Schedule)
// ============================================

export interface CodeMaster {
  code_master_id: number;
  code_type: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Manual {
  manual_id: number;
  manual_name: string;
  manual_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CheckList {
  check_list_id: number;
  check_list_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TaskCheckList {
  id: number;
  task_id: number;
  check_list_id: number;
  check_status: boolean;
  completed_at: string | null;
  completed_by: number | null;
  notes: string | null;
  check_list?: CheckList;
}

export interface Task {
  task_id: number;
  task_name: string;
  task_description: string | null;
  manual_id: number | null;
  task_type_id: number | null;
  response_type_id: number | null;
  response_num: number | null;
  is_repeat: boolean;
  repeat_config: Record<string, any> | null;
  dept_id: number | null;
  assigned_store_id: number | null;
  assigned_staff_id: number | null;
  do_staff_id: number | null;
  status_id: number | null;
  priority: string;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  due_datetime: string | null;
  completed_time: string | null;
  comment: string | null;
  attachments: string[] | null;
  created_staff_id: number | null;
  created_at: string;
  updated_at: string;
  // Relationships
  manual?: Manual;
  task_type?: CodeMaster;
  response_type?: CodeMaster;
  status?: CodeMaster;
  department?: Department;
  assigned_store?: Store;
  assigned_staff?: Staff;
  do_staff?: Staff;
  created_staff?: Staff;
  checklists?: TaskCheckList[];
}

export interface TaskCreate {
  task_name: string;
  task_description?: string;
  manual_id?: number;
  task_type_id?: number;
  response_type_id?: number;
  is_repeat?: boolean;
  repeat_config?: Record<string, any>;
  dept_id?: number;
  assigned_store_id?: number;
  assigned_staff_id?: number;
  status_id?: number;
  priority?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  due_datetime?: string;
}

export interface TaskUpdate {
  task_name?: string;
  task_description?: string;
  manual_id?: number;
  task_type_id?: number;
  response_type_id?: number;
  is_repeat?: boolean;
  repeat_config?: Record<string, any>;
  dept_id?: number;
  assigned_store_id?: number;
  assigned_staff_id?: number;
  do_staff_id?: number;
  status_id?: number;
  priority?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  due_datetime?: string;
  completed_time?: string;
  comment?: string;
  attachments?: string[];
}

export interface TaskStatusUpdate {
  status_id: number;
  comment?: string;
}

export interface TaskQueryParams {
  status_id?: number;
  assigned_staff_id?: number;
  assigned_store_id?: number;
  dept_id?: number;
  priority?: string;
  start_date?: string;
  end_date?: string;
  skip?: number;
  limit?: number;
}

// ============================================
// Shift Types (DWS - Dispatch Work Schedule)
// ============================================

export interface ShiftCode {
  shift_code_id: number;
  shift_code: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  duration_hours: number | null;
  color_code: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ShiftCodeCreate {
  shift_code: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  duration_hours?: number;
  color_code?: string;
}

export interface ShiftCodeUpdate {
  shift_code?: string;
  shift_name?: string;
  start_time?: string;
  end_time?: string;
  duration_hours?: number;
  color_code?: string;
  is_active?: boolean;
}

export interface ShiftAssignment {
  assignment_id: number;
  staff_id: number;
  store_id: number | null;
  shift_date: string;
  shift_code_id: number;
  status: string;
  notes: string | null;
  assigned_by: number | null;
  assigned_at: string;
  staff?: Staff;
  store?: Store;
  shift_code?: ShiftCode;
  assigner?: Staff;
}

export interface ShiftAssignmentCreate {
  staff_id: number;
  store_id?: number;
  shift_date: string;
  shift_code_id: number;
  notes?: string;
}

export interface ShiftAssignmentUpdate {
  store_id?: number;
  shift_code_id?: number;
  status?: string;
  notes?: string;
}

export interface BulkShiftAssignmentCreate {
  staff_ids: number[];
  store_id?: number;
  shift_dates: string[];
  shift_code_id: number;
  notes?: string;
}

export interface DailySchedule {
  date: string;
  staff: Staff;
  shift?: ShiftAssignment;
}

export interface WeeklySchedule {
  staff: Staff;
  assignments: Record<string, ShiftAssignment | null>;
}

export interface ManHourSummary {
  date: string;
  store_id: number;
  store_name: string;
  total_hours: number;
  target_hours: number;
  difference: number;
  status: 'THỪA' | 'THIẾU' | 'ĐẠT CHUẨN';
  staff_count: number;
}

// ============================================
// Task Group Types (DWS - Daily Schedule)
// ============================================

export interface TaskGroup {
  group_id: string;  // POS, PERI, DRY, etc.
  group_code: string;
  group_name: string | null;
  priority: number;
  sort_order: number;
  color_bg: string | null;    // #e2e8f0
  color_text: string | null;  // #1e293b
  color_border: string | null; // #94a3b8
  is_active: boolean;
  created_at: string;
}

export interface TaskGroupCreate {
  group_id: string;
  group_code: string;
  group_name?: string;
  priority?: number;
  sort_order?: number;
  color_bg?: string;
  color_text?: string;
  color_border?: string;
  is_active?: boolean;
}

// ============================================
// Daily Schedule Task Types (DWS)
// ============================================

export interface DailyScheduleTask {
  schedule_task_id: number;
  staff_id: number;
  store_id: number | null;
  schedule_date: string;  // YYYY-MM-DD
  group_id: string | null;
  task_code: string;
  task_name: string;
  start_time: string;  // HH:MM:SS
  end_time: string;    // HH:MM:SS
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  task_group?: TaskGroup;
}

export interface DailyScheduleTaskCreate {
  staff_id: number;
  store_id?: number;
  schedule_date: string;
  group_id?: string;
  task_code: string;
  task_name: string;
  start_time: string;
  end_time: string;
  status?: string;
  notes?: string;
}

export interface DailyScheduleTaskUpdate {
  status?: string;
  notes?: string;
  completed_at?: string;
}

export interface StaffDailySchedule {
  staff_id: number;
  staff_name: string;
  schedule_date: string;
  tasks: DailyScheduleTask[];
  total_tasks: number;
  completed_tasks: number;
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
  notification_id: number;
  recipient_staff_id: number;
  sender_staff_id: number | null;
  notification_type: string;
  title: string;
  message: string | null;
  link_url: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  sender_name?: string;
}

export interface NotificationCreate {
  recipient_staff_id: number;
  sender_staff_id?: number;
  notification_type: string;
  title: string;
  message?: string;
  link_url?: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unread_count: number;
}

// ============================================
// Pagination & Common Types
// ============================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}

// Status code mappings
export const TASK_STATUS = {
  NOT_YET: 7,
  ON_PROGRESS: 8,
  DONE: 9,
  OVERDUE: 10,
  REJECT: 11,
} as const;

export const TASK_TYPE = {
  STATISTICS: 1,
  ARRANGE: 2,
  PREPARE: 3,
} as const;

export const RESPONSE_TYPE = {
  PICTURE: 4,
  CHECKLIST: 5,
  YESNO: 6,
} as const;
