'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TaskGroup, DateMode, TaskFilters, TaskStatus, HQCheckStatus, SubTask, TaskCreator } from '@/types/tasks';
import { CreatorAvatar } from '@/components/ui/CreatorAvatar';
import { Task as ApiTask, Department } from '@/types/api';
import { getTasks, getDepartments, getTaskApprovalHistory, pauseTask, DraftInfo, PaginatedTaskResponse, TaskQueryParamsExtended } from '@/lib/api';
import StatusPill from '@/components/ui/StatusPill';
import FilterModal from '@/components/tasks/FilterModal';
import DatePicker from '@/components/ui/DatePicker';
import ColumnFilterDropdown from '@/components/ui/ColumnFilterDropdown';
import ApprovalHistoryModal, { TaskApprovalHistory } from '@/components/tasks/ApprovalHistoryModal';
import { TaskListPageSkeleton } from '@/components/ui/Skeleton';
import { ErrorDisplay, InlineError } from '@/components/ui/ErrorBoundary';
import { TableEmptyState } from '@/components/ui/EmptyState';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
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

// HQ Check only has 2 statuses: NOT_YET or DONE
// Logic: Task DONE → HQ Check = DONE, otherwise → NOT_YET
// Note: DRAFT/APPROVE tasks haven't been dispatched yet, so HQ Check = NOT_YET (or could be hidden)
const HQ_CHECK_OPTIONS: HQCheckStatus[] = ['NOT_YET', 'DONE'];

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

// Transform API sub_tasks to UI SubTask format (recursive - supports levels 2-5)
function transformApiSubTasks(subTasks: ApiTask[] | undefined, parentLevel: number = 1): SubTask[] {
  if (!subTasks || subTasks.length === 0) return [];

  return subTasks.map((subTask) => {
    // Calculate progress from store_progress (if available)
    // Default to 0 - Progress should only show when task has been dispatched to stores
    let progressCompleted = 0;
    let progressTotal = 0;
    let unableCount = 0;

    if (subTask.store_progress && subTask.store_progress.total > 0) {
      progressTotal = subTask.store_progress.total;
      progressCompleted = subTask.store_progress.completed_count;
      unableCount = subTask.store_progress.unable;
    }
    // If no store_progress: progress stays 0/0 (task not yet dispatched)

    // Use calculated_status from API if available
    const taskStatus = subTask.calculated_status
      ? subTask.calculated_status.toUpperCase() as SubTask['status']
      : STATUS_MAP[subTask.status_id || 7] || 'NOT_YET';

    // Get the level from API or calculate from parent
    const level = subTask.task_level || (parentLevel + 1);

    // Recursively transform nested sub_tasks (levels 3, 4, 5)
    const children = transformApiSubTasks(subTask.sub_tasks, level);

    return {
      id: subTask.task_id.toString(),
      name: subTask.task_name,
      status: taskStatus,
      assignee: subTask.assigned_staff?.staff_name || undefined,
      completedAt: subTask.completed_time || undefined,
      startDate: formatDateForUI(subTask.start_date),
      endDate: formatDateForUI(subTask.end_date),
      progress: {
        completed: progressCompleted,
        total: progressTotal,
      },
      unable: unableCount,
      // HQ Check: Only show for dispatched tasks (progressTotal > 0)
      // undefined = task not yet dispatched
      hqCheck: progressTotal > 0 ? (subTask.status_id === 9 ? 'DONE' : 'NOT_YET') : undefined,
      // Nested children and level for recursive display
      children: children.length > 0 ? children : undefined,
      level,
    };
  });
}

// Helper function to flatten nested sub-tasks for table rendering
// Converts recursive tree structure into flat array with level info
function flattenSubTasks(subTasks: SubTask[]): SubTask[] {
  const result: SubTask[] = [];

  function processSubTask(subTask: SubTask) {
    result.push(subTask);
    if (subTask.children && subTask.children.length > 0) {
      subTask.children.forEach(child => processSubTask(child));
    }
  }

  subTasks.forEach(subTask => processSubTask(subTask));
  return result;
}

