'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TaskLevel } from '@/types/addTask';
import { createEmptyTaskLevel } from '@/data/mockAddTask';
import AddTaskForm from '@/components/tasks/add/AddTaskForm';
import TaskMapsTab from '@/components/tasks/add/TaskMapsTab';
import { useToast } from '@/components/ui/Toast';
import { createTask, getDraftInfo, DraftInfo } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';

// Status ID for DRAFT (will be added to code_master)
const STATUS_DRAFT_ID = 12;

type TabType = 'detail' | 'maps';

export default function NewTaskPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftInfo, setDraftInfo] = useState<DraftInfo | null>(null);

  // Lifted state for task levels - shared between Detail and Maps tabs
  const [taskLevels, setTaskLevels] = useState<TaskLevel[]>([createEmptyTaskLevel(1)]);

  // Fetch draft info on mount (only for HQ users)
  const isHQUser = currentUser?.job_grade?.startsWith('G') || false;

  useEffect(() => {
    if (isHQUser) {
      getDraftInfo()
        .then(setDraftInfo)
        .catch((err) => {
          console.error('Failed to fetch draft info:', err);
        });
    }
  }, [isHQUser]);

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

    taskLevels.forEach((tl, index) => {
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
    // Check draft limit before saving (frontend check)
    if (isHQUser && draftInfo && !draftInfo.can_create_draft) {
      showToast(
        `You have reached the maximum limit of ${draftInfo.max_drafts} drafts. Please complete or delete existing drafts before creating new ones.`,
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

      // Prepare task data for API
      const taskData = {
        task_name: rootTask.name,
        task_description: rootTask.instructions.note || undefined,
        status_id: STATUS_DRAFT_ID, // DRAFT status
        start_date: rootTask.taskInformation.applicablePeriod.startDate || undefined,
        end_date: rootTask.taskInformation.applicablePeriod.endDate || undefined,
        priority: 'normal',
      };

      // Call API to create task
      await createTask(taskData);

      showToast('Task saved as draft successfully', 'success');
      router.push('/tasks/list');
    } catch (error: unknown) {
      console.error('Error saving draft:', error);

      // Handle draft limit exceeded error from backend
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 422) {
        const apiError = error as { response?: { data?: { message?: string; error?: string; current_drafts?: number; max_drafts?: number } } };
        if (apiError.response?.data?.error) {
          showToast(apiError.response.data.error, 'error');
          // Refresh draft info
          if (isHQUser) {
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

  const handleSubmit = async (taskLevels: TaskLevel[]) => {
    setIsSubmitting(true);

    // TODO: Replace with actual API call and validation
    console.log('Submitting task:', taskLevels);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    showToast('Task submitted successfully', 'success');
    router.push('/tasks/list');
  };

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
          <span className="text-gray-900 dark:text-white font-medium">Add task</span>
        </div>

        {/* Draft limit indicator for HQ users */}
        {isHQUser && draftInfo && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            draftInfo.remaining_drafts === 0
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : draftInfo.remaining_drafts <= 2
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Drafts: {draftInfo.current_drafts}/{draftInfo.max_drafts}</span>
          </div>
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
          canCreateDraft={!isHQUser || !draftInfo || draftInfo.can_create_draft}
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
