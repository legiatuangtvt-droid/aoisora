import {
  TodoTask,
  DailyTaskData,
  WeekOverviewTask,
  LastWeekReviewTask,
  WeekInfo,
  ManagerComment,
  TodoTaskPageData,
} from '@/types/todoTask';

// Week 51, 2025 data (December 15-21, 2025)
export const mockWeekInfo: WeekInfo = {
  weekNumber: 51,
  year: 2025,
  startDate: new Date(2025, 11, 15), // Dec 15, 2025
  endDate: new Date(2025, 11, 21), // Dec 21, 2025
  dateRange: 'December 15 - December 21',
};

// Overall Week 51 tasks
export const mockOverviewTasks: WeekOverviewTask[] = [
  {
    id: 'ov-1',
    name: '1. Opening Store',
    method: 'Store visit',
    target: 'Typing...',
  },
  {
    id: 'ov-2',
    name: '2. Plan for 2026',
    method: 'Document review',
    target: 'Typing...',
  },
  {
    id: 'ov-3',
    name: '3. Support Store',
    method: 'Remote support',
    target: 'Typing...',
  },
];

// Last Week (Week 50) Review tasks
export const mockLastWeekTasks: LastWeekReviewTask[] = [
  {
    id: 'lw-1',
    name: '1. Check inventory',
    progress: 'Completed all stores',
    output: 'Report submitted',
  },
  {
    id: 'lw-2',
    name: '2. Staff training',
    progress: '95% attendance',
    output: 'Training certificates',
  },
  {
    id: 'lw-3',
    name: '3. Sales review',
    progress: 'Targets exceeded',
    output: 'Q4 performance',
  },
];

// Daily tasks for Week 51
export const mockDailyTasks: DailyTaskData[] = [
  {
    date: new Date(2025, 11, 15),
    dayOfWeek: 'MON',
    dayNumber: 15,
    month: 'Dec',
    isWeekend: false,
    location: {
      code: 'V917',
      region: 'Long Bien',
      zone: 'Ocean',
    },
    tasks: [
      { id: 't1-1', name: 'Survey competitor', type: 'personal', status: 'in_process', dueDate: '2025-12-15' },
      { id: 't1-2', name: 'Check store', type: 'store', status: 'in_process', dueDate: '2025-12-15' },
      { id: 't1-3', name: 'Create report', type: 'team', status: 'draft', dueDate: '2025-12-15' },
    ],
  },
  {
    date: new Date(2025, 11, 16),
    dayOfWeek: 'TUE',
    dayNumber: 16,
    month: 'Dec',
    isWeekend: false,
    location: {
      code: 'V917',
      region: 'Long Bien',
      zone: 'Ocean',
    },
    tasks: [
      { id: 't2-1', name: 'Survey competitor', type: 'personal', status: 'done', dueDate: '2025-12-16' },
      { id: 't2-2', name: 'Check store', type: 'store', status: 'done', dueDate: '2025-12-16' },
      { id: 't2-3', name: 'Create report', type: 'team', status: 'in_process', dueDate: '2025-12-16' },
    ],
  },
  {
    date: new Date(2025, 11, 17),
    dayOfWeek: 'WED',
    dayNumber: 17,
    month: 'Dec',
    isWeekend: false,
    location: {
      code: 'V917',
      region: 'Long Bien',
      zone: 'Ocean',
    },
    tasks: [
      { id: 't3-1', name: 'Meeting vendor', type: 'team', status: 'in_process', dueDate: '2025-12-17' },
      { id: 't3-2', name: 'Support Zen Park', type: 'store', status: 'not_yet', dueDate: '2025-12-17' },
    ],
  },
  {
    date: new Date(2025, 11, 18),
    dayOfWeek: 'THU',
    dayNumber: 18,
    month: 'Dec',
    isWeekend: false,
    location: {
      code: 'V917',
      region: 'Long Bien',
      zone: 'Ocean',
    },
    tasks: [
      { id: 't4-1', name: 'Survey competitor', type: 'personal', status: 'draft', dueDate: '2025-12-18' },
      { id: 't4-2', name: 'Check store', type: 'store', status: 'draft', dueDate: '2025-12-18' },
      { id: 't4-3', name: 'Create report', type: 'team', status: 'draft', dueDate: '2025-12-18' },
    ],
  },
  {
    date: new Date(2025, 11, 19),
    dayOfWeek: 'FRI',
    dayNumber: 19,
    month: 'Dec',
    isWeekend: false,
    location: {
      code: 'V917',
      region: 'Long Bien',
      zone: 'Ocean',
    },
    tasks: [
      { id: 't5-1', name: 'Weekly summary', type: 'personal', status: 'not_yet', dueDate: '2025-12-19' },
      { id: 't5-2', name: 'Team meeting', type: 'team', status: 'not_yet', dueDate: '2025-12-19' },
    ],
  },
  {
    date: new Date(2025, 11, 20),
    dayOfWeek: 'SAT',
    dayNumber: 20,
    month: 'Dec',
    isWeekend: true,
    tasks: [],
  },
  {
    date: new Date(2025, 11, 21),
    dayOfWeek: 'SUN',
    dayNumber: 21,
    month: 'Dec',
    isWeekend: true,
    tasks: [],
  },
];

// Manager comments
export const mockManagerComments: ManagerComment[] = [
  {
    id: 'mc-1',
    content: 'Good progress on store visits this week. Keep up the momentum.',
    author: 'Manager Nguyen',
    createdAt: new Date(2025, 11, 15, 9, 30),
  },
];

export const mockOtherComments: ManagerComment[] = [
  {
    id: 'oc-1',
    content: 'Remember to submit reports by Friday EOD.',
    author: 'Team Lead',
    createdAt: new Date(2025, 11, 14, 14, 0),
  },
];

// Combined page data
export const mockTodoTaskPageData: TodoTaskPageData = {
  weekInfo: mockWeekInfo,
  overviewTasks: mockOverviewTasks,
  lastWeekTasks: mockLastWeekTasks,
  dailyTasks: mockDailyTasks,
  managerComments: mockManagerComments,
  otherComments: mockOtherComments,
};

// Helper function to get week info for a given date
export function getWeekInfo(date: Date): WeekInfo {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weekNumber = getWeekNumber(date);

  const startMonth = startOfWeek.toLocaleString('en-US', { month: 'long' });
  const endMonth = endOfWeek.toLocaleString('en-US', { month: 'long' });
  const startDay = startOfWeek.getDate();
  const endDay = endOfWeek.getDate();

  const dateRange =
    startMonth === endMonth
      ? `${startMonth} ${startDay} - ${endDay}`
      : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

  return {
    weekNumber,
    year: date.getFullYear(),
    startDate: startOfWeek,
    endDate: endOfWeek,
    dateRange,
  };
}

// Helper function to get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// Filter options for dropdowns
export const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'in_process', label: 'In Process' },
  { value: 'done', label: 'Done' },
  { value: 'draft', label: 'Draft' },
  { value: 'not_yet', label: 'Not Yet' },
];

export const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'personal', label: 'Personal' },
  { value: 'team', label: 'Team' },
  { value: 'store', label: 'Store' },
];

export const userOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'user1', label: 'Nguyen Van A' },
  { value: 'user2', label: 'Tran Thi B' },
  { value: 'user3', label: 'Le Van C' },
];
