'use client';

import { useState, useRef, useEffect } from 'react';
import { DateMode } from '@/types/tasks';

interface DateRange {
  from: Date;
  to: Date;
}

interface DatePickerProps {
  dateMode: DateMode;
  onDateChange: (mode: DateMode, dateRange: DateRange) => void;
}

export default function DatePicker({ dateMode, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DateMode>(dateMode);
  const [customFromDate, setCustomFromDate] = useState<Date>(new Date());
  const [customToDate, setCustomToDate] = useState<Date>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize active tab based on dateMode prop
  useEffect(() => {
    setActiveTab(dateMode);
  }, [dateMode]);

  // Initialize selected week to current week
  useEffect(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    setSelectedWeek(Math.min(currentWeek, 53));
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const formatShortDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });
  };

  const getWeekRange = (year: number, week: number): { from: Date; to: Date } => {
    // ISO week date calculation
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = jan4.getDay() || 7; // Convert Sunday (0) to 7
    const firstMonday = new Date(jan4);
    firstMonday.setDate(jan4.getDate() - dayOfWeek + 1);

    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + (week - 1) * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return { from: weekStart, to: weekEnd };
  };

  const getDisplayText = (): string => {
    switch (dateMode) {
      case 'TODAY':
        return `TODAY: ${formatDate(new Date())}`;
      case 'WEEK':
        const weekRange = getWeekRange(selectedYear, selectedWeek);
        return `WEEK ${selectedWeek}: ${formatDate(weekRange.from)} - ${formatDate(weekRange.to)}`;
      case 'CUSTOM':
        return `CUSTOM: ${formatDate(customFromDate)} - ${formatDate(customToDate)}`;
      default:
        return `TODAY: ${formatDate(new Date())}`;
    }
  };

  const handleApply = () => {
    if (activeTab === 'CUSTOM') {
      onDateChange('CUSTOM', { from: customFromDate, to: customToDate });
    } else if (activeTab === 'WEEK') {
      const weekRange = getWeekRange(selectedYear, selectedWeek);
      onDateChange('WEEK', { from: weekRange.from, to: weekRange.to });
    } else {
      // TODAY: from and to are the same day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      onDateChange('TODAY', { from: today, to: endOfToday });
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setActiveTab(dateMode);
    setIsOpen(false);
  };

  // Generate calendar days for a given month/year
  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const renderCalendar = (date: Date, isFromCalendar: boolean) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = generateCalendarDays(year, month);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

    const navigateMonth = (direction: number) => {
      const newDate = new Date(date);
      newDate.setMonth(month + direction);
      if (isFromCalendar) {
        setCustomFromDate(new Date(newDate.getFullYear(), newDate.getMonth(), customFromDate.getDate()));
      } else {
        setCustomToDate(new Date(newDate.getFullYear(), newDate.getMonth(), customToDate.getDate()));
      }
    };

    const handleDayClick = (day: number) => {
      const newDate = new Date(year, month, day);
      if (isFromCalendar) {
        setCustomFromDate(newDate);
      } else {
        setCustomToDate(newDate);
      }
    };

    const isSelected = (day: number) => {
      const compareDate = isFromCalendar ? customFromDate : customToDate;
      return compareDate.getDate() === day &&
             compareDate.getMonth() === month &&
             compareDate.getFullYear() === year;
    };

    const isInRange = (day: number) => {
      const currentDate = new Date(year, month, day);
      const fromNormalized = new Date(customFromDate.getFullYear(), customFromDate.getMonth(), customFromDate.getDate());
      const toNormalized = new Date(customToDate.getFullYear(), customToDate.getMonth(), customToDate.getDate());
      return currentDate > fromNormalized && currentDate < toNormalized;
    };

    const isRangeStart = (day: number) => {
      return customFromDate.getDate() === day &&
             customFromDate.getMonth() === month &&
             customFromDate.getFullYear() === year;
    };

    const isRangeEnd = (day: number) => {
      return customToDate.getDate() === day &&
             customToDate.getMonth() === month &&
             customToDate.getFullYear() === year;
    };

    return (
      <div className="flex-1">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-base font-bold text-gray-900">{monthNames[month]} {year}</span>
          <button
            onClick={() => navigateMonth(1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  onClick={() => handleDayClick(day)}
                  className={`w-full h-full flex items-center justify-center text-base transition-colors ${
                    isSelected(day)
                      ? 'bg-pink-500 text-white font-bold rounded-full'
                      : isRangeStart(day)
                      ? 'bg-pink-500 text-white font-bold rounded-l-full'
                      : isRangeEnd(day)
                      ? 'bg-pink-500 text-white font-bold rounded-r-full'
                      : isInRange(day)
                      ? 'bg-pink-100 text-pink-700'
                      : 'hover:bg-gray-100 text-gray-700 font-medium rounded-full'
                  }`}
                >
                  {day}
                </button>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekPicker = () => {
    // Generate weeks grid - 6 rows x 9 columns = 54 cells (we need 53 weeks)
    const totalWeeks = 53;
    const columns = 9;
    const rows = Math.ceil(totalWeeks / columns);

    return (
      <div className="flex-1">
        {/* Week grid */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: rows * columns }, (_, i) => {
            const week = i + 1;
            if (week > totalWeeks) return <div key={i} />;

            const weekRange = getWeekRange(selectedYear, week);
            const tooltipText = `${formatShortDate(weekRange.from)} – ${formatShortDate(weekRange.to)}`;

            return (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                title={tooltipText}
                className={`px-2 py-2 text-sm rounded transition-colors whitespace-nowrap ${
                  selectedWeek === week
                    ? 'bg-[#C5055B] text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                W&nbsp;{week.toString().padStart(2, '0')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTodayContent = () => {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900 mb-2">Today</p>
          <p className="text-base text-gray-600">{formatDate(new Date())}</p>
        </div>
      </div>
    );
  };

  const renderCustomContent = () => {
    return (
      <div className="flex-1">
        {/* Date inputs */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="date"
              value={customFromDate.toISOString().split('T')[0]}
              onChange={(e) => setCustomFromDate(new Date(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="date"
              value={customToDate.toISOString().split('T')[0]}
              onChange={(e) => setCustomToDate(new Date(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-base"
            />
          </div>
        </div>

        {/* Dual Calendar */}
        <div className="flex gap-8">
          {renderCalendar(customFromDate, true)}
          {renderCalendar(customToDate, false)}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Date Display Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          {getDisplayText()}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex" style={{ minWidth: '580px' }}>
          {/* Left side - Tabs */}
          <div className="w-24 border-r border-gray-200 py-4">
            <button
              onClick={() => setActiveTab('TODAY')}
              className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                activeTab === 'TODAY'
                  ? 'bg-pink-50 text-[#C5055B] border-l-2 border-[#C5055B]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              TODAY
            </button>
            <button
              onClick={() => setActiveTab('WEEK')}
              className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                activeTab === 'WEEK'
                  ? 'bg-pink-50 text-[#C5055B] border-l-2 border-[#C5055B]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              WEEK
            </button>
            <button
              onClick={() => setActiveTab('CUSTOM')}
              className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                activeTab === 'CUSTOM'
                  ? 'bg-pink-50 text-[#C5055B] border-l-2 border-[#C5055B]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 flex flex-col">
            {/* Year selector (for WEEK mode) */}
            {activeTab === 'WEEK' && (
              <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-gray-200">
                <button
                  onClick={() => setSelectedYear(selectedYear - 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-base font-semibold text-gray-900 min-w-[50px] text-center">{selectedYear}</span>
                <button
                  onClick={() => setSelectedYear(selectedYear + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Content area */}
            <div className="flex-1 p-4">
              {activeTab === 'TODAY' && renderTodayContent()}
              {activeTab === 'WEEK' && renderWeekPicker()}
              {activeTab === 'CUSTOM' && renderCustomContent()}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200">
              <button
                onClick={handleApply}
                className="px-6 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#C5055B' }}
              >
                Apply
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
