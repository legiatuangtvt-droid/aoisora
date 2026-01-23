'use client';

import React from 'react';

interface DraftLimitInfo {
  current_drafts: number;
  max_drafts: number;
  remaining_drafts: number;
  can_create_draft: boolean;
}

interface TaskLibraryHeaderProps {
  onCreateNew: () => void;
  draftLimitInfo?: DraftLimitInfo | null;
}

const TaskLibraryHeader: React.FC<TaskLibraryHeaderProps> = ({ onCreateNew, draftLimitInfo }) => {
  const isLimitReached = Boolean(draftLimitInfo && !draftLimitInfo.can_create_draft);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wide">
          TASK LIBRARY
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage and organize recurring tasks for office and store operations.
        </p>
      </div>

      <div className="flex items-center gap-3">
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
          onClick={onCreateNew}
          disabled={isLimitReached}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
            isLimitReached
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-[#C5055B] hover:bg-[#a50450] text-white'
          }`}
          title={isLimitReached
            ? `Draft limit reached (${draftLimitInfo?.max_drafts} max). Please complete or delete existing drafts.`
            : 'Create a new task template'
          }
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Task
        </button>
      </div>
    </div>
  );
};

export default TaskLibraryHeader;
