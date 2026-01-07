'use client';

import { useState, useMemo } from 'react';
import { RETask, RE_TASK_GROUPS } from '@/types/reTask';
import { MOCK_RE_TASKS, paginateRETask } from '@/data/mockRETaskData';
import ImportRETaskModal from '@/components/dws/ImportRETaskModal';
import ExportRETaskModal from '@/components/dws/ExportRETaskModal';
import AddRETaskModal from '@/components/dws/AddRETaskModal';
import EditRETaskModal from '@/components/dws/EditRETaskModal';
import DeleteConfirmDialog from '@/components/dws/DeleteConfirmDialog';
import EmptyState from '@/components/dws/EmptyState';

export default function RETaskListPage() {
  // State
  const [tasks, setTasks] = useState<RETask[]>(MOCK_RE_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [groupFilter, setGroupFilter] = useState<string[]>([]);
  const [frequencyFilter, setFrequencyFilter] = useState<string[]>([]);

  // Modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<RETask | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        task.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.manualNumber.toLowerCase().includes(searchQuery.toLowerCase());

      // Group filter
      const matchesGroup =
        groupFilter.length === 0 || groupFilter.includes(task.group);

      // Frequency filter
      const matchesFrequency =
        frequencyFilter.length === 0 ||
        frequencyFilter.includes(task.frequencyType);

      return matchesSearch && matchesGroup && matchesFrequency;
    });
  }, [tasks, searchQuery, groupFilter, frequencyFilter]);

  // Paginate
  const paginatedData = useMemo(() => {
    return paginateRETask(filteredTasks, currentPage, pageSize);
  }, [filteredTasks, currentPage, pageSize]);

  // Get group color
  const getGroupColor = (groupId: string) => {
    const group = RE_TASK_GROUPS.find((g) => g.id === groupId);
    return group || { color: '#6B7280', bgColor: '#F3F4F6' };
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle edit
  const handleEdit = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowEditModal(true);
    }
  };

  // Handle update task
  const handleUpdateTask = (updatedTask: RETask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  // Handle delete
  const handleDelete = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowDeleteDialog(true);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    // Adjust page if needed
    const newTotal = tasks.length - 1;
    const newTotalPages = Math.ceil(newTotal / pageSize);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setGroupFilter([]);
    setFrequencyFilter([]);
    setCurrentPage(1);
  };

  // Handle import
  const handleImport = (importedTasks: RETask[]) => {
    // Get the maximum existing ID
    const maxId = Math.max(...tasks.map((t) => t.id), 0);

    // Assign new IDs to imported tasks
    const newTasks = importedTasks.map((task, index) => ({
      ...task,
      id: maxId + index + 1,
    }));

    // Add new tasks to the list
    setTasks((prev) => [...prev, ...newTasks]);

    // Reset to first page to show new data
    setCurrentPage(1);
  };

  // Handle add new task
  const handleAddTask = (taskData: Omit<RETask, 'id'>) => {
    const maxId = Math.max(...tasks.map((t) => t.id), 0);
    const newTask: RETask = {
      ...taskData,
      id: maxId + 1,
    };
    setTasks((prev) => [newTask, ...prev]);
    setCurrentPage(1);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Content */}
      <div className="px-4 py-3">
        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              RE Task List
            </h2>
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by group or task name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#C5055B] focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Import
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5055B] hover:bg-[#A50449] text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1E3A5F] text-white text-sm">
                  <th className="px-4 py-3 text-left font-medium">STT</th>
                  <th className="px-4 py-3 text-left font-medium">Group</th>
                  <th className="px-4 py-3 text-left font-medium">Type Task</th>
                  <th className="px-4 py-3 text-left font-medium">Task Name</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Frequency Type
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Frequency Number
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Re Unit (min)
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Manual Number
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Manual Link
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Note</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.data.length === 0 ? (
                  <tr>
                    <td colSpan={11}>
                      <EmptyState
                        type={searchQuery || groupFilter.length > 0 || frequencyFilter.length > 0 ? 'no-results' : 'no-data'}
                        searchQuery={searchQuery}
                        onClearSearch={handleClearSearch}
                        onAddNew={() => setShowAddModal(true)}
                      />
                    </td>
                  </tr>
                ) : (
                  paginatedData.data.map((task, index) => {
                    const groupColor = getGroupColor(task.group);
                    const rowNumber = (currentPage - 1) * pageSize + index + 1;

                    return (
                      <tr
                        key={task.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {rowNumber}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: groupColor.bgColor,
                              color: groupColor.color,
                            }}
                          >
                            {task.group}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {task.typeTask}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {task.taskName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {task.frequencyType}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-blue-600 dark:text-blue-400 font-medium">
                          {task.frequencyNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white">
                          {task.reUnit}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {task.manualNumber}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {task.manualLink ? (
                            <a
                              href={task.manualLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <span className="truncate max-w-[120px]">
                                {task.manualLink.replace(/^https?:\/\//, '').slice(0, 20)}...
                              </span>
                              <svg
                                className="w-3 h-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">-</span>
                          )}
                        </td>
                        <td
                          className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate"
                          title={task.note}
                        >
                          {task.note || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(task.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                              title="Edit"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                              title="Delete"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, paginatedData.total)} of{' '}
              {paginatedData.total} items
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= paginatedData.totalPages}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <ImportRETaskModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />

      {/* Export Modal */}
      <ExportRETaskModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        tasks={filteredTasks}
        filteredCount={filteredTasks.length}
        totalCount={tasks.length}
      />

      {/* Add Modal */}
      <AddRETaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTask}
      />

      {/* Edit Modal */}
      <EditRETaskModal
        isOpen={showEditModal}
        task={selectedTask}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        onSave={handleUpdateTask}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        task={selectedTask}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedTask(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
