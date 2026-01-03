'use client';

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
    <div className="flex items-center gap-2 sm:gap-3 mb-4 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* User Dropdown */}
      <div className="relative flex items-center flex-shrink-0">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          viewBox="0 0 14 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 8C9.20938 8 11 6.20937 11 4C11 1.79063 9.20938 0 7 0C4.79063 0 3 1.79063 3 4C3 6.20937 4.79063 8 7 8ZM9.8 9H9.27812C8.58437 9.3125 7.8125 9.5 7 9.5C6.1875 9.5 5.41875 9.3125 4.72188 9H4.2C1.88125 9 0 10.8813 0 13.2V14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V13.2C14 10.8813 12.1187 9 9.8 9Z" fill="#6B7280"/>
        </svg>
        <select
          value={filters.user}
          onChange={(e) => handleUserChange(e.target.value)}
          className="appearance-none pl-9 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer min-w-[120px] sm:min-w-0"
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
      <div className="relative flex items-center flex-shrink-0">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.3429 0.75H1.75086C0.726428 0.75 0.126857 1.90457 0.733714 2.73343L6.20571 10.2069V15.4286C6.20571 15.8411 6.41914 16.2239 6.76714 16.4429L8.76714 17.7286C9.42086 18.1509 10.2857 17.682 10.2857 16.9029V10.2069L15.8571 2.64514C16.3697 1.80771 15.7406 0.75 14.7429 0.75H15.3429ZM8.53714 9.42857L2.90143 1.77429H14.6037L8.53714 9.42857Z" fill="#6B7280"/>
        </svg>
        <select
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="appearance-none pl-9 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer min-w-[120px] sm:min-w-0"
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
      <div className="relative flex items-center flex-shrink-0">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22 17H18V11H22V17ZM16 17H12V6H16V17ZM10 17H6V3H10V17ZM22 19H6V21H4V3H6V3H10V3H12V6H16V6H18V11H22V19Z" fill="#6B7280"/>
        </svg>
        <select
          value={filters.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="appearance-none pl-9 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer min-w-[100px] sm:min-w-0"
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
