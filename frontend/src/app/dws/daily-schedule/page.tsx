'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { DailySchedule, ScheduledTask, Employee, Store } from '@/types/dws';
import { defaultShiftCodes, formatDate, getMonday, timeToMinutes, getShiftByCode } from '@/data/shiftCodes';
import { taskGroups, getTaskGroupColor } from '@/data/taskGroups';

// Mock data for demo
const mockStores: Store[] = [
  { id: 'store-1', name: 'AEON MaxValu Dien Bien Phu', areaId: 'area-1' },
  { id: 'store-2', name: 'AEON MaxValu Tan Phu', areaId: 'area-1' },
  { id: 'store-3', name: 'AEON MaxValu Go Vap', areaId: 'area-2' },
];

const mockEmployees: Employee[] = [
  { id: 'emp-1', name: 'Nguyen Van A', storeId: 'store-1', roleId: 'STORE_LEADER', experiencePoints: 1250 },
  { id: 'emp-2', name: 'Tran Thi B', storeId: 'store-1', roleId: 'STAFF', experiencePoints: 890 },
  { id: 'emp-3', name: 'Le Van C', storeId: 'store-1', roleId: 'STAFF', experiencePoints: 1100 },
  { id: 'emp-4', name: 'Pham Thi D', storeId: 'store-1', roleId: 'STAFF', experiencePoints: 750 },
];

// Generate mock schedule data
function generateMockSchedule(date: string, storeId: string): DailySchedule[] {
  const employees = mockEmployees.filter(e => e.storeId === storeId);
  const shifts = ['V812', 'V829'];
  const positions = ['LEADER', 'POS', 'MERCHANDISE', 'CAFE'];

  return employees.map((emp, index) => {
    const shift = shifts[index % 2];
    const position = positions[index % positions.length];
    const shiftInfo = getShiftByCode(shift);
    const startHour = shiftInfo ? parseInt(shiftInfo.timeRange.split(':')[0]) : 6;

    // Generate some tasks for each employee
    const tasks: ScheduledTask[] = [];
    const taskGroup = taskGroups[index % taskGroups.length];

    for (let i = 0; i < 5; i++) {
      const hour = startHour + i * 2;
      if (hour < 22) {
        const task = taskGroup.tasks[i % taskGroup.tasks.length];
        tasks.push({
          taskCode: task.manual_number,
          name: task.name,
          groupId: taskGroup.id,
          startTime: `${String(hour).padStart(2, '0')}:00`,
          isComplete: Math.random() > 0.5 ? 1 : 0,
        });
      }
    }

    return {
      id: `schedule-${emp.id}-${date}`,
      employeeId: emp.id,
      storeId,
      date,
      shift,
      positionId: position,
      tasks,
      name: emp.name,
      role: emp.roleId,
      experiencePoints: emp.experiencePoints,
    };
  });
}

