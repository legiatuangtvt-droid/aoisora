import TaskDetailClient from './TaskDetailClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Allow dynamic params for task IDs not generated at build time
export const dynamicParams = true;

/**
 * Generate static params for task detail pages
 * Fetches task IDs from API at build time
 * Falls back to empty array if API is unavailable (pages will be generated on-demand)
 */
export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      next: { revalidate: 60 }, // Cache for 60 seconds during build
    });

    if (!response.ok) {
      console.warn('Failed to fetch tasks for static generation, using empty params');
      return [];
    }

    const tasks = await response.json();
    return tasks.map((task: { task_id: number }) => ({
      id: String(task.task_id),
    }));
  } catch (error) {
    console.warn('Error fetching tasks for static generation:', error);
    // Return empty array - pages will be generated on-demand
    return [];
  }
}

/**
 * Task Detail page
 * Route: /tasks/[id]
 */
export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return <TaskDetailClient taskId={params.id} />;
}
