'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Employee, JOB_GRADE_COLORS } from '@/types/userInfo';

interface RootUserCardProps {
  user: Employee;
  onMenuAction?: (action: 'edit' | 'delete', user: Employee) => void;
  onClick?: (user: Employee) => void;
  isReadOnly?: boolean;
}

const RootUserCard: React.FC<RootUserCardProps> = ({ user, onMenuAction, onClick, isReadOnly = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const gradeColor = JOB_GRADE_COLORS[user.jobGrade];

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on menu button or menu
    if ((e.target as HTMLElement).closest('[data-menu]')) {
      return;
    }
    onClick?.(user);
  };

  return (
    <div
      className="bg-white border border-[#9B9B9B] rounded-[10px] p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-3">
        {/* Avatar with Grade Badge */}
        <div className="relative">
          <div className="w-[60px] h-[60px] rounded-full bg-gray-200 overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-medium">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          {/* Grade Badge */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full border-2 border-white text-[13px] text-white text-center min-w-[32px]"
            style={{ backgroundColor: gradeColor }}
          >
            {user.jobGrade}
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-1">
          <span className="text-base font-bold text-black">{user.name}</span>
          <div className="flex items-center gap-2 text-[13px] text-[#6B6B6B]">
            <span>{user.sapCode}</span>
            <span className="w-[5px] h-[5px] rounded-full bg-[#6B6B6B]" />
            <span>{user.position}</span>
          </div>
        </div>
      </div>

      {/* Menu Button - Hidden in read-only mode */}
      {!isReadOnly && (
        <div className="relative" ref={menuRef} data-menu>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-[#132B45]" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="2" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="14" r="1.5" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              <button
                onClick={() => {
                  onMenuAction?.('edit', user);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-4 h-4 text-[#C5055B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit division
              </button>
              <button
                onClick={() => {
                  onMenuAction?.('delete', user);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-4 h-4 text-[#C5055B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete division
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RootUserCard;
