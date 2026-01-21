'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TaskGroup, DateMode, TaskFilters, TaskStatus, HQCheckStatus, SubTask } from '@/types/tasks';
import { Task as ApiTask, Department } from '@/types/api';
import { getTasks, getDepartments, DraftInfo, PaginatedTaskResponse, TaskQueryParamsExtended } from '@/lib/api';
import StatusPill from '@/components/ui/StatusPill';
import FilterModal from '@/components/tasks/FilterModal';
import DatePicker from '@/components/ui/DatePicker';
import ColumnFilterDropdown from '@/components/ui/ColumnFilterDropdown';
import { useTaskUpdates } from '@/hooks/useTaskUpdates';
import { useUser } from '@/contexts/UserContext';
import { usePermissions } from '@/hooks/usePermissions';

// Map API status_id to UI status
// code_master: 7=NOT_YET, 8=ON_PROGRESS, 9=DONE, 10=OVERDUE, 11=REJECT, 12=DRAFT, 13=APPROVE
const STATUS_MAP: Record<number, TaskStatus> = {
  7: 'NOT_YET',      // Not Yet - đã gửi về store nhưng chưa hoàn thành
  8: 'ON_PROGRESS',  // On Progress - store đang thực hiện
  9: 'DONE',         // Done - Store đã hoàn thành
  10: 'OVERDUE',     // Overdue - quá deadline chưa hoàn thành
  11: 'REJECT',      // Reject
  12: 'DRAFT',       // Draft - đang tạo task dở, chưa gửi
  13: 'APPROVE',     // Approve - đang chờ HQ phê duyệt
};

// Map API status_id to HQ Check status
const HQ_CHECK_MAP: Record<number, HQCheckStatus> = {
  7: 'NOT_YET',
  8: 'ON_PROGRESS',
  9: 'DONE',
  10: 'OVERDUE',
  11: 'REJECT',
  12: 'DRAFT',
  13: 'APPROVE',
};

// Status options theo loại user
// HQ users (G2-G9): Xem tất cả 6 status - thứ tự: APPROVE → DRAFT → OVERDUE → NOT_YET → ON_PROGRESS → DONE
// Store users (S1-S6): Chỉ xem 4 status - thứ tự: OVERDUE → NOT_YET → ON_PROGRESS → DONE
const HQ_STATUS_OPTIONS: TaskStatus[] = ['APPROVE', 'DRAFT', 'OVERDUE', 'NOT_YET', 'ON_PROGRESS', 'DONE'];
const STORE_STATUS_OPTIONS: TaskStatus[] = ['OVERDUE', 'NOT_YET', 'ON_PROGRESS', 'DONE'];

// Status ID map for API filtering
const STATUS_ID_MAP: Record<TaskStatus, number> = {
  'NOT_YET': 7,
  'ON_PROGRESS': 8,
  'DONE': 9,
  'OVERDUE': 10,
  'REJECT': 11,
  'DRAFT': 12,
  'APPROVE': 13,
};

