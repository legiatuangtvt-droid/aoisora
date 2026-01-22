// ============================================
// API Client for OptiChain WS & DWS
// ============================================

import { fetchWithAuth } from './api/fetchWithAuth';

import type {
  LoginRequest,
  TokenResponse,
  PasswordChange,
  Staff,
  StaffCreate,
  StaffUpdate,
  Store,
  Department,
  Region,
  Task,
  TaskCreate,
  TaskUpdate,
  TaskStatusUpdate,
  TaskQueryParams,
  CheckList,
  CodeMaster,
  ShiftCode,
  ShiftCodeCreate,
  ShiftCodeUpdate,
  ShiftAssignment,
  ShiftAssignmentCreate,
  ShiftAssignmentUpdate,
  BulkShiftAssignmentCreate,
  WeeklySchedule,
  ManHourSummary,
  Notification,
  NotificationCreate,
  NotificationListResponse,
  TaskGroup,
  TaskGroupCreate,
  DailyScheduleTask,
  DailyScheduleTaskCreate,
  DailyScheduleTaskUpdate,
  StaffDailySchedule,
  TaskLibrary,
  TaskLibraryCreate,
  TaskLibraryUpdate,
  DailyTemplate,
  DailyTemplateCreate,
  DailyTemplateUpdate,
  ShiftTemplate,
  ShiftTemplateCreate,
  ShiftTemplateUpdate,
  ManualFolder,
  ManualFolderWithStats,
  ManualDocument,
  ManualFolderCreate,
  ManualFolderUpdate,
  ManualDocumentCreate,
  ManualDocumentUpdate,
  FolderBrowseResponse,
  ManualSearchResponse,
  ManualStep,
  ManualStepCreate,
  ManualStepUpdate,
  ManualDocumentWithSteps,
  ManualMedia,
  TaskProgressResponse,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ============================================
// Token Management
// ============================================
// NOTE: Token management is now handled by AuthContext and fetchWithAuth
// These functions are kept for backward compatibility but are deprecated

let accessToken: string | null = null;

/** @deprecated Use AuthContext instead */
export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem('optichain_token', token);
  } else {
    localStorage.removeItem('optichain_token');
  }
}

/** @deprecated Token is automatically retrieved by fetchWithAuth */
export function getAccessToken(): string | null {
  if (!accessToken && typeof window !== 'undefined') {
    accessToken = localStorage.getItem('optichain_token');
  }
  return accessToken;
}

/** @deprecated Use AuthContext logout instead */
export function clearAccessToken() {
  accessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('optichain_token');
    localStorage.removeItem('optichain_auth');
  }
}

// ============================================
// API Error Handling
// ============================================

export class ApiError extends Error {
  constructor(public status: number, message: string, public detail?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================
// Base Fetch Function
// ============================================

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };

  try {
    // Use fetchWithAuth for automatic 401 handling
    const response = await fetchWithAuth(url, {
      ...options,
      headers,
      skipAuthCheck: options?.skipAuth,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        `API Error: ${response.statusText}`,
        errorData.detail || errorData.message
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================
// Health Check
// ============================================

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return await response.json();
}

// ============================================
// Auth API
// ============================================

export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const response = await fetchApi<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  });
  setAccessToken(response.access_token);
  return response;
}

export async function logout(): Promise<void> {
  clearAccessToken();
}

export async function getCurrentUser(): Promise<Staff> {
  return fetchApi<Staff>('/auth/me');
}

