/**
 * WS Module Configuration
 *
 * This file contains all configurable values for the WS (Task from HQ) module.
 * Modify values here to change dropdown options, validation rules, defaults,
 * and display flags WITHOUT touching the component code.
 *
 * Sections:
 * - TASK INFORMATION: Task Type, Execution Time options and defaults
 * - INSTRUCTIONS: Instruction Type options
 * - VALIDATION RULES: All validation rules with error messages
 * - TASK LEVEL: Level configuration
 * - DRAFT: Draft rules and limits
 * - HELPER FUNCTIONS: Utility functions for config values
 *
 * @module WS
 * @lastUpdated 2026-01-20
 */

import type { TaskFrequency, ExecutionTime, InstructionTaskType } from '@/types/addTask';

// =============================================================================
// SECTION A: TASK INFORMATION CONFIG
// =============================================================================

/**
 * Task Type (Frequency) Options
 *
 * Ordered from largest to smallest time span.
 * - value: Internal value used in database and logic
 * - label: Display text shown to users
 * - maxDays: Maximum allowed days for date range (used in validation)
 * - order: Lower number = larger time span (used for parent-child validation)
 */
export interface TaskTypeOption {
  value: TaskFrequency;
  label: string;
  maxDays: number;
  order: number;
}

export const TASK_TYPE_OPTIONS: TaskTypeOption[] = [
  { value: 'yearly', label: 'Yearly', maxDays: 365, order: 0 },
  { value: 'quarterly', label: 'Quarterly', maxDays: 90, order: 1 },
  { value: 'monthly', label: 'Monthly', maxDays: 31, order: 2 },
  { value: 'weekly', label: 'Weekly', maxDays: 7, order: 3 },
  { value: 'daily', label: 'Daily', maxDays: 1, order: 4 },
];

/**
 * Default Task Type by Level
 *
 * When creating a new task at a specific level, use this default.
 * Level 1 (root) = Yearly, Level 5 (deepest) = Daily
 */
export const DEFAULT_TASK_TYPE_BY_LEVEL: Record<number, TaskFrequency> = {
  1: 'yearly',
  2: 'quarterly',
  3: 'monthly',
  4: 'weekly',
  5: 'daily',
};

/**
 * Execution Time Options
 *
 * Ordered from smallest to largest duration.
 * - value: Internal value used in database and logic
 * - label: Display text shown to users
 * - minutes: Duration in minutes (used for validation and calculations)
 * - order: Lower number = shorter duration
 */
export interface ExecutionTimeOption {
  value: ExecutionTime;
  label: string;
  minutes: number;
  order: number;
}

export const EXECUTION_TIME_OPTIONS: ExecutionTimeOption[] = [
  { value: '30min', label: '30 min', minutes: 30, order: 0 },
  { value: '1hour', label: '1 hour', minutes: 60, order: 1 },
  { value: '2hours', label: '2 hours', minutes: 120, order: 2 },
  { value: '4hours', label: '4 hours', minutes: 240, order: 3 },
  { value: '8hours', label: '8 hours', minutes: 480, order: 4 },
];

/**
 * Default Execution Time by Level
 *
 * When creating a new task at a specific level, use this default.
 * Level 1 (root) = Maximum (8 hours), decreasing for child levels
 */
export const DEFAULT_EXECUTION_TIME_BY_LEVEL: Record<number, ExecutionTime> = {
  1: '8hours',
  2: '4hours',
  3: '2hours',
  4: '1hour',
  5: '30min',
};

// =============================================================================
// SECTION B: INSTRUCTIONS CONFIG
// =============================================================================

/**
 * Instruction Task Type Options
 *
 * Types of instructions/evidence required for task completion.
 * Options: Image (default), Document
 */
export interface InstructionTypeOption {
  value: InstructionTaskType;
  label: string;
  requiresUpload: boolean; // Whether this type requires file upload
  description?: string;
  isDefault?: boolean; // Whether this is the default option
}

