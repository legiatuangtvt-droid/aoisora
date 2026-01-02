'use client';

import React from 'react';
import { HierarchyNode, DepartmentId } from '@/types/userInfo';
import RootUserCard from './RootUserCard';
import DepartmentCard from './DepartmentCard';
import AddMemberButton from './AddMemberButton';

interface HierarchyTreeProps {
  hierarchy: HierarchyNode;
  onToggleDepartment: (departmentId: DepartmentId) => void;
  onAddMember: () => void;
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  hierarchy,
  onToggleDepartment,
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
