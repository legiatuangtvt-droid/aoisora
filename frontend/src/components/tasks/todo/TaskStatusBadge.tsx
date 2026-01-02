'use client';

import { TaskStatus, STATUS_CONFIG } from '@/types/todoTask';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  onClick?: () => void;
  compact?: boolean; // Smaller version for mobile timeline
}

// Default dot color mapping for statuses without custom dotColor
const DEFAULT_DOT_COLORS: Record<TaskStatus, string> = {
  in_process: 'bg-[#EDA600]',
  done: 'bg-[#297EF6]',
  draft: 'bg-[#1BBA5E]',
  not_yet: 'bg-red-500',
};

// Default hex border colors for inline style
const DEFAULT_HEX_BORDER_COLORS: Record<TaskStatus, string> = {
  in_process: '#EDA600',
  done: '#297EF6',
  draft: '#1BBA5E',
  not_yet: '#F44336',
};

export default function TaskStatusBadge({ status, onClick, compact = false }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const dotColor = config.dotColor || DEFAULT_DOT_COLORS[status];
  const hexBorderColor = config.hexBorderColor || DEFAULT_HEX_BORDER_COLORS[status];

  // Compact version for mobile
  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bgColor} ${config.color}`}
        style={{ border: `0.5px solid ${hexBorderColor}` }}
      >
        <span className={`w-1 h-1 rounded-full ${dotColor}`} />
        {config.label}
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-3 py-0 h-[25px] rounded-[26px] text-[13px] font-normal ${config.bgColor} ${config.color} hover:opacity-80 transition-opacity`}
      style={{ border: `0.5px solid ${hexBorderColor}` }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {config.label}
    </button>
  );
}
