'use client';

import Image from 'next/image';
import { TodoFilters, TaskStatus, TaskType } from '@/types/todoTask';
import { statusOptions, typeOptions, userOptions } from '@/data/mockTodoTask';

interface FilterBarProps {
  filters: TodoFilters;
  onFiltersChange: (filters: TodoFilters) => void;
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const handleUserChange = (value: string) => {
    onFiltersChange({ ...filters, user: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value as TaskStatus | 'all' });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({ ...filters, type: value as TaskType | 'all' });
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* User Dropdown */}
      <div className="relative flex items-center">
        <Image
          src="/icons/flowbite_user-solid.png"
          alt="User"
          width={16}
          height={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <select
          value={filters.user}
          onChange={(e) => handleUserChange(e.target.value)}
          className="appearance-none pl-9 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
        >
          {userOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Status Dropdown */}
      <div className="relative">
        <select
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Type Dropdown */}
      <div className="relative">
        <select
          value={filters.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
