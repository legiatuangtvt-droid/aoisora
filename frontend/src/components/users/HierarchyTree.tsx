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
  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-[21px] top-[90px] bottom-[61px] w-px bg-[#9B9B9B]" />

      {/* Root User Card */}
      <RootUserCard user={hierarchy.rootUser} />

      {/* Departments */}
      <div className="mt-4 ml-10 space-y-4">
        {hierarchy.departments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onToggle={onToggleDepartment}
            showConnector={true}
          />
        ))}
      </div>

      {/* Add Member Button */}
      <div className="mt-6 ml-10">
        <AddMemberButton onClick={onAddMember} />
      </div>
    </div>
  );
};

export default HierarchyTree;
