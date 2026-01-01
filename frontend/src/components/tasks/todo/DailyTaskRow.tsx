'use client';

import { DailyTaskData, TodoTask } from '@/types/todoTask';
import TaskStatusBadge from './TaskStatusBadge';
import TaskTypeBadge from './TaskTypeBadge';

interface DailyTaskRowProps {
  data: DailyTaskData;
  isToday?: boolean;
  onTaskClick?: (task: TodoTask) => void;
  onStatusChange?: (taskId: string) => void;
}

export default function DailyTaskRow({ data, isToday, onTaskClick, onStatusChange }: DailyTaskRowProps) {
  return (
    <tr className={`border-b border-gray-200 dark:border-gray-700 ${isToday ? 'bg-pink-50/50 dark:bg-pink-900/10' : ''}`}>
      {/* Date Column */}
      <td className="px-4 py-3 align-top">
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {data.dayOfWeek}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {data.dayNumber}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {data.month}
            </span>
          </div>
        </div>
      </td>

      {/* Productivity Column */}
      <td className="px-4 py-3">
        {data.isWeekend ? (
          <span className="text-sm text-gray-400 dark:text-gray-500 italic">OFF</span>
        ) : (
          <div className="space-y-2">
            {/* Location Header with Dropdowns */}
            {data.location && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2">
                <span>{data.location.code}:</span>
                <select className="appearance-none px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border-0 rounded cursor-pointer">
                  <option>{data.location.region}</option>
                </select>
                <span className="text-gray-400">→</span>
                <select className="appearance-none px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border-0 rounded cursor-pointer">
                  <option>{data.location.zone}</option>
                </select>
              </div>
            )}

            {/* Task List */}
            <ol className="space-y-1">
              {data.tasks.map((task, index) => (
                <li
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400"
                >
                  {index + 1}. {task.name}
                </li>
              ))}
            </ol>
          </div>
        )}
      </td>

      {/* Type Column */}
      <td className="px-4 py-3 align-top">
        {!data.isWeekend && data.tasks.length > 0 && (
          <div className="space-y-2">
            {data.tasks.map((task) => (
              <div key={task.id} className="py-0.5">
                <TaskTypeBadge type={task.type} />
              </div>
            ))}
          </div>
        )}
      </td>

      {/* Status Column */}
      <td className="px-4 py-3 align-top">
        {!data.isWeekend && data.tasks.length > 0 && (
          <div className="space-y-2">
            {data.tasks.map((task) => (
              <div key={task.id} className="py-0.5">
                <TaskStatusBadge
                  status={task.status}
                  onClick={() => onStatusChange?.(task.id)}
                />
              </div>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}
