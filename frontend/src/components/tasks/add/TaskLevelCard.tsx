'use client';

import { useState, useRef, useEffect } from 'react';
import { TaskLevel } from '@/types/addTask';

interface TaskLevelCardProps {
  taskLevel: TaskLevel;
  onNameChange: (name: string) => void;
  onAddSubLevel: () => void;
  onDelete: () => void;
  canAddSubLevel: boolean;
  canDelete: boolean;
  children?: React.ReactNode;
}

// Level subtitles
const LEVEL_SUBTITLES: Record<number, string> = {
  1: 'Main task',
  2: 'Sub task',
  3: 'Sub task level 3',
  4: 'Sub task level 4',
  5: 'Sub task level 5',
};

export default function TaskLevelCard({
  taskLevel,
  onNameChange,
  onAddSubLevel,
  onDelete,
  canAddSubLevel,
  canDelete,
  children,
}: TaskLevelCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuAction = (action: 'add' | 'delete') => {
    setShowMenu(false);
    if (action === 'add') {
      onAddSubLevel();
    } else {
      onDelete();
    }
  };

  return (
    <div className="w-[536px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Card Header - Pink background */}
      <div className="flex items-center justify-between px-4 py-3 bg-pink-50 dark:bg-pink-900/20 border-b border-pink-200 dark:border-pink-800">
        {/* Left - Icon, Title, Subtitle */}
        <div className="flex items-center gap-3">
          {/* Level Icon */}
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Task Level {taskLevel.level}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {taskLevel.name || LEVEL_SUBTITLES[taskLevel.level] || 'Sub task'}
            </p>
          </div>
        </div>

        {/* Right - Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              {canAddSubLevel && (
                <button
                  onClick={() => handleMenuAction('add')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-pink-600 dark:text-pink-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add task level {taskLevel.level + 1}
                </button>
              )}
              <button
                onClick={() => handleMenuAction('delete')}
                disabled={!canDelete}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  canDelete
                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete task level {taskLevel.level}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content - Sections */}
      {children && (
        <div className="p-4 space-y-3 bg-white dark:bg-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}
