'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Store, Area, Region, Employee } from '@/types/dws';
import { formatDate, getPayrollCycle, defaultShiftCodes } from '@/data/shiftCodes';

// Mock data
const mockRegions: Region[] = [
  { id: 'region-1', name: 'Mien Nam' },
  { id: 'region-2', name: 'Mien Bac' },
];

const mockAreas: Area[] = [
  { id: 'area-1', name: 'HCM - Quan 1-5', regionId: 'region-1' },
  { id: 'area-2', name: 'HCM - Quan 6-12', regionId: 'region-1' },
  { id: 'area-3', name: 'Ha Noi - Noi Thanh', regionId: 'region-2' },
];

const mockStores: Store[] = [
  { id: 'store-1', name: 'AEON MaxValu Dien Bien Phu', areaId: 'area-1' },
  { id: 'store-2', name: 'AEON MaxValu Tan Phu', areaId: 'area-1' },
  { id: 'store-3', name: 'AEON MaxValu Go Vap', areaId: 'area-2' },
  { id: 'store-4', name: 'AEON MaxValu Binh Thanh', areaId: 'area-2' },
  { id: 'store-5', name: 'AEON MaxValu Cau Giay', areaId: 'area-3' },
];

const mockEmployees: Employee[] = [
  { id: 'emp-1', name: 'Nguyen Van A', storeId: 'store-1', roleId: 'STORE_LEADER', experiencePoints: 1250 },
  { id: 'emp-2', name: 'Tran Thi B', storeId: 'store-1', roleId: 'STAFF', experiencePoints: 890 },
  { id: 'emp-3', name: 'Le Van C', storeId: 'store-1', roleId: 'STAFF', experiencePoints: 1100 },
  { id: 'emp-4', name: 'Pham Thi D', storeId: 'store-2', roleId: 'STORE_LEADER', experiencePoints: 950 },
  { id: 'emp-5', name: 'Hoang Van E', storeId: 'store-2', roleId: 'STAFF', experiencePoints: 780 },
  { id: 'emp-6', name: 'Vo Thi F', storeId: 'store-3', roleId: 'STORE_LEADER', experiencePoints: 1350 },
  { id: 'emp-7', name: 'Dang Van G', storeId: 'store-3', roleId: 'STAFF', experiencePoints: 920 },
  { id: 'emp-8', name: 'Bui Thi H', storeId: 'store-4', roleId: 'STORE_LEADER', experiencePoints: 1150 },
  { id: 'emp-9', name: 'Ngo Van I', storeId: 'store-5', roleId: 'STORE_LEADER', experiencePoints: 1050 },
];

// Template man-hour per day
const TEMPLATE_MANHOUR = 80;

// Generate mock availability and calculate diff
function generateMockDiff(storeId: string, dateStr: string): number {
  // Simulate random diff between -16 and +16
  const seed = storeId.charCodeAt(storeId.length - 1) + dateStr.charCodeAt(dateStr.length - 1);
  const diff = ((seed * 7) % 33) - 16;
  return diff;
}

// Generate availability for an employee
function generateMockAvailability(employeeId: string, dateStr: string): { shift: string; priority: number }[] {
  const seed = employeeId.charCodeAt(employeeId.length - 1) + dateStr.charCodeAt(dateStr.length - 1);
  if (seed % 4 === 0) return []; // No registration

  const shifts = ['V812', 'V829'];
  return [{ shift: shifts[seed % 2], priority: 1 }];
}

interface HierarchyItem {
  id: string;
  name: string;
  type: 'region' | 'area' | 'store' | 'employee';
  children?: HierarchyItem[];
  storeId?: string;
  roleId?: string;
}

