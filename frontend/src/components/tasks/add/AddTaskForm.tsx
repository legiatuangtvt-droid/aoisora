'use client';

import { useState, useCallback } from 'react';
import { TaskLevel, TaskInformation, TaskInstructions, TaskScope, TaskApproval } from '@/types/addTask';
import { mockMasterData, createEmptyTaskLevel } from '@/data/mockAddTask';
import TaskLevelCard from './TaskLevelCard';
import TaskInfoSection from './TaskInfoSection';
import InstructionsSection from './InstructionsSection';
import ScopeSection from './ScopeSection';
import ApprovalSection from './ApprovalSection';

interface AddTaskFormProps {
  onSaveDraft: (taskLevels: TaskLevel[]) => void;
  onSubmit: (taskLevels: TaskLevel[]) => void;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
}

export default function AddTaskForm({
  onSaveDraft,
  onSubmit,
  isSubmitting = false,
  isSavingDraft = false,
}: AddTaskFormProps) {
  const [taskLevels, setTaskLevels] = useState<TaskLevel[]>([createEmptyTaskLevel(1)]);

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

  // Handle section toggle
  const handleSectionToggle = useCallback((taskLevelId: string, section: 'A' | 'B' | 'C' | 'D' | null) => {
    updateTaskLevel(taskLevelId, { expandedSection: section });
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

  // Render section content
  const renderSectionContent = (taskLevel: TaskLevel) => {
    switch (taskLevel.expandedSection) {
      case 'A':
        return (
          <TaskInfoSection
            data={taskLevel.taskInformation}
            onChange={(data) => handleTaskInfoChange(taskLevel.id, data)}
            taskTypeOptions={mockMasterData.taskTypes}
            executionTimeOptions={mockMasterData.executionTimes}
          />
        );
      case 'B':
        return (
          <InstructionsSection
            data={taskLevel.instructions}
            onChange={(data) => handleInstructionsChange(taskLevel.id, data)}
            taskTypeOptions={mockMasterData.instructionTaskTypes}
          />
        );
      case 'C':
        return (
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
        );
      case 'D':
        return (
          <ApprovalSection
            data={taskLevel.approval}
            onChange={(data) => handleApprovalChange(taskLevel.id, data)}
            initiatorOptions={mockMasterData.initiators}
            leaderOptions={mockMasterData.leaders}
            hodOptions={mockMasterData.hods}
          />
        );
      default:
        return null;
    }
  };

  // Organize task levels into tree structure
  const getTaskLevelsTree = () => {
    const rootLevels = taskLevels.filter((tl) => tl.parentId === null);
    const getChildren = (parentId: string): TaskLevel[] => {
      return taskLevels.filter((tl) => tl.parentId === parentId);
    };

    const renderTaskLevel = (taskLevel: TaskLevel, depth = 0): JSX.Element => {
      const children = getChildren(taskLevel.id);
      const canAddSubLevel = taskLevel.level < 5;
      const canDelete = taskLevels.length > 1;

      return (
        <div key={taskLevel.id} style={{ marginLeft: depth > 0 ? '24px' : 0 }}>
          <TaskLevelCard
            taskLevel={taskLevel}
            onNameChange={(name) => handleNameChange(taskLevel.id, name)}
            onToggleExpand={() => {}}
            onSectionToggle={(section) => handleSectionToggle(taskLevel.id, section)}
            onAddSubLevel={() => handleAddSubLevel(taskLevel.id)}
            onDelete={() => handleDeleteTaskLevel(taskLevel.id)}
            canAddSubLevel={canAddSubLevel}
            canDelete={canDelete}
          >
            {renderSectionContent(taskLevel)}
          </TaskLevelCard>

          {/* Render section content outside the card but in the same container */}
          {taskLevel.expandedSection && (
            <div className="mt-0 -mt-px bg-gray-50 dark:bg-gray-900/50 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg px-4 py-4" style={{ marginLeft: depth > 0 ? '24px' : 0 }}>
              {renderSectionContent(taskLevel)}
            </div>
          )}

          {/* Render children */}
          {children.map((child) => (
            <div key={child.id} className="mt-4">
              {renderTaskLevel(child, depth + 1)}
            </div>
          ))}
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

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onSaveDraft(taskLevels)}
          disabled={isSavingDraft || isSubmitting}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingDraft ? 'Saving...' : 'Save as draft'}
        </button>
        <button
          onClick={() => onSubmit(taskLevels)}
          disabled={isSavingDraft || isSubmitting}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
