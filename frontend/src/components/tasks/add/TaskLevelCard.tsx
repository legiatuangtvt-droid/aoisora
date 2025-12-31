'use client';

import { useState, useRef, useEffect } from 'react';
import { TaskLevel } from '@/types/addTask';

interface TaskLevelCardProps {
  taskLevel: TaskLevel;
  onNameChange: (name: string) => void;
  onToggleExpand: () => void;
  onSectionToggle: (section: 'A' | 'B' | 'C' | 'D' | null) => void;
  onAddSubLevel: () => void;
  onDelete: () => void;
  canAddSubLevel: boolean;
  canDelete: boolean;
  children?: React.ReactNode;
  validationStatus?: {
    A: boolean;
    B: boolean;
    C: boolean;
    D: boolean;
  };
}

// Section labels
const SECTION_LABELS = {
  A: 'Task information',
  B: 'Instructions',
  C: 'Scope',
  D: 'Approval process',
};

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
  onToggleExpand,
  onSectionToggle,
  onAddSubLevel,
  onDelete,
  canAddSubLevel,
  canDelete,
  children,
  validationStatus = { A: true, B: true, C: true, D: true },
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        {/* Left - Icon, Title, Subtitle */}
        <div className="flex items-center gap-3">
          {/* Level Icon */}
          <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Task level {taskLevel.level}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {LEVEL_SUBTITLES[taskLevel.level] || 'Sub task'}
            </p>
          </div>
        </div>

        {/* Right - Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
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
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  + Add task level {taskLevel.level + 1}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => handleMenuAction('delete')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete task level {taskLevel.level}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Name Input */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={taskLevel.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter task name..."
          maxLength={255}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Accordion Sections */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {(['A', 'B', 'C', 'D'] as const).map((section) => {
          const isExpanded = taskLevel.expandedSection === section;
          const isValid = validationStatus[section];

          return (
            <div key={section}>
              {/* Section Header */}
              <button
                onClick={() => onSectionToggle(isExpanded ? null : section)}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !isValid ? 'bg-red-50 dark:bg-red-900/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Section Letter Badge */}
                  <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                    !isValid
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {section}
                  </span>

                  {/* Section Label */}
                  <span className={`text-sm font-medium ${
                    !isValid
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {SECTION_LABELS[section]}
                  </span>

                  {/* Required indicator */}
                  {!isValid && (
                    <span className="text-xs text-red-500">*Required fields incomplete</span>
                  )}
                </div>

                {/* Expand/Collapse Icon */}
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="px-4 py-4 bg-gray-50 dark:bg-gray-900/50">
                  {children && (
                    <div data-section={section}>
                      {/* Content will be rendered by parent based on section */}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
