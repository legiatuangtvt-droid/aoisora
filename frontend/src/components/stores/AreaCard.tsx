'use client';

import React from 'react';
import { Area } from '@/types/storeInfo';

interface AreaCardProps {
  area: Area;
  onToggle: (areaId: string) => void;
}

const AreaCard: React.FC<AreaCardProps> = ({ area, onToggle }) => {
  return (
    <div
      className="flex items-start justify-between px-4 py-5 bg-[#E5F0FF] border border-[#9B9B9B] rounded-[10px] cursor-pointer hover:bg-[#d9e8fc] transition-colors"
      onClick={() => onToggle(area.id)}
    >
      {/* Left Section */}
      <div className="flex flex-col gap-1">
        {/* Area Name */}
        <h3 className="text-2xl font-bold text-black">
          {area.name}
        </h3>

        {/* Store Count */}
        <div className="flex items-center gap-1.5">
          {/* Store Icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.75 5.25V12.25H5.25V9.625C5.25 9.16041 5.43437 8.71479 5.76256 8.38661C6.09075 8.05842 6.53587 7.875 7 7.875C7.46413 7.875 7.90925 8.05842 8.23744 8.38661C8.56563 8.71479 8.75 9.16041 8.75 9.625V12.25H12.25V5.25M0.583333 6.41667L7 1.16667L13.4167 6.41667" stroke="#6B6B6B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[13px] text-[#6B6B6B]">
            {area.storeCount} Stores
          </span>
        </div>
      </div>

      {/* Expand/Collapse Icon */}
      <button
        className="p-2 rounded-full hover:bg-white/50 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(area.id);
        }}
      >
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform duration-200 ${area.isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default AreaCard;
