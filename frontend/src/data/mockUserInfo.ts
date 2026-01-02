import { Employee, Department, HierarchyNode, DepartmentId, Team } from '@/types/userInfo';

// Root user (General Manager)
const rootUser: Employee = {
  id: 'root-1',
  name: 'YOSHINAGA',
  avatar: '/avatars/yoshinaga.jpg',
  position: 'General Manager',
  jobGrade: 'G6',
  sapCode: 'SM GM',
  status: 'Active',
};

// ADMIN Department Head
const adminHead: Employee = {
  id: 'admin-head-1',
  name: 'Đỗ Thị Kim Duyên',
  avatar: '/avatars/admin-head.jpg',
  position: 'Head of Dept, Deputy Manager',
  jobGrade: 'G4',
  sapCode: 'AD HD',
  status: 'Active',
};

// Account Team Members
const accountTeamMembers: Employee[] = [
  {
    id: 'account-1',
    name: 'Nguyễn Thị Hiền',
    avatar: '/avatars/account-1.jpg',
    position: 'Team Lead',
    jobGrade: 'G3',
    sapCode: 'AC TL',
    status: 'Active',
  },
  {
    id: 'account-2',
    name: 'Nguyễn Thị Hằng',
    avatar: '/avatars/account-2.jpg',
    position: 'Account Executive',
    jobGrade: 'G2',
    sapCode: 'AC EX',
    status: 'Active',
  },
];

// Quality Control Team Members
const qcTeamMembers: Employee[] = [
  {
    id: 'qc-1',
    name: 'Trần Văn An',
    avatar: '/avatars/qc-1.jpg',
    position: 'Team Lead',
    jobGrade: 'G3',
    sapCode: 'QC TL',
    status: 'Active',
  },
  {
    id: 'qc-2',
    name: 'Lê Thị Bình',
    avatar: '/avatars/qc-2.jpg',
    position: 'QC Specialist',
    jobGrade: 'G2',
    sapCode: 'QC SP',
    status: 'Active',
  },
  {
    id: 'qc-3',
    name: 'Phạm Văn Cường',
    avatar: '/avatars/qc-3.jpg',
    position: 'QC Analyst',
    jobGrade: 'G2',
    sapCode: 'QC AN',
    status: 'Active',
  },
  {
    id: 'qc-4',
    name: 'Hoàng Thị Dung',
    avatar: '/avatars/qc-4.jpg',
    position: 'QC Officer',
    jobGrade: 'G2',
    sapCode: 'QC OF',
    status: 'Active',
  },
];

// Admin Teams
const adminTeams: Team[] = [
  {
    id: 'account-team',
    name: 'Account Team',
    icon: 'users',
    iconColor: '#003E95',
    iconBg: '#E5F0FF',
    members: accountTeamMembers,
    gradeRange: 'G3 & G2',
    isExpanded: true,
  },
  {
    id: 'qc-team',
    name: 'Quality Control',
    icon: 'shield',
    iconColor: '#6B06B8',
    iconBg: '#FDF0FF',
    members: qcTeamMembers,
    gradeRange: 'G3 & G2',
    isExpanded: false,
  },
];

// ADMIN Department
const adminDepartment: Department = {
  id: 'Admin',
  name: 'ADMIN',
  icon: 'admin',
  iconColor: '#233D62',
  iconBg: 'rgba(35, 61, 98, 0.1)',
  memberCount: 7,
  gradeRange: 'G5 & G3 & G2',
  head: adminHead,
  teams: adminTeams,
  isExpanded: false,
};

// OP Department
const opDepartment: Department = {
  id: 'OP',
  name: 'OP',
  icon: 'cog',
  iconColor: '#0D9488',
  iconBg: 'rgba(13, 148, 136, 0.1)',
  memberCount: 10,
  gradeRange: 'G4 & G3',
  isExpanded: false,
};

// CONTROL Department
const controlDepartment: Department = {
  id: 'CONTROL',
  name: 'CONTROL',
  icon: 'controller',
  iconColor: '#7C3AED',
  iconBg: 'rgba(124, 58, 237, 0.1)',
  memberCount: 10,
  gradeRange: 'G4 & G3',
  isExpanded: false,
};

// IMPROVEMENT Department
const improvementDepartment: Department = {
  id: 'IMPROVEMENT',
  name: 'IMPROVEMENT',
  icon: 'rocket',
  iconColor: '#2563EB',
  iconBg: 'rgba(37, 99, 235, 0.1)',
  memberCount: 12,
  gradeRange: 'G5 & G3',
  isExpanded: false,
};

// HR Department
const hrDepartment: Department = {
  id: 'HR',
  name: 'HR',
  icon: 'users',
  iconColor: '#E11D48',
  iconBg: 'rgba(225, 29, 72, 0.1)',
  memberCount: 5,
  gradeRange: 'G3 & G1',
  isExpanded: false,
};

// MD Department
const mdDepartment: Department = {
  id: 'MD',
  name: 'MD',
  icon: 'crown',
  iconColor: '#D97706',
  iconBg: 'rgba(217, 119, 6, 0.1)',
  memberCount: 8,
  gradeRange: 'G3 & G2',
  isExpanded: false,
};

// SMBU (Head Office) hierarchy
export const smbuHierarchy: HierarchyNode = {
  rootUser,
  departments: [
    adminDepartment,
    opDepartment,
    controlDepartment,
    improvementDepartment,
    hrDepartment,
    mdDepartment,
  ],
};

// Department tabs data
export const departmentTabs: { id: DepartmentId | 'SMBU'; label: string; isActive?: boolean }[] = [
  { id: 'SMBU', label: 'SMBU (Head Office)', isActive: true },
  { id: 'Admin', label: 'Admin' },
  { id: 'OP', label: 'OP' },
  { id: 'CONTROL', label: 'CONTROL' },
  { id: 'IMPROVEMENT', label: 'IMPROVEMENT' },
  { id: 'HR', label: 'HR' },
  { id: 'MG', label: 'MG' },
];

// Get hierarchy by tab
export const getHierarchyByTab = (tabId: DepartmentId | 'SMBU'): HierarchyNode => {
  // For now, return the same hierarchy for all tabs
  // In real implementation, this would fetch different data based on tab
  return smbuHierarchy;
};

// Toggle department expansion
export const toggleDepartmentExpansion = (
  hierarchy: HierarchyNode,
  departmentId: DepartmentId
): HierarchyNode => {
  return {
    ...hierarchy,
    departments: hierarchy.departments.map(dept =>
      dept.id === departmentId
        ? { ...dept, isExpanded: !dept.isExpanded }
        : dept
    ),
  };
};

// Toggle team expansion within a department
export const toggleTeamExpansion = (
  department: Department,
  teamId: string
): Department => {
  if (!department.teams) return department;

  return {
    ...department,
    teams: department.teams.map(team =>
      team.id === teamId
        ? { ...team, isExpanded: !team.isExpanded }
        : team
    ),
  };
};

// Get department by ID
export const getDepartmentById = (departmentId: DepartmentId): Department | undefined => {
  return smbuHierarchy.departments.find(dept => dept.id === departmentId);
};
