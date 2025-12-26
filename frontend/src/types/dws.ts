// DWS - Dispatch Work Schedule Types

// Shift Codes
export interface ShiftCode {
  shiftCode: string;
  timeRange: string;
  duration: number;
}

// Task Group Colors
export interface TaskGroupColor {
  name: string;
  bg: string;
  text: string;
  border: string;
}

// Time Window for tasks
export interface TimeWindow {
  startTime: string;
  endTime: string;
}

// Task definition
export interface Task {
  order: string;
  name: string;
  typeTask: 'Fixed' | 'Product' | 'CTM';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  frequencyNumber: number;
  reUnit: number;
  manual_number: string;
  note: string;
  concurrentPerformers: number;
  allowedPositions: string[];
  timeWindows?: TimeWindow[];
}

// Task Group
export interface TaskGroup {
  id: string;
  order: number;
  code: string;
  priority: number;
  color: TaskGroupColor;
  tasks: Task[];
}

// Scheduled Task
export interface ScheduledTask {
  taskCode: string;
  name: string;
  groupId: string;
  startTime: string;
  isComplete: 0 | 1;
  completingUserId?: string;
  awardedPoints?: number;
}

// Employee
export interface Employee {
  id: string;
  name: string;
  storeId: string;
  roleId: string;
  experiencePoints?: number;
}

// Store
export interface Store {
  id: string;
  name: string;
  areaId: string;
}

// Area
export interface Area {
  id: string;
  name: string;
  regionId: string;
}

// Region
export interface Region {
  id: string;
  name: string;
}

// Daily Schedule
export interface DailySchedule {
  id: string;
  employeeId: string;
  storeId: string;
  date: string;
  shift: string;
  positionId: string;
  tasks: ScheduledTask[];
  name?: string;
  role?: string;
  experiencePoints?: number;
}

// User Roles
export type UserRoleId =
  | 'ADMIN'
  | 'HQ_STAFF'
  | 'REGIONAL_MANAGER'
  | 'AREA_MANAGER'
  | 'STORE_INCHARGE'
  | 'STORE_LEADER'
  | 'STAFF';

// Current User
export interface CurrentUser {
  id: string;
  name: string;
  roleId: UserRoleId;
  storeId?: string;
}

// Payroll Cycle
export interface PayrollCycle {
  start: Date;
  end: Date;
}
