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

        {/* Task Header - New Design */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Left - Task Info */}
            <div className="flex-shrink-0 min-w-[320px]">
              {/* Task Level Badge */}
              <span className="text-[#C5055B] text-sm font-medium">
                Task level 1
              </span>

              {/* Task Name */}
              <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-2">
                {task.taskGroupName}
              </h1>

              {/* Date and HQ Check */}
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span>{task.startDate} - {task.endDate}</span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  HQ Check: {taskDetail?.hqCheckCode || '27/27'}
                </span>
              </div>

              {/* Task Type, Manual Link and User Icon - Same Row */}
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Task type: Image
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-gray-600">Manual link:</span>
                  <Link href="#" className="text-[#C5055B] hover:underline">
                    link
                  </Link>
                </span>
                {/* User Icon */}
                <div className="inline-flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full ml-2">
                  <svg className="w-5 h-5 text-[#C5055B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right - Statistics Cards */}
            <div className="flex-1 grid grid-cols-4 gap-4">
              {/* Not Started */}
              <div className="border border-gray-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{taskDetail?.stats.notStarted || 10}</div>
                <div className="text-sm text-gray-500">Not Started</div>
              </div>

              {/* Completed */}
              <div className="border-2 border-green-400 rounded-xl p-4 text-center bg-green-50/30">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{taskDetail?.stats.completed || task.progress.completed}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>

              {/* Unable to Complete */}
              <div className="border-2 border-red-400 rounded-xl p-4 text-center bg-red-50/30">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{taskDetail?.stats.unableToComplete || task.unable}</div>
                <div className="text-sm text-gray-500">Unable to Complete</div>
              </div>

              {/* Average Completion Time */}
              <div className="border-2 border-yellow-400 rounded-xl p-4 text-center bg-yellow-50/30">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {taskDetail?.stats.avgCompletionTime || 60}<span className="text-xl">min</span>
                </div>
                <div className="text-sm text-gray-500">Average Completion Time</div>
              </div>
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
