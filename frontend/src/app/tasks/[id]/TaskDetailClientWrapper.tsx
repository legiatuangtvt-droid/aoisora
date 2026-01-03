'use client';

import TaskDetailClient from './TaskDetailClient';

interface TaskDetailClientWrapperProps {
  taskId: string;
}

/**
 * Client-side wrapper for TaskDetailClient
 * Handles the client-side rendering for static export
 */
export default function TaskDetailClientWrapper({ taskId }: TaskDetailClientWrapperProps) {
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
