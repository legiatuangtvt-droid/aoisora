'use client';

import React, { useState } from 'react';
import { TaskTemplate } from '@/types/taskLibrary';
import TaskStatusBadge from './TaskStatusBadge';
import TaskRowActions from './TaskRowActions';

interface TaskDataTableProps {
  tasks: TaskTemplate[];
  onEdit: (task: TaskTemplate) => void;
  onDuplicate: (task: TaskTemplate) => void;
  onDelete: (task: TaskTemplate) => void;
  onViewUsage: (task: TaskTemplate) => void;
}

type SortField = 'type' | 'taskName' | 'lastUpdate' | 'usage';
type SortDirection = 'asc' | 'desc';

const TaskDataTable: React.FC<TaskDataTableProps> = ({
  tasks,
  onEdit,
  onDuplicate,
  onDelete,
  onViewUsage,
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortField) return 0;

    let comparison = 0;
    switch (sortField) {
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'taskName':
        comparison = a.taskName.localeCompare(b.taskName);
        break;
      case 'lastUpdate':
        comparison = a.lastUpdate.localeCompare(b.lastUpdate);
        break;
      case 'usage':
        comparison = a.usage - b.usage;
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => (
    <svg
      className={`w-3 h-3 ml-1 inline-block transition-transform ${
        sortField === field && sortDirection === 'desc' ? 'rotate-180' : ''
      } ${sortField === field ? 'text-[#C5055B]' : 'text-gray-400'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No tasks found in this department
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
              No
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort('type')}
            >
              Type <SortIcon field="type" />
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort('taskName')}
            >
              Task Name <SortIcon field="taskName" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort('lastUpdate')}
            >
              Last Update <SortIcon field="lastUpdate" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort('usage')}
            >
              Usage <SortIcon field="usage" />
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-12">

            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedTasks.map((task, index) => (
            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{task.type}</td>
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{task.taskName}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                    {task.owner.name.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-900">{task.owner.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{task.lastUpdate}</td>
              <td className="px-4 py-3">
                <TaskStatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{task.usage}</td>
              <td className="px-4 py-3 text-right">
                <TaskRowActions
                  task={task}
                  onEdit={onEdit}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  onViewUsage={onViewUsage}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskDataTable;
