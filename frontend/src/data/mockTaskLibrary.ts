import { TaskTemplate, TaskGroup, DepartmentType } from '@/types/taskLibrary';

// Mock task data for Admin department
const adminTasks: TaskTemplate[] = [
  {
    id: 'admin-1',
    no: 1,
    type: 'Daily',
    taskName: 'Opening Store',
    owner: { id: 'owner-1', name: 'Thu OP', avatar: '/avatars/avatar1.png' },
    lastUpdate: '25 Dec, 25',
    status: 'In progress',
    usage: 565,
    department: 'Admin',
    category: 'office',
  },
  {
    id: 'admin-2',
    no: 2,
    type: 'Daily',
    taskName: 'Closing Store',
    owner: { id: 'owner-2', name: 'Nguyen GD', avatar: '/avatars/avatar2.png' },
    lastUpdate: '24 Dec, 25',
    status: 'Draft',
    usage: 52,
    department: 'Admin',
    category: 'office',
  },
  {
    id: 'admin-3',
    no: 3,
    type: 'Weekly',
    taskName: 'Check SS',
    owner: { id: 'owner-3', name: 'Tran TK', avatar: '/avatars/avatar3.png' },
    lastUpdate: '23 Dec, 25',
    status: 'Available',
    usage: 1,
    department: 'Admin',
    category: 'office',
  },
];

// Mock task data for HR department
const hrTasks: TaskTemplate[] = [
  {
    id: 'hr-1',
    no: 1,
    type: 'Weekly',
    taskName: 'Employee Attendance Report',
    owner: { id: 'owner-4', name: 'Le HR', avatar: '/avatars/avatar4.png' },
    lastUpdate: '25 Dec, 25',
    status: 'In progress',
    usage: 320,
    department: 'HR',
    category: 'office',
  },
  {
    id: 'hr-2',
    no: 2,
    type: 'Ad hoc',
    taskName: 'New Employee Onboarding',
    owner: { id: 'owner-5', name: 'Pham NT', avatar: '/avatars/avatar5.png' },
    lastUpdate: '22 Dec, 25',
    status: 'Available',
    usage: 89,
    department: 'HR',
    category: 'office',
  },
  {
    id: 'hr-3',
    no: 3,
    type: 'Daily',
    taskName: 'Leave Request Processing',
    owner: { id: 'owner-4', name: 'Le HR', avatar: '/avatars/avatar4.png' },
    lastUpdate: '25 Dec, 25',
    status: 'Draft',
    usage: 156,
    department: 'HR',
    category: 'office',
  },
  {
    id: 'hr-4',
    no: 4,
    type: 'Weekly',
    taskName: 'Training Schedule Update',
    owner: { id: 'owner-6', name: 'Vu TT', avatar: '/avatars/avatar6.png' },
    lastUpdate: '20 Dec, 25',
    status: 'Available',
    usage: 45,
    department: 'HR',
    category: 'office',
  },
  {
    id: 'hr-5',
    no: 5,
    type: 'Ad hoc',
    taskName: 'Performance Review',
    owner: { id: 'owner-5', name: 'Pham NT', avatar: '/avatars/avatar5.png' },
    lastUpdate: '18 Dec, 25',
    status: 'In progress',
    usage: 78,
    department: 'HR',
    category: 'office',
  },
];

// Mock task data for Legal department
const legalTasks: TaskTemplate[] = [
  {
    id: 'legal-1',
    no: 1,
    type: 'Ad hoc',
    taskName: 'Contract Review',
    owner: { id: 'owner-7', name: 'Hoang LS', avatar: '/avatars/avatar7.png' },
    lastUpdate: '25 Dec, 25',
    status: 'In progress',
    usage: 234,
    department: 'Legal',
    category: 'office',
  },
  {
    id: 'legal-2',
    no: 2,
    type: 'Weekly',
    taskName: 'Compliance Check',
    owner: { id: 'owner-8', name: 'Dao PL', avatar: '/avatars/avatar8.png' },
    lastUpdate: '24 Dec, 25',
    status: 'Available',
    usage: 112,
    department: 'Legal',
    category: 'office',
  },
  {
    id: 'legal-3',
    no: 3,
    type: 'Ad hoc',
    taskName: 'Legal Document Filing',
    owner: { id: 'owner-7', name: 'Hoang LS', avatar: '/avatars/avatar7.png' },
    lastUpdate: '23 Dec, 25',
    status: 'Draft',
    usage: 67,
    department: 'Legal',
    category: 'office',
  },
  {
    id: 'legal-4',
    no: 4,
    type: 'Daily',
    taskName: 'Policy Update Review',
    owner: { id: 'owner-9', name: 'Bui HL', avatar: '/avatars/avatar9.png' },
    lastUpdate: '22 Dec, 25',
    status: 'Available',
    usage: 89,
    department: 'Legal',
    category: 'office',
  },
  {
    id: 'legal-5',
    no: 5,
    type: 'Weekly',
    taskName: 'Regulatory Report',
    owner: { id: 'owner-8', name: 'Dao PL', avatar: '/avatars/avatar8.png' },
    lastUpdate: '21 Dec, 25',
    status: 'In progress',
    usage: 156,
    department: 'Legal',
    category: 'office',
  },
  {
    id: 'legal-6',
    no: 6,
    type: 'Ad hoc',
    taskName: 'Vendor Agreement Review',
    owner: { id: 'owner-7', name: 'Hoang LS', avatar: '/avatars/avatar7.png' },
    lastUpdate: '20 Dec, 25',
    status: 'Draft',
    usage: 34,
    department: 'Legal',
    category: 'office',
  },
  {
    id: 'legal-7',
    no: 7,
    type: 'Weekly',
    taskName: 'Trademark Monitoring',
    owner: { id: 'owner-9', name: 'Bui HL', avatar: '/avatars/avatar9.png' },
    lastUpdate: '19 Dec, 25',
    status: 'Available',
    usage: 23,
    department: 'Legal',
    category: 'office',
  },
  {
    id: 'legal-8',
    no: 8,
    type: 'Ad hoc',
    taskName: 'Litigation Support',
    owner: { id: 'owner-8', name: 'Dao PL', avatar: '/avatars/avatar8.png' },
    lastUpdate: '18 Dec, 25',
    status: 'In progress',
    usage: 12,
    department: 'Legal',
    category: 'office',
  },
];

