'use client';

import { TaskStatus, STATUS_CONFIG } from '@/types/todoTask';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  onClick?: () => void;
}

// Default dot color mapping for statuses without custom dotColor
const DEFAULT_DOT_COLORS: Record<TaskStatus, string> = {
  in_process: 'bg-[#EDA600]',
  done: 'bg-green-500',
  draft: 'bg-[#1BBA5E]',
  not_yet: 'bg-red-500',
};

// Default border color mapping for statuses without custom borderColor
const DEFAULT_BORDER_COLORS: Record<TaskStatus, string> = {
  in_process: 'border-[#EDA600]',
  done: 'border-green-500',
  draft: 'border-[#1BBA5E]',
  not_yet: 'border-red-500',
};

export default function TaskStatusBadge({ status, onClick }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const dotColor = config.dotColor || DEFAULT_DOT_COLORS[status];
  const borderColor = config.borderColor || DEFAULT_BORDER_COLORS[status];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color} ${borderColor} hover:opacity-80 transition-opacity border`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {config.label}
    </button>
  );
}
