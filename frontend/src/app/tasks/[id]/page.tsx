import TaskDetailClientWrapper from './TaskDetailClientWrapper';

/**
 * Required for static export - returns empty array to allow client-side routing
 * The actual task ID will be read client-side using useParams()
 */
export function generateStaticParams() {
  return [];
}

/**
 * Task Detail page
 * Route: /tasks/[id]
 */
export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return <TaskDetailClientWrapper taskId={params.id} />;
}
