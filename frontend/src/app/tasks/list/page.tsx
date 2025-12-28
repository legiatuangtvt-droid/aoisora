'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskGroup, DateMode, TaskFilters } from '@/types/tasks';
import { mockTaskGroups } from '@/data/mockTasks';
import StatusPill from '@/components/ui/StatusPill';
import FilterModal from '@/components/tasks/FilterModal';
import DatePicker from '@/components/ui/DatePicker';
import ColumnFilterDropdown from '@/components/ui/ColumnFilterDropdown';

export default function TaskListPage() {
  const router = useRouter();

  // Date range state for filtering
  interface DateRange {
    from: Date;
    to: Date;
  }

  // State management
  const [dateMode, setDateMode] = useState<DateMode>('TODAY');
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return { from: today, to: endOfToday };
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<TaskGroup[]>(mockTaskGroups);
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

  // Get unique values for column filters
  const uniqueDepts = [...new Set(mockTaskGroups.map((t) => t.dept))];
  const statusOptions = ['NOT_YET', 'DRAFT', 'DONE'];
  const hqCheckOptions = ['NOT_YET', 'DRAFT', 'DONE'];

  // Pagination state - fixed 10 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed number of items per page

  // Toggle accordion - only one row can be expanded at a time
  const toggleRow = (taskId: string) => {
    // If clicking on already expanded row, close it. Otherwise, open the new one (closing any previously opened)
    setExpandedRows(expandedRows === taskId ? null : taskId);
  };

  // Navigate to task detail page
  const handleRowClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
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
    const [day, month] = dateStr.split('/').map(Number);
    const year = new Date().getFullYear(); // Assume current year
    return new Date(year, month - 1, day);
  };

  // Filter tasks based on search, modal filters, column filters, and date range
  const filteredTasks = tasks.filter((task) => {
    // Date range filter - check if task's date range overlaps with selected date range
    const taskStartDate = parseTaskDate(task.startDate);
    const taskEndDate = parseTaskDate(task.endDate);
    const matchesDateRange =
      taskEndDate >= dateRange.from && taskStartDate <= dateRange.to;

    // Search filter
    const matchesSearch =
      task.taskGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.dept.toLowerCase().includes(searchQuery.toLowerCase());

    // Department filter (modal)
    const matchesDeptModal =
      filters.departments.length === 0 ||
      filters.departments.some((deptId) => {
        // Check if task.dept matches any selected department code
        const deptCode = deptId.split('-').pop()?.toUpperCase();
        return task.dept === deptCode || deptId.includes(task.dept.toLowerCase());
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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

      {/* Body - Table Container */}
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
              {paginatedTasks.map((task, index) => (
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
                  {expandedRows === task.id && task.subTasks && (
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
              ))}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
      </div>
    </div>
  );
}
