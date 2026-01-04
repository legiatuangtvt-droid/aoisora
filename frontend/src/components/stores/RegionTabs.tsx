'use client';

import React from 'react';
import { RegionId, RegionTab } from '@/types/storeInfo';

interface RegionTabsProps {
  tabs: RegionTab[];
  activeTab: RegionId;
  onTabChange: (tabId: RegionId) => void;
}

const RegionTabs: React.FC<RegionTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex items-center overflow-x-auto mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-4 py-2.5 text-base font-normal text-center transition-colors border-b-[1.5px] ${
              isActive
                ? 'text-[#C5055B] border-[#C5055B]'
                : 'text-[#6B6B6B] border-[#6B6B6B] hover:text-gray-800'
            }`}
            style={{
              minWidth: tab.id.startsWith('SMBU') ? '240px' : undefined,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default RegionTabs;
