'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockTaskGroups } from '@/data/mockTasks';

/**
 * Task Detail page without ID
 * Redirects to the task with nearest deadline
 */
export default function TaskDetailRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Parse date string (DD/MM format) to Date object
    const parseTaskDate = (dateStr: string): Date => {
      const [day, month] = dateStr.split('/').map(Number);
      const year = new Date().getFullYear();
      return new Date(year, month - 1, day);
    };

    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter tasks with endDate >= today (not yet expired)
    // Then sort by endDate ascending (nearest deadline first)
    const upcomingTasks = mockTaskGroups
      .map(task => ({
        ...task,
        endDateParsed: parseTaskDate(task.endDate)
      }))
      .filter(task => task.endDateParsed >= today)
      .sort((a, b) => a.endDateParsed.getTime() - b.endDateParsed.getTime());

    if (upcomingTasks.length > 0) {
      // Redirect to task with nearest deadline
      router.replace(`/tasks/${upcomingTasks[0].id}`);
    } else {
      // If no upcoming tasks, redirect to first task in list
      if (mockTaskGroups.length > 0) {
        router.replace(`/tasks/${mockTaskGroups[0].id}`);
      } else {
        // No tasks at all, redirect to task list
        router.replace('/tasks/list');
      }
    }
  }, [router]);

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
