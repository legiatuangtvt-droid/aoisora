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
  const [showCalendar, setShowCalendar] = useState(false);
  const [customDate, setCustomDate] = useState<Date>(selectedDate || new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDisplayText = (): string => {
    switch (dateMode) {
      case 'TODAY':
        return `TODAY: ${formatDate(new Date())}`;
      case 'YESTERDAY':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return `YESTERDAY: ${formatDate(yesterday)}`;
      case 'CUSTOM':
        return `CUSTOM: ${formatDate(selectedDate || customDate)}`;
      default:
        return `TODAY: ${formatDate(new Date())}`;
    }
  };

  const handleModeSelect = (mode: DateMode) => {
    if (mode === 'CUSTOM') {
      setShowCalendar(true);
    } else {
      setIsOpen(false);
      setShowCalendar(false);
      onDateChange(mode);
    }
  };

  const handleCustomDateSelect = () => {
    setIsOpen(false);
    setShowCalendar(false);
    onDateChange('CUSTOM', customDate);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setCustomDate(newDate);
    }
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

      {/* Dropdown Menu */}
      {isOpen && !showCalendar && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleModeSelect('TODAY')}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                dateMode === 'TODAY' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Today</span>
                <span className="text-xs text-gray-500">{formatDate(new Date())}</span>
              </div>
            </button>
            <button
              onClick={() => handleModeSelect('YESTERDAY')}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                dateMode === 'YESTERDAY' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Yesterday</span>
                <span className="text-xs text-gray-500">
                  {formatDate(new Date(Date.now() - 86400000))}
                </span>
              </div>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => handleModeSelect('CUSTOM')}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                dateMode === 'CUSTOM' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              Custom Date...
            </button>
          </div>
        </div>
      )}

      {/* Calendar for Custom Date */}
      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Custom Date
            </label>
            <input
              type="date"
              value={customDate.toISOString().split('T')[0]}
              onChange={handleDateInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => {
                setShowCalendar(false);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCustomDateSelect}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
