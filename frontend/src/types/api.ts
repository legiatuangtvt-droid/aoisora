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
  parent_id: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Store {
  store_id: number;
  store_name: string;
  store_code: string | null;
  region_id: number | null;
  area_id: number | null;
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
  job_grade?: string | null;  // Optional - may not exist in all contexts
  role: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  store?: Store;
  department?: Department;
}

// Minimal staff info returned in list views (from TaskListResource)
export interface StaffSummary {
  staff_id: number;
  staff_name: string;
  job_grade: string | null;
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
  // Task hierarchy (max 5 levels: 1=parent, 2-5=sub-tasks)
  parent_task_id?: number | null;
  task_level?: number;
  // Basic info
  task_name: string;
  task_description: string | null;
  // A. Information fields
  frequency_type?: string | null;  // yearly, quarterly, monthly, weekly, daily
  execution_time?: string | null;  // 30min, 1hour, 2hours, etc.
  // B. Instructions fields
  task_instruction_type?: 'image' | 'document' | null;
  manual_link?: string | null;
  photo_guidelines?: string[] | null;  // Array of URLs
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
  // Approval workflow fields
  source?: string | null;
  approver_id?: number | null;
  approved_by?: number | null;
  approved_at?: string | null;
  rejection_count?: number;
  has_changes_since_rejection?: boolean;
  last_rejection_reason?: string | null;
  last_rejected_at?: string | null;
  last_rejected_by?: number | null;
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
  approver?: Staff;
  // API response uses "createdBy" (from TaskListResource)
  createdBy?: StaffSummary;
  checklists?: TaskCheckList[];
  // Nested sub-tasks (recursive structure, max 5 levels)
  sub_tasks?: Task[];
  // Store progress (calculated from task_store_assignments)
  store_progress?: {
    not_yet: number;
    on_progress: number;
    done_pending: number;
    done: number;
    unable: number;
    total: number;
    completed_count: number;
    completion_rate: number;
  };
  // Calculated status from store assignments (not_yet, on_progress, done, overdue)
  calculated_status?: string;
}

// Task Progress Response (from GET /tasks/{id}/progress)
export interface TaskStoreAssignment {
  id: number;
  store_id: number;
  store_name: string;
  status: 'not_yet' | 'on_progress' | 'done_pending' | 'done' | 'unable';
  assigned_to_staff: {
    id: number;
    name: string;
  } | null;
  started_at: string | null;
  completed_at: string | null;
  completed_by: {
    id: number;
    name: string;
  } | null;
  execution_time_minutes: number | null;
  unable_reason: string | null;
  notes: string | null;
}

