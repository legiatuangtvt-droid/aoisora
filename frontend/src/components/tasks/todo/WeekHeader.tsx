'use client';

import { WeekInfo } from '@/types/todoTask';

interface WeekHeaderProps {
  weekInfo: WeekInfo;
  onAddNew: () => void;
  showAddButton?: boolean; // Hide on mobile when using FAB
}

export default function WeekHeader({ weekInfo, onAddNew, showAddButton = true }: WeekHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
      {/* Week Title */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          WEEK {weekInfo.weekNumber}, {weekInfo.year}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {weekInfo.dateRange}
        </p>
      </div>

      {/* Add New Button - Hidden on mobile when using FAB */}
      {showAddButton && (
        <button
          onClick={onAddNew}
          className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New
        </button>
      )}
    </div>
  );
}
