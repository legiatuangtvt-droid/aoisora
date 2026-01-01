'use client';

import { LastWeekReviewTask } from '@/types/todoTask';

interface LastWeekReviewPanelProps {
  weekNumber: number;
  tasks: LastWeekReviewTask[];
}

export default function LastWeekReviewPanel({ weekNumber, tasks }: LastWeekReviewPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-pink-600 dark:text-pink-400">
          Last Week Review
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
                Progress/Bottleneck
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 dark:text-pink-300 uppercase tracking-wider">
                Output
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
                  {task.progress}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {task.output}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
