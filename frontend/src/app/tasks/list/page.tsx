'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { TaskGroup, DateMode, TaskFilters } from '@/types/tasks';
import { mockTaskGroups } from '@/data/mockTasks';
import StatusPill from '@/components/ui/StatusPill';
import SearchBar from '@/components/ui/SearchBar';
import FilterModal from '@/components/tasks/FilterModal';

export default function TaskListPage() {
  // State management
  const [dateMode, setDateMode] = useState<DateMode>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<TaskGroup[]>(mockTaskGroups);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    viewScope: 'All team',
    departments: [],
    status: [],
    hqCheck: [],
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const tableRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic items per page based on viewport height
  useEffect(() => {
    const calculateItemsPerPage = () => {
      // Get viewport height
      const viewportHeight = window.innerHeight;

      // Estimated heights (in pixels)
      const headerHeight = 280; // Page header + search bar + date picker
      const tableHeaderHeight = 44; // Table header row
      const paginationHeight = 60; // Pagination footer
      const padding = 64; // Top and bottom padding (p-8)
      const rowHeight = 50; // Approximate height of each table row

      // Calculate available height for table body
      const availableHeight = viewportHeight - headerHeight - tableHeaderHeight - paginationHeight - padding;

      // Calculate how many rows can fit
      const calculatedItems = Math.floor(availableHeight / rowHeight);

      // Set minimum of 5 items and maximum of 20 items per page
      const newItemsPerPage = Math.max(5, Math.min(20, calculatedItems));

      setItemsPerPage(newItemsPerPage);
    };

    // Calculate on mount
    calculateItemsPerPage();

    // Recalculate on window resize
    window.addEventListener('resize', calculateItemsPerPage);

    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);

  // Toggle accordion
  const toggleRow = (taskId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedRows(newExpanded);
  };

  // Apply filters handler
  const handleApplyFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.taskGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.dept.toLowerCase().includes(searchQuery.toLowerCase());

    // Department filter
    const matchesDept =
      filters.departments.length === 0 ||
      filters.departments.some((deptId) => {
        // Check if task.dept matches any selected department code
        const deptCode = deptId.split('-').pop()?.toUpperCase();
        return task.dept === deptCode || deptId.includes(task.dept.toLowerCase());
      });

    // Status filter
    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(task.status);

    // HQ Check filter
    const matchesHQCheck =
      filters.hqCheck.length === 0 || filters.hqCheck.includes(task.hqCheck);

    return matchesSearch && matchesDept && matchesStatus && matchesHQCheck;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">List tasks</h1>

        {/* Date Display & Actions */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Date Picker */}
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
            <span className="text-sm font-medium text-gray-700">
              TODAY: December 12, 2025
            </span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

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

            <button className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium">
              <span className="text-lg">+</span>
              ADD NEW
            </button>
          </div>
        </div>
      </div>

      {/* Body - Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    Dept
                    <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Task Group
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Start → End
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Progress
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Unable
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    Status
                    <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    HQ Check
                    <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedTasks.map((task) => (
                <React.Fragment key={task.id}>
                  {/* Parent Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {task.no}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold">
                            {task.dept.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{task.dept}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRow(task.id)}
                          className="flex items-center justify-center w-5 h-5 hover:bg-gray-200 rounded transition-colors"
                        >
                          <svg
                            className={`w-4 h-4 text-gray-600 transition-transform ${
                              expandedRows.has(task.id) ? 'rotate-180' : ''
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {task.startDate} → {task.endDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {task.progress.completed}/{task.progress.total}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                      {task.unable}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <StatusPill status={task.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <StatusPill status={task.hqCheck} />
                    </td>
                  </tr>

                  {/* Sub Tasks (Accordion) */}
                  {expandedRows.has(task.id) && task.subTasks && (
                    <>
                      {task.subTasks.map((subTask) => (
                        <tr key={subTask.id} className="bg-gray-50 border-t border-gray-100">
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2 text-sm text-gray-700">
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
                          <td className="px-4 py-2 text-sm text-gray-500">{task.startDate} → {task.endDate}</td>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2">
                            <StatusPill status={subTask.status} />
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
        </div>

        {/* Footer - Pagination */}
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
  );
}
