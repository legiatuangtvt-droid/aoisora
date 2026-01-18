'use client';

import { TaskApproval, DropdownOption } from '@/types/addTask';

interface ApproverInfo {
  id: number;
  name: string;
  position?: string;
  job_grade?: string;
}

interface ApprovalSectionProps {
  data: TaskApproval;
  onChange: (data: TaskApproval) => void;
  initiatorOptions: DropdownOption[];
  leaderOptions: DropdownOption[];
  hodOptions: DropdownOption[];
  errors?: Record<string, string>;
  // New props for auto-populated approver
  currentUser?: {
    id: number;
    name: string;
    position?: string;
  };
  autoApprover?: ApproverInfo;
  isReadOnly?: boolean;
}

export default function ApprovalSection({
  data,
  onChange,
  initiatorOptions,
  leaderOptions,
  hodOptions,
  errors = {},
  currentUser,
  autoApprover,
  isReadOnly = false,
}: ApprovalSectionProps) {
  const handleChange = (field: keyof TaskApproval, value: string) => {
    if (isReadOnly) return;
    onChange({
      ...data,
      [field]: value,
    });
  };

  // If we have auto-populated data (current user as initiator, auto-found approver)
  // Show read-only display instead of dropdowns
  if (currentUser || autoApprover) {
    return (
      <div className="space-y-4">
        {/* Approval Flow Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Approval Process</p>
              <p>When you submit this task, it will be sent to your direct supervisor for approval.</p>
            </div>
          </div>
        </div>

        {/* 1. Initiator (Current User) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            1. Initiator (You)
          </label>
          <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentUser?.name || 'Current User'}
              </p>
              {currentUser?.position && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.position}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2. Approver (Auto-found) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            2. Approver
          </label>
          {autoApprover ? (
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {autoApprover.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {autoApprover.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {autoApprover.position || autoApprover.job_grade || 'Direct Supervisor'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Approver will be automatically determined when you submit
              </p>
            </div>
          )}
        </div>

        {/* Note about approval */}
        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
          * The approver is automatically determined based on your organizational hierarchy.
        </div>
      </div>
    );
  }

  // Fallback to original dropdown UI (for backward compatibility or when no auto-populate data)
  return (
    <div className="space-y-4">
      {/* 1. Initiator */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          1. Initiator
        </label>
        <select
          value={data.initiatorId}
          onChange={(e) => handleChange('initiatorId', e.target.value)}
          disabled={isReadOnly}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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
      </div>

      {/* 2. Leader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          2. Leader
        </label>
        <select
          value={data.leaderId}
          onChange={(e) => handleChange('leaderId', e.target.value)}
          disabled={isReadOnly}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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
      </div>

      {/* 3. HOD */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          3. HOD
        </label>
        <select
          value={data.hodId}
          onChange={(e) => handleChange('hodId', e.target.value)}
          disabled={isReadOnly}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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
      </div>
    </div>
  );
}
