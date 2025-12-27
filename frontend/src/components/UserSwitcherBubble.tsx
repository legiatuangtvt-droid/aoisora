'use client';

import React from 'react';
import { useUser, MockUser } from '@/contexts/UserContext';

// Role colors
const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  manager: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  supervisor: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  staff: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
};

// Role labels
const ROLE_LABELS: Record<string, string> = {
  manager: 'Manager',
  supervisor: 'Supervisor',
  staff: 'Staff',
};

export default function UserSwitcherBubble() {
  const { currentUser, setCurrentUser, availableUsers, isUserSwitcherOpen, setIsUserSwitcherOpen } = useUser();

  const roleStyle = ROLE_COLORS[currentUser.role] || ROLE_COLORS.staff;

  const handleSelectUser = (user: MockUser) => {
    setCurrentUser(user);
    setIsUserSwitcherOpen(false);
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
          className={`
            w-14 h-14 rounded-full shadow-lg
            flex items-center justify-center
            transition-all duration-300 hover:scale-110
            ${roleStyle.bg} ${roleStyle.border} border-2
          `}
          title={`${currentUser.staff_name} (${ROLE_LABELS[currentUser.role]})`}
        >
          <div className="text-center">
            <div className={`text-lg font-bold ${roleStyle.text}`}>
              {currentUser.staff_name.charAt(0)}
            </div>
            <div className={`text-[8px] font-medium ${roleStyle.text} uppercase`}>
              {currentUser.role.substring(0, 3)}
            </div>
          </div>
        </button>

        {/* Popup Panel */}
        {isUserSwitcherOpen && (
          <div
            className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
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
                Select a user to test different role permissions
              </p>
            </div>

            {/* Current User Info */}
            <div className={`px-4 py-3 ${roleStyle.bg} border-b`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${roleStyle.border} border-2 bg-white flex items-center justify-center`}>
                  <span className={`text-lg font-bold ${roleStyle.text}`}>
                    {currentUser.staff_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{currentUser.staff_name}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border} border font-medium`}>
                      {ROLE_LABELS[currentUser.role]}
                    </span>
                    <span className="text-gray-500">{currentUser.store_name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User List */}
            <div className="max-h-64 overflow-y-auto">
              {availableUsers.map((user) => {
                const userRoleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.staff;
                const isActive = user.staff_id === currentUser.staff_id;

                return (
                  <button
                    key={user.staff_id}
                    onClick={() => handleSelectUser(user)}
                    className={`
                      w-full px-4 py-3 flex items-center gap-3 transition-colors
                      ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50'}
                      border-b border-gray-100 last:border-b-0
                    `}
                  >
                    <div className={`w-8 h-8 rounded-full ${userRoleStyle.border} border-2 ${userRoleStyle.bg} flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${userRoleStyle.text}`}>
                        {user.staff_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-800">{user.staff_name}</p>
                      <p className="text-xs text-gray-500">{user.store_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${userRoleStyle.bg} ${userRoleStyle.text}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                      {isActive && (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 border-t text-center">
              <p className="text-xs text-gray-400">
                Testing Mode - No real authentication
              </p>
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
