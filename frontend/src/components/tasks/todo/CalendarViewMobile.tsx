'use client';

import { DailyTaskData, STATUS_CONFIG } from '@/types/todoTask';
import TaskStatusBadge from './TaskStatusBadge';

interface CalendarViewMobileProps {
  weekNumber: number;
  year: number;
  dailyTasks: DailyTaskData[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onTaskClick?: (taskId: string) => void;
  onDayClick?: (date: Date) => void;
}

export default function CalendarViewMobile({
  weekNumber,
  year,
  dailyTasks,
  onPreviousWeek,
  onNextWeek,
  onTaskClick,
  onDayClick,
}: CalendarViewMobileProps) {
  // Get today's date for highlighting
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  // Get status summary for a day
  const getStatusSummary = (tasks: DailyTaskData['tasks']) => {
    if (tasks.length === 0) return null;
    // Return the most important status (priority: in_process > not_yet > draft > done)
    const statusPriority = ['in_process', 'not_yet', 'draft', 'done'];
    for (const status of statusPriority) {
      if (tasks.some(t => t.status === status)) {
        return status as keyof typeof STATUS_CONFIG;
      }
    }
    return tasks[0].status;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with week navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={onPreviousWeek}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Previous week"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold text-gray-900 dark:text-white">
            Week {weekNumber}, {year}
          </span>
        </div>

        <button
          onClick={onNextWeek}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Next week"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Vertical Timeline */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {dailyTasks.map((day) => {
          const statusSummary = getStatusSummary(day.tasks);
          const isTodayRow = isToday(day.date);

          // Weekend row
          if (day.isWeekend) {
            return (
              <div
                key={day.date.toISOString()}
                className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="w-14 flex-shrink-0">
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                    {day.dayOfWeek}
                  </div>
                  <div className="text-lg font-bold text-gray-400 dark:text-gray-500">
                    {day.dayNumber}
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">OFF</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={day.date.toISOString()}
              onClick={() => onDayClick?.(day.date)}
              className={`flex px-4 py-3 cursor-pointer transition-colors ${
                isTodayRow
                  ? 'bg-pink-50 dark:bg-pink-900/20 border-l-4 border-l-pink-600'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              {/* Date column */}
              <div className="w-14 flex-shrink-0">
                <div className={`text-xs font-medium uppercase ${
                  isTodayRow ? 'text-pink-600' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {day.dayOfWeek}
                </div>
                <div className={`text-lg font-bold ${
                  isTodayRow ? 'text-pink-600' : 'text-gray-900 dark:text-white'
                }`}>
                  {day.dayNumber}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {day.month}
                </div>
              </div>

              {/* Content column */}
              <div className="flex-1 min-w-0 ml-3">
                {/* Location */}
                {day.location && (
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                    📍 {day.location.code}: {day.location.region} → {day.location.zone}
                  </div>
                )}

                {/* Task count or empty state */}
                {day.tasks.length > 0 ? (
                  <div className="space-y-1">
                    {/* Show first 2 tasks */}
                    {day.tasks.slice(0, 2).map((task, index) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick?.(task.id);
                        }}
                        className="text-sm text-gray-700 dark:text-gray-300 truncate"
                      >
                        <span className="text-gray-400 mr-1">{index + 1}.</span>
                        {task.name}
                      </div>
                    ))}
                    {/* Show more indicator */}
                    {day.tasks.length > 2 && (
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        +{day.tasks.length - 2} more tasks
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    No tasks
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="flex-shrink-0 ml-2 flex items-center">
                {statusSummary && (
                  <TaskStatusBadge status={statusSummary} compact />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
