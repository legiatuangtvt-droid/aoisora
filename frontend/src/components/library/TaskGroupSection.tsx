'use client';

import React from 'react';
import { TaskGroup, TaskTemplate, DepartmentType, DEPARTMENT_COLORS } from '@/types/taskLibrary';
import TaskDataTable from './TaskDataTable';

interface TaskGroupSectionProps {
  group: TaskGroup;
  onToggle: (department: DepartmentType) => void;
  onEdit: (task: TaskTemplate) => void;
  onDuplicate: (task: TaskTemplate) => void;
  onDelete: (task: TaskTemplate) => void;
  onViewUsage: (task: TaskTemplate) => void;
  onOverrideCooldown?: (task: TaskTemplate) => void;
}

const TaskGroupSection: React.FC<TaskGroupSectionProps> = ({
  group,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
  onViewUsage,
  onOverrideCooldown,
}) => {
  const departmentIcons: Record<DepartmentType, React.ReactNode> = {
    Admin: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    HR: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    Legal: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
  };

  const color = DEPARTMENT_COLORS[group.department];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      {/* Group Header */}
      <button
        onClick={() => onToggle(group.department)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <span style={{ color }}>{departmentIcons[group.department]}</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            {group.department} TASKS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {group.tasks.length} GROUP TASKS
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              group.isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Group Content */}
      {group.isExpanded && (
        <div className="border-t border-gray-200">
          <TaskDataTable
            tasks={group.tasks}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onViewUsage={onViewUsage}
            onOverrideCooldown={onOverrideCooldown}
          />
        </div>
      )}
    </div>
  );
};

export default TaskGroupSection;
