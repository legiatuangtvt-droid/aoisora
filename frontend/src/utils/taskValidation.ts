// Task validation utilities for Add Task form
import type { TaskLevel, TaskInformation, TaskInstructions, TaskScope } from '@/types/addTask';
import type { TaskSource } from '@/components/tasks/add/AddTaskForm';
import {
  getExecutionTimeMinutes,
  getTaskTypeMaxDays,
  getTaskTypeLabel,
  isDateRangeValidForTaskType as configIsDateRangeValidForTaskType,
  getAllowedTaskTypesForDateRange as configGetAllowedTaskTypesForDateRange,
  TASK_VALIDATION_RULES,
  TASK_TYPE_OPTIONS,
} from '@/config/wsConfig';

// Re-export for backward compatibility
// These are now derived from TASK_TYPE_OPTIONS in @/config/wsConfig.ts
export const TASK_TYPE_MAX_DAYS: Record<string, number> = TASK_TYPE_OPTIONS.reduce(
  (acc, opt) => ({ ...acc, [opt.value]: opt.maxDays }),
  {} as Record<string, number>
);

export const TASK_TYPE_LABELS: Record<string, string> = TASK_TYPE_OPTIONS.reduce(
  (acc, opt) => ({ ...acc, [opt.value]: opt.label }),
  {} as Record<string, string>
);

