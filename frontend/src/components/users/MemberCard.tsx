'use client';

import React from 'react';
import { Employee, JOB_GRADE_COLORS } from '@/types/userInfo';

interface MemberCardProps {
  member: Employee;
  onClick?: (member: Employee) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onClick,
}) => {
  const gradeColor = JOB_GRADE_COLORS[member.jobGrade];

  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => onClick?.(member)}
    >

      {/* Member Card */}
      <div className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
        {/* Avatar with grade badge */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-gray-500 text-sm font-medium ${member.avatar ? 'hidden' : ''}`}>
              {member.name.charAt(0)}
            </span>
          </div>
          {/* Grade badge */}
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
            style={{ backgroundColor: gradeColor }}
          >
            {member.jobGrade}
          </div>
        </div>

        {/* Member info */}
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-[#333333]">
            {member.name}
          </span>
          <span className="text-[12px] text-[#6B6B6B]">
            {member.position}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
