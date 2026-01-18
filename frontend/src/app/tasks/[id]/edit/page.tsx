'use client';

import { useState, useCallback, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TaskLevel } from '@/types/addTask';
import { createEmptyTaskLevel } from '@/data/mockAddTask';
import AddTaskForm, { RejectionInfo } from '@/components/tasks/add/AddTaskForm';
import TaskMapsTab from '@/components/tasks/add/TaskMapsTab';
import { useToast } from '@/components/ui/Toast';
import { getTaskById, updateTask, submitTask, deleteTask } from '@/lib/api';
import { Task } from '@/types/api';
import { useUser } from '@/contexts/UserContext';

// Status IDs
const STATUS_DRAFT_ID = 12;
const STATUS_APPROVE_ID = 13;

type TabType = 'detail' | 'maps';

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = use(params);
  const taskId = parseInt(id, 10);

  const router = useRouter();
  const { showToast } = useToast();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lifted state for task levels - shared between Detail and Maps tabs
  const [taskLevels, setTaskLevels] = useState<TaskLevel[]>([]);

  // Determine task status
  const taskStatus = task?.status_id === STATUS_APPROVE_ID ? 'approve' : 'draft';

  // Check if current user is the creator
  const isCreator = task?.created_staff_id === currentUser?.staff_id;

  // Check if current user is the approver (has higher job_grade in same dept/team)
  const isApprover = !isCreator && currentUser?.staff_id !== task?.created_staff_id;

  // Get rejection info if task was rejected
  const rejectionInfo: RejectionInfo | undefined = task?.rejection_count && task.rejection_count > 0 ? {
    reason: task.last_rejection_reason || 'No reason provided',
    rejectedAt: task.last_rejected_at || task.updated_at,
    rejectedBy: {
      id: task.approved_by || 0,
      name: task.approver?.staff_name || 'Unknown',
    },
    rejectionCount: task.rejection_count,
    maxRejections: 3,
  } : undefined;

  // Fetch task data on mount
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const taskData = await getTaskById(taskId);
        setTask(taskData);

        // Convert task data to TaskLevel format
        const taskLevel = createEmptyTaskLevel(1);
        taskLevel.name = taskData.task_name || '';
        taskLevel.instructions.note = taskData.task_description || '';
        taskLevel.taskInformation.applicablePeriod.startDate = taskData.start_date || '';
        taskLevel.taskInformation.applicablePeriod.endDate = taskData.end_date || '';

        setTaskLevels([taskLevel]);
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  // Add sub-level handler for Maps tab
  const handleAddSubLevel = useCallback((parentId: string) => {
    const parent = taskLevels.find((tl) => tl.id === parentId);
    if (!parent || parent.level >= 5) return;

    const newTaskLevel = createEmptyTaskLevel(parent.level + 1, parentId);
    setTaskLevels((prev) => [...prev, newTaskLevel]);
  }, [taskLevels]);

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

  const handleSaveDraft = async (taskLevels: TaskLevel[]) => {
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

      // Prepare task data for API
      const taskData = {
        task_name: rootTask.name,
        task_description: rootTask.instructions.note || undefined,
        start_date: rootTask.taskInformation.applicablePeriod.startDate || undefined,
        end_date: rootTask.taskInformation.applicablePeriod.endDate || undefined,
      };

      // Call API to update task
      await updateTask(taskId, taskData);

      showToast('Draft saved successfully', 'success');
      router.push('/tasks/list');
    } catch (error: unknown) {
      console.error('Error saving draft:', error);
      showToast(error instanceof Error ? error.message : 'Failed to save draft', 'error');
    } finally {
      setIsSavingDraft(false);
    }
  };

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

      // Step 1: Update the task first
      const taskData = {
        task_name: rootTask.name,
        task_description: rootTask.instructions.note || undefined,
        start_date: rootTask.taskInformation.applicablePeriod.startDate || undefined,
        end_date: rootTask.taskInformation.applicablePeriod.endDate || undefined,
      };

      await updateTask(taskId, taskData);

      // Step 2: Submit the task for approval
      const result = await submitTask(taskId);

      showToast(`Task submitted for approval. Approver: ${result.approver.name}`, 'success');
      router.push('/tasks/list');
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTask(taskId);
      showToast('Draft deleted successfully', 'success');
      router.push('/tasks/list');
    } catch (error: unknown) {
      console.error('Error deleting draft:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete draft', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
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

  // Error state
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
            href="/tasks/list"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Task List
          </Link>
        </div>
      </div>
    );
  }

  // Task not found
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Not Found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">The task you are looking for does not exist.</p>
        <Link
          href="/tasks/list"
          className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Task List
        </Link>
      </div>
    );
  }

  // Check if task can be edited (only drafts and rejected tasks)
  const canEdit = task.status_id === STATUS_DRAFT_ID;

  if (!canEdit && !isApprover) {
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
            href="/tasks/list"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Task List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/tasks/list"
            className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            List task
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium">Edit Draft</span>
        </div>

        {/* Delete Draft button */}
        {canEdit && (
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
      </nav>

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
          onTaskLevelsChange={setTaskLevels}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isSavingDraft={isSavingDraft}
          canCreateDraft={true}
          taskStatus={taskStatus}
          isApprover={isApprover}
          isCreatorViewingApproval={isCreator && taskStatus === 'approve'}
          rejectionInfo={rejectionInfo}
        />
      ) : (
        <TaskMapsTab
          taskLevels={taskLevels}
          onAddSubLevel={handleAddSubLevel}
        />
      )}
    </div>
  );
}
