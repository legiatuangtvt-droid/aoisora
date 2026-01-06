'use client';

import { useState, useMemo } from 'react';
import { RETask, RE_TASK_GROUPS } from '@/types/reTask';
import { MOCK_RE_TASKS } from '@/data/mockRETaskData';
import TaskGroupsStatistics from '@/components/dws/TaskGroupsStatistics';
import TaskGroupRow from '@/components/dws/TaskGroupRow';
import AddRETaskModal from '@/components/dws/AddRETaskModal';

export default function TaskGroupsPage() {
  const [tasks, setTasks] = useState<RETask[]>(MOCK_RE_TASKS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Calculate statistics
  const statistics = useMemo(() => {
    const stats = {
      total: tasks.length,
      daily: 0,
      weekly: 0,
      monthly: 0,
      yearly: 0,
      other: 0,
    };

    tasks.forEach((task) => {
      switch (task.frequencyType) {
        case 'Daily':
          stats.daily++;
          break;
        case 'Weekly':
          stats.weekly++;
          break;
        case 'Monthly':
          stats.monthly++;
          break;
        case 'Yearly':
          stats.yearly++;
          break;
        default:
          stats.other++;
      }
    });

    return stats;
  }, [tasks]);

  // Group tasks by group name
  const groupedTasks = useMemo(() => {
    const groups: Record<string, RETask[]> = {};

    // Initialize groups based on RE_TASK_GROUPS order
    RE_TASK_GROUPS.forEach((group) => {
      groups[group.id] = [];
    });

    // Populate tasks into groups
    tasks.forEach((task) => {
      if (groups[task.group]) {
        groups[task.group].push(task);
      } else {
        // If group doesn't exist in config, add to OTHER
        if (!groups['OTHER']) {
          groups['OTHER'] = [];
        }
        groups['OTHER'].push(task);
      }
    });

    return groups;
  }, [tasks]);

  // Get group config
  const getGroupConfig = (groupId: string) => {
    return (
      RE_TASK_GROUPS.find((g) => g.id === groupId) || {
        id: groupId,
        name: groupId,
        color: '#6B7280',
        bgColor: '#F3F4F6',
      }
    );
  };

  // Handle add task to specific group
  const handleAddTaskToGroup = (groupId: string) => {
    setSelectedGroup(groupId);
    setShowAddModal(true);
  };

  // Handle add new task
  const handleAddTask = (taskData: Omit<RETask, 'id'>) => {
    const maxId = Math.max(...tasks.map((t) => t.id), 0);
    const newTask: RETask = {
      ...taskData,
      id: maxId + 1,
      // Use selected group if available
      group: selectedGroup || taskData.group,
    };
    setTasks((prev) => [...prev, newTask]);
    setSelectedGroup(null);
  };

  // Handle task click
  const handleTaskClick = (task: RETask) => {
    console.log('Task clicked:', task);
    // TODO: Navigate to task detail or open view modal
  };

  // Handle edit group
  const handleEditGroup = (groupId: string) => {
    console.log('Edit group:', groupId);
    // TODO: Open edit group modal
  };

  // Get ordered groups (only groups with tasks or predefined groups)
  const orderedGroups = useMemo(() => {
    return RE_TASK_GROUPS.filter(
      (group) => groupedTasks[group.id] && groupedTasks[group.id].length > 0
    );
  }, [groupedTasks]);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Statistics Bar */}
      <TaskGroupsStatistics statistics={statistics} />

      {/* Groups Container */}
      <div className="p-4 space-y-6">
        {orderedGroups.map((group, index) => {
          const groupConfig = getGroupConfig(group.id);
          return (
            <TaskGroupRow
              key={group.id}
              groupNumber={index + 1}
              groupName={groupConfig.name}
              groupColor={groupConfig.color}
              groupBgColor={groupConfig.bgColor}
              tasks={groupedTasks[group.id] || []}
              onAddTask={() => handleAddTaskToGroup(group.id)}
              onEditGroup={() => handleEditGroup(group.id)}
              onTaskClick={handleTaskClick}
            />
          );
        })}

        {/* Empty state if no groups */}
        {orderedGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No task groups yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
              Task groups will appear here once you add tasks to the system.
            </p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <AddRETaskModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedGroup(null);
        }}
        onAdd={handleAddTask}
        defaultGroup={selectedGroup || undefined}
      />
    </div>
  );
}
