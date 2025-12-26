'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Backend connection check
async function checkHealth() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const response = await fetch(API_URL.replace('/api/v1', '/health'));
  return await response.json();
}

export default function TasksPage() {
  const [backendOnline, setBackendOnline] = useState(false);
  const [currentWeek, setCurrentWeek] = useState('W52');
  const [weekRange, setWeekRange] = useState('Dec 22 - Dec 28 2025');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedDay, setSelectedDay] = useState('Fri 26/12');

  // Task counts by status
  const [taskCounts, setTaskCounts] = useState({
    active: 0,
    notYet: 0,
    overdue: 0,
    onProgress: 0,
    done: 0,
    re: 0,
  });

  useEffect(() => {
    async function init() {
      try {
        await checkHealth();
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    }
    init();
  }, []);

  const days = [
    { label: 'Mon 22/12', count: { active: 0, notYet: 0, overdue: 0, onProgress: 0, done: 0, re: 0 } },
    { label: 'Tue 23/12', count: { active: 0, notYet: 0, overdue: 0, onProgress: 0, done: 0, re: 0 } },
    { label: 'Wed 24/12', count: { active: 0, notYet: 0, overdue: 0, onProgress: 0, done: 0, re: 0 } },
    { label: 'Thu 25/12', count: { active: 0, notYet: 0, overdue: 0, onProgress: 0, done: 0, re: 0 } },
    { label: 'Fri 26/12', count: { active: 0, notYet: 0, overdue: 0, onProgress: 0, done: 0, re: 0 } },
    { label: 'Sat 27/12', count: { active: 0, notYet: 0, overdue: 0, onProgress: 0, done: 0, re: 0 } },
    { label: 'Sun 28/12', count: { active: 0, notYet: 0, overdue: 0, onProgress: 0, done: 0, re: 0 } },
  ];

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
              <span>Current User:</span>
              <select className="bg-blue-700 px-3 py-1 rounded">
                <option>Admin (View All)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select className="bg-blue-700 px-3 py-1 rounded">
                <option>All Stores</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">TASKS CỦA HÀNG</h1>
            {/* Backend status indicator - small dot */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${backendOnline ? 'bg-green-400' : 'bg-red-400'}`}
                   title={backendOnline ? 'Backend Connected' : 'Backend Offline'}/>
              <span className="text-sm">EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="bg-white border-2 border-blue-300 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Lọc theo cửa hàng</label>
              <select
                className="w-full border-2 border-gray-300 rounded p-2"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
              >
                <option value="all">Tất cả cửa hàng</option>
                <option value="store1">Store 1</option>
                <option value="store2">Store 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lọc theo nhân viên</label>
              <select
                className="w-full border-2 border-gray-300 rounded p-2"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                <option value="all">Tất cả nhân viên</option>
                <option value="staff1">Staff 1</option>
                <option value="staff2">Staff 2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <button className="text-2xl hover:bg-gray-100 px-3 py-1 rounded">«</button>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{currentWeek}</div>
              <div className="text-sm text-green-600">{weekRange}</div>
            </div>
            <button className="text-2xl hover:bg-gray-100 px-3 py-1 rounded">»</button>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
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
                    {day.count.active} Active
                  </div>
                  <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs">
                    {day.count.notYet} Not Yet
                  </div>
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                    {day.count.overdue} Overdue
                  </div>
                  <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    {day.count.onProgress} On Progress
                  </div>
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                    {day.count.done} Done
                  </div>
                  <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                    {day.count.re} RE
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-gray-500 py-8">
            No tasks for selected day/week.
          </div>
        </div>
      </div>
    </div>
  );
}
