'use client';

import React, { useState } from 'react';
import { Team, Employee } from '@/types/userInfo';
import MemberCard from './MemberCard';

interface TeamCardProps {
  team: Team;
  onToggle?: (teamId: string) => void;
  onMemberClick?: (member: Employee) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onToggle,
  onMemberClick,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = () => {
    onToggle?.(team.id);
  };

  // Get unique grades for display
  const gradeDisplay = team.gradeRange;
  const membersCount = team.members.length;

  return (
    <div className="flex flex-col">

      {/* Team Card */}
      <div className="bg-white rounded-[10px] border border-[#E8E8E8] overflow-hidden">
        {/* Team Header */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
          onClick={handleToggle}
        >
          <div className="flex items-center gap-3">
            {/* Team Icon */}
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center"
              style={{ backgroundColor: team.iconBg }}
            >
              {team.icon === 'users' ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={team.iconColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ) : team.icon === 'shield' ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={team.iconColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill={team.iconColor}
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              )}
            </div>

            {/* Team Info */}
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-[#333333]">
                {team.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#6B6B6B]">
                  {team.members.length} Members
                </span>
                <span className="text-[13px] text-[#6B6B6B]">•</span>
                <span className="text-[13px] text-[#6B6B6B]">{gradeDisplay}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dropdown menu */}
            <div className="relative">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      console.log('Edit team:', team.id);
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      console.log('Delete team:', team.id);
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

            {/* Expand/Collapse indicator */}
            <svg
              className={`w-5 h-5 text-[#6B6B6B] transition-transform ${team.isExpanded ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Expanded Members List */}
        {team.isExpanded && membersCount > 0 && (
          <div className="px-4 pb-4 border-t border-[#E8E8E8]">
            <div className="relative ml-6 pl-6">
              {team.members.map((member, index) => {
                const isFirstMember = index === 0;
                const isLastMember = index === membersCount - 1;
                // MemberCard has p-3 (12px) + h-10 avatar (40px) / 2 = 32px from top of card to center
                // pt-3 = 12px, so connector position = 12 + 12 + 20 = 44px from container top
                const connectorTop = 44;

                return (
                  <div key={member.id} className="relative pt-3">
                    {/* Vertical line - from top of container (or border-t for first) to horizontal connector */}
                    <div
                      className="absolute -left-6 w-0.5 bg-[#9B9B9B]"
                      style={{
                        top: isFirstMember ? -0 : 0,
                        height: `${connectorTop}px`,
                      }}
                    />

                    {/* Vertical line - continues down to next sibling (not for last member) */}
                    {!isLastMember && (
                      <div
                        className="absolute -left-6 bottom-0 w-0.5 bg-[#9B9B9B]"
                        style={{ top: `${connectorTop}px` }}
                      />
                    )}

                    {/* Horizontal connector line - from vertical line to card */}
                    <div
                      className="absolute -left-6 w-6 h-0.5 bg-[#9B9B9B]"
                      style={{ top: `${connectorTop}px` }}
                    />

                    {/* Member Card */}
                    <MemberCard member={member} onClick={onMemberClick} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
