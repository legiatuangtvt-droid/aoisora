'use client';

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
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill="#6B7280"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 6C12.5523 6 13 6.44772 13 7V11.5858L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L11.2929 12.7071C11.1054 12.5196 11 12.2652 11 12V7C11 6.44772 11.4477 6 12 6Z" fill="#6B7280"/>
            </svg>
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