export interface TaskProgressResponse {
  task_id: number;
  task_name: string;
  calculated_status: string;
  progress: {
    not_yet: number;
    on_progress: number;
    done_pending: number;
    done: number;
    unable: number;
    total: number;
    completed_count: number;
    completion_rate: number;
  };
  avg_execution_time_minutes: number | null;
  assignments: TaskStoreAssignment[];
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
  // Task creation source
  source?: string;
  // Task frequency type: yearly, quarterly, monthly, weekly, daily
  // Used for validation with date range
  frequency_type?: string;
  // Task hierarchy (max 5 levels)
  parent_task_id?: number;
  task_level?: number;
  // Nested sub-tasks for creation (recursive)
  sub_tasks?: TaskCreate[];
  // Scope (Store hierarchy) - for task_list source
  scope_region_id?: number | null;
  scope_zone_id?: number | null;
  scope_area_id?: number | null;
  scope_store_ids?: number[] | null;
  // Receiver type: store or hq_user
  receiver_type?: 'store' | 'hq_user';
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
  // Task frequency type: yearly, quarterly, monthly, weekly, daily
  // Used for validation with date range
  frequency_type?: string;
  // Task hierarchy
  task_level?: number;
  sub_tasks?: TaskCreate[];
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
// Task Library Types (Master Task Data)
// ============================================

export interface TaskLibrary {
  task_lib_id: number;
  group_id: string;
  task_code: string;  // POS-001, PERI-002
  task_name: string;
  task_type: 'Fixed' | 'CTM' | 'Product';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  frequency_number: number;
  re_unit: number;  // Experience points
  manual_number: string | null;
  manual_link: string | null;
  note: string | null;
  concurrent_performers: number;
  allowed_positions: string[] | null;  // ["POS", "Leader", "MMD"]
  time_windows: { startTime: string; endTime: string }[] | null;
  shift_placement: { type: string } | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  task_group?: TaskGroup;
}

export interface TaskLibraryCreate {
  group_id: string;
  task_code: string;
  task_name: string;
  task_type?: string;
  frequency?: string;
  frequency_number?: number;
  re_unit?: number;
  manual_number?: string;
  manual_link?: string;
  note?: string;
  concurrent_performers?: number;
  allowed_positions?: string[];
  time_windows?: { startTime: string; endTime: string }[];
  shift_placement?: { type: string };
}

export interface TaskLibraryUpdate {
  task_name?: string;
  task_type?: string;
  frequency?: string;
  frequency_number?: number;
  re_unit?: number;
  manual_number?: string;
  manual_link?: string;
  note?: string;
  concurrent_performers?: number;
  allowed_positions?: string[];
  time_windows?: { startTime: string; endTime: string }[];
  shift_placement?: { type: string };
  is_active?: boolean;
}

// ============================================
// Daily Template Types
// ============================================

export interface REParameters {
  areaSize: number;
  customerCount: number;
  customerCountByHour: Record<string, number>;
  dryGoodsVolume: number;
  employeeCount: number;
  posCount: number;
  vegetableWeight: number;
}

export interface ScheduledTaskItem {
  groupId: string;
  startTime: string;  // HH:MM
  taskCode: string;
  taskName: string;
  isComplete?: number;  // 0 or 1
}

export interface ShiftMapping {
  positionId: string;  // LEADER, POS, MERCHANDISE, MMD, CAFE
  shiftCode: string;   // V812, V829
}

export interface DailyTemplate {
  template_id: number;
  template_code: string;  // WEEKDAY, WEEKEND, HOLIDAY
  template_name: string;
  store_id: number | null;
  hourly_manhours: Record<string, number>;  // {"6": 5, "7": 5}
  hourly_customers: Record<string, number>;  // {"6": 70, "7": 80}
  re_parameters: REParameters | null;
  total_manhour: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  shift_templates?: ShiftTemplate[];
}

export interface DailyTemplateCreate {
  template_code: string;
  template_name: string;
  store_id?: number;
  hourly_manhours?: Record<string, number>;
  hourly_customers?: Record<string, number>;
  re_parameters?: REParameters;
  total_manhour?: number;
}

export interface DailyTemplateUpdate {
  template_name?: string;
  hourly_manhours?: Record<string, number>;
  hourly_customers?: Record<string, number>;
  re_parameters?: REParameters;
  total_manhour?: number;
  is_active?: boolean;
}

export interface ShiftTemplate {
  shift_template_id: number;
  template_id: number;
  shift_key: string;  // shift-1, shift-2
  position_id: string | null;  // LEADER, POS, MERCHANDISE
  shift_code: string | null;  // V812, V829
  scheduled_tasks: ScheduledTaskItem[];
  created_at: string;
  updated_at: string;
}

export interface ShiftTemplateCreate {
  template_id: number;
  shift_key: string;
  position_id?: string;
  shift_code?: string;
  scheduled_tasks?: ScheduledTaskItem[];
}

export interface ShiftTemplateUpdate {
  position_id?: string;
  shift_code?: string;
  scheduled_tasks?: ScheduledTaskItem[];
}

// ============================================
// Daily Schedule Task Types (DWS)
// ============================================

// Task Status constants (matches code_master with code_type='TASK_STATUS')
export const TaskStatus = {
  NOT_YET: 1,      // Task not started
  DONE: 2,         // Task completed successfully
  SKIPPED: 3,      // Task was skipped
  IN_PROGRESS: 4,  // Task is currently in progress
} as const;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

// Get status name from status code
export function getTaskStatusName(status: number): string {
  const statusMap: Record<number, string> = {
    [TaskStatus.NOT_YET]: 'Not Yet',
    [TaskStatus.DONE]: 'Done',
    [TaskStatus.SKIPPED]: 'Skipped',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
  };
  return statusMap[status] || 'Unknown';
}

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
  status: number;      // 1=Not Yet, 2=Done, 3=Skipped, 4=In Progress
  status_name?: string;  // Computed from status code
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
  status?: number;
  notes?: string;
}

