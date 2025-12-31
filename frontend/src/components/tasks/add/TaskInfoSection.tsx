'use client';

import { TaskInformation, DropdownOption } from '@/types/addTask';

interface TaskInfoSectionProps {
  data: TaskInformation;
  onChange: (data: TaskInformation) => void;
  taskTypeOptions: DropdownOption[];
  executionTimeOptions: DropdownOption[];
  errors?: Record<string, string>;
}

export default function TaskInfoSection({
  data,
  onChange,
  taskTypeOptions,
  executionTimeOptions,
  errors = {},
}: TaskInfoSectionProps) {
  const handleChange = (field: keyof TaskInformation, value: string) => {
    if (field === 'applicablePeriod') return;
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleDateChange = (dateField: 'startDate' | 'endDate', value: string) => {
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
      {/* Task Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Task Type <span className="text-red-500">*</span>
        </label>
        <select
          value={data.taskType}
          onChange={(e) => handleChange('taskType', e.target.value)}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            errors.taskType
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select task type</option>
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

      {/* Applicable Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Applicable Period <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={data.applicablePeriod.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className={`flex-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
              errors.startDate
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          <span className="text-gray-500 dark:text-gray-400">-</span>
          <input
            type="date"
            value={data.applicablePeriod.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className={`flex-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
              errors.endDate
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
        </div>
        {(errors.startDate || errors.endDate || errors.applicablePeriod) && (
          <p className="mt-1 text-xs text-red-500">
            {errors.startDate || errors.endDate || errors.applicablePeriod}
          </p>
        )}
      </div>

      {/* Execution Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Execution Time <span className="text-red-500">*</span>
        </label>
        <select
          value={data.executionTime}
          onChange={(e) => handleChange('executionTime', e.target.value)}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            errors.executionTime
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select execution time</option>
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
