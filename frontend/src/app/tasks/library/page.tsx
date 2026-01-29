'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TaskCategory, DepartmentType, TaskTemplate, TaskGroup } from '@/types/taskLibrary';
import TaskLibraryHeader from '@/components/library/TaskLibraryHeader';
import TaskLibraryTabs from '@/components/library/TaskLibraryTabs';
import DepartmentFilterChips from '@/components/library/DepartmentFilterChips';
import TaskSearchBar from '@/components/library/TaskSearchBar';
import TaskGroupSection from '@/components/library/TaskGroupSection';
import { getDraftInfo, DraftInfo, getWsLibraryTemplates, WsLibraryTemplate, overrideWsLibraryCooldown } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { LibraryPageSkeleton } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/ui/ErrorBoundary';
import { SearchEmptyState } from '@/components/ui/EmptyState';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

// Transform API data to component format
function transformTemplateToTaskTemplate(template: WsLibraryTemplate, index: number): TaskTemplate {
  // Map API status to display status
  const statusMap: Record<string, 'Draft' | 'In progress' | 'Available' | 'Cooldown'> = {
    draft: 'Draft',
    approve: 'In progress',
    available: 'Available',
    cooldown: 'Cooldown',
  };

  return {
    id: String(template.task_library_id),
    no: index + 1,
    type: template.taskType?.name || 'Daily',
    taskName: template.task_name,
    owner: {
      id: String(template.created_staff_id),
      name: template.creator?.staff_name || 'Unknown',
      avatar: '/avatars/default.png',
    },
    lastUpdate: template.updated_at
      ? new Date(template.updated_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        })
      : '-',
    status: statusMap[template.status] || 'Available',
    usage: template.dispatch_count || 0,
    department: (template.department?.department_name || 'Admin') as DepartmentType,
    category: 'office' as TaskCategory,
    // Additional fields for API integration
    canDispatch: template.can_dispatch,
    isInCooldown: template.is_in_active_cooldown,
    cooldownMinutes: template.cooldown_remaining_minutes,
  };
}

// Group templates by department
function groupTemplatesByDepartment(templates: TaskTemplate[]): TaskGroup[] {
  const grouped = templates.reduce((acc, task) => {
    const dept = task.department;
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(task);
    return acc;
  }, {} as Record<DepartmentType, TaskTemplate[]>);

  // Define department colors
  const deptColors: Record<string, string> = {
    Admin: '#E91E63',
    HR: '#9C27B0',
    Legal: '#4CAF50',
    IT: '#2196F3',
    Finance: '#FF9800',
    Marketing: '#00BCD4',
    Sales: '#F44336',
    Operations: '#795548',
  };

  return Object.entries(grouped).map(([dept, tasks]) => ({
    department: dept as DepartmentType,
    icon: `/icons/${dept.toLowerCase()}.png`,
    color: deptColors[dept] || '#607D8B',
    tasks,
    isExpanded: false,
  }));
}