export default function DailySchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStoreId, setSelectedStoreId] = useState<string>(mockStores[0].id);
  const [schedules, setSchedules] = useState<DailySchedule[]>([]);
  const [loading, setLoading] = useState(true);

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
  const timeSlots = useMemo(() => {
    return Array.from({ length: 19 }, (_, i) => `${String(i + 5).padStart(2, '0')}:00`);
  }, []);

  // Load schedule data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const dateStr = formatDate(selectedDate);
      const data = generateMockSchedule(dateStr, selectedStoreId);
      setSchedules(data);
      setLoading(false);
    }, 500);
  }, [selectedDate, selectedStoreId]);

  // Navigation functions
  const changeWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };

  // Calculate completion rate
  const completionRate = useMemo(() => {
    const allTasks = schedules.flatMap(s => s.tasks);
    if (allTasks.length === 0) return 0;
    const completed = allTasks.filter(t => t.isComplete === 1).length;
    return Math.round((completed / allTasks.length) * 100);
  }, [schedules]);

  // Toggle task completion
  const toggleTaskComplete = (scheduleId: string, taskIndex: number) => {
    setSchedules(prev =>
      prev.map(schedule => {
        if (schedule.id === scheduleId) {
          const newTasks = [...schedule.tasks];
          newTasks[taskIndex] = {
            ...newTasks[taskIndex],
            isComplete: newTasks[taskIndex].isComplete === 1 ? 0 : 1,
          };
          return { ...schedule, tasks: newTasks };
        }
        return schedule;
      })
    );
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
            </div>

            {/* Store Filter */}
            <div className="flex items-center gap-4">
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {mockStores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>

              {/* Week Navigation */}
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border">
                <button
                  onClick={() => changeWeek(-1)}
                  className="p-2 hover:bg-gray-100 rounded-l-lg"
                  title="Tuan truoc"
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
                  title="Tuan sau"
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">Dang tai du lieu...</p>
              </div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Chua co du lieu</p>
                <p className="text-sm">Chua hang chua co lich lam viec cho ngay nay</p>
              </div>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border-collapse">
                {/* Header */}
                <thead className="bg-slate-100 sticky top-0 z-20">
                  <tr>
                    <th className="p-2 border-2 border-black w-48 min-w-48 sticky left-0 bg-slate-100 z-30">
                      <div className="flex items-center justify-center">
                        <div className="relative w-16 h-16">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                              className="text-slate-300"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-indigo-500"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={`${completionRate}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-base font-bold text-indigo-600">
                            {completionRate}%
                          </div>
                        </div>
                      </div>
                    </th>
                    {timeSlots.map(time => (
                      <th key={time} className="p-2 border border-black min-w-[310px] text-center font-semibold text-slate-700">
                        <span className="text-2xl">{time}</span>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {schedules.map(schedule => {
                    const shiftInfo = getShiftByCode(schedule.shift);
                    const timeRange = shiftInfo?.timeRange || '';
                    const totalTasks = schedule.tasks.length;
                    const completedTasks = schedule.tasks.filter(t => t.isComplete === 1).length;
                    const employeeCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    return (
                      <tr key={schedule.id} className="border-b-2 border-black hover:bg-gray-50">
                        {/* Employee Info */}
                        <td className="h-[106px] border-l-2 border-r-2 border-black sticky left-0 bg-white z-10 min-w-48">
                          <div className="p-2">
                            <div className="text-center">
                              <div className="text-sm font-semibold text-slate-800">{schedule.name}</div>
                              <div className="text-xs text-slate-600">{schedule.positionId}</div>
                              <div className="text-xs text-amber-600 font-bold mt-1">
                                <span className="text-amber-500">★</span> {(schedule.experiencePoints || 0).toLocaleString()}
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 border-t pt-2">
                              <div className="text-xs">
                                <div><strong>Plan:</strong> {schedule.shift}: {timeRange}</div>
                              </div>
                              <div className="relative w-10 h-10">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                  <path
                                    className="text-slate-200"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                  <path
                                    className="text-green-500"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${employeeCompletionRate}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-600">
                                  {employeeCompletionRate}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Time Slots */}
                        {timeSlots.map(time => {
                          const tasksInSlot = schedule.tasks.filter(t => t.startTime === time);
                          const hour = parseInt(time.split(':')[0]);
                          const now = new Date();
                          const currentHour = now.getHours();
                          const isCurrentHour = hour === currentHour && formatDate(selectedDate) === formatDate(now);

                          return (
                            <td
                              key={`${schedule.id}-${time}`}
                              className={`p-1 border border-black align-middle ${isCurrentHour ? 'bg-amber-50' : ''}`}
                            >
                              <div className="grid grid-cols-4 h-[100px] gap-1">
                                {tasksInSlot.map((task, idx) => {
                                  const taskIndex = schedule.tasks.indexOf(task);
                                  const color = getTaskGroupColor(task.groupId);

                                  return (
                                    <div
                                      key={idx}
                                      onClick={() => toggleTaskComplete(schedule.id, taskIndex)}
                                      className={`w-[70px] h-[96px] border-2 text-xs p-1 rounded-md shadow-sm flex flex-col justify-between items-center text-center cursor-pointer transition-all hover:scale-105 ${
                                        task.isComplete === 1 ? 'opacity-60 line-through' : ''
                                      }`}
                                      style={{
                                        backgroundColor: color.bg,
                                        color: color.text,
                                        borderColor: color.border,
                                      }}
                                      title={`${task.name} (${task.taskCode})`}
                                    >
                                      <div className="flex-grow flex flex-col justify-center overflow-hidden">
                                        <span className="overflow-hidden text-ellipsis">{task.name}</span>
                                      </div>
                                      <span className="font-semibold mt-auto">{task.taskCode}</span>
                                      {task.isComplete === 1 && (
                                        <div className="absolute top-1 right-1 text-green-600">
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
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
