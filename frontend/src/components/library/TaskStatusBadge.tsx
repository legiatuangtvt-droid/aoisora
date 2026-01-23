'use client';

import React from 'react';
import { TaskStatus } from '@/types/taskLibrary';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<TaskStatus, { bg: string; text: string }> = {
    'In progress': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    'Draft': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300' },
    'Available': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
    'Cooldown': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
  };

  const styles = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}
    >
      {status}
    </span>
  );
};

export default TaskStatusBadge;
