'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  checkHealth,
  getStores,
  getStaff,
  getShiftAssignments,
  getShiftCodes,
} from '@/lib/api';
import type { Store, Staff, ShiftAssignment, ShiftCode } from '@/types/api';

// Mock data from JSON files (subset for demo)
const MOCK_STORES: Store[] = [
  { store_id: 1, store_code: 'AMPM_D1_NCT', store_name: 'AEON MaxValu Nguyen Cu Trinh', region_id: null, address: 'Quan 1, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
  { store_id: 2, store_code: 'AMPM_D3_LVT', store_name: 'AEON MaxValu Le Van Sy', region_id: null, address: 'Quan 3, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
  { store_id: 3, store_code: 'AMPM_D10_CMT', store_name: 'AEON MaxValu CMT8', region_id: null, address: 'Quan 10, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
  { store_id: 4, store_code: 'AMPM_SALA', store_name: 'AEON MaxValu Sala', region_id: null, address: 'Quan 2, TP.HCM', phone: null, email: null, manager_id: null, status: 'ACTIVE', created_at: '', updated_at: '' },
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

// Time slot type
interface TimeSlot {
  time: string;
  hour: number;
}

// Schedule row type
interface ScheduleRow {
  staff: Staff;
  assignment: ShiftAssignment | null;
  shiftCode: ShiftCode | null;
}

export default function DailySchedulePage() {
  const { t } = useLanguage();
  const [backendOnline, setBackendOnline] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStoreId, setSelectedStoreId] = useState<string>('1');

  // Data
  const [stores, setStores] = useState<Store[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [shiftCodes, setShiftCodes] = useState<ShiftCode[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Week dates
  const weekDates = useMemo(() => {
    const monday = getMonday(selectedDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  // Time slots from 05:00 to 23:00
  const timeSlots: TimeSlot[] = useMemo(() => {
    return Array.from({ length: 19 }, (_, i) => ({
      time: `${String(i + 5).padStart(2, '0')}:00`,
      hour: i + 5,
    }));
  }, []);

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

  // Navigation functions
  const changeWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };

  // Get shift time range for display
  const getShiftTimeRange = (shiftCode: ShiftCode | null | undefined): string => {
    if (!shiftCode) return '-';
    return `${shiftCode.start_time.substring(0, 5)} - ${shiftCode.end_time.substring(0, 5)}`;
  };

  // Check if time is within shift
  const isWithinShift = (hour: number, shiftCode: ShiftCode | null | undefined): boolean => {
    if (!shiftCode || shiftCode.shift_code === 'OFF') return false;
    const startHour = parseInt(shiftCode.start_time.split(':')[0]);
    const endHour = parseInt(shiftCode.end_time.split(':')[0]);

    if (startHour < endHour) {
      return hour >= startHour && hour < endHour;
    } else {
      // Handle overnight shifts
      return hour >= startHour || hour < endHour;
    }
  };

  // Check if this is the first hour of shift (to show label)
  const isFirstHourOfShift = (hour: number, shiftCode: ShiftCode | null | undefined): boolean => {
    if (!shiftCode || shiftCode.shift_code === 'OFF') return false;
    const startHour = parseInt(shiftCode.start_time.split(':')[0]);
    return hour === startHour;
  };

  // Get shift color
  const getShiftColor = (shiftCode: ShiftCode | null | undefined): string => {
    if (!shiftCode || !shiftCode.color_code) return '#E5E7EB';
    return shiftCode.color_code;
  };

  // Handle Check Task button
  const handleCheckTask = () => {
    alert('Check Task clicked - Feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dws" className="text-indigo-600 hover:text-indigo-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-800">
                {t('dws.dailySchedule')} - Lich Hang Ngay
              </h1>
            </div>

            {/* Backend status indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <span className="text-xs text-gray-500">
                {backendOnline ? 'Online' : 'Offline (Demo)'}
              </span>
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
            <div className="overflow-auto flex-1">
              <table className="min-w-full border-collapse">
                {/* Header */}
                <thead className="bg-slate-100 sticky top-0 z-20">
                  <tr>
                    <th className="p-3 border-2 border-gray-300 w-48 min-w-48 sticky left-0 bg-slate-100 z-30 text-left">
                      <div className="font-semibold text-gray-700">Nhan vien</div>
                      <div className="text-xs text-gray-500">{formatDate(selectedDate)}</div>
                    </th>
                    <th className="p-3 border border-gray-300 w-28 min-w-28 text-center">
                      Ca
                    </th>
                    {timeSlots.map(slot => (
                      <th key={slot.time} className="p-2 border border-gray-300 min-w-[50px] text-center font-medium text-gray-600 text-xs">
                        {slot.time}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {scheduleRows.map(row => {
                    const shiftColor = getShiftColor(row.shiftCode);

                    return (
                      <tr key={row.staff.staff_id} className="border-b hover:bg-gray-50">
                        {/* Staff Info */}
                        <td className="p-3 border-l-2 border-r border-gray-300 sticky left-0 bg-white z-10 min-w-48">
                          <div className="font-medium text-gray-800 text-sm">{row.staff.staff_name}</div>
                          <div className="text-xs text-gray-500">{row.staff.role || 'Staff'}</div>
                        </td>

                        {/* Shift Code */}
                        <td className="p-2 border border-gray-300 text-center">
                          {row.shiftCode ? (
                            <div>
                              <div
                                className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                                style={{
                                  backgroundColor: shiftColor,
                                  color: '#fff',
                                }}
                              >
                                {row.shiftCode.shift_code}
                              </div>
                              <div className="text-[10px] text-gray-500 mt-0.5">
                                {getShiftTimeRange(row.shiftCode)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Time Slots */}
                        {timeSlots.map(slot => {
                          const isActive = isWithinShift(slot.hour, row.shiftCode);
                          const isFirstHour = isFirstHourOfShift(slot.hour, row.shiftCode);
                          const now = new Date();
                          const isCurrentHour = slot.hour === now.getHours() && formatDate(selectedDate) === formatDate(now);

                          return (
                            <td
                              key={`${row.staff.staff_id}-${slot.time}`}
                              className={`p-0.5 border border-gray-200 ${isCurrentHour ? 'bg-amber-100' : ''}`}
                            >
                              {isActive && (
                                <div
                                  className="h-6 rounded-sm flex items-center justify-start px-1"
                                  style={{ backgroundColor: `${shiftColor}90` }}
                                >
                                  {isFirstHour && (
                                    <span className="text-[9px] font-bold text-white truncate drop-shadow-sm">
                                      {row.shiftCode?.shift_code}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
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
  );
}
