'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import { useSidebar } from '@/contexts/SidebarContext';
import { useUser } from '@/contexts/UserContext';
import UserMenu from './UserMenu';

export default function TopBar() {
  const { currentUser } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { showDevelopingToast } = useToast();
  const { toggleMobileMenu, isMobile, isTablet } = useSidebar();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-purple-100 text-purple-700';
      case 'supervisor':
        return 'bg-blue-100 text-blue-700';
      case 'staff':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Role labels for display
  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      manager: 'Manager',
      supervisor: 'Supervisor',
      staff: 'Staff',
    };
    return labels[role] || role;
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Hamburger Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button - Mobile/Tablet only */}
          {(isMobile || isTablet) && (
            <button
              onClick={toggleMobileMenu}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C5055B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              OptiChain
            </span>
          </div>
        </div>

        {/* Right side - Notifications, User, Company Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <button
            onClick={showDevelopingToast}
            className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* User Info & Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                <span className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">
                  {currentUser.staff_name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Name & Role - Hidden on mobile */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.staff_name}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(currentUser.role)}`}>
                  {getRoleLabel(currentUser.role)}
                </span>
              </div>

              {/* Dropdown Arrow - Hidden on mobile */}
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${isUserMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <UserMenu onClose={() => setIsUserMenuOpen(false)} />
            )}
          </div>

          {/* Company Logo - Hidden on mobile */}
          <div className="hidden lg:flex items-center pl-4 dark:border-gray-700">
            <img
              src="/images/logos/aeon-maxvalu.png"
              alt="AEON MaxValu"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
