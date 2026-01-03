'use client';

import React from 'react';
import { HierarchyNode, DepartmentId } from '@/types/userInfo';
import RootUserCard from './RootUserCard';
import DepartmentCard from './DepartmentCard';
import DepartmentHeadCard from './DepartmentHeadCard';
import TeamCard from './TeamCard';
import AddMemberButton from './AddMemberButton';

interface HierarchyTreeProps {
  hierarchy: HierarchyNode;
  onToggleDepartment: (departmentId: DepartmentId) => void;
  onToggleTeam?: (departmentId: DepartmentId, teamId: string) => void;
  onAddMember: () => void;
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  hierarchy,
  onToggleDepartment,
  onToggleTeam,
  onAddMember,
}) => {
  const departmentsCount = hierarchy.departments.length;

  return (
    <div className="flex flex-col">
      {/* Root User Card */}
      <RootUserCard user={hierarchy.rootUser} />

      {/* Departments with connector lines */}
      {departmentsCount > 0 && (
        <div className="relative ml-6 pl-6">
          {hierarchy.departments.map((department, index) => {
            const isLastDept = index === departmentsCount - 1;
            const hasExpandedContent = department.isExpanded && (department.head || (department.teams && department.teams.length > 0));

            return (
              <div key={department.id} className="relative pt-4">
                {/* Vertical line - from top to horizontal connector position */}
                {/* pt-4(16px) + p-4(16px) + half of h-9(18px) = 50px */}
                <div className="absolute -left-6 top-0 h-[50px] w-0.5 bg-[#9B9B9B]" />

                {/* Vertical line - continues down to next sibling (not for last department) */}
                {!isLastDept && (
                  <div className="absolute -left-6 top-[50px] bottom-0 w-0.5 bg-[#9B9B9B]" />
                )}

                {/* Horizontal connector line - from vertical line to card center */}
                <div className="absolute -left-6 top-[50px] w-6 h-0.5 bg-[#9B9B9B]" />

                {/* Department Card */}
                <DepartmentCard
                  department={department}
                  onToggle={onToggleDepartment}
                />

                {/* Expanded Content: Head + Teams */}
                {hasExpandedContent && (
                  <div className="relative ml-6 pl-6 mt-4">
                    {/* Department Head */}
                    {department.head && (
                      <div className="relative pt-2">
                        {/* Vertical line to head */}
                        <div className="absolute -left-6 top-0 h-[42px] w-0.5 bg-[#9B9B9B]" />
                        {/* Horizontal connector */}
                        <div className="absolute -left-6 top-[42px] w-6 h-0.5 bg-[#9B9B9B]" />
                        {/* Continue line if teams exist */}
                        {department.teams && department.teams.length > 0 && (
                          <div className="absolute -left-6 top-[42px] bottom-0 w-0.5 bg-[#9B9B9B]" />
                        )}
                        <DepartmentHeadCard head={department.head} />
                      </div>
                    )}

                    {/* Teams */}
                    {department.teams && department.teams.length > 0 && (
                      <div className="mt-3">
                        {department.teams.map((team, teamIndex) => {
                          const isLastTeam = teamIndex === department.teams!.length - 1;

                          return (
                            <div key={team.id} className="relative pt-3">
                              {/* Vertical line to team */}
                              <div className="absolute -left-6 top-0 h-[36px] w-0.5 bg-[#9B9B9B]" />
                              {/* Horizontal connector */}
                              <div className="absolute -left-6 top-[36px] w-6 h-0.5 bg-[#9B9B9B]" />
                              {/* Continue line to next team */}
                              {!isLastTeam && (
                                <div className="absolute -left-6 top-[36px] bottom-0 w-0.5 bg-[#9B9B9B]" />
                              )}
                              <TeamCard
                                team={team}
                                onToggle={(teamId) => onToggleTeam?.(department.id, teamId)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
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

export default HierarchyTree;
