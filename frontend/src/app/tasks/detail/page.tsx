'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTaskById, getDepartments, getTasks, getTaskProgress, getTaskComments, createTaskComment, updateTaskComment, deleteTaskComment, TaskComment, getTaskImages, TaskImage, startStoreTask } from '@/lib/api';
import { Task as ApiTask, Department, TaskProgressResponse, TaskStoreAssignment, Store } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { ViewMode, TaskGroup } from '@/types/tasks';
import Link from 'next/link';
import ViewModeToggle from '@/components/tasks/ViewModeToggle';
import { TaskDetailPageSkeleton } from '@/components/ui/Skeleton';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useToast } from '@/components/ui/Toast';

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
  const [originalTask, setOriginalTask] = useState<ApiTask | null>(null);  // Keep original task for instruction_type and manual_link
  const [taskProgress, setTaskProgress] = useState<TaskProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWorkflowPanelOpen, setIsWorkflowPanelOpen] = useState(false);

  // Comments state
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  // Evidence images state
  const [taskImages, setTaskImages] = useState<TaskImage[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<{ storeId: number; storeName: string; images: TaskImage[] } | null>(null);

  // Store task action states
  const [startingStoreId, setStartingStoreId] = useState<number | null>(null);

  // Get current user
  const { user } = useAuth();
  const { showToast } = useToast();

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
        const [apiTask, departments, progressData] = await Promise.all([
          getTaskById(Number(taskId)),
          getDepartments(),
          getTaskProgress(Number(taskId)).catch(() => null) // Progress data is optional
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

        // Use progress data if available, otherwise fall back to task status
        const progress = progressData?.progress;
        const transformedTask: TaskGroup = {
          id: apiTask.task_id.toString(),
          no: 1,
          dept: deptCode,
          deptId: apiTask.dept_id,
          taskGroupName: apiTask.task_name,
          startDate: formatDate(apiTask.start_date),
          endDate: formatDate(apiTask.end_date),
          progress: progress ? {
            completed: progress.completed_count,
            total: progress.total,
          } : {
            completed: apiTask.status_id === 9 ? 1 : 0,
            total: 1,
          },
          unable: progress?.unable || 0,
          status: progressData?.calculated_status?.toUpperCase() as TaskGroup['status'] ||
                  STATUS_MAP[apiTask.status_id || 7] || 'NOT_YET',
          hqCheck: STATUS_MAP[apiTask.status_id || 7] || 'NOT_YET',
        };

        setTask(transformedTask);
        setOriginalTask(apiTask);  // Save original task for instruction_type and manual_link
        setTaskProgress(progressData);
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // Fetch comments when taskId changes
  useEffect(() => {
    if (!taskId) return;

    const fetchComments = async () => {
      try {
        const response = await getTaskComments(Number(taskId));
        if (response.success) {
          setComments(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      }
    };

    fetchComments();
  }, [taskId]);

  // Fetch evidence images when taskId changes
  useEffect(() => {
    if (!taskId) return;

    const fetchImages = async () => {
      try {
        const response = await getTaskImages(Number(taskId));
        if (response.success) {
          setTaskImages(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch task images:', err);
      }
    };

    fetchImages();
  }, [taskId]);

  // Group images by store_result_id for easy lookup
  const imagesByAssignment = useMemo(() => {
    const map = new Map<number, TaskImage[]>();
    taskImages.forEach((img) => {
      if (img.store_result_id) {
        const existing = map.get(img.store_result_id) || [];
        map.set(img.store_result_id, [...existing, img]);
      }
    });
    return map;
  }, [taskImages]);

  // Open evidence viewer for a specific store
  const openEvidenceViewer = (assignmentId: number, storeName: string) => {
    const images = imagesByAssignment.get(assignmentId) || [];
    setSelectedEvidence({ storeId: assignmentId, storeName, images });
  };

  // Calculate counts for badges using real data from taskProgress
  const resultsCount = taskProgress?.assignments?.length || 0;
  const commentsCount = comments.length;

  // Sort store assignments:
  // 1. User's store (current user's store) - always first
  // 2. not_yet/on_progress (chưa hoàn thành) - second
  // 3. unable (không hoàn thành được) - third
  // 4. done_pending/done (đã hoàn thành) - last, sorted by completion time
  const sortedAssignments = useMemo(() => {
    if (!taskProgress?.assignments) return [];

    const userStoreId = user?.storeId;

    const getStatusPriority = (status: TaskStoreAssignment['status']): number => {
      switch (status) {
        case 'not_yet':
        case 'on_progress':
          return 1; // Highest priority - show first
        case 'unable':
          return 2; // Second priority
        case 'done_pending':
        case 'done':
          return 3; // Lowest priority - show last
        default:
          return 4;
      }
    };

    return [...taskProgress.assignments].sort((a, b) => {
      // First: User's store always comes first
      const aIsUserStore = userStoreId && a.store_id === userStoreId;
      const bIsUserStore = userStoreId && b.store_id === userStoreId;

      if (aIsUserStore && !bIsUserStore) return -1;
      if (!aIsUserStore && bIsUserStore) return 1;

      // Then sort by status priority
      const priorityA = getStatusPriority(a.status);
      const priorityB = getStatusPriority(b.status);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // For completed stores, sort by completion time (earlier completion goes to bottom)
      if ((a.status === 'done' || a.status === 'done_pending') &&
          (b.status === 'done' || b.status === 'done_pending')) {
        const timeA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
        const timeB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
        return timeB - timeA;
      }

      return 0;
    });
  }, [taskProgress?.assignments, user?.storeId]);

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
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
            <p className="text-gray-500 dark:text-gray-400">Redirecting to task list...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
        <TaskDetailPageSkeleton />
      </div>
    );
  }

  // Loading state - Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
        <TaskDetailPageSkeleton />
      </div>
    );
  }

  // Error or task not found
  if (error || !task) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Task not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error || `Cannot find task with ID: ${taskId}`}</p>
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

  // Comment handlers
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !taskId) return;

    setIsSubmittingComment(true);
    try {
      const response = await createTaskComment(Number(taskId), newComment.trim());
      if (response.success) {
        setComments((prev) => [response.data, ...prev]);
        setNewComment('');
        showToast('Comment added', 'success');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      showToast(err instanceof Error ? err.message : 'Failed to add comment', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editingContent.trim() || !taskId) return;

    try {
      const response = await updateTaskComment(Number(taskId), commentId, editingContent.trim());
      if (response.success) {
        setComments((prev) =>
          prev.map((c) => (c.comment_id === commentId ? response.data : c))
        );
        setEditingCommentId(null);
        setEditingContent('');
        showToast('Comment updated', 'success');
      }
    } catch (err) {
      console.error('Failed to edit comment:', err);
      showToast(err instanceof Error ? err.message : 'Failed to update comment', 'error');
    }
  };

  const handleDeleteCommentClick = (commentId: number) => {
    setDeleteCommentId(commentId);
  };

  const handleDeleteCommentConfirm = async () => {
    if (!taskId || !deleteCommentId) return;

    setIsDeletingComment(true);
    try {
      const response = await deleteTaskComment(Number(taskId), deleteCommentId);
      if (response.success) {
        setComments((prev) => prev.filter((c) => c.comment_id !== deleteCommentId));
        showToast('Comment deleted', 'success');
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      showToast(err instanceof Error ? err.message : 'Failed to delete comment', 'error');
    } finally {
      setIsDeletingComment(false);
      setDeleteCommentId(null);
    }
  };

  // Handle Start Task action
  const handleStartTask = async (storeId: number) => {
    if (!taskId) return;

    setStartingStoreId(storeId);
    try {
      await startStoreTask(Number(taskId), storeId);
      showToast('Task started successfully', 'success');
      // Refresh task progress to update UI
      const progressData = await getTaskProgress(Number(taskId));
      setTaskProgress(progressData);
    } catch (err) {
      console.error('Failed to start task:', err);
      showToast(err instanceof Error ? err.message : 'Failed to start task', 'error');
    } finally {
      setStartingStoreId(null);
    }
  };

  const startEditingComment = (comment: TaskComment) => {
    setEditingCommentId(comment.comment_id);
    setEditingContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const formatCommentDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="p-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/tasks/list" className="text-gray-500 dark:text-gray-400 hover:text-[#C5055B]">
                List task
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-500">&rarr;</li>
            <li className="text-gray-900 dark:text-white font-medium">Detail</li>
          </ol>
        </nav>

        {/* Task Header - New Design */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-6">
            {/* Left - Task Info */}
            <div className="flex-shrink-0 lg:min-w-[320px] flex flex-col justify-between">
              {/* Top: Task Level, Name, Date, HQ Check */}
              <div>
                {/* Task Level Badge */}
                <span className="text-[#C5055B] text-sm font-medium">
                  Task level 1
                </span>

                {/* Task Name */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 mb-2">
                  {task.taskGroupName}
                </h1>

                {/* Date and HQ Check */}
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>{task.startDate} - {task.endDate}</span>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    HQ Check: {taskProgress ? `${taskProgress.progress.done + taskProgress.progress.done_pending}/${taskProgress.progress.total}` : '0/0'}
                  </span>
                </div>
              </div>

              {/* Task Type, Manual Link and User Icon - Same Row */}
              <div className="flex items-center gap-4 text-sm">
                {/* Task Type - Dynamic based on originalTask.task_instruction_type */}
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  {originalTask?.task_instruction_type === 'image' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  Task type: {originalTask?.task_instruction_type === 'image' ? 'Image' : originalTask?.task_instruction_type === 'document' ? 'Document' : '--'}
                </span>

                {/* Manual Link - Dynamic based on originalTask.manual_link */}
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Manual link:</span>
                  {originalTask?.manual_link ? (
                    <a href={originalTask.manual_link} target="_blank" rel="noopener noreferrer" className="text-[#C5055B] hover:underline">
                      link
                    </a>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </span>

                {/* User Check Icon - Opens Workflow Steps Panel */}
                <button
                  onClick={() => setIsWorkflowPanelOpen(true)}
                  className="inline-flex items-center justify-center w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full ml-2 hover:bg-pink-200 dark:hover:bg-pink-800/40 transition-colors cursor-pointer"
                  title="View Workflow Steps"
                >
                  <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3.25C3 2.65326 3.23705 2.08097 3.65901 1.65901C4.08097 1.23705 4.65326 1 5.25 1C5.84674 1 6.41903 1.23705 6.84099 1.65901C7.26295 2.08097 7.5 2.65326 7.5 3.25C7.5 3.84674 7.26295 4.41903 6.84099 4.84099C6.41903 5.26295 5.84674 5.5 5.25 5.5C4.65326 5.5 4.08097 5.26295 3.65901 4.84099C3.23705 4.41903 3 3.84674 3 3.25ZM5.25 0C4.38805 0 3.5614 0.34241 2.9519 0.951903C2.34241 1.5614 2 2.38805 2 3.25C2 4.11195 2.34241 4.9386 2.9519 5.5481C3.5614 6.15759 4.38805 6.5 5.25 6.5C6.11195 6.5 6.9386 6.15759 7.5481 5.5481C8.15759 4.9386 8.5 4.11195 8.5 3.25C8.5 2.38805 8.15759 1.5614 7.5481 0.951903C6.9386 0.34241 6.11195 0 5.25 0ZM0 9.5C0 8.96957 0.210714 8.46086 0.585786 8.08579C0.960859 7.71071 1.46957 7.5 2 7.5H8.5C8.84825 7.49972 9.19054 7.59037 9.493 7.763C9.21567 7.99367 8.963 8.24867 8.735 8.528C8.65805 8.5094 8.57917 8.5 8.5 8.5H2C1.73478 8.5 1.48043 8.60536 1.29289 8.79289C1.10536 8.98043 1 9.23478 1 9.5V9.578L1.007 9.661C1.06126 10.1404 1.23226 10.5991 1.505 10.997C1.992 11.701 3.013 12.5 5.25 12.5C6.204 12.5 6.937 12.355 7.502 12.133C7.51067 12.483 7.55067 12.823 7.622 13.153C6.976 13.37 6.195 13.5 5.25 13.5C2.737 13.5 1.383 12.58 0.682 11.566C0.312898 11.0282 0.0827143 10.4074 0.012 9.759C0.00629507 9.7008 0.0022934 9.64244 0 9.584V9.5ZM11.5 4C11.5 3.60218 11.658 3.22064 11.9393 2.93934C12.2206 2.65804 12.6022 2.5 13 2.5C13.3978 2.5 13.7794 2.65804 14.0607 2.93934C14.342 3.22064 14.5 3.60218 14.5 4C14.5 4.39782 14.342 4.77936 14.0607 5.06066C13.7794 5.34196 13.3978 5.5 13 5.5C12.6022 5.5 12.2206 5.34196 11.9393 5.06066C11.658 4.77936 11.5 4.39782 11.5 4ZM13 1.5C12.337 1.5 11.7011 1.76339 11.2322 2.23223C10.7634 2.70107 10.5 3.33696 10.5 4C10.5 4.66304 10.7634 5.29893 11.2322 5.76777C11.7011 6.23661 12.337 6.5 13 6.5C13.663 6.5 14.2989 6.23661 14.7678 5.76777C15.2366 5.29893 15.5 4.66304 15.5 4C15.5 3.33696 15.2366 2.70107 14.7678 2.23223C14.2989 1.76339 13.663 1.5 13 1.5ZM17.5 12C17.5 13.1935 17.0259 14.3381 16.182 15.182C15.3381 16.0259 14.1935 16.5 13 16.5C11.8065 16.5 10.6619 16.0259 9.81802 15.182C8.97411 14.3381 8.5 13.1935 8.5 12C8.5 10.8065 8.97411 9.66193 9.81802 8.81802C10.6619 7.97411 11.8065 7.5 13 7.5C14.1935 7.5 15.3381 7.97411 16.182 8.81802C17.0259 9.66193 17.5 10.8065 17.5 12ZM15.354 10.146C15.3076 10.0994 15.2524 10.0625 15.1916 10.0373C15.1309 10.0121 15.0658 9.99911 15 9.99911C14.9342 9.99911 14.8691 10.0121 14.8084 10.0373C14.7476 10.0625 14.6924 10.0994 14.646 10.146L12 12.793L11.354 12.146C11.2601 12.0521 11.1328 11.9994 11 11.9994C10.8672 11.9994 10.7399 12.0521 10.646 12.146C10.5521 12.2399 10.4994 12.3672 10.4994 12.5C10.4994 12.6328 10.5521 12.7601 10.646 12.854L11.646 13.854C11.6924 13.9006 11.7476 13.9375 11.8084 13.9627C11.8691 13.9879 11.9342 14.0009 12 14.0009C12.0658 14.0009 12.1309 13.9879 12.1916 13.9627C12.2524 13.9375 12.3076 13.9006 12.354 13.854L15.354 10.854C15.4006 10.8076 15.4375 10.7524 15.4627 10.6916C15.4879 10.6309 15.5009 10.5658 15.5009 10.5C15.5009 10.4342 15.4879 10.3691 15.4627 10.3084C15.4375 10.2476 15.4006 10.1924 15.354 10.146Z" fill="#C5055B"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Right - Statistics Cards */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Not Started */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {(taskProgress?.progress?.not_yet || 0) + (taskProgress?.progress?.on_progress || 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Not Started</div>
              </div>

              {/* Completed */}
              <div className="border-2 border-green-400 dark:border-green-500 rounded-xl p-4 text-center bg-green-50/30 dark:bg-green-900/20">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {taskProgress?.progress?.done || task.progress.completed}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
              </div>

              {/* Unable to Complete */}
              <div className="border-2 border-red-400 dark:border-red-500 rounded-xl p-4 text-center bg-red-50/30 dark:bg-red-900/20">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {taskProgress?.progress?.unable || task.unable}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Unable to Complete</div>
              </div>

              {/* Average Completion Time */}
              <div className="border-2 border-yellow-400 dark:border-yellow-500 rounded-xl p-4 text-center bg-yellow-50/30 dark:bg-yellow-900/20">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {taskProgress?.avg_execution_time_minutes || 0}<span className="text-xl">min</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Average Completion Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left - Dropdowns with badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Region Dropdown */}
              <div className="relative">
                <select className="appearance-none pl-3 pr-16 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Region</option>
                  <option>The North</option>
                  <option>The South</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
                  4
                </div>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Area Dropdown */}
              <div className="relative">
                <select className="appearance-none pl-3 pr-16 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Area</option>
                  <option>Ocean area</option>
                  <option>Mountain area</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
                  7
                </div>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Store Dropdown */}
              <div className="relative">
                <select className="appearance-none pl-3 pr-16 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Store</option>
                  <option>Store: 30</option>
                  <option>Store: 31</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
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
          {/* Store Results Cards */}
          {viewMode === 'results' && (
            <div className="space-y-4">
              {sortedAssignments.length > 0 ? (
                sortedAssignments.map((assignment) => {
                  const images = imagesByAssignment.get(assignment.id) || [];
                  const isDocumentType = originalTask?.task_instruction_type === 'document';
                  const isImageType = originalTask?.task_instruction_type === 'image';

                  // Format dates - HH:MM DD Mon YYYY
                  const formatDateTime = (dateStr: string | null | undefined) => {
                    if (!dateStr) return '--:-- -- --- ----';
                    const date = new Date(dateStr);
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const month = months[date.getMonth()];
                    const year = date.getFullYear();
                    return `${hours}:${minutes} ${day} ${month} ${year}`;
                  };

                  // Use assignment dates - show null if not started/completed yet
                  // Start time: only show when task has been started (started_at is set)
                  // End time: only show when task has been completed (completed_at is set)
                  const startDate = assignment.started_at;
                  const endDate = assignment.completed_at;

                  // Status color mapping for badge
                  const getStatusStyle = (status: string) => {
                    switch (status) {
                      case 'done':
                        return { bg: 'bg-[#10B981]/10', border: 'border-[#10B981]', text: 'text-[#10B981]', dot: 'bg-[#10B981]' };
                      case 'done_pending':
                        return { bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' };
                      case 'on_progress':
                        return { bg: 'bg-[#297EF6]/10', border: 'border-[#297EF6]', text: 'text-[#297EF6]', dot: 'bg-[#297EF6]' };
                      case 'unable':
                        return { bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' };
                      case 'not_yet':
                        return { bg: 'bg-[#990000]/10', border: 'border-[#B30000]', text: 'text-[#990000]', dot: 'bg-[#990000]' };
                      default:
                        return { bg: 'bg-[#6B7280]/10', border: 'border-[#6B7280]', text: 'text-[#6B7280]', dot: 'bg-[#6B7280]' };
                    }
                  };

                  // Card background and border based on status
                  const getCardStyle = (status: string) => {
                    if (status === 'not_yet') {
                      return {
                        background: 'rgba(153, 0, 0, 0.05)',
                        border: '0.5px solid #990000'
                      };
                    }
                    return {
                      background: 'rgba(41, 126, 246, 0.05)',
                      border: '0.5px solid #297EF6'
                    };
                  };

                  const cardStyle = getCardStyle(assignment.status);

                  const statusStyle = getStatusStyle(assignment.status);
                  const statusLabel = assignment.status === 'done' ? 'Done' :
                                     assignment.status === 'done_pending' ? 'Pending' :
                                     assignment.status === 'on_progress' ? 'Progress' :
                                     assignment.status === 'unable' ? 'Unable' : 'Not Yet';

                  // Check if this is the current user's store
                  const isUserStore = user?.storeId && assignment.store_id === user.storeId;

                  return (
                    <div
                      key={assignment.id}
                      className={`bg-white dark:bg-gray-800 rounded-[10px] overflow-hidden shadow-sm w-full ${
                        isUserStore ? 'ring-2 ring-[#C5055B] ring-offset-2' : ''
                      }`}
                    >
                      {/* Card Header - Light Pink Background (#FFE8E8) */}
                      <div className="bg-[#FFE8E8] dark:bg-gray-700 px-[10px] py-[10px]" style={{ borderRadius: '10px 10px 0 0' }}>
                        <div className="flex items-center justify-between">
                          {/* Left - Store Info */}
                          <div className="flex flex-col">
                            {/* Geographic Hierarchy - Region / Zone / Area */}
                            {(assignment.region_name || assignment.zone_name || assignment.area_name) && (
                              <div className="text-[11px] leading-[13px] text-[#536887] dark:text-gray-400 mb-0.5">
                                {[assignment.region_name, assignment.zone_name, assignment.area_name]
                                  .filter(Boolean)
                                  .join(' - ')}
                              </div>
                            )}
                            {/* Store Name with "Your Store" badge */}
                            <div className="flex items-center gap-2">
                              <h3 className="text-[20px] leading-[23px] font-bold text-black dark:text-white">
                                {assignment.store_name}
                              </h3>
                              {/* "Your Store" badge for current user's store */}
                              {isUserStore && (
                                <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-[#C5055B] rounded-full">
                                  Your Store
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right - Times and Menu */}
                          <div className="flex items-center gap-[15px]">
                            {/* Start Time */}
                            <div className="flex items-center gap-[7px]">
                              <span className="text-[11px] leading-[13px] font-bold text-[#536887]">Start</span>
                              <span className="text-[13px] leading-[15px] text-black dark:text-white">{formatDateTime(startDate)}</span>
                            </div>

                            {/* End Time */}
                            <div className="flex items-center gap-[4px]">
                              <span className="text-[11px] leading-[13px] font-bold text-[#0F766E]">End</span>
                              <span className="text-[13px] leading-[15px] text-black dark:text-white">{formatDateTime(endDate)}</span>
                            </div>

                            {/* 3-dots Kebab Menu */}
                            <button className="p-1 hover:bg-pink-200 dark:hover:bg-gray-600 rounded transition-colors">
                              <svg className="w-4 h-4 text-[#132B45] dark:text-gray-300" viewBox="0 0 16 16" fill="currentColor">
                                <circle cx="8" cy="2.5" r="1.5" />
                                <circle cx="8" cy="8" r="1.5" />
                                <circle cx="8" cy="13.5" r="1.5" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Content - Work Delivered Section */}
                      <div className="p-[10px]">
                        {/* Status-based Border Card */}
                        <div
                          className={`rounded-[10px] p-5 ${assignment.status === 'not_yet' ? 'dark:bg-red-900/10' : 'dark:bg-blue-900/10'}`}
                          style={cardStyle}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 flex flex-col gap-[5px]">
                              {/* Status Badge - Outline style with dot */}
                              <div
                                className={`inline-flex items-center gap-2 px-2 py-0 rounded-[26px] w-fit ${statusStyle.bg} ${statusStyle.text}`}
                                style={{ border: `0.5px solid currentColor`, height: '20px' }}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                <span className="text-[13px] leading-[15px]">{statusLabel}</span>
                              </div>

                              {/* Content for not_yet status - WORK NOT DELIVERED */}
                              {assignment.status === 'not_yet' && (
                                <>
                                  <h4 className="text-[24px] leading-[28px] font-bold text-[#990000]">
                                    WORK NOT DELIVERED
                                  </h4>
                                  {/* Show link for Document type, nothing for Image type */}
                                  {isDocumentType && originalTask?.manual_link && (
                                    <a
                                      href={originalTask.manual_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[15px] leading-[17px] italic underline text-[#297EF6] hover:opacity-80"
                                    >
                                      Link báo cáo
                                    </a>
                                  )}
                                </>
                              )}

                              {/* Content for done/done_pending status - WORK DELIVERED */}
                              {isDocumentType && (assignment.status === 'done' || assignment.status === 'done_pending') && (
                                <>
                                  <h4 className="text-[24px] leading-[28px] font-bold text-[#297EF6]">
                                    WORK DELIVERED
                                  </h4>
                                  {originalTask?.manual_link && (
                                    <a
                                      href={originalTask.manual_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[15px] leading-[17px] italic underline text-[#297EF6] hover:opacity-80"
                                    >
                                      Link báo cáo
                                    </a>
                                  )}
                                </>
                              )}

                              {isImageType && images.length > 0 && (
                                <>
                                  <h4 className="text-[24px] leading-[28px] font-bold text-[#297EF6]">
                                    EVIDENCE PHOTOS
                                  </h4>
                                  <div className="grid grid-cols-4 gap-2 mt-2">
                                    {images.slice(0, 4).map((img, idx) => (
                                      <button
                                        key={img.image_id}
                                        onClick={() => openEvidenceViewer(assignment.id, assignment.store_name)}
                                        className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                                      >
                                        <img
                                          src={img.thumbnail_url || img.image_url}
                                          alt={img.title || `Evidence ${idx + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                        {idx === 3 && images.length > 4 && (
                                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold">
                                            +{images.length - 4}
                                          </div>
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}

                              {/* Notes if any */}
                              {assignment.notes && (
                                <p className="text-[15px] leading-[17px] text-gray-600 dark:text-gray-400 mt-2">
                                  <span className="font-medium">Notes:</span> {assignment.notes}
                                </p>
                              )}

                              {/* Unable reason if status is unable */}
                              {assignment.status === 'unable' && assignment.unable_reason && (
                                <p className="text-[15px] leading-[17px] text-[#EF4444] mt-2">
                                  <span className="font-medium">Reason:</span> {assignment.unable_reason}
                                </p>
                              )}
                            </div>

                            {/* Like Section - Heart button + Avatars + Count */}
                            <div className="flex items-center gap-2">
                              {/* Like Button */}
                              <button
                                className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-[5px] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                style={{ background: '#F0F0F0', border: '0.5px solid #9B9B9B' }}
                              >
                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="#F8312F">
                                  <path d="M8 14.25l-1.45-1.32C3.1 10.02 1 8.07 1 5.68 1 3.79 2.49 2.25 4.3 2.25c1.04 0 2.04.49 2.7 1.26.66-.77 1.66-1.26 2.7-1.26C11.51 2.25 13 3.79 13 5.68c0 2.39-2.1 4.34-5.55 7.25L8 14.25z"/>
                                </svg>
                                <span className="text-[15px] leading-[17px] text-black dark:text-white">Like</span>
                              </button>

                              {/* Avatars Stack - TODO: Show actual likers */}
                              <div className="flex -space-x-2">
                                <div className="w-[30px] h-[30px] rounded-full bg-gray-300 border-2 border-white dark:border-gray-800"></div>
                                <div className="w-[30px] h-[30px] rounded-full bg-gray-400 border-2 border-white dark:border-gray-800"></div>
                              </div>

                              {/* Like Count */}
                              <span className="text-[13px] leading-[15px] text-[#6B6B6B]">2 likes</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comments Section */}
                      <div className="bg-white dark:bg-gray-800 px-[10px] pb-[10px]" style={{ borderRadius: '0 0 10px 10px' }}>
                        {/* Comments Header */}
                        <div className="flex items-center justify-between py-[10px]">
                          <h5 className="text-[18px] leading-[21px] font-bold text-black dark:text-white">
                            Comments (2)
                          </h5>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <svg className="w-5 h-5 text-black dark:text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12.5L10 7.5L15 12.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>

                        {/* Comment List */}
                        <div className="flex flex-col gap-[10px] px-[10px]">
                          {/* Comment Item 1 - Demo */}
                          <div className="flex items-start gap-[14px]">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-[#E5F0FF] flex items-center justify-center flex-shrink-0">
                              <span className="text-[15px] leading-[17px] font-bold text-[#003E95]">TS</span>
                            </div>
                            {/* Comment Bubble */}
                            <div
                              className="flex-1 py-2 px-5 dark:bg-gray-700"
                              style={{ border: '0.5px solid #9B9B9B', borderRadius: '0 10px 10px 10px' }}
                            >
                              <div className="flex items-end gap-[7px] mb-1">
                                <span className="text-[16px] leading-[18px] font-bold text-black dark:text-white">Tùng SM Ocean</span>
                                <span className="text-[13px] leading-[15px] text-[#6B6B6B]">Dec 01, 10:21 AM</span>
                              </div>
                              <p className="text-[16px] leading-[18px] text-black dark:text-white">
                                nhà cung cấp giao thiếu hoa nên chỉ có hình ABC.
                              </p>
                            </div>
                          </div>

                          {/* Comment Item 2 - Demo */}
                          <div className="flex items-start gap-[14px]">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-[#E5F0FF] flex items-center justify-center flex-shrink-0">
                              <span className="text-[15px] leading-[17px] font-bold text-[#003E95]">V</span>
                            </div>
                            {/* Comment Bubble */}
                            <div
                              className="flex-1 py-2 px-5 dark:bg-gray-700"
                              style={{ border: '0.5px solid #9B9B9B', borderRadius: '0 10px 10px 10px' }}
                            >
                              <div className="flex items-end gap-[5px] mb-1">
                                <span className="text-[16px] leading-[18px] font-bold text-black dark:text-white">Việt</span>
                                <span className="text-[13px] leading-[15px] text-[#6B6B6B]">Dec 01, 10:50 AM</span>
                              </div>
                              <p className="text-[16px] leading-[18px] text-black dark:text-white">
                                ok ntt đã báo MD xử lý tiếp.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Comment Input */}
                        <div className="px-[10px] pt-[10px]">
                          <div
                            className="flex items-center justify-between px-5 h-10 dark:bg-gray-700"
                            style={{ background: '#F4F4F4', border: '0.5px solid #9B9B9B', borderRadius: '10px' }}
                          >
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              className="flex-1 bg-transparent text-[16px] leading-[18px] text-black dark:text-white placeholder-[#6B6B6B] outline-none"
                            />
                            <button className="p-1 hover:opacity-70 transition-opacity">
                              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13" stroke="#C5055B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#C5055B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">No store assignments yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Comment View */}
          {viewMode === 'comment' && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              {/* Add Comment Form */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5055B] flex items-center justify-center text-white font-medium text-sm flex-shrink-0" aria-hidden="true">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="newComment" className="sr-only">Write a comment</label>
                    <textarea
                      id="newComment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      aria-label="Write a comment"
                      aria-describedby="newComment-hint"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5055B] focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p id="newComment-hint" className="text-xs text-gray-400 dark:text-gray-500">Press Post Comment to share your thoughts</p>
                      <button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || isSubmittingComment}
                        aria-busy={isSubmittingComment}
                        className="px-4 py-2 bg-[#C5055B] text-white rounded-lg hover:bg-[#A00449] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.comment_id} className="p-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium text-sm flex-shrink-0">
                          {comment.user?.staff_name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {comment.user?.staff_name || 'Unknown User'}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatCommentDate(comment.created_at)}
                              </span>
                            </div>
                            {user?.id === comment.user?.staff_id && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => startEditingComment(comment)}
                                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#C5055B] focus:ring-offset-1 dark:focus:ring-offset-gray-800"
                                  title="Edit"
                                  aria-label={`Edit comment by ${comment.user?.staff_name || 'you'}`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteCommentClick(comment.comment_id)}
                                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
                                  title="Delete"
                                  aria-label={`Delete comment by ${comment.user?.staff_name || 'you'}`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                          {editingCommentId === comment.comment_id ? (
                            <div className="mt-2">
                              <label htmlFor={`editComment-${comment.comment_id}`} className="sr-only">Edit comment</label>
                              <textarea
                                id={`editComment-${comment.comment_id}`}
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                aria-label="Edit comment"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5055B] focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={cancelEditing}
                                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleEditComment(comment.comment_id)}
                                  disabled={!editingContent.trim()}
                                  className="px-3 py-1.5 bg-[#C5055B] text-white rounded-lg hover:bg-[#A00449] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Steps Panel - TODO: Implement workflow steps API */}
      {isWorkflowPanelOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="workflow-panel-title">
          <div className="w-[400px] bg-white dark:bg-gray-800 h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 id="workflow-panel-title" className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Steps</h2>
              <button
                onClick={() => setIsWorkflowPanelOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Workflow steps coming soon.</p>
          </div>
        </div>
      )}

      {/* Evidence Viewer Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-75 dark:bg-opacity-85 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="evidence-modal-title">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700" id="evidence-modal-title">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Evidence - {selectedEvidence.storeName}
              </h3>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedEvidence.images.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No evidence uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedEvidence.images.map((image) => (
                    <div key={image.image_id} className="relative group">
                      <a
                        href={image.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={image.thumbnail_url || image.image_url}
                          alt={image.title || 'Evidence'}
                          className="w-full h-40 object-cover rounded-lg border dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </a>
                      <div className="mt-2">
                        {image.title && (
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{image.title}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {image.uploaded_at ? new Date(image.uploaded_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Unknown date'}
                        </p>
                        {image.uploaded_by && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            By: {image.uploaded_by.staff_name}
                          </p>
                        )}
                        {image.is_completed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-1">
                            Completion Evidence
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedEvidence.images.length} image{selectedEvidence.images.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Comment Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteCommentId !== null}
        onClose={() => setDeleteCommentId(null)}
        onConfirm={handleDeleteCommentConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletingComment}
      />
    </div>
  );
}
