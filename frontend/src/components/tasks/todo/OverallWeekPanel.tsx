'use client';

import { WeekOverviewTask } from '@/types/todoTask';

interface OverallWeekPanelProps {
  weekNumber: number;
  tasks: WeekOverviewTask[];
  onTargetChange?: (taskId: string, value: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function OverallWeekPanel({ weekNumber, tasks, onTargetChange, isExpanded, onToggle }: OverallWeekPanelProps) {

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Panel Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Icon */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-700 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M41.42 19.84L28.16 6.58004C26.09 4.51004 22.8 5.99004 22.8 8.92004V13.02C10.99 13.81 5 24.1 5 35.5C5 38.29 6.47 38.35 7.99 35.88C10.68 31.5 14.98 28.6 22.8 28.29V33.08C22.8 36.01 26.09 37.49 28.16 35.42L41.42 22.16C42.72 20.86 42.72 21.14 41.42 19.84Z" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Title */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Overall Week {weekNumber}
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
                    <span className="flex items-center gap-1">
                      Means/Method
                      <svg className="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 dark:text-pink-300 uppercase tracking-wider">
                    Target
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
                      {task.method}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={task.target}
                        onChange={(e) => onTargetChange?.(task.id, e.target.value)}
                        placeholder="Typing..."
                        className="w-full px-2 py-1 text-sm text-gray-900 dark:text-white bg-transparent focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500"
                      />
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
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {task.method}
                </div>
                <input
                  type="text"
                  value={task.target}
                  onChange={(e) => onTargetChange?.(task.id, e.target.value)}
                  placeholder="Target..."
                  className="w-full px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 focus:ring-1 focus:ring-pink-500 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
