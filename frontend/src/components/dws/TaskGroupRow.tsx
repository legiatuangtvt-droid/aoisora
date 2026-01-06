'use client';

import { useRef, useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import { RETask } from '@/types/reTask';

interface TaskGroupRowProps {
  groupNumber: number;
  groupName: string;
  groupColor: string;
  groupBgColor: string;
  tasks: RETask[];
  onAddTask?: () => void;
  onEditGroup?: () => void;
  onTaskClick?: (task: RETask) => void;
}

export default function TaskGroupRow({
  groupNumber,
  groupName,
  groupColor,
  groupBgColor,
  tasks,
  onAddTask,
  onEditGroup,
  onTaskClick,
}: TaskGroupRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Check scroll position for fade indicators
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftFade(container.scrollLeft > 0);
      setShowRightFade(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [tasks]);

  // Generate task display ID (e.g., 1101, 1102 based on group number)
  const getTaskDisplayId = (index: number) => {
    return `${groupNumber}${String(index + 1).padStart(2, '0')}`;
  };

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Group Header (Left Panel) */}
      <div
        className="flex-shrink-0 w-[120px] p-4 flex flex-col justify-center"
        style={{
          backgroundColor: groupBgColor,
          borderLeft: `4px solid ${groupColor}`,
        }}
      >
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Group Task {groupNumber}
        </span>
        <span
          className="text-2xl font-bold mb-2"
          style={{ color: groupColor }}
        >
          {groupName}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Total Tasks: {tasks.length}
        </span>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 relative bg-gray-50 dark:bg-gray-900/50">
        {/* Left fade indicator */}
        {showLeftFade && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 dark:from-gray-900/50 to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700"
          style={{ scrollBehavior: 'smooth' }}
        >
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center w-full py-4 text-sm text-gray-500 dark:text-gray-400">
              No tasks in this group
            </div>
          ) : (
            tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                sequenceNumber={index + 1}
                taskName={task.taskName}
                taskId={getTaskDisplayId(index)}
                groupColor={groupColor}
                onClick={() => onTaskClick?.(task)}
              />
            ))
          )}
        </div>

        {/* Right fade indicator */}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-900/50 to-transparent z-10 pointer-events-none" />
        )}
      </div>

      {/* Action Buttons (Right Panel) */}
      <div className="flex-shrink-0 w-12 flex flex-col items-center justify-center gap-2 p-2 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        {/* Add Button */}
        <button
          onClick={onAddTask}
          className="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          title="Add task to this group"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        {/* Edit Button */}
        <button
          onClick={onEditGroup}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
          title="Edit group"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
