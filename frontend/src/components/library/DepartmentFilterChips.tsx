'use client';

import React from 'react';
import { DepartmentType } from '@/types/taskLibrary';

interface DepartmentFilterChipsProps {
  departments: DepartmentType[];
  selectedDepartments: DepartmentType[];
  onDepartmentToggle: (department: DepartmentType) => void;
}

const DepartmentFilterChips: React.FC<DepartmentFilterChipsProps> = ({
  departments,
  selectedDepartments,
  onDepartmentToggle,
}) => {
  const departmentIcons: Record<DepartmentType, React.ReactNode> = {
    Admin: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    HR: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    Legal: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {departments.map((dept) => {
        const isSelected = selectedDepartments.includes(dept);
        return (
          <button
            key={dept}
            onClick={() => onDepartmentToggle(dept)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-pink-100 text-[#C5055B] border border-[#C5055B]'
                : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
            }`}
          >
            {departmentIcons[dept]}
            {dept}
          </button>
        );
      })}
    </div>
  );
};

export default DepartmentFilterChips;
