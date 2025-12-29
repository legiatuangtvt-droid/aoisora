'use client';

import { useState } from 'react';
import { mockTaskGroups } from '@/data/mockTasks';
import { getMockTaskDetail } from '@/data/mockTaskDetail';
import { ViewMode } from '@/types/tasks';
import Link from 'next/link';
import StoreResultCard from '@/components/tasks/StoreResultCard';

interface TaskDetailClientProps {
  taskId: string;
}

/**
 * Task Detail Client Component
 * Displays detailed information for a specific task
 */
export default function TaskDetailClient({ taskId }: TaskDetailClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('results');

  // Find the task by ID from task list
  const task = mockTaskGroups.find(t => t.id === taskId);

  // Get detailed task data
  const taskDetail = getMockTaskDetail(`task-${taskId}`);

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

  const handleAddComment = (storeId: string, content: string) => {
    console.log('Add comment to store:', storeId, content);
    // TODO: Implement API call
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {task.startDate} &rarr; {task.endDate}
                </span>
                <span className="flex items-center gap-1 text-[#C5055B]">
                  HQ Check: {taskDetail?.hqCheckCode || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  Task type: Image
                </span>
                <Link href="#" className="text-[#C5055B] hover:underline">
                  Manual link
                </Link>
              </div>
            </div>

            {/* HQ Check Status */}
            <div className="text-right">
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
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-400">{taskDetail?.stats.notStarted || 0}</div>
              <div className="text-sm text-gray-500">Not Started</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-green-600">{taskDetail?.stats.completed || task.progress.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-orange-600">{taskDetail?.stats.unableToComplete || task.unable}</div>
              <div className="text-sm text-gray-500">Unable to Complete</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-600">{taskDetail?.stats.avgCompletionTime || 60}min</div>
              <div className="text-sm text-gray-500">Avg. Completion Time</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Dropdowns */}
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option>Region</option>
                <option>The North</option>
                <option>The South</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option>Area</option>
                <option>Ocean area</option>
                <option>Mountain area</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option>Store</option>
                <option>Store: 30</option>
                <option>Store: 31</option>
              </select>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-64"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('results')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'results'
                    ? 'bg-[#C5055B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Results
              </button>
              <button
                onClick={() => setViewMode('comment')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'comment'
                    ? 'bg-[#C5055B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Comment
              </button>
            </div>
          </div>
        </div>

        {/* Store Results */}
        {viewMode === 'results' && taskDetail && (
          <div className="space-y-6">
            {taskDetail.storeResults.length > 0 ? (
              taskDetail.storeResults.map((result) => (
                <StoreResultCard
                  key={result.id}
                  result={result}
                  showImages={true}
                  onAddComment={handleAddComment}
                />
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-500">No store results yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Comment View */}
        {viewMode === 'comment' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Comments</h3>
            <p className="text-gray-500">Comment view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
