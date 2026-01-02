'use client';

import { TaskDetail } from '@/types/tasks';

interface TaskDetailHeaderProps {
  task: TaskDetail;
}

export default function TaskDetailHeader({ task }: TaskDetailHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        {/* Left side - Task info */}
        <div className="flex-1">
          {/* Task Level Badge */}
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
              Task level {task.level}
            </span>
          </div>

          {/* Task Name */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {task.name}
          </h1>

          {/* Date Range & HQ Check */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {task.startDate}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              HQ Check: {task.hqCheckCode}
            </span>
          </div>

          {/* Task Type & Manual Link */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Task type: {task.taskType}
            </span>
            {task.manualLink && (
              <a
                href={task.manualLink}
                className="flex items-center gap-1 text-[#C5055B] hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Manual link
              </a>
            )}
          </div>
        </div>

        {/* Right side - Statistics Cards */}
        <div className="flex items-center gap-4">
          {/* Total Staff (only show if > 0) */}
          {task.stats.totalStaff > 0 && (
            <StatCard
              icon={
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-lg">
                  T
                </div>
              }
              value={task.stats.totalStaff}
              label="Total Staff"
            />
          )}

          {/* Not Started */}
          <StatCard
            icon={
              <div className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" strokeWidth={2} />
                </svg>
              </div>
            }
            value={task.stats.notStarted}
            label="Not Started"
          />

          {/* Completed */}
          <StatCard
            icon={
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            }
            value={task.stats.completed}
            label="Completed"
          />

          {/* Unable to Complete */}
          <StatCard
            icon={
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            }
            value={task.stats.unableToComplete}
            label="Unable to Complete"
          />

          {/* Average Completion Time */}
          <StatCard
            icon={
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
            value={task.stats.avgCompletionTime > 0 ? `${task.stats.avgCompletionTime}` : '-'}
            label="Average Completion Time"
            suffix={task.stats.avgCompletionTime > 0 ? 'min' : ''}
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  suffix?: string;
}

function StatCard({ icon, value, label, suffix }: StatCardProps) {
  return (
    <div className="flex flex-col items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg min-w-[100px]">
      {icon}
      <div className="mt-2 text-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            {suffix}
          </span>
        )}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {label}
      </span>
    </div>
  );
}
