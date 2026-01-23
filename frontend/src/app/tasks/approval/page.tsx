'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getPendingApprovals, approveTask, rejectTask, Task } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { ApprovalPageSkeleton } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/ui/ErrorBoundary';
import { SuccessEmptyState } from '@/components/ui/EmptyState';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { useToast } from '@/components/ui/Toast';

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    case 'approve':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  }
};

export default function ApprovalPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const isHQUser = currentUser?.job_grade?.startsWith('G') || false;

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action state
  const [processingTaskId, setProcessingTaskId] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTaskId, setRejectTaskId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch pending approval tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPendingApprovals({ per_page: 50 });
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch pending approval tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isHQUser) {
      fetchTasks();
    }
  }, [fetchTasks, isHQUser]);

  // Handle approve
  const handleApprove = async (taskId: number) => {
    setProcessingTaskId(taskId);
    setActionError(null);
    try {
      await approveTask(taskId);
      showToast('Task approved and dispatched to stores', 'success');
      // Remove task from list after approval
      setTasks(prev => prev.filter(t => t.task_id !== taskId));
    } catch (err) {
      console.error('Failed to approve task:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to approve task';
      setActionError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setProcessingTaskId(null);
    }
  };

  // Handle reject button click
  const handleRejectClick = (taskId: number) => {
    setRejectTaskId(taskId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Handle reject confirm
  const handleRejectConfirm = async () => {
    if (!rejectTaskId || !rejectReason.trim()) return;

    setProcessingTaskId(rejectTaskId);
    setActionError(null);
    try {
      await rejectTask(rejectTaskId, rejectReason.trim());
      showToast('Task rejected and returned to creator', 'success');
      // Remove task from list after rejection
      setTasks(prev => prev.filter(t => t.task_id !== rejectTaskId));
      setShowRejectModal(false);
      setRejectTaskId(null);
      setRejectReason('');
    } catch (err) {
      console.error('Failed to reject task:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to reject task';
      setActionError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setProcessingTaskId(null);
    }
  };

  // Handle view task detail
  const handleViewDetail = (taskId: number) => {
    router.push(`/tasks/detail?id=${taskId}`);
  };

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Non-HQ user view
  if (!isHQUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">Only HQ users can access pending approvals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Pending Approvals</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tasks awaiting your approval ({tasks.length} pending)
          </p>
        </div>

        {/* Action Error */}
        {actionError && (
          <ErrorDisplay
            title="Action Failed"
            message={actionError}
            onRetry={() => setActionError(null)}
            className="mb-4"
          />
        )}

        {/* Loading State - Skeleton */}
        {isLoading && <ApprovalPageSkeleton />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorDisplay
            title="Failed to load pending approvals"
            message={error}
            onRetry={fetchTasks}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && tasks.length === 0 && (
          <SuccessEmptyState
            title="No pending approvals"
            description="All tasks have been reviewed"
          />
        )}

        {/* Tasks Table */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ResponsiveTable>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Creator
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Period
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tasks.map((task, index) => (
                    <tr
                      key={task.task_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{task.task_name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {task.task_id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                            {task.created_staff?.staff_name?.[0] || 'U'}
                          </div>
                          <div className="ml-2">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {task.created_staff?.staff_name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{task.created_staff?.role || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{task.department?.department_name || '-'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(task.start_date)} - {formatDate(task.end_date)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status?.code || '')}`}>
                          {task.status?.name || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(task.task_id)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                            aria-label={`View details for task ${task.task_name}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleApprove(task.task_id)}
                            disabled={processingTaskId === task.task_id}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve"
                          >
                            {processingTaskId === task.task_id ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleRejectClick(task.task_id)}
                            disabled={processingTaskId === task.task_id}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ResponsiveTable>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="reject-modal-title">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 id="reject-modal-title" className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reject Task</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Please provide a reason for rejecting this task. The creator will be notified.
              </p>
              <textarea
                id="approvalRejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                aria-label="Rejection reason"
                aria-required="true"
                aria-invalid={!rejectReason.trim() ? 'true' : 'false'}
                aria-describedby="approvalRejectReason-hint"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                  !rejectReason.trim() ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                rows={4}
              />
              <p id="approvalRejectReason-hint" className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                A reason is required to reject this task
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectTaskId(null);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={!rejectReason.trim() || processingTaskId === rejectTaskId}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingTaskId === rejectTaskId ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
