'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TaskLevel } from '@/types/addTask';
import AddTaskForm from '@/components/tasks/add/AddTaskForm';
import { useToast } from '@/components/ui/Toast';

type TabType = 'detail' | 'maps';

export default function NewTaskPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

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

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
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

        {/* Tab Content */}
        {activeTab === 'detail' ? (
          <AddTaskForm
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSavingDraft={isSavingDraft}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              Task hierarchy map will be displayed here
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Add task levels in the Detail tab to see the hierarchy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
