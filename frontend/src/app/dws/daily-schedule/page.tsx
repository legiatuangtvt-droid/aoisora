'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import {
  checkHealth,
  getStores,
  getStaff,
  getShiftAssignments,
  getShiftCodes,
  getScheduleTasks,
} from '@/lib/api';
import type { Store, Staff, ShiftAssignment, ShiftCode, DailyScheduleTask } from '@/types/api';
import { TaskStatus } from '@/types/api';

// Task Group colors from legacy system - matching data-task_groups.json
const TASK_GROUP_COLORS: Record<string, { bg: string; text: string; border: string; name: string }> = {
  POS: { bg: '#e2e8f0', text: '#1e293b', border: '#94a3b8', name: 'Thu ngan' },
  PERI: { bg: '#bbf7d0', text: '#166534', border: '#4ade80', name: 'Tuoi song' },
  DRY: { bg: '#bfdbfe', text: '#1e40af', border: '#60a5fa', name: 'Hang kho' },
  MMD: { bg: '#fde68a', text: '#92400e', border: '#facc15', name: 'Nhan hang' },
  LEADER: { bg: '#99f6e4', text: '#134e4a', border: '#2dd4bf', name: 'Quan ly' },
  'QC-FSH': { bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc', name: 'Ve sinh' },
  DELICA: { bg: '#c7d2fe', text: '#3730a3', border: '#818cf8', name: 'Delica' },
  DND: { bg: '#fecaca', text: '#991b1b', border: '#f87171', name: 'D&D' },
  OTHER: { bg: '#fbcfe8', text: '#9d174d', border: '#f472b6', name: 'Khac' },
};

// Task assignment for a time slot
interface ScheduledTask {
  taskCode: string;
  taskName: string;
  groupId: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  isComplete?: boolean;
  status?: number;  // 1=Not Yet, 2=Done, 3=Skipped, 4=In Progress
  scheduleTaskId?: number;
}

// Floating icon for animation
interface FloatingIcon {
  id: string;
  x: number;
  y: number;
  icon: string;
  color: string;
}

// Note: MOCK_SCHEDULED_TASKS removed - now using API via getScheduleTasks()

// Mock data from JSON files (subset for demo)
const MOCK_STORES: Store[] = [
  { store_id: 1, store_code: 'AMPM_D1_NCT', store_name: 'AEON MaxValu Nguyen Cu Trinh', region_id: null, area_id: null, address: 'Quan 1, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
  { store_id: 2, store_code: 'AMPM_D3_LVT', store_name: 'AEON MaxValu Le Van Sy', region_id: null, area_id: null, address: 'Quan 3, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
  { store_id: 3, store_code: 'AMPM_D10_CMT', store_name: 'AEON MaxValu CMT8', region_id: null, area_id: null, address: 'Quan 10, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
  { store_id: 4, store_code: 'AMPM_SALA', store_name: 'AEON MaxValu Sala', region_id: null, area_id: null, address: 'Quan 2, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
];

const MOCK_STAFF: Staff[] = [
  { staff_id: 1, staff_code: 'AMPM_D1_NCT_LEAD_01', staff_name: 'Vo Minh Tuan', role: 'STORE_LEADER_G3', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 2, staff_code: 'AMPM_D1_NCT_STAFF_02', staff_name: 'Dang Thu Ha', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 3, staff_code: 'AMPM_D1_NCT_STAFF_03', staff_name: 'Hoang Xuan Kien', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 4, staff_code: 'AMPM_D1_NCT_STAFF_04', staff_name: 'Bui Thi Lan', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 5, staff_code: 'AMPM_D1_NCT_STAFF_05', staff_name: 'Le Quoc Phong', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 6, staff_code: 'AMPM_D1_NCT_STAFF_06', staff_name: 'Tran Ngoc Hanh', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 7, staff_code: 'AMPM_D1_NCT_STAFF_07', staff_name: 'Pham Duc Anh', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 8, staff_code: 'AMPM_D1_NCT_STAFF_08', staff_name: 'Vo Phuong Chi', role: 'STAFF', store_id: 1, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 9, staff_code: 'AMPM_D3_LVT_LEAD_01', staff_name: 'Ngo Gia Bao', role: 'STORE_LEADER_G3', store_id: 2, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
  { staff_id: 10, staff_code: 'AMPM_D3_LVT_STAFF_02', staff_name: 'Duong Ngoc Mai', role: 'STAFF', store_id: 2, department_id: null, is_active: true, email: '', phone: '', created_at: '', updated_at: '' },
];

const MOCK_SHIFT_CODES: ShiftCode[] = [
  { shift_code_id: 1, shift_code: 'V8.6', shift_name: 'Ca V8.6', start_time: '06:00:00', end_time: '14:00:00', duration_hours: 8, color_code: '#4F46E5', is_active: true, created_at: '' },
  { shift_code_id: 2, shift_code: 'V8.14', shift_name: 'Ca V8.14', start_time: '14:30:00', end_time: '22:30:00', duration_hours: 8, color_code: '#10B981', is_active: true, created_at: '' },
  { shift_code_id: 3, shift_code: 'V6.8', shift_name: 'Ca V6.8', start_time: '08:00:00', end_time: '14:00:00', duration_hours: 6, color_code: '#F59E0B', is_active: true, created_at: '' },
  { shift_code_id: 4, shift_code: 'V6.16', shift_name: 'Ca V6.16', start_time: '16:00:00', end_time: '22:00:00', duration_hours: 6, color_code: '#EF4444', is_active: true, created_at: '' },
  { shift_code_id: 5, shift_code: 'OFF', shift_name: 'Nghi', start_time: '00:00:00', end_time: '00:00:00', duration_hours: 0, color_code: '#9CA3AF', is_active: true, created_at: '' },
];

// Generate mock shift assignments
const generateMockAssignments = (dateStr: string, staffList: Staff[], shiftCodes: ShiftCode[]): ShiftAssignment[] => {
  return staffList.map((staff, index) => {
    const shiftIndex = index % (shiftCodes.length - 1); // Don't use OFF for everyone
    return {
      assignment_id: index + 1,
      staff_id: staff.staff_id,
      store_id: staff.store_id,
      shift_date: dateStr,
      shift_code_id: shiftCodes[shiftIndex].shift_code_id,
      status: 'assigned',
      notes: null,
      assigned_by: null,
      assigned_at: '',
    };
  });
};

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get Monday of the week
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Schedule row type
interface ScheduleRow {
  staff: Staff;
  assignment: ShiftAssignment | null;
  shiftCode: ShiftCode | null;
}

export default function DailySchedulePage() {
  const { t } = useLanguage();
  const { currentUser } = useUser();
  const router = useRouter();
  const [backendOnline, setBackendOnline] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStoreId, setSelectedStoreId] = useState<string>('1');

  // Data
  const [stores, setStores] = useState<Store[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [shiftCodes, setShiftCodes] = useState<ShiftCode[]>([]);
  const [scheduleTasks, setScheduleTasks] = useState<DailyScheduleTask[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);

  // Ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Week dates
  const weekDates = useMemo(() => {
    const monday = getMonday(selectedDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  // Time slots generation moved inline to hour columns in render

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        await checkHealth();
        setBackendOnline(true);

        const [storesData, staffData, shiftCodesData] = await Promise.all([
          getStores().catch(() => []),
          getStaff().catch(() => []),
          getShiftCodes(true).catch(() => []),
        ]);

        if (storesData.length > 0) {
          setStores(storesData);
          setStaffList(staffData);
          setShiftCodes(shiftCodesData);
          setSelectedStoreId(String(storesData[0].store_id));
        } else {
          // Use mock data
          setStores(MOCK_STORES);
          setStaffList(MOCK_STAFF);
          setShiftCodes(MOCK_SHIFT_CODES);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setBackendOnline(false);
        // Use mock data when backend is offline
        setStores(MOCK_STORES);
        setStaffList(MOCK_STAFF);
        setShiftCodes(MOCK_SHIFT_CODES);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Load assignments when date or store changes
  useEffect(() => {
    async function loadAssignments() {
      const dateStr = formatDate(selectedDate);

      if (backendOnline) {
        try {
          const params: Record<string, unknown> = {
            start_date: dateStr,
            end_date: dateStr,
          };

          if (selectedStoreId !== 'all') {
            params.store_id = parseInt(selectedStoreId);
          }

          const data = await getShiftAssignments(params);
          setAssignments(data);
        } catch (err) {
          console.error('Failed to load assignments:', err);
          // Generate mock assignments
          const filteredStaff = staffList.filter(s => s.store_id === parseInt(selectedStoreId));
          setAssignments(generateMockAssignments(dateStr, filteredStaff, shiftCodes));
        }
      } else {
        // Generate mock assignments when offline
        const filteredStaff = staffList.filter(s => s.store_id === parseInt(selectedStoreId));
        setAssignments(generateMockAssignments(dateStr, filteredStaff, shiftCodes));
      }
    }

    if (staffList.length > 0 && shiftCodes.length > 0) {
      loadAssignments();
    }
  }, [selectedDate, selectedStoreId, backendOnline, staffList, shiftCodes]);

  // Load schedule tasks when date or store changes
  useEffect(() => {
    async function loadScheduleTasks() {
      const dateStr = formatDate(selectedDate);

      if (backendOnline) {
        try {
          const params: { store_id?: number; schedule_date?: string } = {
            schedule_date: dateStr,
          };

          if (selectedStoreId !== 'all') {
            params.store_id = parseInt(selectedStoreId);
          }

          const tasks = await getScheduleTasks(params);
          setScheduleTasks(tasks);
        } catch (err) {
          console.error('Failed to load schedule tasks:', err);
          setScheduleTasks([]);
        }
      } else {
        setScheduleTasks([]);
      }
    }

    loadScheduleTasks();
  }, [selectedDate, selectedStoreId, backendOnline]);

  // Build schedule rows
  const scheduleRows: ScheduleRow[] = useMemo(() => {
    // Filter staff by store
    const filteredStaff = selectedStoreId === 'all'
      ? staffList
      : staffList.filter(s => s.store_id === parseInt(selectedStoreId));

    return filteredStaff.map(staff => {
      const assignment = assignments.find(a => a.staff_id === staff.staff_id) || null;
      const shiftCode = assignment
        ? shiftCodes.find(sc => sc.shift_code_id === assignment.shift_code_id) || null
        : null;

      return { staff, assignment, shiftCode };
    });
  }, [staffList, assignments, shiftCodes, selectedStoreId]);

  // Auto scroll to current time when data loads
  useEffect(() => {
    if (loading || scheduleRows.length === 0) return;

    // Only scroll if viewing today
    const today = formatDate(new Date());
    const selectedDateStr = formatDate(selectedDate);
    if (today !== selectedDateStr) return;

    // Wait for DOM to render
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const now = new Date();
      const currentHour = now.getHours();

      // Find the column for current hour
      const hourColumn = container.querySelector(`th[data-hour="${currentHour}"]`);
      if (hourColumn) {
        // Calculate scroll position: column offset - some padding to show context
        const columnRect = hourColumn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollLeft = container.scrollLeft + columnRect.left - containerRect.left - 200; // 200px padding

        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth'
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [loading, scheduleRows.length, selectedDate]);

  // Navigation functions
  const changeWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };

  // Get task at specific slot for a staff (using API data)
  const getTaskAtSlot = (staffId: number, hour: number, minute: number): ScheduledTask | null => {
    // Filter tasks for this staff
    const staffTasks = scheduleTasks.filter(t => t.staff_id === staffId);

    // Find task that starts at this time slot
    const task = staffTasks.find(t => {
      if (!t.start_time) return false;
      const [startH, startM] = t.start_time.split(':').map(Number);
      return startH === hour && startM === minute;
    });

    if (!task) return null;

    // Convert API format to ScheduledTask format
    return {
      taskCode: task.task_code || '',
      taskName: task.task_name || '',
      groupId: task.group_id || 'OTHER',
      startTime: task.start_time?.substring(0, 5) || '',
      endTime: task.end_time?.substring(0, 5) || '',
      isComplete: task.status === TaskStatus.DONE,
      status: task.status,
      scheduleTaskId: task.schedule_task_id,
    };
  };

  // Get all tasks for a staff (using API data)
  const getTasksForStaff = (staffId: number): ScheduledTask[] => {
    return scheduleTasks
      .filter(t => t.staff_id === staffId)
      .map(t => ({
        taskCode: t.task_code || '',
        taskName: t.task_name || '',
        groupId: t.group_id || 'OTHER',
        startTime: t.start_time?.substring(0, 5) || '',
        endTime: t.end_time?.substring(0, 5) || '',
        isComplete: t.status === TaskStatus.DONE,
        status: t.status,
        scheduleTaskId: t.schedule_task_id,
      }));
  };

  // Handle double-click to complete task
  const handleTaskDoubleClick = async (task: ScheduledTask, event: React.MouseEvent) => {
    if (!task.scheduleTaskId) return;

    // Only allow completing tasks that are not already completed (status 2 = Done)
    if (task.status === TaskStatus.DONE) return;

    // Get click position for floating icon
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    // Create floating icon
    const iconId = `icon-${Date.now()}`;
    const groupColors = TASK_GROUP_COLORS[task.groupId] || TASK_GROUP_COLORS.OTHER;

    // Add floating icon
    setFloatingIcons(prev => [...prev, {
      id: iconId,
      x,
      y,
      icon: '✓',
      color: groupColors.border,
    }]);

    // Remove icon after animation
    setTimeout(() => {
      setFloatingIcons(prev => prev.filter(icon => icon.id !== iconId));
    }, 1000);

    // Update task status in local state (status 2 = Done)
    setScheduleTasks(prev => prev.map(t =>
      t.schedule_task_id === task.scheduleTaskId
        ? { ...t, status: TaskStatus.DONE }
        : t
    ));

    // Call API to update status (fire and forget)
    try {
      await fetch(`http://localhost:8000/api/v1/shifts/schedule-tasks/${task.scheduleTaskId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  // Handle Check Task button
  const handleCheckTask = () => {
    alert('Check Task clicked - Feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-14 bg-slate-800 flex flex-col items-center py-4 gap-2 flex-shrink-0">
        {/* Logo */}
        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
          <span className="text-white font-bold text-lg">A</span>
        </div>

        {/* Navigation Items */}
        <button
          className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center"
          title="Lich Hang Ngay"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          className="w-10 h-10 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
          title="Phan Cong Ca"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>

        <button
          className="w-10 h-10 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
          title="Bao Cao"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>

        <button
          className="w-10 h-10 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
          title="Cai Dat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Help */}
        <button
          className="w-10 h-10 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
          title="Tro Giup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {t('dws.dailySchedule')} - Lich Hang Ngay
              </h1>
            </div>

            {/* Backend status indicator + Current User */}
            <div className="flex items-center gap-4">
              {/* Current User */}
              {currentUser && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {currentUser.staff_name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-800">{currentUser.staff_name}</div>
                    <div className="text-gray-500">{currentUser.job_grade}</div>
                  </div>
                </div>
              )}

              {/* Backend Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span className="text-xs text-gray-500">
                  {backendOnline ? 'Online' : 'Offline (Demo)'}
                </span>
                <span className="text-[10px] text-gray-400 ml-1">v23-api</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Store Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600">Cua hang:</label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {stores.map(store => (
                <option key={store.store_id} value={store.store_id}>{store.store_name}</option>
              ))}
            </select>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Check Task Button */}
            <button
              onClick={handleCheckTask}
              className="px-4 py-2 bg-blue-400 text-black rounded-md border border-black hover:bg-blue-500 transition-colors text-sm font-medium"
            >
              Check Task
            </button>

            {/* Week Navigation */}
            <div className="flex items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 divide-x divide-gray-300">
              <button
                onClick={() => changeWeek(-1)}
                className="p-2 h-9 w-9 flex items-center justify-center rounded-l-md text-gray-600 hover:bg-gray-50"
                title="Tuan truoc"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {weekDates.map((date, index) => {
                const dateStr = formatDate(date);
                const isSelected = formatDate(selectedDate) === dateStr;
                const isToday = formatDate(new Date()) === dateStr;
                const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

                return (
                  <button
                    key={dateStr}
                    onClick={() => selectDay(date)}
                    className={`px-3 py-1 text-sm font-medium transition-colors min-w-[50px] ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : isToday
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs">{dayNames[index]}</div>
                    <div className="text-[10px]">{date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                  </button>
                );
              })}

              <button
                onClick={() => changeWeek(1)}
                className="p-2 h-9 w-9 flex items-center justify-center rounded-r-md text-gray-600 hover:bg-gray-50"
                title="Tuan sau"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">Dang tai du lieu...</p>
              </div>
            </div>
          ) : scheduleRows.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Khong co du lieu</p>
                <p className="text-sm">Khong co lich lam viec cho ngay nay</p>
              </div>
            </div>
          ) : (
            <div ref={scrollContainerRef} className="overflow-auto flex-1" id="schedule-grid-container">
              <table className="min-w-full border-collapse table-fixed">
                {/* Header - like legacy with completion rate */}
                <thead className="bg-slate-100 border-2 border-b-black sticky top-0 z-20">
                  <tr>
                    {/* First column - Store completion rate like legacy */}
                    <th className="p-2 border border-black w-40 min-w-40 sticky left-0 bg-slate-100 z-30">
                      <div className="relative w-full h-full flex items-center justify-center" title="Ty le hoan thanh cua cua hang">
                        <svg className="w-16 h-16" viewBox="0 0 36 36">
                          <path className="stroke-slate-300" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                          <path className="stroke-indigo-500" strokeWidth="4" fill="none" strokeDasharray="68, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-base font-bold text-indigo-600">68%</div>
                      </div>
                    </th>
                    {/* Hour columns - each hour is 1 column containing 4 quarter slots */}
                    {Array.from({ length: 19 }, (_, i) => i + 5).map(hour => (
                      <th
                        key={hour}
                        data-hour={hour}
                        className="p-2 border border-black min-w-[280px] text-center font-semibold text-slate-700"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-blue-600 text-sm">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs">1.25</span>
                          </span>
                          <span className="text-2xl">{String(hour).padStart(2, '0')}:00</span>
                          <span className="text-green-600 text-sm">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">1.50</span>
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body - like legacy with tall rows and task cards */}
                <tbody>
                  {scheduleRows.map((row) => {
                    const staffTasks = getTasksForStaff(row.staff.staff_id);
                    const completedCount = staffTasks.filter(t => t.isComplete).length;
                    const totalCount = staffTasks.length;
                    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                    const experiencePoints = totalCount * 5; // 5 points per task

                    return (
                      <tr key={row.staff.staff_id} className="border-b-2 border-black">
                        {/* Staff Info - Left Column (like legacy) */}
                        <td className="h-[106px] align-middle border-l-2 border-r-2 border-black sticky left-0 bg-white z-10 min-w-40 flex flex-col transition-all">
                          {/* Row 1: Name, Position, Experience Points */}
                          <div className="relative text-center flex-shrink-0 p-1">
                            <div className="text-sm font-semibold text-slate-800">{row.staff.staff_name}</div>
                            <div className="text-xs text-slate-600">{row.staff.role || 'Staff'}</div>
                            <div className="absolute bottom-1 right-2 text-xs text-amber-600 font-bold" title="Diem kinh nghiem">
                              <svg className="w-3 h-3 inline text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {experiencePoints.toLocaleString()}
                            </div>
                          </div>

                          {/* Row 2: Plan/Actual and Progress Ring */}
                          <div className="flex justify-between items-stretch flex-grow border-t border-black">
                            {/* Left: Plan/Actual and Alert */}
                            <div className="text-xs whitespace-nowrap border-r border-black flex-grow p-1">
                              {row.shiftCode ? (
                                <>
                                  <div><strong>Plan:</strong> {row.shiftCode.shift_code}: {row.shiftCode.start_time.substring(0, 5)}~{row.shiftCode.end_time.substring(0, 5)}</div>
                                  <div><strong>Actual:</strong> {row.shiftCode.start_time.substring(0, 5)}~{row.shiftCode.end_time.substring(0, 5)}</div>
                                  <div className="text-green-600 font-semibold">
                                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Dung gio
                                  </div>
                                </>
                              ) : (
                                <div className="text-gray-400">OFF</div>
                              )}
                            </div>

                            {/* Right: Progress Ring */}
                            <div className="relative w-12 h-12 flex-shrink-0 self-center mx-2" title={`Ty le hoan thanh: ${completionRate}%`}>
                              <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path className="stroke-slate-200" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                <path className="stroke-green-500" strokeWidth="4" fill="none" strokeDasharray={`${completionRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
                                <span className="text-xs font-bold text-green-600">{completionRate}%</span>
                                <span className="text-[10px] font-semibold text-amber-600">+{experiencePoints}</span>
                              </div>
                            </div>
                          </div>

                          {/* Row 3: Sub-tasks */}
                          <div className="border-t pb-[2px] border-black text-xs p-1">
                            <strong>Sub-tasks:</strong> {staffTasks.length > 0 ? staffTasks.slice(0, 2).map(t => t.taskName).join(', ') : 'N/A'}...
                          </div>
                        </td>

                        {/* Time Slots - 15 minute intervals with task cards */}
                        {Array.from({ length: 19 }, (_, hourIdx) => hourIdx + 5).map(hour => (
                          <td key={`${row.staff.staff_id}-hour-${hour}`} className="p-0 border border-black align-middle">
                            <div className="grid grid-cols-4 h-[104px]">
                              {[0, 15, 30, 45].map(minute => {
                                const slotTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                                const task = getTaskAtSlot(row.staff.staff_id, hour, minute);
                                const now = new Date();
                                const currentHour = now.getHours();
                                const currentMinute = now.getMinutes();
                                const currentQuarter = currentMinute < 15 ? 0 : currentMinute < 30 ? 15 : currentMinute < 45 ? 30 : 45;
                                const isCurrentSlot = hour === currentHour && minute === currentQuarter && formatDate(selectedDate) === formatDate(now);
                                const taskColors = task ? TASK_GROUP_COLORS[task.groupId] : null;

                                return (
                                  <div
                                    key={`staff-${row.staff.staff_id}-${slotTime}`}
                                    className={`quarter-hour-slot border-r border-dashed border-slate-200 last:border-r-0 h-full ${
                                      isCurrentSlot ? 'bg-amber-100' : ''
                                    }`}
                                    data-time={`${String(hour).padStart(2, '0')}:00`}
                                    data-quarter={String(minute).padStart(2, '0')}
                                  >
                                    {task && (
                                      <div
                                        className={`scheduled-task-item relative w-full h-full border-2 text-xs p-1 rounded-md shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${
                                          task.status === TaskStatus.DONE ? 'opacity-60' : ''
                                        }`}
                                        style={{
                                          backgroundColor: taskColors?.bg || '#f1f5f9',
                                          color: taskColors?.text || '#1e293b',
                                          borderColor: taskColors?.border || '#94a3b8',
                                        }}
                                        title={`${task.taskName} (${task.taskCode})${task.status === TaskStatus.DONE ? ' - Hoan thanh' : ''}`}
                                        onDoubleClick={(e) => handleTaskDoubleClick(task, e)}
                                      >
                                        {task.status === TaskStatus.DONE && (
                                          <span className="absolute top-0.5 right-0.5 text-green-600 text-sm">✓</span>
                                        )}
                                        <span className="font-medium leading-tight w-full line-clamp-2 text-[10px]">{task.taskName}</span>
                                        <span className="font-bold text-xs mt-0.5">{task.taskCode}</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      </div>

      {/* Floating Icons for task completion animation */}
      {floatingIcons.map(icon => (
        <div
          key={icon.id}
          className="floating-icon fixed pointer-events-none z-50 text-2xl font-bold animate-float-up"
          style={{
            left: icon.x,
            top: icon.y,
            color: icon.color,
          }}
        >
          {icon.icon}
        </div>
      ))}

      {/* CSS Animation for floating icons */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-30px) scale(1.5);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(1);
          }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
