'use client';

import { useState } from 'react';

interface SectionCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function SectionCard({
  id,
  title,
  icon,
  iconBgColor = 'bg-pink-100 dark:bg-pink-900/30',
  children,
  defaultExpanded = false,
}: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="w-[536px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Section Icon */}
          <div className={`w-8 h-8 rounded-lg ${iconBgColor} flex items-center justify-center`}>
            {icon}
          </div>

          {/* Section Title */}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {id}. {title}
          </span>
        </div>

        {/* Expand/Collapse Icon */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}
