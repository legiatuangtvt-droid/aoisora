import { TaskGroup, Department } from '@/types/tasks';

// Mock Departments Tree
export const mockDepartments: Department[] = [
  {
    id: 'op',
    name: 'Operations',
    code: 'OP',
    level: 1,
    children: [
      { id: 'op-store', name: 'Store Operations', code: 'STORE', level: 2 },
      { id: 'op-logistics', name: 'Logistics', code: 'LOG', level: 2 }
    ]
  },
  {
    id: 'peri',
    name: 'Perishable',
    code: 'PERI',
    level: 1,
    children: [
      { id: 'peri-fresh', name: 'Fresh Food', code: 'FRESH', level: 2 },
      { id: 'peri-bakery', name: 'Bakery', code: 'BAKERY', level: 2 }
    ]
  },
  {
    id: 'it',
    name: 'Information Technology',
    code: 'IT',
    level: 1,
    children: [
      { id: 'it-dev', name: 'Development', code: 'DEV', level: 2 },
      { id: 'it-support', name: 'IT Support', code: 'SUPPORT', level: 2 }
    ]
  }
];

// Mock Task Groups
export const mockTaskGroups: TaskGroup[] = [
  {
    id: '1',
    no: 1,
    dept: 'PERI',
    taskGroupName: 'Daily Fresh Food Check',
    startDate: '12/01',
    endDate: '12/31',
    progress: { completed: 23, total: 27 },
    unable: 2,
    status: 'DONE',
    hqCheck: 'DONE',
    subTasks: [
      {
        id: '1-1',
        name: 'Temperature monitoring',
        status: 'DONE',
        assignee: 'John Doe'
      },
      {
        id: '1-2',
        name: 'Expiry date check',
        status: 'DONE',
        assignee: 'Jane Smith'
      },
      {
        id: '1-3',
        name: 'Quality inspection',
        status: 'NOT_YET',
        assignee: 'Bob Johnson'
      }
    ]
  },
  {
    id: '2',
    no: 2,
    dept: 'OP',
    taskGroupName: 'Store Opening Checklist',
    startDate: '12/01',
    endDate: '12/15',
    progress: { completed: 5, total: 10 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'NOT_YET',
    subTasks: [
      {
        id: '2-1',
        name: 'Cash register setup',
        status: 'DONE',
        assignee: 'Alice Brown'
      },
      {
        id: '2-2',
        name: 'Security system check',
        status: 'NOT_YET',
        assignee: 'Charlie Davis'
      }
    ]
  },
  {
    id: '3',
    no: 3,
    dept: 'IT',
    taskGroupName: 'System Maintenance',
    startDate: '12/10',
    endDate: '12/20',
    progress: { completed: 8, total: 8 },
    unable: 0,
    status: 'DONE',
    hqCheck: 'DRAFT',
    subTasks: [
      {
        id: '3-1',
        name: 'Database backup',
        status: 'DONE'
      },
      {
        id: '3-2',
        name: 'Server update',
        status: 'DONE'
      }
    ]
  }
];
