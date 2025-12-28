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
  const [customToDate, setCustomToDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [leftCalendarMonth, setLeftCalendarMonth] = useState<Date>(new Date());
  const [rightCalendarMonth, setRightCalendarMonth] = useState<Date>(new Date());
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

  const formatInputDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month.toString().padStart(2, '0')}/${year}`;
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

  // Generate calendar days for a given month/year including previous/next month days
  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Add days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month - 1, day)
      });
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Add days from next month to complete the grid (6 rows)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  const renderCustomCalendar = (
    calendarDate: Date,
    setCalendarDate: (date: Date) => void,
    calendarType: 'left' | 'right'
  ) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const days = generateCalendarDays(year, month);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

    const navigateMonth = (direction: number) => {
      const newDate = new Date(calendarDate);
      newDate.setMonth(month + direction);
      setCalendarDate(newDate);
    };

    const handleDayClick = (date: Date) => {
      if (calendarType === 'left') {
        // Left calendar always sets start date
        // Validate: start date must be <= end date
        if (date.getTime() <= customToDate.getTime()) {
          setCustomFromDate(date);
        } else {
          // If selected date > end date, set both to the same date
          setCustomFromDate(date);
          setCustomToDate(date);
        }
      } else {
        // Right calendar always sets end date
        // Validate: end date must be >= start date
        if (date.getTime() >= customFromDate.getTime()) {
          setCustomToDate(date);
        } else {
          // If selected date < start date, set both to the same date
          setCustomFromDate(date);
          setCustomToDate(date);
        }
      }
    };

    const isRangeStart = (date: Date) => {
      return date.toDateString() === customFromDate.toDateString();
    };

    const isRangeEnd = (date: Date) => {
      return date.toDateString() === customToDate.toDateString();
    };

    const isInRange = (date: Date) => {
      const time = date.getTime();
      const fromTime = new Date(customFromDate.getFullYear(), customFromDate.getMonth(), customFromDate.getDate()).getTime();
      const toTime = new Date(customToDate.getFullYear(), customToDate.getMonth(), customToDate.getDate()).getTime();
      return time > fromTime && time < toTime;
    };

    const isWeekend = (date: Date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    };

    return (
      <div className="flex-1">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-900">{monthNames[month]} {year}</span>
          <button
            onClick={() => navigateMonth(1)}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
            <div
              key={day}
              className={`text-center text-xs font-medium py-1 ${
                idx === 0 || idx === 6 ? 'text-[#C5055B]' : 'text-gray-500'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((dayInfo, index) => {
            const isStart = isRangeStart(dayInfo.date);
            const isEnd = isRangeEnd(dayInfo.date);
            const inRange = isInRange(dayInfo.date);
            const weekend = isWeekend(dayInfo.date);

            return (
              <div
                key={index}
                className={`relative h-8 flex items-center justify-center ${
                  inRange ? 'bg-pink-100' : ''
                } ${isStart ? 'bg-gradient-to-r from-transparent to-pink-100' : ''} ${
                  isEnd ? 'bg-gradient-to-l from-transparent to-pink-100' : ''
                }`}
              >
                <button
                  onClick={() => handleDayClick(dayInfo.date)}
                  className={`w-7 h-7 flex items-center justify-center text-xs rounded-full transition-colors ${
                    isStart || isEnd
                      ? 'bg-[#C5055B] text-white font-medium'
                      : !dayInfo.isCurrentMonth
                      ? 'text-gray-300'
                      : weekend
                      ? 'text-[#C5055B] hover:bg-pink-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {dayInfo.day}
                </button>
              </div>
            );
          })}
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
        {/* Date inputs row */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 flex items-center border border-gray-300 rounded overflow-hidden">
            <span className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-r border-gray-300">From</span>
            <input
              type="text"
              value={formatInputDate(customFromDate)}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-white outline-none"
            />
          </div>
          <div className="flex-1 flex items-center border border-gray-300 rounded overflow-hidden">
            <span className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-r border-gray-300">To</span>
            <input
              type="text"
              value={formatInputDate(customToDate)}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-white outline-none"
            />
          </div>
        </div>

        {/* Dual Calendar */}
        <div className="flex border border-gray-200 rounded-lg gap-4">
          <div className="flex-1 p-3">
            {renderCustomCalendar(leftCalendarMonth, setLeftCalendarMonth, 'left')}
          </div>
          <div className="flex-1 p-3">
            {renderCustomCalendar(rightCalendarMonth, setRightCalendarMonth, 'right')}
          </div>
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
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex" style={{ minWidth: activeTab === 'CUSTOM' ? '520px' : '580px' }}>
          {/* Left side - Tabs */}
          <div className="w-20 py-4">
            <button
              onClick={() => setActiveTab('TODAY')}
              className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors ${
                activeTab === 'TODAY'
                  ? 'bg-pink-50 text-[#C5055B] border-l-2 border-[#C5055B]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              TODAY
            </button>
            <button
              onClick={() => setActiveTab('WEEK')}
              className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors ${
                activeTab === 'WEEK'
                  ? 'bg-pink-50 text-[#C5055B] border-l-2 border-[#C5055B]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              WEEK
            </button>
            <button
              onClick={() => setActiveTab('CUSTOM')}
              className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors ${
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
              <div className="flex items-center justify-end gap-2 px-4 py-3">
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
            <div className="flex items-center justify-end gap-3 px-4 py-3">
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
