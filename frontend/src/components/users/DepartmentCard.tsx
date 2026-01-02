'use client';

import React from 'react';
import { Department, DepartmentId } from '@/types/userInfo';

interface DepartmentCardProps {
  department: Department;
  onToggle: (departmentId: DepartmentId) => void;
  showConnector?: boolean;
}

// Department icons
const DepartmentIcon: React.FC<{ icon: string; color: string }> = ({ icon, color }) => {
  const iconMap: Record<string, React.ReactNode> = {
    admin: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>
    ),
    cog: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
      </svg>
    ),
    controller: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="8" cy="12" r="2" fill="white" />
      </svg>
    ),
    rocket: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2.5c0 0-6 6-6 11.5 0 3.31 2.69 6 6 6s6-2.69 6-6c0-5.5-6-11.5-6-11.5zm0 15c-1.93 0-3.5-1.57-3.5-3.5 0-1.58 1.06-3.64 2.11-5.32l1.39 1.39-1.39 1.39 1.41 1.41 1.39-1.39 1.39 1.39c-.18.38-.29.8-.29 1.23 0 1.93-1.57 3.5-3.5 3.5z" />
      </svg>
    ),
    users: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    crown: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z" />
      </svg>
    ),
  };

  return <>{iconMap[icon] || iconMap.admin}</>;
};

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onToggle,
  showConnector = true,
}) => {
  return (
    <div className="relative">
      {/* Connector line */}
      {showConnector && (
        <div className="absolute -left-5 top-1/2 w-5 h-px bg-[#9B9B9B]" />
      )}

      <div
        className="bg-white border border-[#9B9B9B] rounded-[10px] p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggle(department.id)}
      >
        <div className="flex items-center gap-3">
          {/* Department Icon */}
          <div
            className="w-9 h-9 rounded-[5px] flex items-center justify-center"
            style={{ backgroundColor: department.iconBg }}
          >
            <DepartmentIcon icon={department.icon} color={department.iconColor} />
          </div>

          {/* Department Info */}
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-black">{department.name}</span>
            <div className="flex items-center gap-2 text-[13px] text-[#6B6B6B]">
              <span>{department.memberCount} Members</span>
              <span className="w-[5px] h-[5px] rounded-full bg-[#6B6B6B]" />
              <span>{department.gradeRange}</span>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <button className="p-2 rounded-full">
          <svg
            className={`w-6 h-6 text-black transition-transform duration-300 ${
              department.isExpanded ? '' : 'rotate-180'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;