// Format dates from API (YYYY-MM-DD) to UI format (DD/MM)
const formatDateForUI = (dateStr: string | null): string => {
  if (!dateStr) return '--/--';
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

// Transform API sub_tasks to UI SubTask format (recursive)
function transformApiSubTasks(subTasks: ApiTask[] | undefined): SubTask[] {
  if (!subTasks || subTasks.length === 0) return [];

  return subTasks.map((subTask) => ({
    id: subTask.task_id.toString(),
    name: subTask.task_name,
    status: STATUS_MAP[subTask.status_id || 7] || 'NOT_YET',
    assignee: subTask.assigned_staff?.staff_name || undefined,
    completedAt: subTask.completed_time || undefined,
    // Note: UI SubTask interface doesn't support nested sub_tasks currently
    // If needed, extend SubTask interface to support recursive structure
  }));
}

// Transform API Task to UI TaskGroup format
function transformApiTaskToTaskGroup(task: ApiTask, index: number, departments: Department[]): TaskGroup {
  const dept = departments.find(d => d.department_id === task.dept_id);
  const deptCode = dept?.department_code || dept?.department_name?.substring(0, 3).toUpperCase() || 'N/A';

  // Transform nested sub_tasks from API
  const subTasks = transformApiSubTasks(task.sub_tasks);

  // Calculate progress from sub_tasks if available
  let progressCompleted = 0;
  let progressTotal = 1;

  if (subTasks.length > 0) {
    progressTotal = subTasks.length;
    progressCompleted = subTasks.filter(st => st.status === 'DONE').length;
  } else {
    // No sub-tasks: use task's own status
    progressCompleted = task.status_id === 9 ? 1 : 0;
  }

  return {
    id: task.task_id.toString(),
    no: index + 1,
    dept: deptCode,
    deptId: task.dept_id,
    taskGroupName: task.task_name,
    taskType: undefined,
    startDate: formatDateForUI(task.start_date),
    endDate: formatDateForUI(task.end_date),
    progress: {
      completed: progressCompleted,
      total: progressTotal,
    },
    unable: 0,
    status: STATUS_MAP[task.status_id || 7] || 'NOT_YET',
    hqCheck: HQ_CHECK_MAP[task.status_id || 7] || 'NOT_YET',
    subTasks: subTasks,
    createdStaffId: task.created_staff_id,
  };
}

export default function TaskListPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { isHQUser: checkIsHQ, canCreateTask: checkCanCreate } = usePermissions();

  // Check if user is HQ type (G2-G9) - use hook for consistent permission checking
  // Also check if user can create tasks (only HQ users G2-G9)
  const isHQ = checkIsHQ();
  const canCreate = checkCanCreate();

  // Date range state for filtering
  interface DateRange {
    from: Date;
    to: Date;
  }

  // State management
  const [dateMode, setDateMode] = useState<DateMode>('DAY');
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    // Default to today
    const today = new Date();
    const dayStart = new Date(today);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(today);
    dayEnd.setHours(23, 59, 59, 999);
    return { from: dayStart, to: dayEnd };
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [tasks, setTasks] = useState<TaskGroup[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    viewScope: 'All team',
    departments: [],
    status: [],
    hqCheck: [],
  });

  // Column filter states
  const [deptColumnFilter, setDeptColumnFilter] = useState<string[]>([]);
  const [statusColumnFilter, setStatusColumnFilter] = useState<string[]>([]);
  const [hqCheckColumnFilter, setHqCheckColumnFilter] = useState<string[]>([]);

  // Row action menu state
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Draft limit state (for HQ users)
  const [draftInfo, setDraftInfo] = useState<DraftInfo | null>(null);
  const sourceDraftInfo = draftInfo?.by_source?.['task_list'];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Note: Draft info is now included in getTasks response (no separate API call needed)

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const depts = await getDepartments();
      setDepartments(depts);
      return depts;
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      return [];
    }
  }, []);

  // Helper to format date as YYYY-MM-DD
  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Fetch tasks from API with server-side filtering
  // Strategy: Single API call with proper server-side pagination
  // Draft/Approve tasks are included in the same query (backend handles all statuses)
  const fetchTasks = useCallback(async (depts: Department[]) => {
    setIsLoading(true);
    setError(null);

    try {
      let allTasks: ApiTask[] = [];

      // Build query params - use server-side pagination for all users
      const queryParams: TaskQueryParamsExtended = {
        page: currentPage,
        per_page: itemsPerPage,
      };

      // Search filter
      if (debouncedSearch) {
        queryParams['filter[task_name]'] = debouncedSearch;
      }

      // Date range filter (for tasks with applicable period)
      // Note: Draft/Approve tasks may not have dates set, backend should handle this
      if (dateRange.from) {
        queryParams['filter[end_date_from]'] = formatDateForApi(dateRange.from);
      }
      if (dateRange.to) {
        queryParams['filter[start_date_to]'] = formatDateForApi(dateRange.to);
      }

      // Department filter from modal
      if (filters.departments.length === 1) {
        queryParams['filter[dept_id]'] = parseInt(filters.departments[0]);
      }

      // Status filter from modal
      if (filters.status.length === 1) {
        queryParams['filter[status_id]'] = STATUS_ID_MAP[filters.status[0] as TaskStatus];
      }

      // Fetch tasks with server-side pagination
      // Response now includes draft_info for HQ users (no separate API call needed)
      const response = await getTasks(queryParams);
      allTasks = response.data || [];

      // Use server's pagination info
      setTotalPages(response.last_page || 1);
      setTotalItems(response.total || 0);

      // Update draft info from response (included for HQ users)
      if (response.draft_info) {
        setDraftInfo(response.draft_info);
      }

      // Transform API tasks to UI format
      const transformedTasks = allTasks.map((task: ApiTask, index: number) =>
        transformApiTaskToTaskGroup(task, index + 1, depts)
      );

      // Sort by priority: APPROVE → DRAFT → OVERDUE → NOT_YET → ON_PROGRESS → DONE
      const STATUS_PRIORITY: Record<TaskStatus, number> = {
        'APPROVE': 1,
        'DRAFT': 2,
        'OVERDUE': 3,
        'NOT_YET': 4,
        'ON_PROGRESS': 5,
        'DONE': 6,
        'REJECT': 7,
      };

      const sortedTasks = transformedTasks.sort((a, b) => {
        const priorityA = STATUS_PRIORITY[a.status] || 99;
        const priorityB = STATUS_PRIORITY[b.status] || 99;
        return priorityA - priorityB;
      });

      // Re-number after sorting - account for pagination offset
      const pageOffset = (currentPage - 1) * itemsPerPage;
      sortedTasks.forEach((task, index) => {
        task.no = pageOffset + index + 1;
      });

      setTasks(sortedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      setTasks([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  // Include currentUser.staff_id to trigger refetch when user switches
  }, [currentPage, itemsPerPage, debouncedSearch, dateRange, filters.departments, filters.status, currentUser?.staff_id]);

  // Initial load - fetch departments once
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Fetch tasks when filters change or user switches (server-side filtering)
  useEffect(() => {
    if (departments.length > 0) {
      fetchTasks(departments);
    }
  // Include currentUser.staff_id to trigger refetch when user switches
  }, [departments, currentPage, debouncedSearch, dateRange, filters.departments, filters.status, fetchTasks, currentUser?.staff_id]);

  // Real-time updates via WebSocket
  const { isConnected: wsConnected } = useTaskUpdates({
    onAnyUpdate: (event) => {
      console.log('[TaskList] Real-time update received:', event.action, event.task.task_id);
      // Refresh the task list when any task is updated
      if (departments.length > 0) {
        fetchTasks(departments);
      }
    },
  });

  // Get unique values for column filters
  const uniqueDepts = [...new Set(tasks.map((t) => t.dept))];

  // Status options theo loại user
  // HQ users: APPROVE → DRAFT → OVERDUE → NOT_YET → ON_PROGRESS → DONE
  // Store users: OVERDUE → NOT_YET → ON_PROGRESS → DONE
  const statusOptions = isHQ ? HQ_STATUS_OPTIONS : STORE_STATUS_OPTIONS;
  const hqCheckOptions = isHQ ? HQ_STATUS_OPTIONS : STORE_STATUS_OPTIONS;

  // Toggle accordion
  const toggleRow = (taskId: string) => {
    setExpandedRows(expandedRows === taskId ? null : taskId);
  };

  // Navigate to task detail page or edit page (for drafts)
  const handleRowClick = (task: TaskGroup) => {
    // If task is DRAFT or APPROVE and current user is the creator, navigate to Add Task screen (edit mode)
    if ((task.status === 'DRAFT' || task.status === 'APPROVE') && task.createdStaffId === currentUser.staff_id) {
      // Use unified Add Task screen with query params for edit mode
      router.push(`/tasks/new?id=${task.id}&source=task_list`);
    } else {
      router.push(`/tasks/detail?id=${task.id}`);
    }
  };

  // Row action menu handlers
  const handleViewApprovalHistory = (taskId: string) => {
    setOpenActionMenu(null);
    // TODO: Open approval history modal or navigate to history page
    console.log('View approval history for task:', taskId);
  };

  const handlePauseTask = (taskId: string) => {
    setOpenActionMenu(null);
    // TODO: Implement pause task functionality
    console.log('Pause task:', taskId);
  };

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-action-menu]')) {
          setOpenActionMenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openActionMenu]);

  // Apply filters handler
  const handleApplyFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Date change handler
  const handleDateChange = (mode: DateMode, newDateRange: DateRange) => {
    setDateMode(mode);
    setDateRange(newDateRange);
  };

  // Client-side column filters (applied to already fetched data)
  // Server handles: search, department modal filter, status modal filter, pagination, DRAFT ownership
  // Client handles: column quick filters (dept, status, hqCheck columns)
  // Note: DRAFT ownership filtering is now done server-side for accurate pagination
  // Store users (S1-S6) only see: OVERDUE, NOT_YET, ON_PROGRESS, DONE

  const filteredTasks = tasks.filter((task) => {
    // User type filter: Store users only see specific statuses
    if (!isHQ) {
      // Store users only see: OVERDUE, NOT_YET, ON_PROGRESS, DONE
      const allowedForStore = STORE_STATUS_OPTIONS;
      if (!allowedForStore.includes(task.status)) {
        return false;
      }
    }

    // Note: DRAFT ownership filtering is now handled server-side
    // Backend automatically excludes DRAFT tasks not created by the current user
    // This ensures pagination counts are accurate

    // Department column filter
    const matchesDeptColumn =
      deptColumnFilter.length === 0 || deptColumnFilter.includes(task.dept);

    // Status column filter
    const matchesStatusColumn =
      statusColumnFilter.length === 0 || statusColumnFilter.includes(task.status);

    // HQ Check column filter
    const matchesHQCheckColumn =
      hqCheckColumnFilter.length === 0 || hqCheckColumnFilter.includes(task.hqCheck);

    return matchesDeptColumn && matchesStatusColumn && matchesHQCheckColumn;
  });

  // Display tasks (client-side column filters applied)
  const paginatedTasks = filteredTasks;

  // Calculate actual displayed count (after client-side filters)
  // This may differ from server's totalItems due to DRAFT ownership filter
  const displayedCount = filteredTasks.length;

  // Reset to page 1 when server-side filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, dateRange, filters]);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">List tasks</h1>
          {/* WebSocket connection indicator */}
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-gray-300'}`}
              title={wsConnected ? 'Real-time updates active' : 'Real-time updates offline'}
            />
            <span className={wsConnected ? 'text-green-600' : 'text-gray-400'}>
              {wsConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Expiring Drafts Warning Banner (HQ users only, when drafts are about to expire) */}
        {isHQ && draftInfo?.expiring_drafts && draftInfo.expiring_drafts.length > 0 && (
          <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {draftInfo.expiring_drafts.length === 1
                    ? '1 draft will be automatically deleted soon'
                    : `${draftInfo.expiring_drafts.length} drafts will be automatically deleted soon`
                  }
                </p>
                <ul className="mt-2 space-y-1">
                  {draftInfo.expiring_drafts.slice(0, 3).map((draft) => (
                    <li key={draft.task_id} className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <span className="font-medium">&quot;{draft.task_name}&quot;</span>
                      <span className="text-amber-600 dark:text-amber-400">
                        — {draft.days_until_deletion} {draft.days_until_deletion === 1 ? 'day' : 'days'} left
                      </span>
                      <button
                        onClick={() => router.push(`/tasks/new?id=${draft.task_id}&source=${draft.source}`)}
                        className="text-amber-800 dark:text-amber-200 underline hover:no-underline"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                  {draftInfo.expiring_drafts.length > 3 && (
                    <li className="text-xs text-amber-600 dark:text-amber-400 italic">
                      +{draftInfo.expiring_drafts.length - 3} more draft(s) expiring soon
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Date Display & Actions */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Date Picker */}
          <DatePicker
            dateMode={dateMode}
            onDateChange={handleDateChange}
          />

          {/* Search & Actions */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="relative w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear search"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {(filters.departments.length > 0 || filters.status.length > 0 || filters.hqCheck.length > 0) && (
                <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {filters.departments.length + filters.status.length + filters.hqCheck.length}
                </span>
              )}
            </button>

            {/* Draft limit indicator + Add New button (HQ users only) */}
            {isHQ && (
              <div className="flex items-center gap-3">
                {/* Draft limit badge */}
                {sourceDraftInfo && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    sourceDraftInfo.remaining_drafts === 0
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : sourceDraftInfo.remaining_drafts <= 2
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`} title={`Drafts: ${sourceDraftInfo.current_drafts}/${sourceDraftInfo.max_drafts}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Drafts: {sourceDraftInfo.current_drafts}/{sourceDraftInfo.max_drafts}</span>
                  </div>
                )}

                {/* Add New button */}
                <button
                  onClick={() => router.push('/tasks/new?source=task_list')}
                  disabled={Boolean(sourceDraftInfo && !sourceDraftInfo.can_create_draft)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sourceDraftInfo && !sourceDraftInfo.can_create_draft
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                  title={sourceDraftInfo && !sourceDraftInfo.can_create_draft
                    ? `Draft limit reached (${sourceDraftInfo.max_drafts} max). Please complete or delete existing drafts.`
                    : 'Create a new task draft'
                  }
                >
                  <span className="text-lg">+</span>
                  ADD NEW
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-3 text-gray-600">Loading tasks...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchTasks(departments)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Body - Table Container */}
      {!isLoading && !error && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-pink-50">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    No
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    <div className="flex items-center justify-center gap-1">
                      <span>Dept</span>
                      <ColumnFilterDropdown
                        options={uniqueDepts}
                        selectedValues={deptColumnFilter}
                        onFilterChange={setDeptColumnFilter}
                        columnName="Dept"
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    Task Group
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    Start → End
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    Unable
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    <div className="flex items-center justify-center gap-1">
                      <span>Status</span>
                      <ColumnFilterDropdown
                        options={statusOptions}
                        selectedValues={statusColumnFilter}
                        onFilterChange={setStatusColumnFilter}
                        columnName="Status"
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 bg-pink-50">
                    <div className="flex items-center justify-center gap-1">
                      <span>HQ Check</span>
                      <ColumnFilterDropdown
                        options={hqCheckOptions}
                        selectedValues={hqCheckColumnFilter}
                        onFilterChange={setHqCheckColumnFilter}
                        columnName="HQ Check"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  paginatedTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      {/* Parent Row */}
                      <tr
                        className="group hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(task)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                          {task.no}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200">
                          <div className="flex items-center justify-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">
                                {task.dept.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{task.dept}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm border-r border-gray-200">
                          <div className="flex items-center justify-start gap-2">
                            {/* Only show expand button if task has subtasks */}
                            {task.subTasks && task.subTasks.length > 0 ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRow(task.id);
                                }}
                                className="flex items-center justify-center w-5 h-5 hover:bg-gray-200 rounded transition-colors"
                              >
                                <svg
                                  className={`w-4 h-4 text-gray-600 transition-transform ${
                                    expandedRows === task.id ? 'rotate-180' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            ) : (
                              // Placeholder to maintain consistent alignment
                              <div className="w-5 h-5" />
                            )}
                            <span className="text-gray-900">{task.taskGroupName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                          {task.startDate} → {task.endDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                          {task.progress.completed}/{task.progress.total}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                          {task.unable}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200">
                          <div className="flex items-center justify-center">
                            <StatusPill status={task.status} />
                          </div>
                        </td>
                        {/* HQ Check + Action Menu */}
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="relative flex items-center justify-center">
                            <StatusPill status={task.hqCheck} />
                            {/* 3-dots Action Menu - positioned with margin from StatusPill */}
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2" data-action-menu>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenu(openActionMenu === task.id ? null : task.id);
                                }}
                                className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity"
                                title="More actions"
                              >
                                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="5" r="1.5" />
                                  <circle cx="12" cy="12" r="1.5" />
                                  <circle cx="12" cy="19" r="1.5" />
                                </svg>
                              </button>
                              {/* Dropdown Menu */}
                              {openActionMenu === task.id && (
                                <div className="absolute right-0 top-full mt-1 w-52 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewApprovalHistory(task.id);
                                    }}
                                    className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-left"
                                  >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    View Approval History
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePauseTask(task.id);
                                    }}
                                    className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-left"
                                  >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Pause Task
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Sub Tasks (Accordion) */}
                      {expandedRows === task.id && task.subTasks && task.subTasks.length > 0 && (
                        <>
                          {task.subTasks.map((subTask) => (
                            <tr key={subTask.id} className="bg-gray-50 border-t border-gray-100">
                              <td className="px-4 py-2 text-center border-r border-gray-200"></td>
                              <td className="px-4 py-2 border-r border-gray-200"></td>
                              <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                                <div className="pl-8 flex items-start gap-2">
                                  <span className="text-gray-400">•</span>
                                  <span>
                                    {subTask.name}
                                    {subTask.assignee && (
                                      <span className="ml-2 text-gray-500 text-xs">
                                        ({subTask.assignee})
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500 text-center border-r border-gray-200">{task.startDate} → {task.endDate}</td>
                              <td className="px-4 py-2 text-center border-r border-gray-200"></td>
                              <td className="px-4 py-2 text-center border-r border-gray-200"></td>
                              <td className="px-4 py-2">
                                <div className="flex items-center justify-center">
                                  <StatusPill status={subTask.status} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {displayedCount !== totalItems ? (
                  // Client-side column filters are applied
                  <>
                    Showing: <span className="font-semibold text-gray-900">{displayedCount}</span> of {totalItems} tasks
                    <span className="ml-2 text-gray-500">
                      (Page {currentPage} of {totalPages})
                    </span>
                  </>
                ) : (
                  // No client-side filters - count matches
                  <>
                    Total: <span className="font-semibold text-gray-900">{totalItems}</span> tasks
                    {totalPages > 1 && (
                      <span className="ml-2 text-gray-500">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {(() => {
                  // Smart pagination: show pages around current page
                  const pages: number[] = [];
                  const maxVisible = 5;
                  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                  const end = Math.min(totalPages, start + maxVisible - 1);
                  start = Math.max(1, end - maxVisible + 1);

                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  return pages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded font-medium text-sm ${
                        currentPage === page
                          ? 'bg-black text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ));
                })()}
                {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-2">...</span>}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        departments={departments}
      />
      </div>
    </div>
  );
}
