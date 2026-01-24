'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useUser, AppUser } from '@/contexts/UserContext';
import { JOB_GRADE_COLORS, JOB_GRADE_TITLES, JOB_GRADE_TITLES_VI, JobGrade } from '@/types/userInfo';

// Get color style for a job grade
const getGradeStyle = (grade: JobGrade) => {
  const color = JOB_GRADE_COLORS[grade] || '#6B7280';
  const isHQ = grade?.startsWith('G') || false;

  return {
    color,
    bgLight: `${color}15`, // 15% opacity
    bgMedium: `${color}25`, // 25% opacity
    isHQ,
  };
};

// Format scope for display
const formatScope = (scope: string): string => {
  const scopeLabels: Record<string, string> = {
    'COMPANY': 'Toàn công ty',
    'DIVISION': 'Khối',
    'DEPARTMENT': 'Phòng ban',
    'TEAM': 'Nhóm',
    'REGION': 'Miền',
    'ZONE': 'Zone',
    'AREA': 'Khu vực',
    'CLUSTER': 'Cụm cửa hàng',
    'MULTI_STORE': 'Cụm cửa hàng',
    'STORE': 'Cửa hàng',
    'NONE': 'Cá nhân',
  };
  return scopeLabels[scope] || scope;
};

type TabType = 'user' | 'query';

