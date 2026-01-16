'use client';

import { useState, useCallback } from 'react';
import { TaskLevel, TaskInformation, TaskInstructions, TaskScope, TaskApproval } from '@/types/addTask';
import { mockMasterData, createEmptyTaskLevel } from '@/data/mockAddTask';
import TaskLevelCard from './TaskLevelCard';
import SectionCard from './SectionCard';
import TaskInfoSection from './TaskInfoSection';
import InstructionsSection from './InstructionsSection';
import ScopeSection from './ScopeSection';
import ApprovalSection from './ApprovalSection';

interface AddTaskFormProps {
  taskLevels: TaskLevel[];
  onTaskLevelsChange: (taskLevels: TaskLevel[]) => void;
  onSaveDraft: (taskLevels: TaskLevel[]) => void;
  onSubmit: (taskLevels: TaskLevel[]) => void;
  onApprove?: (taskLevels: TaskLevel[]) => void;
  onReject?: (taskLevels: TaskLevel[], reason: string) => void;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
  canCreateDraft?: boolean;
  // Task status for different view modes
  taskStatus?: 'draft' | 'approve' | 'approved' | 'rejected';
  // Whether current user is the approver
  isApprover?: boolean;
  // Whether current user is the creator viewing their pending approval
  isCreatorViewingApproval?: boolean;
}

// Section IDs for accordion
type SectionId = 'A' | 'B' | 'C' | 'D';

