'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TaskGroup, DateMode, TaskFilters, TaskStatus, HQCheckStatus } from '@/types/tasks';
import { Task as ApiTask, Department } from '@/types/api';
import { getTasks, getDepartments } from '@/lib/api';
import StatusPill from '@/components/ui/StatusPill';
import FilterModal from '@/components/tasks/FilterModal';
import DatePicker from '@/components/ui/DatePicker';
import ColumnFilterDropdown from '@/components/ui/ColumnFilterDropdown';

// Map API status_id to UI status
const STATUS_MAP: Record<number, TaskStatus> = {
  7: 'NOT_YET',  // pending
  8: 'DRAFT',   // in_progress
  9: 'DONE',    // completed
};

// Map API status_id to HQ Check status
const HQ_CHECK_MAP: Record<number, HQCheckStatus> = {
  7: 'NOT_YET',
  8: 'DRAFT',
  9: 'DONE',
};

// Transform API Task to UI TaskGroup format
function transformApiTaskToTaskGroup(task: ApiTask, index: number, departments: Department[]): TaskGroup {
  const dept = departments.find(d => d.department_id === task.dept_id);
  const deptCode = dept?.department_code || dept?.department_name?.substring(0, 3).toUpperCase() || 'N/A';

  // Format dates from API (YYYY-MM-DD) to UI format (DD/MM)
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '--/--';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  return {
    id: task.task_id.toString(),
    no: index + 1,
    dept: deptCode,
    deptId: task.dept_id,
    taskGroupName: task.task_name,
    taskType: undefined,
    startDate: formatDate(task.start_date),
    endDate: formatDate(task.end_date),
    progress: {
      completed: task.status_id === 9 ? 1 : 0,
      total: 1,
    },
    unable: 0,
    status: STATUS_MAP[task.status_id || 7] || 'NOT_YET',
    hqCheck: HQ_CHECK_MAP[task.status_id || 7] || 'NOT_YET',
    subTasks: [],
  };
}

export default function TaskListPage() {
  const router = useRouter();

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Fetch tasks from API
  const fetchTasks = useCallback(async (depts: Department[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiTasks = await getTasks();

      // Handle paginated response
      const taskData = Array.isArray(apiTasks) ? apiTasks : (apiTasks as any).data || [];

      // Transform API tasks to UI format
      const transformedTasks = taskData.map((task: ApiTask, index: number) =>
        transformApiTaskToTaskGroup(task, index, depts)
      );

      setTasks(transformedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      const depts = await fetchDepartments();
      await fetchTasks(depts);
    };
    loadData();
  }, [fetchDepartments, fetchTasks]);

  // Get unique values for column filters
  const uniqueDepts = [...new Set(tasks.map((t) => t.dept))];
  const statusOptions = ['NOT_YET', 'DRAFT', 'DONE'];
  const hqCheckOptions = ['NOT_YET', 'DRAFT', 'DONE'];

  // Toggle accordion
  const toggleRow = (taskId: string) => {
    setExpandedRows(expandedRows === taskId ? null : taskId);
  };

  // Navigate to task detail page
  const handleRowClick = (taskId: string) => {
    router.push(`/tasks/detail?id=${taskId}`);
  };

  // Apply filters handler
  const handleApplyFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Date change handler
  const handleDateChange = (mode: DateMode, newDateRange: DateRange) => {
    setDateMode(mode);
    setDateRange(newDateRange);
  };

  // Helper function to parse date string (DD/MM format) to Date object
  const parseTaskDate = (dateStr: string): Date => {
    if (dateStr === '--/--') return new Date(0);
    const [day, month] = dateStr.split('/').map(Number);
    const year = new Date().getFullYear();
    return new Date(year, month - 1, day);
  };

  // Get current week range for default display logic
  const getCurrentWeekRange = (): DateRange => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { from: startOfWeek, to: endOfWeek };
  };

  const currentWeekRange = getCurrentWeekRange();

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const taskStartDate = parseTaskDate(task.startDate);
    const taskEndDate = parseTaskDate(task.endDate);

    // Default display logic: current week tasks + old tasks with NOT_YET status
    const isInCurrentWeek =
      taskEndDate >= currentWeekRange.from && taskStartDate <= currentWeekRange.to;
    const isOldTaskNotYet =
      taskEndDate < currentWeekRange.from && task.status === 'NOT_YET';

    // Apply date range filter from DatePicker (when user selects specific date/week)
    const matchesSelectedDateRange =
      taskEndDate >= dateRange.from && taskStartDate <= dateRange.to;

    // Combined date logic:
    // - If user is on default view (DAY mode with today), show current week + old NOT_YET
    // - If user selected specific date/week/custom, respect that selection
    const isDefaultView = dateMode === 'DAY' &&
      dateRange.from.toDateString() === new Date().toDateString();

    const matchesDateRange = isDefaultView
      ? (isInCurrentWeek || isOldTaskNotYet)
      : matchesSelectedDateRange;

    // Search filter
    const matchesSearch =
      task.taskGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.dept.toLowerCase().includes(searchQuery.toLowerCase());

    // Department filter (modal) - compare with department_id
    const matchesDeptModal =
      filters.departments.length === 0 ||
      filters.departments.some((selectedDeptId) => {
        // selectedDeptId is a string of department_id (e.g., "11", "12")
        return task.deptId !== null && String(task.deptId) === selectedDeptId;
      });

    // Department column filter
    const matchesDeptColumn =
      deptColumnFilter.length === 0 || deptColumnFilter.includes(task.dept);

    // Status filter (modal)
    const matchesStatusModal =
      filters.status.length === 0 || filters.status.includes(task.status);

    // Status column filter
    const matchesStatusColumn =
      statusColumnFilter.length === 0 || statusColumnFilter.includes(task.status);

    // HQ Check filter (modal)
    const matchesHQCheckModal =
      filters.hqCheck.length === 0 || filters.hqCheck.includes(task.hqCheck);

    // HQ Check column filter
    const matchesHQCheckColumn =
      hqCheckColumnFilter.length === 0 || hqCheckColumnFilter.includes(task.hqCheck);

    return matchesDateRange && matchesSearch && matchesDeptModal && matchesDeptColumn && matchesStatusModal && matchesStatusColumn && matchesHQCheckModal && matchesHQCheckColumn;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, deptColumnFilter, statusColumnFilter, hqCheckColumnFilter, dateRange]);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">List tasks</h1>

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

            <button
              onClick={() => router.push('/tasks/new')}
              className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
            >
              <span className="text-lg">+</span>
              ADD NEW
            </button>
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
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(task.id)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center border-r border-gray-200">
                          {startIndex + index + 1}
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center justify-center">
                            <StatusPill status={task.hqCheck} />
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
                              <td className="px-4 py-2 border-r border-gray-200">
                                <div className="flex items-center justify-center">
                                  <StatusPill status={subTask.status} />
                                </div>
                              </td>
                              <td className="px-4 py-2"></td>
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
                Total: <span className="font-semibold text-gray-900">{filteredTasks.length}</span> tasks group
                {filteredTasks.length > 0 && (
                  <span className="ml-2 text-gray-500">
                    (Showing {startIndex + 1}-{Math.min(endIndex, filteredTasks.length)})
                  </span>
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
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
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
                ))}
                {totalPages > 5 && <span className="px-2">...</span>}
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
