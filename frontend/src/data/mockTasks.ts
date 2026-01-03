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

// Mock Task Groups - Data for 01/01/2026
export const mockTaskGroups: TaskGroup[] = [
  {
    id: '1',
    no: 1,
    dept: 'PERI',
    deptId: 11,
    taskGroupName: 'New Year Fresh Food Check',
    taskType: 'image',
    startDate: '01/01',
    endDate: '01/15',
    progress: { completed: 5, total: 27 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'NOT_YET',
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
        status: 'NOT_YET',
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
    deptId: 12,
    taskGroupName: 'Store Opening Checklist 2026',
    taskType: 'yes_no',
    startDate: '01/01',
    endDate: '01/07',
    progress: { completed: 3, total: 10 },
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
    deptId: 13,
    taskGroupName: 'New Year Menu Setup',
    startDate: '01/01',
    endDate: '01/05',
    progress: { completed: 2, total: 8 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'DRAFT',
    subTasks: [
      {
        id: '3-1',
        name: 'Update menu boards',
        status: 'DONE'
      },
      {
        id: '3-2',
        name: 'Prepare special items',
        status: 'NOT_YET'
      }
    ]
  },
  {
    id: '4',
    no: 4,
    dept: 'ADMIN',
    deptId: 21,
    taskGroupName: 'January Inventory Count',
    startDate: '01/01',
    endDate: '01/10',
    progress: { completed: 4, total: 20 },
    unable: 0,
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
    deptId: 22,
    taskGroupName: 'New Year Marketing Campaign',
    startDate: '01/01',
    endDate: '01/15',
    progress: { completed: 8, total: 15 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'NOT_YET',
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
        status: 'NOT_YET',
        assignee: 'David Park'
      }
    ]
  },
  {
    id: '6',
    no: 6,
    dept: 'ACC',
    deptId: 23,
    taskGroupName: 'Year-End Financial Closing',
    startDate: '01/01',
    endDate: '01/20',
    progress: { completed: 6, total: 12 },
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
    deptId: 3,
    taskGroupName: 'Q1 Quality Control Audit',
    startDate: '01/01',
    endDate: '01/14',
    progress: { completed: 2, total: 10 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'DRAFT',
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
        status: 'NOT_YET',
        assignee: 'Rachel Green'
      }
    ]
  },
  {
    id: '8',
    no: 8,
    dept: 'IMPROVEMENT',
    deptId: 4,
    taskGroupName: '2026 Process Optimization',
    startDate: '01/01',
    endDate: '01/31',
    progress: { completed: 1, total: 15 },
    unable: 0,
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
    deptId: 51,
    taskGroupName: 'Customer Feedback Survey Q1',
    startDate: '01/01',
    endDate: '01/21',
    progress: { completed: 3, total: 18 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'NOT_YET',
    subTasks: [
      {
        id: '9-1',
        name: 'Collect survey responses',
        status: 'NOT_YET',
        assignee: 'Olivia Martinez'
      },
      {
        id: '9-2',
        name: 'Create analysis report',
        status: 'NOT_YET',
        assignee: 'Ryan Taylor'
      }
    ]
  },
  {
    id: '10',
    no: 10,
    dept: 'SPA',
    deptId: 52,
    taskGroupName: 'New Year Store Layout Review',
    startDate: '01/01',
    endDate: '01/18',
    progress: { completed: 4, total: 14 },
    unable: 0,
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
    deptId: 53,
    taskGroupName: 'January Supply Orders',
    startDate: '01/01',
    endDate: '01/12',
    progress: { completed: 10, total: 20 },
    unable: 0,
    status: 'NOT_YET',
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
        status: 'NOT_YET',
        assignee: 'Jessica Brown'
      }
    ]
  },
  {
    id: '12',
    no: 12,
    dept: 'HR',
    deptId: 6,
    taskGroupName: '2026 Training Program Launch',
    startDate: '01/01',
    endDate: '01/25',
    progress: { completed: 2, total: 16 },
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
    deptId: 11,
    taskGroupName: 'Cold Storage Post-Holiday Check',
    startDate: '01/01',
    endDate: '01/08',
    progress: { completed: 3, total: 9 },
    unable: 0,
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
    deptId: 12,
    taskGroupName: 'New Year Shelf Restocking',
    startDate: '01/01',
    endDate: '01/05',
    progress: { completed: 7, total: 11 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'NOT_YET',
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
        status: 'NOT_YET',
        assignee: 'Laura Adams'
      }
    ]
  },
  {
    id: '15',
    no: 15,
    dept: 'DELICA',
    deptId: 13,
    taskGroupName: 'January Food Safety Inspection',
    startDate: '01/01',
    endDate: '01/10',
    progress: { completed: 5, total: 14 },
    unable: 0,
    status: 'NOT_YET',
    hqCheck: 'NOT_YET',
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
        status: 'NOT_YET',
        assignee: 'Mark Phillips'
      }
    ]
  }
];
