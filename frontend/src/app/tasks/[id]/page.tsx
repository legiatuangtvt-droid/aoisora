import { mockTaskGroups } from '@/data/mockTasks';
import TaskDetailClient from './TaskDetailClient';

// Required for static export - generate all possible task IDs
export function generateStaticParams() {
  return mockTaskGroups.map((task) => ({
    id: task.id,
  }));
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return <TaskDetailClient taskId={params.id} />;
}
