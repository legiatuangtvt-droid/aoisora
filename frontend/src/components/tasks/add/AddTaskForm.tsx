'use client';

import { useState, useCallback, useMemo, useEffect, memo, useRef } from 'react';
import { TaskLevel, TaskInformation, TaskInstructions, TaskScope, TaskApproval, DropdownOption, TaskFrequency, ExecutionTime } from '@/types/addTask';
import { mockMasterData, createEmptyTaskLevel } from '@/data/mockAddTask';
import {
  TASK_TYPE_ORDER,
  DEFAULT_TASK_TYPE_BY_LEVEL,
  getTaskTypeOptionsForLevel,
  getExecutionTimeMinutes,
  getDefaultExecutionTimeForChild,
} from '@/config/wsConfig';
import TaskLevelCard from './TaskLevelCard';
import SectionCard from './SectionCard';
import TaskInfoSection from './TaskInfoSection';
import InstructionsSection from './InstructionsSection';
import ScopeSection from './ScopeSection';
import ApprovalSection from './ApprovalSection';
import {
  validateForSubmit,
  validateForDraft,
  getErrorsForSection,
  getFieldError,
  ValidationError,
  isDateRangeValidForTaskType,
  getAllowedTaskTypesForDateRange,
  TASK_TYPE_LABELS,
  TASK_TYPE_MAX_DAYS,
} from '@/utils/taskValidation';
import { useUser } from '@/contexts/UserContext';
import { getApproverForStaff, ApproverInfo } from '@/lib/api';

export interface RejectionInfo {
  reason: string;
  rejectedAt: string;
  rejectedBy: {
    id: number;
    name: string;
  };
  rejectionCount: number;
  maxRejections: number;
  hasChangesSinceRejection: boolean;
}

// Task creation source/flow type
export type TaskSource = 'task_list' | 'library' | 'todo_task';

interface AddTaskFormProps {
  taskLevels: TaskLevel[];
  onTaskLevelsChange: (taskLevels: TaskLevel[]) => void;
  onSaveDraft: (taskLevels: TaskLevel[]) => void;
  onSubmit: (taskLevels: TaskLevel[]) => void;
  onApprove?: (taskLevels: TaskLevel[]) => void;
  onReject?: (taskLevels: TaskLevel[], reason: string) => void;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
  canCreateDraft?: boolean;
  // Task status for different view modes
  taskStatus?: 'draft' | 'approve' | 'approved' | 'rejected';
  // Whether current user is the approver
  isApprover?: boolean;
  // Whether current user is the creator viewing their pending approval
  isCreatorViewingApproval?: boolean;
  // Rejection info for displaying feedback after rejection
  rejectionInfo?: RejectionInfo;
  // Task creation source/flow - determines which sections are shown
  // - task_list: C. Scope shows Store structure (Region/Zone/Area/Store)
  // - library: C. Scope is HIDDEN (will be selected when dispatching)
  // - todo_task: C. Scope shows HQ structure (Division/Dept/Team/User)
  source?: TaskSource;
}

// Section IDs for accordion
type SectionId = 'A' | 'B' | 'C' | 'D';

// Memoized TaskLevelCard wrapper to prevent re-renders
interface TaskLevelItemProps {
  taskLevel: TaskLevel;
  onNameChange: (taskLevelId: string, name: string) => void;
  onAddSubLevel: (parentId: string) => void;
  onDeleteTaskLevel: (taskLevelId: string) => void;
  onTaskInfoChange: (taskLevelId: string, data: TaskInformation) => void;
  onInstructionsChange: (taskLevelId: string, data: TaskInstructions) => void;
  onScopeChange: (taskLevelId: string, data: TaskScope) => void;
  onApprovalChange: (taskLevelId: string, data: TaskApproval) => void;
  onSectionToggle: (taskLevelId: string, sectionId: SectionId) => void;
  expandedSection: SectionId | null;
  nameError?: string;
  sectionErrorCounts: { A: number; B: number; C: number; D: number };
  canAddSubLevel: boolean;
  canDelete: boolean;
  showScopeSection: boolean;
  scopeType: 'store' | 'hq';
  // Filtered task type options based on parent's task type
  taskTypeOptions: DropdownOption[];
  zoneOptions: DropdownOption[];
  areaOptions: DropdownOption[];
  storeOptions: DropdownOption[];
  currentUser?: { id: number; name: string; position: string };
  autoApprover?: { id: number; name: string; position: string; job_grade: string };
  isApprovalReadOnly: boolean;
}

