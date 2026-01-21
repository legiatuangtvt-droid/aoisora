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
  // Total number of stores/users for calculating scope summary
  totalStores?: number;
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
  totalStores = 5,
}: ScopeSectionProps) {
  // Calculate scope summary based on current selection
  const getScopeSummary = (): string => {
    const entityName = scopeType === 'hq' ? 'Users' : 'Stores';
    const selectedCount = storeOptions.length || totalStores;

    // If specific store/user is selected
    if (data.storeId) {
      const selectedStore = storeOptions.find(opt => opt.value === data.storeId);
      const selectedArea = areaOptions.find(opt => opt.value === data.areaId);
      return `1/${totalStores} ${entityName} of Area ${selectedArea?.label || ''}`;
    }

    // If area/team is selected
    if (data.areaId) {
      const selectedArea = areaOptions.find(opt => opt.value === data.areaId);
      return `${selectedCount}/${totalStores} ${entityName} of Area ${selectedArea?.label || ''}`;
    }

    // If zone/department is selected
    if (data.zoneId) {
      const selectedZone = zoneOptions.find(opt => opt.value === data.zoneId);
      return `${selectedCount}/${totalStores} ${entityName} of Zone ${selectedZone?.label || ''}`;
    }

    // If region/division is selected
    if (data.regionId) {
      const selectedRegion = regionOptions.find(opt => opt.value === data.regionId);
      return `${selectedCount}/${totalStores} ${entityName} of Region ${selectedRegion?.label || ''}`;
    }

    // Default: All stores selected
    return `All ${entityName} (${totalStores}/${totalStores})`;
  };

  // Labels based on scope type
  const labels = scopeType === 'hq'
    ? {
        header: 'HQ Users',
        level1: 'Division',
        level2: 'Department',
        level3: 'Team',
        level4: 'User',
      }
    : {
        header: 'Store',
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
      newData.storeLeaderId = '';
      newData.specificStaffId = '';
    } else if (field === 'storeId') {
      newData.storeLeaderId = '';
      newData.specificStaffId = '';
    } else if (field === 'storeLeaderId') {
      newData.specificStaffId = '';
    }

    onChange(newData);
  };

  return (
    <div className="space-y-4">
      {/* Scope Summary */}
      <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          {getScopeSummary()}
        </span>
      </div>

      {/* Level 1 (Region or Division) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          {labels.level1}
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
          <option value="">All {labels.level1}</option>
          {regionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Level 2 (Zone or Department) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          {labels.level2}
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
          <option value="">All {labels.level2}</option>
          {zoneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Level 3 (Area or Team) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          {labels.level3}
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
          <option value="">All {labels.level3}</option>
          {areaOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Level 4 (Store or User) */}
      <div className="flex items-center gap-4">
        <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
          {labels.level4}
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
          <option value="">All {labels.level4}</option>
          {storeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Level 5 (Store Leader) - Only show for store scope type */}
      {scopeType === 'store' && (
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
            {labels.level5}
          </label>
          <select
            value={data.storeLeaderId}
            onChange={(e) => handleChange('storeLeaderId', e.target.value)}
            disabled={disabled || !data.storeId}
            className={`flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.storeLeaderId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">All {labels.level5}</option>
            {storeLeaderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Level 6 (Specific Staff) - Only show for store scope type */}
      {scopeType === 'store' && (
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 dark:text-gray-400">
            {labels.level6}
          </label>
          <select
            value={data.specificStaffId}
            onChange={(e) => handleChange('specificStaffId', e.target.value)}
            disabled={disabled || !data.storeLeaderId}
            className={`flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.specificStaffId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">All {labels.level6}</option>
            {staffOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
