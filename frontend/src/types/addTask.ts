// Types for Add Task Screen

// Task frequency type
export type TaskFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// Execution time options
export type ExecutionTime = '30min' | '1hour' | '2hours' | '4hours' | '8hours';

// Task type for instructions (Section B)
// Options: image (default), document
export type InstructionTaskType = 'image' | 'document';

// Photo guideline item
export interface PhotoGuideline {
  id: string;
  url: string;
  file?: File;
  uploading?: boolean;
  progress?: number;
}

// Section A: Task Information
export interface TaskInformation {
  taskType: TaskFrequency | '';
  applicablePeriod: {
    startDate: string;
    endDate: string;
  };
  executionTime: ExecutionTime | '';
}

// Section B: Instructions
export interface TaskInstructions {
  taskType: InstructionTaskType | '';
  manualLink: string;
  note: string;
  photoGuidelines: PhotoGuideline[];
}

// Section C: Scope
export interface TaskScope {
  regionId: string;
  zoneId: string;
  areaId: string;
  storeId: string;
  storeLeaderId: string;
  specificStaffId: string;
}

// Section D: Approval Process
export interface TaskApproval {
  initiatorId: string;
  leaderId: string;
  hodId: string;
}

// Task Level data
export interface TaskLevel {
  id: string;
  level: number;
  name: string;
  parentId: string | null;
  taskInformation: TaskInformation;
  instructions: TaskInstructions;
  scope: TaskScope;
  approval: TaskApproval;
  isExpanded: boolean;
  expandedSection: 'A' | 'B' | 'C' | 'D' | null;
}

// Dropdown option
export interface DropdownOption {
  value: string;
  label: string;
}

// Master data for dropdowns
export interface AddTaskMasterData {
  taskTypes: DropdownOption[];
  executionTimes: DropdownOption[];
  instructionTaskTypes: DropdownOption[];
  regions: DropdownOption[];
  zones: Record<string, DropdownOption[]>; // keyed by regionId
  areas: Record<string, DropdownOption[]>; // keyed by zoneId
  stores: Record<string, DropdownOption[]>; // keyed by areaId
  storeLeaders: DropdownOption[];
  staff: DropdownOption[];
  initiators: DropdownOption[];
  leaders: DropdownOption[];
  hods: DropdownOption[];
}

// Form state
export interface AddTaskFormState {
  taskLevels: TaskLevel[];
  activeTaskLevelId: string | null;
  isDirty: boolean;
  isSubmitting: boolean;
  isSavingDraft: boolean;
}

// Section validation state
export interface SectionValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Task level validation
export interface TaskLevelValidation {
  taskInformation: SectionValidation;
  instructions: SectionValidation;
  scope: SectionValidation;
  approval: SectionValidation;
}
