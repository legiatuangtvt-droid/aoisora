'use client';

interface TaskCardProps {
  sequenceNumber: number;
  taskName: string;
  taskId: string;
  groupColor: string;
  onClick?: () => void;
}

export default function TaskCard({
  sequenceNumber,
  taskName,
  taskId,
  groupColor,
  onClick,
}: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 hover:-translate-y-0.5 group"
      style={{
        '--hover-border-color': groupColor,
      } as React.CSSProperties}
    >
      {/* Sequence Number Header */}
      <div className="h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {sequenceNumber}
        </span>
      </div>

      {/* Task Name Body */}
      <div className="h-[60px] px-1.5 py-2 flex items-center justify-center">
        <p className="text-xs text-gray-800 dark:text-gray-200 text-center line-clamp-3 leading-tight">
          {taskName}
        </p>
      </div>

      {/* Task ID Footer */}
      <div className="h-6 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t border-gray-200 dark:border-gray-600">
        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
          {taskId}
        </span>
      </div>
    </div>
  );
}
