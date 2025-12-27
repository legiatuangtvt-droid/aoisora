'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { checkHealth, getTasks, getStores, getStaff } from '@/lib/api';
import type { Task, Store, Staff } from '@/types/api';
import { TASK_STATUS } from '@/types/api';

// Get week info
function getWeekInfo(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `W${weekNumber}`;
}

// Get week start and end dates
function getWeekDates(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

// Format date for display
function formatDateRange(start: Date, end: Date) {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', options);
  const endStr = end.toLocaleDateString('en-US', options);
  return `${startStr} - ${endStr} ${end.getFullYear()}`;
}

// Format date as YYYY-MM-DD
function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

// Get day label
function getDayLabel(date: Date) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${dayNames[date.getDay()]} ${day}/${month}`;
}

interface DayData {
  date: Date;
  label: string;
  dateStr: string;
  counts: {
    active: number;
    notYet: number;
    overdue: number;
    onProgress: number;
    done: number;
    reject: number;
  };
}

export default function TasksPage() {
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  // Filters
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('');

  // Week info
  const weekInfo = useMemo(() => {
    const { monday, sunday } = getWeekDates(currentDate);
    return {
      weekNumber: getWeekInfo(currentDate),
      weekRange: formatDateRange(monday, sunday),
      monday,
      sunday,
    };
  }, [currentDate]);

  // Generate days for the week
  const days: DayData[] = useMemo(() => {
    const result: DayData[] = [];
    const current = new Date(weekInfo.monday);

    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      result.push({
        date,
        label: getDayLabel(date),
        dateStr: formatDate(date),
        counts: { active: 0, notYet: 0, overdue: 0, onProgress: 0, done: 0, reject: 0 },
      });
      current.setDate(current.getDate() + 1);
    }
    return result;
  }, [weekInfo.monday]);

  // Set default selected day to today or first day of week
  useEffect(() => {
    const today = formatDate(new Date());
    const todayInWeek = days.find((d) => d.dateStr === today);
    if (todayInWeek) {
      setSelectedDay(todayInWeek.label);
    } else {
      setSelectedDay(days[0]?.label || '');
    }
  }, [days]);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        // Check backend health
        await checkHealth();
        setBackendOnline(true);

        // Load stores and staff for filters
        const [storesData, staffData] = await Promise.all([
          getStores().catch(() => []),
          getStaff().catch(() => []),
        ]);
        setStores(storesData);
        setStaffList(staffData);

        // Load tasks for the week
        const tasksData = await getTasks({
          start_date: formatDate(weekInfo.monday),
          end_date: formatDate(weekInfo.sunday),
        });
        setTasks(tasksData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setBackendOnline(false);
        setError('Failed to connect to backend. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [weekInfo.monday, weekInfo.sunday]);

  // Reload tasks when filters change
  useEffect(() => {
    async function loadTasks() {
      if (!backendOnline) return;

      try {
        const params: Record<string, unknown> = {
          start_date: formatDate(weekInfo.monday),
          end_date: formatDate(weekInfo.sunday),
        };

        if (selectedStore !== 'all') {
          params.assigned_store_id = parseInt(selectedStore);
        }
        if (selectedStaff !== 'all') {
          params.assigned_staff_id = parseInt(selectedStaff);
        }

        const tasksData = await getTasks(params);
        setTasks(tasksData);
      } catch (err) {
        console.error('Failed to reload tasks:', err);
      }
    }

    loadTasks();
  }, [selectedStore, selectedStaff, weekInfo.monday, weekInfo.sunday, backendOnline]);

  // Calculate task counts per day
  const daysWithCounts = useMemo(() => {
    return days.map((day) => {
      const dayTasks = tasks.filter((task) => {
        const taskDate = task.start_date || task.due_datetime?.split('T')[0];
        return taskDate === day.dateStr;
      });

      const counts = {
        active: dayTasks.length,
        notYet: dayTasks.filter((t) => t.status_id === TASK_STATUS.NOT_YET).length,
        overdue: dayTasks.filter((t) => t.status_id === TASK_STATUS.OVERDUE).length,
        onProgress: dayTasks.filter((t) => t.status_id === TASK_STATUS.ON_PROGRESS).length,
        done: dayTasks.filter((t) => t.status_id === TASK_STATUS.DONE).length,
        reject: dayTasks.filter((t) => t.status_id === TASK_STATUS.REJECT).length,
      };

      return { ...day, counts };
    });
  }, [days, tasks]);

  // Get tasks for selected day
  const selectedDayTasks = useMemo(() => {
    const day = daysWithCounts.find((d) => d.label === selectedDay);
    if (!day) return [];

    return tasks.filter((task) => {
      const taskDate = task.start_date || task.due_datetime?.split('T')[0];
      return taskDate === day.dateStr;
    });
  }, [daysWithCounts, selectedDay, tasks]);

  // Navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Get status color
  const getStatusColor = (statusId: number | null) => {
    switch (statusId) {
      case TASK_STATUS.NOT_YET:
        return 'bg-gray-400';
      case TASK_STATUS.ON_PROGRESS:
        return 'bg-blue-500';
      case TASK_STATUS.DONE:
        return 'bg-green-500';
      case TASK_STATUS.OVERDUE:
        return 'bg-red-500';
      case TASK_STATUS.REJECT:
        return 'bg-gray-600';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusLabel = (statusId: number | null) => {
    switch (statusId) {
      case TASK_STATUS.NOT_YET:
        return 'Not Yet';
      case TASK_STATUS.ON_PROGRESS:
        return 'On Progress';
      case TASK_STATUS.DONE:
        return 'Done';
      case TASK_STATUS.OVERDUE:
        return 'Overdue';
      case TASK_STATUS.REJECT:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800">
              VỀ MÀN HÌNH HQ
            </Link>
            <div className="flex items-center gap-2">
              <span>Store:</span>
              <select
                className="bg-blue-700 px-3 py-1 rounded"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
              >
                <option value="all">All Stores</option>
                {stores.map((store) => (
                  <option key={store.store_id} value={store.store_id}>
                    {store.store_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span>Staff:</span>
              <select
                className="bg-blue-700 px-3 py-1 rounded"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                <option value="all">All Staff</option>
                {staffList.map((staff) => (
                  <option key={staff.staff_id} value={staff.staff_id}>
                    {staff.staff_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">TASKS CỦA HÀNG</h1>
            {/* Backend status indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${backendOnline ? 'bg-green-400' : 'bg-red-400'}`}
                title={backendOnline ? 'Backend Connected' : 'Backend Offline'}
              />
              <span className="text-sm">EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              className="text-2xl hover:bg-gray-100 px-3 py-1 rounded"
              onClick={goToPreviousWeek}
            >
              &laquo;
            </button>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{weekInfo.weekNumber}</div>
              <div className="text-sm text-green-600">{weekInfo.weekRange}</div>
            </div>
            <button
              className="text-2xl hover:bg-gray-100 px-3 py-1 rounded"
              onClick={goToNextWeek}
            >
              &raquo;
            </button>
          </div>

          {/* Days Grid */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {daysWithCounts.map((day, index) => (
                <div
                  key={index}
                  className={`text-center border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    selectedDay === day.label
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedDay(day.label)}
                >
                  <div className="font-semibold text-sm mb-2">{day.label.split(' ')[0]}</div>
                  <div className="text-xs text-gray-600 mb-2">{day.label.split(' ')[1]}</div>

                  {/* Status Counters */}
                  <div className="space-y-1">
                    <div className="bg-black text-white px-2 py-1 rounded text-xs font-bold">
                      {day.counts.active} Active
                    </div>
                    <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs">
                      {day.counts.notYet} Not Yet
                    </div>
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                      {day.counts.overdue} Overdue
                    </div>
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      {day.counts.onProgress} On Progress
                    </div>
                    <div className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      {day.counts.done} Done
                    </div>
                    <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                      {day.counts.reject} RE
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tasks for {selectedDay}</h2>
            <span className="text-gray-500">{selectedDayTasks.length} task(s)</span>
          </div>

          {selectedDayTasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No tasks for selected day.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayTasks.map((task) => (
                <div
                  key={task.task_id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(task.status_id)}`}
                        >
                          {getStatusLabel(task.status_id)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs border ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{task.task_name}</h3>
                      {task.task_description && (
                        <p className="text-gray-600 text-sm mt-1">{task.task_description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        {task.assigned_staff && (
                          <span>Assigned: {task.assigned_staff.staff_name}</span>
                        )}
                        {task.assigned_store && (
                          <span>Store: {task.assigned_store.store_name}</span>
                        )}
                        {task.due_datetime && (
                          <span>
                            Due: {new Date(task.due_datetime).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/tasks/${task.task_id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
