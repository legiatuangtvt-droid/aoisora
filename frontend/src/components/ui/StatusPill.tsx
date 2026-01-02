import React from 'react';
import { TaskStatus, STATUS_CONFIG } from '@/types/tasks';

interface StatusPillProps {
  status: TaskStatus;
  className?: string;
}

export default function StatusPill({ status, className = '' }: StatusPillProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {config.label}
    </span>
  );
}
