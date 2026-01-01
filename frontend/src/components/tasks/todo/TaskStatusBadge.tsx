'use client';

import { TaskStatus, STATUS_CONFIG } from '@/types/todoTask';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  onClick?: () => void;
}

export default function TaskStatusBadge({ status, onClick }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} hover:opacity-80 transition-opacity`}
    >
      {config.label}
    </button>
  );
}