// Transform API Task to UI TaskGroup format
function transformApiTaskToTaskGroup(task: ApiTask, index: number, departments: Department[]): TaskGroup {
  // Find the department from task.dept_id (creator's department)
  const dept = departments.find(d => d.department_id === task.dept_id);

  // If department has a parent_id, find the parent (division) and use its code
  // This ensures we display the division (OP, Admin) instead of child department (PERI, GRO)
  let displayDept = dept;
  if (dept?.parent_id) {
    const parentDept = departments.find(d => d.department_id === dept.parent_id);
    if (parentDept) {
      displayDept = parentDept;
    }
  }

  const deptCode = displayDept?.department_code || displayDept?.department_name?.substring(0, 3).toUpperCase() || 'N/A';
  const deptName = displayDept?.department_name || '';

  // Transform nested sub_tasks from API
  const subTasks = transformApiSubTasks(task.sub_tasks);

  // Calculate progress from store_progress (preferred) or sub_tasks (fallback)
  // Default to 0 - Progress should only show when task has been dispatched to stores
  let progressCompleted = 0;
  let progressTotal = 0;
  let unableCount = 0;

  if (task.store_progress && task.store_progress.total > 0) {
    // Use store_progress from API (task_store_assignments data)
    // Only dispatched tasks (NOT_YET, ON_PROGRESS, DONE, OVERDUE) have store assignments
    progressTotal = task.store_progress.total;
    progressCompleted = task.store_progress.completed_count;
    unableCount = task.store_progress.unable;
  } else if (subTasks.length > 0 && task.status_id !== 12 && task.status_id !== 13) {
    // Fallback: Calculate from sub_tasks ONLY for dispatched tasks
    // DRAFT (12) and APPROVE (13) tasks should NOT show progress since they haven't been dispatched
    // sub_tasks don't have 'UNABLE' status
    progressTotal = subTasks.length;
    progressCompleted = subTasks.filter(st => st.status === 'DONE').length;
    // Note: unableCount stays 0 for sub_tasks as they don't have 'UNABLE' status
  }
  // If no store_progress and no sub_tasks: progress stays 0/0 (task not yet dispatched)

  // Use calculated_status from API if available, otherwise fall back to status_id mapping
  const taskStatus = task.calculated_status
    ? task.calculated_status.toUpperCase() as TaskGroup['status']
    : STATUS_MAP[task.status_id || 7] || 'NOT_YET';

  // Extract creator info from API response (createdBy field from TaskListResource)
  const creator = task.createdBy ? {
    staff_id: task.createdBy.staff_id,
    staff_name: task.createdBy.staff_name,
    job_grade: task.createdBy.job_grade,
    department_name: deptName,
    department_code: deptCode,
  } : null;

  return {
    id: task.task_id.toString(),
    no: index + 1,
    dept: deptCode,
    deptId: task.dept_id,
    deptName: deptName,
    taskGroupName: task.task_name,
    taskType: undefined,
    startDate: formatDateForUI(task.start_date),
    endDate: formatDateForUI(task.end_date),
    progress: {
      completed: progressCompleted,
      total: progressTotal,
    },
    unable: unableCount,
    status: taskStatus,
    // HQ Check: Only show for dispatched tasks (progressTotal > 0)
    // DONE if task is completed (status_id=9), otherwise NOT_YET
    // undefined = task not yet dispatched (DRAFT, APPROVE status)
    hqCheck: progressTotal > 0 ? (task.status_id === 9 ? 'DONE' : 'NOT_YET') : undefined,
    subTasks: subTasks,
    createdStaffId: task.created_staff_id,
    creator: creator,
    approverId: task.approver_id,
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

  // Row action menu state - now includes position for fixed positioning
  const [openActionMenu, setOpenActionMenu] = useState<{
    taskId: string;
    position: { top: number; right: number };
  } | null>(null);

  // Approval History Modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedTaskHistory, setSelectedTaskHistory] = useState<TaskApprovalHistory | null>(null);

  // Pause Task Modal state
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseTaskId, setPauseTaskId] = useState<string | null>(null);
  const [pauseReason, setPauseReason] = useState('');
  const [isPausing, setIsPausing] = useState(false);
  const [pauseError, setPauseError] = useState<string | null>(null);

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

      // Department filter from modal (supports multiple departments)
      // Always use dept_ids filter - filters by creator's department (staff.department_id)
      if (filters.departments.length > 0) {
        queryParams['filter[dept_ids]'] = filters.departments.join(',');
      }

      // Status filter from modal (supports multiple statuses)
      if (filters.status.length === 1) {
        // Single status - use exact filter
        queryParams['filter[status_id]'] = STATUS_ID_MAP[filters.status[0] as TaskStatus];
      } else if (filters.status.length > 1) {
        // Multiple statuses - use comma-separated filter
        const statusIds = filters.status.map(s => STATUS_ID_MAP[s as TaskStatus]).join(',');
        queryParams['filter[status_ids]'] = statusIds;
      }

      // My Tasks filter - filter by created_staff_id when viewScope is "My Tasks"
      if (filters.viewScope === 'My Tasks' && currentUser?.staff_id) {
        queryParams['filter[created_staff_id]'] = currentUser.staff_id;
      }

      // Fetch tasks with server-side pagination
      // Response now includes draft_info for HQ users (no separate API call needed)
      const response = await getTasks(queryParams);
      allTasks = response.data || [];

      // Use server's pagination info (Laravel wraps in 'meta' object)
      setTotalPages(response.meta?.last_page || 1);
      setTotalItems(response.meta?.total || 0);

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
  // Include filters.viewScope to trigger refetch when switching between "All team" and "My Tasks"
  }, [currentPage, itemsPerPage, debouncedSearch, dateRange, filters.departments, filters.status, filters.viewScope, currentUser?.staff_id]);

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
  // HQ Check column only has 2 options: NOT_YET or DONE (for both HQ and Store users)
  const hqCheckOptions = HQ_CHECK_OPTIONS;

  // Toggle accordion
  const toggleRow = (taskId: string) => {
    setExpandedRows(expandedRows === taskId ? null : taskId);
  };

  // Navigate to task detail page or edit page (for drafts)
  const handleRowClick = (task: TaskGroup) => {
    // DRAFT: Chỉ creator mới thấy DRAFT của mình trong list → luôn navigate đến edit
    // APPROVE: Approver thấy task cần duyệt → navigate đến Add Task để approve/reject
    // APPROVE + G9 + Creator: G9 là cấp cao nhất, tự approve task của mình
    const isApprover = task.status === 'APPROVE' && task.approverId === currentUser?.staff_id;
    const isG9SelfApprove = task.status === 'APPROVE'
      && task.createdStaffId === currentUser?.staff_id
      && currentUser?.job_grade === 'G9';

    if (task.status === 'DRAFT' || isApprover || isG9SelfApprove) {
      router.push(`/tasks/new?id=${task.id}&source=task_list`);
    } else {
      router.push(`/tasks/detail?id=${task.id}`);
    }
  };

  // Row action menu handlers
  const handleViewApprovalHistory = async (taskId: string) => {
    setOpenActionMenu(null);

    try {
      // Fetch approval history from backend API
      const historyResponse = await getTaskApprovalHistory(parseInt(taskId, 10));

      // Transform API response to match frontend interface
      const history: TaskApprovalHistory = {
        taskId: historyResponse.taskId,
        taskName: historyResponse.taskName,
        taskStartDate: historyResponse.taskStartDate,
        taskEndDate: historyResponse.taskEndDate,
        currentRound: historyResponse.currentRound,
        totalRounds: historyResponse.totalRounds,
        rounds: historyResponse.rounds.map(round => ({
          roundNumber: round.roundNumber,
          steps: round.steps.map(step => ({
            stepNumber: step.stepNumber,
            stepName: step.stepName,
            status: step.status,
            assignee: {
              type: step.assignee.type,
              id: step.assignee.id,
              name: step.assignee.name,
              avatar: step.assignee.avatar,
              count: step.assignee.count,
            },
            startDate: step.startDate || '',
            endDate: step.endDate || '',
            actualStartAt: step.actualStartAt,
            actualEndAt: step.actualEndAt,
            comment: step.comment,
            progress: step.progress,
          })),
        })),
      };

      setSelectedTaskHistory(history);
      setIsHistoryModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch approval history:', error);
      // Show error message or fallback to basic info
      const task = tasks.find(t => t.id === taskId);
      setSelectedTaskHistory({
        taskId: taskId,
        taskName: task?.taskGroupName || 'Task',
        currentRound: 1,
        totalRounds: 1,
        rounds: [{
          roundNumber: 1,
          steps: [{
            stepNumber: 1,
            stepName: 'SUBMIT',
            status: 'pending',
            assignee: { type: 'user', name: 'Loading...' },
            startDate: '',
            endDate: '',
          }],
        }],
      });
      setIsHistoryModalOpen(true);
    }
  };

  const handlePauseTask = (taskId: string) => {
    setOpenActionMenu(null);
    // Find the task to check if current user is the approver
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Check permission: Only approver can pause (not implemented in frontend - backend will check)
    // Check status: Only NOT_YET or ON_PROGRESS can be paused
    if (!['NOT_YET', 'ON_PROGRESS'].includes(task.status)) {
      alert('Only tasks with status "Not Yet" or "On Progress" can be paused.');
      return;
    }

    // Open confirmation modal
    setPauseTaskId(taskId);
    setPauseReason('');
    setPauseError(null);
    setIsPauseModalOpen(true);
  };

  const handleConfirmPause = async () => {
    if (!pauseTaskId) return;

    setIsPausing(true);
    setPauseError(null);

    try {
      await pauseTask(parseInt(pauseTaskId, 10), pauseReason || undefined);

      // Close modal and refresh tasks
      setIsPauseModalOpen(false);
      setPauseTaskId(null);
      setPauseReason('');

      // Refresh task list
      if (departments.length > 0) {
        fetchTasks(departments);
      }
    } catch (error) {
      console.error('Failed to pause task:', error);
      setPauseError(error instanceof Error ? error.message : 'Failed to pause task. You may not have permission.');
    } finally {
      setIsPausing(false);
    }
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

    // HQ Check filter - combine modal filter (filters.hqCheck) and column filter (hqCheckColumnFilter)
    const combinedHQCheckFilter = [...new Set([...filters.hqCheck, ...hqCheckColumnFilter])];
    // If no filter applied OR task.hqCheck matches one of the filters
    // Note: tasks with undefined hqCheck (not yet dispatched) are shown when no filter applied
    const matchesHQCheckColumn =
      combinedHQCheckFilter.length === 0 || (task.hqCheck !== undefined && combinedHQCheckFilter.includes(task.hqCheck));

    return matchesDeptColumn && matchesStatusColumn && matchesHQCheckColumn;
  });

  // Re-number tasks after client-side filtering to show correct sequence (1, 2, 3...)
  // This is necessary because Store users may have APPROVE/DRAFT tasks filtered out
  const paginatedTasks = filteredTasks.map((task, index) => ({
    ...task,
    no: (currentPage - 1) * itemsPerPage + index + 1,
  }));

  // Calculate actual displayed count (after client-side filters)
  // This may differ from server's totalItems due to DRAFT ownership filter
  const displayedCount = filteredTasks.length;

  // Reset to page 1 when server-side filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, dateRange, filters]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          {/* Date Picker */}
          <DatePicker
            dateMode={dateMode}
            onDateChange={handleDateChange}
          />

          {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto sm:flex-1 sm:justify-end">
            <div className="relative w-full sm:w-64 md:w-80 lg:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search tasks by name"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium w-full sm:w-auto"
              aria-label="Open filter options"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                {/* Draft limit badge */}
                {sourceDraftInfo && (
                  <div className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
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
                  className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
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

      {/* Loading State - Skeleton */}
      {isLoading && <TaskListPageSkeleton />}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorDisplay
          title="Failed to load tasks"
          message={error}
          onRetry={() => fetchTasks(departments)}
          className="mb-4"
        />
      )}

      {/* Body - Table Container */}
      {!isLoading && !error && (
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <ResponsiveTable className="max-h-[calc(100vh-280px)] overflow-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-pink-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    No
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
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
                  <th scope="col" className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    Task Group
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    Start → End
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    Progress
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
                    Unable
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 bg-pink-50">
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
                  <th scope="col" className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 bg-pink-50">
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
                  <TableEmptyState message="No tasks found" colSpan={8} />
                ) : (
                  paginatedTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      {/* Parent Row */}
                      <tr
                        className="group hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 animate-fade-in-up"
                        style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
                        onClick={() => handleRowClick(task)}
                      >
                        <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                          {task.no}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-sm border-r border-gray-200">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{task.dept}</span>
                            {task.creator && (
                              <CreatorAvatar
                                creator={task.creator}
                                size="sm"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-sm border-r border-gray-200">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-gray-900 dark:text-white">{task.taskGroupName}</span>
                            {/* Expand button at the END of Task Group cell */}
                            {task.subTasks && task.subTasks.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRow(task.id);
                                }}
                                className="flex-shrink-0 flex items-center justify-center w-6 h-6 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                aria-expanded={expandedRows === task.id}
                                aria-label={expandedRows === task.id ? 'Collapse subtasks' : 'Expand subtasks'}
                              >
                                <svg
                                  className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                                    expandedRows === task.id ? 'rotate-180' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                          {task.startDate} → {task.endDate}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                          {task.progress.total > 0 ? `${task.progress.completed}/${task.progress.total}` : '-'}
                        </td>
                        <td
                          className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200"
                          rowSpan={expandedRows === task.id && task.subTasks && task.subTasks.length > 0 ? 1 + task.subTasks.length : 1}
                        >
                          {task.progress.total > 0 ? task.unable : '-'}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-sm border-r border-gray-200">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewApprovalHistory(task.id);
                              }}
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                              title="View approval history"
                            >
                              <StatusPill status={task.status} />
                            </button>
                          </div>
                        </td>
                        {/* HQ Check + Action Menu */}
                        <td className="px-4 py-2.5 whitespace-nowrap text-sm">
                          <div className="relative flex items-center justify-center">
                            {task.hqCheck ? <StatusPill status={task.hqCheck} /> : <span className="text-gray-400">-</span>}
                            {/* 3-dots Action Menu - positioned with margin from StatusPill */}
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2" data-action-menu>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  if (openActionMenu?.taskId === task.id) {
                                    setOpenActionMenu(null);
                                  } else {
                                    setOpenActionMenu({
                                      taskId: task.id,
                                      position: {
                                        top: rect.top,
                                        right: window.innerWidth - rect.left + 4,
                                      },
                                    });
                                  }
                                }}
                                className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity focus:opacity-100"
                                aria-label="Task actions menu"
                                aria-haspopup="menu"
                                aria-expanded={openActionMenu?.taskId === task.id}
                              >
                                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <circle cx="12" cy="5" r="1.5" />
                                  <circle cx="12" cy="12" r="1.5" />
                                  <circle cx="12" cy="19" r="1.5" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Sub Tasks (Accordion) - Displays all levels (2-5) with indentation */}
                      {expandedRows === task.id && task.subTasks && task.subTasks.length > 0 && (
                        <>
                          {flattenSubTasks(task.subTasks).map((subTask, subIndex) => {
                            // Calculate indentation based on level (level 2 = 8px, level 3 = 16px, etc.)
                            const indentPx = (subTask.level || 2) * 8;

                            return (
                              <tr
                                key={subTask.id}
                                className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 animate-fade-in-down"
                                style={{ animationDelay: `${subIndex * 50}ms`, animationFillMode: 'both' }}
                              >
                                <td className="px-4 py-2 text-center border-r border-gray-200"></td>
                                <td className="px-4 py-2 border-r border-gray-200"></td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200">
                                  <div style={{ paddingLeft: `${indentPx}px` }}>
                                    <span className="flex items-center gap-1">
                                      {/* Level indicator for levels 3+ */}
                                      {(subTask.level || 2) > 2 && (
                                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                                          {'└─'}
                                        </span>
                                      )}
                                      <span>
                                        {subTask.name}
                                        {subTask.assignee && (
                                          <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                                            ({subTask.assignee})
                                          </span>
                                        )}
                                      </span>
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center border-r border-gray-200">
                                  {subTask.startDate} → {subTask.endDate}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-center border-r border-gray-200">
                                  {subTask.progress && subTask.progress.total > 0 ? `${subTask.progress.completed}/${subTask.progress.total}` : '-'}
                                </td>
                                <td className="px-4 py-2 border-r border-gray-200">
                                  <div className="flex items-center justify-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewApprovalHistory(subTask.id);
                                      }}
                                      className="cursor-pointer hover:opacity-80 transition-opacity"
                                      title="View approval history"
                                    >
                                      <StatusPill status={subTask.status} />
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-2">
                                  {subTask.hqCheck && (
                                    <div className="flex items-center justify-center">
                                      <StatusPill status={subTask.hqCheck} />
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </ResponsiveTable>

          {/* Pagination */}
          <div className="bg-white px-4 py-2.5 border-t border-gray-200">
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
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                  aria-label="Next page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
        isHQUser={isHQ}
      />

      {/* Fixed Position Action Menu Dropdown */}
      {openActionMenu && (
        <div
          data-action-menu
          className="fixed w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[9999]"
          style={{
            top: openActionMenu.position.top,
            right: openActionMenu.position.right,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewApprovalHistory(openActionMenu.taskId);
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
              handlePauseTask(openActionMenu.taskId);
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

      {/* Approval History Modal */}
      <ApprovalHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedTaskHistory(null);
        }}
        history={selectedTaskHistory}
        onViewTask={(taskId) => {
          setIsHistoryModalOpen(false);
          router.push(`/tasks/new?id=${taskId}&source=task_list`);
        }}
      />

      {/* Pause Task Confirmation Modal */}
      {isPauseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" role="dialog" aria-modal="true" aria-labelledby="pause-modal-title">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 id="pause-modal-title" className="text-lg font-semibold text-gray-900 mb-2">Pause Task</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to pause this task? This will:
            </p>
            <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
              <li>Return the task to &quot;Pending Approval&quot; status</li>
              <li>Remove all store assignments</li>
              <li>Allow the approver to edit and re-approve</li>
            </ul>

            <div className="mb-4">
              <label htmlFor="pauseReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason (optional)
              </label>
              <textarea
                id="pauseReason"
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                placeholder="Why is this task being paused?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={3}
              />
            </div>

            {pauseError && (
              <div className="mb-4">
                <InlineError message={pauseError} />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsPauseModalOpen(false);
                  setPauseTaskId(null);
                  setPauseReason('');
                  setPauseError(null);
                }}
                disabled={isPausing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPause}
                disabled={isPausing}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isPausing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Pausing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause Task
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
