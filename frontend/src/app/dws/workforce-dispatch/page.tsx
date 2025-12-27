'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data based on database JSON
const MOCK_REGIONS = [
  { id: 'HCM', name: 'Ho Chi Minh' },
  { id: 'HN', name: 'Ha Noi' },
  { id: 'DN', name: 'Da Nang' },
];

const MOCK_AREAS = [
  { id: 'HCM_CENTRAL', name: 'HCM - Khu Trung Tam', regionId: 'HCM' },
  { id: 'HCM_EAST', name: 'HCM - Khu Dong', regionId: 'HCM' },
  { id: 'HN_DDA', name: 'Ha Noi - Dong Da', regionId: 'HN' },
  { id: 'DN_HCH', name: 'Da Nang - Hai Chau', regionId: 'DN' },
];

const MOCK_STORES = [
  { id: 'AMPM_D1_NCT', name: 'AEON MaxValu Nguyen Cu Trinh', areaId: 'HCM_CENTRAL' },
  { id: 'AMPM_D3_LVT', name: 'AEON MaxValu Le Van Sy', areaId: 'HCM_CENTRAL' },
  { id: 'AMPM_D10_CMT', name: 'AEON MaxValu CMT8', areaId: 'HCM_CENTRAL' },
  { id: 'AMPM_SALA', name: 'AEON MaxValu Sala', areaId: 'HCM_EAST' },
  { id: 'AMPM_TPM', name: 'AEON MaxValu The Pegasuite', areaId: 'HCM_EAST' },
  { id: 'AMPM_HN_TDS', name: 'AEON MaxValu Tay Son', areaId: 'HN_DDA' },
  { id: 'AMPM_DN_DDB', name: 'AEON MaxValu Dien Bien Phu', areaId: 'DN_HCH' },
];

const MOCK_EMPLOYEES = [
  { id: 'emp-1', name: 'Vo Minh Tuan', storeId: 'AMPM_D1_NCT', roleId: 'STORE_LEADER_G3' },
  { id: 'emp-2', name: 'Nguyen Thi Lan Anh', storeId: 'AMPM_D1_NCT', roleId: 'STORE_LEADER_G2' },
  { id: 'emp-3', name: 'Dang Thu Ha', storeId: 'AMPM_D1_NCT', roleId: 'STAFF' },
  { id: 'emp-4', name: 'Hoang Xuan Kien', storeId: 'AMPM_D1_NCT', roleId: 'STAFF' },
  { id: 'emp-5', name: 'Ngo Gia Bao', storeId: 'AMPM_D3_LVT', roleId: 'STORE_LEADER_G3' },
  { id: 'emp-6', name: 'Duong Ngoc Mai', storeId: 'AMPM_D3_LVT', roleId: 'STAFF' },
  { id: 'emp-7', name: 'Mai Anh Quan', storeId: 'AMPM_D10_CMT', roleId: 'STORE_LEADER_G3' },
  { id: 'emp-8', name: 'Tran Thi Kim Anh', storeId: 'AMPM_SALA', roleId: 'STORE_LEADER_G2' },
  { id: 'emp-9', name: 'Pham Van Cuong', storeId: 'AMPM_TPM', roleId: 'STORE_LEADER_G2' },
];

// Work positions from JSON
const WORK_POSITIONS = [
  { id: 'LEADER', name: 'Leader', balance: 10 },
  { id: 'MMD', name: 'MMD', balance: 15 },
  { id: 'POS', name: 'POS', balance: 25 },
  { id: 'MERCHANDISE', name: 'Nganh hang', balance: 35 },
  { id: 'CAFE', name: 'Aeon Cafe', balance: 15 },
];

