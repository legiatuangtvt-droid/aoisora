'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Employee, JOB_GRADE_COLORS, JOB_GRADE_TITLES } from '@/types/userInfo';

interface DepartmentHeadCardProps {
  head: Employee;
  onClick?: (employee: Employee) => void;
  isReadOnly?: boolean;
}

const DepartmentHeadCard: React.FC<DepartmentHeadCardProps> = ({ head, onClick, isReadOnly = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on menu button or menu
    if ((e.target as HTMLElement).closest('[data-menu]')) {
      return;
    }
    onClick?.(head);
  };
  const gradeColor = JOB_GRADE_COLORS[head.jobGrade];
  const gradeTitle = JOB_GRADE_TITLES[head.jobGrade];

  return (
    <div
      className="relative bg-white rounded-[10px] border border-[#E8E8E8] p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar with grade badge */}
          <div className="relative">
            <div className="w-[60px] h-[60px] rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {head.avatar ? (
                <img
                  src={head.avatar}
                  alt={head.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`text-gray-500 text-xl font-medium ${head.avatar ? 'hidden' : ''}`}>
                {head.name.charAt(0)}
              </span>
            </div>
            {/* Grade badge */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
              style={{ backgroundColor: gradeColor }}
            >
              {head.jobGrade}
            </div>
          </div>

          {/* Head info */}
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold text-[#333333]">
              {head.name}
            </span>
            <span className="text-[14px] text-[#6B6B6B]">
              {head.position}
            </span>
          </div>
        </div>

        {/* Actions menu - Hidden in read-only mode */}
        {!isReadOnly && (
          <div className="relative" ref={menuRef} data-menu>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <svg className="w-5 h-5 text-[#6B6B6B]" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-[#E8E8E8] py-2 z-10 min-w-[160px]">
                <button
                  className="w-full px-4 py-2 text-left text-[14px] text-[#333333] hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setShowMenu(false);
                    console.log('Edit head:', head.id);
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Division
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-[14px] text-[#DC2626] hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setShowMenu(false);
                    console.log('Delete head:', head.id);
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete Division
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentHeadCard;
