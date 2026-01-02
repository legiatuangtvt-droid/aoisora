'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TaskLevel } from '@/types/addTask';
import { createEmptyTaskLevel } from '@/data/mockAddTask';
import AddTaskForm from '@/components/tasks/add/AddTaskForm';
import TaskMapsTab from '@/components/tasks/add/TaskMapsTab';
import { useToast } from '@/components/ui/Toast';

type TabType = 'detail' | 'maps';

export default function NewTaskPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Lifted state for task levels - shared between Detail and Maps tabs
  const [taskLevels, setTaskLevels] = useState<TaskLevel[]>([createEmptyTaskLevel(1)]);

  // Add sub-level handler for Maps tab
  const handleAddSubLevel = useCallback((parentId: string) => {
    const parent = taskLevels.find((tl) => tl.id === parentId);
    if (!parent || parent.level >= 5) return;

    const newTaskLevel = createEmptyTaskLevel(parent.level + 1, parentId);
    setTaskLevels((prev) => [...prev, newTaskLevel]);
  }, [taskLevels]);

  const handleSaveDraft = async (taskLevels: TaskLevel[]) => {
    setIsSavingDraft(true);

    // TODO: Replace with actual API call
    console.log('Saving draft:', taskLevels);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSavingDraft(false);
    showToast('Task saved as draft successfully', 'success');
    router.push('/tasks/list');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
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
          />
        ) : (
          <TaskMapsTab
            taskLevels={taskLevels}
            onAddSubLevel={handleAddSubLevel}
          />
        )}
      </div>
    </div>
  );
}
