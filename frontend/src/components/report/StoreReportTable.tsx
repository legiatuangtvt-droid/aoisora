'use client';

import React from 'react';

interface DepartmentTaskSummary {
  totalTask: number;
  completedTask: number;
  completePercent: number;
}

interface StoreReportRow {
  storeCode: string;
  storeName: string;
  totalTask: DepartmentTaskSummary;
  departments: Record<string, DepartmentTaskSummary>;
}

interface Department {
  id: string;
  name: string;
  color: string;
}

interface StoreReportTableProps {
  data: StoreReportRow[];
  departments: Department[];
}

// Get cell background based on completion
function getCellStyle(summary: DepartmentTaskSummary): string {
  if (summary.totalTask === 0) return '';
  if (summary.completePercent >= 100) return 'bg-green-100';
  if (summary.completePercent < 100 && summary.completedTask > 0) return 'bg-red-100';
  return '';
}

export default function StoreReportTable({ data, departments }: StoreReportTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          {/* Department Headers Row */}
          <tr className="bg-gray-100">
            <th
              className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300"
              rowSpan={2}
            >
              Store
            </th>
            <th
              className="px-2 py-2 text-left font-semibold text-gray-700 border border-gray-300"
              rowSpan={2}
            >
              Store Name
            </th>
            {/* Total Task */}
            <th
              className="px-2 py-1 text-center font-semibold text-gray-700 border border-gray-300 bg-gray-200"
              colSpan={3}
            >
              Total Task
            </th>
            {/* Department columns */}
            {departments.map((dept) => (
              <th
                key={dept.id}
                className="px-2 py-1 text-center font-semibold text-gray-700 border border-gray-300"
                colSpan={3}
                style={{ backgroundColor: dept.color }}
              >
                {dept.name}
              </th>
            ))}
          </tr>
          {/* Sub-headers Row */}
          <tr className="bg-gray-50">
            {/* Total Task sub-headers */}
            <th className="px-1 py-1 text-center font-medium text-gray-600 border border-gray-300 bg-gray-200 whitespace-nowrap">
              Total Task
            </th>
            <th className="px-1 py-1 text-center font-medium text-gray-600 border border-gray-300 bg-gray-200 whitespace-nowrap">
              Completed<br />(task actual)
            </th>
            <th className="px-1 py-1 text-center font-medium text-gray-600 border border-gray-300 bg-gray-200 whitespace-nowrap">
              Complete %
            </th>
            {/* Department sub-headers */}
            {departments.map((dept) => (
              <React.Fragment key={dept.id}>
                <th
                  className="px-1 py-1 text-center font-medium text-gray-600 border border-gray-300 whitespace-nowrap"
                  style={{ backgroundColor: dept.color }}
                >
                  Total Task
                </th>
                <th
                  className="px-1 py-1 text-center font-medium text-gray-600 border border-gray-300 whitespace-nowrap"
                  style={{ backgroundColor: dept.color }}
                >
                  Completed<br />(task actual)
                </th>
                <th
                  className="px-1 py-1 text-center font-medium text-gray-600 border border-gray-300 whitespace-nowrap"
                  style={{ backgroundColor: dept.color }}
                >
                  Complete %
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.storeCode} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-2 py-1 border border-gray-300 font-medium text-gray-900">
                {row.storeCode}
              </td>
              <td className="px-2 py-1 border border-gray-300 text-gray-900">
                {row.storeName}
              </td>
              {/* Total Task columns */}
              <td className={`px-2 py-1 border border-gray-300 text-center ${getCellStyle(row.totalTask)}`}>
                {row.totalTask.totalTask}
              </td>
              <td className={`px-2 py-1 border border-gray-300 text-center ${getCellStyle(row.totalTask)}`}>
                {row.totalTask.completedTask}
              </td>
              <td className={`px-2 py-1 border border-gray-300 text-center ${getCellStyle(row.totalTask)}`}>
                {row.totalTask.completePercent}%
              </td>
              {/* Department columns */}
              {departments.map((dept) => {
                const deptData = row.departments[dept.id] || {
                  totalTask: 0,
                  completedTask: 0,
                  completePercent: 0,
                };
                return (
                  <React.Fragment key={`${row.storeCode}-${dept.id}`}>
                    <td
                      className={`px-2 py-1 border border-gray-300 text-center ${getCellStyle(deptData)}`}
                    >
                      {deptData.totalTask || ''}
                    </td>
                    <td
                      className={`px-2 py-1 border border-gray-300 text-center ${getCellStyle(deptData)}`}
                    >
                      {deptData.completedTask || ''}
                    </td>
                    <td
                      className={`px-2 py-1 border border-gray-300 text-center ${getCellStyle(deptData)}`}
                    >
                      {deptData.totalTask > 0 ? `${deptData.completePercent}%` : ''}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
