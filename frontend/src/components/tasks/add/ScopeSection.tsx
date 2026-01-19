'use client';

import { TaskScope, DropdownOption } from '@/types/addTask';

// Scope type determines the hierarchy structure to display
// - 'store': Region > Zone > Area > Store (for Flow 1 - Task List)
// - 'hq': Division > Dept > Team > User (for Flow 3 - To Do Task)
type ScopeType = 'store' | 'hq';

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
  disabled?: boolean;
  // Scope type determines which hierarchy structure to show
  scopeType?: ScopeType;
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
  disabled = false,
  scopeType = 'store',
}: ScopeSectionProps) {
  // Labels based on scope type
  const labels = scopeType === 'hq'
    ? {
        header: '1. HQ Users',
        level1: 'Division',
        level2: 'Department',
        level3: 'Team',
        level4: 'User',
        level5: 'Team Leader',
        level6: 'Specific User',
      }
    : {
        header: '1. Store',
        level1: 'Region',
        level2: 'Zone',
        level3: 'Area',
        level4: 'Store',
        level5: 'Store Leader',
        level6: 'Specific Staff',
      };
  const handleChange = (field: keyof TaskScope, value: string) => {
    if (disabled) return;
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
      {/* 1. Header (Store or HQ Users) */}
      <div className="text-sm font-semibold text-gray-900 dark:text-white">
        {labels.header}
      </div>

      {/* 1.1 Level 1 (Region or Division) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.1<br />{labels.level1}
        </label>
        <select
          value={data.regionId}
          onChange={(e) => handleChange('regionId', e.target.value)}
          disabled={disabled}
          className={`flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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

      {/* 1.2 Level 2 (Zone or Department) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.2<br />{labels.level2}
        </label>
        <select
          value={data.zoneId}
          onChange={(e) => handleChange('zoneId', e.target.value)}
          disabled={disabled || !data.regionId}
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

      {/* 1.3 Level 3 (Area or Team) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.3<br />{labels.level3}
        </label>
        <select
          value={data.areaId}
          onChange={(e) => handleChange('areaId', e.target.value)}
          disabled={disabled || !data.zoneId}
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

      {/* 1.4 Level 4 (Store or User) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.4<br />{labels.level4}
        </label>
        <select
          value={data.storeId}
          onChange={(e) => handleChange('storeId', e.target.value)}
          disabled={disabled || !data.areaId}
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

      {/* 1.5 Level 5 (Store Leader or Team Leader) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.5<br />{labels.level5}
        </label>
        <select
          value={data.storeLeaderId}
          onChange={(e) => handleChange('storeLeaderId', e.target.value)}
          disabled={disabled}
          className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value=""></option>
          {storeLeaderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 1.6 Level 6 (Specific Staff or Specific User) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          1.6<br />{labels.level6}
        </label>
        <select
          value={data.specificStaffId}
          onChange={(e) => handleChange('specificStaffId', e.target.value)}
          disabled={disabled}
          className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
