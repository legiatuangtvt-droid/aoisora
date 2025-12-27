import { TaskGroup, Department } from '@/types/tasks';

// Mock Departments Tree
export const mockDepartments: Department[] = [
  {
    id: 'op',
    name: '1. OP',
    code: 'OP',
    level: 1,
    children: [
      { id: 'op-peri', name: 'Perisable', code: 'PERI', level: 2 },
      { id: 'op-gro', name: 'Grocery', code: 'GRO', level: 2 },
      { id: 'op-delica', name: 'Delica', code: 'DELICA', level: 2 },
      { id: 'op-dd', name: 'D&D', code: 'D&D', level: 2 },
      { id: 'op-cs', name: 'CS', code: 'CS', level: 2 }
    ]
  },
  {
    id: 'admin',
    name: '2. Admin',
    code: 'ADMIN',
    level: 1,
    children: [
      { id: 'admin-admin', name: 'Admin', code: 'ADMIN', level: 2 },
      { id: 'admin-mmd', name: 'MMD', code: 'MMD', level: 2 },
      { id: 'admin-acc', name: 'ACC', code: 'ACC', level: 2 }
    ]
  },
  {
    id: 'control',
    name: '3. Control',
    code: 'CONTROL',
    level: 1
  },
  {
    id: 'improvement',
    name: '4. Improvement',
    code: 'IMPROVEMENT',
    level: 1
  },
  {
    id: 'planning',
    name: '5. Planning',
    code: 'PLANNING',
    level: 1,
    children: [
      { id: 'planning-mkt', name: 'MKT', code: 'MKT', level: 2 },
      { id: 'planning-spa', name: 'SPA', code: 'SPA', level: 2 },
      { id: 'planning-ord', name: 'ORD', code: 'ORD', level: 2 }
    ]
  },
  {
    id: 'hr',
    name: '6. HR',
    code: 'HR',
    level: 1
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
    dept: 'GRO',
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
    dept: 'DELICA',
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
  },
  {
    id: '4',
    no: 4,
    dept: 'ADMIN',
    taskGroupName: 'Monthly Inventory Count',
    startDate: '12/05',
    endDate: '12/25',
    progress: { completed: 12, total: 20 },
    unable: 1,
    status: 'NOT_YET',
    hqCheck: 'DRAFT',
    subTasks: [
      {
        id: '4-1',
        name: 'Count office supplies',
        status: 'DONE',
        assignee: 'Sarah Lee'
      },
      {
        id: '4-2',
        name: 'Update inventory system',
        status: 'NOT_YET',
        assignee: 'Mike Chen'
      }
    ]
  },
  {
    id: '5',
    no: 5,
    dept: 'MMD',
    taskGroupName: 'Marketing Campaign Setup',
    startDate: '12/08',
    endDate: '12/22',
    progress: { completed: 15, total: 15 },
    unable: 0,
    status: 'DONE',
    hqCheck: 'DONE',
    subTasks: [
      {
        id: '5-1',
        name: 'Design promotional materials',
        status: 'DONE',
        assignee: 'Emily Wong'
      },
      {
        id: '5-2',
        name: 'Schedule social media posts',
        status: 'DONE',
        assignee: 'David Park'
      }
    ]
  },
  {
    id: '6',
    no: 6,
    dept: 'ACC',
    taskGroupName: 'Financial Report Preparation',
    startDate: '12/01',
    endDate: '12/30',
    progress: { completed: 8, total: 12 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'NOT_YET',
    subTasks: [
      {
        id: '6-1',
        name: 'Collect expense reports',
        status: 'DONE',
        assignee: 'Lisa Kim'
      },
      {
        id: '6-2',
        name: 'Reconcile accounts',
        status: 'NOT_YET',
        assignee: 'Tom Harris'
      }
    ]
  },
  {
    id: '7',
    no: 7,
    dept: 'CONTROL',
    taskGroupName: 'Quality Control Audit',
    startDate: '12/03',
    endDate: '12/17',
    progress: { completed: 10, total: 10 },
    unable: 0,
    status: 'DONE',
    hqCheck: 'DONE',
    subTasks: [
      {
        id: '7-1',
        name: 'Inspect production line',
        status: 'DONE',
        assignee: 'James Wilson'
      },
      {
        id: '7-2',
        name: 'Document findings',
        status: 'DONE',
        assignee: 'Rachel Green'
      }
    ]
  },
  {
    id: '8',
    no: 8,
    dept: 'IMPROVEMENT',
    taskGroupName: 'Process Optimization Project',
    startDate: '12/06',
    endDate: '12/28',
    progress: { completed: 3, total: 15 },
    unable: 2,
    status: 'NOT_YET',
    hqCheck: 'DRAFT',
    subTasks: [
      {
        id: '8-1',
        name: 'Analyze current workflow',
        status: 'DONE',
        assignee: 'Kevin Zhao'
      },
      {
        id: '8-2',
        name: 'Propose improvements',
        status: 'NOT_YET',
        assignee: 'Nina Patel'
      }
    ]
  },
  {
    id: '9',
    no: 9,
    dept: 'MKT',
    taskGroupName: 'Customer Survey Analysis',
    startDate: '12/02',
    endDate: '12/16',
    progress: { completed: 18, total: 18 },
    unable: 0,
    status: 'DONE',
    hqCheck: 'DONE',
    subTasks: [
      {
        id: '9-1',
        name: 'Collect survey responses',
        status: 'DONE',
        assignee: 'Olivia Martinez'
      },
      {
        id: '9-2',
        name: 'Create analysis report',
        status: 'DONE',
        assignee: 'Ryan Taylor'
      }
    ]
  },
  {
    id: '10',
    no: 10,
    dept: 'SPA',
    taskGroupName: 'Space Planning Review',
    startDate: '12/04',
    endDate: '12/24',
    progress: { completed: 6, total: 14 },
    unable: 1,
    status: 'NOT_YET',
    hqCheck: 'NOT_YET',
    subTasks: [
      {
        id: '10-1',
        name: 'Measure store layout',
        status: 'DONE',
        assignee: 'Chris Anderson'
      },
      {
        id: '10-2',
        name: 'Design new layout',
        status: 'NOT_YET',
        assignee: 'Amy Liu'
      }
    ]
  },
  {
    id: '11',
    no: 11,
    dept: 'ORD',
    taskGroupName: 'Supply Order Processing',
    startDate: '12/07',
    endDate: '12/21',
    progress: { completed: 20, total: 20 },
    unable: 0,
    status: 'DONE',
    hqCheck: 'DRAFT',
    subTasks: [
      {
        id: '11-1',
        name: 'Review inventory levels',
        status: 'DONE',
        assignee: 'Steven Wang'
      },
      {
        id: '11-2',
        name: 'Place orders',
        status: 'DONE',
        assignee: 'Jessica Brown'
      }
    ]
  },
  {
    id: '12',
    no: 12,
    dept: 'HR',
    taskGroupName: 'Employee Training Program',
    startDate: '12/09',
    endDate: '12/27',
    progress: { completed: 7, total: 16 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'NOT_YET',
    subTasks: [
      {
        id: '12-1',
        name: 'Schedule training sessions',
        status: 'DONE',
        assignee: 'Brian Murphy'
      },
      {
        id: '12-2',
        name: 'Prepare training materials',
        status: 'NOT_YET',
        assignee: 'Maria Garcia'
      }
    ]
  },
  {
    id: '13',
    no: 13,
    dept: 'PERI',
    taskGroupName: 'Cold Storage Maintenance',
    startDate: '12/11',
    endDate: '12/26',
    progress: { completed: 5, total: 9 },
    unable: 1,
    status: 'NOT_YET',
    hqCheck: 'DRAFT',
    subTasks: [
      {
        id: '13-1',
        name: 'Check temperature controls',
        status: 'DONE',
        assignee: 'Paul Robinson'
      },
      {
        id: '13-2',
        name: 'Service cooling units',
        status: 'NOT_YET',
        assignee: 'Helen Scott'
      }
    ]
  },
  {
    id: '14',
    no: 14,
    dept: 'GRO',
    taskGroupName: 'Shelf Restocking Protocol',
    startDate: '12/12',
    endDate: '12/29',
    progress: { completed: 11, total: 11 },
    unable: 0,
    status: 'DONE',
    hqCheck: 'DONE',
    subTasks: [
      {
        id: '14-1',
        name: 'Monitor stock levels',
        status: 'DONE',
        assignee: 'Daniel Foster'
      },
      {
        id: '14-2',
        name: 'Restock shelves',
        status: 'DONE',
        assignee: 'Laura Adams'
      }
    ]
  },
  {
    id: '15',
    no: 15,
    dept: 'DELICA',
    taskGroupName: 'Food Safety Inspection',
    startDate: '12/13',
    endDate: '12/23',
    progress: { completed: 14, total: 14 },
    unable: 0,
    status: 'DONE',
    hqCheck: 'DONE',
    subTasks: [
      {
        id: '15-1',
        name: 'Inspect preparation areas',
        status: 'DONE',
        assignee: 'Sophie Turner'
      },
      {
        id: '15-2',
        name: 'Update safety logs',
        status: 'DONE',
        assignee: 'Mark Phillips'
      }
    ]
  }
];
