'use client';

import React, { useState, useMemo } from 'react';
import { DepartmentId, HierarchyNode, Department } from '@/types/userInfo';
import { smbuHierarchy, departmentTabs, toggleDepartmentExpansion, getDepartmentById, toggleTeamExpansion } from '@/data/mockUserInfo';
import UserInfoHeader from '@/components/users/UserInfoHeader';
import DepartmentTabs from '@/components/users/DepartmentTabs';
import HierarchyTree from '@/components/users/HierarchyTree';
import DepartmentDetailView from '@/components/users/DepartmentDetailView';

export default function UserInfoPage() {
  const [activeTab, setActiveTab] = useState<DepartmentId | 'SMBU'>('SMBU');
  const [hierarchy, setHierarchy] = useState<HierarchyNode>(smbuHierarchy);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const handleTabChange = (tabId: DepartmentId | 'SMBU') => {
    setActiveTab(tabId);

    if (tabId === 'SMBU') {
      setSelectedDepartment(null);
    } else {
      const dept = getDepartmentById(tabId);
      setSelectedDepartment(dept || null);
    }
  };

  const handleToggleDepartment = (departmentId: DepartmentId) => {
    setHierarchy(prev => toggleDepartmentExpansion(prev, departmentId));
  };

  const handleToggleTeam = (teamId: string) => {
    if (selectedDepartment) {
      setSelectedDepartment(prev => prev ? toggleTeamExpansion(prev, teamId) : null);
    }
  };

  const handlePermissionsClick = () => {
    // TODO: Implement permissions modal
    console.log('Open permissions modal');
  };

  const handleImportClick = () => {
    // TODO: Implement import Excel modal
    console.log('Open import Excel modal');
  };

  const handleAddMember = () => {
    // TODO: Implement add member modal
    console.log('Open add member modal');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <UserInfoHeader
          onPermissionsClick={handlePermissionsClick}
          onImportClick={handleImportClick}
        />

        {/* Department Tabs */}
        <DepartmentTabs
          tabs={departmentTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Content based on active tab */}
        {activeTab === 'SMBU' ? (
          /* SMBU Overview - Hierarchy Tree */
          <HierarchyTree
            hierarchy={hierarchy}
            onToggleDepartment={handleToggleDepartment}
            onAddMember={handleAddMember}
          />
        ) : selectedDepartment ? (
          /* Department Detail View */
          <DepartmentDetailView
            department={selectedDepartment}
            onToggleTeam={handleToggleTeam}
            onAddMember={handleAddMember}
          />
        ) : null}
      </div>
    </div>
  );
}
