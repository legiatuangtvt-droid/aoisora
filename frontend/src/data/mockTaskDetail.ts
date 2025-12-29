import { TaskDetail, StoreResult, StaffResult, WorkflowStep, Comment, ImageItem } from '@/types/tasks';

// Sample office image for mock data
const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop';
const SAMPLE_STORE_IMAGE = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop';

// Mock comments
const mockComments: Comment[] = [
  {
    id: 'cmt-1',
    userId: 'user-1',
    userName: 'Tùng SM Ocean',
    userInitials: 'TS',
    content: 'nhà cung cấp giao thiếu hoa nên chỉ có hình ABC.',
    createdAt: '2025-12-16T09:27:00',
  },
  {
    id: 'cmt-2',
    userId: 'user-2',
    userName: 'Việt',
    userInitials: 'V',
    content: 'ok mì đã báo MO xử lý tiếp.',
    createdAt: '2025-12-16T10:05:00',
  },
];

// Mock images
const mockImages: ImageItem[] = [
  {
    id: 'img-1',
    title: 'Picture at POS',
    url: SAMPLE_IMAGE,
    thumbnailUrl: SAMPLE_IMAGE,
    uploadedAt: '2025-12-01',
    count: 3,
  },
  {
    id: 'img-2',
    title: 'Picture at Peri Area',
    url: SAMPLE_STORE_IMAGE,
    thumbnailUrl: SAMPLE_STORE_IMAGE,
    uploadedAt: '2025-12-01',
    count: 2,
  },
  {
    id: 'img-3',
    title: 'Picture at Ware House',
    url: SAMPLE_IMAGE,
    thumbnailUrl: SAMPLE_IMAGE,
    uploadedAt: '2025-12-01',
    count: 1,
  },
  {
    id: 'img-4',
    title: 'Picture at POS',
    url: SAMPLE_STORE_IMAGE,
    thumbnailUrl: SAMPLE_STORE_IMAGE,
    uploadedAt: '2025-12-01',
    count: 3,
  },
];

// Mock store results
const mockStoreResults: StoreResult[] = [
  {
    id: 'store-result-1',
    storeId: '3016',
    storeName: 'OCEAN PARK',
    storeLocation: 'The North - Ocean area - 3016',
    startTime: '04:30 30 Nov, 2025',
    completedTime: '17:00 03 Dec, 2025',
    status: 'success',
    completedBy: {
      id: 'user-1',
      name: 'Tùng (SM Ocean)',
    },
    images: mockImages,
    comments: mockComments,
    likes: {
      count: 2,
      users: [
        { id: 'user-3', name: 'User 1' },
        { id: 'user-4', name: 'User 2' },
      ],
    },
  },
  {
    id: 'store-result-2',
    storeId: '3027',
    storeName: 'ZEN PARK',
    storeLocation: 'The North - Ocean area - 3027',
    startTime: '04:30 30 Nov, 2025',
    completedTime: '17:00 03 Dec, 2025',
    status: 'failed',
    completedBy: {
      id: 'user-1',
      name: 'Tùng (SM Ocean)',
    },
    images: mockImages,
    comments: mockComments,
    likes: {
      count: 0,
      users: [],
    },
  },
  {
    id: 'store-result-3',
    storeId: '3028',
    storeName: 'ZEN PARK',
    storeLocation: 'The North - Ocean area - 3027',
    startTime: '04:30 30 Nov, 2025',
    status: 'in_progress',
    completedBy: {
      id: 'user-1',
      name: 'Tùng (SM Ocean)',
    },
    images: [],
    comments: mockComments,
    likes: {
      count: 0,
      users: [],
    },
  },
];

// Mock staff results
const mockStaffResults: StaffResult[] = [
  {
    id: 'staff-1',
    staffId: '3371-6612',
    staffName: 'Đỗ Thị Kim Duyên',
    avatar: undefined,
    position: 'Senior Associate',
    store: 'Store: 4432',
    storeId: '4432',
    progress: 100,
    progressText: '100% (15/15 items)',
    status: 'success',
    requirements: [
      { id: 'req-1', url: SAMPLE_STORE_IMAGE, isCompleted: true },
      { id: 'req-2', url: SAMPLE_IMAGE, isCompleted: true },
      { id: 'req-3', url: SAMPLE_STORE_IMAGE, isCompleted: true },
      { id: 'req-4', url: SAMPLE_IMAGE, isCompleted: true },
    ],
    comments: [
      {
        id: 'staff-cmt-1',
        userId: 'user-1',
        userName: 'Tùng SM Ocean',
        userInitials: 'TS',
        content: 'nhà cung cấp giao thiếu hoa nên chỉ...',
        createdAt: '2025-12-16T09:21:00',
      },
      {
        id: 'staff-cmt-2',
        userId: 'user-sm',
        userName: 'SM Ocean',
        userInitials: 'SM',
        content: 'ok, I\'ll check later',
        createdAt: '2025-12-16T10:23:00',
      },
    ],
  },
  {
    id: 'staff-2',
    staffId: '3374-6615',
    staffName: 'Đỗ Thị Kim Duyên',
    avatar: undefined,
    position: 'Senior Associate',
    store: 'Store: 4432',
    storeId: '4432',
    progress: 75,
    progressText: '75% (7.5/10 items)',
    status: 'in_progress',
    requirements: [
      { id: 'req-5', url: SAMPLE_STORE_IMAGE, isCompleted: true },
      { id: 'req-6', url: SAMPLE_IMAGE, isCompleted: true },
      { id: 'req-7', url: '', isCompleted: false },
      { id: 'req-8', url: '', isCompleted: false },
    ],
    comments: [
      {
        id: 'staff-cmt-3',
        userId: 'user-1',
        userName: 'Tùng SM Ocean',
        userInitials: 'TS',
        content: 'nhà cung cấp giao thiếu hoa nên chỉ...',
        createdAt: '2025-12-16T10:21:00',
      },
    ],
  },
  {
    id: 'staff-3',
    staffId: '3375-6616',
    staffName: 'Đỗ Thị Kim Duyên',
    avatar: undefined,
    position: 'Senior Associate',
    store: 'Store: 4432',
    storeId: '4432',
    progress: 0,
    progressText: '0% (0/15 items)',
    status: 'not_started',
    requirements: [
      { id: 'req-9', url: '', isCompleted: false },
      { id: 'req-10', url: '', isCompleted: false },
      { id: 'req-11', url: '', isCompleted: false },
      { id: 'req-12', url: '', isCompleted: false },
    ],
    comments: [],
  },
];

