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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          1. Task Type
        </label>
        <select
          value={data.taskType}
          onChange={(e) => handleChange('taskType', e.target.value)}
          disabled={disabled}
          data-field="taskType"
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
          <p className="mt-1 text-xs text-red-500">{errors.taskType}</p>
        )}
      </div>

      {/* 2. Applicable Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          2. Applicable Period
        </label>
        <div className="flex items-start gap-3">
          {/* Start Date */}
          <div className="flex-1">
            <input
              type="date"
              value={startDateValue}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              min={todayString}
              disabled={disabled}
              data-field="startDate"
              className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.startDate
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
            )}
          </div>
          {/* End Date */}
          <div className="flex-1">
            <input
              type="date"
              value={data.applicablePeriod.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              min={startDateValue}
              disabled={disabled}
              data-field="endDate"
              className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.endDate
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>
        {/* General applicable period error (when not specific to start/end) */}
        {errors.applicablePeriod && !errors.startDate && !errors.endDate && (
          <p className="mt-1 text-xs text-red-500">{errors.applicablePeriod}</p>
        )}
      </div>

      {/* 3. Execution Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          3. Execution Time
        </label>
        <select
          value={data.executionTime}
          onChange={(e) => handleChange('executionTime', e.target.value)}
          disabled={disabled}
          data-field="executionTime"
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
          <p className="mt-1 text-xs text-red-500">{errors.executionTime}</p>
        )}
      </div>
    </div>
  );
}