export async function changePassword(data: PasswordChange): Promise<{ message: string }> {
  return fetchApi<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================
// Staff API
// ============================================

export async function getStaff(params?: {
  store_id?: number;
  department_id?: number;
  role?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}): Promise<Staff[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<Staff[]>(`/staff${query ? `?${query}` : ''}`);
}

export async function getStaffById(id: number): Promise<Staff> {
  return fetchApi<Staff>(`/staff/${id}`);
}

export async function createStaff(data: StaffCreate): Promise<Staff> {
  return fetchApi<Staff>('/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateStaff(id: number, data: StaffUpdate): Promise<Staff> {
  return fetchApi<Staff>(`/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteStaff(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/staff/${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// Store API
// ============================================

export async function getStores(params?: {
  region_id?: number;
  area_id?: number;
  status?: string;
}): Promise<Store[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<Store[]>(`/stores${query ? `?${query}` : ''}`);
}

export async function getStoreById(id: number): Promise<Store> {
  return fetchApi<Store>(`/stores/${id}`);
}

// Staff options for dropdown (value + label format)
export interface StoreStaffOption {
  value: string;
  label: string;
  job_grade: string;
  position?: string;
}

// Response from GET /stores/{id}/staff
export interface StoreStaffResponse {
  success: boolean;
  store_id: number;
  store_name: string;
  leaders: StoreStaffOption[];
  staff: StoreStaffOption[];
  total_leaders: number;
  total_staff: number;
}

/**
 * Get staff members for a specific store
 * Returns:
 * - leaders: Staff with job_grade S2, S3, S4 (Store Leaders)
 * - staff: Staff with job_grade S1 (Regular Staff)
 */
export async function getStoreStaff(storeId: number): Promise<StoreStaffResponse> {
  return fetchApi<StoreStaffResponse>(`/stores/${storeId}/staff`);
}

// ============================================
// Department API
// ============================================

export async function getDepartments(): Promise<Department[]> {
  return fetchApi<Department[]>('/departments');
}

// ============================================
// Region API
// ============================================

export async function getRegions(): Promise<Region[]> {
  return fetchApi<Region[]>('/regions');
}

// ============================================
// Scope Hierarchy API (Single call for all geographic data)
// ============================================

export interface ScopeStore {
  store_id: number;
  store_name: string;
  store_code: string | null;
  area_id: number;
}

export interface ScopeArea {
  area_id: number;
  area_name: string;
  area_code: string | null;
  zone_id: number;
  stores: ScopeStore[];
}

export interface ScopeZone {
  zone_id: number;
  zone_name: string;
  zone_code: string | null;
  region_id: number;
  areas: ScopeArea[];
}

export interface ScopeRegion {
  region_id: number;
  region_name: string;
  region_code: string | null;
  zones: ScopeZone[];
}

export interface ScopeHierarchyResponse {
  regions: ScopeRegion[];
}

/**
 * Get complete geographic hierarchy in one API call
 * Returns: Region → Zone → Area → Store hierarchy
 * Replaces: getRegions() + getZones() + getAreas() + getStores()
 */
export async function getScopeHierarchy(): Promise<ScopeHierarchyResponse> {
  return fetchApi<ScopeHierarchyResponse>('/scope-hierarchy');
}

// ============================================
// Zone API (4-level hierarchy: Region → Zone → Area → Store)
// ============================================

export interface Zone {
  zone_id: number;
  zone_name: string;
  zone_code: string | null;
  region_id: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  region?: Region;
  areas?: Area[];
}

export async function getZones(params?: { region_id?: number; is_active?: string }): Promise<Zone[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<Zone[]>(`/zones${query ? `?${query}` : ''}`);
}

export async function getZoneById(id: number): Promise<Zone> {
  return fetchApi<Zone>(`/zones/${id}`);
}

export async function getZonesByRegion(regionId: number): Promise<Zone[]> {
  return fetchApi<Zone[]>(`/regions/${regionId}/zones`);
}

// ============================================
// Area API (4-level hierarchy: Region → Zone → Area → Store)
// ============================================

export interface Area {
  area_id: number;
  area_name: string;
  area_code: string | null;
  zone_id: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  zone?: Zone;
  stores?: Store[];
}

export async function getAreas(params?: { zone_id?: number; is_active?: string }): Promise<Area[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<Area[]>(`/areas${query ? `?${query}` : ''}`);
}

export async function getAreaById(id: number): Promise<Area> {
  return fetchApi<Area>(`/areas/${id}`);
}

export async function getAreasByZone(zoneId: number): Promise<Area[]> {
  return fetchApi<Area[]>(`/zones/${zoneId}/areas`);
}

// ============================================
// Task API (WS)
// ============================================

// Paginated response from Laravel
export interface PaginatedTaskResponse {
  data: Task[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  // Draft info is included for HQ users (no separate API call needed)
  draft_info?: DraftInfo;
}

export interface TaskQueryParamsExtended extends TaskQueryParams {
  // Spatie QueryBuilder filters (filter[field]=value)
  'filter[assigned_store_id]'?: number;
  'filter[dept_id]'?: number;
  'filter[assigned_staff_id]'?: number;
  'filter[status_id]'?: number;
  'filter[priority]'?: string;
  'filter[task_name]'?: string;
  // Date range filters (YYYY-MM-DD format)
  'filter[start_date_from]'?: string;
  'filter[start_date_to]'?: string;
  'filter[end_date_from]'?: string;
  'filter[end_date_to]'?: string;
  // Sorting (sort=field or sort=-field for desc)
  sort?: string;
  // Pagination
  page?: number;
  per_page?: number;
  // Includes (relationships)
  include?: string;
}

export async function getTasks(params?: TaskQueryParamsExtended): Promise<PaginatedTaskResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  // Always include relationships for Task List display
  if (!searchParams.has('include')) {
    searchParams.append('include', 'department,status,assignedStaff,assignedStore');
  }
  const query = searchParams.toString();
  return fetchApi<PaginatedTaskResponse>(`/tasks${query ? `?${query}` : ''}`);
}

export async function getTaskById(id: number): Promise<Task> {
  return fetchApi<Task>(`/tasks/${id}`);
}

export async function createTask(data: TaskCreate): Promise<Task> {
  return fetchApi<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTask(id: number, data: TaskUpdate): Promise<Task> {
  return fetchApi<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateTaskStatus(id: number, data: TaskStatusUpdate): Promise<Task> {
  return fetchApi<Task>(`/tasks/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

// Task Progress (store assignments)
export async function getTaskProgress(taskId: number): Promise<TaskProgressResponse> {
  return fetchApi<TaskProgressResponse>(`/tasks/${taskId}/progress`);
}

// Draft Info (per source)
export interface DraftInfoBySource {
  current_drafts: number;
  max_drafts: number;
  remaining_drafts: number;
  can_create_draft: boolean;
}

export interface ExpiringDraft {
  task_id: number;
  task_name: string;
  source: 'task_list' | 'library' | 'todo_task';
  last_modified: string;
  days_until_deletion: number;
}

export interface DraftInfo {
  total_drafts: number;
  max_drafts_per_source: number;
  by_source: {
    task_list: DraftInfoBySource;
    library: DraftInfoBySource;
    todo_task: DraftInfoBySource;
  };
  expiring_drafts?: ExpiringDraft[];
}

export async function getDraftInfo(): Promise<DraftInfo> {
  return fetchApi<DraftInfo>('/tasks-draft-info');
}

// Task Approval Workflow APIs
export interface SubmitTaskResponse {
  message: string;
  task: Task;
  approver: {
    id: number;
    name: string;
  };
}

export interface ApproveTaskResponse {
  message: string;
  task: Task;
}

export interface RejectTaskResponse {
  message: string;
  task: Task;
  rejection_count: number;
  can_resubmit: boolean;
  message_for_creator: string;
}

export async function submitTask(taskId: number): Promise<SubmitTaskResponse> {
  return fetchApi<SubmitTaskResponse>(`/tasks/${taskId}/submit`, {
    method: 'POST',
  });
}

export async function approveTask(taskId: number, comment?: string): Promise<ApproveTaskResponse> {
  return fetchApi<ApproveTaskResponse>(`/tasks/${taskId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
}

export async function rejectTask(taskId: number, reason: string): Promise<RejectTaskResponse> {
  return fetchApi<RejectTaskResponse>(`/tasks/${taskId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function getPendingApprovals(params?: {
  page?: number;
  per_page?: number;
}): Promise<PaginatedTaskResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<PaginatedTaskResponse>(`/tasks/pending-approval${query ? `?${query}` : ''}`);
}

// Get Approver for Staff (preview before submission)
export interface ApproverInfo {
  id: number;
  name: string;
  staff_code: string;
  job_grade: string;
  position: string;
  department_id: number | null;
  department_name: string;
  store_id: number | null;
  store_name: string;
}

export interface GetApproverResponse {
  success: boolean;
  approver: ApproverInfo | null;
  is_highest_grade?: boolean;
  message?: string;
}

export async function getApproverForStaff(staffId: number): Promise<GetApproverResponse> {
  return fetchApi<GetApproverResponse>(`/staff/${staffId}/approver`);
}

// Task Checklists
export async function getTaskChecklists(taskId: number): Promise<CheckList[]> {
  return fetchApi<CheckList[]>(`/tasks/${taskId}/checklists`);
}

export async function updateTaskChecklist(
  taskId: number,
  checklistId: number,
  data: { check_status: boolean; notes?: string }
): Promise<unknown> {
  return fetchApi(`/tasks/${taskId}/checklists/${checklistId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Task Approval History
export interface TaskApprovalHistoryResponse {
  taskId: string;
  taskName: string;
  taskStartDate?: string;
  taskEndDate?: string;
  currentRound: number;
  totalRounds: number;
  rounds: Array<{
    roundNumber: number;
    steps: Array<{
      stepNumber: number;
      stepName: 'SUBMIT' | 'APPROVE' | 'DO_TASK' | 'CHECK';
      status: 'submitted' | 'done' | 'in_process' | 'rejected' | 'pending';
      assignee: {
        type: 'user' | 'stores' | 'team';
        id?: number;
        name: string;
        avatar?: string;
        count?: number;
      };
      startDate: string;
      endDate: string;
      actualStartAt?: string;
      actualEndAt?: string;
      comment?: string;
      progress?: {
        done: number;
        total: number;
      };
    }>;
  }>;
}

export async function getTaskApprovalHistory(taskId: number): Promise<TaskApprovalHistoryResponse> {
  return fetchApi<TaskApprovalHistoryResponse>(`/tasks/${taskId}/history`);
}

// Code Master
export async function getCodeMaster(codeType?: string): Promise<CodeMaster[]> {
  const query = codeType ? `?code_type=${codeType}` : '';
  return fetchApi<CodeMaster[]>(`/tasks/code-master${query}`);
}

// ============================================
// Shift API (DWS)
// ============================================

// Shift Codes
export async function getShiftCodes(activeOnly?: boolean): Promise<ShiftCode[]> {
  const query = activeOnly !== undefined ? `?is_active=${activeOnly}` : '';
  return fetchApi<ShiftCode[]>(`/shifts/codes${query}`);
}

export async function getShiftCodeById(id: number): Promise<ShiftCode> {
  return fetchApi<ShiftCode>(`/shifts/codes/${id}`);
}

export async function createShiftCode(data: ShiftCodeCreate): Promise<ShiftCode> {
  return fetchApi<ShiftCode>('/shifts/codes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateShiftCode(id: number, data: ShiftCodeUpdate): Promise<ShiftCode> {
  return fetchApi<ShiftCode>(`/shifts/codes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteShiftCode(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/shifts/codes/${id}`, {
    method: 'DELETE',
  });
}

export async function generateShiftCodes(): Promise<ShiftCode[]> {
  return fetchApi<ShiftCode[]>('/shifts/codes/generate', {
    method: 'POST',
  });
}

// Shift Assignments
export async function getShiftAssignments(params?: {
  staff_id?: number;
  store_id?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}): Promise<ShiftAssignment[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<ShiftAssignment[]>(`/shifts/assignments/${query ? `?${query}` : ''}`);
}

export async function getShiftAssignmentById(id: number): Promise<ShiftAssignment> {
  return fetchApi<ShiftAssignment>(`/shifts/assignments/${id}`);
}

export async function createShiftAssignment(data: ShiftAssignmentCreate): Promise<ShiftAssignment> {
  return fetchApi<ShiftAssignment>('/shifts/assignments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateShiftAssignment(
  id: number,
  data: ShiftAssignmentUpdate
): Promise<ShiftAssignment> {
  return fetchApi<ShiftAssignment>(`/shifts/assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteShiftAssignment(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/shifts/assignments/${id}`, {
    method: 'DELETE',
  });
}

export async function createBulkShiftAssignments(
  data: BulkShiftAssignmentCreate
): Promise<{ created: number; skipped: number; assignments: ShiftAssignment[] }> {
  return fetchApi('/shifts/assignments/bulk', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Weekly Schedule
export async function getWeeklySchedule(params: {
  store_id?: number;
  start_date: string;
  end_date: string;
}): Promise<WeeklySchedule[]> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  return fetchApi<WeeklySchedule[]>(`/shifts/weekly-schedule?${searchParams.toString()}`);
}

// Man-hour Report
export async function getManHourReport(params: {
  date: string;
  store_id?: number;
}): Promise<ManHourSummary[]> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  return fetchApi<ManHourSummary[]>(`/shifts/man-hour-report?${searchParams.toString()}`);
}

// ============================================
// Notification API
// ============================================

export async function getNotifications(params?: {
  is_read?: boolean;
  notification_type?: string;
  skip?: number;
  limit?: number;
}): Promise<NotificationListResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<NotificationListResponse>(`/notifications${query ? `?${query}` : ''}`);
}

export async function getUnreadNotificationCount(): Promise<{ count: number }> {
  return fetchApi<{ count: number }>('/notifications/unread-count');
}

export async function markNotificationAsRead(id: number): Promise<Notification> {
  return fetchApi<Notification>(`/notifications/${id}/read`, {
    method: 'PUT',
  });
}

export async function markAllNotificationsAsRead(): Promise<{ message: string }> {
  return fetchApi<{ message: string }>('/notifications/mark-all-read', {
    method: 'PUT',
  });
}

export async function createNotification(data: NotificationCreate): Promise<Notification> {
  return fetchApi<Notification>('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteNotification(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/notifications/${id}`, {
    method: 'DELETE',
  });
}

export async function clearReadNotifications(): Promise<{ message: string }> {
  return fetchApi<{ message: string }>('/notifications/clear-read', {
    method: 'DELETE',
  });
}

// ============================================
// Task Group API (DWS - Daily Schedule)
// ============================================

export async function getTaskGroups(activeOnly?: boolean): Promise<TaskGroup[]> {
  const query = activeOnly !== undefined ? `?is_active=${activeOnly}` : '';
  return fetchApi<TaskGroup[]>(`/shifts/task-groups/${query}`);
}

export async function getTaskGroupById(groupId: string): Promise<TaskGroup> {
  return fetchApi<TaskGroup>(`/shifts/task-groups/${groupId}`);
}

export async function createTaskGroup(data: TaskGroupCreate): Promise<TaskGroup> {
  return fetchApi<TaskGroup>('/shifts/task-groups/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================
// Daily Schedule Task API (DWS)
// ============================================

export async function getScheduleTasks(params?: {
  store_id?: number;
  staff_id?: number;
  schedule_date?: string;
  group_id?: string;
  status?: string;
  skip?: number;
  limit?: number;
}): Promise<DailyScheduleTask[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<DailyScheduleTask[]>(`/shifts/schedule-tasks/${query ? `?${query}` : ''}`);
}

export async function getScheduleTaskById(taskId: number): Promise<DailyScheduleTask> {
  return fetchApi<DailyScheduleTask>(`/shifts/schedule-tasks/${taskId}`);
}

export async function getStaffDailySchedule(
  staffId: number,
  scheduleDate: string
): Promise<StaffDailySchedule> {
  return fetchApi<StaffDailySchedule>(
    `/shifts/schedule-tasks/by-staff/${staffId}?schedule_date=${scheduleDate}`
  );
}

export async function createScheduleTask(data: DailyScheduleTaskCreate): Promise<DailyScheduleTask> {
  return fetchApi<DailyScheduleTask>('/shifts/schedule-tasks/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateScheduleTask(
  taskId: number,
  data: DailyScheduleTaskUpdate
): Promise<DailyScheduleTask> {
  return fetchApi<DailyScheduleTask>(`/shifts/schedule-tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function completeScheduleTask(taskId: number): Promise<DailyScheduleTask> {
  return fetchApi<DailyScheduleTask>(`/shifts/schedule-tasks/${taskId}/complete`, {
    method: 'PUT',
  });
}

export async function deleteScheduleTask(taskId: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/shifts/schedule-tasks/${taskId}`, {
    method: 'DELETE',
  });
}

// ============================================
// Task Library API (Master Task Data)
// ============================================

export async function getTaskLibrary(params?: {
  group_id?: string;
  task_type?: string;
  frequency?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}): Promise<TaskLibrary[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<TaskLibrary[]>(`/shifts/task-library/${query ? `?${query}` : ''}`);
}

export async function getTaskLibraryByCode(taskCode: string): Promise<TaskLibrary> {
  return fetchApi<TaskLibrary>(`/shifts/task-library/${taskCode}`);
}

export async function createTaskLibrary(data: TaskLibraryCreate): Promise<TaskLibrary> {
  return fetchApi<TaskLibrary>('/shifts/task-library/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTaskLibrary(
  taskCode: string,
  data: TaskLibraryUpdate
): Promise<TaskLibrary> {
  return fetchApi<TaskLibrary>(`/shifts/task-library/${taskCode}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteTaskLibrary(taskCode: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/shifts/task-library/${taskCode}`, {
    method: 'DELETE',
  });
}

// ============================================
// Daily Template API
// ============================================

export async function getDailyTemplates(params?: {
  store_id?: number;
  is_active?: boolean;
}): Promise<DailyTemplate[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<DailyTemplate[]>(`/shifts/daily-templates/${query ? `?${query}` : ''}`);
}

export async function getDailyTemplateById(templateId: number): Promise<DailyTemplate> {
  return fetchApi<DailyTemplate>(`/shifts/daily-templates/${templateId}`);
}

export async function getDailyTemplateByCode(templateCode: string): Promise<DailyTemplate> {
  return fetchApi<DailyTemplate>(`/shifts/daily-templates/by-code/${templateCode}`);
}

export async function createDailyTemplate(data: DailyTemplateCreate): Promise<DailyTemplate> {
  return fetchApi<DailyTemplate>('/shifts/daily-templates/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDailyTemplate(
  templateId: number,
  data: DailyTemplateUpdate
): Promise<DailyTemplate> {
  return fetchApi<DailyTemplate>(`/shifts/daily-templates/${templateId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDailyTemplate(templateId: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/shifts/daily-templates/${templateId}`, {
    method: 'DELETE',
  });
}

// ============================================
// Shift Template API
// ============================================

export async function getShiftTemplates(templateId: number): Promise<ShiftTemplate[]> {
  return fetchApi<ShiftTemplate[]>(`/shifts/shift-templates/${templateId}`);
}

export async function createShiftTemplate(data: ShiftTemplateCreate): Promise<ShiftTemplate> {
  return fetchApi<ShiftTemplate>('/shifts/shift-templates/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateShiftTemplate(
  shiftTemplateId: number,
  data: ShiftTemplateUpdate
): Promise<ShiftTemplate> {
  return fetchApi<ShiftTemplate>(`/shifts/shift-templates/${shiftTemplateId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteShiftTemplate(shiftTemplateId: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/shifts/shift-templates/${shiftTemplateId}`, {
    method: 'DELETE',
  });
}

// ============================================
// Manual/Knowledge Base API
// ============================================

// Browse folder (like Google Drive / Teachme Biz)
export async function browseManualFolder(params?: {
  folder_id?: number;
  store_id?: number;
}): Promise<FolderBrowseResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<FolderBrowseResponse>(`/manual/browse${query ? `?${query}` : ''}`);
}

// Folder operations
export async function getManualFolders(params?: {
  parent_id?: number;
  store_id?: number;
}): Promise<ManualFolderWithStats[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<ManualFolderWithStats[]>(`/manual/folders${query ? `?${query}` : ''}`);
}

export async function getManualFolderById(folderId: number): Promise<ManualFolder> {
  return fetchApi<ManualFolder>(`/manual/folders/${folderId}`);
}

export async function createManualFolder(data: ManualFolderCreate): Promise<ManualFolder> {
  return fetchApi<ManualFolder>('/manual/folders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateManualFolder(
  folderId: number,
  data: ManualFolderUpdate
): Promise<ManualFolder> {
  return fetchApi<ManualFolder>(`/manual/folders/${folderId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteManualFolder(folderId: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/manual/folders/${folderId}`, {
    method: 'DELETE',
  });
}

// Document operations
export async function getManualDocuments(params?: {
  folder_id?: number;
  status?: string;
  store_id?: number;
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<ManualDocument[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<ManualDocument[]>(`/manual/documents${query ? `?${query}` : ''}`);
}

export async function getManualDocumentById(documentId: number): Promise<ManualDocument> {
  return fetchApi<ManualDocument>(`/manual/documents/${documentId}`);
}

export async function createManualDocument(data: ManualDocumentCreate): Promise<ManualDocument> {
  return fetchApi<ManualDocument>('/manual/documents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateManualDocument(
  documentId: number,
  data: ManualDocumentUpdate
): Promise<ManualDocument> {
  return fetchApi<ManualDocument>(`/manual/documents/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteManualDocument(documentId: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/manual/documents/${documentId}`, {
    method: 'DELETE',
  });
}

export async function logManualDocumentView(
  documentId: number,
  staffId: number
): Promise<{ view_count: number }> {
  return fetchApi<{ view_count: number }>(
    `/manual/documents/${documentId}/view?staff_id=${staffId}`,
    { method: 'POST' }
  );
}

// Search
export async function searchManual(params: {
  q: string;
  store_id?: number;
}): Promise<ManualSearchResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append('q', params.q);
  if (params.store_id) {
    searchParams.append('store_id', String(params.store_id));
  }
  return fetchApi<ManualSearchResponse>(`/manual/search?${searchParams.toString()}`);
}

// ============================================
// Manual Step API (Teachme Biz style)
// ============================================

// Get document with all steps (for editor)
export async function getManualDocumentWithSteps(documentId: number): Promise<ManualDocumentWithSteps> {
  return fetchApi<ManualDocumentWithSteps>(`/manual/documents/${documentId}/full`);
}

// Get steps for a document
export async function getManualSteps(documentId: number): Promise<ManualStep[]> {
  return fetchApi<ManualStep[]>(`/manual/documents/${documentId}/steps`);
}

// Create step
export async function createManualStep(data: ManualStepCreate): Promise<ManualStep> {
  return fetchApi<ManualStep>('/manual/steps', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update step
export async function updateManualStep(stepId: number, data: ManualStepUpdate): Promise<ManualStep> {
  return fetchApi<ManualStep>(`/manual/steps/${stepId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Delete step
export async function deleteManualStep(stepId: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/manual/steps/${stepId}`, {
    method: 'DELETE',
  });
}

// Reorder steps
export async function reorderManualSteps(
  documentId: number,
  stepOrders: Array<{ step_id: number; step_number: number }>
): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/manual/steps/reorder?document_id=${documentId}`, {
    method: 'POST',
    body: JSON.stringify(stepOrders),
  });
}

// ============================================
// Manual Media Upload API
// ============================================

// Upload media file
export async function uploadManualMedia(
  file: File,
  params?: { document_id?: number; step_id?: number; uploaded_by?: number }
): Promise<ManualMedia> {
  const formData = new FormData();
  formData.append('file', file);
  if (params?.document_id) formData.append('document_id', String(params.document_id));
  if (params?.step_id) formData.append('step_id', String(params.step_id));
  if (params?.uploaded_by) formData.append('uploaded_by', String(params.uploaded_by));

  const response = await fetch(`${API_BASE_URL}/manual/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}

// Get media info
export async function getManualMedia(mediaId: number): Promise<ManualMedia> {
  return fetchApi<ManualMedia>(`/manual/media/${mediaId}`);
}

// Delete media
export async function deleteManualMedia(mediaId: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/manual/media/${mediaId}`, {
    method: 'DELETE',
  });
}

// Move document to another folder
export async function moveManualDocument(
  documentId: number,
  folderId: number
): Promise<ManualDocument> {
  return fetchApi<ManualDocument>(`/manual/documents/${documentId}/move`, {
    method: 'PUT',
    body: JSON.stringify({ folder_id: folderId }),
  });
}

// ============================================
// User Information API (SCR_USER_INFO)
// ============================================

import type { HierarchyNode, Department as UserInfoDepartment, Employee } from '@/types/userInfo';

export interface DepartmentTab {
  id: string;
  label: string;
}

// Get SMBU (Head Office) hierarchy
export async function getSMBUHierarchy(): Promise<HierarchyNode> {
  return fetchApi<HierarchyNode>('/user-info/smbu-hierarchy', { skipAuth: true });
}

// Get department tabs for navigation
export async function getDepartmentTabs(): Promise<DepartmentTab[]> {
  return fetchApi<DepartmentTab[]>('/user-info/department-tabs', { skipAuth: true });
}

// Get department hierarchy with teams and members
export async function getDepartmentHierarchy(departmentId: number): Promise<UserInfoDepartment> {
  return fetchApi<UserInfoDepartment>(`/user-info/departments/${departmentId}/hierarchy`, { skipAuth: true });
}

// Get staff detail
export async function getStaffDetail(staffId: number): Promise<Employee> {
  return fetchApi<Employee>(`/user-info/staff/${staffId}`, { skipAuth: true });
}

// Department and Team list for dropdowns
export interface DepartmentListItem {
  id: number;
  name: string;
  code: string;
}

export interface TeamListItem {
  id: string;
  name: string;
  departmentId: number;
}

// Get departments list for dropdown
export async function getDepartmentsList(): Promise<DepartmentListItem[]> {
  return fetchApi<DepartmentListItem[]>('/user-info/departments-list', { skipAuth: true });
}

// Get teams list for dropdown
export async function getTeamsList(): Promise<TeamListItem[]> {
  return fetchApi<TeamListItem[]>('/user-info/teams-list', { skipAuth: true });
}

// Create team request
export interface CreateTeamRequest {
  teamName: string;
  departmentId: number;
  icon?: string;
  iconColor?: string;
  iconBg?: string;
}

// Create member request
export interface CreateMemberRequest {
  staffName: string;
  staffCode: string;
  email: string;
  phone?: string;
  position: string;
  jobGrade: string;
  departmentId: number;
  teamId?: string;
  sapCode?: string;
  lineManagerId?: number;
}

// Create a new team
export async function createTeam(data: CreateTeamRequest): Promise<{ message: string; team: TeamListItem }> {
  return fetchApi<{ message: string; team: TeamListItem }>('/user-info/teams', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

// Create a new staff member
export async function createMember(data: CreateMemberRequest): Promise<{ message: string; staff: Employee }> {
  return fetchApi<{ message: string; staff: Employee }>('/user-info/members', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

// ============================================
// Permissions API
// ============================================

export interface RoleItem {
  id: number;
  name: string;
}

export interface UserItem {
  id: number;
  name: string;
}

// Get list of roles for permissions dropdown
export async function getRolesList(): Promise<RoleItem[]> {
  return fetchApi<RoleItem[]>('/user-info/roles-list', { skipAuth: true });
}

// Get list of users for permissions dropdown
export async function getUsersList(): Promise<UserItem[]> {
  return fetchApi<UserItem[]>('/user-info/users-list', { skipAuth: true });
}

// Save permissions for a user or role
export interface SavePermissionsRequest {
  targetId: number;
  targetType: 'user' | 'role';
  permissions: string[];
}

export async function savePermissions(data: SavePermissionsRequest): Promise<{ message: string }> {
  return fetchApi<{ message: string }>('/user-info/permissions', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

// ============================================
// User Info - Import Excel
// ============================================

export interface ImportUsersResult {
  success: boolean;
  message: string;
  imported?: number;
  errors?: string[];
}

export async function importUsersFromExcel(file: File): Promise<ImportUsersResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/user-info/import`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Import failed');
  }

  return response.json();
}

// ============================================
// Store Information API (SCR_STORE_INFO)
// ============================================

import type { RegionTab, Region as StoreInfoRegion, Store as StoreInfoStore, StoreStaff, StoreDepartment } from '@/types/storeInfo';

// Get region tabs for Store Information navigation
export async function getStoreInfoRegionTabs(): Promise<RegionTab[]> {
  return fetchApi<RegionTab[]>('/store-info/region-tabs', { skipAuth: true });
}

// Get region hierarchy with stores and staff
export async function getStoreInfoRegionHierarchy(regionName: string): Promise<StoreInfoRegion> {
  return fetchApi<StoreInfoRegion>(`/store-info/regions/${encodeURIComponent(regionName)}/hierarchy`, { skipAuth: true });
}

// Get stores for a specific region
export async function getStoreInfoStoresByRegion(regionName: string): Promise<StoreInfoStore[]> {
  return fetchApi<StoreInfoStore[]>(`/store-info/regions/${encodeURIComponent(regionName)}/stores`, { skipAuth: true });
}

// Get store detail with all staff
export async function getStoreInfoStoreDetail(storeId: number): Promise<StoreInfoStore> {
  return fetchApi<StoreInfoStore>(`/store-info/stores/${storeId}`, { skipAuth: true });
}

// Get store-level departments
export async function getStoreInfoDepartments(): Promise<StoreDepartment[]> {
  return fetchApi<StoreDepartment[]>('/store-info/store-departments', { skipAuth: true });
}

// Get stores list for dropdown (permissions modal)
export interface StoreListItem {
  id: string;
  name: string;
  code: string;
}

export async function getStoreInfoStoresList(): Promise<StoreListItem[]> {
  return fetchApi<StoreListItem[]>('/store-info/stores-list', { skipAuth: true });
}

// Save store permissions
export interface SaveStorePermissionsRequest {
  storeId: string;
  permissions: string[];
}

export async function saveStorePermissions(data: SaveStorePermissionsRequest): Promise<{ success: boolean; message: string }> {
  return fetchApi<{ success: boolean; message: string }>('/store-info/permissions', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

// Import stores from file
export interface StoreImportResult {
  success: boolean;
  message: string;
  imported?: number;
  errors?: string[];
}

const API_BASE_URL_FOR_UPLOAD = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function importStoresFromFile(file: File): Promise<StoreImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL_FOR_UPLOAD}/store-info/import`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Import failed');
  }

  return response.json();
}

// ============================================
// User Switcher API (Development/Testing)
// ============================================

export interface UserSwitcherStaff {
  staff_id: number;
  staff_name: string;
  staff_code: string;
  email: string;
  job_grade: string;
  scope: string;
  store_id: number | null;
  store_name: string;
  department_id: number | null;
  department_name: string;
}

export interface UserSwitcherResponse {
  data: UserSwitcherStaff[];
  total: number;
}

// Get staff list for User Switcher
export async function getUserSwitcherStaff(): Promise<UserSwitcherResponse> {
  return fetchApi<UserSwitcherResponse>('/staff/user-switcher', { skipAuth: true });
}
