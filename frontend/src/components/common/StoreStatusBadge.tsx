'use client';

/**
 * Store Status Badge Component
 *
 * Displays the execution status of a task at store level.
 * Used in: Task Detail > Store Progress Table, Store Task List
 */

// Store execution statuses
export type StoreStatus = 'not_yet' | 'on_progress' | 'done_pending' | 'done' | 'unable' | 'overdue';

interface StatusConfig {
  label: string;
  bgColor: string;
  color: string;
  dotColor: string;
  borderColor: string;
}

// Status configuration with colors matching the design system
const STATUS_CONFIG: Record<StoreStatus, StatusConfig> = {
  not_yet: {
    label: 'Not Started',
    bgColor: 'bg-gray-100',
    color: 'text-gray-700',
    dotColor: 'bg-gray-500',
    borderColor: '#9CA3AF', // gray-400
  },
  on_progress: {
    label: 'In Progress',
    bgColor: 'bg-blue-50',
    color: 'text-blue-700',
    dotColor: 'bg-blue-500',
    borderColor: '#3B82F6', // blue-500
  },
  done_pending: {
    label: 'Pending Check',
    bgColor: 'bg-yellow-50',
    color: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
    borderColor: '#EAB308', // yellow-500
  },
  done: {
    label: 'Completed',
    bgColor: 'bg-green-50',
    color: 'text-green-700',
    dotColor: 'bg-green-500',
    borderColor: '#22C55E', // green-500
  },
  unable: {
    label: 'Unable',
    bgColor: 'bg-orange-50',
    color: 'text-orange-700',
    dotColor: 'bg-orange-500',
    borderColor: '#F97316', // orange-500
  },
  overdue: {
    label: 'Overdue',
    bgColor: 'bg-red-50',
    color: 'text-red-700',
    dotColor: 'bg-red-500',
    borderColor: '#EF4444', // red-500
  },
};

interface StoreStatusBadgeProps {
  status: StoreStatus;
  onClick?: () => void;
  compact?: boolean;
  showIcon?: boolean;
}

export default function StoreStatusBadge({
  status,
  onClick,
  compact = false,
  showIcon = true,
}: StoreStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  // Compact version for smaller displays
  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bgColor} ${config.color}`}
        style={{ border: `0.5px solid ${config.borderColor}` }}
      >
        {showIcon && <span className={`w-1 h-1 rounded-full ${config.dotColor}`} />}
        {config.label}
      </span>
    );
  }

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-2 px-3 py-0 h-[25px] rounded-[26px] text-[13px] font-medium ${config.bgColor} ${config.color} hover:opacity-80 transition-opacity`}
        style={{ border: `0.5px solid ${config.borderColor}` }}
      >
        {showIcon && <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />}
        {config.label}
      </button>
    );
  }

  // Default: non-interactive span
  return (
    <span
      className={`inline-flex items-center justify-center gap-2 px-3 py-0 h-[25px] rounded-[26px] text-[13px] font-medium ${config.bgColor} ${config.color}`}
      style={{ border: `0.5px solid ${config.borderColor}` }}
    >
      {showIcon && <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />}
      {config.label}
    </span>
  );
}

// Export config for use in other components
export { STATUS_CONFIG };

// Helper function to get status label
export function getStoreStatusLabel(status: StoreStatus): string {
  return STATUS_CONFIG[status]?.label || status;
}

// Helper function to get status color (for use in charts, etc.)
export function getStoreStatusColor(status: StoreStatus): string {
  return STATUS_CONFIG[status]?.borderColor || '#9CA3AF';
}
