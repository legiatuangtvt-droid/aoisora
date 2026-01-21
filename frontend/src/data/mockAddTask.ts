/**
 * Mock Data for Add Task Form
 *
 * This file contains ONLY mock/sample data for development and testing.
 * All configurable values (options, validation rules) are in @/config/wsConfig.ts
 *
 * @module WS
 */

import {
  AddTaskMasterData,
  TaskLevel,
  DropdownOption,
} from '@/types/addTask';

import {
  DEFAULT_TASK_TYPE_BY_LEVEL,
  DEFAULT_EXECUTION_TIME_BY_LEVEL,
  DEFAULT_INSTRUCTION_TASK_TYPE,
  taskTypeDropdownOptions,
  executionTimeDropdownOptions,
  instructionTypeDropdownOptions,
} from '@/config/wsConfig';

// =============================================================================
// MOCK DATA - Geographic Hierarchy (Region > Zone > Area > Store)
// =============================================================================

// Region options
export const regionOptions: DropdownOption[] = [
  { value: 'north', label: 'The North' },
  { value: 'south', label: 'The South' },
  { value: 'central', label: 'Central' },
];

// Zone options by region
export const zoneOptionsByRegion: Record<string, DropdownOption[]> = {
  north: [
    { value: 'north-1', label: 'North Zone 1' },
    { value: 'north-2', label: 'North Zone 2' },
  ],
  south: [
    { value: 'south-1', label: 'South Zone 1' },
    { value: 'south-2', label: 'South Zone 2' },
  ],
  central: [
    { value: 'central-1', label: 'Central Zone 1' },
  ],
};

// Area options by zone
export const areaOptionsByZone: Record<string, DropdownOption[]> = {
  'north-1': [
    { value: 'ocean', label: 'Ocean area' },
    { value: 'mountain', label: 'Mountain area' },
  ],
  'north-2': [
    { value: 'city-north', label: 'City area North' },
  ],
  'south-1': [
    { value: 'coastal', label: 'Coastal area' },
  ],
  'south-2': [
    { value: 'city-south', label: 'City area South' },
  ],
  'central-1': [
    { value: 'highland', label: 'Highland area' },
  ],
};

// Store options by area
export const storeOptionsByArea: Record<string, DropdownOption[]> = {
  ocean: [
    { value: '3016', label: 'Store: 3016 - OCEAN PARK' },
    { value: '3017', label: 'Store: 3017 - ECO PARK' },
  ],
  mountain: [
    { value: '3027', label: 'Store: 3027 - ZEN PARK' },
  ],
  'city-north': [
    { value: '4001', label: 'Store: 4001 - CITY CENTER' },
  ],
  coastal: [
    { value: '5001', label: 'Store: 5001 - BEACH SIDE' },
  ],
  'city-south': [
    { value: '6001', label: 'Store: 6001 - SOUTH PLAZA' },
  ],
  highland: [
    { value: '7001', label: 'Store: 7001 - HIGHLAND MALL' },
  ],
};

// =============================================================================
// MOCK DATA - Staff & Leadership
// =============================================================================

// Store leaders
export const storeLeaderOptions: DropdownOption[] = [
  { value: 'sl-1', label: 'Tùng (SM Ocean)' },
  { value: 'sl-2', label: 'Việt (SM Zen)' },
  { value: 'sl-3', label: 'Hoa (SM Mountain)' },
];

// Staff options
export const staffOptions: DropdownOption[] = [
  { value: 'staff-1', label: 'Nguyễn Văn A' },
  { value: 'staff-2', label: 'Trần Thị B' },
  { value: 'staff-3', label: 'Lê Văn C' },
];

// Initiator options
export const initiatorOptions: DropdownOption[] = [
  { value: 'init-1', label: 'Nguyen Dai Viet' },
  { value: 'init-2', label: 'Tran Minh Duc' },
];

// Leader options
export const leaderOptions: DropdownOption[] = [
  { value: 'leader-1', label: 'YachiNaga' },
  { value: 'leader-2', label: 'John Manager' },
];

// HOD options
export const hodOptions: DropdownOption[] = [
  { value: 'hod-1', label: 'PERI' },
  { value: 'hod-2', label: 'Director A' },
];

// =============================================================================
// COMBINED MOCK MASTER DATA
// =============================================================================

/**
 * Combined master data for Add Task form
 * Used by components to populate dropdowns
 */
export const mockMasterData: AddTaskMasterData = {
  taskTypes: taskTypeDropdownOptions,
  executionTimes: executionTimeDropdownOptions,
  instructionTaskTypes: instructionTypeDropdownOptions,
  regions: regionOptions,
  zones: zoneOptionsByRegion,
  areas: areaOptionsByZone,
  stores: storeOptionsByArea,
  storeLeaders: storeLeaderOptions,
  staff: staffOptions,
  initiators: initiatorOptions,
  leaders: leaderOptions,
  hods: hodOptions,
};

// =============================================================================
// TASK LEVEL FACTORY
// =============================================================================

/**
 * Generate unique ID with timestamp and random string
 */
function generateUniqueId(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 11);
  return `task-level-${timestamp}-${randomStr}`;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Create empty task level with default task type and execution time based on level
 *
 * @param level - Task level (1-5)
 * @param parentId - Parent task level ID (null for root)
 * @returns New TaskLevel object with defaults
 */
export function createEmptyTaskLevel(level: number, parentId: string | null = null): TaskLevel {
  const todayString = getTodayString();

  return {
    id: generateUniqueId(),
    level,
    name: '',
    parentId,
    taskInformation: {
      taskType: DEFAULT_TASK_TYPE_BY_LEVEL[level] || 'daily',
      applicablePeriod: {
        startDate: todayString, // Default to today instead of empty
        endDate: '',
      },
      executionTime: DEFAULT_EXECUTION_TIME_BY_LEVEL[level] || '30min',
    },
    instructions: {
      taskType: DEFAULT_INSTRUCTION_TASK_TYPE,
      manualLink: '',
      note: '',
      photoGuidelines: [],
    },
    scope: {
      regionId: '',
      zoneId: '',
      areaId: '',
      storeId: '',
      storeLeaderId: '',
      specificStaffId: '',
    },
    approval: {
      initiatorId: '',
      leaderId: '',
      hodId: '',
    },
    isExpanded: true,
    expandedSection: null,
  };
}

/**
 * Initial task levels (just level 1)
 */
export const initialTaskLevels: TaskLevel[] = [
  createEmptyTaskLevel(1),
];