export default function TaskLibraryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isHQUser = user?.jobGrade?.startsWith('G') || false;

  const [activeTab, setActiveTab] = useState<TaskCategory>('office');
  const [selectedDepartments, setSelectedDepartments] = useState<DepartmentType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<DepartmentType, boolean>>({
    Admin: true,
    HR: false,
    Legal: false,
  });

  // API data state
  const [templates, setTemplates] = useState<WsLibraryTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Draft limit state
  const [draftInfo, setDraftInfo] = useState<DraftInfo | null>(null);
  const sourceDraftInfo = draftInfo?.by_source?.['library'];

  // Override cooldown modal state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideTask, setOverrideTask] = useState<TaskTemplate | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [isOverriding, setIsOverriding] = useState(false);

  // Delete confirmation state
  const [deleteTask, setDeleteTask] = useState<TaskTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch templates from API
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWsLibraryTemplates({
        per_page: 100,
        task_name: searchQuery.length >= 2 ? searchQuery : undefined,
      });
      setTemplates(response.data);
    } catch (err) {
      console.error('Failed to fetch library templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // Fetch templates on mount and when search changes
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Fetch draft info (for HQ users only)
  useEffect(() => {
    if (isHQUser) {
      getDraftInfo()
        .then(setDraftInfo)
        .catch((err) => {
          console.error('Failed to fetch draft info:', err);
        });
    }
  }, [isHQUser]);

  // Transform and group templates
  const taskGroups = useMemo(() => {
    const transformedTasks = templates.map((t, i) => transformTemplateToTaskTemplate(t, i));
    return groupTemplatesByDepartment(transformedTasks);
  }, [templates]);

  // Get available departments
  const availableDepartments = useMemo(() => {
    return taskGroups.map(g => g.department);
  }, [taskGroups]);

  // Get filtered task groups
  const filteredGroups = useMemo(() => {
    let groups = taskGroups;

    // Filter by departments if specified
    if (selectedDepartments.length > 0) {
      groups = groups.filter(group => selectedDepartments.includes(group.department));
    }

    // Apply expanded state
    return groups.map(group => ({
      ...group,
      isExpanded: expandedGroups[group.department] ?? false,
    }));
  }, [taskGroups, selectedDepartments, expandedGroups]);

  const handleTabChange = (tab: TaskCategory) => {
    setActiveTab(tab);
    setSelectedDepartments([]);
    setSearchQuery('');
  };

  const handleDepartmentToggle = (department: DepartmentType) => {
    setSelectedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const handleGroupToggle = (department: DepartmentType) => {
    setExpandedGroups(prev => ({
      ...prev,
      [department]: !prev[department],
    }));
  };

  const handleCreateNew = () => {
    // Navigate to Add Task screen with library source (C. Scope will be hidden)
    router.push('/tasks/new?source=library');
  };

  const handleFilterClick = () => {
    // TODO: Implement advanced filter modal
    console.log('Open filter modal');
  };

  const handleEdit = (task: TaskTemplate) => {
    // Navigate to Add Task screen in edit mode with library source
    router.push(`/tasks/new?id=${task.id}&source=library`);
  };

  const handleDuplicate = (task: TaskTemplate) => {
    // TODO: Implement duplicate task
    console.log('Duplicate task:', task);
  };

  const handleDeleteClick = (task: TaskTemplate) => {
    setDeleteTask(task);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTask) return;

    setIsDeleting(true);
    try {
      // TODO: Implement delete with API call
      // await deleteWsLibraryTemplate(Number(deleteTask.id));
      // fetchTemplates(); // Refresh list
      console.log('Delete task:', deleteTask);
    } catch (err) {
      console.error('Failed to delete template:', err);
    } finally {
      setIsDeleting(false);
      setDeleteTask(null);
    }
  };

  const handleViewUsage = (task: TaskTemplate) => {
    // TODO: Implement view usage stats
    console.log('View usage:', task);
  };

  const handleDispatch = (task: TaskTemplate) => {
    // Navigate to dispatch modal/page
    router.push(`/tasks/library/dispatch?id=${task.id}`);
  };

  const handleOverrideCooldown = (task: TaskTemplate) => {
    setOverrideTask(task);
    setOverrideReason('');
    setShowOverrideModal(true);
  };

  const handleOverrideConfirm = async () => {
    if (!overrideTask) return;

    setIsOverriding(true);
    try {
      await overrideWsLibraryCooldown(Number(overrideTask.id), overrideReason || undefined);
      setShowOverrideModal(false);
      setOverrideTask(null);
      setOverrideReason('');
      // Refresh templates list
      fetchTemplates();
    } catch (err) {
      console.error('Failed to override cooldown:', err);
      alert(err instanceof Error ? err.message : 'Failed to override cooldown');
    } finally {
      setIsOverriding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <TaskLibraryHeader
          onCreateNew={handleCreateNew}
          draftLimitInfo={isHQUser ? sourceDraftInfo : null}
        />

        {/* Tabs */}
        <TaskLibraryTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Department Filter Chips */}
        <DepartmentFilterChips
          departments={availableDepartments}
          selectedDepartments={selectedDepartments}
          onDepartmentToggle={handleDepartmentToggle}
        />

        {/* Search and Filter Bar */}
        <TaskSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={handleFilterClick}
        />

        {/* Loading State - Skeleton */}
        {isLoading && <LibraryPageSkeleton />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorDisplay
            title="Failed to load library templates"
            message={error}
            onRetry={fetchTemplates}
          />
        )}

        {/* Task Groups */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {filteredGroups.length > 0 ? (
              filteredGroups.map(group => (
                <TaskGroupSection
                  key={group.department}
                  group={group}
                  onToggle={handleGroupToggle}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDeleteClick}
                  onViewUsage={handleViewUsage}
                  onOverrideCooldown={handleOverrideCooldown}
                />
              ))
            ) : (
              <SearchEmptyState
                query={searchQuery || undefined}
                onClear={searchQuery ? () => setSearchQuery('') : undefined}
              />
            )}
          </div>
        )}

        {/* Override Cooldown Modal */}
        {showOverrideModal && overrideTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="override-cooldown-title">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 id="override-cooldown-title" className="text-lg font-semibold text-gray-900 dark:text-white">Override Cooldown</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This task is in cooldown period</p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-100 dark:border-cyan-800">
                  <p className="text-sm text-cyan-800 dark:text-cyan-300">
                    <strong>{overrideTask.taskName}</strong>
                  </p>
                  {overrideTask.cooldownMinutes && (
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                      Remaining cooldown: {Math.ceil(overrideTask.cooldownMinutes / 60)} hour(s)
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for override (optional)
                  </label>
                  <textarea
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    rows={3}
                    placeholder="Enter reason for overriding cooldown..."
                    aria-label="Override reason"
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                  <div className="flex gap-2">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Overriding cooldown will allow this template to be dispatched again immediately.
                      This action will be logged.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
                <button
                  onClick={() => {
                    setShowOverrideModal(false);
                    setOverrideTask(null);
                    setOverrideReason('');
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  disabled={isOverriding}
                >
                  Cancel
                </button>
                <button
                  onClick={handleOverrideConfirm}
                  disabled={isOverriding}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOverriding ? 'Overriding...' : 'Override & Dispatch'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Template Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={deleteTask !== null}
          onClose={() => setDeleteTask(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Template"
          message={`Are you sure you want to delete "${deleteTask?.taskName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