export interface DailyScheduleTaskUpdate {
  status?: number;
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
// Manual/Knowledge Base Types
// ============================================

export interface ManualFolder {
  folder_id: number;
  folder_name: string;
  parent_folder_id: number | null;
  store_id: number | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ManualFolderWithStats extends ManualFolder {
  document_count: number;
  child_folder_count: number;
  total_views: number;
}

export interface ManualDocument {
  document_id: number;
  folder_id: number | null;
  document_code: string | null;
  document_name: string;
  description: string | null;
  content_type: string;
  content: string | null;
  external_url: string | null;
  thumbnail_url: string | null;
  tags: string[] | null;
  status: string;
  published_at: string | null;
  view_count: number;
  version: number;
  store_id: number | null;
  is_public: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ManualFolderCreate {
  folder_name: string;
  parent_folder_id?: number;
  store_id?: number;
  description?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  created_by?: number;
}

export interface ManualFolderUpdate {
  folder_name?: string;
  parent_folder_id?: number;
  store_id?: number;
  description?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface ManualDocumentCreate {
  folder_id?: number;
  document_code?: string;
  document_name: string;
  description?: string;
  content_type?: string;
  content?: string;
  external_url?: string;
  thumbnail_url?: string;
  tags?: string[];
  status?: string;
  store_id?: number;
  is_public?: boolean;
  created_by?: number;
}

export interface ManualDocumentUpdate {
  folder_id?: number;
  document_code?: string;
  document_name?: string;
  description?: string;
  content_type?: string;
  content?: string;
  external_url?: string;
  thumbnail_url?: string;
  tags?: string[];
  status?: string;
  store_id?: number;
  is_public?: boolean;
  updated_by?: number;
}

export interface FolderBrowseResponse {
  current_folder: ManualFolder | null;
  breadcrumb: ManualFolder[];
  folders: ManualFolderWithStats[];
  documents: ManualDocument[];
  total_folders: number;
  total_documents: number;
}

export interface ManualSearchResult {
  type: 'folder' | 'document';
  folder?: ManualFolder;
  document?: ManualDocument;
}

export interface ManualSearchResponse {
  query: string;
  results: ManualSearchResult[];
  total: number;
}

// ManualStep Types (Teachme Biz style)
export interface Annotation {
  type: 'rectangle' | 'circle' | 'text' | 'arrow' | 'blur' | 'highlight' | 'subtitle' | 'marker';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  stroke_width?: number;
  fill_color?: string;
  font_size?: number;
  text?: string;
  start_time?: number;
  end_time?: number;
  duration?: number;
}

export interface ManualStep {
  step_id: number;
  document_id: number;
  step_number: number;
  step_type: 'cover' | 'step';
  title: string | null;
  description: string | null;
  media_type: 'image' | 'video' | null;
  media_url: string | null;
  media_thumbnail: string | null;
  annotations: Annotation[];
  video_trim_start: number | null;
  video_trim_end: number | null;
  video_muted: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ManualStepCreate {
  document_id: number;
  step_number: number;
  step_type?: 'cover' | 'step';
  title?: string;
  description?: string;
  media_type?: 'image' | 'video';
  media_url?: string;
  media_thumbnail?: string;
  annotations?: Annotation[];
  video_trim_start?: number;
  video_trim_end?: number;
  video_muted?: boolean;
  sort_order?: number;
}

export interface ManualStepUpdate {
  step_number?: number;
  step_type?: 'cover' | 'step';
  title?: string;
  description?: string;
  media_type?: 'image' | 'video';
  media_url?: string;
  media_thumbnail?: string;
  annotations?: Annotation[];
  video_trim_start?: number;
  video_trim_end?: number;
  video_muted?: boolean;
  sort_order?: number;
  is_active?: boolean;
}

export interface ManualDocumentWithSteps extends ManualDocument {
  steps: ManualStep[];
  folder: ManualFolder | null;
}

// ManualMedia Types
export interface ManualMedia {
  media_id: number;
  document_id: number | null;
  step_id: number | null;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  file_url: string;
  thumbnail_url: string | null;
  edited_url: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  uploaded_by: number | null;
  created_at: string;
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
