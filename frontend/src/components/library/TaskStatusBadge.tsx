'use client';

import React from 'react';
import { TaskStatus } from '@/types/taskLibrary';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<TaskStatus, { bg: string; text: string }> = {
    'In progress': { bg: 'bg-orange-100', text: 'text-orange-600' },
    'Draft': { bg: 'bg-gray-100', text: 'text-gray-600' },
    'Available': { bg: 'bg-green-100', text: 'text-green-600' },
    'Cooldown': { bg: 'bg-cyan-100', text: 'text-cyan-600' },
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
