'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
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

export default function UserSwitcherBubble() {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, hqUsers, storeUsers, isUserSwitcherOpen, setIsUserSwitcherOpen, isLoading, error, refreshUsers } = useUser();

  // Only show in development mode (same as TANSTACK devtools)
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Hide on auth pages (login, signup, forgot-password, etc.)
  const isAuthPage = pathname?.startsWith('/auth');
  if (isAuthPage) {
    return null;
  }

  const currentGradeStyle = getGradeStyle(currentUser.job_grade);

  const handleSelectUser = (user: AppUser) => {
    setCurrentUser(user);
    // Keep popup open so user can quickly switch between different grades for testing
    // setIsUserSwitcherOpen(false);
  };

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

  return (
    <>
      {/* Floating Bubble */}
      <div
        className="fixed bottom-4 right-4 z-50"
        style={{ zIndex: 9999 }}
      >
        {/* Bubble Button */}
        <button
          onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border-2"
          style={{
            backgroundColor: currentGradeStyle.bgLight,
            borderColor: currentGradeStyle.color,
          }}
          title={`${currentUser.staff_name} (${currentUser.job_grade} - ${JOB_GRADE_TITLES[currentUser.job_grade]})`}
        >
          <div className="text-center">
            <div
              className="text-lg font-bold"
              style={{ color: currentGradeStyle.color }}
            >
              {currentUser.staff_name.charAt(0)}
            </div>
            <div
              className="text-[9px] font-bold"
              style={{ color: currentGradeStyle.color }}
            >
              {currentUser.job_grade}
            </div>
          </div>
        </button>

        {/* Popup Panel */}
        {isUserSwitcherOpen && (
          <div
            className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
            style={{ zIndex: 10000 }}
          >
            {/* Header */}
            <div className="bg-gray-100 px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Test User Switcher</h3>
                <button
                  onClick={() => setIsUserSwitcherOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Chọn user để test phân quyền theo Job Grade
              </p>
            </div>

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

            {/* User List with Sections */}
            <div className="max-h-80 overflow-y-auto">
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
              <p className="text-xs text-gray-400">
                Database Users - Testing Mode
              </p>
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
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isUserSwitcherOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={() => setIsUserSwitcherOpen(false)}
          style={{ zIndex: 9998 }}
        />
      )}
    </>
  );
}
