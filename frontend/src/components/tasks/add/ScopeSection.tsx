'use client';

import { useState, useEffect } from 'react';
import { TaskScope, DropdownOption } from '@/types/addTask';
import { getStoreStaff } from '@/lib/api';

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
  errors = {},
  disabled = false,
  scopeType = 'store',
  totalStores = 5,
}: ScopeSectionProps) {
  // State for store staff (fetched from API when store is selected)
  const [storeLeaderOptions, setStoreLeaderOptions] = useState<DropdownOption[]>([]);
  const [staffOptions, setStaffOptions] = useState<DropdownOption[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  // Fetch store staff when storeId changes
  useEffect(() => {
    if (data.storeId && scopeType === 'store') {
      setIsLoadingStaff(true);
      getStoreStaff(Number(data.storeId))
        .then((response) => {
          setStoreLeaderOptions(response.leaders);
          setStaffOptions(response.staff);
        })
        .catch((error) => {
          console.error('Failed to fetch store staff:', error);
          setStoreLeaderOptions([]);
          setStaffOptions([]);
        })
        .finally(() => {
          setIsLoadingStaff(false);
        });
    } else {
      // Clear options when no store is selected
      setStoreLeaderOptions([]);
      setStaffOptions([]);
    }
  }, [data.storeId, scopeType]);
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
        level6: 'Staff',
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
      <div className="flex items-start gap-4">
        <label htmlFor="regionId" className="w-20 text-sm text-gray-600 dark:text-gray-400 pt-2.5">
          {labels.level1}
        </label>
        <div className="flex-1">
          <select
            id="regionId"
            value={data.regionId}
            onChange={(e) => handleChange('regionId', e.target.value)}
            disabled={disabled}
            aria-invalid={errors.regionId ? 'true' : 'false'}
            aria-describedby={errors.regionId ? 'regionId-error' : undefined}
            className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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
          {errors.regionId && (
            <p id="regionId-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.regionId}
            </p>
          )}
        </div>
      </div>

      {/* Level 2 (Zone or Department) */}
      <div className="flex items-start gap-4">
        <label htmlFor="zoneId" className="w-20 text-sm text-gray-600 dark:text-gray-400 pt-2.5">
          {labels.level2}
        </label>
        <div className="flex-1">
          <select
            id="zoneId"
            value={data.zoneId}
            onChange={(e) => handleChange('zoneId', e.target.value)}
            disabled={disabled || !data.regionId}
            aria-invalid={errors.zoneId ? 'true' : 'false'}
            aria-describedby={errors.zoneId ? 'zoneId-error' : undefined}
            className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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
          {errors.zoneId && (
            <p id="zoneId-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.zoneId}
            </p>
          )}
        </div>
      </div>

      {/* Level 3 (Area or Team) */}
      <div className="flex items-start gap-4">
        <label htmlFor="areaId" className="w-20 text-sm text-gray-600 dark:text-gray-400 pt-2.5">
          {labels.level3}
        </label>
        <div className="flex-1">
          <select
            id="areaId"
            value={data.areaId}
            onChange={(e) => handleChange('areaId', e.target.value)}
            disabled={disabled || !data.zoneId}
            aria-invalid={errors.areaId ? 'true' : 'false'}
            aria-describedby={errors.areaId ? 'areaId-error' : undefined}
            className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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
          {errors.areaId && (
            <p id="areaId-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.areaId}
            </p>
          )}
        </div>
      </div>

      {/* Level 4 (Store or User) */}
      <div className="flex items-start gap-4">
        <label htmlFor="storeId" className="w-20 text-sm text-gray-600 dark:text-gray-400 pt-2.5">
          {labels.level4}
        </label>
        <div className="flex-1">
          <select
            id="storeId"
            value={data.storeId}
            onChange={(e) => handleChange('storeId', e.target.value)}
            disabled={disabled || !data.areaId}
            aria-invalid={errors.storeId ? 'true' : 'false'}
            aria-describedby={errors.storeId ? 'storeId-error' : undefined}
            className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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
          {errors.storeId && (
            <p id="storeId-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.storeId}
            </p>
          )}
        </div>
      </div>

      {/* Level 5 (Store Leader) - Only show for store scope type */}
      {scopeType === 'store' && (
        <div className="flex items-start gap-4">
          <label htmlFor="storeLeaderId" className="w-20 text-sm text-gray-600 dark:text-gray-400 pt-2.5">
            {labels.level5}
          </label>
          <div className="flex-1">
            <select
              id="storeLeaderId"
              value={data.storeLeaderId}
              onChange={(e) => handleChange('storeLeaderId', e.target.value)}
              disabled={disabled || !data.storeId || isLoadingStaff}
              aria-invalid={errors.storeLeaderId ? 'true' : 'false'}
              aria-describedby={errors.storeLeaderId ? 'storeLeaderId-error' : undefined}
              aria-busy={isLoadingStaff}
              className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.storeLeaderId
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">
                {isLoadingStaff ? 'Loading...' : `All ${labels.level5}`}
              </option>
              {storeLeaderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.storeLeaderId && (
              <p id="storeLeaderId-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.storeLeaderId}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Level 6 (Staff) - Only show for store scope type */}
      {scopeType === 'store' && (
        <div className="flex items-start gap-4">
          <label htmlFor="specificStaffId" className="w-20 text-sm text-gray-600 dark:text-gray-400 pt-2.5">
            {labels.level6}
          </label>
          <div className="flex-1">
            <select
              id="specificStaffId"
              value={data.specificStaffId}
              onChange={(e) => handleChange('specificStaffId', e.target.value)}
              disabled={disabled || !data.storeId || isLoadingStaff}
              aria-invalid={errors.specificStaffId ? 'true' : 'false'}
              aria-describedby={errors.specificStaffId ? 'specificStaffId-error' : undefined}
              aria-busy={isLoadingStaff}
              className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.specificStaffId
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">
                {isLoadingStaff ? 'Loading...' : `All ${labels.level6}`}
              </option>
              {staffOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.specificStaffId && (
              <p id="specificStaffId-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.specificStaffId}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
