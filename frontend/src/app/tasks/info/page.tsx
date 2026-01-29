'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DepartmentId, HierarchyNode, Department, Team, Employee } from '@/types/userInfo';
import {
  getSMBUHierarchy,
  getDepartmentTabs,
  getDepartmentHierarchy,
  getDepartmentsList,
  getTeamsList,
  createTeam,
  createMember,
  getStaffDetail,
  DepartmentTab,
  DepartmentListItem,
  TeamListItem,
} from '@/lib/api';
import UserInfoHeader from '@/components/users/UserInfoHeader';
import DepartmentTabs from '@/components/users/DepartmentTabs';
import HierarchyTree from '@/components/users/HierarchyTree';
import DepartmentDetailView from '@/components/users/DepartmentDetailView';
import AddTeamMemberModal, { TeamFormData, MemberFormData } from '@/components/users/AddTeamMemberModal';
import EmployeeDetailModal from '@/components/users/EmployeeDetailModal';
import PermissionsModal from '@/components/users/PermissionsModal';
import ImportExcelModal from '@/components/users/ImportExcelModal';
import { getRolesList, getUsersList, savePermissions, importUsersFromExcel, RoleItem, UserItem } from '@/lib/api';
import { UserInfoPageSkeleton, HierarchySkeleton } from '@/components/ui/Skeleton';

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
  const { user } = useAuth();

  // Only admin can create/edit/delete - others are view-only
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SYSTEM_ADMIN';

  const [activeTab, setActiveTab] = useState<DepartmentId | 'SMBU'>('SMBU');
  const [hierarchy, setHierarchy] = useState<HierarchyNode | null>(null);
  const [departmentTabs, setDepartmentTabs] = useState<DepartmentTab[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentsList, setDepartmentsList] = useState<DepartmentListItem[]>([]);
  const [teamsList, setTeamsList] = useState<TeamListItem[]>([]);

  // Employee detail modal state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Permissions modal state
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [permissionsRoles, setPermissionsRoles] = useState<RoleItem[]>([]);
  const [permissionsUsers, setPermissionsUsers] = useState<UserItem[]>([]);

  // Import Excel modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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

    // If already expanded, just collapse it
    if (dept.isExpanded) {
      setHierarchy(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          departments: prev.departments.map(d =>
            d.id === departmentId
              ? { ...d, isExpanded: false }
              : d
          ),
        };
      });
      return;
    }

    // If expanding and no teams loaded yet, fetch department details
    if (!dept.teams) {
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
                  : { ...d, isExpanded: false }
              ),
            };
          });
          return;
        } catch (err) {
          console.error('Error fetching department details:', err);
        }
      }
    }

    // Expand this department and collapse others
    setHierarchy(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        departments: prev.departments.map(d =>
          d.id === departmentId
            ? { ...d, isExpanded: true }
            : { ...d, isExpanded: false }
        ),
      };
    });
  }, [hierarchy]);

  // Toggle team in selected department (for department detail view)
  const handleToggleTeam = useCallback((teamId: string) => {
    setSelectedDepartment(prev => {
      if (!prev || !prev.teams) return prev;
      const team = prev.teams.find((t: Team) => t.id === teamId);
      if (!team) return prev;

      // If already expanded, just collapse it
      if (team.isExpanded) {
        return {
          ...prev,
          teams: prev.teams.map((t: Team) =>
            t.id === teamId
              ? { ...t, isExpanded: false }
              : t
          ),
        };
      }

      // Expand this team and collapse others
      return {
        ...prev,
        teams: prev.teams.map((t: Team) =>
          t.id === teamId
            ? { ...t, isExpanded: true }
            : { ...t, isExpanded: false }
        ),
      };
    });
  }, []);

  // Toggle team in hierarchy (for SMBU overview)
  const handleToggleTeamInHierarchy = useCallback((departmentId: DepartmentId, teamId: string) => {
    setHierarchy(prev => {
      if (!prev) return prev;

      const dept = prev.departments.find(d => d.id === departmentId);
      if (!dept || !dept.teams) return prev;

      const team = dept.teams.find((t: Team) => t.id === teamId);
      if (!team) return prev;

      // If already expanded, just collapse it
      if (team.isExpanded) {
        return {
          ...prev,
          departments: prev.departments.map(d =>
            d.id === departmentId && d.teams
              ? {
                  ...d,
                  teams: d.teams.map((t: Team) =>
                    t.id === teamId
                      ? { ...t, isExpanded: false }
                      : t
                  ),
                }
              : d
          ),
        };
      }

      // Expand this team and collapse others in the same department
      return {
        ...prev,
        departments: prev.departments.map(d =>
          d.id === departmentId && d.teams
            ? {
                ...d,
                teams: d.teams.map((t: Team) =>
                  t.id === teamId
                    ? { ...t, isExpanded: true }
                    : { ...t, isExpanded: false }
                ),
              }
            : d
        ),
      };
    });
  }, []);

  const handlePermissionsClick = async () => {
    try {
      const [roles, users] = await Promise.all([
        getRolesList(),
        getUsersList(),
      ]);
      setPermissionsRoles(roles);
      setPermissionsUsers(users);
      setIsPermissionsModalOpen(true);
    } catch (err) {
      console.error('Error fetching permissions data:', err);
      setError('Failed to load permissions data. Please try again.');
    }
  };

  const handleSavePermissions = async (targetId: number, targetType: 'user' | 'role', permissions: string[]) => {
    await savePermissions({ targetId, targetType, permissions });
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleImportUsers = async (file: File) => {
    const result = await importUsersFromExcel(file);

    // Refresh hierarchy data after successful import
    if (result.success && result.imported && result.imported > 0) {
      const hierarchyData = await getSMBUHierarchy();
      setHierarchy(hierarchyData);
    }

    return result;
  };

  const handleAddMember = async () => {
    // Fetch departments and teams for the modal
    try {
      const [depts, teams] = await Promise.all([
        getDepartmentsList(),
        getTeamsList(),
      ]);
      setDepartmentsList(depts);
      setTeamsList(teams);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setError('Failed to load form data. Please try again.');
    }
  };

  const handleModalSubmit = async (data: TeamFormData | MemberFormData) => {
    if (data.type === 'team') {
      await createTeam({
        teamName: data.teamName,
        departmentId: data.departmentId,
        icon: data.icon,
        iconColor: data.iconColor,
        iconBg: data.iconBg,
      });

      // Update teams list
      const updatedTeams = await getTeamsList();
      setTeamsList(updatedTeams);
    } else {
      await createMember({
        staffName: data.staffName,
        staffCode: data.staffCode,
        email: data.email,
        phone: data.phone,
        position: data.position,
        jobGrade: data.jobGrade,
        departmentId: data.departmentId,
        teamId: data.teamId,
        sapCode: data.sapCode,
        lineManagerId: data.lineManagerId,
      });
    }

    // Refresh the hierarchy data
    try {
      const hierarchyData = await getSMBUHierarchy();
      setHierarchy(hierarchyData);

      // If viewing a department, refresh that too
      if (activeTab !== 'SMBU' && selectedDepartment) {
        const deptCode = activeTab.toUpperCase();
        const deptId = DEPARTMENT_CODE_TO_ID[deptCode];
        if (deptId) {
          const deptData = await getDepartmentHierarchy(deptId);
          setSelectedDepartment(deptData);
        }
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const handleMemberClick = useCallback(async (member: Employee) => {
    try {
      // Fetch full employee details
      const staffDetail = await getStaffDetail(parseInt(member.id));
      setSelectedEmployee(staffDetail);
      setIsEmployeeModalOpen(true);
    } catch (err) {
      console.error('Error fetching staff detail:', err);
      // Fallback to basic member info if detail fetch fails
      setSelectedEmployee(member);
      setIsEmployeeModalOpen(true);
    }
  }, []);

  if (loading && !hierarchy) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <UserInfoPageSkeleton />
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
          isReadOnly={!isAdmin}
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
            onMemberClick={handleMemberClick}
            isReadOnly={!isAdmin}
          />
        ) : selectedDepartment ? (
          /* Department Detail View */
          <DepartmentDetailView
            department={selectedDepartment}
            onToggleTeam={handleToggleTeam}
            onAddMember={handleAddMember}
            onMemberClick={handleMemberClick}
            isReadOnly={!isAdmin}
          />
        ) : loading ? (
          <HierarchySkeleton />
        ) : null}
      </div>

      {/* Add Team/Member Modal */}
      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        departments={departmentsList.map(d => ({ id: d.id, name: d.name, code: d.code }))}
        teams={teamsList.map(t => ({ id: t.id, name: t.name, departmentId: t.departmentId }))}
      />

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />

      {/* Permissions Modal */}
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        onSave={handleSavePermissions}
        users={permissionsUsers.map(u => ({ id: u.id, name: u.name, type: 'user' as const }))}
        roles={permissionsRoles.map(r => ({ id: r.id, name: r.name, type: 'role' as const }))}
      />

      {/* Import Excel Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportUsers}
      />
    </div>
  );
}
