'use client';

import { useParams } from 'next/navigation';
import { mockTaskGroups } from '@/data/mockTasks';
import Link from 'next/link';

/**
 * Task Detail page
 * Displays detailed information for a specific task
 * Route: /tasks/[id]
 */
export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;

  // Find the task by ID
  const task = mockTaskGroups.find(t => t.id === taskId);

  if (!task) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Task not found</h1>
          <p className="text-gray-500 mb-6">Cannot find task with ID: {taskId}</p>
          <Link
            href="/tasks/list"
            className="inline-flex items-center px-4 py-2 bg-[#C5055B] text-white rounded-lg hover:bg-[#A00449] transition-colors"
          >
            Back to list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/tasks/list" className="text-gray-500 hover:text-[#C5055B]">
                List task
              </Link>
            </li>
            <li className="text-gray-400">&rarr;</li>
            <li className="text-gray-900 font-medium">Detail</li>
          </ol>
        </nav>

        {/* Task Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              {/* Task Level Badge */}
              <span className="inline-block px-3 py-1 bg-pink-100 text-[#C5055B] text-sm font-medium rounded-full mb-3">
                Task level 1
              </span>

              {/* Task Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {task.taskGroupName}
              </h1>

              {/* Task Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {task.startDate} &rarr; {task.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {task.dept}
                </span>
              </div>
            </div>

            {/* HQ Check Status */}
            <div className="text-right">
              <span className="text-sm text-gray-500 block mb-1">HQ Check</span>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                task.hqCheck === 'DONE' ? 'bg-blue-100 text-blue-700' :
                task.hqCheck === 'DRAFT' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {task.hqCheck === 'DONE' ? 'Done' : task.hqCheck === 'DRAFT' ? 'Draft' : 'Not Yet'}
              </span>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">{task.progress.total}</div>
              <div className="text-sm text-gray-500">Total Staff</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-400">{task.progress.total - task.progress.completed - task.unable}</div>
              <div className="text-sm text-gray-500">Not Started</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{task.progress.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{task.unable}</div>
              <div className="text-sm text-gray-500">Unable</div>
            </div>
          </div>
        </div>

        {/* Placeholder for Results View */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <button className="px-4 py-2 bg-[#C5055B] text-white rounded-lg text-sm font-medium">
              Results
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              Comment
            </button>
          </div>

          {/* Sub-tasks List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Sub-tasks</h3>
            {task.subTasks && task.subTasks.length > 0 ? (
              <div className="space-y-2">
                {task.subTasks.map((subTask) => (
                  <div
                    key={subTask.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        subTask.status === 'DONE' ? 'bg-blue-500' :
                        subTask.status === 'DRAFT' ? 'bg-green-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-gray-900">{subTask.name}</span>
                      {subTask.assignee && (
                        <span className="text-sm text-gray-500">({subTask.assignee})</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      subTask.status === 'DONE' ? 'bg-blue-100 text-blue-700' :
                      subTask.status === 'DRAFT' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {subTask.status === 'DONE' ? 'Done' : subTask.status === 'DRAFT' ? 'Draft' : 'Not Yet'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No sub-tasks.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
