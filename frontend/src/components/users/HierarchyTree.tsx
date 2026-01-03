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
                  <div className="relative ml-6 pl-6">
                    {/* Main vertical line connecting all expanded items */}
                    <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-[#9B9B9B]" />

                    {/* Department Head */}
                    {department.head && (
                      <div className="relative pt-4">
                        {/* Horizontal connector to head */}
                        {/* pt-4(16px) + p-4(16px) + half of avatar(30px) = 62px */}
                        <div className="absolute -left-6 top-[62px] w-6 h-0.5 bg-[#9B9B9B]" />
                        <DepartmentHeadCard head={department.head} />
                      </div>
                    )}

                    {/* Teams */}
                    {department.teams && department.teams.length > 0 && (
                      <div>
                        {department.teams.map((team, teamIndex) => {
                          const isLastTeam = teamIndex === department.teams!.length - 1;

                          return (
                            <div key={team.id} className="relative pt-4">
                              {/* Horizontal connector to team */}
                              {/* pt-4(16px) + py-3(12px) + half of icon(20px) = 48px */}
                              <div className="absolute -left-6 top-[48px] w-6 h-0.5 bg-[#9B9B9B]" />
                              {/* Hide the main vertical line after last team */}
                              {isLastTeam && (
                                <div className="absolute -left-6 top-[48px] bottom-0 w-1 bg-[#F8F8F8]" />
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

                    {/* Hide vertical line after last item if no teams */}
                    {department.head && (!department.teams || department.teams.length === 0) && (
                      <div className="absolute -left-6 top-[62px] bottom-0 w-1 bg-[#F8F8F8]" />
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
