import { mockTaskGroups } from '@/data/mockTasks';
import TaskDetailClient from './TaskDetailClient';

/**
 * Generate static params for all tasks
 * Required for Next.js static export with dynamic routes
 */
export function generateStaticParams() {
  return mockTaskGroups.map((task) => ({
    id: task.id,
  }));
}

/**
 * Task Detail page
 * Server component wrapper for static export
 * Route: /tasks/[id]
 */
export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return <TaskDetailClient taskId={params.id} />;
}