export default function DevToolsPanel() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { currentUser, setCurrentUser, hqUsers, storeUsers, isUserSwitcherOpen, setIsUserSwitcherOpen, isLoading, error, refreshUsers } = useUser();

  const [activeTab, setActiveTab] = useState<TabType>('user');
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Hide on auth pages
  const isAuthPage = pathname?.startsWith('/auth');
  if (isAuthPage) {
    return null;
  }

  const currentGradeStyle = getGradeStyle(currentUser.job_grade);

  const handleSelectUser = (user: AppUser) => {
    setCurrentUser(user);
  };

  // Get React Query stats
  const queryCache = queryClient.getQueryCache();
  const queries = queryCache.getAll();
  const activeQueries = queries.filter(q => q.state.fetchStatus === 'fetching').length;
  const staleQueries = queries.filter(q => q.isStale()).length;
  const freshQueries = queries.filter(q => !q.isStale()).length;

  const renderUserItem = (user: AppUser, isActive: boolean) => {
    const gradeStyle = getGradeStyle(user.job_grade);

    return (
      <button
        key={user.staff_id}
        onClick={() => handleSelectUser(user)}
        className={`
          w-full px-3 py-2.5 flex items-center gap-3 transition-colors
          ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}
          border-b border-gray-100 last:border-b-0
        `}
      >
        {/* Avatar with grade color */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0"
          style={{
            backgroundColor: gradeStyle.bgLight,
            borderColor: gradeStyle.color,
          }}
        >
          <span
            className="text-sm font-bold"
            style={{ color: gradeStyle.color }}
          >
            {user.staff_name.charAt(0)}
          </span>
        </div>

        {/* User info */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{user.staff_name}</p>
          <p className="text-xs text-gray-500 truncate">{user.store_name}</p>
        </div>

        {/* Grade badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{
              backgroundColor: gradeStyle.bgMedium,
              color: gradeStyle.color,
            }}
          >
            {user.job_grade}
          </span>
          {isActive && (
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </button>
    );
  };

  // Tab content: User Switcher
  const renderUserTab = () => (
    <>
      {/* Current User Info */}
      <div
        className="px-4 py-3 border-b"
        style={{ backgroundColor: currentGradeStyle.bgLight }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full border-2 bg-white flex items-center justify-center"
            style={{ borderColor: currentGradeStyle.color }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: currentGradeStyle.color }}
            >
              {currentUser.staff_name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{currentUser.staff_name}</p>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span
                className="px-2 py-0.5 rounded font-bold"
                style={{
                  backgroundColor: currentGradeStyle.bgMedium,
                  color: currentGradeStyle.color,
                }}
              >
                {currentUser.job_grade} - {JOB_GRADE_TITLES_VI[currentUser.job_grade]}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Phạm vi: <span className="font-medium">{formatScope(currentUser.scope)}</span>
              {currentUser.store_id && ` | Store ID: ${currentUser.store_id}`}
              {currentUser.department_id && ` | Dept ID: ${currentUser.department_id}`}
            </p>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="max-h-64 overflow-y-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="px-4 py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading users...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="px-4 py-4 text-center">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button
              onClick={() => refreshUsers()}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && hqUsers.length === 0 && storeUsers.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No users available</p>
            <button
              onClick={() => refreshUsers()}
              className="text-xs text-blue-600 hover:text-blue-800 underline mt-2"
            >
              Refresh
            </button>
          </div>
        )}

        {/* HQ Section */}
        {!isLoading && !error && hqUsers.length > 0 && (
          <>
            <div className="bg-purple-50 px-3 py-2 border-b sticky top-0">
              <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                HQ Grades ({hqUsers.length})
              </h4>
            </div>
            {hqUsers.map((user) => renderUserItem(user, user.staff_id === currentUser.staff_id))}
          </>
        )}

        {/* Store Section */}
        {!isLoading && !error && storeUsers.length > 0 && (
          <>
            <div className="bg-teal-50 px-3 py-2 border-b sticky top-0">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Store Grades ({storeUsers.length})
              </h4>
            </div>
            {storeUsers.map((user) => renderUserItem(user, user.staff_id === currentUser.staff_id))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2 border-t flex items-center justify-between">
        <p className="text-xs text-gray-400">Database Users</p>
        <button
          onClick={() => refreshUsers()}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          title="Refresh user list"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </>
  );

  // Tab content: React Query Stats
  const renderQueryTab = () => (
    <div className="p-4">
      {/* Query Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{queries.length}</p>
          <p className="text-xs text-blue-600">Total</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{freshQueries}</p>
          <p className="text-xs text-green-600">Fresh</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">{staleQueries}</p>
          <p className="text-xs text-yellow-600">Stale</p>
        </div>
      </div>

      {/* Active Queries */}
      {activeQueries > 0 && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
          <span className="text-sm text-purple-700">
            {activeQueries} {activeQueries === 1 ? 'query' : 'queries'} fetching...
          </span>
        </div>
      )}

      {/* Query List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Cached Queries</p>
        {queries.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No queries in cache</p>
        ) : (
          queries.slice(0, 10).map((query, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
            >
              <span className="font-mono text-gray-700 truncate max-w-[200px]">
                {Array.isArray(query.queryKey) ? query.queryKey.join('/') : String(query.queryKey)}
              </span>
              <span className={`px-2 py-0.5 rounded ${
                query.state.fetchStatus === 'fetching'
                  ? 'bg-purple-100 text-purple-700'
                  : query.isStale()
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
              }`}>
                {query.state.fetchStatus === 'fetching'
                  ? 'fetching'
                  : query.isStale()
                    ? 'stale'
                    : 'fresh'}
              </span>
            </div>
          ))
        )}
        {queries.length > 10 && (
          <p className="text-xs text-gray-400 text-center">
            +{queries.length - 10} more queries
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t flex gap-2">
        <button
          onClick={() => queryClient.invalidateQueries()}
          className="flex-1 px-3 py-2 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
        >
          Invalidate All
        </button>
        <button
          onClick={() => queryClient.clear()}
          className="flex-1 px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Clear Cache
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Bubble */}
      <div
        className="fixed bottom-4 right-4 z-50"
        style={{ zIndex: 9999 }}
      >
        {/* Bubble Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 bg-gray-800 border-2 border-gray-600"
          title="Dev Tools"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {/* Current User Badge */}
          <div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
            style={{
              backgroundColor: currentGradeStyle.color,
              color: 'white',
            }}
          >
            {currentUser.job_grade.replace('G', '').replace('S', '')}
          </div>
        </button>

        {/* Panel */}
        {isOpen && (
          <div
            className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
            style={{ zIndex: 10000 }}
          >
            {/* Header with Tabs */}
            <div className="bg-gray-800 text-white">
              <div className="px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Dev Tools
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-t border-gray-700">
                <button
                  onClick={() => setActiveTab('user')}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'user'
                      ? 'bg-white text-gray-800 border-t-2 border-purple-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  User
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: activeTab === 'user' ? currentGradeStyle.bgMedium : 'rgba(255,255,255,0.2)',
                      color: activeTab === 'user' ? currentGradeStyle.color : 'inherit',
                    }}
                  >
                    {currentUser.job_grade}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('query')}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'query'
                      ? 'bg-white text-gray-800 border-t-2 border-blue-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Query
                  {activeQueries > 0 && (
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'user' ? renderUserTab() : renderQueryTab()}
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={() => setIsOpen(false)}
          style={{ zIndex: 9998 }}
        />
      )}
    </>
  );
}
