'use client';

import React, { useState } from 'react';
import { StoreStaff } from '@/types/storeInfo';

interface StaffCardProps {
  staff: StoreStaff;
  onViewDetail?: (staff: StoreStaff) => void;
  onEdit?: (staffId: string) => void;
  onDelete?: (staffId: string) => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, onViewDetail, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit?.(staff.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete?.(staff.id);
  };

  // Get grade badge color based on job grade
  const getGradeBadgeColor = (grade: string): string => {
    const gradeColors: Record<string, string> = {
      'G8': '#7C3AED', // Purple - Executive
      'G7': '#2563EB', // Blue - Senior Manager
      'G6': '#0891B2', // Cyan - Manager
      'G5': '#059669', // Emerald - Senior
      'G4': '#22A6A1', // Teal - Mid-level
      'G3': '#22A6A1', // Teal
      'G2': '#F59E0B', // Amber - Junior
      'G1': '#6B7280', // Gray - Entry
    };
    return gradeColors[grade] || '#22A6A1';
  };

  const handleCardClick = () => {
    onViewDetail?.(staff);
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-3 bg-white border border-[#E8E8E8] rounded-[10px] hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Left Section - Staff Info */}
      <div className="flex items-center gap-3">
        {/* Avatar with Grade Badge */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            {staff.avatar ? (
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {staff.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {/* Grade Badge */}
          <div
            className="absolute flex items-center justify-center border-2 border-white rounded-full"
            style={{
              minWidth: '20px',
              height: '14px',
              padding: '0 3px',
              bottom: '-2px',
              right: '-4px',
              backgroundColor: getGradeBadgeColor(staff.jobGrade),
            }}
          >
            <span className="text-[8px] text-white font-medium leading-none">{staff.jobGrade}</span>
          </div>
        </div>

        {/* Staff Details */}
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-[#333333]">{staff.name}</span>
          <span className="text-[12px] text-[#6B6B6B]">{staff.position}</span>
        </div>
      </div>

      {/* Right Section - Menu */}
      <div className="relative">
        <button
          onClick={handleMenuClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="2" cy="2" r="2" fill="#6B6B6B"/>
            <circle cx="8" cy="2" r="2" fill="#6B6B6B"/>
            <circle cx="14" cy="2" r="2" fill="#6B6B6B"/>
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop to close menu */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#E8E8E8] rounded-lg shadow-lg z-20 overflow-hidden">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left text-[13px] text-[#333333] hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-[13px] text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffCard;
