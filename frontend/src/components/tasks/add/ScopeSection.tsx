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
      {/* 1. Store Header */}
      <div className="text-sm font-semibold text-gray-900 dark:text-white">
        1. Store
      </div>

      {/* 1.1 Region */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.1<br />Region
        </label>
        <select
          value={data.regionId}
          onChange={(e) => handleChange('regionId', e.target.value)}
          className={`flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            errors.regionId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value=""></option>
          {regionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 1.2 Zone */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.2<br />Zone
        </label>
        <select
          value={data.zoneId}
          onChange={(e) => handleChange('zoneId', e.target.value)}
          disabled={!data.regionId}
          className={`flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.zoneId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value=""></option>
          {zoneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 1.3 Area */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.3<br />Area
        </label>
        <select
          value={data.areaId}
          onChange={(e) => handleChange('areaId', e.target.value)}
          disabled={!data.zoneId}
          className={`flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.areaId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value=""></option>
          {areaOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 1.4 Store */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.4<br />Store
        </label>
        <select
          value={data.storeId}
          onChange={(e) => handleChange('storeId', e.target.value)}
          disabled={!data.areaId}
          className={`flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.storeId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value=""></option>
          {storeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 1.5 Store Leader */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.5<br />Store Leader
        </label>
        <select
          value={data.storeLeaderId}
          onChange={(e) => handleChange('storeLeaderId', e.target.value)}
          className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value=""></option>
          {storeLeaderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 1.6 Specific Staff */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.6<br />Specific Staff
        </label>
        <select
          value={data.specificStaffId}
          onChange={(e) => handleChange('specificStaffId', e.target.value)}
          className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value=""></option>
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
