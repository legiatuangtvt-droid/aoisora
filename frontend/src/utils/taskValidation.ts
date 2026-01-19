// Task validation utilities for Add Task form
import type { TaskLevel, TaskInformation, TaskInstructions, TaskScope } from '@/types/addTask';
import type { TaskSource } from '@/components/tasks/add/AddTaskForm';

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
 * Validate task name (required for both Save Draft and Submit)
 */
function validateTaskName(taskLevel: TaskLevel): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!taskLevel.name || taskLevel.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Task name is required',
      section: 'name',
      taskLevelId: taskLevel.id,
    });
  }

  return errors;
}

/**
 * Validate Section A: Task Information
 * - Task Type: required
 * - Applicable Period: required for task_list and todo_task flows
 * - Execution Time: required
 */
function validateTaskInformation(
  taskLevel: TaskLevel,
  source: TaskSource
): ValidationError[] {
  const errors: ValidationError[] = [];
  const info = taskLevel.taskInformation;

  // Task Type is always required
  if (!info.taskType) {
    errors.push({
      field: 'taskType',
      message: 'Task Type is required',
      section: 'A',
      taskLevelId: taskLevel.id,
    });
  }

  // Applicable Period: required for task_list and todo_task, hidden for library
  if (source !== 'library') {
    if (!info.applicablePeriod.startDate) {
      errors.push({
        field: 'applicablePeriod.startDate',
        message: 'Start date is required',
        section: 'A',
        taskLevelId: taskLevel.id,
      });
    }

    if (!info.applicablePeriod.endDate) {
      errors.push({
        field: 'applicablePeriod.endDate',
        message: 'End date is required',
        section: 'A',
        taskLevelId: taskLevel.id,
      });
    }

    // Validate end date >= start date
    if (info.applicablePeriod.startDate && info.applicablePeriod.endDate) {
      const startDate = new Date(info.applicablePeriod.startDate);
      const endDate = new Date(info.applicablePeriod.endDate);
      if (endDate < startDate) {
        errors.push({
          field: 'applicablePeriod.endDate',
          message: 'End date must be after or equal to start date',
          section: 'A',
          taskLevelId: taskLevel.id,
        });
      }
    }
  }

  // Execution Time is always required
  if (!info.executionTime) {
    errors.push({
      field: 'executionTime',
      message: 'Execution time is required',
      section: 'A',
      taskLevelId: taskLevel.id,
    });
  }

  return errors;
}

/**
 * Validate Section B: Instructions
 * - Task Type: required
 * - Manual Link: required
 * - Document: required if task type is 'document'
 * - Photo Guidelines: at least 1 required if task type is 'image'
 */
function validateInstructions(taskLevel: TaskLevel): ValidationError[] {
  const errors: ValidationError[] = [];
  const instructions = taskLevel.instructions;

  // Task Type is required
  if (!instructions.taskType) {
    errors.push({
      field: 'instructions.taskType',
      message: 'Instruction type is required',
      section: 'B',
      taskLevelId: taskLevel.id,
    });
  }

  // Manual Link is required
  if (!instructions.manualLink || instructions.manualLink.trim() === '') {
    errors.push({
      field: 'manualLink',
      message: 'Manual link is required',
      section: 'B',
      taskLevelId: taskLevel.id,
    });
  }

  // Conditional validation based on task type
  if (instructions.taskType === 'document') {
    // For document type, we would need a document field
    // Currently the type doesn't have a document field,
    // so we skip this validation until the field is added
    // TODO: Add document field to TaskInstructions type
  }

  if (instructions.taskType === 'image') {
    // Photo Guidelines: at least 1 required for image type
    if (!instructions.photoGuidelines || instructions.photoGuidelines.length === 0) {
      errors.push({
        field: 'photoGuidelines',
        message: 'At least one photo guideline is required for image tasks',
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

    // A. Task Information
    errors.push(...validateTaskInformation(taskLevel, source));

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
