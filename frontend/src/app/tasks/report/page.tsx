'use client';

import { useState } from 'react';
import WeeklyCompletionGrid from '@/components/report/WeeklyCompletionGrid';
import StackedBarChart from '@/components/report/StackedBarChart';
import StoreReportTable from '@/components/report/StoreReportTable';
import { mockWeeklyStoreData, mockWeeklyChartData, mockStoreReportData, DEPARTMENTS } from '@/data/mockReportData';

export default function ReportPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedWeeks] = useState<string[]>(['W40', 'W41', 'W42', 'W43', 'W44', 'W45']);

  // Filter chart data by department
  const filteredChartData = selectedDepartment === 'all'
    ? mockWeeklyChartData
    : mockWeeklyChartData; // In real app, filter by department

  return (
    <div className="p-6">
      {/* Top Section: Grid + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Completion Grid */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <WeeklyCompletionGrid
            data={mockWeeklyStoreData}
            weeks={selectedWeeks}
          />
        </div>

        {/* Stacked Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All dept</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500">Role plan: be</span>
          </div>
          <StackedBarChart data={filteredChartData} />
        </div>
      </div>

      {/* Bottom Section: Detailed Store Report Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <StoreReportTable
          data={mockStoreReportData}
          departments={DEPARTMENTS}
        />
      </div>
    </div>
  );
}