// Validation error structure
export interface ValidationError {
  field: string;
  message: string;
  section: 'name' | 'A' | 'B' | 'C' | 'D';
  taskLevelId: string;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Get allowed task types based on date range duration
 * Returns task types that can accommodate the given duration
 * @deprecated Use configGetAllowedTaskTypesForDateRange from @/config/wsConfig instead
 */
export function getAllowedTaskTypesForDateRange(startDate: string, endDate: string): string[] {
  const options = configGetAllowedTaskTypesForDateRange(startDate, endDate);
  return options.map(opt => opt.value);
}

/**
 * Validate if date range is valid for a given task type
 * @deprecated Use configIsDateRangeValidForTaskType from @/config/wsConfig instead
 */
export function isDateRangeValidForTaskType(
  taskType: string,
  startDate: string,
  endDate: string
): { valid: boolean; maxDays: number; actualDays: number } {
  return configIsDateRangeValidForTaskType(taskType as any, startDate, endDate);
}

/**
 * Validate task name (required for both Save Draft and Submit)
 */
function validateTaskName(taskLevel: TaskLevel): ValidationError[] {
  const errors: ValidationError[] = [];
  const rules = TASK_VALIDATION_RULES.taskName;

  if (rules.required && (!taskLevel.name || taskLevel.name.trim() === '')) {
    errors.push({
      field: 'name',
      message: rules.errorMessages.required,
      section: 'name',
      taskLevelId: taskLevel.id,
    });
  }

  if (taskLevel.name && taskLevel.name.length > rules.maxLength) {
    errors.push({
      field: 'name',
      message: rules.errorMessages.maxLength,
      section: 'name',
      taskLevelId: taskLevel.id,
    });
  }

  return errors;
}

/**
 * Validate Section A: Task Information
 * - Task Type: required (only for root/parent tasks - child tasks inherit from parent)
 * - Applicable Period: required for task_list and todo_task flows
 * - Execution Time: required
 * - Child task date range must be within parent date range
 */
function validateTaskInformation(
  taskLevel: TaskLevel,
  source: TaskSource,
  allTaskLevels: TaskLevel[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const info = taskLevel.taskInformation;

  const taskTypeRules = TASK_VALIDATION_RULES.taskType;
  const periodRules = TASK_VALIDATION_RULES.applicablePeriod;
  const execTimeRules = TASK_VALIDATION_RULES.executionTime;

  // Check if this is a child task (has parentId)
  const isChildTask = !!taskLevel.parentId;

  // Task Type is required only for root/parent tasks
  // Child tasks inherit Task Type from parent, so skip validation
  if (!isChildTask && taskTypeRules.required && !info.taskType) {
    errors.push({
      field: 'taskType',
      message: taskTypeRules.errorMessages.required,
      section: 'A',
      taskLevelId: taskLevel.id,
    });
  }

  // Applicable Period: required for task_list and todo_task, hidden for library
  if (source !== 'library') {
    if (periodRules.required && !info.applicablePeriod.startDate) {
      errors.push({
        field: 'applicablePeriod.startDate',
        message: periodRules.errorMessages.startDateRequired,
        section: 'A',
        taskLevelId: taskLevel.id,
      });
    }

    if (periodRules.required && !info.applicablePeriod.endDate) {
      errors.push({
        field: 'applicablePeriod.endDate',
        message: periodRules.errorMessages.endDateRequired,
        section: 'A',
        taskLevelId: taskLevel.id,
      });
    }

    // Validate start date >= today (cannot select past dates)
    if (periodRules.startDateCannotBePast && info.applicablePeriod.startDate) {
      const startDate = new Date(info.applicablePeriod.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      startDate.setHours(0, 0, 0, 0);
      if (startDate < today) {
        errors.push({
          field: 'applicablePeriod.startDate',
          message: periodRules.errorMessages.startDateCannotBePast,
          section: 'A',
          taskLevelId: taskLevel.id,
        });
      }
    }

    // Validate end date >= start date
    if (periodRules.endDateMustBeAfterOrEqualStart && info.applicablePeriod.startDate && info.applicablePeriod.endDate) {
      const startDate = new Date(info.applicablePeriod.startDate);
      const endDate = new Date(info.applicablePeriod.endDate);
      if (endDate < startDate) {
        errors.push({
          field: 'applicablePeriod.endDate',
          message: periodRules.errorMessages.endDateMustBeAfterOrEqualStart,
          section: 'A',
          taskLevelId: taskLevel.id,
        });
      }
    }

    // Validate child task date range must be within parent date range
    if (periodRules.childDateRangeMustBeWithinParent && taskLevel.parentId && info.applicablePeriod.startDate && info.applicablePeriod.endDate) {
      const parent = allTaskLevels.find((tl) => tl.id === taskLevel.parentId);
      if (parent && parent.taskInformation.applicablePeriod.startDate && parent.taskInformation.applicablePeriod.endDate) {
        const childStart = new Date(info.applicablePeriod.startDate);
        const childEnd = new Date(info.applicablePeriod.endDate);
        const parentStart = new Date(parent.taskInformation.applicablePeriod.startDate);
        const parentEnd = new Date(parent.taskInformation.applicablePeriod.endDate);

        // Reset times to compare dates only
        childStart.setHours(0, 0, 0, 0);
        childEnd.setHours(0, 0, 0, 0);
        parentStart.setHours(0, 0, 0, 0);
        parentEnd.setHours(0, 0, 0, 0);

        // Child start date must be >= parent start date
        if (childStart < parentStart) {
          errors.push({
            field: 'applicablePeriod.startDate',
            message: periodRules.errorMessages.childStartDateBeforeParent(parent.taskInformation.applicablePeriod.startDate),
            section: 'A',
            taskLevelId: taskLevel.id,
          });
        }

        // Child end date must be <= parent end date
        if (childEnd > parentEnd) {
          errors.push({
            field: 'applicablePeriod.endDate',
            message: periodRules.errorMessages.childEndDateAfterParent(parent.taskInformation.applicablePeriod.endDate),
            section: 'A',
            taskLevelId: taskLevel.id,
          });
        }
      }
    }
  }

  // Validate Task Type and Date Range correlation
  // Date range duration must not exceed maximum allowed for the selected task type
  // Skip for child tasks since Task Type is inherited from parent
  if (!isChildTask && periodRules.dateRangeMustMatchTaskType && source !== 'library' && info.taskType && info.applicablePeriod.startDate && info.applicablePeriod.endDate) {
    const validation = isDateRangeValidForTaskType(
      info.taskType,
      info.applicablePeriod.startDate,
      info.applicablePeriod.endDate
    );

    if (!validation.valid) {
      const taskTypeLabel = getTaskTypeLabel(info.taskType as any);
      errors.push({
        field: 'taskType',
        message: taskTypeRules.errorMessages.invalidForDateRange(validation.maxDays, validation.actualDays, taskTypeLabel),
        section: 'A',
        taskLevelId: taskLevel.id,
      });
    }
  }

  // Execution Time is always required
  if (execTimeRules.required && !info.executionTime) {
    errors.push({
      field: 'executionTime',
      message: execTimeRules.errorMessages.required,
      section: 'A',
      taskLevelId: taskLevel.id,
    });
  }

  // Validate Execution Time: Sum of immediate children's execution time cannot exceed parent's
  if (execTimeRules.childrenSumCannotExceedParent && info.executionTime) {
    // Find all immediate children of this task
    const immediateChildren = allTaskLevels.filter(tl => tl.parentId === taskLevel.id);

    if (immediateChildren.length > 0) {
      const parentMinutes = getExecutionTimeMinutes(info.executionTime);
      const childrenTotalMinutes = immediateChildren.reduce((sum, child) => {
        return sum + getExecutionTimeMinutes(child.taskInformation.executionTime);
      }, 0);

      if (childrenTotalMinutes > parentMinutes) {
        errors.push({
          field: 'executionTime',
          message: execTimeRules.errorMessages.childrenExceedParent(childrenTotalMinutes, parentMinutes),
          section: 'A',
          taskLevelId: taskLevel.id,
        });
      }
    }
  }

  return errors;
}

/**
 * Validate URL format
 * Returns true if the string is a valid URL
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    // Only allow http and https protocols
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate Section B: Instructions
 * - Task Type: required
 * - Manual Link: required + URL validation
 * - Note: required if task type is 'document'
 * - Photo Guidelines: shown only when task type is 'image', at least 1 required, max 4 allowed
 */
function validateInstructions(taskLevel: TaskLevel): ValidationError[] {
  const errors: ValidationError[] = [];
  const instructions = taskLevel.instructions;

  const taskTypeRules = TASK_VALIDATION_RULES.instructionTaskType;
  const manualLinkRules = TASK_VALIDATION_RULES.manualLink;
  const photoRules = TASK_VALIDATION_RULES.photoGuidelines;
  const noteRules = TASK_VALIDATION_RULES.note;

  // Task Type is required
  if (taskTypeRules.required && !instructions.taskType) {
    errors.push({
      field: 'instructions.taskType',
      message: taskTypeRules.errorMessages.required,
      section: 'B',
      taskLevelId: taskLevel.id,
    });
  }

  // Manual Link validation
  if (manualLinkRules.required && (!instructions.manualLink || instructions.manualLink.trim() === '')) {
    errors.push({
      field: 'manualLink',
      message: manualLinkRules.errorMessages.required,
      section: 'B',
      taskLevelId: taskLevel.id,
    });
  } else if (manualLinkRules.validateUrl && instructions.manualLink && instructions.manualLink.trim() !== '') {
    // Validate URL format only if there's a value
    if (!isValidUrl(instructions.manualLink.trim())) {
      errors.push({
        field: 'manualLink',
        message: manualLinkRules.errorMessages.invalidUrl,
        section: 'B',
        taskLevelId: taskLevel.id,
      });
    }
  }

  // Conditional validation based on task type
  if (instructions.taskType === 'document') {
    // Note is required for document type
    if (noteRules.requiredForDocumentType && (!instructions.note || instructions.note.trim() === '')) {
      errors.push({
        field: 'note',
        message: noteRules.errorMessages.required,
        section: 'B',
        taskLevelId: taskLevel.id,
      });
    }

    // Note max length check
    if (instructions.note && instructions.note.length > noteRules.maxLength) {
      errors.push({
        field: 'note',
        message: noteRules.errorMessages.maxExceeded,
        section: 'B',
        taskLevelId: taskLevel.id,
      });
    }
  }

  // Photo Guidelines validation: only validate when task type is 'image' (because Photo Guidelines is hidden for document type)
  if (instructions.taskType === 'image') {
    // Photo Guidelines: at least 1 required for image type
    if (photoRules.requiredForImageType && (!instructions.photoGuidelines || instructions.photoGuidelines.length === 0)) {
      errors.push({
        field: 'photoGuidelines',
        message: photoRules.errorMessages.required,
        section: 'B',
        taskLevelId: taskLevel.id,
      });
    }

    // Max photos check
    if (instructions.photoGuidelines && instructions.photoGuidelines.length > photoRules.maxPhotos) {
      errors.push({
        field: 'photoGuidelines',
        message: photoRules.errorMessages.maxExceeded,
        section: 'B',
        taskLevelId: taskLevel.id,
      });
    }
  }

  return errors;
}

/**
 * Validate Section C: Scope
 * - Required for task_list (Store structure) and todo_task (HQ structure)
 * - Hidden for library (will be selected when dispatching)
 */
function validateScope(
  taskLevel: TaskLevel,
  source: TaskSource
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Skip validation for library flow (scope is hidden)
  if (source === 'library') {
    return errors;
  }

  const scope = taskLevel.scope;

  if (source === 'task_list') {
    // Store structure validation: Region > Zone > Area > Store
    if (!scope.regionId) {
      errors.push({
        field: 'scope.regionId',
        message: 'Region is required',
        section: 'C',
        taskLevelId: taskLevel.id,
      });
    }

    // Zone is optional but if region is selected, zone options are available
    // For now, we only require Region to be selected
    // Store selection is the most important
    if (!scope.storeId && !scope.areaId && !scope.zoneId) {
      // At minimum, need to select something beyond Region
      // But this depends on business logic - for now just require region
    }
  } else if (source === 'todo_task') {
    // HQ structure validation: Division > Dept > Team > User
    // The scope fields map differently for HQ:
    // regionId -> divisionId
    // zoneId -> deptId
    // areaId -> teamId
    // storeId -> userId
    if (!scope.regionId) {
      errors.push({
        field: 'scope.regionId',
        message: 'Division is required',
        section: 'C',
        taskLevelId: taskLevel.id,
      });
    }
  }

  return errors;
}

/**
 * Validate for Save as Draft
 * Only validates task name
 */
export function validateForDraft(taskLevels: TaskLevel[]): ValidationResult {
  const errors: ValidationError[] = [];

  for (const taskLevel of taskLevels) {
    errors.push(...validateTaskName(taskLevel));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate for Submit
 * Validates all required fields based on source/flow
 */
export function validateForSubmit(
  taskLevels: TaskLevel[],
  source: TaskSource
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const taskLevel of taskLevels) {
    // Task Name
    errors.push(...validateTaskName(taskLevel));

    // A. Task Information (pass all taskLevels for parent-child date validation)
    errors.push(...validateTaskInformation(taskLevel, source, taskLevels));

    // B. Instructions
    errors.push(...validateInstructions(taskLevel));

    // C. Scope (skipped for library)
    errors.push(...validateScope(taskLevel, source));

    // D. Approval Process - Auto-populated, no validation needed
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get errors for a specific task level
 */
export function getErrorsForTaskLevel(
  errors: ValidationError[],
  taskLevelId: string
): ValidationError[] {
  return errors.filter((e) => e.taskLevelId === taskLevelId);
}

/**
 * Get errors for a specific section of a task level
 */
export function getErrorsForSection(
  errors: ValidationError[],
  taskLevelId: string,
  section: ValidationError['section']
): ValidationError[] {
  return errors.filter(
    (e) => e.taskLevelId === taskLevelId && e.section === section
  );
}

/**
 * Check if a specific field has an error
 */
export function hasFieldError(
  errors: ValidationError[],
  taskLevelId: string,
  field: string
): boolean {
  return errors.some((e) => e.taskLevelId === taskLevelId && e.field === field);
}

/**
 * Get error message for a specific field
 */
export function getFieldError(
  errors: ValidationError[],
  taskLevelId: string,
  field: string
): string | undefined {
  const error = errors.find(
    (e) => e.taskLevelId === taskLevelId && e.field === field
  );
  return error?.message;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';

  const sectionNames: Record<ValidationError['section'], string> = {
    name: 'Task Name',
    A: 'Task Information',
    B: 'Instructions',
    C: 'Scope',
    D: 'Approval Process',
  };

  const grouped = errors.reduce((acc, error) => {
    const section = sectionNames[error.section];
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(error.message);
    return acc;
  }, {} as Record<string, string[]>);

  return Object.entries(grouped)
    .map(([section, messages]) => `${section}: ${messages.join(', ')}`)
    .join('\n');
}
