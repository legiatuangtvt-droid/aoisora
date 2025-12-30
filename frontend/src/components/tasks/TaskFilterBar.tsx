'use client';

import { ViewMode, TaskDetailFilters } from '@/types/tasks';
import { mockFilterOptions } from '@/data/mockTaskDetail';

interface TaskFilterBarProps {
  filters: TaskDetailFilters;
  onFilterChange: (filters: TaskDetailFilters) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showStaffFilters?: boolean;
}

export default function TaskFilterBar({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  showStaffFilters = false,
}: TaskFilterBarProps) {
  const handleChange = (field: keyof TaskDetailFilters, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Left side - Filters */}
      <div className="flex items-center gap-3">
        {!showStaffFilters ? (
          <>
            {/* Region */}
            <select
              value={filters.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {mockFilterOptions.regions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Area */}
            <select
              value={filters.area}
              onChange={(e) => handleChange('area', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {mockFilterOptions.areas.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Store */}
            <select
              value={filters.store}
              onChange={(e) => handleChange('store', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {mockFilterOptions.stores.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            {/* All Locations */}
            <select
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {mockFilterOptions.locations.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* All Status */}
            <select
              value={filters.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {mockFilterOptions.statuses.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Right side - Search & View Mode Toggle */}
      <div className="flex items-center gap-3">
        {/* Search (Staff view only) */}
        {showStaffFilters && (
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="Search staff name or ID..."
              className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 w-64"
            />
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('results')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              viewMode === 'results'
                ? 'bg-white dark:bg-gray-600 text-[#C5055B] shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {/* Document/Results icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Results
          </button>
          <button
            onClick={() => onViewModeChange('comment')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              viewMode === 'comment'
                ? 'bg-white dark:bg-gray-600 text-[#C5055B] shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {/* Comment icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}
