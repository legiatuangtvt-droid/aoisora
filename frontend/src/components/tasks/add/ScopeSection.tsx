'use client';

import { TaskScope, DropdownOption } from '@/types/addTask';

interface ScopeSectionProps {
  data: TaskScope;
  onChange: (data: TaskScope) => void;
  regionOptions: DropdownOption[];
  zoneOptions: DropdownOption[];
  areaOptions: DropdownOption[];
  storeOptions: DropdownOption[];
  storeLeaderOptions: DropdownOption[];
  staffOptions: DropdownOption[];
  errors?: Record<string, string>;
}

export default function ScopeSection({
  data,
  onChange,
  regionOptions,
  zoneOptions,
  areaOptions,
  storeOptions,
  storeLeaderOptions,
  staffOptions,
  errors = {},
}: ScopeSectionProps) {
  const handleChange = (field: keyof TaskScope, value: string) => {
    const newData = { ...data, [field]: value };

    // Cascade logic: reset child dropdowns when parent changes
    if (field === 'regionId') {
      newData.zoneId = '';
      newData.areaId = '';
      newData.storeId = '';
    } else if (field === 'zoneId') {
      newData.areaId = '';
      newData.storeId = '';
    } else if (field === 'areaId') {
      newData.storeId = '';
    }

    onChange(newData);
  };

  return (
    <div className="space-y-4">
      {/* Region */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Region <span className="text-red-500">*</span>
        </label>
        <select
          value={data.regionId}
          onChange={(e) => handleChange('regionId', e.target.value)}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            errors.regionId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select region</option>
          {regionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.regionId && (
          <p className="mt-1 text-xs text-red-500">{errors.regionId}</p>
        )}
      </div>

      {/* Zone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Zone <span className="text-red-500">*</span>
        </label>
        <select
          value={data.zoneId}
          onChange={(e) => handleChange('zoneId', e.target.value)}
          disabled={!data.regionId}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.zoneId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select zone</option>
          {zoneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.zoneId && (
          <p className="mt-1 text-xs text-red-500">{errors.zoneId}</p>
        )}
      </div>

      {/* Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Area <span className="text-red-500">*</span>
        </label>
        <select
          value={data.areaId}
          onChange={(e) => handleChange('areaId', e.target.value)}
          disabled={!data.zoneId}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.areaId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select area</option>
          {areaOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.areaId && (
          <p className="mt-1 text-xs text-red-500">{errors.areaId}</p>
        )}
      </div>

      {/* Store */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Store <span className="text-red-500">*</span>
        </label>
        <select
          value={data.storeId}
          onChange={(e) => handleChange('storeId', e.target.value)}
          disabled={!data.areaId}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.storeId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select store</option>
          {storeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.storeId && (
          <p className="mt-1 text-xs text-red-500">{errors.storeId}</p>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Store Leader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Store Leader
        </label>
        <select
          value={data.storeLeaderId}
          onChange={(e) => handleChange('storeLeaderId', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Select store leader (optional)</option>
          {storeLeaderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Specific Staff */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Specific Staff
        </label>
        <select
          value={data.specificStaffId}
          onChange={(e) => handleChange('specificStaffId', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Select specific staff (optional)</option>
          {staffOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