export const INSTRUCTION_TYPE_OPTIONS: InstructionTypeOption[] = [
  {
    value: 'image',
    label: 'Image',
    requiresUpload: true,
    description: 'Photo evidence required for task completion',
    isDefault: true,
  },
  {
    value: 'document',
    label: 'Document',
    requiresUpload: true,
    description: 'Document attachment required',
  },
];

/**
 * Default Instruction Task Type
 */
export const DEFAULT_INSTRUCTION_TASK_TYPE: InstructionTaskType = 'image';

// =============================================================================
// VALIDATION RULES CONFIG
// =============================================================================

/**
 * Task Validation Rules
 *
 * Centralized validation rules for Task Information section.
 * Modify these values to change validation behavior.
 */
export const TASK_VALIDATION_RULES = {
  // Task Name
  taskName: {
    required: true,
    minLength: 1,
    maxLength: 255,
    errorMessages: {
      required: 'Task name is required',
      minLength: 'Task name must be at least 1 character',
      maxLength: 'Task name must not exceed 255 characters',
    },
  },

  // Task Type (Frequency)
  taskType: {
    required: true,
    // Child task type must have order >= parent's order (smaller or equal time span)
    childMustBeEqualOrSmallerThanParent: true,
    errorMessages: {
      required: 'Task Type is required',
      invalidForParent: 'Child task type must have equal or smaller time span than parent',
      invalidForDateRange: (maxDays: number, actualDays: number, taskTypeLabel: string) =>
        `${taskTypeLabel} task cannot exceed ${maxDays} day${maxDays > 1 ? 's' : ''}. Current range is ${actualDays} days. Please select a different Task Type or adjust the date range.`,
    },
  },

  // Applicable Period (Date Range)
  applicablePeriod: {
    required: true, // Required for task_list and todo_task flows, hidden for library
    startDateCannotBePast: true,
    endDateMustBeAfterOrEqualStart: true,
    childDateRangeMustBeWithinParent: true,
    // Date range duration must not exceed Task Type's maxDays
    dateRangeMustMatchTaskType: true,
    errorMessages: {
      startDateRequired: 'Start date is required',
      endDateRequired: 'End date is required',
      startDateCannotBePast: 'Start date cannot be in the past',
      endDateMustBeAfterOrEqualStart: 'End date must be after or equal to start date',
      childStartDateBeforeParent: (parentStartDate: string) =>
        `Start date must be on or after parent task start date (${parentStartDate})`,
      childEndDateAfterParent: (parentEndDate: string) =>
        `End date must be on or before parent task end date (${parentEndDate})`,
    },
  },

  // RE Time (Execution Time)
  executionTime: {
    required: true,
    // Sum of immediate children's RE time cannot exceed parent's
    childrenSumCannotExceedParent: true,
    // Auto-calculate based on level and parent constraints (read-only in UI)
    autoCalculate: true,
    errorMessages: {
      required: 'RE Time is required',
      childrenExceedParent: (childrenTotal: number, parentTotal: number) =>
        `Total RE Time of child tasks (${childrenTotal} min) exceeds parent's RE Time (${parentTotal} min)`,
      noRemainingTime: (parentMinutes: number) =>
        `Cannot add sub-task: Parent's RE Time (${parentMinutes} min) is fully allocated to existing child tasks.`,
    },
  },

  // =========================================================================
  // SECTION B: INSTRUCTIONS VALIDATION
  // =========================================================================

  // Instruction Task Type
  instructionTaskType: {
    required: true,
    errorMessages: {
      required: 'Instruction type is required',
    },
  },

  // Manual Link
  manualLink: {
    required: true,
    validateUrl: true,
    errorMessages: {
      required: 'Manual link is required',
      invalidUrl: 'Please enter a valid URL (e.g., https://example.com)',
    },
  },

  // Photo Guidelines
  photoGuidelines: {
    requiredForImageType: true,
    minPhotos: 1,
    maxPhotos: 20,
    initialSlots: 1, // Number of slots shown initially
    errorMessages: {
      required: 'At least one photo guideline is required for image tasks',
      maxExceeded: 'Maximum 20 photo guidelines allowed',
    },
  },

  // Note
  note: {
    requiredForDocumentType: true,
    maxLength: 2000,
    errorMessages: {
      required: 'Note is required for document tasks',
      maxExceeded: 'Note must not exceed 2000 characters',
    },
  },
};

