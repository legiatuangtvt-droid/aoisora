'use client';

import React from 'react';
import { DepartmentId } from '@/types/userInfo';

interface Tab {
  id: DepartmentId | 'SMBU';
  label: string;
}

interface DepartmentTabsProps {
  tabs: Tab[];
  activeTab: DepartmentId | 'SMBU';
  onTabChange: (tabId: DepartmentId | 'SMBU') => void;
}

const DepartmentTabs: React.FC<DepartmentTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex items-center overflow-x-auto mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        // Special styling for Admin tab (red text)
        const isAdmin = tab.id === 'Admin';

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-4 py-2.5 text-base font-normal text-center transition-colors border-b-[1.5px] ${
              isActive
                ? 'text-[#C5055B] border-[#C5055B]'
                : isAdmin
                ? 'text-red-500 border-[#6B6B6B] hover:text-red-600'
                : 'text-[#6B6B6B] border-[#6B6B6B] hover:text-gray-800'
            }`}
            style={{
              minWidth: tab.id === 'SMBU' ? '240px' : undefined,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default DepartmentTabs;
