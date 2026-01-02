'use client';

import React from 'react';
import { StoreDepartment } from '@/types/storeInfo';

interface StoreDepartmentCardProps {
  department: StoreDepartment;
  onToggle: (departmentId: string) => void;
  hasConnector?: boolean;
}

// Department icons - inline SVG for dynamic colors
const DepartmentIcon: React.FC<{ icon: string; color: string }> = ({ icon, color }) => {
  const iconMap: Record<string, React.ReactNode> = {
    park: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2L8 8H4L8 14H5L12 22L19 14H16L20 8H16L12 2Z" />
      </svg>
    ),
    control: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
        <path d="M4 7C5.06087 7 6.07828 7.42143 6.82843 8.17157C7.57857 8.92172 8 9.93913 8 11C8 12.0609 7.57857 13.0783 6.82843 13.8284C6.07828 14.5786 5.06087 15 4 15C2.93913 15 1.92172 14.5786 1.17157 13.8284C0.421427 13.0783 0 12.0609 0 11C0 9.93913 0.421427 8.92172 1.17157 8.17157C1.92172 7.42143 2.93913 7 4 7ZM11 0C12.0609 0 13.0783 0.421427 13.8284 1.17157C14.5786 1.92172 15 2.93913 15 4C15 5.06087 14.5786 6.07828 13.8284 6.82843C13.0783 7.57857 12.0609 8 11 8C9.93913 8 8.92172 7.57857 8.17157 6.82843C7.42143 6.07828 7 5.06087 7 4C7 2.93913 7.42143 1.92172 8.17157 1.17157C8.92172 0.421427 9.93913 0 11 0ZM11 14C12.0609 14 13.0783 14.4214 13.8284 15.1716C14.5786 15.9217 15 16.9391 15 18C15 19.0609 14.5786 20.0783 13.8284 20.8284C13.0783 21.5786 12.0609 22 11 22C9.93913 22 8.92172 21.5786 8.17157 20.8284C7.42143 20.0783 7 19.0609 7 18C7 16.9391 7.42143 15.9217 8.17157 15.1716C8.92172 14.4214 9.93913 14 11 14ZM18 7C19.0609 7 20.0783 7.42143 20.8284 8.17157C21.5786 8.92172 22 9.93913 22 11C22 12.0609 21.5786 13.0783 20.8284 13.8284C20.0783 14.5786 19.0609 15 18 15C16.9391 15 15.9217 14.5786 15.1716 13.8284C14.4214 13.0783 14 12.0609 14 11C14 9.93913 14.4214 8.92172 15.1716 8.17157C15.9217 7.42143 16.9391 7 18 7Z" transform="translate(1, 1) scale(0.9)" />
      </svg>
    ),
    rocket: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
        <path d="M12.5 2C12.5 2 8 4 8 10L5 13V16L8 15C8.5 16.5 9.5 17.5 11 18V21H14V18C14 18 17.5 16 18.5 14L21 14V11L18 8C18 4 15.5 2 12.5 2ZM13.5 8C14.33 8 15 8.67 15 9.5C15 10.33 14.33 11 13.5 11C12.67 11 12 10.33 12 9.5C12 8.67 12.67 8 13.5 8ZM5 16L2 19V21H4L7 18" />
      </svg>
    ),
    hr: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
        <path d="M7 2C7 0.896875 7.89687 0 9 0C10.1031 0 11 0.896875 11 2C11 3.10313 10.1031 4 9 4C7.89687 4 7 3.10313 7 2ZM5.5 8.5C5.5 6.56563 7.06563 5 9 5C10.9344 5 12.5 6.56563 12.5 8.5V8.75C12.5 9.16562 12.1656 9.5 11.75 9.5H6.25C5.83437 9.5 5.5 9.16562 5.5 8.75V8.5ZM12.25 2.5C12.25 1.53437 13.0344 0.75 14 0.75C14.9656 0.75 15.75 1.53437 15.75 2.5C15.75 3.46563 14.9656 4.25 14 4.25C13.0344 4.25 12.25 3.46563 12.25 2.5ZM13.1 5.6375C13.3844 5.54688 13.6875 5.5 14 5.5C15.6562 5.5 17 6.84375 17 8.5V8.83438C17 9.20312 16.7 9.5 16.3344 9.5H13.8719C13.9563 9.26562 14 9.0125 14 8.75V8.5C14 7.43437 13.6688 6.44687 13.1 5.6375ZM4.9 5.6375C4.33125 6.45 4 7.43437 4 8.5V8.75C4 9.0125 4.04375 9.26562 4.12813 9.5H1.66563C1.3 9.5 1 9.2 1 8.83438V8.5C1 6.84375 2.34375 5.5 4 5.5C4.3125 5.5 4.61562 5.54688 4.9 5.6375ZM2.25 2.5C2.25 1.53437 3.03437 0.75 4 0.75C4.96562 0.75 5.75 1.53437 5.75 2.5C5.75 3.46563 4.96562 4.25 4 4.25C3.03437 4.25 2.25 3.46563 2.25 2.5ZM0 11.75C0 11.3344 0.334375 11 0.75 11H17.25C17.6656 11 18 11.3344 18 11.75C18 12.1656 17.6656 12.5 17.25 12.5H0.75C0.334375 12.5 0 12.1656 0 11.75Z" transform="translate(3, 5)" />
      </svg>
    ),
  };

  return <>{iconMap[icon] || iconMap.park}</>;
};

const StoreDepartmentCard: React.FC<StoreDepartmentCardProps> = ({
  department,
  onToggle,
  hasConnector = true,
}) => {
  return (
    <div className="relative">
      {/* Connector Line */}
      {hasConnector && (
        <div className="absolute left-0 top-1/2 w-5 h-px bg-[#9B9B9B]" />
      )}

      <div
        className="ml-10 flex items-center justify-between px-4 py-5 bg-white border border-[#9B9B9B] rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggle(department.id)}
      >
        {/* Left Section */}
        <div className="flex items-center gap-2.5">
          {/* Department Icon */}
          <div
            className="flex items-center justify-center w-9 h-9 rounded-[5px]"
            style={{ backgroundColor: department.iconBg }}
          >
            <DepartmentIcon icon={department.icon} color={department.iconColor} />
          </div>

          {/* Department Name */}
          <span className="text-base font-bold text-black">
            {department.name}
          </span>
        </div>

        {/* Expand/Collapse Icon */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(department.id);
          }}
        >
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform duration-200 ${department.isExpanded ? 'rotate-180' : ''}`}
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
    </div>
  );
};

export default StoreDepartmentCard;
