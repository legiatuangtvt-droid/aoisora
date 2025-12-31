'use client';

import { TaskApproval, DropdownOption } from '@/types/addTask';

interface ApprovalSectionProps {
  data: TaskApproval;
  onChange: (data: TaskApproval) => void;
  initiatorOptions: DropdownOption[];
  leaderOptions: DropdownOption[];
  hodOptions: DropdownOption[];
  errors?: Record<string, string>;
}

export default function ApprovalSection({
  data,
  onChange,
  initiatorOptions,
  leaderOptions,
  hodOptions,
  errors = {},
}: ApprovalSectionProps) {
  const handleChange = (field: keyof TaskApproval, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      {/* Initiator */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Initiator <span className="text-red-500">*</span>
        </label>
        <select
          value={data.initiatorId}
          onChange={(e) => handleChange('initiatorId', e.target.value)}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            errors.initiatorId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select initiator</option>
          {initiatorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.initiatorId && (
          <p className="mt-1 text-xs text-red-500">{errors.initiatorId}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Task creator who initiates the task
        </p>
      </div>

      {/* Leader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Leader <span className="text-red-500">*</span>
        </label>
        <select
          value={data.leaderId}
          onChange={(e) => handleChange('leaderId', e.target.value)}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            errors.leaderId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select leader</option>
          {leaderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.leaderId && (
          <p className="mt-1 text-xs text-red-500">{errors.leaderId}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Level 1 approval leader
        </p>
      </div>

      {/* HOD */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          HOD <span className="text-red-500">*</span>
        </label>
        <select
          value={data.hodId}
          onChange={(e) => handleChange('hodId', e.target.value)}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            errors.hodId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select HOD</option>
          {hodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.hodId && (
          <p className="mt-1 text-xs text-red-500">{errors.hodId}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Head of Department - Level 2 approval
        </p>
      </div>
    </div>
  );
}
