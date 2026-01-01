'use client';

import { TaskType, TYPE_CONFIG } from '@/types/todoTask';

interface TaskTypeBadgeProps {
  type: TaskType;
}

export default function TaskTypeBadge({ type }: TaskTypeBadgeProps) {
  const config = TYPE_CONFIG[type];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
      <span className={`w-2 h-2 rounded-full ${config.color}`} />
      {config.label}
    </span>
  );
}
