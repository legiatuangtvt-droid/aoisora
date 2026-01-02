'use client';

import React from 'react';

interface TaskLibraryHeaderProps {
  onCreateNew: () => void;
}

const TaskLibraryHeader: React.FC<TaskLibraryHeaderProps> = ({ onCreateNew }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-base font-bold text-gray-900 uppercase tracking-wide">
          TASK LIBRARY
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and organize recurring tasks for office and store operations.
        </p>
      </div>
      <button
        onClick={onCreateNew}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C5055B] hover:bg-[#a50450] text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
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
  );
};

export default TaskLibraryHeader;
