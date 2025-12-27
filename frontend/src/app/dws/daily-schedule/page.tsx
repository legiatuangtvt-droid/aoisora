'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  checkHealth,
  getStores,
  getStaff,
  getShiftAssignments,
  getShiftCodes,
} from '@/lib/api';
import type { Store, Staff, ShiftAssignment, ShiftCode } from '@/types/api';

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
  const [backendOnline, setBackendOnline] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');

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

        setStores(storesData);
        setStaffList(staffData);
        setShiftCodes(shiftCodesData);

        if (storesData.length > 0) {
          setSelectedStoreId(String(storesData[0].store_id));
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setBackendOnline(false);
        setError('Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Load assignments when date or store changes
  useEffect(() => {
    async function loadAssignments() {
      if (!backendOnline) return;

      try {
        const dateStr = formatDate(selectedDate);
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
      }
    }

    loadAssignments();
  }, [selectedDate, selectedStoreId, backendOnline]);

  // Build schedule rows
  const scheduleRows: ScheduleRow[] = useMemo(() => {
    // Filter staff by store
    const filteredStaff = selectedStoreId === 'all'
      ? staffList
      : staffList.filter(s => s.store_id === parseInt(selectedStoreId));

    return filteredStaff.map(staff => {
      const assignment = assignments.find(a => a.staff_id === staff.staff_id);
      const shiftCode = assignment
        ? shiftCodes.find(sc => sc.shift_code_id === assignment.shift_code_id)
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
  const getShiftTimeRange = (shiftCode: ShiftCode | null): string => {
    if (!shiftCode) return '-';
    return `${shiftCode.start_time.substring(0, 5)} - ${shiftCode.end_time.substring(0, 5)}`;
  };

  // Check if time is within shift
  const isWithinShift = (hour: number, shiftCode: ShiftCode | null): boolean => {
    if (!shiftCode) return false;
    const startHour = parseInt(shiftCode.start_time.split(':')[0]);
    const endHour = parseInt(shiftCode.end_time.split(':')[0]);

    if (startHour < endHour) {
      return hour >= startHour && hour < endHour;
    } else {
      // Handle overnight shifts
      return hour >= startHour || hour < endHour;
    }
  };

  // Get shift color
  const getShiftColor = (shiftCode: ShiftCode | null): string => {
    if (!shiftCode || !shiftCode.color_code) return '#E5E7EB';
    return shiftCode.color_code;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Lich Hang Ngay - Daily Schedule</h1>
              {/* Backend status */}
              <div
                className={`w-3 h-3 rounded-full ${backendOnline ? 'bg-green-400' : 'bg-red-400'}`}
                title={backendOnline ? 'Backend Connected' : 'Backend Offline'}
              />
            </div>

            {/* Store Filter */}
            <div className="flex items-center gap-4">
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Stores</option>
                {stores.map(store => (
                  <option key={store.store_id} value={store.store_id}>{store.store_name}</option>
                ))}
              </select>

              {/* Week Navigation */}
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border">
                <button
                  onClick={() => changeWeek(-1)}
                  className="p-2 hover:bg-gray-100 rounded-l-lg"
                  title="Previous Week"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : isToday
                          ? 'border-b-2 border-indigo-500 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div>{dayNames[index]}</div>
                      <div className="text-xs">{date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                    </button>
                  );
                })}

                <button
                  onClick={() => changeWeek(1)}
                  className="p-2 hover:bg-gray-100 rounded-r-lg"
                  title="Next Week"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">Loading...</p>
              </div>
            </div>
          ) : scheduleRows.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">No Data</p>
                <p className="text-sm">No staff schedules for this day</p>
              </div>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border-collapse">
                {/* Header */}
                <thead className="bg-slate-100 sticky top-0 z-20">
                  <tr>
                    <th className="p-3 border-2 border-gray-300 w-56 min-w-56 sticky left-0 bg-slate-100 z-30 text-left">
                      <div className="font-semibold text-gray-700">Staff</div>
                      <div className="text-xs text-gray-500">{formatDate(selectedDate)}</div>
                    </th>
                    <th className="p-3 border border-gray-300 w-32 min-w-32 text-center">
                      Shift
                    </th>
                    {timeSlots.map(slot => (
                      <th key={slot.time} className="p-2 border border-gray-300 min-w-[60px] text-center font-medium text-gray-600 text-sm">
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
                        <td className="p-3 border-l-2 border-r border-gray-300 sticky left-0 bg-white z-10 min-w-56">
                          <div className="font-medium text-gray-800">{row.staff.staff_name}</div>
                          <div className="text-xs text-gray-500">{row.staff.role || 'Staff'}</div>
                          {row.staff.department && (
                            <div className="text-xs text-gray-400">{row.staff.department.department_name}</div>
                          )}
                        </td>

                        {/* Shift Code */}
                        <td className="p-2 border border-gray-300 text-center">
                          {row.shiftCode ? (
                            <div>
                              <div
                                className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                                style={{
                                  backgroundColor: shiftColor,
                                  color: shiftColor === '#D3D3D3' ? '#333' : '#fff',
                                }}
                              >
                                {row.shiftCode.shift_code}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
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
                          const now = new Date();
                          const isCurrentHour = slot.hour === now.getHours() && formatDate(selectedDate) === formatDate(now);

                          return (
                            <td
                              key={`${row.staff.staff_id}-${slot.time}`}
                              className={`p-1 border border-gray-200 ${isCurrentHour ? 'bg-amber-100' : ''}`}
                            >
                              {isActive && (
                                <div
                                  className="h-8 rounded"
                                  style={{ backgroundColor: `${shiftColor}40` }}
                                />
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

        {/* Legend */}
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Shift Codes</h3>
          <div className="flex flex-wrap gap-4">
            {shiftCodes.map(code => (
              <div key={code.shift_code_id} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: code.color_code || '#E5E7EB' }}
                />
                <span className="text-sm">
                  <strong>{code.shift_code}</strong> - {code.shift_name}
                  <span className="text-gray-500 ml-1">
                    ({code.start_time?.substring(0, 5)} - {code.end_time?.substring(0, 5)})
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
