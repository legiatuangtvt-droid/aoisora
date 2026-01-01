'use client';

import { TaskLevel } from '@/types/addTask';

interface TaskMapsTabProps {
  taskLevels: TaskLevel[];
  onAddSubLevel: (parentId: string) => void;
}

// Level subtitles
const LEVEL_SUBTITLES: Record<number, string> = {
  1: 'Main task',
  2: 'Sub task',
  3: 'Sub task level 3',
  4: 'Sub task level 4',
  5: 'Sub task level 5',
};

export default function TaskMapsTab({ taskLevels, onAddSubLevel }: TaskMapsTabProps) {
  // Get children of a task level
  const getChildren = (parentId: string): TaskLevel[] => {
    return taskLevels.filter((tl) => tl.parentId === parentId);
  };

  // Get root level
  const rootLevels = taskLevels.filter((tl) => tl.parentId === null);

  // Render the task card component
  const renderTaskCard = (taskLevel: TaskLevel, isRoot: boolean, canAddSubLevel: boolean): JSX.Element => (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border min-w-[280px] ${
        isRoot
          ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isRoot
            ? 'bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-700'
            : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        {isRoot ? (
          // Root task icon (grid/dashboard icon)
          <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ) : (
          // Sub-task icon (arrow/branch icon)
          <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        )}
      </div>

      {/* Title & Subtitle */}
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Task Level {taskLevel.level}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {taskLevel.name || LEVEL_SUBTITLES[taskLevel.level] || 'Sub task'}
        </p>
      </div>

      {/* Add button (only for non-root and can add) */}
      {!isRoot && canAddSubLevel && (
        <button
          onClick={() => onAddSubLevel(taskLevel.id)}
          className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center hover:bg-pink-200 dark:hover:bg-pink-800/50 transition-colors"
        >
          <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Root card: Detail dropdown */}
      {isRoot && (
        <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          Detail
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );

  // Render a single task node in the map with proper indentation
  const renderTaskNode = (taskLevel: TaskLevel, isRoot: boolean = false): JSX.Element => {
    const children = getChildren(taskLevel.id);
    const canAddSubLevel = taskLevel.level < 5;
    const hasChildren = children.length > 0;

    return (
      <div key={taskLevel.id} className="flex flex-col">
        {/* Task Card */}
        {renderTaskCard(taskLevel, isRoot, canAddSubLevel)}

        {/* Children with indentation */}
        {hasChildren && (
          <div className="relative ml-6 mt-2 pl-6 border-l-2 border-gray-200 dark:border-gray-600">
            {children.map((child, index) => (
              <div key={child.id} className="relative">
                {/* Horizontal connector line */}
                <div className="absolute left-0 top-5 w-6 h-px bg-gray-200 dark:bg-gray-600 -translate-x-6" />

                {/* Child node with margin for spacing */}
                <div className={index > 0 ? 'mt-3' : ''}>
                  {renderTaskNode(child, false)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Empty state
  if (rootLevels.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
        <p className="text-gray-500 dark:text-gray-400">
          No task levels to display
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Add task levels in the Detail tab to see the hierarchy
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 min-h-[400px]">
        {/* Render the tree */}
        <div className="flex flex-col items-start">
          {rootLevels.map((root) => renderTaskNode(root, true))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Save as draft
        </button>
        <button
          className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