export default function WorkforceDispatchPage() {
  const [currentCycle, setCurrentCycle] = useState<{ start: Date; end: Date }>(() => getPayrollCycle(new Date()));
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Cycle dates
  const cycleDates = useMemo(() => {
    const dates: Date[] = [];
    const current = new Date(currentCycle.start);
    while (current <= currentCycle.end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [currentCycle]);

  // Build hierarchy
  const hierarchy = useMemo((): HierarchyItem[] => {
    return mockRegions.map(region => ({
      id: region.id,
      name: region.name,
      type: 'region' as const,
      children: mockAreas
        .filter(area => area.regionId === region.id)
        .map(area => ({
          id: area.id,
          name: area.name,
          type: 'area' as const,
          children: mockStores
            .filter(store => store.areaId === area.id)
            .map(store => ({
              id: store.id,
              name: store.name,
              type: 'store' as const,
              children: mockEmployees
                .filter(emp => emp.storeId === store.id)
                .map(emp => ({
                  id: emp.id,
                  name: emp.name,
                  type: 'employee' as const,
                  storeId: emp.storeId,
                  roleId: emp.roleId,
                })),
            })),
        })),
    }));
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, [currentCycle]);

  // Navigation
  const changeCycle = (direction: number) => {
    const newRef = new Date(currentCycle.start);
    newRef.setMonth(newRef.getMonth() + direction);
    setCurrentCycle(getPayrollCycle(newRef));
  };

  // Toggle row expansion
  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Render a row recursively
  const renderRow = (item: HierarchyItem, level: number): React.ReactNode[] => {
    const isExpanded = expandedRows.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const indent = level * 24;
    const rows: React.ReactNode[] = [];

    // Different background colors based on type
    const bgColors = {
      region: 'bg-indigo-50',
      area: 'bg-blue-50',
      store: 'bg-white',
      employee: 'bg-white',
    };

    rows.push(
      <tr key={item.id} className={`${bgColors[item.type]} hover:bg-gray-50 border-b`}>
        <td className="p-2 border sticky left-0 bg-inherit z-10 min-w-[300px]">
          <div className="flex items-center" style={{ paddingLeft: `${indent}px` }}>
            {hasChildren ? (
              <button
                onClick={() => toggleRow(item.id)}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full mr-2"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div className="w-6 h-6 mr-2" />
            )}
            <div>
              <span className={`font-semibold text-sm ${item.type === 'region' ? 'text-indigo-700' : item.type === 'area' ? 'text-blue-700' : 'text-gray-800'}`}>
                {item.name}
              </span>
              {item.type === 'employee' && item.roleId && (
                <div className="text-xs text-gray-500">{item.roleId}</div>
              )}
            </div>
          </div>
        </td>

        {/* Date cells */}
        {cycleDates.map(date => {
          const dateStr = formatDate(date);
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          if (item.type === 'store') {
            const diff = generateMockDiff(item.id, dateStr);
            return (
              <td
                key={dateStr}
                colSpan={2}
                className={`p-2 border text-center text-sm font-bold ${isWeekend ? 'bg-amber-50' : ''} ${
                  diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'
                }`}
              >
                {diff !== 0 && (
                  <>
                    {diff > 0 ? '↑' : '↓'} {Math.abs(diff).toFixed(1)}
                  </>
                )}
              </td>
            );
          }

          if (item.type === 'employee') {
            const availability = generateMockAvailability(item.id, dateStr);
            if (availability.length === 0) {
              return (
                <td key={dateStr} colSpan={2} className={`p-2 border text-center text-xs text-slate-400 italic ${isWeekend ? 'bg-amber-50' : ''}`}>
                  Khong dang ky
                </td>
              );
            }

            const shift = availability[0].shift;
            const shiftInfo = defaultShiftCodes.find(s => s.shiftCode === shift);

            return (
              <td key={dateStr} colSpan={2} className={`p-1 border ${isWeekend ? 'bg-amber-50' : ''}`}>
                <div className="bg-green-50 rounded p-1 text-center">
                  <select className="text-xs w-full bg-transparent border-none text-center" defaultValue={item.storeId}>
                    {mockStores.map(store => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">{shiftInfo?.timeRange || shift}</div>
                </div>
              </td>
            );
          }

          // Region/Area - show aggregate count
          return (
            <td key={dateStr} colSpan={2} className={`p-2 border text-center ${isWeekend ? 'bg-amber-50' : ''}`}>
              <span className="text-xs text-slate-600">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {Math.floor(Math.random() * 10) + 5}
              </span>
            </td>
          );
        })}
      </tr>
    );

    // Render children if expanded
    if (hasChildren && isExpanded) {
      item.children!.forEach(child => {
        rows.push(...renderRow(child, level + 1));
      });
    }

    return rows;
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
              <h1 className="text-xl font-bold text-gray-800">Dieu Phoi Nhan Luc - Workforce Dispatch</h1>
            </div>

            {/* Cycle Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeCycle(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Chu ky truoc"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800">
                  Chu ky tu {currentCycle.start.toLocaleDateString('vi-VN')} den {currentCycle.end.toLocaleDateString('vi-VN')}
                </h3>
              </div>

              <button
                onClick={() => changeCycle(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Chu ky toi"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Luu va Gui
              </button>
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
          ) : (
            <div className="overflow-auto max-h-[calc(100vh-200px)]">
              <table className="min-w-full border-collapse">
                {/* Header */}
                <thead className="bg-slate-50 sticky top-0 z-20">
                  <tr>
                    <th className="p-2 border sticky left-0 bg-slate-100 z-30 min-w-[300px] text-sm font-semibold">
                      Nhan vien
                    </th>
                    {cycleDates.map(date => {
                      const dayOfWeek = date.getDay();
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

                      return (
                        <th
                          key={formatDate(date)}
                          colSpan={2}
                          className={`p-1 border text-center min-w-[120px] ${isWeekend ? 'bg-amber-100' : 'bg-slate-100'}`}
                        >
                          <div className="font-semibold text-sm">{dayNames[dayOfWeek]}</div>
                          <div className="text-xs font-normal">
                            {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {hierarchy.map(region => renderRow(region, 0))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
