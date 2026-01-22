'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getPendingApprovals, approveTask, rejectTask, Task } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-600';
    case 'approve':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function ApprovalPage() {
  const router = useRouter();
  const { currentUser } = useUser();
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
      // Remove task from list after approval
      setTasks(prev => prev.filter(t => t.task_id !== taskId));
    } catch (err) {
      console.error('Failed to approve task:', err);
      setActionError(err instanceof Error ? err.message : 'Failed to approve task');
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
      // Remove task from list after rejection
      setTasks(prev => prev.filter(t => t.task_id !== rejectTaskId));
      setShowRejectModal(false);
      setRejectTaskId(null);
      setRejectReason('');
    } catch (err) {
      console.error('Failed to reject task:', err);
      setActionError(err instanceof Error ? err.message : 'Failed to reject task');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-gray-500">Only HQ users can access pending approvals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Pending Approvals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tasks awaiting your approval ({tasks.length} pending)
          </p>
        </div>

        {/* Action Error */}
        {actionError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{actionError}</p>
            <button
              onClick={() => setActionError(null)}
              className="mt-2 text-sm text-red-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading pending tasks...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg border border-red-200">
            <svg className="w-12 h-12 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={fetchTasks} className="mt-4 px-4 py-2 text-sm text-pink-600 hover:text-pink-700 underline">
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-sm">No pending approvals</p>
            <p className="text-gray-400 text-xs mt-1">All tasks have been reviewed</p>
          </div>
        )}

        {/* Tasks Table */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.task_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.task_name}</p>
                          <p className="text-xs text-gray-500">ID: {task.task_id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                            {task.created_staff?.staff_name?.[0] || 'U'}
                          </div>
                          <div className="ml-2">
                            <p className="text-sm text-gray-900">
                              {task.created_staff?.staff_name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">{task.created_staff?.role || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{task.department?.department_name || '-'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{formatDate(task.start_date)} - {formatDate(task.end_date)}</p>
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
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Task</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for rejecting this task. The creator will be notified.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectTaskId(null);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
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
