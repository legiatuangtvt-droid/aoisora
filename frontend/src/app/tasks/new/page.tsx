'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TaskLevel } from '@/types/addTask';
import { createEmptyTaskLevel } from '@/data/mockAddTask';
import AddTaskForm, { RejectionInfo } from '@/components/tasks/add/AddTaskForm';
import TaskMapsTab from '@/components/tasks/add/TaskMapsTab';
import { useToast } from '@/components/ui/Toast';
import { createTask, getDraftInfo, DraftInfo, submitTask, getTaskById, updateTask, deleteTask } from '@/lib/api';
import { Task } from '@/types/api';
import { useUser } from '@/contexts/UserContext';

// Status IDs from code_master
const STATUS_DRAFT_ID = 12;
const STATUS_APPROVE_ID = 13;

// Source types for 3 creation flows
type TaskSource = 'task_list' | 'library' | 'todo_task';

// Source labels for display
const SOURCE_LABELS: Record<TaskSource, string> = {
  task_list: 'Task List',
  library: 'Library',
  todo_task: 'To Do Task',
};

// Back links based on source
const BACK_LINKS: Record<TaskSource, { href: string; label: string }> = {
  task_list: { href: '/tasks/list', label: 'List task' },
  library: { href: '/tasks/library', label: 'Library' },
  todo_task: { href: '/tasks/todo', label: 'To Do Task' },
};

type TabType = 'detail' | 'maps';

// Helper function: Convert Task from API to TaskLevel[] (flat array)
// Moved outside component to avoid dependency issues
const convertTaskToTaskLevels = (task: Task, parentId: string | null = null): TaskLevel[] => {
  const taskLevel = createEmptyTaskLevel(task.task_level || 1, parentId);
  taskLevel.name = task.task_name || '';
  taskLevel.instructions.note = task.task_description || '';
  taskLevel.taskInformation.applicablePeriod.startDate = task.start_date || '';
  taskLevel.taskInformation.applicablePeriod.endDate = task.end_date || '';

  // Start with current task level
  const levels: TaskLevel[] = [taskLevel];

  // Recursively convert sub_tasks if present
  if (task.sub_tasks && task.sub_tasks.length > 0) {
    for (const subTask of task.sub_tasks) {
      const childLevels = convertTaskToTaskLevels(subTask, taskLevel.id);
      levels.push(...childLevels);
    }
  }

  return levels;
};

