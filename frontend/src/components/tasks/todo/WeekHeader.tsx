'use client';

import { WeekInfo } from '@/types/todoTask';

interface DraftLimitInfo {
  current_drafts: number;
  max_drafts: number;
  remaining_drafts: number;
  can_create_draft: boolean;
}

interface WeekHeaderProps {
  weekInfo: WeekInfo;
  onAddNew: () => void;
  showAddButton?: boolean; // Hide on mobile when using FAB
  draftLimitInfo?: DraftLimitInfo | null;
}

export default function WeekHeader({ weekInfo, onAddNew, showAddButton = true, draftLimitInfo }: WeekHeaderProps) {
  const isLimitReached = Boolean(draftLimitInfo && !draftLimitInfo.can_create_draft);

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

      {/* Add New Button with Draft Limit - Hidden on mobile when using FAB */}
      {showAddButton && (
        <div className="hidden sm:flex items-center gap-3">
          {/* Draft limit badge */}
          {draftLimitInfo && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              draftLimitInfo.remaining_drafts === 0
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : draftLimitInfo.remaining_drafts <= 2
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`} title={`Drafts: ${draftLimitInfo.current_drafts}/${draftLimitInfo.max_drafts}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Drafts: {draftLimitInfo.current_drafts}/{draftLimitInfo.max_drafts}</span>
            </div>
          )}

          {/* Create New button */}
          <button
            onClick={onAddNew}
            disabled={isLimitReached}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLimitReached
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
            title={isLimitReached
              ? `Draft limit reached (${draftLimitInfo?.max_drafts} max). Please complete or delete existing drafts.`
              : 'Create a new task'
            }
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </button>
        </div>
      )}
    </div>
  );
}
