'use client';

import { useMemo } from 'react';
import { TaskInformation, DropdownOption } from '@/types/addTask';

interface TaskInfoSectionProps {
  data: TaskInformation;
  onChange: (data: TaskInformation) => void;
  taskTypeOptions: DropdownOption[];
  executionTimeOptions: DropdownOption[];
  errors?: Record<string, string>;
  disabled?: boolean;
}

// Helper to get today's date in YYYY-MM-DD format
function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export default function TaskInfoSection({
  data,
  onChange,
  taskTypeOptions,
  executionTimeOptions,
  errors = {},
  disabled = false,
}: TaskInfoSectionProps) {
  // Memoize today's date string to avoid recalculating on each render
  const todayString = useMemo(() => getTodayString(), []);

  // Ensure startDate has a value (fallback to today if empty)
  // Handle both null/undefined and empty string cases
  const startDateValue = data.applicablePeriod.startDate && data.applicablePeriod.startDate.trim() !== ''
    ? data.applicablePeriod.startDate
    : todayString;

  const handleChange = (field: keyof TaskInformation, value: string) => {
    if (disabled) return;
    if (field === 'applicablePeriod') return;
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleDateChange = (dateField: 'startDate' | 'endDate', value: string) => {
    if (disabled) return;
    onChange({
      ...data,
      applicablePeriod: {
        ...data.applicablePeriod,
        [dateField]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Task Type */}
      <div>
        <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          1. Task Type <span className="text-red-500">*</span>
        </label>
        <select
          id="taskType"
          value={data.taskType}
          onChange={(e) => handleChange('taskType', e.target.value)}
          disabled={disabled}
          data-field="taskType"
          aria-invalid={errors.taskType ? 'true' : 'false'}
          aria-describedby={errors.taskType ? 'taskType-error' : undefined}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.taskType
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          {/* No placeholder - Task Type always has default value based on level */}
          {/* Options are already filtered based on parent's task type */}
          {taskTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.taskType && (
          <p id="taskType-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.taskType}
          </p>
        )}
      </div>

      {/* 2. Applicable Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          2. Applicable Period <span className="text-red-500">*</span>
        </label>
        <div className="flex items-start gap-3">
          {/* Start Date */}
          <div className="flex-1">
            <label htmlFor="startDate" className="sr-only">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={startDateValue}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              min={todayString}
              disabled={disabled}
              data-field="startDate"
              aria-invalid={errors.startDate ? 'true' : 'false'}
              aria-describedby={errors.startDate ? 'startDate-error' : undefined}
              className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.startDate
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.startDate && (
              <p id="startDate-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.startDate}
              </p>
            )}
          </div>
          {/* End Date */}
          <div className="flex-1">
            <label htmlFor="endDate" className="sr-only">End Date</label>
            <input
              id="endDate"
              type="date"
              value={data.applicablePeriod.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              min={startDateValue}
              disabled={disabled}
              data-field="endDate"
              aria-invalid={errors.endDate ? 'true' : 'false'}
              aria-describedby={errors.endDate ? 'endDate-error' : undefined}
              className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.endDate
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.endDate && (
              <p id="endDate-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.endDate}
              </p>
            )}
          </div>
        </div>
        {/* General applicable period error (when not specific to start/end) */}
        {errors.applicablePeriod && !errors.startDate && !errors.endDate && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.applicablePeriod}
          </p>
        )}
      </div>

      {/* 3. Execution Time */}
      <div>
        <label htmlFor="executionTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          3. Execution Time <span className="text-red-500">*</span>
        </label>
        <select
          id="executionTime"
          value={data.executionTime}
          onChange={(e) => handleChange('executionTime', e.target.value)}
          disabled={disabled}
          data-field="executionTime"
          aria-invalid={errors.executionTime ? 'true' : 'false'}
          aria-describedby={errors.executionTime ? 'executionTime-error' : undefined}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.executionTime
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          {executionTimeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.executionTime && (
          <p id="executionTime-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.executionTime}
          </p>
        )}
      </div>
    </div>
  );
}