// =============================================================================
// TASK LEVEL CONFIG
// =============================================================================

/**
 * Task Level Configuration
 */
export const TASK_LEVEL_CONFIG = {
  // Maximum depth of task hierarchy
  maxLevel: 5,

  // Level labels for display
  levelLabels: {
    1: 'Level 1 (Root)',
    2: 'Level 2',
    3: 'Level 3',
    4: 'Level 4',
    5: 'Level 5 (Deepest)',
  },
};

// =============================================================================
// DRAFT CONFIG
// =============================================================================

/**
 * Draft Configuration
 */
export const DRAFT_CONFIG = {
  // Maximum drafts per user per flow
  maxDraftsPerUser: 5,

  // Auto-delete draft after N days of inactivity
  autoDeleteAfterDays: 30,

  // Warning days before auto-delete
  warningDaysBeforeDelete: 5,

  // Maximum rejection attempts before task is locked
  maxRejectionAttempts: 3,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get Task Type option by value
 */
export function getTaskTypeOption(value: TaskFrequency): TaskTypeOption | undefined {
  return TASK_TYPE_OPTIONS.find(opt => opt.value === value);
}

/**
 * Get Task Type label by value
 */
export function getTaskTypeLabel(value: TaskFrequency): string {
  return getTaskTypeOption(value)?.label || value;
}

/**
 * Get Task Type max days by value
 */
export function getTaskTypeMaxDays(value: TaskFrequency): number {
  return getTaskTypeOption(value)?.maxDays || 0;
}

/**
 * Get Execution Time option by value
 */
export function getExecutionTimeOption(value: ExecutionTime): ExecutionTimeOption | undefined {
  return EXECUTION_TIME_OPTIONS.find(opt => opt.value === value);
}

/**
 * Get Execution Time label by value
 */
export function getExecutionTimeLabel(value: ExecutionTime): string {
  return getExecutionTimeOption(value)?.label || value;
}

/**
 * Get Execution Time in minutes by value
 */
export function getExecutionTimeMinutes(value: string): number {
  const option = EXECUTION_TIME_OPTIONS.find(opt => opt.value === value);
  return option?.minutes || 0;
}

/**
 * Get available Task Type options for a child based on parent's task type
 * Child can only select task types with equal or smaller time span (higher order)
 */
export function getAvailableTaskTypeOptions(parentTaskType: TaskFrequency | null): TaskTypeOption[] {
  if (!parentTaskType) {
    return TASK_TYPE_OPTIONS;
  }

  const parentOption = getTaskTypeOption(parentTaskType);
  if (!parentOption) {
    return TASK_TYPE_OPTIONS;
  }

  return TASK_TYPE_OPTIONS.filter(opt => opt.order >= parentOption.order);
}

/**
 * Get available Task Type options as DropdownOption[] for a child based on parent's task type
 * Wrapper for UI components that need DropdownOption format
 */
export function getTaskTypeOptionsForLevel(parentTaskType: TaskFrequency | string | null): DropdownOption[] {
  const options = getAvailableTaskTypeOptions(parentTaskType as TaskFrequency | null);
  return options.map(opt => ({ value: opt.value, label: opt.label }));
}

/**
 * Get available Execution Time options based on parent's remaining time
 */
export function getAvailableExecutionTimeOptions(
  parentExecutionTime: ExecutionTime | null,
  siblingsExecutionTimes: (ExecutionTime | string)[] = []
): ExecutionTimeOption[] {
  if (!parentExecutionTime) {
    return EXECUTION_TIME_OPTIONS;
  }

  const parentMinutes = getExecutionTimeMinutes(parentExecutionTime);
  const siblingsTotal = siblingsExecutionTimes.reduce(
    (sum, time) => sum + getExecutionTimeMinutes(time),
    0
  );
  const remainingMinutes = parentMinutes - siblingsTotal;

  return EXECUTION_TIME_OPTIONS.filter(opt => opt.minutes <= remainingMinutes);
}

/**
 * Get closest valid Execution Time that doesn't exceed given minutes
 */
export function getExecutionTimeFromMinutes(minutes: number): ExecutionTime {
  // Find the largest execution time that doesn't exceed the given minutes
  for (let i = EXECUTION_TIME_OPTIONS.length - 1; i >= 0; i--) {
    const option = EXECUTION_TIME_OPTIONS[i];
    if (option.minutes <= minutes) {
      return option.value;
    }
  }
  return EXECUTION_TIME_OPTIONS[0].value;
}

/**
 * Calculate default Execution Time for a new child task
 */
export function getDefaultExecutionTimeForChild(
  parentExecutionTime: ExecutionTime,
  siblingsExecutionTimes: (ExecutionTime | string)[],
  childLevel: number
): ExecutionTime | '' {
  const parentMinutes = getExecutionTimeMinutes(parentExecutionTime);
  const siblingsTotal = siblingsExecutionTimes.reduce(
    (sum, time) => sum + getExecutionTimeMinutes(time),
    0
  );
  const remainingMinutes = parentMinutes - siblingsTotal;

  if (remainingMinutes <= 0) {
    return '';
  }

  const levelDefault = DEFAULT_EXECUTION_TIME_BY_LEVEL[childLevel] || '30min';
  const levelDefaultMinutes = getExecutionTimeMinutes(levelDefault);

  if (levelDefaultMinutes <= remainingMinutes) {
    return levelDefault;
  }

  return getExecutionTimeFromMinutes(remainingMinutes);
}

/**
 * Validate if date range is valid for a given task type
 */
export function isDateRangeValidForTaskType(
  taskType: TaskFrequency,
  startDate: string,
  endDate: string
): { valid: boolean; maxDays: number; actualDays: number } {
  const maxDays = getTaskTypeMaxDays(taskType);
  if (!maxDays || !startDate || !endDate) {
    return { valid: true, maxDays: maxDays || 0, actualDays: 0 };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - start.getTime();
  const actualDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return {
    valid: actualDays <= maxDays,
    maxDays,
    actualDays,
  };
}

/**
 * Get allowed task types based on date range duration
 */
export function getAllowedTaskTypesForDateRange(startDate: string, endDate: string): TaskTypeOption[] {
  if (!startDate || !endDate) {
    return TASK_TYPE_OPTIONS;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - start.getTime();
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return TASK_TYPE_OPTIONS.filter(opt => opt.maxDays >= days);
}

// =============================================================================
// DERIVED CONSTANTS (For convenience)
// =============================================================================

/**
 * Task Type order array (for indexOf operations)
 * Order: yearly → quarterly → monthly → weekly → daily
 */
export const TASK_TYPE_ORDER: TaskFrequency[] = TASK_TYPE_OPTIONS.map(opt => opt.value);

/**
 * Execution Time order array (for indexOf operations)
 * Order: 30min → 1hour → 2hours → 4hours → 8hours
 */
export const EXECUTION_TIME_ORDER: ExecutionTime[] = EXECUTION_TIME_OPTIONS.map(opt => opt.value);

// =============================================================================
// DROPDOWN OPTIONS FOR UI (Compatible with existing DropdownOption type)
// =============================================================================

import type { DropdownOption } from '@/types/addTask';

/**
 * Task Type options for dropdown (compatible format)
 */
export const taskTypeDropdownOptions: DropdownOption[] = TASK_TYPE_OPTIONS.map(opt => ({
  value: opt.value,
  label: opt.label,
}));

/**
 * Execution Time options for dropdown (compatible format)
 */
export const executionTimeDropdownOptions: DropdownOption[] = EXECUTION_TIME_OPTIONS.map(opt => ({
  value: opt.value,
  label: opt.label,
}));

/**
 * Instruction Type options for dropdown (compatible format)
 */
export const instructionTypeDropdownOptions: DropdownOption[] = INSTRUCTION_TYPE_OPTIONS.map(opt => ({
  value: opt.value,
  label: opt.label,
}));
