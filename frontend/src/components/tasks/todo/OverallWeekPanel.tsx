'use client';

import { WeekOverviewTask } from '@/types/todoTask';

interface OverallWeekPanelProps {
  weekNumber: number;
  tasks: WeekOverviewTask[];
  onTargetChange?: (taskId: string, value: string) => void;
}

export default function OverallWeekPanel({ weekNumber, tasks, onTargetChange }: OverallWeekPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Overall Week {weekNumber}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-pink-50 dark:bg-pink-900/20">
              <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 dark:text-pink-300 uppercase tracking-wider">
                W{weekNumber} Task
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 dark:text-pink-300 uppercase tracking-wider">
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
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {task.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {task.method}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={task.target}
                    onChange={(e) => onTargetChange?.(task.id, e.target.value)}
                    placeholder="Typing..."
                    className="w-full px-2 py-1 text-sm text-gray-900 dark:text-white bg-transparent border-0 border-b border-gray-200 dark:border-gray-600 focus:border-pink-500 focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