// Store tasks - similar structure but for store category
const storeAdminTasks: TaskTemplate[] = [
  {
    id: 'store-admin-1',
    no: 1,
    type: 'Daily',
    taskName: 'Store Opening Checklist',
    owner: { id: 'owner-10', name: 'Mai SM', avatar: '/avatars/avatar10.png' },
    lastUpdate: '25 Dec, 25',
    status: 'Available',
    usage: 890,
    department: 'Admin',
    category: 'store',
  },
  {
    id: 'store-admin-2',
    no: 2,
    type: 'Daily',
    taskName: 'Store Closing Checklist',
    owner: { id: 'owner-10', name: 'Mai SM', avatar: '/avatars/avatar10.png' },
    lastUpdate: '25 Dec, 25',
    status: 'Available',
    usage: 876,
    department: 'Admin',
    category: 'store',
  },
  {
    id: 'store-admin-3',
    no: 3,
    type: 'Weekly',
    taskName: 'Inventory Count',
    owner: { id: 'owner-11', name: 'Ly WH', avatar: '/avatars/avatar11.png' },
    lastUpdate: '24 Dec, 25',
    status: 'In progress',
    usage: 234,
    department: 'Admin',
    category: 'store',
  },
];

const storeHRTasks: TaskTemplate[] = [
  {
    id: 'store-hr-1',
    no: 1,
    type: 'Weekly',
    taskName: 'Staff Schedule Planning',
    owner: { id: 'owner-12', name: 'Truong HR', avatar: '/avatars/avatar12.png' },
    lastUpdate: '25 Dec, 25',
    status: 'Available',
    usage: 456,
    department: 'HR',
    category: 'store',
  },
  {
    id: 'store-hr-2',
    no: 2,
    type: 'Ad hoc',
    taskName: 'Staff Training Session',
    owner: { id: 'owner-12', name: 'Truong HR', avatar: '/avatars/avatar12.png' },
    lastUpdate: '23 Dec, 25',
    status: 'Draft',
    usage: 67,
    department: 'HR',
    category: 'store',
  },
];

// Task groups for Office
export const officeTaskGroups: TaskGroup[] = [
  {
    department: 'Admin',
    icon: '/icons/admin.png',
    color: '#E91E63',
    tasks: adminTasks,
    isExpanded: true,
  },
  {
    department: 'HR',
    icon: '/icons/hr.png',
    color: '#9C27B0',
    tasks: hrTasks,
    isExpanded: false,
  },
  {
    department: 'Legal',
    icon: '/icons/legal.png',
    color: '#4CAF50',
    tasks: legalTasks,
    isExpanded: false,
  },
];

// Task groups for Store
export const storeTaskGroups: TaskGroup[] = [
  {
    department: 'Admin',
    icon: '/icons/admin.png',
    color: '#E91E63',
    tasks: storeAdminTasks,
    isExpanded: true,
  },
  {
    department: 'HR',
    icon: '/icons/hr.png',
    color: '#9C27B0',
    tasks: storeHRTasks,
    isExpanded: false,
  },
];

// Get all tasks for a category
export const getTasksByCategory = (category: 'office' | 'store'): TaskGroup[] => {
  return category === 'office' ? officeTaskGroups : storeTaskGroups;
};

// Get tasks filtered by departments
export const getFilteredTasks = (
  category: 'office' | 'store',
  departments: DepartmentType[],
  searchQuery: string
): TaskGroup[] => {
  const groups = getTasksByCategory(category);

  let filtered = groups;

  // Filter by departments if specified
  if (departments.length > 0) {
    filtered = filtered.filter(group => departments.includes(group.department));
  }

  // Filter by search query
  if (searchQuery.trim().length >= 2) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.map(group => ({
      ...group,
      tasks: group.tasks.filter(
        task =>
          task.taskName.toLowerCase().includes(query) ||
          task.owner.name.toLowerCase().includes(query) ||
          task.type.toLowerCase().includes(query)
      ),
    })).filter(group => group.tasks.length > 0);
  }

  return filtered;
};
