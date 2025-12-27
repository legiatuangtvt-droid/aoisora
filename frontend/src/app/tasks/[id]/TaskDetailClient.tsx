'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getTaskById,
  updateTaskStatus,
  updateTaskChecklist,
  getCodeMaster,
} from '@/lib/api';
import type { Task, CodeMaster } from '@/types/api';
import { TASK_STATUS } from '@/types/api';

interface TaskDetailClientProps {
  taskId: string;
}

export default function TaskDetailClient({ taskId }: TaskDetailClientProps) {
  const router = useRouter();
  const parsedTaskId = parseInt(taskId);

  const [task, setTask] = useState<Task | null>(null);
  const [statuses, setStatuses] = useState<CodeMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load task data
  useEffect(() => {
    async function loadTask() {
      setLoading(true);
      setError(null);

      try {
        const [taskData, statusData] = await Promise.all([
          getTaskById(parsedTaskId),
          getCodeMaster('status'),
        ]);
        setTask(taskData);
        setStatuses(statusData);
      } catch (err) {
        console.error('Failed to load task:', err);
        setError('Failed to load task details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (parsedTaskId) {
      loadTask();
    }
  }, [parsedTaskId]);

  // Handle status update
  const handleStatusUpdate = async (newStatusId: number) => {
    if (!task || updating) return;

    setUpdating(true);
    try {
      const updatedTask = await updateTaskStatus(task.task_id, {
        status_id: newStatusId,
      });
      setTask(updatedTask);
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update task status.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle checklist item toggle
  const handleChecklistToggle = async (checklistId: number, currentStatus: boolean) => {
    if (!task || updating) return;

    setUpdating(true);
    try {
      await updateTaskChecklist(task.task_id, checklistId, {
        check_status: !currentStatus,
      });
      // Reload task to get updated checklist
      const updatedTask = await getTaskById(task.task_id);
      setTask(updatedTask);
    } catch (err) {
      console.error('Failed to update checklist:', err);
      setError('Failed to update checklist item.');
    } finally {
      setUpdating(false);
    }
  };

  // Get status info
  const getStatusColor = (statusId: number | null) => {
    switch (statusId) {
      case TASK_STATUS.NOT_YET:
        return 'bg-gray-400';
      case TASK_STATUS.ON_PROGRESS:
        return 'bg-blue-500';
      case TASK_STATUS.DONE:
        return 'bg-green-500';
      case TASK_STATUS.OVERDUE:
        return 'bg-red-500';
      case TASK_STATUS.REJECT:
        return 'bg-gray-600';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusLabel = (statusId: number | null) => {
    const status = statuses.find((s) => s.code_master_id === statusId);
    return status?.name || 'Unknown';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Task not found.</p>
          <Link
            href="/tasks"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/tasks" className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800">
              &larr; Back to Tasks
            </Link>
          </div>
          <h1 className="text-xl font-bold">Task Details</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Task Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-3 py-1 rounded text-sm text-white ${getStatusColor(task.status_id)}`}
                >
                  {getStatusLabel(task.status_id)}
                </span>
                <span
                  className={`px-3 py-1 rounded text-sm border ${getPriorityColor(task.priority)}`}
                >
                  {task.priority.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{task.task_name}</h1>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Task ID: #{task.task_id}</div>
              <div>Created: {new Date(task.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          {task.task_description && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Description</h3>
              <p className="text-gray-800">{task.task_description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {task.assigned_store && (
              <div>
                <span className="text-gray-500">Store:</span>
                <div className="font-medium">{task.assigned_store.store_name}</div>
              </div>
            )}
            {task.assigned_staff && (
              <div>
                <span className="text-gray-500">Assigned To:</span>
                <div className="font-medium">{task.assigned_staff.staff_name}</div>
              </div>
            )}
            {task.do_staff && (
              <div>
                <span className="text-gray-500">Executed By:</span>
                <div className="font-medium">{task.do_staff.staff_name}</div>
              </div>
            )}
            {task.department && (
              <div>
                <span className="text-gray-500">Department:</span>
                <div className="font-medium">{task.department.department_name}</div>
              </div>
            )}
            {task.start_date && (
              <div>
                <span className="text-gray-500">Start Date:</span>
                <div className="font-medium">{task.start_date}</div>
              </div>
            )}
            {task.end_date && (
              <div>
                <span className="text-gray-500">End Date:</span>
                <div className="font-medium">{task.end_date}</div>
              </div>
            )}
            {task.due_datetime && (
              <div>
                <span className="text-gray-500">Due:</span>
                <div className="font-medium">
                  {new Date(task.due_datetime).toLocaleString()}
                </div>
              </div>
            )}
            {task.completed_time && (
              <div>
                <span className="text-gray-500">Completed:</span>
                <div className="font-medium">
                  {new Date(task.completed_time).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Update Status</h2>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status.code_master_id}
                onClick={() => handleStatusUpdate(status.code_master_id)}
                disabled={updating || task.status_id === status.code_master_id}
                className={`px-4 py-2 rounded text-sm transition-colors ${
                  task.status_id === status.code_master_id
                    ? 'bg-blue-600 text-white cursor-default'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {status.name}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist */}
        {task.checklists && task.checklists.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Checklist</h2>
            <div className="space-y-2">
              {task.checklists.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={item.check_status}
                    onChange={() => handleChecklistToggle(item.check_list_id, item.check_status)}
                    disabled={updating}
                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <span
                      className={`${
                        item.check_status ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {item.check_list?.check_list_name || `Checklist #${item.check_list_id}`}
                    </span>
                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                    )}
                  </div>
                  {item.check_status && item.completed_at && (
                    <span className="text-xs text-gray-400">
                      {new Date(item.completed_at).toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {task.comment && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Comments</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{task.comment}</p>
          </div>
        )}

        {/* Attachments */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Attachments</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {task.attachments.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-center"
                >
                  <div className="text-3xl mb-2">📎</div>
                  <span className="text-sm text-blue-600 truncate block">
                    Attachment {index + 1}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Manual Reference */}
        {task.manual && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Reference Manual</h2>
            <div className="flex items-center gap-3">
              <div className="text-3xl">📖</div>
              <div>
                <div className="font-medium">{task.manual.manual_name}</div>
                {task.manual.description && (
                  <p className="text-sm text-gray-500">{task.manual.description}</p>
                )}
                {task.manual.manual_url && (
                  <a
                    href={task.manual.manual_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Manual &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Task Meta Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Task Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {task.task_type && (
              <div>
                <span className="text-gray-500">Task Type:</span>
                <div className="font-medium">{task.task_type.name}</div>
              </div>
            )}
            {task.response_type && (
              <div>
                <span className="text-gray-500">Response Type:</span>
                <div className="font-medium">{task.response_type.name}</div>
              </div>
            )}
            {task.created_staff && (
              <div>
                <span className="text-gray-500">Created By:</span>
                <div className="font-medium">{task.created_staff.staff_name}</div>
              </div>
            )}
            <div>
              <span className="text-gray-500">Repeat Task:</span>
              <div className="font-medium">{task.is_repeat ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <div className="font-medium">
                {new Date(task.updated_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
