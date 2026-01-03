'use client';

import { useParams } from 'next/navigation';
import TaskDetailClient from './TaskDetailClient';

/**
 * Task Detail page
 * Route: /tasks/[id]
 * Uses client-side routing for static export compatibility
 */
export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params?.id as string;

  if (!taskId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5055B] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <TaskDetailClient taskId={taskId} />;
}
