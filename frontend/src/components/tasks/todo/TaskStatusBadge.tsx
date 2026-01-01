'use client';

import { TaskStatus, STATUS_CONFIG } from '@/types/todoTask';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  onClick?: () => void;
}

// Dot color mapping for status
const DOT_COLORS: Record<TaskStatus, string> = {
  in_process: 'bg-orange-400',
  done: 'bg-green-500',
  draft: 'bg-gray-400',
  not_yet: 'bg-red-500',
};

export default function TaskStatusBadge({ status, onClick }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const dotColor = DOT_COLORS[status];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color} hover:opacity-80 transition-opacity border border-current/20`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {config.label}
    </button>
  );
}