const TaskLevelItem = memo(function TaskLevelItem({
  taskLevel,
  onNameChange,
  onAddSubLevel,
  onDeleteTaskLevel,
  onTaskInfoChange,
  onInstructionsChange,
  onScopeChange,
  onApprovalChange,
  onSectionToggle,
  expandedSection,
  nameError,
  sectionErrorCounts,
  canAddSubLevel,
  canDelete,
  showScopeSection,
  scopeType,
  taskTypeOptions,
  zoneOptions,
  areaOptions,
  storeOptions,
  currentUser,
  autoApprover,
  isApprovalReadOnly,
}: TaskLevelItemProps) {
  const taskLevelId = taskLevel.id;

  // Memoized handlers to prevent re-renders
  const handleNameChange = useCallback((name: string) => {
    onNameChange(taskLevelId, name);
  }, [taskLevelId, onNameChange]);

  const handleAddSubLevel = useCallback(() => {
    onAddSubLevel(taskLevelId);
  }, [taskLevelId, onAddSubLevel]);

  const handleDelete = useCallback(() => {
    onDeleteTaskLevel(taskLevelId);
  }, [taskLevelId, onDeleteTaskLevel]);

  const handleTaskInfoChange = useCallback((data: TaskInformation) => {
    onTaskInfoChange(taskLevelId, data);
  }, [taskLevelId, onTaskInfoChange]);

  const handleInstructionsChange = useCallback((data: TaskInstructions) => {
    onInstructionsChange(taskLevelId, data);
  }, [taskLevelId, onInstructionsChange]);

  const handleScopeChange = useCallback((data: TaskScope) => {
    onScopeChange(taskLevelId, data);
  }, [taskLevelId, onScopeChange]);

  const handleApprovalChange = useCallback((data: TaskApproval) => {
    onApprovalChange(taskLevelId, data);
  }, [taskLevelId, onApprovalChange]);

  const handleSectionToggleA = useCallback(() => {
    onSectionToggle(taskLevelId, 'A');
  }, [taskLevelId, onSectionToggle]);

  const handleSectionToggleB = useCallback(() => {
    onSectionToggle(taskLevelId, 'B');
  }, [taskLevelId, onSectionToggle]);

  const handleSectionToggleC = useCallback(() => {
    onSectionToggle(taskLevelId, 'C');
  }, [taskLevelId, onSectionToggle]);

  const handleSectionToggleD = useCallback(() => {
    onSectionToggle(taskLevelId, 'D');
  }, [taskLevelId, onSectionToggle]);

  // Section icons (static, no need to memoize)
  const TaskInfoIcon = (
    <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const InstructionsIcon = (
    <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );

  const ScopeIcon = (
    <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const ApprovalIcon = (
    <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <TaskLevelCard
      taskLevel={taskLevel}
      onNameChange={handleNameChange}
      onAddSubLevel={handleAddSubLevel}
      onDelete={handleDelete}
      canAddSubLevel={canAddSubLevel}
      canDelete={canDelete}
      nameError={nameError}
    >
      {/* A. Task Information */}
      <SectionCard
        id="A"
        title="Task Information"
        icon={TaskInfoIcon}
        isExpanded={expandedSection === 'A'}
        onToggle={handleSectionToggleA}
        errorCount={sectionErrorCounts.A}
      >
        <TaskInfoSection
          data={taskLevel.taskInformation}
          onChange={handleTaskInfoChange}
          taskTypeOptions={taskTypeOptions}
          executionTimeOptions={mockMasterData.executionTimes}
        />
      </SectionCard>

      {/* B. Instructions */}
      <SectionCard
        id="B"
        title="Instructions"
        icon={InstructionsIcon}
        isExpanded={expandedSection === 'B'}
        onToggle={handleSectionToggleB}
        errorCount={sectionErrorCounts.B}
      >
        <InstructionsSection
          data={taskLevel.instructions}
          onChange={handleInstructionsChange}
          taskTypeOptions={mockMasterData.instructionTaskTypes}
        />
      </SectionCard>

      {/* C. Scope - Hidden for library flow (will be selected when dispatching) */}
      {showScopeSection && (
        <SectionCard
          id="C"
          title={scopeType === 'hq' ? 'Scope (HQ Users)' : 'Scope (Stores)'}
          icon={ScopeIcon}
          isExpanded={expandedSection === 'C'}
          onToggle={handleSectionToggleC}
          errorCount={sectionErrorCounts.C}
        >
          <ScopeSection
            data={taskLevel.scope}
            onChange={handleScopeChange}
            regionOptions={mockMasterData.regions}
            zoneOptions={zoneOptions}
            areaOptions={areaOptions}
            storeOptions={storeOptions}
            storeLeaderOptions={mockMasterData.storeLeaders}
            staffOptions={mockMasterData.staff}
            scopeType={scopeType}
          />
        </SectionCard>
      )}

      {/* D. Approval Process */}
      <SectionCard
        id="D"
        title="Approval Process"
        icon={ApprovalIcon}
        isExpanded={expandedSection === 'D'}
        onToggle={handleSectionToggleD}
        errorCount={sectionErrorCounts.D}
      >
        <ApprovalSection
          data={taskLevel.approval}
          onChange={handleApprovalChange}
          initiatorOptions={mockMasterData.initiators}
          leaderOptions={mockMasterData.leaders}
          hodOptions={mockMasterData.hods}
          currentUser={currentUser}
          autoApprover={autoApprover}
          isReadOnly={isApprovalReadOnly}
        />
      </SectionCard>
    </TaskLevelCard>
  );
});

export default function AddTaskForm({
  taskLevels,
  onTaskLevelsChange,
  onSaveDraft,
  onSubmit,
  onApprove,
  onReject,
  isSubmitting = false,
  isSavingDraft = false,
  canCreateDraft = true,
  taskStatus = 'draft',
  isApprover = false,
  isCreatorViewingApproval = false,
  rejectionInfo,
  source = 'task_list',
}: AddTaskFormProps) {
  // Get current user from context
  const { currentUser } = useUser();

  // Use refs to keep stable references for callbacks
  const taskLevelsRef = useRef(taskLevels);
  const onTaskLevelsChangeRef = useRef(onTaskLevelsChange);

  // Update refs when props change
  useEffect(() => {
    taskLevelsRef.current = taskLevels;
  }, [taskLevels]);

  useEffect(() => {
    onTaskLevelsChangeRef.current = onTaskLevelsChange;
  }, [onTaskLevelsChange]);

  // Determine if Scope section should be shown based on source
  // - task_list: Show Store scope (Region/Zone/Area/Store)
  // - library: Hide scope (will be selected when dispatching)
  // - todo_task: Show HQ scope (Division/Dept/Team/User)
  const showScopeSection = source !== 'library';

  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidationToast, setShowValidationToast] = useState(false);

  // Warning toast for Task Type / Date Range mismatch (real-time feedback)
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [showWarningToast, setShowWarningToast] = useState(false);

  // State for reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // State for auto-determined approver
  const [autoApprover, setAutoApprover] = useState<ApproverInfo | null>(null);
  const [isLoadingApprover, setIsLoadingApprover] = useState(false);

  // Fetch approver on mount or when current user changes
  useEffect(() => {
    if (currentUser?.staff_id) {
      setIsLoadingApprover(true);
      getApproverForStaff(currentUser.staff_id)
        .then((response) => {
          if (response.success && response.approver) {
            setAutoApprover(response.approver);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch approver:', error);
        })
        .finally(() => {
          setIsLoadingApprover(false);
        });
    }
  }, [currentUser?.staff_id]);

  // Helper to get error count for a section
  const getSectionErrorCount = useCallback(
    (taskLevelId: string, section: 'A' | 'B' | 'C' | 'D') => {
      return getErrorsForSection(validationErrors, taskLevelId, section).length;
    },
    [validationErrors]
  );

  // Helper to get name error for a task level
  const getNameError = useCallback(
    (taskLevelId: string) => {
      return getFieldError(validationErrors, taskLevelId, 'name');
    },
    [validationErrors]
  );

  // Clear validation errors when form is edited
  const clearValidationErrors = useCallback(() => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
      setShowValidationToast(false);
    }
  }, [validationErrors.length]);

  // Handle save draft with validation
  const handleSaveDraft = useCallback(() => {
    const result = validateForDraft(taskLevels);
    if (!result.isValid) {
      setValidationErrors(result.errors);
      setShowValidationToast(true);
      return;
    }
    onSaveDraft(taskLevels);
  }, [taskLevels, onSaveDraft]);

  // Handle submit with full validation
  const handleSubmit = useCallback(() => {
    const result = validateForSubmit(taskLevels, source);
    if (!result.isValid) {
      setValidationErrors(result.errors);
      setShowValidationToast(true);
      // Scroll to top to show error toast
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onSubmit(taskLevels);
  }, [taskLevels, source, onSubmit]);

  // Handle reject with reason
  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsRejecting(true);
    try {
      await onReject?.(taskLevels, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle approve
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove?.(taskLevels);
    } finally {
      setIsApproving(false);
    }
  };

  // Determine if form is read-only
  const isReadOnly = taskStatus === 'approve' || taskStatus === 'approved';

  // Track which section is expanded for each task level (accordion behavior)
  // Key: taskLevelId, Value: expanded sectionId or null
  const [expandedSections, setExpandedSections] = useState<Record<string, SectionId | null>>({});

  // Toggle section expansion (accordion - only one section open at a time per task level)
  const handleSectionToggle = useCallback((taskLevelId: string, sectionId: SectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [taskLevelId]: prev[taskLevelId] === sectionId ? null : sectionId,
    }));
  }, []);

  // Update task level - use refs to keep stable callback
  const updateTaskLevel = useCallback((taskLevelId: string, updates: Partial<TaskLevel>) => {
    const currentLevels = taskLevelsRef.current;
    const onChange = onTaskLevelsChangeRef.current;
    onChange(
      currentLevels.map((tl) => (tl.id === taskLevelId ? { ...tl, ...updates } : tl))
    );
  }, []); // Empty deps - uses refs

  // Handle name change
  const handleNameChange = useCallback((taskLevelId: string, name: string) => {
    updateTaskLevel(taskLevelId, { name });
    clearValidationErrors();
  }, [updateTaskLevel, clearValidationErrors]);


  // Handle task information change - with cascade update for task type and real-time date validation
  const handleTaskInfoChange = useCallback((taskLevelId: string, taskInformation: TaskInformation) => {
    const currentLevels = taskLevelsRef.current;
    const onChange = onTaskLevelsChangeRef.current;
    const currentLevel = currentLevels.find((tl) => tl.id === taskLevelId);

    if (!currentLevel) {
      updateTaskLevel(taskLevelId, { taskInformation });
      clearValidationErrors();
      return;
    }

    // Real-time validation: Check Task Type and Date Range correlation
    const { taskType, applicablePeriod } = taskInformation;
    if (taskType && applicablePeriod.startDate && applicablePeriod.endDate && source !== 'library') {
      const validation = isDateRangeValidForTaskType(
        taskType,
        applicablePeriod.startDate,
        applicablePeriod.endDate
      );

      if (!validation.valid) {
        const taskTypeLabel = TASK_TYPE_LABELS[taskType] || taskType;
        const allowedTypes = getAllowedTaskTypesForDateRange(applicablePeriod.startDate, applicablePeriod.endDate);
        const allowedLabels = allowedTypes.map((t) => TASK_TYPE_LABELS[t] || t).join(', ');

        setWarningMessage(
          `⚠️ ${taskTypeLabel} task cannot exceed ${validation.maxDays} day${validation.maxDays > 1 ? 's' : ''}. ` +
          `Current range: ${validation.actualDays} days. ` +
          `Allowed Task Types for this range: ${allowedLabels || 'None'}.`
        );
        setShowWarningToast(true);
      } else {
        // Clear warning if valid
        setShowWarningToast(false);
        setWarningMessage(null);
      }
    }

    // Check if task type changed
    const oldTaskType = currentLevel.taskInformation.taskType;
    const newTaskType = taskInformation.taskType;

    if (oldTaskType === newTaskType) {
      // No task type change, just update
      updateTaskLevel(taskLevelId, { taskInformation });
      clearValidationErrors();
      return;
    }

    // Task type changed - need to cascade update children if necessary
    // newTaskType is guaranteed to be non-empty at this point since we're in the "changed" branch
    const newTaskTypeIndex = TASK_TYPE_ORDER.indexOf(newTaskType as TaskFrequency);

    // Find all descendants recursively
    const findAllDescendants = (parentId: string, levels: TaskLevel[]): TaskLevel[] => {
      const children = levels.filter((tl) => tl.parentId === parentId);
      return children.flatMap((c) => [c, ...findAllDescendants(c.id, levels)]);
    };

    const descendants = findAllDescendants(taskLevelId, currentLevels);

    // Update this task level and cascade update descendants if their task type is now invalid
    const updatedLevels = currentLevels.map((tl): TaskLevel => {
      if (tl.id === taskLevelId) {
        return { ...tl, taskInformation };
      }

      // Check if this is a descendant that needs task type update
      const isDescendant = descendants.some((d) => d.id === tl.id);
      if (isDescendant) {
        const childTaskTypeIndex = TASK_TYPE_ORDER.indexOf(tl.taskInformation.taskType as TaskFrequency);
        // If child's task type has larger time span than new parent's, update to default for that level
        if (childTaskTypeIndex < newTaskTypeIndex) {
          // Get the appropriate default task type for this level that is valid
          const validDefaultForLevel = DEFAULT_TASK_TYPE_BY_LEVEL[tl.level] || 'daily';
          const validDefaultIndex = TASK_TYPE_ORDER.indexOf(validDefaultForLevel);
          // Use the default if it's valid, otherwise use parent's type
          const newChildTaskType = (validDefaultIndex >= newTaskTypeIndex ? validDefaultForLevel : newTaskType) as TaskFrequency | '';
          return {
            ...tl,
            taskInformation: {
              ...tl.taskInformation,
              taskType: newChildTaskType,
            },
          };
        }
      }

      return tl;
    });

    onChange(updatedLevels);
    clearValidationErrors();
  }, [updateTaskLevel, clearValidationErrors, source]);

  // Handle instructions change
  const handleInstructionsChange = useCallback((taskLevelId: string, instructions: TaskInstructions) => {
    updateTaskLevel(taskLevelId, { instructions });
    clearValidationErrors();
  }, [updateTaskLevel, clearValidationErrors]);

  // Handle scope change
  const handleScopeChange = useCallback((taskLevelId: string, scope: TaskScope) => {
    updateTaskLevel(taskLevelId, { scope });
    clearValidationErrors();
  }, [updateTaskLevel, clearValidationErrors]);

  // Handle approval change
  const handleApprovalChange = useCallback((taskLevelId: string, approval: TaskApproval) => {
    updateTaskLevel(taskLevelId, { approval });
    clearValidationErrors();
  }, [updateTaskLevel, clearValidationErrors]);

  // Add sub-level - use refs to keep stable callback
  // Auto-calculate execution time based on parent's remaining time after siblings
  const handleAddSubLevel = useCallback((parentId: string) => {
    const currentLevels = taskLevelsRef.current;
    const onChange = onTaskLevelsChangeRef.current;
    const parent = currentLevels.find((tl) => tl.id === parentId);
    if (!parent || parent.level >= 5) return;

    // Find existing siblings (children of the same parent)
    const siblings = currentLevels.filter((tl) => tl.parentId === parentId);
    const siblingsExecutionTimes = siblings.map((s) => s.taskInformation.executionTime).filter(Boolean);

    // Calculate default execution time for the new child based on parent constraints
    const parentExecutionTime = parent.taskInformation.executionTime;
    const childLevel = parent.level + 1;
    const defaultExecutionTime = parentExecutionTime
      ? getDefaultExecutionTimeForChild(parentExecutionTime, siblingsExecutionTimes, childLevel)
      : '';

    // Check if there's remaining time for a new child
    if (parentExecutionTime && !defaultExecutionTime) {
      // No remaining time - show warning
      setWarningMessage(
        `⚠️ Cannot add sub-task: Parent's execution time (${getExecutionTimeMinutes(parentExecutionTime)} min) is fully allocated to existing child tasks.`
      );
      setShowWarningToast(true);
      return;
    }

    const newTaskLevel = createEmptyTaskLevel(parent.level + 1, parentId);
    // Override the default execution time with the calculated one
    if (defaultExecutionTime) {
      newTaskLevel.taskInformation.executionTime = defaultExecutionTime as ExecutionTime;
    }

    onChange([...currentLevels, newTaskLevel]);
  }, []); // Empty deps - uses refs

  // Delete task level - use refs to keep stable callback
  const handleDeleteTaskLevel = useCallback((taskLevelId: string) => {
    const currentLevels = taskLevelsRef.current;
    const onChange = onTaskLevelsChangeRef.current;
    // Find all children recursively
    const findChildren = (parentId: string, levels: TaskLevel[]): string[] => {
      const children = levels.filter((tl) => tl.parentId === parentId);
      return children.flatMap((c) => [c.id, ...findChildren(c.id, levels)]);
    };

    const idsToRemove = [taskLevelId, ...findChildren(taskLevelId, currentLevels)];
    onChange(currentLevels.filter((tl) => !idsToRemove.includes(tl.id)));
  }, []); // Empty deps - uses refs

  // Get zone options based on selected region
  const getZoneOptions = (regionId: string) => {
    return mockMasterData.zones[regionId] || [];
  };

  // Get area options based on selected zone
  const getAreaOptions = (zoneId: string) => {
    return mockMasterData.areas[zoneId] || [];
  };

  // Get store options based on selected area
  const getStoreOptions = (areaId: string) => {
    return mockMasterData.stores[areaId] || [];
  };

  // Organize task levels into tree structure
  const getTaskLevelsTree = () => {
    const rootLevels = taskLevels.filter((tl) => tl.parentId === null);
    const getChildren = (parentId: string): TaskLevel[] => {
      return taskLevels.filter((tl) => tl.parentId === parentId);
    };

    const renderTaskLevelCard = (taskLevel: TaskLevel): JSX.Element => {
      const canAddSubLevel = taskLevel.level < 5;
      const canDelete = taskLevels.length > 1;

      // Get parent's task type to filter available options for this task level
      // Child task type must have equal or smaller time span than parent
      const parent = taskLevel.parentId ? taskLevels.find((tl) => tl.id === taskLevel.parentId) : null;
      const parentTaskType = parent?.taskInformation.taskType || null;
      const filteredTaskTypeOptions = getTaskTypeOptionsForLevel(parentTaskType);

      return (
        <TaskLevelItem
          key={taskLevel.id}
          taskLevel={taskLevel}
          onNameChange={handleNameChange}
          onAddSubLevel={handleAddSubLevel}
          onDeleteTaskLevel={handleDeleteTaskLevel}
          onTaskInfoChange={handleTaskInfoChange}
          onInstructionsChange={handleInstructionsChange}
          onScopeChange={handleScopeChange}
          onApprovalChange={handleApprovalChange}
          onSectionToggle={handleSectionToggle}
          expandedSection={expandedSections[taskLevel.id] || null}
          nameError={getNameError(taskLevel.id)}
          sectionErrorCounts={{
            A: getSectionErrorCount(taskLevel.id, 'A'),
            B: getSectionErrorCount(taskLevel.id, 'B'),
            C: getSectionErrorCount(taskLevel.id, 'C'),
            D: getSectionErrorCount(taskLevel.id, 'D'),
          }}
          canAddSubLevel={canAddSubLevel}
          canDelete={canDelete}
          showScopeSection={showScopeSection}
          scopeType={source === 'todo_task' ? 'hq' : 'store'}
          taskTypeOptions={filteredTaskTypeOptions}
          zoneOptions={getZoneOptions(taskLevel.scope.regionId)}
          areaOptions={getAreaOptions(taskLevel.scope.zoneId)}
          storeOptions={getStoreOptions(taskLevel.scope.areaId)}
          currentUser={currentUser ? {
            id: currentUser.staff_id,
            name: currentUser.staff_name,
            position: currentUser.job_grade,
          } : undefined}
          autoApprover={autoApprover ? {
            id: autoApprover.id,
            name: autoApprover.name,
            position: autoApprover.position,
            job_grade: autoApprover.job_grade,
          } : undefined}
          isApprovalReadOnly={isCreatorViewingApproval || taskStatus === 'approve'}
        />
      );
    };

    // Render "Add new sub task" button to add more children at same level
    const renderAddSubTaskButton = (parentLevel: TaskLevel): JSX.Element | null => {
      if (parentLevel.level >= 5) return null;

      return (
        <button
          onClick={() => handleAddSubLevel(parentLevel.id)}
          className="w-[536px] flex items-center gap-3 px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          {/* Plus Icon */}
          <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          {/* Text */}
          <div className="text-left">
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              Add new sub task {parentLevel.level + 1}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This task will be added to Level {parentLevel.level + 1}
            </p>
          </div>
        </button>
      );
    };

    const renderTaskLevel = (taskLevel: TaskLevel): JSX.Element => {
      const children = getChildren(taskLevel.id);
      const canAddMoreChildren = taskLevel.level < 5;

      if (children.length === 0) {
        return (
          <div key={taskLevel.id}>
            {renderTaskLevelCard(taskLevel)}
          </div>
        );
      }

      // Render parent and children horizontally
      return (
        <div key={taskLevel.id} className="flex items-start gap-4">
          {/* Parent task level - explicitly wrap in flex-shrink-0 to prevent collapsing */}
          <div className="flex-shrink-0">
            {renderTaskLevelCard(taskLevel)}
          </div>

          {/* Children task levels + Add button */}
          <div className="flex flex-col gap-4 flex-shrink-0">
            {children.map((child) => renderTaskLevel(child))}
            {/* Button to add more children at this level */}
            {canAddMoreChildren && renderAddSubTaskButton(taskLevel)}
          </div>
        </div>
      );
    };

    return rootLevels.map((tl) => renderTaskLevel(tl));
  };

  return (
    <div className="space-y-6">
      {/* Task Levels - with horizontal scroll for deep hierarchies */}
      <div className="space-y-4 overflow-x-auto pb-4">
        <div className="inline-flex flex-col gap-4 min-w-max">
          {getTaskLevelsTree()}
        </div>
      </div>

      {/* Rejection Info Banner - Show when task was rejected */}
      {rejectionInfo && taskStatus === 'draft' && (
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                  Changes Requested
                </h4>
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  Attempt {rejectionInfo.rejectionCount} of {rejectionInfo.maxRejections}
                </span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                {rejectionInfo.reason}
              </p>
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                <span>Feedback from: {rejectionInfo.rejectedBy.name}</span>
                <span>•</span>
                <span>{new Date(rejectionInfo.rejectedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              {rejectionInfo.rejectionCount >= rejectionInfo.maxRejections ? (
                <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
                  <strong>Maximum rejection limit reached.</strong> This task can only be deleted.
                </div>
              ) : !rejectionInfo.hasChangesSinceRejection ? (
                <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
                  <strong>Edit required:</strong> Please make changes to the task before resubmitting.
                </div>
              ) : (
                <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded text-xs text-green-700 dark:text-green-300">
                  <strong>Changes detected.</strong> You can now resubmit the task.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Banner for Creator viewing approval */}
      {isCreatorViewingApproval && taskStatus === 'approve' && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            Waiting for approval from your leader
          </span>
        </div>
      )}

      {/* Validation Error Toast */}
      {showValidationToast && validationErrors.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">
                  Please fix the following errors
                </h4>
                <button
                  onClick={() => setShowValidationToast(false)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                {validationErrors.slice(0, 5).map((error, idx) => (
                  <li key={idx}>{error.message}</li>
                ))}
                {validationErrors.length > 5 && (
                  <li className="text-red-600 dark:text-red-400">
                    ...and {validationErrors.length - 5} more errors
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warning Toast for Task Type / Date Range mismatch */}
      {showWarningToast && warningMessage && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Task Type and Date Range Mismatch
                </h4>
                <button
                  onClick={() => setShowWarningToast(false)}
                  className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {warningMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-4">
        {/* APPROVER VIEW: Show Reject and Approve buttons */}
        {isApprover && taskStatus === 'approve' && (
          <>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={isRejecting || isApproving}
              className="px-6 py-2 border border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request to change
            </button>
            <button
              onClick={handleApprove}
              disabled={isRejecting || isApproving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </button>
          </>
        )}

        {/* CREATOR VIEW when task is pending approval: Disabled buttons */}
        {isCreatorViewingApproval && taskStatus === 'approve' && (
          <>
            <button
              disabled
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
            >
              Save as draft
            </button>
            <button
              disabled
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium cursor-not-allowed opacity-70"
            >
              Approving...
            </button>
          </>
        )}

        {/* NORMAL VIEW: Show Save Draft and Submit buttons */}
        {!isApprover && !isCreatorViewingApproval && taskStatus === 'draft' && (
          <>
            <button
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting || !canCreateDraft}
              title={!canCreateDraft ? 'Draft limit reached. Delete existing drafts to create new ones.' : undefined}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingDraft ? 'Saving...' : !canCreateDraft ? 'Draft limit reached' : 'Save as draft'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isSavingDraft ||
                isSubmitting ||
                (rejectionInfo && rejectionInfo.rejectionCount >= rejectionInfo.maxRejections) ||
                (rejectionInfo && !rejectionInfo.hasChangesSinceRejection)
              }
              title={
                rejectionInfo && rejectionInfo.rejectionCount >= rejectionInfo.maxRejections
                  ? 'Maximum rejection limit reached. This task can only be deleted.'
                  : rejectionInfo && !rejectionInfo.hasChangesSinceRejection
                  ? 'Please make changes to the task before resubmitting.'
                  : undefined
              }
              className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : rejectionInfo ? 'Resubmit' : 'Submit'}
            </button>
          </>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Request to Change
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please provide feedback on what needs to be changed. The creator will receive this feedback.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter feedback for changes..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                disabled={isRejecting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || isRejecting}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRejecting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
