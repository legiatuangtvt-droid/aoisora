import TaskDetailClient from './TaskDetailClient';

// Generate static params for static export
// Pre-render common task IDs, others handled client-side
export function generateStaticParams() {
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

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return <TaskDetailClient taskId={params.id} />;
}
