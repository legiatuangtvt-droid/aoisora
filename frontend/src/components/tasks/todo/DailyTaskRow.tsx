'use client';

import { DailyTaskData, TodoTask } from '@/types/todoTask';
import TaskStatusBadge from './TaskStatusBadge';

interface DailyTaskRowProps {
  data: DailyTaskData;
  isToday?: boolean;
  onTaskClick?: (task: TodoTask) => void;
  onStatusChange?: (taskId: string) => void;
}

export default function DailyTaskRow({ data, isToday, onTaskClick, onStatusChange }: DailyTaskRowProps) {
  // Get the primary status for the row (from first task or default)
  const primaryStatus = data.tasks.length > 0 ? data.tasks[0].status : 'draft';

  return (
    <tr className={`border-b border-gray-200 dark:border-gray-700 ${isToday ? 'bg-pink-50/50 dark:bg-pink-900/10' : ''}`}>
      {/* Date Column */}
      <td className="px-4 py-4 align-top border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {data.dayOfWeek}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.dayNumber}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {data.month}
            </span>
          </div>
        </div>
      </td>

      {/* Productivity Column */}
      <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
        {data.isWeekend ? (
          <span className="text-sm text-gray-400 dark:text-gray-500 italic">OFF</span>
        ) : (
          <div className="space-y-3">
            {/* Location Header with Dropdowns */}
            {data.location && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {data.location.code}
                </span>
                {/* Region Dropdown */}
                <div className="relative">
                  <select className="appearance-none pl-3 pr-7 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 cursor-pointer">
                    <option>{data.location.region || 'Region'}</option>
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {/* Zone Dropdown */}
                <div className="relative">
                  <select className="appearance-none pl-3 pr-7 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 cursor-pointer">
                    <option>{data.location.zone || 'Zone'}</option>
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {/* Area Dropdown */}
                <div className="relative">
                  <select className="appearance-none pl-3 pr-7 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 cursor-pointer">
                    <option>{data.location.area || 'Area'}</option>
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {/* Store Dropdown */}
                <div className="relative">
                  <select className="appearance-none pl-3 pr-7 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 cursor-pointer">
                    <option>{data.location.store || 'Store'}</option>
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}

            {/* Task List with numbered badges */}
            <div className="space-y-2">
              {data.tasks.map((task, index) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className="flex items-center gap-3 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400"
                >
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {task.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </td>

      {/* Status Column - Single status per row */}
      <td className="px-4 py-4 align-top">
        {!data.isWeekend && data.tasks.length > 0 && (
          <TaskStatusBadge
            status={primaryStatus}
            onClick={() => onStatusChange?.(data.tasks[0]?.id)}
          />
        )}
      </td>
    </tr>
  );
}
