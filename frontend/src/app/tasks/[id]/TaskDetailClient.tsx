'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getTaskById, getDepartments } from '@/lib/api';
import { Task as ApiTask, Department } from '@/types/api';
import { getMockTaskDetail } from '@/data/mockTaskDetail';
import { ViewMode, TaskGroup } from '@/types/tasks';
import Link from 'next/link';
import StoreResultCard from '@/components/tasks/StoreResultCard';
import ViewModeToggle from '@/components/tasks/ViewModeToggle';

interface TaskDetailClientProps {
  taskId: string;
}

/**
 * Task Detail Client Component
 * Displays detailed information for a specific task
 */
export default function TaskDetailClient({ taskId }: TaskDetailClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('results');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [task, setTask] = useState<TaskGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for scroll preservation
  const scrollPositions = useRef<Record<ViewMode, number>>({
    results: 0,
    comment: 0,
    staff: 0,
  });
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch task from API
  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [apiTask, departments] = await Promise.all([
          getTaskById(Number(taskId)),
          getDepartments()
        ]);

        // Transform API task to TaskGroup format
        const dept = departments.find((d: Department) => d.department_id === apiTask.dept_id);
        const deptCode = dept?.department_code || dept?.department_name?.substring(0, 3).toUpperCase() || 'N/A';

        const formatDate = (dateStr: string | null): string => {
          if (!dateStr) return '--/--';
          const date = new Date(dateStr);
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        };

        const STATUS_MAP: Record<number, 'NOT_YET' | 'DRAFT' | 'DONE'> = {
          7: 'NOT_YET',
          8: 'DRAFT',
          9: 'DONE',
        };

        const transformedTask: TaskGroup = {
          id: apiTask.task_id.toString(),
          no: 1,
          dept: deptCode,
          deptId: apiTask.dept_id,
          taskGroupName: apiTask.task_name,
          startDate: formatDate(apiTask.start_date),
          endDate: formatDate(apiTask.end_date),
          progress: {
            completed: apiTask.status_id === 9 ? 1 : 0,
            total: 1,
          },
          unable: 0,
          status: STATUS_MAP[apiTask.status_id || 7] || 'NOT_YET',
          hqCheck: STATUS_MAP[apiTask.status_id || 7] || 'NOT_YET',
        };

        setTask(transformedTask);
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // Get detailed task data (still using mock for now as detail API not ready)
  const taskDetail = getMockTaskDetail(`task-${taskId}`);

  // Calculate counts for badges
  const resultsCount = taskDetail?.storeResults.length || 0;
  const commentsCount = taskDetail?.storeResults.reduce(
    (acc, store) => acc + store.comments.length,
    0
  ) || 0;

  // Save scroll position before view change
  const saveScrollPosition = useCallback(() => {
    if (contentRef.current) {
      scrollPositions.current[viewMode] = contentRef.current.scrollTop;
    }
  }, [viewMode]);

  // Restore scroll position after view change
  const restoreScrollPosition = useCallback((mode: ViewMode) => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPositions.current[mode];
    }
  }, []);

  // Handle view mode change with animation
  const handleViewModeChange = useCallback((newMode: ViewMode) => {
    if (newMode === viewMode || isTransitioning) return;

    // Save current scroll position
    saveScrollPosition();

    // Start fade out
    setIsTransitioning(true);
    setIsContentVisible(false);

    // After fade out, switch view and fade in
    setTimeout(() => {
      setViewMode(newMode);

      // Small delay to allow DOM update
      setTimeout(() => {
        restoreScrollPosition(newMode);
        setIsContentVisible(true);
        setIsTransitioning(false);
      }, 50);
    }, 150); // Match CSS transition duration
  }, [viewMode, isTransitioning, saveScrollPosition, restoreScrollPosition]);

  // Save scroll position on scroll
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      scrollPositions.current[viewMode] = content.scrollTop;
    };

    content.addEventListener('scroll', handleScroll, { passive: true });
    return () => content.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5055B] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading task...</p>
        </div>
      </div>
    );
  }

  // Error or task not found
  if (error || !task) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Task not found</h1>
          <p className="text-gray-500 mb-6">{error || `Cannot find task with ID: ${taskId}`}</p>
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
      <div className="p-4">
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
          <div className="flex items-stretch gap-6">
            {/* Left - Task Info */}
            <div className="flex-shrink-0 min-w-[320px] flex flex-col justify-between">
              {/* Top: Task Level, Name, Date, HQ Check */}
              <div>
                {/* Task Level Badge */}
                <span className="text-[#C5055B] text-sm font-medium">
                  Task level 1
                </span>

                {/* Task Name */}
                <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-2">
                  {task.taskGroupName}
                </h1>

                {/* Date and HQ Check */}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{task.startDate} - {task.endDate}</span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    HQ Check: {taskDetail?.hqCheckCode || '27/27'}
                  </span>
                </div>
              </div>

              {/* Task Type, Manual Link and User Icon - Same Row */}
              <div className="flex items-center gap-4 text-sm">
                {/* Task Type */}
                <span className="flex items-center gap-1.5 text-gray-600">
                  {taskDetail?.taskType === 'yes_no' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  Task type: {taskDetail?.taskType === 'yes_no' ? 'Yes/No' : taskDetail?.taskType === 'image' ? 'Image' : taskDetail?.taskType || 'Image'}
                </span>

                {/* Manual Link */}
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
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
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
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
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
            {/* Left - Dropdowns with badges */}
            <div className="flex items-center gap-3">
              {/* Region Dropdown */}
              <div className="relative">
                <select className="appearance-none pl-3 pr-16 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                  <option>Region</option>
                  <option>The North</option>
                  <option>The South</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                  4
                </div>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Area Dropdown */}
              <div className="relative">
                <select className="appearance-none pl-3 pr-16 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                  <option>Area</option>
                  <option>Ocean area</option>
                  <option>Mountain area</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                  7
                </div>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Store Dropdown */}
              <div className="relative">
                <select className="appearance-none pl-3 pr-16 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                  <option>Store</option>
                  <option>Store: 30</option>
                  <option>Store: 31</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                  30
                </div>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Right - View Mode Toggle */}
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              resultsCount={resultsCount}
              commentsCount={commentsCount}
              isLoading={isTransitioning}
            />
          </div>
        </div>

        {/* Content Area with Fade Animation */}
        <div
          ref={contentRef}
          className={`transition-opacity duration-150 ease-in-out ${isContentVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {/* Store Results */}
          {viewMode === 'results' && taskDetail && (
            <div className="space-y-6">
              {taskDetail.storeResults.length > 0 ? (
                taskDetail.storeResults.map((result) => (
                  <StoreResultCard
                    key={result.id}
                    result={result}
                    showImages={true}
                    taskType={taskDetail.taskType}
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

          {/* Comment View - Uses StoreResultCard with viewMode="comment" */}
          {viewMode === 'comment' && taskDetail && (
            <div className="space-y-6">
              {taskDetail.storeResults.length > 0 ? (
                taskDetail.storeResults.map((result) => (
                  <StoreResultCard
                    key={result.id}
                    result={result}
                    viewMode="comment"
                    taskType={taskDetail.taskType}
                    onAddComment={handleAddComment}
                  />
                ))
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-500">No comments yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
