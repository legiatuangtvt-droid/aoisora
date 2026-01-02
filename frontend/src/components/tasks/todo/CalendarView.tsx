'use client';

import Image from 'next/image';
import { DailyTaskData, WeekInfo, TodoTask } from '@/types/todoTask';
import DailyTaskRow from './DailyTaskRow';
import CalendarViewMobile from './CalendarViewMobile';

interface CalendarViewProps {
  weekInfo: WeekInfo;
  dailyTasks: DailyTaskData[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onTaskClick?: (task: TodoTask) => void;
  onStatusChange?: (taskId: string) => void;
}

export default function CalendarView({
  weekInfo,
  dailyTasks,
  onPrevWeek,
  onNextWeek,
  onTaskClick,
  onStatusChange,
}: CalendarViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  return (
    <>
      {/* Mobile: Vertical Timeline */}
      <div className="sm:hidden">
        <CalendarViewMobile
          weekNumber={weekInfo.weekNumber}
          year={weekInfo.year}
          dailyTasks={dailyTasks}
          onPreviousWeek={onPrevWeek}
          onNextWeek={onNextWeek}
          onTaskClick={(taskId) => {
            const task = dailyTasks.flatMap(d => d.tasks).find(t => t.id === taskId);
            if (task) onTaskClick?.(task);
          }}
        />
      </div>

      {/* Desktop: Table view */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* Calendar Icon */}
            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <Image
                src="/icons/mdi_invoice-text-scheduled-outline.png"
                alt="Calendar"
                width={20}
                height={20}
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Week {weekInfo.weekNumber}, {weekInfo.year}
            </h3>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevWeek}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={onNextWeek}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {dailyTasks.map((dayData) => (
                <DailyTaskRow
                  key={dayData.date.toISOString()}
                  data={dayData}
                  isToday={isToday(dayData.date)}
                  onTaskClick={onTaskClick}
                  onStatusChange={onStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
