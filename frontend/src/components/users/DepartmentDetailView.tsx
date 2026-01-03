'use client';

import React from 'react';
import { Department, Employee } from '@/types/userInfo';
import DepartmentHeadCard from './DepartmentHeadCard';
import TeamCard from './TeamCard';
import AddMemberButton from './AddMemberButton';

interface DepartmentDetailViewProps {
  department: Department;
  onToggleTeam: (teamId: string) => void;
  onAddMember: () => void;
  onMemberClick?: (member: Employee) => void;
}

const DepartmentDetailView: React.FC<DepartmentDetailViewProps> = ({
  department,
  onToggleTeam,
  onAddMember,
  onMemberClick,
}) => {
  const teamsCount = department.teams?.length || 0;

  return (
    <div className="flex flex-col">
      {/* Department Head Card */}
      {department.head && (
        <DepartmentHeadCard head={department.head} />
      )}

      {/* Teams with connector lines */}
      {department.teams && teamsCount > 0 && (
        <div className="relative ml-6 pl-6">
          {department.teams.map((team, index) => {
            const isLastTeam = index === teamsCount - 1;

            return (
              <div key={team.id} className="relative pt-4">
                {/* Vertical line - from top to horizontal connector position */}
                {/* pt-4(16px) + py-3(12px) + half of h-10(20px) = 48px */}
                <div className="absolute -left-6 top-0 h-[48px] w-0.5 bg-[#9B9B9B]" />

                {/* Vertical line - continues down to next sibling (not for last team) */}
                {!isLastTeam && (
                  <div className="absolute -left-6 top-[48px] bottom-0 w-0.5 bg-[#9B9B9B]" />
                )}

                {/* Horizontal connector line - from vertical line to card center */}
                <div className="absolute -left-6 top-[48px] w-6 h-0.5 bg-[#9B9B9B]" />

                {/* Team Card */}
                <TeamCard
                  team={team}
                  onToggle={onToggleTeam}
                  onMemberClick={onMemberClick}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Add Member Button */}
      <div className="mt-6 ml-12">
        <AddMemberButton onClick={onAddMember} />
      </div>
    </div>
  );
};

export default DepartmentDetailView;
