'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks } from '@/lib/api';
import { Task } from '@/types/api';

/**
 * Task Detail page without ID
 * Redirects to the task with nearest deadline
 */
export default function TaskDetailRedirectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const findAndRedirect = async () => {
      try {
        // Fetch all tasks from API
        const tasks = await getTasks();

        if (tasks.length === 0) {
          // No tasks at all, redirect to task list
          router.replace('/tasks/list');
          return;
        }

        // Get current date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter tasks with end_date >= today (not yet expired)
        // Then sort by end_date ascending (nearest deadline first)
        const upcomingTasks = tasks
          .filter((task: Task) => {
            if (!task.end_date) return false;
            const endDate = new Date(task.end_date);
            return endDate >= today;
          })
          .sort((a: Task, b: Task) => {
            const dateA = new Date(a.end_date || '9999-12-31');
            const dateB = new Date(b.end_date || '9999-12-31');
            return dateA.getTime() - dateB.getTime();
          });

        if (upcomingTasks.length > 0) {
          // Redirect to task with nearest deadline
          router.replace(`/tasks/${upcomingTasks[0].task_id}`);
        } else {
          // If no upcoming tasks, redirect to first task in list
          router.replace(`/tasks/${tasks[0].task_id}`);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
        // Fallback to task list on error
        setTimeout(() => router.replace('/tasks/list'), 2000);
      }
    };

    findAndRedirect();
  }, [router]);

  // Show error if any
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-gray-500">Redirecting to task list...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5055B] mx-auto mb-4"></div>
        <p className="text-gray-500">Đang tải task...</p>
      </div>
    </div>
  );
}
