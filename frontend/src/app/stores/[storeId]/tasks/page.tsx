'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getStoreTasks,
  getMyStoreTasks,
  startStoreTask,
  completeStoreTask,
  markStoreTaskUnable,
  assignTaskToStaff,
  unassignTask,
  StoreTaskAssignment,
  StoreTaskStatus,
} from '@/lib/api';
import { useUser } from '@/contexts/UserContext';

// Status badge colors
const getStatusColor = (status: StoreTaskStatus): string => {
  switch (status) {
    case 'not_yet':
      return 'bg-gray-100 text-gray-600';
    case 'on_progress':
      return 'bg-blue-100 text-blue-700';
    case 'done_pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'done':
      return 'bg-green-100 text-green-700';
    case 'unable':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// Status display labels
const getStatusLabel = (status: StoreTaskStatus): string => {
  switch (status) {
    case 'not_yet':
      return 'Not Started';
    case 'on_progress':
      return 'In Progress';
    case 'done_pending':
      return 'Pending Check';
    case 'done':
      return 'Completed';
    case 'unable':
      return 'Unable';
    default:
      return status;
  }
};

export default function StoreTasksPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useUser();

  const storeId = Number(params.storeId);

  // User role detection
  const jobGrade = currentUser?.job_grade || '';
  const isStoreLeader = ['S2', 'S3', 'S4'].includes(jobGrade);
  const isStaff = jobGrade === 'S1';
  const isStoreUser = jobGrade.startsWith('S');

  // State
  const [tasks, setTasks] = useState<StoreTaskAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StoreTaskStatus | 'all'>('all');

  // Action state
  const [processingTaskId, setProcessingTaskId] = useState<number | null>(null);
  const [showUnableModal, setShowUnableModal] = useState(false);
  const [unableTaskId, setUnableTaskId] = useState<number | null>(null);
  const [unableReason, setUnableReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!storeId) return;

    setIsLoading(true);
    setError(null);
    try {
      // Staff (S1) only see their assigned tasks, Leaders see all
      const response = isStaff
        ? await getMyStoreTasks(storeId, { per_page: 50 })
        : await getStoreTasks(storeId, { per_page: 50 });
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch store tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [storeId, isStaff]);

  useEffect(() => {
    if (isStoreUser) {
      fetchTasks();
    }
  }, [fetchTasks, isStoreUser]);

  // Filter tasks by status
  const filteredTasks = statusFilter === 'all'
    ? tasks
    : tasks.filter(t => t.status === statusFilter);

  // Handle start task
  const handleStart = async (taskId: number) => {
    setProcessingTaskId(taskId);
    setActionError(null);
    try {
      await startStoreTask(taskId, storeId);
      fetchTasks(); // Refresh list
    } catch (err) {
      console.error('Failed to start task:', err);
      setActionError(err instanceof Error ? err.message : 'Failed to start task');
    } finally {
      setProcessingTaskId(null);
    }
  };

  // Handle complete task
  const handleComplete = async (taskId: number) => {
    setProcessingTaskId(taskId);
    setActionError(null);
    try {
      await completeStoreTask(taskId, storeId);
      fetchTasks(); // Refresh list
    } catch (err) {
      console.error('Failed to complete task:', err);
      setActionError(err instanceof Error ? err.message : 'Failed to complete task');
    } finally {
      setProcessingTaskId(null);
    }
  };

  // Handle unable click
  const handleUnableClick = (taskId: number) => {
    setUnableTaskId(taskId);
    setUnableReason('');
    setShowUnableModal(true);
  };

  // Handle unable confirm
  const handleUnableConfirm = async () => {
    if (!unableTaskId || !unableReason.trim()) return;

    setProcessingTaskId(unableTaskId);
    setActionError(null);
    try {
      await markStoreTaskUnable(unableTaskId, storeId, unableReason.trim());
      fetchTasks(); // Refresh list
      setShowUnableModal(false);
      setUnableTaskId(null);
      setUnableReason('');
    } catch (err) {
      console.error('Failed to mark task unable:', err);
      setActionError(err instanceof Error ? err.message : 'Failed to mark task unable');
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

  // Check if user can act on task
  const canActOnTask = (task: StoreTaskAssignment): boolean => {
    if (isStoreLeader) return true;
    if (isStaff && task.assigned_to_staff_id === currentUser?.staff_id) return true;
    return false;
  };

  // Non-store user view
  if (!isStoreUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-gray-500">Only store users can access store tasks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Store Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isStaff ? 'Tasks assigned to you' : 'Tasks assigned to this store'} ({filteredTasks.length} tasks)
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm text-gray-600">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StoreTaskStatus | 'all')}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Statuses</option>
            <option value="not_yet">Not Started</option>
            <option value="on_progress">In Progress</option>
            <option value="done_pending">Pending Check</option>
            <option value="done">Completed</option>
            <option value="unable">Unable</option>
          </select>
        </div>

        {/* Action Error */}
        {actionError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{actionError}</p>
            <button onClick={() => setActionError(null)} className="mt-2 text-sm text-red-700 underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading tasks...</p>
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
        {!isLoading && !error && filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-sm">No tasks found</p>
            {statusFilter !== 'all' && (
              <button onClick={() => setStatusFilter('all')} className="mt-2 text-sm text-pink-600 underline">
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* Tasks Table */}
        {!isLoading && !error && filteredTasks.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assignment.task?.task_name || `Task #${assignment.task_id}`}</p>
                          <p className="text-xs text-gray-500">ID: {assignment.task_id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {getStatusLabel(assignment.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">
                          {assignment.assignedToStaff
                            ? `${assignment.assignedToStaff.first_name || ''} ${assignment.assignedToStaff.last_name || ''}`.trim()
                            : 'Store Leader'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">
                          {assignment.task?.start_date ? formatDate(assignment.task.start_date) : '-'} - {assignment.task?.end_date ? formatDate(assignment.task.end_date) : '-'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(assignment.task_id)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Start button (for not_yet status) */}
                          {assignment.status === 'not_yet' && canActOnTask(assignment) && (
                            <button
                              onClick={() => handleStart(assignment.task_id)}
                              disabled={processingTaskId === assignment.task_id}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                              title="Start Task"
                            >
                              {processingTaskId === assignment.task_id ? '...' : 'Start'}
                            </button>
                          )}

                          {/* Complete button (for on_progress status) */}
                          {assignment.status === 'on_progress' && canActOnTask(assignment) && (
                            <button
                              onClick={() => handleComplete(assignment.task_id)}
                              disabled={processingTaskId === assignment.task_id}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                              title="Complete Task"
                            >
                              {processingTaskId === assignment.task_id ? '...' : 'Complete'}
                            </button>
                          )}

                          {/* Unable button (for not_yet or on_progress status) */}
                          {['not_yet', 'on_progress'].includes(assignment.status) && canActOnTask(assignment) && (
                            <button
                              onClick={() => handleUnableClick(assignment.task_id)}
                              disabled={processingTaskId === assignment.task_id}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded disabled:opacity-50"
                              title="Mark Unable"
                            >
                              Unable
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Unable Modal */}
        {showUnableModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Task as Unable</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason why this task cannot be completed.
              </p>
              <textarea
                value={unableReason}
                onChange={(e) => setUnableReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                rows={4}
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowUnableModal(false);
                    setUnableTaskId(null);
                    setUnableReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnableConfirm}
                  disabled={!unableReason.trim() || processingTaskId === unableTaskId}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded disabled:opacity-50"
                >
                  {processingTaskId === unableTaskId ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
