'use client';

import React from 'react';
import { Department } from '@/types/userInfo';
import DepartmentHeadCard from './DepartmentHeadCard';
import TeamCard from './TeamCard';
import AddMemberButton from './AddMemberButton';

interface DepartmentDetailViewProps {
  department: Department;
  onToggleTeam: (teamId: string) => void;
  onAddMember: () => void;
}

const DepartmentDetailView: React.FC<DepartmentDetailViewProps> = ({
  department,
  onToggleTeam,
  onAddMember,
}) => {
  return (
    <div className="relative">
      {/* Vertical connector line from top to bottom */}
      {department.teams && department.teams.length > 0 && (
        <div
          className="absolute left-[21px] w-px bg-[#9B9B9B]"
          style={{
            top: '80px',
            bottom: '81px',
          }}
        />
      )}

      {/* Department Head Card */}
      {department.head && (
        <DepartmentHeadCard head={department.head} />
      )}

      {/* Teams */}
      {department.teams && department.teams.length > 0 && (
        <div className="mt-4 ml-10 space-y-4">
          {department.teams.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              onToggle={onToggleTeam}
              showConnector={true}
              isLast={index === department.teams!.length - 1}
            />
          ))}
        </div>
      )}

      {/* Add Member Button */}
      <div className="mt-6 ml-10">
        <AddMemberButton onClick={onAddMember} />
      </div>
    </div>
  );
};

export default DepartmentDetailView;
