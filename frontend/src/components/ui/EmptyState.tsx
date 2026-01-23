'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: 'tasks' | 'approval' | 'check' | 'search' | 'folder' | 'users' | 'stores' | 'data' | 'success';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const icons = {
  tasks: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  approval: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  check: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  search: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  folder: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  users: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  stores: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  data: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  success: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

/**
 * Reusable empty state component
 * Used when a list or section has no data to display
 */
export function EmptyState({
  icon = 'data',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="text-gray-300 dark:text-gray-600 mx-auto mb-4">
        {icons[icon]}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {title}
      </h3>
      {description && (
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 underline"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * Success empty state - when all items are completed/reviewed
 */
export function SuccessEmptyState({
  title,
  description,
  className = '',
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="text-green-400 dark:text-green-500 mx-auto mb-4">
        {icons.success}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {title}
      </h3>
      {description && (
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Search empty state - when search/filter returns no results
 */
export function SearchEmptyState({
  query,
  onClear,
  className = '',
}: {
  query?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <div className={`text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="text-gray-300 dark:text-gray-600 mx-auto mb-4">
        {icons.search}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        No results found
      </h3>
      {query && (
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          No items match &quot;{query}&quot;
        </p>
      )}
      {onClear && (
        <button
          onClick={onClear}
          className="mt-4 text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

/**
 * Table empty state - minimal style for inside tables
 */
export function TableEmptyState({
  message = 'No data',
  colSpan = 1,
}: {
  message?: string;
  colSpan?: number;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <div className="text-gray-400 dark:text-gray-500 text-sm">
          {message}
        </div>
      </td>
    </tr>
  );
}

export default EmptyState;
