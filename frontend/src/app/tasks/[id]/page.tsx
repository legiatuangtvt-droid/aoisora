import TaskDetailClientWrapper from './TaskDetailClientWrapper';

/**
 * Required for static export - pre-generate pages for known task IDs
 * Add more IDs as needed for static generation
 */
export function generateStaticParams() {
  // Pre-generate pages for task IDs 1-10
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
  ];
}

/**
 * Task Detail page
 * Route: /tasks/[id]
 */
export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return <TaskDetailClientWrapper taskId={params.id} />;
}
