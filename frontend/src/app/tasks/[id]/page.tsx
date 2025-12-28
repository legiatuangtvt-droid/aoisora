'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TaskGroup } from '@/types/tasks';
import { mockTaskGroups } from '@/data/mockTasks';
import StatusPill from '@/components/ui/StatusPill';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<TaskGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find task from mock data (replace with API call later)
    const foundTask = mockTaskGroups.find(t => t.id === taskId);
    setTask(foundTask || null);
    setLoading(false);
  }, [taskId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h1>
          <p className="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/tasks/list')}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            style={{ backgroundColor: '#C5055B' }}
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/tasks/list')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
        </div>

        {/* Task Header Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-500">#{task.no}</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{task.dept.charAt(0)}</span>
                  </div>
                  <span className="font-medium text-gray-900">{task.dept}</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{task.taskGroupName}</h1>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={task.status} />
              <StatusPill status={task.hqCheck} />
            </div>
          </div>

          {/* Task Meta Info */}
          <div className="grid grid-cols-4 gap-6 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-medium text-gray-900">{task.startDate} → {task.endDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(task.progress.completed / task.progress.total) * 100}%` }}
                  ></div>
                </div>
                <span className="font-medium text-gray-900">
                  {task.progress.completed}/{task.progress.total}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Unable</p>
              <p className="font-medium text-gray-900">{task.unable}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <StatusPill status={task.status} />
            </div>
          </div>
        </div>

        {/* Sub Tasks */}
        {task.subTasks && task.subTasks.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-pink-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Sub Tasks ({task.subTasks.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {task.subTasks.map((subTask, index) => (
                <div key={subTask.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">{index + 1}.</span>
                      <span className="text-gray-900">{subTask.name}</span>
                      {subTask.assignee && (
                        <span className="text-sm text-gray-500">({subTask.assignee})</span>
                      )}
                    </div>
                    <StatusPill status={subTask.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Sub Tasks */}
        {(!task.subTasks || task.subTasks.length === 0) && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">No sub tasks available</p>
          </div>
        )}
      </div>
    </div>
  );
}
