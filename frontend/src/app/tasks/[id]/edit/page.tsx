'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * DEPRECATED: This page has been merged into /tasks/new
 *
 * This file now redirects to the unified Add Task screen with edit mode.
 * The unified screen handles both create and edit modes via query params:
 * - Create mode: /tasks/new?source=task_list
 * - Edit mode: /tasks/new?id=123&source=task_list
 */

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTaskPageRedirect({ params }: EditTaskPageProps) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified Add Task screen with edit mode
    // Default to task_list source since this was originally from the task list flow
    router.replace(`/tasks/new?id=${id}&source=task_list`);
  }, [id, router]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 dark:text-gray-400">Redirecting...</span>
      </div>
    </div>
  );
}
