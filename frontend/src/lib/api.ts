// ============================================
// API Client for OptiChain WS & DWS
// ============================================

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
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ============================================
// Token Management
// ============================================

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
}

export function getAccessToken(): string | null {
  if (!accessToken && typeof window !== 'undefined') {
    accessToken = localStorage.getItem('access_token');
  }
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
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
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };

  // Add auth header if token exists and not skipping auth
  if (!options?.skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
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
  const response = await fetch(API_BASE_URL.replace('/api/v1', '/health'));
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
  return fetchApi<Store[]>(`/staff/stores/${query ? `?${query}` : ''}`);
}

export async function getStoreById(id: number): Promise<Store> {
  return fetchApi<Store>(`/staff/stores/${id}`);
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
  return fetchApi<Region[]>('/staff/regions');
}

// ============================================
// Task API (WS)
// ============================================

export async function getTasks(params?: TaskQueryParams): Promise<Task[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchApi<Task[]>(`/tasks${query ? `?${query}` : ''}`);
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
