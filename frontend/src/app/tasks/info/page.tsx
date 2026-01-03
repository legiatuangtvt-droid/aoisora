'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DepartmentId, HierarchyNode, Department, Team } from '@/types/userInfo';
import { getSMBUHierarchy, getDepartmentTabs, getDepartmentHierarchy, DepartmentTab } from '@/lib/api';
import UserInfoHeader from '@/components/users/UserInfoHeader';
import DepartmentTabs from '@/components/users/DepartmentTabs';
import HierarchyTree from '@/components/users/HierarchyTree';
import DepartmentDetailView from '@/components/users/DepartmentDetailView';

// Department code to ID mapping (from database)
const DEPARTMENT_CODE_TO_ID: Record<string, number> = {
  'OP': 1,
  'ADMIN': 2,
  'CONTROL': 3,
  'IMPROVEMENT': 4,
  'PLANNING': 5,
  'HR': 6,
};

export default function UserInfoPage() {
  const [activeTab, setActiveTab] = useState<DepartmentId | 'SMBU'>('SMBU');
  const [hierarchy, setHierarchy] = useState<HierarchyNode | null>(null);
  const [departmentTabs, setDepartmentTabs] = useState<DepartmentTab[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch SMBU hierarchy on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [hierarchyData, tabsData] = await Promise.all([
          getSMBUHierarchy(),
          getDepartmentTabs(),
        ]);

        setHierarchy(hierarchyData);
        setDepartmentTabs(tabsData);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to load user information. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleTabChange = useCallback(async (tabId: DepartmentId | 'SMBU') => {
    setActiveTab(tabId);

    if (tabId === 'SMBU') {
      setSelectedDepartment(null);
    } else {
      // Get department ID from code
      const deptCode = tabId.toUpperCase();
      const deptId = DEPARTMENT_CODE_TO_ID[deptCode];

      if (deptId) {
        try {
          setLoading(true);
          const deptData = await getDepartmentHierarchy(deptId);
          setSelectedDepartment(deptData);
        } catch (err) {
          console.error('Error fetching department:', err);
          setError('Failed to load department details.');
        } finally {
          setLoading(false);
        }
      }
    }
  }, []);

  const handleToggleDepartment = useCallback(async (departmentId: DepartmentId) => {
    if (!hierarchy) return;

    const dept = hierarchy.departments.find(d => d.id === departmentId);
    if (!dept) return;

    // If expanding and no teams loaded yet, fetch department details
    if (!dept.isExpanded && !dept.teams) {
      const deptCode = departmentId.toUpperCase();
      const deptId = DEPARTMENT_CODE_TO_ID[deptCode];

      if (deptId) {
        try {
          const deptData = await getDepartmentHierarchy(deptId);
          setHierarchy(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              departments: prev.departments.map(d =>
                d.id === departmentId
                  ? { ...d, ...deptData, isExpanded: true }
                  : d
              ),
            };
          });
          return;
        } catch (err) {
          console.error('Error fetching department details:', err);
        }
      }
    }

    // Just toggle expanded state
    setHierarchy(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        departments: prev.departments.map(d =>
          d.id === departmentId
            ? { ...d, isExpanded: !d.isExpanded }
            : d
        ),
      };
    });
  }, [hierarchy]);

  // Toggle team in selected department (for department detail view)
  const handleToggleTeam = useCallback((teamId: string) => {
    setSelectedDepartment(prev => {
      if (!prev || !prev.teams) return prev;
      return {
        ...prev,
        teams: prev.teams.map((team: Team) =>
          team.id === teamId
            ? { ...team, isExpanded: !team.isExpanded }
            : team
        ),
      };
    });
  }, []);

  // Toggle team in hierarchy (for SMBU overview)
  const handleToggleTeamInHierarchy = useCallback((departmentId: DepartmentId, teamId: string) => {
    setHierarchy(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        departments: prev.departments.map(dept =>
          dept.id === departmentId && dept.teams
            ? {
                ...dept,
                teams: dept.teams.map((team: Team) =>
                  team.id === teamId
                    ? { ...team, isExpanded: !team.isExpanded }
                    : team
                ),
              }
            : dept
        ),
      };
    });
  }, []);

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

  if (loading && !hierarchy) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5055B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  if (error && !hierarchy) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#C5055B] text-white rounded-lg hover:bg-[#A50449]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          tabs={departmentTabs.map(tab => ({
            id: tab.id as DepartmentId | 'SMBU',
            label: tab.label,
          }))}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Content based on active tab */}
        {activeTab === 'SMBU' && hierarchy ? (
          /* SMBU Overview - Hierarchy Tree */
          <HierarchyTree
            hierarchy={hierarchy}
            onToggleDepartment={handleToggleDepartment}
            onToggleTeam={handleToggleTeamInHierarchy}
            onAddMember={handleAddMember}
          />
        ) : selectedDepartment ? (
          /* Department Detail View */
          <DepartmentDetailView
            department={selectedDepartment}
            onToggleTeam={handleToggleTeam}
            onAddMember={handleAddMember}
          />
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5055B]"></div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
