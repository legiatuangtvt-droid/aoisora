'use client';

import React from 'react';
import { TaskCategory } from '@/types/taskLibrary';

interface TaskLibraryTabsProps {
  activeTab: TaskCategory;
  onTabChange: (tab: TaskCategory) => void;
}

const TaskLibraryTabs: React.FC<TaskLibraryTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TaskCategory; label: string; icon: React.ReactNode }[] = [
    {
      id: 'office',
      label: 'OFFICE TASKS',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: 'store',
      label: 'STORE TASKS',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-[#C5055B]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5055B]" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TaskLibraryTabs;
