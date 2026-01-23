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
  getStoreStaff,
  StoreTaskAssignment,
  StoreTaskStatus,
  StoreStaffOption,
} from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { StoreTasksPageSkeleton } from '@/components/ui/Skeleton';
import { LoadingSpinner } from '@/components/ui/LoadingIndicator';
import { ErrorDisplay } from '@/components/ui/ErrorBoundary';
import { EmptyState } from '@/components/ui/EmptyState';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useToast } from '@/components/ui/Toast';

// Status badge colors
const getStatusColor = (status: StoreTaskStatus): string => {
  switch (status) {
    case 'not_yet':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    case 'on_progress':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'done_pending':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'done':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'unable':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
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
  const { showToast } = useToast();

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

  // Complete modal state (with evidence)
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeTaskId, setCompleteTaskId] = useState<number | null>(null);
  const [completeNotes, setCompleteNotes] = useState('');
  const [completeEvidence, setCompleteEvidence] = useState<string[]>([]);

  // Assign modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTaskId, setAssignTaskId] = useState<number | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [storeStaff, setStoreStaff] = useState<StoreStaffOption[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Unassign confirmation state
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false);
  const [unassignTaskId, setUnassignTaskId] = useState<number | null>(null);

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
      showToast('Task started successfully', 'success');
      fetchTasks(); // Refresh list
    } catch (err) {
      console.error('Failed to start task:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to start task';
      setActionError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setProcessingTaskId(null);
    }
  };

  // Handle complete click - open modal
  const handleCompleteClick = (taskId: number) => {
    setCompleteTaskId(taskId);
    setCompleteNotes('');
    setCompleteEvidence([]);
    setShowCompleteModal(true);
  };

  // Handle complete confirm
  const handleCompleteConfirm = async () => {
    if (!completeTaskId) return;

    setProcessingTaskId(completeTaskId);
    setActionError(null);
    try {
      await completeStoreTask(completeTaskId, storeId, {
        notes: completeNotes.trim() || undefined,
        evidence: completeEvidence.length > 0 ? completeEvidence : undefined,
      });
      showToast('Task marked as completed. Waiting for HQ verification.', 'success');
      fetchTasks(); // Refresh list
      setShowCompleteModal(false);
      setCompleteTaskId(null);
      setCompleteNotes('');
      setCompleteEvidence([]);
    } catch (err) {
      console.error('Failed to complete task:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to complete task';
      setActionError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setProcessingTaskId(null);
    }
  };

  // Handle add evidence URL
  const handleAddEvidence = (url: string) => {
    if (url.trim() && !completeEvidence.includes(url.trim())) {
      setCompleteEvidence([...completeEvidence, url.trim()]);
    }
  };

  // Handle remove evidence
  const handleRemoveEvidence = (index: number) => {
    setCompleteEvidence(completeEvidence.filter((_, i) => i !== index));
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
      showToast('Task marked as unable to complete', 'success');
      fetchTasks(); // Refresh list
      setShowUnableModal(false);
      setUnableTaskId(null);
      setUnableReason('');
    } catch (err) {
      console.error('Failed to mark task unable:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to mark task unable';
      setActionError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setProcessingTaskId(null);
    }
  };

  // Handle assign click - open modal and load staff
  const handleAssignClick = async (taskId: number) => {
    setAssignTaskId(taskId);
    setSelectedStaffId(null);
    setShowAssignModal(true);
    setLoadingStaff(true);
    try {
      const response = await getStoreStaff(storeId);
      // Only show S1 staff for assignment (not leaders)
      setStoreStaff(response.staff || []);
    } catch (err) {
      console.error('Failed to fetch store staff:', err);
      setActionError(err instanceof Error ? err.message : 'Failed to fetch staff list');
    } finally {
      setLoadingStaff(false);
    }
  };

  // Handle assign confirm
  const handleAssignConfirm = async () => {
    if (!assignTaskId || !selectedStaffId) return;

    setProcessingTaskId(assignTaskId);
    setActionError(null);
    try {
      await assignTaskToStaff(assignTaskId, storeId, selectedStaffId);
      const staff = storeStaff.find(s => s.id === selectedStaffId);
      showToast(`Task assigned to ${staff?.name || 'staff'}`, 'success');
      fetchTasks(); // Refresh list
      setShowAssignModal(false);
      setAssignTaskId(null);
      setSelectedStaffId(null);
      setStoreStaff([]);
    } catch (err) {
      console.error('Failed to assign task:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to assign task';
      setActionError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setProcessingTaskId(null);
    }
  };

  // Handle unassign click - open confirmation
  const handleUnassignClick = (taskId: number) => {
    setUnassignTaskId(taskId);
    setShowUnassignConfirm(true);
  };

  // Handle unassign confirm
  const handleUnassignConfirm = async () => {
    if (!unassignTaskId) return;

    setShowUnassignConfirm(false);
    setProcessingTaskId(unassignTaskId);
    setActionError(null);
    try {
      await unassignTask(unassignTaskId, storeId);
      showToast('Task unassigned from staff', 'success');
      fetchTasks(); // Refresh list
    } catch (err) {
      console.error('Failed to unassign task:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to unassign task';
      setActionError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setProcessingTaskId(null);
      setUnassignTaskId(null);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">Only store users can access store tasks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Store Tasks</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isStaff ? 'Tasks assigned to you' : 'Tasks assigned to this store'} ({filteredTasks.length} tasks)
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm text-gray-600 dark:text-gray-300">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StoreTaskStatus | 'all')}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          <ErrorDisplay
            title="Action Failed"
            message={actionError}
            onRetry={() => setActionError(null)}
            className="mb-4"
          />
        )}

        {/* Loading State - Skeleton */}
        {isLoading && <StoreTasksPageSkeleton />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorDisplay
            title="Failed to load store tasks"
            message={error}
            onRetry={fetchTasks}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredTasks.length === 0 && (
          <EmptyState
            icon="tasks"
            title="No tasks found"
            action={statusFilter !== 'all' ? {
              label: 'Clear filter',
              onClick: () => setStatusFilter('all'),
            } : undefined}
          />
        )}

        {/* Tasks Table */}
        {!isLoading && !error && filteredTasks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ResponsiveTable>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Task</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Assigned To</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dates</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTasks.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{assignment.task?.task_name || `Task #${assignment.task_id}`}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {assignment.task_id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {getStatusLabel(assignment.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {assignment.assignedToStaff
                            ? assignment.assignedToStaff.staff_name
                            : 'Store Leader'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {assignment.task?.start_date ? formatDate(assignment.task.start_date) : '-'} - {assignment.task?.end_date ? formatDate(assignment.task.end_date) : '-'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(assignment.task_id)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                            aria-label={`View details for task ${assignment.task?.task_name || assignment.task_id}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                              onClick={() => handleCompleteClick(assignment.task_id)}
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

                          {/* Assign button (for Store Leaders only, tasks without staff assigned) */}
                          {isStoreLeader && ['not_yet', 'on_progress'].includes(assignment.status) && !assignment.assigned_to_staff_id && (
                            <button
                              onClick={() => handleAssignClick(assignment.task_id)}
                              disabled={processingTaskId === assignment.task_id}
                              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                              title="Assign to Staff"
                            >
                              Assign
                            </button>
                          )}

                          {/* Unassign button (for Store Leaders only, tasks with staff assigned) */}
                          {isStoreLeader && ['not_yet', 'on_progress'].includes(assignment.status) && assignment.assigned_to_staff_id && (
                            <button
                              onClick={() => handleUnassignClick(assignment.task_id)}
                              disabled={processingTaskId === assignment.task_id}
                              className="px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded disabled:opacity-50"
                              title="Unassign"
                            >
                              Unassign
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ResponsiveTable>
          </div>
        )}

        {/* Unable Modal */}
        {showUnableModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="unable-modal-title">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 id="unable-modal-title" className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mark Task as Unable</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Please provide a reason why this task cannot be completed.
              </p>
              <textarea
                id="unableReason"
                value={unableReason}
                onChange={(e) => setUnableReason(e.target.value)}
                placeholder="Enter reason..."
                aria-label="Reason for unable to complete"
                aria-required="true"
                aria-invalid={!unableReason.trim() ? 'true' : 'false'}
                aria-describedby="unableReason-hint"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                  !unableReason.trim() ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                rows={4}
              />
              <p id="unableReason-hint" className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                A reason is required to mark this task as unable
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowUnableModal(false);
                    setUnableTaskId(null);
                    setUnableReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
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

        {/* Complete Modal (with evidence upload) */}
        {showCompleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="complete-modal-title">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
              <h3 id="complete-modal-title" className="text-lg font-medium text-gray-900 dark:text-white mb-4">Complete Task</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Add notes and evidence (optional) before marking as complete.
              </p>

              {/* Notes */}
              <div className="mb-4">
                <label htmlFor="completeNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  id="completeNotes"
                  value={completeNotes}
                  onChange={(e) => setCompleteNotes(e.target.value)}
                  placeholder="Add completion notes..."
                  aria-describedby="completeNotes-hint"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  rows={3}
                />
                <p id="completeNotes-hint" className="mt-1 text-xs text-gray-400 dark:text-gray-500">Optional notes about task completion</p>
              </div>

              {/* Evidence URLs */}
              <div className="mb-4">
                <label htmlFor="evidenceUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Evidence (Image URLs)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    id="evidenceUrl"
                    type="url"
                    placeholder="Paste image URL..."
                    aria-describedby="evidenceUrl-hint"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEvidence((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      handleAddEvidence(input.value);
                      input.value = '';
                    }}
                    className="px-3 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded"
                  >
                    Add
                  </button>
                </div>

                {/* Evidence list */}
                {completeEvidence.length > 0 && (
                  <ul className="space-y-2 max-h-32 overflow-y-auto" aria-label="Added evidence URLs">
                    {completeEvidence.map((url, index) => (
                      <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="flex-1 text-xs text-gray-600 dark:text-gray-300 truncate">{url}</span>
                        <button
                          onClick={() => handleRemoveEvidence(index)}
                          className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          aria-label={`Remove evidence ${index + 1}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p id="evidenceUrl-hint" className="text-xs text-gray-400 dark:text-gray-500 mt-1">Press Enter or click Add to add image URLs (optional)</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setCompleteTaskId(null);
                    setCompleteNotes('');
                    setCompleteEvidence([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteConfirm}
                  disabled={processingTaskId === completeTaskId}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                >
                  {processingTaskId === completeTaskId ? 'Processing...' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="assign-modal-title">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 id="assign-modal-title" className="text-lg font-medium text-gray-900 dark:text-white mb-4">Assign Task to Staff</h3>
              <p id="assign-modal-description" className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Select a staff member to assign this task to.
              </p>

              {loadingStaff ? (
                <div className="flex items-center justify-center py-8" aria-busy="true" aria-label="Loading staff list">
                  <LoadingSpinner size="md" color="pink" />
                </div>
              ) : storeStaff.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No staff members available</p>
                </div>
              ) : (
                <fieldset>
                  <legend className="sr-only">Select a staff member</legend>
                  <div
                    className="space-y-2 max-h-60 overflow-y-auto mb-4"
                    role="radiogroup"
                    aria-required="true"
                    aria-describedby="assign-modal-description"
                    aria-invalid={!selectedStaffId ? 'true' : 'false'}
                  >
                    {storeStaff.map((staff) => (
                      <label
                        key={staff.value}
                        className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors ${
                          selectedStaffId === Number(staff.value)
                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="staff"
                          value={staff.value}
                          checked={selectedStaffId === Number(staff.value)}
                          onChange={() => setSelectedStaffId(Number(staff.value))}
                          className="w-4 h-4 text-pink-600 focus:ring-pink-500 focus:ring-2"
                          aria-describedby={`staff-${staff.value}-info`}
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{staff.label}</p>
                          <p id={`staff-${staff.value}-info`} className="text-xs text-gray-500 dark:text-gray-400">
                            {staff.job_grade} {staff.position ? `- ${staff.position}` : ''}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {!loadingStaff && storeStaff.length > 0 && !selectedStaffId && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-4">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Please select a staff member to assign the task
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignTaskId(null);
                    setSelectedStaffId(null);
                    setStoreStaff([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignConfirm}
                  disabled={!selectedStaffId || processingTaskId === assignTaskId}
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingTaskId === assignTaskId ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unassign Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showUnassignConfirm}
          onClose={() => {
            setShowUnassignConfirm(false);
            setUnassignTaskId(null);
          }}
          onConfirm={handleUnassignConfirm}
          title="Unassign Task"
          message="Are you sure you want to unassign this task? The task will be returned to you (Store Leader) for reassignment or self-completion."
          confirmText="Unassign"
          cancelText="Cancel"
          variant="warning"
          isLoading={processingTaskId === unassignTaskId}
        />
      </div>
    </div>
  );
}
