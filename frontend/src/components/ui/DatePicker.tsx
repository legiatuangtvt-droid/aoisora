'use client';

import { useState, useRef, useEffect } from 'react';
import { DateMode } from '@/types/tasks';

interface DatePickerProps {
  dateMode: DateMode;
  selectedDate?: Date;
  onDateChange: (mode: DateMode, date?: Date) => void;
}

export default function DatePicker({ dateMode, selectedDate, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DateMode>(dateMode);
  const [customFromDate, setCustomFromDate] = useState<Date>(selectedDate || new Date());
  const [customToDate, setCustomToDate] = useState<Date>(selectedDate || new Date());
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

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getWeekRange = (year: number, week: number): { from: Date; to: Date } => {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToFirstMonday = (8 - firstDayOfYear.getDay()) % 7;
    const firstMonday = new Date(year, 0, 1 + daysToFirstMonday);

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
      onDateChange('CUSTOM', customFromDate);
    } else if (activeTab === 'WEEK') {
      const weekRange = getWeekRange(selectedYear, selectedWeek);
      onDateChange('WEEK', weekRange.from);
    } else {
      onDateChange('TODAY');
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

    return (
      <div className="flex-1">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold">{monthNames[month]} {year}</span>
          <button
            onClick={() => navigateMonth(1)}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
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
                  className={`w-full h-full flex items-center justify-center text-sm rounded-full ${
                    isSelected(day)
                      ? 'bg-pink-500 text-white font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
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
    const weeks = Array.from({ length: 53 }, (_, i) => i + 1);

    return (
      <div className="p-4">
        {/* Year selector */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xl font-bold">{selectedYear}</span>
          <button
            onClick={() => setSelectedYear(selectedYear + 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Week range display */}
        <div className="text-center mb-4 text-sm text-gray-600">
          {(() => {
            const weekRange = getWeekRange(selectedYear, selectedWeek);
            return `${weekRange.from.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} -- ${weekRange.to.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}`;
          })()}
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
          {weeks.map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                selectedWeek === week
                  ? 'border-b-2 border-pink-500 font-semibold text-gray-900'
                  : 'text-gray-700'
              }`}
            >
              W {week.toString().padStart(2, '0')}
            </button>
          ))}
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
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('TODAY')}
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === 'TODAY'
                  ? 'border-b-2 border-pink-500 text-pink-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              TODAY
            </button>
            <button
              onClick={() => setActiveTab('WEEK')}
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === 'WEEK'
                  ? 'border-b-2 border-pink-500 text-pink-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              WEEK
            </button>
            <button
              onClick={() => setActiveTab('CUSTOM')}
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === 'CUSTOM'
                  ? 'border-b-2 border-pink-500 text-pink-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'TODAY' && (
              <div className="text-center py-8">
                <p className="text-lg font-semibold text-gray-900 mb-2">Today</p>
                <p className="text-sm text-gray-600">{formatDate(new Date())}</p>
              </div>
            )}

            {activeTab === 'WEEK' && renderWeekPicker()}

            {activeTab === 'CUSTOM' && (
              <div>
                {/* Date inputs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                    <input
                      type="date"
                      value={customFromDate.toISOString().split('T')[0]}
                      onChange={(e) => setCustomFromDate(new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="date"
                      value={customToDate.toISOString().split('T')[0]}
                      onChange={(e) => setCustomToDate(new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    />
                  </div>
                </div>

                {/* Dual Calendar */}
                <div className="flex gap-6">
                  {renderCalendar(customFromDate, true)}
                  {renderCalendar(customToDate, false)}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
              style={{ backgroundColor: '#C5055B' }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
