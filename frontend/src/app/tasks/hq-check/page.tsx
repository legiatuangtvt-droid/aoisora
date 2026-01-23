'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getHQCheckList, hqCheckStoreTask, hqRejectStoreTask, TaskWithHQCheck } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { HQCheckPageSkeleton } from '@/components/ui/Skeleton';
import { ErrorDisplay, InlineError } from '@/components/ui/ErrorBoundary';

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'done_pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'done':
      return 'bg-green-100 text-green-600';
    case 'on_progress':
      return 'bg-blue-100 text-blue-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function HQCheckPage() {
  const router = useRouter();
  const { currentUser } = useUser();
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
      // Refresh to update the list
      await fetchTasks();
    } catch (err) {
      console.error('Failed to approve store task:', err);
      setActionError(err instanceof Error ? err.message : 'Failed to approve');
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
      setShowRejectModal(false);
      setRejectInfo(null);
      setRejectReason('');
      // Refresh to update the list
      await fetchTasks();
    } catch (err) {
      console.error('Failed to reject store task:', err);
      setActionError(err instanceof Error ? err.message : 'Failed to reject');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-gray-500">Only HQ users can access HQ Check.</p>
        </div>
      </div>
    );
  }

  // Count total pending stores
  const totalPendingStores = tasks.reduce((sum, task) => sum + task.hq_check_summary.pending_check, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">HQ Check</h1>
          <p className="mt-1 text-sm text-gray-500">
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
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-sm">No pending verifications</p>
            <p className="text-gray-400 text-xs mt-1">All store completions have been checked</p>
          </div>
        )}

        {/* Tasks List */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.task_id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Task Header */}
                <div
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(task.task_id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-medium text-gray-900">{task.task_name}</h3>
                      <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                        {task.hq_check_summary.pending_check} pending
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {task.task_id} • Period: {formatDate(task.start_date)} - {formatDate(task.end_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(task.task_id);
                      }}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      title="View Task Details"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedTasks.has(task.task_id) ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Store List */}
                {expandedTasks.has(task.task_id) && (
                  <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Store
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Completed By
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Completed At
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {task.hq_check_summary.stores_pending_check.map((store) => (
                            <tr key={store.store_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{store.store_name}</p>
                                  <p className="text-xs text-gray-500">{store.store_code}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-900">{store.completed_by_name || '-'}</p>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-900">{formatDateTime(store.completed_at)}</p>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-600 max-w-xs truncate" title={store.completion_notes || ''}>
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
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && rejectInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Completion</h3>
              <p className="text-sm text-gray-500 mb-4">
                Reject completion from <span className="font-medium">{rejectInfo.storeName}</span>?
                The store will be notified and required to redo the task.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason (required)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectInfo(null);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
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