export default function AddTaskForm({
  taskLevels,
  onTaskLevelsChange,
  onSaveDraft,
  onSubmit,
  onApprove,
  onReject,
  isSubmitting = false,
  isSavingDraft = false,
  canCreateDraft = true,
  taskStatus = 'draft',
  isApprover = false,
  isCreatorViewingApproval = false,
}: AddTaskFormProps) {
  // State for reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Handle reject with reason
  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsRejecting(true);
    try {
      await onReject?.(taskLevels, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle approve
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove?.(taskLevels);
    } finally {
      setIsApproving(false);
    }
  };

  // Determine if form is read-only
  const isReadOnly = taskStatus === 'approve' || taskStatus === 'approved';

  // Use setter function that calls parent callback
  const setTaskLevels = (updater: TaskLevel[] | ((prev: TaskLevel[]) => TaskLevel[])) => {
    if (typeof updater === 'function') {
      onTaskLevelsChange(updater(taskLevels));
    } else {
      onTaskLevelsChange(updater);
    }
  };

  // Track which section is expanded for each task level (accordion behavior)
  // Key: taskLevelId, Value: expanded sectionId or null
  const [expandedSections, setExpandedSections] = useState<Record<string, SectionId | null>>({});

  // Toggle section expansion (accordion - only one section open at a time per task level)
  const handleSectionToggle = useCallback((taskLevelId: string, sectionId: SectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [taskLevelId]: prev[taskLevelId] === sectionId ? null : sectionId,
    }));
  }, []);

  // Update task level
  const updateTaskLevel = useCallback((taskLevelId: string, updates: Partial<TaskLevel>) => {
    setTaskLevels((prev) =>
      prev.map((tl) => (tl.id === taskLevelId ? { ...tl, ...updates } : tl))
    );
  }, []);

  // Handle name change
  const handleNameChange = useCallback((taskLevelId: string, name: string) => {
    updateTaskLevel(taskLevelId, { name });
  }, [updateTaskLevel]);


  // Handle task information change
  const handleTaskInfoChange = useCallback((taskLevelId: string, taskInformation: TaskInformation) => {
    updateTaskLevel(taskLevelId, { taskInformation });
  }, [updateTaskLevel]);

  // Handle instructions change
  const handleInstructionsChange = useCallback((taskLevelId: string, instructions: TaskInstructions) => {
    updateTaskLevel(taskLevelId, { instructions });
  }, [updateTaskLevel]);

  // Handle scope change
  const handleScopeChange = useCallback((taskLevelId: string, scope: TaskScope) => {
    updateTaskLevel(taskLevelId, { scope });
  }, [updateTaskLevel]);

  // Handle approval change
  const handleApprovalChange = useCallback((taskLevelId: string, approval: TaskApproval) => {
    updateTaskLevel(taskLevelId, { approval });
  }, [updateTaskLevel]);

  // Add sub-level
  const handleAddSubLevel = useCallback((parentId: string) => {
    const parent = taskLevels.find((tl) => tl.id === parentId);
    if (!parent || parent.level >= 5) return;

    const newTaskLevel = createEmptyTaskLevel(parent.level + 1, parentId);
    setTaskLevels((prev) => [...prev, newTaskLevel]);
  }, [taskLevels]);

  // Delete task level
  const handleDeleteTaskLevel = useCallback((taskLevelId: string) => {
    setTaskLevels((prev) => {
      // Find all children recursively
      const findChildren = (parentId: string): string[] => {
        const children = prev.filter((tl) => tl.parentId === parentId);
        return children.flatMap((c) => [c.id, ...findChildren(c.id)]);
      };

      const idsToRemove = [taskLevelId, ...findChildren(taskLevelId)];
      return prev.filter((tl) => !idsToRemove.includes(tl.id));
    });
  }, []);

  // Get zone options based on selected region
  const getZoneOptions = (regionId: string) => {
    return mockMasterData.zones[regionId] || [];
  };

  // Get area options based on selected zone
  const getAreaOptions = (zoneId: string) => {
    return mockMasterData.areas[zoneId] || [];
  };

  // Get store options based on selected area
  const getStoreOptions = (areaId: string) => {
    return mockMasterData.stores[areaId] || [];
  };

  // Section icons
  const TaskInfoIcon = () => (
    <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const InstructionsIcon = () => (
    <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );

  const ScopeIcon = () => (
    <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const ApprovalIcon = () => (
    <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  // Organize task levels into tree structure
  const getTaskLevelsTree = () => {
    const rootLevels = taskLevels.filter((tl) => tl.parentId === null);
    const getChildren = (parentId: string): TaskLevel[] => {
      return taskLevels.filter((tl) => tl.parentId === parentId);
    };

    const renderTaskLevelCard = (taskLevel: TaskLevel): JSX.Element => {
      const canAddSubLevel = taskLevel.level < 5;
      const canDelete = taskLevels.length > 1;

      return (
        <TaskLevelCard
          taskLevel={taskLevel}
          onNameChange={(name) => handleNameChange(taskLevel.id, name)}
          onAddSubLevel={() => handleAddSubLevel(taskLevel.id)}
          onDelete={() => handleDeleteTaskLevel(taskLevel.id)}
          canAddSubLevel={canAddSubLevel}
          canDelete={canDelete}
        >
          {/* A. Task Information */}
          <SectionCard
            id="A"
            title="Task Information"
            icon={<TaskInfoIcon />}
            isExpanded={expandedSections[taskLevel.id] === 'A'}
            onToggle={() => handleSectionToggle(taskLevel.id, 'A')}
          >
            <TaskInfoSection
              data={taskLevel.taskInformation}
              onChange={(data) => handleTaskInfoChange(taskLevel.id, data)}
              taskTypeOptions={mockMasterData.taskTypes}
              executionTimeOptions={mockMasterData.executionTimes}
            />
          </SectionCard>

          {/* B. Instructions */}
          <SectionCard
            id="B"
            title="Instructions"
            icon={<InstructionsIcon />}
            isExpanded={expandedSections[taskLevel.id] === 'B'}
            onToggle={() => handleSectionToggle(taskLevel.id, 'B')}
          >
            <InstructionsSection
              data={taskLevel.instructions}
              onChange={(data) => handleInstructionsChange(taskLevel.id, data)}
              taskTypeOptions={mockMasterData.instructionTaskTypes}
            />
          </SectionCard>

          {/* C. Scope */}
          <SectionCard
            id="C"
            title="Scope"
            icon={<ScopeIcon />}
            isExpanded={expandedSections[taskLevel.id] === 'C'}
            onToggle={() => handleSectionToggle(taskLevel.id, 'C')}
          >
            <ScopeSection
              data={taskLevel.scope}
              onChange={(data) => handleScopeChange(taskLevel.id, data)}
              regionOptions={mockMasterData.regions}
              zoneOptions={getZoneOptions(taskLevel.scope.regionId)}
              areaOptions={getAreaOptions(taskLevel.scope.zoneId)}
              storeOptions={getStoreOptions(taskLevel.scope.areaId)}
              storeLeaderOptions={mockMasterData.storeLeaders}
              staffOptions={mockMasterData.staff}
            />
          </SectionCard>

          {/* D. Approval Process */}
          <SectionCard
            id="D"
            title="Approval Process"
            icon={<ApprovalIcon />}
            isExpanded={expandedSections[taskLevel.id] === 'D'}
            onToggle={() => handleSectionToggle(taskLevel.id, 'D')}
          >
            <ApprovalSection
              data={taskLevel.approval}
              onChange={(data) => handleApprovalChange(taskLevel.id, data)}
              initiatorOptions={mockMasterData.initiators}
              leaderOptions={mockMasterData.leaders}
              hodOptions={mockMasterData.hods}
            />
          </SectionCard>
        </TaskLevelCard>
      );
    };

    // Render "Add new sub task" button to add more children at same level
    const renderAddSubTaskButton = (parentLevel: TaskLevel): JSX.Element | null => {
      if (parentLevel.level >= 5) return null;

      return (
        <button
          onClick={() => handleAddSubLevel(parentLevel.id)}
          className="w-[536px] flex items-center gap-3 px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          {/* Plus Icon */}
          <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          {/* Text */}
          <div className="text-left">
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              Add new sub task {parentLevel.level + 1}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This task will be added to Level {parentLevel.level + 1}
            </p>
          </div>
        </button>
      );
    };

    const renderTaskLevel = (taskLevel: TaskLevel): JSX.Element => {
      const children = getChildren(taskLevel.id);
      const canAddMoreChildren = taskLevel.level < 5;

      if (children.length === 0) {
        return (
          <div key={taskLevel.id}>
            {renderTaskLevelCard(taskLevel)}
          </div>
        );
      }

      // Render parent and children horizontally
      return (
        <div key={taskLevel.id} className="flex items-start gap-4">
          {/* Parent task level */}
          {renderTaskLevelCard(taskLevel)}

          {/* Children task levels + Add button */}
          <div className="flex flex-col gap-4">
            {children.map((child) => renderTaskLevel(child))}
            {/* Button to add more children at this level */}
            {canAddMoreChildren && renderAddSubTaskButton(taskLevel)}
          </div>
        </div>
      );
    };

    return rootLevels.map((tl) => renderTaskLevel(tl));
  };

  return (
    <div className="space-y-6">
      {/* Task Levels */}
      <div className="space-y-4">
        {getTaskLevelsTree()}
      </div>

      {/* Status Banner for Creator viewing approval */}
      {isCreatorViewingApproval && taskStatus === 'approve' && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            Waiting for approval from your leader
          </span>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-4">
        {/* APPROVER VIEW: Show Reject and Approve buttons */}
        {isApprover && taskStatus === 'approve' && (
          <>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={isRejecting || isApproving}
              className="px-6 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={isRejecting || isApproving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </button>
          </>
        )}

        {/* CREATOR VIEW when task is pending approval: Disabled buttons */}
        {isCreatorViewingApproval && taskStatus === 'approve' && (
          <>
            <button
              disabled
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
            >
              Save as draft
            </button>
            <button
              disabled
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium cursor-not-allowed opacity-70"
            >
              Approving...
            </button>
          </>
        )}

        {/* NORMAL VIEW: Show Save Draft and Submit buttons */}
        {!isApprover && !isCreatorViewingApproval && taskStatus === 'draft' && (
          <>
            <button
              onClick={() => onSaveDraft(taskLevels)}
              disabled={isSavingDraft || isSubmitting || !canCreateDraft}
              title={!canCreateDraft ? 'Draft limit reached. Delete existing drafts to create new ones.' : undefined}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingDraft ? 'Saving...' : !canCreateDraft ? 'Draft limit reached' : 'Save as draft'}
            </button>
            <button
              onClick={() => onSubmit(taskLevels)}
              disabled={isSavingDraft || isSubmitting}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reject Task
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please provide a reason for rejecting this task. The creator will receive this feedback.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                disabled={isRejecting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || isRejecting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRejecting ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
