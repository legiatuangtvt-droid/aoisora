'use client';

import React from 'react';
import { HierarchyNode, DepartmentId, Employee } from '@/types/userInfo';
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
  onMemberClick?: (member: Employee) => void;
  isReadOnly?: boolean;
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  hierarchy,
  onToggleDepartment,
  onToggleTeam,
  onAddMember,
  onMemberClick,
  isReadOnly = false,
}) => {
  const departmentsCount = hierarchy.departments.length;

  return (
    <div className="flex flex-col">
      {/* Root User Card - only render if rootUser exists */}
      {hierarchy.rootUser && (
        <RootUserCard user={hierarchy.rootUser} onClick={onMemberClick} isReadOnly={isReadOnly} />
      )}

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
                {hasExpandedContent && (() => {
                  const hasHead = !!department.head;
                  const teamsCount = department.teams?.length || 0;
                  const hasTeams = teamsCount > 0;

                  // Calculate total items for vertical line height
                  // Each item: pt-4 (16px) + connector position
                  // Head connector at 62px, Team connector at 48px
                  const headHeight = hasHead ? 16 + 62 : 0; // pt-4 + connector position
                  const teamsHeight = hasTeams ? teamsCount * (16 + 48) : 0; // each team: pt-4 + connector

                  // If only head, line ends at head connector (62px from head container top)
                  // If teams exist, line ends at last team connector
                  let verticalLineHeight = 0;
                  if (hasHead && !hasTeams) {
                    verticalLineHeight = 16 + 62; // pt-4 + connector to center of head
                  } else if (hasTeams) {
                    // Head section height (if exists) + teams before last + last team connector position
                    const headSectionHeight = hasHead ? (16 + 60 + 16 + 68) : 0; // pt-4 + p-4 + avatar(60) + p-4 + border
                    const teamsBeforeLastHeight = (teamsCount - 1) * (16 + 52 + 12 + 12); // pt-4 + py-3 + icon + py-3 + some padding
                    verticalLineHeight = headSectionHeight + (teamsCount - 1) * 80 + 16 + 48;
                  }

                  return (
                    <div className="relative ml-12">
                      {/* Department Head */}
                      {hasHead && (
                        <div className="relative pt-4 pl-6">
                          {/* Vertical line segment to head */}
                          <div className="absolute left-0 top-0 w-0.5 bg-[#9B9B9B]" style={{ height: hasTeams ? '100%' : '62px' }} />
                          {/* Horizontal connector to head */}
                          <div className="absolute left-0 top-[62px] w-6 h-0.5 bg-[#9B9B9B]" />
                          <DepartmentHeadCard head={department.head!} onClick={onMemberClick} />
                        </div>
                      )}

                      {/* Teams */}
                      {hasTeams && (
                        <div>
                          {department.teams!.map((team, teamIndex) => {
                            const isFirstTeam = teamIndex === 0;
                            const isLastTeam = teamIndex === teamsCount - 1;

                            return (
                              <div key={team.id} className="relative pt-4 pl-6">
                                {/* Vertical line segment - connects from previous item to this connector */}
                                <div
                                  className="absolute left-0 top-0 w-0.5 bg-[#9B9B9B]"
                                  style={{ height: '48px' }}
                                />
                                {/* Vertical line continues to next item (not for last) */}
                                {!isLastTeam && (
                                  <div className="absolute left-0 top-[48px] bottom-0 w-0.5 bg-[#9B9B9B]" />
                                )}
                                {/* Horizontal connector to team */}
                                <div className="absolute left-0 top-[48px] w-6 h-0.5 bg-[#9B9B9B]" />
                                <TeamCard
                                  team={team}
                                  onToggle={(teamId) => onToggleTeam?.(department.id, teamId)}
                                  onMemberClick={onMemberClick}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Member Button - Hidden in read-only mode */}
      {!isReadOnly && (
        <div className="mt-6 ml-12">
          <AddMemberButton onClick={onAddMember} />
        </div>
      )}
    </div>
  );
};

export default HierarchyTree;
