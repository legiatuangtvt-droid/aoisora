'use client';

import React from 'react';
import { Store } from '@/types/storeInfo';

interface StoreCardProps {
  store: Store;
  onToggle: (storeId: string) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onToggle }) => {
  return (
    <div
      className="flex items-start justify-between px-4 py-5 bg-white border border-[#9B9B9B] rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onToggle(store.id)}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2.5">
        {/* Store Icon */}
        <div className="flex items-center justify-center w-9 h-9 bg-[rgba(33,91,172,0.1)] rounded-[5px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9V21H8V15C8 14.4696 8.21071 13.9609 8.58579 13.5858C8.96086 13.2107 9.46957 13 10 13H14C14.5304 13 15.0391 13.2107 15.4142 13.5858C15.7893 13.9609 16 14.4696 16 15V21H21V9M1 11L12 2L23 11" stroke="#215BAC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Store Info */}
        <div className="flex flex-col gap-1">
          {/* Store Code & Name */}
          <div>
            <span className="text-[13px] text-[#0043A1]">{store.code}</span>
            <h4 className="text-base font-bold text-black">{store.name}</h4>
          </div>

          {/* Manager & Staff Count */}
          <div className="flex items-center gap-4">
            {/* Manager */}
            {store.manager && (
              <div className="flex items-center gap-1.5">
                {/* Avatar with Grade Badge */}
                <div className="relative inline-flex">
                  <div className="w-[15px] h-[15px] rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                    {store.manager.avatar ? (
                      <img
                        src={store.manager.avatar}
                        alt={store.manager.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-400" />
                    )}
                  </div>
                  {/* Grade Badge */}
                  <div
                    className="absolute flex items-center justify-center bg-[#22A6A1] border border-white rounded-full"
                    style={{
                      minWidth: '16px',
                      height: '10px',
                      padding: '0 2px',
                      bottom: '-2px',
                      right: '-8px',
                    }}
                  >
                    <span className="text-[7px] text-white leading-none">{store.manager.jobGrade}</span>
                  </div>
                </div>
                <span className="text-[13px] text-[#6B6B6B] ml-1">{store.manager.name}</span>
              </div>
            )}

            {/* Staff Count */}
            <div className="flex items-center gap-1.5">
              <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5C6.83696 5 6.20107 4.73661 5.73223 4.26777C5.26339 3.79893 5 3.16304 5 2.5C5 1.83696 5.26339 1.20107 5.73223 0.732233C6.20107 0.263392 6.83696 0 7.5 0C8.16304 0 8.79893 0.263392 9.26777 0.732233C9.73661 1.20107 10 1.83696 10 2.5C10 3.16304 9.73661 3.79893 9.26777 4.26777C8.79893 4.73661 8.16304 5 7.5 5ZM7.5 1C6.67 1 6 1.67 6 2.5C6 3.33 6.67 4 7.5 4C8.33 4 9 3.33 9 2.5C9 1.67 8.33 1 7.5 1Z" fill="#6B6B6B"/>
                <path d="M13.5 9C13.22 9 13 8.78 13 8.5C13 8.22 13.22 8 13.5 8C13.78 8 14 7.78 14 7.5C14 6.83696 13.7366 6.20107 13.2678 5.73223C12.7989 5.26339 12.163 5 11.5 5H10.5C10.22 5 10 4.78 10 4.5C10 4.22 10.22 4 10.5 4C11.33 4 12 3.33 12 2.5C12 1.67 11.33 1 10.5 1C10.22 1 10 0.78 10 0.5C10 0.22 10.22 0 10.5 0C11.163 0 11.7989 0.263392 12.2678 0.732233C12.7366 1.20107 13 1.83696 13 2.5C13 3.12 12.78 3.68 12.4 4.12C13.89 4.52 15 5.88 15 7.5C15 8.33 14.33 9 13.5 9ZM1.5 9C0.67 9 0 8.33 0 7.5C0 5.88 1.1 4.52 2.6 4.12C2.23 3.68 2 3.12 2 2.5C2 1.83696 2.26339 1.20107 2.73223 0.732233C3.20107 0.263392 3.83696 0 4.5 0C4.78 0 5 0.22 5 0.5C5 0.78 4.78 1 4.5 1C3.67 1 3 1.67 3 2.5C3 3.33 3.67 4 4.5 4C4.78 4 5 4.22 5 4.5C5 4.78 4.78 5 4.5 5H3.5C2.83696 5 2.20107 5.26339 1.73223 5.73223C1.26339 6.20107 1 6.83696 1 7.5C1 7.78 1.22 8 1.5 8C1.78 8 2 8.22 2 8.5C2 8.78 1.78 9 1.5 9ZM10.5 12H4.5C3.67 12 3 11.33 3 10.5V9.5C3 7.57 4.57 6 6.5 6H8.5C10.43 6 12 7.57 12 9.5V10.5C12 11.33 11.33 12 10.5 12ZM6.5 7C5.83696 7 5.20107 7.26339 4.73223 7.73223C4.26339 8.20107 4 8.83696 4 9.5V10.5C4 10.78 4.22 11 4.5 11H10.5C10.78 11 11 10.78 11 10.5V9.5C11 8.83696 10.7366 8.20107 10.2678 7.73223C9.79893 7.26339 9.16304 7 8.5 7H6.5Z" fill="#6B6B6B"/>
              </svg>
              <span className="text-[13px] text-[#6B6B6B]">Staff: {store.staffCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Icon */}
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(store.id);
        }}
      >
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform duration-200 ${store.isExpanded ? 'rotate-180' : ''}`}
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

export default StoreCard;
