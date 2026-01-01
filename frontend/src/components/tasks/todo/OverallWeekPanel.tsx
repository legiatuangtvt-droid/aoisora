'use client';

import Image from 'next/image';
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
        className="w-full flex items-center justify-between px-4 py-4"
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-700 flex items-center justify-center">
            <Image
              src="/icons/icon-park-outline_overall-reduction.png"
              alt="Overall"
              width={20}
              height={20}
            />
          </div>
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Week {weekNumber}
          </h3>
        </div>
        {/* Expand/Collapse Arrow */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}
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
      )}
    </div>
  );
}
