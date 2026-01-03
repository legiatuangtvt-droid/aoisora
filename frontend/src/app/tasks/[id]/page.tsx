import TaskDetailClient from './TaskDetailClient';

/**
 * Task Detail page
 * Route: /tasks/[id]
 * Uses dynamic rendering to fetch task from API
 */
export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return <TaskDetailClient taskId={params.id} />;
}
