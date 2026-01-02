'use client';

import Image from 'next/image';
import { LastWeekReviewTask } from '@/types/todoTask';

interface LastWeekReviewPanelProps {
  weekNumber: number;
  tasks: LastWeekReviewTask[];
  isExpanded: boolean;
  onToggle: () => void;
}

export default function LastWeekReviewPanel({ weekNumber, tasks, isExpanded, onToggle }: LastWeekReviewPanelProps) {

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Panel Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Icon */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
            <Image
              src="/icons/stash_last-updates-solid.png"
              alt="Last Week"
              width={20}
              height={20}
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          {/* Title */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Last Week Review
          </h3>
        </div>
        {/* Expand/Collapse Arrow */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? '' : '-rotate-90'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="bg-white dark:bg-gray-700">
          {/* Desktop: Table view */}
          <div className="hidden sm:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-pink-50 dark:bg-pink-900/20 h-10">
                  <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 dark:text-pink-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                    W{weekNumber} Task
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 dark:text-pink-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                    Progress/Bottleneck
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 dark:text-pink-300 uppercase tracking-wider">
                    Output
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/50 h-12">
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      {task.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600">
                      {task.progress}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                      {task.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card view */}
          <div className="sm:hidden divide-y divide-gray-200 dark:divide-gray-600">
            {tasks.map((task) => (
              <div key={task.id} className="p-3 space-y-2">
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {task.name}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Progress:</span>
                    <p className="text-gray-700 dark:text-gray-300 mt-0.5">{task.progress}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Output:</span>
                    <p className="text-gray-700 dark:text-gray-300 mt-0.5">{task.output}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