// Inner component that uses searchParams
function AddTaskContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { currentUser } = useUser();

  // Get params from URL
  const taskId = searchParams.get('id') ? parseInt(searchParams.get('id')!, 10) : null;
  const source = (searchParams.get('source') as TaskSource) || 'task_list';
  const isEditMode = taskId !== null;

  // State
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [draftInfo, setDraftInfo] = useState<DraftInfo | null>(null);
  const [task, setTask] = useState<Task | null>(null);

  // Track local changes for rejected tasks - allows resubmit when user edits form
  const [localChangesDetected, setLocalChangesDetected] = useState(false);

  // Lifted state for task levels - shared between Detail and Maps tabs
  const [taskLevels, setTaskLevels] = useState<TaskLevel[]>([createEmptyTaskLevel(1)]);

  // User info
  const isHQUser = currentUser?.job_grade?.startsWith('G') || false;

  // Get draft info for current source
  const sourceDraftInfo = draftInfo?.by_source?.[source];

  // Task status (for edit mode)
  const taskStatus = task?.status_id === STATUS_APPROVE_ID ? 'approve' : 'draft';

  // Check if current user is the creator
  const isCreator = task?.created_staff_id === currentUser?.staff_id;

  // Check if current user is the approver
  const isApprover = isEditMode && !isCreator && task?.approver_id === currentUser?.staff_id;

  // Get rejection info if task was rejected
  // Use localChangesDetected OR server-side has_changes_since_rejection to determine if user can resubmit
  const rejectionInfo: RejectionInfo | undefined = task?.rejection_count && task.rejection_count > 0 ? {
    reason: task.last_rejection_reason || 'No reason provided',
    rejectedAt: task.last_rejected_at || task.updated_at,
    rejectedBy: {
      id: task.last_rejected_by || 0,
      name: task.approver?.staff_name || 'Unknown',
    },
    rejectionCount: task.rejection_count,
    maxRejections: 3,
    hasChangesSinceRejection: localChangesDetected || task.has_changes_since_rejection || false,
  } : undefined;

  // Get back link based on source
  const backLink = BACK_LINKS[source];

  // Fetch draft info on mount (only for HQ users)
  useEffect(() => {
    if (isHQUser && !isEditMode) {
      getDraftInfo()
        .then(setDraftInfo)
        .catch((err) => {
          console.error('Failed to fetch draft info:', err);
        });
    }
  }, [isHQUser, isEditMode]);

  // Fetch task data on mount (edit mode only)
  useEffect(() => {
    if (isEditMode && taskId) {
      const fetchTask = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const taskData = await getTaskById(taskId);
          setTask(taskData);

          // Convert task data (including sub_tasks) to TaskLevel[] format
          const taskLevelsFromApi = convertTaskToTaskLevels(taskData);
          setTaskLevels(taskLevelsFromApi);
        } catch (err) {
          console.error('Failed to fetch task:', err);
          setError(err instanceof Error ? err.message : 'Failed to load task');
        } finally {
          setIsLoading(false);
        }
      };

      fetchTask();
    }
  }, [isEditMode, taskId]);

  // Wrapper for taskLevels change to detect edits on rejected tasks
  // This enables the Resubmit button immediately when user makes any change
  const handleTaskLevelsChange = useCallback((newLevels: TaskLevel[]) => {
    setTaskLevels(newLevels);
    // If task was rejected and user is editing, mark local changes detected
    if (task?.rejection_count && task.rejection_count > 0 && !localChangesDetected) {
      setLocalChangesDetected(true);
    }
  }, [task?.rejection_count, localChangesDetected]);

  // Add sub-level handler for Maps tab
  const handleAddSubLevel = useCallback((parentId: string) => {
    const parent = taskLevels.find((tl) => tl.id === parentId);
    if (!parent || parent.level >= 5) return;

    const newTaskLevel = createEmptyTaskLevel(parent.level + 1, parentId);
    handleTaskLevelsChange([...taskLevels, newTaskLevel]);
  }, [taskLevels, handleTaskLevelsChange]);

  // Validate task_name for all task levels (required for draft)
  const validateForDraft = (taskLevels: TaskLevel[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    taskLevels.forEach((tl) => {
      if (!tl.name || tl.name.trim() === '') {
        errors.push(`Task Level ${tl.level}: Task name is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Helper function: Build nested task structure from flat TaskLevel array
  // Converts TaskLevel[] to nested TaskCreate with sub_tasks
  const buildNestedTaskData = (
    taskLevels: TaskLevel[],
    parentId: string | null,
    parentLevel: number,
    statusId: number
  ): import('@/types/api').TaskCreate[] => {
    // Find direct children of this parent (match by parentId only, level is implicit)
    const children = taskLevels.filter((tl) => tl.parentId === parentId);

    return children.map((child) => ({
      task_name: child.name,
      task_description: child.instructions.note || undefined,
      start_date: child.taskInformation.applicablePeriod.startDate || undefined,
      end_date: child.taskInformation.applicablePeriod.endDate || undefined,
      task_level: child.level,
      status_id: statusId,
      priority: 'normal' as const,
      source: source,
      // Recursively build sub_tasks if level < 5
      sub_tasks: child.level < 5 ? buildNestedTaskData(taskLevels, child.id, child.level, statusId) : undefined,
    }));
  };

  // Handle Save Draft
  const handleSaveDraft = async (taskLevels: TaskLevel[]) => {
    // Check draft limit before saving (frontend check) - only for new tasks
    if (!isEditMode && isHQUser && sourceDraftInfo && !sourceDraftInfo.can_create_draft) {
      showToast(
        `You have reached the maximum limit of ${sourceDraftInfo.max_drafts} drafts for ${SOURCE_LABELS[source]}. Please complete or delete existing drafts before creating new ones.`,
        'error'
      );
      return;
    }

    // Validate task_name for all levels
    const validation = validateForDraft(taskLevels);
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        showToast(error, 'error');
      });
      return;
    }

    setIsSavingDraft(true);

    try {
      // Get the root task level (level 1)
      const rootTask = taskLevels.find((tl) => tl.level === 1);
      if (!rootTask) {
        showToast('No task level found', 'error');
        setIsSavingDraft(false);
        return;
      }

      // Build nested sub_tasks from taskLevels (levels 2-5)
      const subTasks = buildNestedTaskData(taskLevels, rootTask.id, rootTask.level, STATUS_DRAFT_ID);

      // Prepare task data for API
      // Always include sub_tasks (even empty array) so backend knows to sync
      const taskData = {
        task_name: rootTask.name,
        task_description: rootTask.instructions.note || undefined,
        start_date: rootTask.taskInformation.applicablePeriod.startDate || undefined,
        end_date: rootTask.taskInformation.applicablePeriod.endDate || undefined,
        task_level: 1,
        sub_tasks: subTasks, // Always send, even if empty - backend will sync
      };

      if (isEditMode && taskId) {
        // Update existing task
        await updateTask(taskId, taskData);
        showToast('Draft saved successfully', 'success');
      } else {
        // Create new task with sub-tasks
        await createTask({
          ...taskData,
          status_id: STATUS_DRAFT_ID,
          priority: 'normal',
          source: source,
        });
        showToast('Task saved as draft successfully', 'success');
      }

      router.push(backLink.href);
    } catch (error: unknown) {
      console.error('Error saving draft:', error);

      // Handle draft limit exceeded error from backend
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 422) {
        const apiError = error as { response?: { data?: { message?: string; error?: string; current_drafts?: number; max_drafts?: number } } };
        if (apiError.response?.data?.error) {
          showToast(apiError.response.data.error, 'error');
          // Refresh draft info
          if (isHQUser && !isEditMode) {
            getDraftInfo().then(setDraftInfo).catch(console.error);
          }
          return;
        }
      }

      showToast(error instanceof Error ? error.message : 'Failed to save draft', 'error');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handle Submit
  const handleSubmit = async (taskLevels: TaskLevel[]) => {
    setIsSubmitting(true);

    try {
      // Get the root task level (level 1)
      const rootTask = taskLevels.find((tl) => tl.level === 1);
      if (!rootTask) {
        showToast('No task level found', 'error');
        setIsSubmitting(false);
        return;
      }

      // Build nested sub_tasks from taskLevels (levels 2-5)
      const subTasks = buildNestedTaskData(taskLevels, rootTask.id, rootTask.level, STATUS_DRAFT_ID);

      // Prepare task data for API
      // Always include sub_tasks (even empty array) so backend knows to sync
      const taskData = {
        task_name: rootTask.name,
        task_description: rootTask.instructions.note || undefined,
        start_date: rootTask.taskInformation.applicablePeriod.startDate || undefined,
        end_date: rootTask.taskInformation.applicablePeriod.endDate || undefined,
        task_level: 1,
        sub_tasks: subTasks, // Always send, even if empty - backend will sync
      };

      let submitTaskId = taskId;

      if (isEditMode && taskId) {
        // Update existing task first
        await updateTask(taskId, taskData);
      } else {
        // Create new task first with sub-tasks
        const createdTask = await createTask({
          ...taskData,
          status_id: STATUS_DRAFT_ID,
          priority: 'normal',
          source: source,
        });
        submitTaskId = createdTask.task_id;
      }

      // Submit the task for approval
      const result = await submitTask(submitTaskId!);

      showToast(`Task submitted for approval. Approver: ${result.approver.name}`, 'success');
      router.push(backLink.href);
    } catch (error: unknown) {
      console.error('Error submitting task:', error);

      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number; response?: { data?: { error?: string; message?: string } } };
        const errorMessage = apiError.response?.data?.error || apiError.response?.data?.message || 'Failed to submit task';
        showToast(errorMessage, 'error');
      } else {
        showToast(error instanceof Error ? error.message : 'Failed to submit task', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Draft
  const handleDelete = async () => {
    if (!taskId) return;

    if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTask(taskId);
      showToast('Draft deleted successfully', 'success');
      router.push(backLink.href);
    } catch (error: unknown) {
      console.error('Error deleting draft:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete draft', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state (edit mode only)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 dark:text-gray-400">Loading task...</span>
        </div>
      </div>
    );
  }

  // Error state (edit mode only)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Error Loading Task</h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link
            href={backLink.href}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {backLink.label}
          </Link>
        </div>
      </div>
    );
  }

  // Task not found (edit mode only)
  if (isEditMode && !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Not Found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">The task you are looking for does not exist.</p>
        <Link
          href={backLink.href}
          className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to {backLink.label}
        </Link>
      </div>
    );
  }

  // Check if task can be edited (only drafts - edit mode only)
  const canEdit = !isEditMode || task?.status_id === STATUS_DRAFT_ID;

  if (isEditMode && !canEdit && !isApprover) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
          <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Cannot Edit This Task</h3>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
            This task cannot be edited because it is not in draft status.
          </p>
          <Link
            href={backLink.href}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {backLink.label}
          </Link>
        </div>
      </div>
    );
  }

  // Page title based on mode and source
  const pageTitle = isEditMode ? 'Edit Draft' : 'Add task';

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={backLink.href}
            className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            {backLink.label}
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium">{pageTitle}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Draft limit indicator for HQ users (create mode only) */}
          {!isEditMode && isHQUser && sourceDraftInfo && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              sourceDraftInfo.remaining_drafts === 0
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : sourceDraftInfo.remaining_drafts <= 2
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Drafts: {sourceDraftInfo.current_drafts}/{sourceDraftInfo.max_drafts}</span>
            </div>
          )}

          {/* Delete Draft button (edit mode only) */}
          {isEditMode && canEdit && (
            <button
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting || isSavingDraft}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeleting ? 'Deleting...' : 'Delete Draft'}
            </button>
          )}
        </div>
      </nav>

      {/* Expiring Draft Warning Banner (edit mode, draft status, within 5 days of deletion) */}
      {isEditMode && task && task.status_id === STATUS_DRAFT_ID && (() => {
        const lastModified = new Date(task.updated_at);
        const now = new Date();
        const daysSinceModified = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
        const daysUntilDeletion = 30 - daysSinceModified;

        if (daysUntilDeletion <= 5 && daysUntilDeletion > 0) {
          return (
            <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    This draft will be automatically deleted in {daysUntilDeletion} {daysUntilDeletion === 1 ? 'day' : 'days'}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Drafts that haven&apos;t been edited for 30 days are automatically removed. Edit or submit this draft to prevent deletion.
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* Tabs - aligned to right */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('detail')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'detail'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Detail
          </button>
          <button
            onClick={() => setActiveTab('maps')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'maps'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Maps
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'detail' ? (
        <AddTaskForm
          taskLevels={taskLevels}
          onTaskLevelsChange={handleTaskLevelsChange}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isSavingDraft={isSavingDraft}
          canCreateDraft={!isHQUser || !sourceDraftInfo || sourceDraftInfo.can_create_draft || isEditMode}
          taskStatus={isEditMode ? taskStatus : undefined}
          isApprover={isApprover}
          isCreatorViewingApproval={isEditMode && isCreator && taskStatus === 'approve'}
          rejectionInfo={rejectionInfo}
          source={source}
        />
      ) : (
        <TaskMapsTab
          taskLevels={taskLevels}
          onAddSubLevel={handleAddSubLevel}
          onSaveDraft={() => handleSaveDraft(taskLevels)}
          onSubmit={() => handleSubmit(taskLevels)}
          isSavingDraft={isSavingDraft}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

// Main page component with Suspense
export default function NewTaskPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    }>
      <AddTaskContent />
    </Suspense>
  );
}
