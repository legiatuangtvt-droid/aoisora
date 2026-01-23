'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getHQCheckList, hqCheckStoreTask, hqRejectStoreTask, TaskWithHQCheck } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { HQCheckPageSkeleton } from '@/components/ui/Skeleton';
import { ErrorDisplay, InlineError } from '@/components/ui/ErrorBoundary';
import { SuccessEmptyState } from '@/components/ui/EmptyState';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { useToast } from '@/components/ui/Toast';

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'done_pending':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'done':
      return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    case 'on_progress':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  }
};

export default function HQCheckPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const isHQUser = currentUser?.job_grade?.startsWith('G') || false;

  // State
  const [tasks, setTasks] = useState<TaskWithHQCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action state
  const [processingStore, setProcessingStore] = useState<{ taskId: number; storeId: number } | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectInfo, setRejectInfo] = useState<{ taskId: number; storeId: number; storeName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Expanded task state
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  // Fetch HQ check tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getHQCheckList({ per_page: 50 });
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch HQ check tasks:', err);
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

  // Toggle task expansion
  const toggleExpand = (taskId: number) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Handle approve (HQ Check)
  const handleApprove = async (taskId: number, storeId: number) => {
    setProcessingStore({ taskId, storeId });
    setActionError(null);
    try {
      await hqCheckStoreTask(taskId, storeId);
      showToast('Store task verified successfully', 'success');
      // Refresh to update the list
      await fetchTasks();
    } catch (err) {
      console.error('Failed to approve store task:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to approve';
      setActionError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setProcessingStore(null);
    }
  };

  // Handle reject button click
  const handleRejectClick = (taskId: number, storeId: number, storeName: string) => {
    setRejectInfo({ taskId, storeId, storeName });
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Handle reject confirm
  const handleRejectConfirm = async () => {
    if (!rejectInfo || !rejectReason.trim()) return;

    setProcessingStore({ taskId: rejectInfo.taskId, storeId: rejectInfo.storeId });
    setActionError(null);
    try {
      await hqRejectStoreTask(rejectInfo.taskId, rejectInfo.storeId, rejectReason.trim());
      showToast(`${rejectInfo.storeName} task rejected. Store will redo the task.`, 'success');
      setShowRejectModal(false);
      setRejectInfo(null);
      setRejectReason('');
      // Refresh to update the list
      await fetchTasks();
    } catch (err) {
      console.error('Failed to reject store task:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to reject';
      setActionError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setProcessingStore(null);
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

  // Format datetime
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Non-HQ user view
  if (!isHQUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">Only HQ users can access HQ Check.</p>
        </div>
      </div>
    );
  }

  // Count total pending stores
  const totalPendingStores = tasks.reduce((sum, task) => sum + task.hq_check_summary.pending_check, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">HQ Check</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Store task completions awaiting your verification ({totalPendingStores} pending)
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
        {isLoading && <HQCheckPageSkeleton />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorDisplay
            title="Failed to load pending verifications"
            message={error}
            onRetry={fetchTasks}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && tasks.length === 0 && (
          <SuccessEmptyState
            title="No pending verifications"
            description="All store completions have been checked"
          />
        )}

        {/* Tasks List */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.task_id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Task Header */}
                <div
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => toggleExpand(task.task_id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{task.task_name}</h3>
                      <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                        {task.hq_check_summary.pending_check} pending
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID: {task.task_id} • Period: {formatDate(task.start_date)} - {formatDate(task.end_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(task.task_id);
                      }}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      aria-label={`View details for task ${task.task_name}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <svg
                      className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${expandedTasks.has(task.task_id) ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Store List */}
                {expandedTasks.has(task.task_id) && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <ResponsiveTable>
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Store
                            </th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Completed By
                            </th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Completed At
                            </th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Notes
                            </th>
                            <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {task.hq_check_summary.stores_pending_check.map((store) => (
                            <tr key={store.store_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{store.store_name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{store.store_code}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-900 dark:text-white">{store.completed_by_name || '-'}</p>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-900 dark:text-white">{formatDateTime(store.completed_at)}</p>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={store.completion_notes || ''}>
                                  {store.completion_notes || '-'}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleApprove(task.task_id, store.store_id)}
                                    disabled={processingStore?.taskId === task.task_id && processingStore?.storeId === store.store_id}
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Approve"
                                  >
                                    {processingStore?.taskId === task.task_id && processingStore?.storeId === store.store_id
                                      ? '...'
                                      : 'Check OK'}
                                  </button>
                                  <button
                                    onClick={() => handleRejectClick(task.task_id, store.store_id, store.store_name)}
                                    disabled={processingStore?.taskId === task.task_id && processingStore?.storeId === store.store_id}
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
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && rejectInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="reject-completion-title">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 id="reject-completion-title" className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reject Completion</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Reject completion from <span className="font-medium text-gray-700 dark:text-gray-200">{rejectInfo.storeName}</span>?
                The store will be notified and required to redo the task.
              </p>
              <textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason (required)..."
                aria-label="Rejection reason"
                aria-required="true"
                aria-invalid={!rejectReason.trim() ? 'true' : 'false'}
                aria-describedby="rejectReason-hint"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                  !rejectReason.trim() ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                rows={4}
              />
              <p id="rejectReason-hint" className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                A reason is required to reject this completion
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectInfo(null);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={!rejectReason.trim() || (processingStore?.taskId === rejectInfo.taskId && processingStore?.storeId === rejectInfo.storeId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingStore?.taskId === rejectInfo.taskId && processingStore?.storeId === rejectInfo.storeId
                    ? 'Rejecting...'
                    : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
