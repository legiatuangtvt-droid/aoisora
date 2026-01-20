import {
  AddTaskMasterData,
  TaskLevel,
  DropdownOption,
} from '@/types/addTask';

// Task frequency options
export const taskTypeOptions: DropdownOption[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

// Execution time options
export const executionTimeOptions: DropdownOption[] = [
  { value: '30min', label: '30 min' },
  { value: '1hour', label: '1 hour' },
  { value: '2hours', label: '2 hours' },
  { value: '4hours', label: '4 hours' },
  { value: '8hours', label: '8 hours' },
];

// Instruction task type options
export const instructionTaskTypeOptions: DropdownOption[] = [
  { value: 'image', label: 'Image' },
  { value: 'document', label: 'Document' },
  { value: 'checklist', label: 'Checklist' },
];

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

// Combined master data
export const mockMasterData: AddTaskMasterData = {
  taskTypes: taskTypeOptions,
  executionTimes: executionTimeOptions,
  instructionTaskTypes: instructionTaskTypeOptions,
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

// Generate unique ID with timestamp and random string
function generateUniqueId(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 11);
  return `task-level-${timestamp}-${randomStr}`;
}

// Create empty task level
export function createEmptyTaskLevel(level: number, parentId: string | null = null): TaskLevel {
  return {
    id: generateUniqueId(),
    level,
    name: '',
    parentId,
    taskInformation: {
      taskType: '',
      applicablePeriod: {
        startDate: '',
        endDate: '',
      },
      executionTime: '',
    },
    instructions: {
      taskType: '',
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

// Initial task levels (just level 1)
export const initialTaskLevels: TaskLevel[] = [
  createEmptyTaskLevel(1),
];