// Mock workflow steps
const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: 'step-1',
    step: 1,
    name: 'SUBMIT',
    status: 'completed',
    assignee: {
      id: 'user-ndv',
      name: 'Nguyen Dai Viet',
    },
    startDay: 'Oct 10, 2025',
    endDay: 'Oct 12, 2025',
    comment: 'Reference doc about Lorem Ipsum, giving information on its origins',
  },
  {
    id: 'step-2',
    step: 2,
    name: 'APPROVE',
    status: 'completed',
    assignee: {
      id: 'user-yn',
      name: 'YachiNaga',
    },
    startDay: 'Oct 14, 2025',
    endDay: 'Oct 15, 2025',
    comment: 'Lorem Ipsum, giving information on the origins',
  },
  {
    id: 'step-3',
    step: 3,
    name: 'DO TASK',
    status: 'in_progress',
    skipInfo: '27 Stores',
    startDay: 'Oct 19, 2025',
    endDay: 'Oct 121, 2025',
  },
  {
    id: 'step-4',
    step: 4,
    name: 'CHECK',
    status: 'pending',
    assignee: {
      id: 'user-peri',
      name: 'PERI',
    },
    startDay: 'Oct 19, 2025',
    endDay: 'Oct 121, 2025',
  },
];

// Mock task detail - "Trưng bày hoa ngày rằm"
export const mockTaskDetail1: TaskDetail = {
  id: 'task-1',
  level: 1,
  name: 'Trưng bày hoa ngày rằm',
  startDate: '04 Nov - 21 Dec',
  endDate: '21 Dec',
  hqCheckCode: 'D097',
  hqCheckStatus: 'DONE',
  taskType: 'image',
  manualLink: '/manuals/hoa-ngay-ram',
  stats: {
    totalStaff: 0,
    notStarted: 10,
    completed: 12,
    unableToComplete: 5,
    avgCompletionTime: 60,
  },
  storeResults: mockStoreResults,
  staffResults: mockStaffResults,
  workflowSteps: mockWorkflowSteps,
};

// Mock task detail - "Survey khách hàng"
export const mockTaskDetail2: TaskDetail = {
  id: 'task-2',
  level: 1,
  name: 'Survey khách hàng',
  startDate: '04 Nov - 21 Dec',
  endDate: '21 Dec',
  hqCheckCode: 'D097',
  hqCheckStatus: 'NOT_YET',
  taskType: 'checklist',
  manualLink: '/manuals/survey',
  stats: {
    totalStaff: 0,
    notStarted: 4,
    completed: 10,
    unableToComplete: 2,
    avgCompletionTime: 120,
  },
  storeResults: mockStoreResults,
  staffResults: mockStaffResults,
  workflowSteps: mockWorkflowSteps,
};

// Mock task detail - "Tạo khảo sát đối thủ"
export const mockTaskDetail3: TaskDetail = {
  id: 'task-3',
  level: 1,
  name: 'Tạo khảo sát đối thủ',
  startDate: '04 Nov - 21 Dec',
  endDate: '21 Dec',
  hqCheckCode: 'D10',
  hqCheckStatus: 'DRAFT',
  taskType: 'image',
  stats: {
    totalStaff: 10,
    notStarted: 0,
    completed: 8,
    unableToComplete: 2,
    avgCompletionTime: 0,
  },
  storeResults: [],
  staffResults: mockStaffResults,
  workflowSteps: mockWorkflowSteps,
};

// Get mock task detail by ID
export function getMockTaskDetail(taskId: string): TaskDetail | null {
  const tasks: Record<string, TaskDetail> = {
    'task-1': mockTaskDetail1,
    'task-2': mockTaskDetail2,
    'task-3': mockTaskDetail3,
  };
  return tasks[taskId] || mockTaskDetail1;
}

// Filter options
export const mockFilterOptions = {
  regions: [
    { value: '', label: 'Region' },
    { value: 'north', label: 'The North' },
    { value: 'south', label: 'The South' },
    { value: 'central', label: 'Central' },
  ],
  areas: [
    { value: '', label: 'Area' },
    { value: 'ocean', label: 'Ocean area' },
    { value: 'mountain', label: 'Mountain area' },
    { value: 'city', label: 'City area' },
  ],
  stores: [
    { value: '', label: 'Store' },
    { value: '30', label: 'Store: 30' },
    { value: '31', label: 'Store: 31' },
    { value: '32', label: 'Store: 32' },
  ],
  locations: [
    { value: '', label: 'All Locations' },
    { value: 'loc-1', label: 'Location 1' },
    { value: 'loc-2', label: 'Location 2' },
  ],
  statuses: [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'not_started', label: 'Not Started' },
  ],
};
