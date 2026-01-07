'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTaskById, getDepartments, getTasks } from '@/lib/api';
import { Task as ApiTask, Department } from '@/types/api';
import { getMockTaskDetail } from '@/data/mockTaskDetail';
import { ViewMode, TaskGroup, StoreResult } from '@/types/tasks';
import Link from 'next/link';
import StoreResultCard from '@/components/tasks/StoreResultCard';
import ViewModeToggle from '@/components/tasks/ViewModeToggle';
import WorkflowStepsPanel from '@/components/tasks/WorkflowStepsPanel';

/**
 * Task Detail page
 * Route: /tasks/detail?id=X
 *
 * If no id is provided, redirects to the task with nearest deadline
 */
export default function TaskDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');

  const [viewMode, setViewMode] = useState<ViewMode>('results');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [task, setTask] = useState<TaskGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWorkflowPanelOpen, setIsWorkflowPanelOpen] = useState(false);

  // Refs for scroll preservation
  const scrollPositions = useRef<Record<ViewMode, number>>({
    results: 0,
    comment: 0,
    staff: 0,
  });
  const contentRef = useRef<HTMLDivElement>(null);

  // If no taskId, redirect to task with nearest deadline
  useEffect(() => {
    if (taskId) return; // Skip if taskId is provided

    const findAndRedirect = async () => {
      try {
        const response = await getTasks();
        const tasks = response.data || [];

        if (tasks.length === 0) {
          router.replace('/tasks/list');
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingTasks = tasks
          .filter((task: ApiTask) => {
            if (!task.end_date) return false;
            const endDate = new Date(task.end_date);
            return endDate >= today;
          })
          .sort((a: ApiTask, b: ApiTask) => {
            const dateA = new Date(a.end_date || '9999-12-31');
            const dateB = new Date(b.end_date || '9999-12-31');
            return dateA.getTime() - dateB.getTime();
          });

        if (upcomingTasks.length > 0) {
          router.replace(`/tasks/detail?id=${upcomingTasks[0].task_id}`);
        } else {
          router.replace(`/tasks/detail?id=${tasks[0].task_id}`);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
        setTimeout(() => router.replace('/tasks/list'), 2000);
      }
    };

    findAndRedirect();
  }, [taskId, router]);

  // Fetch task from API when taskId is available
  useEffect(() => {
    if (!taskId) return;

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
  const taskDetail = taskId ? getMockTaskDetail(`task-${taskId}`) : null;

  // Calculate counts for badges
  const resultsCount = taskDetail?.storeResults.length || 0;
  const commentsCount = taskDetail?.storeResults.reduce(
    (acc, store) => acc + store.comments.length,
    0
  ) || 0;

  // Sort store results by status priority:
  // 1. in_progress/not_started (chưa hoàn thành) - first
  // 2. failed (không hoàn thành được) - second
  // 3. success (đã hoàn thành) - last, sorted by completedTime ascending (earliest completion at bottom)
  const sortedStoreResults = useMemo(() => {
    if (!taskDetail?.storeResults) return [];

    const getStatusPriority = (status: StoreResult['status']): number => {
      switch (status) {
        case 'in_progress':
        case 'not_started':
          return 1; // Highest priority - show first
        case 'failed':
          return 2; // Second priority
        case 'success':
          return 3; // Lowest priority - show last
        default:
          return 4;
      }
    };

    const parseCompletedTime = (timeStr?: string): number => {
      if (!timeStr) return 0;
      // Parse formats like "17:00 03 Dec, 2025" or "17:00 03 Dec 2025"
      try {
        const normalized = timeStr.replace(',', '');
        const date = new Date(normalized);
        return isNaN(date.getTime()) ? 0 : date.getTime();
      } catch {
        return 0;
      }
    };

    return [...taskDetail.storeResults].sort((a, b) => {
      const priorityA = getStatusPriority(a.status);
      const priorityB = getStatusPriority(b.status);

      // First sort by status priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // For completed stores, sort by completion time (earlier completion goes to bottom)
      if (a.status === 'success' && b.status === 'success') {
        const timeA = parseCompletedTime(a.completedTime);
        const timeB = parseCompletedTime(b.completedTime);
        // Ascending order: earlier time = larger value = goes to bottom
        return timeB - timeA;
      }

      return 0;
    });
  }, [taskDetail?.storeResults]);

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

  // Show loading while finding task with nearest deadline
  if (!taskId) {
    if (error) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-gray-500">Redirecting to task list...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5055B] mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải task...</p>
        </div>
      </div>
    );
  }

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

                {/* User Check Icon - Opens Workflow Steps Panel */}
                <button
                  onClick={() => setIsWorkflowPanelOpen(true)}
                  className="inline-flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full ml-2 hover:bg-pink-200 transition-colors cursor-pointer"
                  title="View Workflow Steps"
                >
                  <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3.25C3 2.65326 3.23705 2.08097 3.65901 1.65901C4.08097 1.23705 4.65326 1 5.25 1C5.84674 1 6.41903 1.23705 6.84099 1.65901C7.26295 2.08097 7.5 2.65326 7.5 3.25C7.5 3.84674 7.26295 4.41903 6.84099 4.84099C6.41903 5.26295 5.84674 5.5 5.25 5.5C4.65326 5.5 4.08097 5.26295 3.65901 4.84099C3.23705 4.41903 3 3.84674 3 3.25ZM5.25 0C4.38805 0 3.5614 0.34241 2.9519 0.951903C2.34241 1.5614 2 2.38805 2 3.25C2 4.11195 2.34241 4.9386 2.9519 5.5481C3.5614 6.15759 4.38805 6.5 5.25 6.5C6.11195 6.5 6.9386 6.15759 7.5481 5.5481C8.15759 4.9386 8.5 4.11195 8.5 3.25C8.5 2.38805 8.15759 1.5614 7.5481 0.951903C6.9386 0.34241 6.11195 0 5.25 0ZM0 9.5C0 8.96957 0.210714 8.46086 0.585786 8.08579C0.960859 7.71071 1.46957 7.5 2 7.5H8.5C8.84825 7.49972 9.19054 7.59037 9.493 7.763C9.21567 7.99367 8.963 8.24867 8.735 8.528C8.65805 8.5094 8.57917 8.5 8.5 8.5H2C1.73478 8.5 1.48043 8.60536 1.29289 8.79289C1.10536 8.98043 1 9.23478 1 9.5V9.578L1.007 9.661C1.06126 10.1404 1.23226 10.5991 1.505 10.997C1.992 11.701 3.013 12.5 5.25 12.5C6.204 12.5 6.937 12.355 7.502 12.133C7.51067 12.483 7.55067 12.823 7.622 13.153C6.976 13.37 6.195 13.5 5.25 13.5C2.737 13.5 1.383 12.58 0.682 11.566C0.312898 11.0282 0.0827143 10.4074 0.012 9.759C0.00629507 9.7008 0.0022934 9.64244 0 9.584V9.5ZM11.5 4C11.5 3.60218 11.658 3.22064 11.9393 2.93934C12.2206 2.65804 12.6022 2.5 13 2.5C13.3978 2.5 13.7794 2.65804 14.0607 2.93934C14.342 3.22064 14.5 3.60218 14.5 4C14.5 4.39782 14.342 4.77936 14.0607 5.06066C13.7794 5.34196 13.3978 5.5 13 5.5C12.6022 5.5 12.2206 5.34196 11.9393 5.06066C11.658 4.77936 11.5 4.39782 11.5 4ZM13 1.5C12.337 1.5 11.7011 1.76339 11.2322 2.23223C10.7634 2.70107 10.5 3.33696 10.5 4C10.5 4.66304 10.7634 5.29893 11.2322 5.76777C11.7011 6.23661 12.337 6.5 13 6.5C13.663 6.5 14.2989 6.23661 14.7678 5.76777C15.2366 5.29893 15.5 4.66304 15.5 4C15.5 3.33696 15.2366 2.70107 14.7678 2.23223C14.2989 1.76339 13.663 1.5 13 1.5ZM17.5 12C17.5 13.1935 17.0259 14.3381 16.182 15.182C15.3381 16.0259 14.1935 16.5 13 16.5C11.8065 16.5 10.6619 16.0259 9.81802 15.182C8.97411 14.3381 8.5 13.1935 8.5 12C8.5 10.8065 8.97411 9.66193 9.81802 8.81802C10.6619 7.97411 11.8065 7.5 13 7.5C14.1935 7.5 15.3381 7.97411 16.182 8.81802C17.0259 9.66193 17.5 10.8065 17.5 12ZM15.354 10.146C15.3076 10.0994 15.2524 10.0625 15.1916 10.0373C15.1309 10.0121 15.0658 9.99911 15 9.99911C14.9342 9.99911 14.8691 10.0121 14.8084 10.0373C14.7476 10.0625 14.6924 10.0994 14.646 10.146L12 12.793L11.354 12.146C11.2601 12.0521 11.1328 11.9994 11 11.9994C10.8672 11.9994 10.7399 12.0521 10.646 12.146C10.5521 12.2399 10.4994 12.3672 10.4994 12.5C10.4994 12.6328 10.5521 12.7601 10.646 12.854L11.646 13.854C11.6924 13.9006 11.7476 13.9375 11.8084 13.9627C11.8691 13.9879 11.9342 14.0009 12 14.0009C12.0658 14.0009 12.1309 13.9879 12.1916 13.9627C12.2524 13.9375 12.3076 13.9006 12.354 13.854L15.354 10.854C15.4006 10.8076 15.4375 10.7524 15.4627 10.6916C15.4879 10.6309 15.5009 10.5658 15.5009 10.5C15.5009 10.4342 15.4879 10.3691 15.4627 10.3084C15.4375 10.2476 15.4006 10.1924 15.354 10.146Z" fill="#C5055B"/>
                  </svg>
                </button>
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
          {/* Store Results - sorted by: in_progress -> failed -> success (by completion time) */}
          {viewMode === 'results' && taskDetail && (
            <div className="space-y-6">
              {sortedStoreResults.length > 0 ? (
                sortedStoreResults.map((result) => (
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
              {sortedStoreResults.length > 0 ? (
                sortedStoreResults.map((result) => (
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

      {/* Workflow Steps Panel */}
      {taskDetail && (
        <WorkflowStepsPanel
          steps={taskDetail.workflowSteps}
          isOpen={isWorkflowPanelOpen}
          onClose={() => setIsWorkflowPanelOpen(false)}
        />
      )}
    </div>
  );
}