// Get payroll cycle (ngay 16 thang nay den ngay 15 thang sau)
function getPayrollCycle(refDate: Date): { start: Date; end: Date } {
  const year = refDate.getFullYear();
  const month = refDate.getMonth();
  const day = refDate.getDate();

  let start: Date, end: Date;

  if (day >= 16) {
    start = new Date(year, month, 16);
    end = new Date(year, month + 1, 15);
  } else {
    start = new Date(year, month - 1, 16);
    end = new Date(year, month, 15);
  }

  return { start, end };
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Generate mock man-hour difference
function generateMockDiff(storeId: string, dateStr: string): number {
  const seed = storeId.charCodeAt(storeId.length - 1) + dateStr.charCodeAt(dateStr.length - 1);
  const diff = ((seed * 7) % 33) - 16;
  return diff;
}

// Generate mock employee availability
function generateMockAvailability(employeeId: string, dateStr: string): { shift: string; registered: boolean } {
  const seed = employeeId.charCodeAt(employeeId.length - 1) + dateStr.charCodeAt(dateStr.length - 1);
  if (seed % 4 === 0) return { shift: '', registered: false };

  const shifts = ['V8.6', 'V8.14', 'V6.8', 'V6.16'];
  return { shift: shifts[seed % 4], registered: true };
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
  const { t } = useLanguage();
  const [currentCycle, setCurrentCycle] = useState<{ start: Date; end: Date }>(() => getPayrollCycle(new Date()));
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['HCM', 'HCM_CENTRAL']));

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

  // Build hierarchy from mock data
  const hierarchy = useMemo((): HierarchyItem[] => {
    return MOCK_REGIONS.map(region => ({
      id: region.id,
      name: region.name,
      type: 'region' as const,
      children: MOCK_AREAS
        .filter(area => area.regionId === region.id)
        .map(area => ({
          id: area.id,
          name: area.name,
          type: 'area' as const,
          children: MOCK_STORES
            .filter(store => store.areaId === area.id)
            .map(store => ({
              id: store.id,
              name: store.name,
              type: 'store' as const,
              children: MOCK_EMPLOYEES
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
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
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

  // Handle save and send
  const handleSaveAndSend = () => {
    alert('Luu va Gui thanh cong!');
  };

  // Format cycle display
  const formatCycleDisplay = () => {
    const startStr = currentCycle.start.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endStr = currentCycle.end.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  // Render a row recursively
  const renderRow = (item: HierarchyItem, level: number): React.ReactNode[] => {
    const isExpanded = expandedRows.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const indent = level * 20;
    const rows: React.ReactNode[] = [];

    // Different background colors based on type
    const bgColors: Record<string, string> = {
      region: 'bg-indigo-50',
      area: 'bg-blue-50',
      store: 'bg-slate-50',
      employee: 'bg-white',
    };

    rows.push(
      <tr key={item.id} className={`${bgColors[item.type]} hover:bg-gray-100 border-b`}>
        <td className="p-2 border sticky left-0 bg-inherit z-10 min-w-[280px]">
          <div className="flex items-center" style={{ paddingLeft: `${indent}px` }}>
            {hasChildren ? (
              <button
                onClick={() => toggleRow(item.id)}
                className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded mr-2 flex-shrink-0"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div className="w-5 h-5 mr-2 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <span className={`font-medium text-sm truncate ${
                item.type === 'region' ? 'text-indigo-700 font-bold' :
                item.type === 'area' ? 'text-blue-700 font-semibold' :
                item.type === 'store' ? 'text-gray-800' :
                'text-gray-700'
              }`}>
                {item.name}
              </span>
              {item.type === 'employee' && item.roleId && (
                <div className="text-[10px] text-gray-500">{item.roleId}</div>
              )}
            </div>
          </div>
        </td>

        {/* Date cells */}
        {cycleDates.map(date => {
          const dateStr = formatDate(date);
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const weekendBg = isWeekend ? 'bg-amber-50' : '';

          if (item.type === 'store') {
            const diff = generateMockDiff(item.id, dateStr);
            return (
              <td
                key={dateStr}
                className={`p-1 border text-center text-xs font-bold ${weekendBg} ${
                  diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'
                }`}
              >
                {diff !== 0 ? (
                  <span>{diff > 0 ? '+' : ''}{diff.toFixed(1)}h</span>
                ) : (
                  <span>-</span>
                )}
              </td>
            );
          }

          if (item.type === 'employee') {
            const availability = generateMockAvailability(item.id, dateStr);
            if (!availability.registered) {
              return (
                <td key={dateStr} className={`p-1 border text-center ${weekendBg}`}>
                  <span className="text-[10px] text-gray-400 italic">KDK</span>
                </td>
              );
            }

            return (
              <td key={dateStr} className={`p-1 border ${weekendBg}`}>
                <div className="bg-green-100 rounded px-1 py-0.5 text-center">
                  <span className="text-[10px] font-medium text-green-800">{availability.shift}</span>
                </div>
              </td>
            );
          }

          // Region/Area - show summary
          return (
            <td key={dateStr} className={`p-1 border text-center ${weekendBg}`}>
              <span className="text-[10px] text-gray-500">
                {Math.floor(Math.random() * 15) + 5}
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
                {t('dws.workforceDispatch')} - Dieu Phoi Nhan Luc
              </h1>
            </div>

            {/* Backend status */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-xs text-gray-500">Offline (Demo)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Dieu Phoi Nhan Luc</h2>

          <div className="flex items-center gap-4">
            {/* Cycle Navigation */}
            <button
              onClick={() => changeCycle(-1)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded transition-colors"
              title="Chu ky truoc"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center min-w-[200px]">
              <h3 className="text-sm font-bold text-gray-800">{formatCycleDisplay()}</h3>
            </div>

            <button
              onClick={() => changeCycle(1)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded transition-colors"
              title="Chu ky toi"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Save and Send Button */}
          <button
            onClick={handleSaveAndSend}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Luu va Gui
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
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
          ) : (
            <div className="overflow-auto flex-1">
              <table className="min-w-full border-collapse">
                {/* Header */}
                <thead className="bg-slate-50 sticky top-0 z-20">
                  <tr>
                    <th className="p-2 border sticky left-0 bg-slate-100 z-30 min-w-[280px] text-left text-sm font-semibold text-gray-700">
                      Nhan vien / Cua hang
                    </th>
                    {cycleDates.map(date => {
                      const dayOfWeek = date.getDay();
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

                      return (
                        <th
                          key={formatDate(date)}
                          className={`p-1 border text-center min-w-[60px] ${isWeekend ? 'bg-amber-100' : 'bg-slate-100'}`}
                        >
                          <div className="font-semibold text-xs">{dayNames[dayOfWeek]}</div>
                          <div className="text-[10px] font-normal text-gray-500">
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

        {/* Legend */}
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Chu thich</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">+X.Xh</span>
              <span className="text-gray-600">Du nhan luc</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-bold">-X.Xh</span>
              <span className="text-gray-600">Thieu nhan luc</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded px-2 py-0.5 text-green-800 font-medium">V8.6</div>
              <span className="text-gray-600">Da dang ky ca</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 italic">KDK</span>
              <span className="text-gray-600">Khong dang ky</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 border"></div>
              <span className="text-gray-600">Cuoi tuan</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
