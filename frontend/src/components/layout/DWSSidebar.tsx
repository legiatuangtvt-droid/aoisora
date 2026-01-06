'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSidebar } from '@/contexts/SidebarContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { MenuItem } from '@/types/layout';

// Routes that are implemented in DWS module
const implementedRoutes = [
  '/dws/re-task-list',
  '/dws/daily-schedule',
  '/dws/shift-codes',
  '/dws/workforce-dispatch',
];

// DWS Menu items configuration
export const dwsMenuItems: MenuItem[] = [
  {
    id: 'dws-re-task',
    label: 'Quan Ly RE Task',
    icon: 'invoice-scheduled',
    route: '/dws/re-task-list',
  },
  {
    id: 'dws-schedule',
    label: 'Daily Schedule',
    icon: 'last-updates',
    route: '/dws/daily-schedule',
  },
  {
    id: 'dws-shift',
    label: 'Shift Codes',
    icon: 'gridicons-types',
    route: '/dws/shift-codes',
  },
  {
    id: 'dws-workforce',
    label: 'Workforce Dispatch',
    icon: 'user-management',
    route: '/dws/workforce-dispatch',
  },
];

// Import SVG icons from Sidebar
import { svgIconMap, MenuIcon } from './Sidebar';

export default function DWSSidebar() {
  const {
    isExpanded,
    toggleSidebar,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isMobile,
    isTablet,
    isDesktop
  } = useSidebar();
  const { expandedMenus, toggleMenu, collapseAllMenus, setIsNavigating } = useNavigation();
  const pathname = usePathname();
  const { showDevelopingToast } = useToast();
  const sidebarRef = useRef<HTMLElement>(null);

  // Handle click outside to collapse sidebar (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isDesktop && isExpanded) {
          toggleSidebar();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, toggleSidebar, isDesktop]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  const isActive = (route: string) => {
    return pathname === route;
  };

  const isImplemented = (route: string) => {
    return implementedRoutes.includes(route);
  };

  const handleNavigation = (e: React.MouseEvent, route: string, implemented: boolean) => {
    if (!implemented) {
      e.preventDefault();
      showDevelopingToast();
      return;
    }

    setIsNavigating(true);
    collapseAllMenus();

    if (isMobile || isTablet) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.route);
    const showExpanded = isExpanded || isMobileMenuOpen;
    const implemented = isImplemented(item.route);

    return (
      <Link
        key={item.id}
        href={implemented ? item.route : '#'}
        onClick={(e) => handleNavigation(e, item.route, implemented)}
        title={!showExpanded ? item.label : undefined}
        className={`group relative flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all duration-200
          ${active
            ? 'bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 text-[#C5055B] dark:text-pink-400 shadow-sm'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-700 dark:hover:to-gray-600/50'
          }
          hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] transform-gpu`}
      >
        {/* Active indicator bar */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ease-out ${
            active ? 'h-6 bg-gradient-to-b from-[#C5055B] to-[#E5457B]' : 'h-0 bg-transparent'
          }`}
        />

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <span className="absolute inset-0 bg-[#C5055B] opacity-0 group-active:opacity-10 transition-opacity duration-150" />
        </div>

        <MenuIcon
          name={item.icon}
          className={`w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3 ${active ? 'text-[#C5055B] dark:text-pink-400' : ''}`}
          isActive={active}
        />
        {showExpanded && (
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-colors duration-200">
            {item.label}
          </span>
        )}
        {item.badge && showExpanded && (
          <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  // Mobile/Tablet: Show overlay sidebar
  if (isMobile || isTablet) {
    return (
      <>
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar drawer */}
        <aside
          ref={sidebarRef}
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Module Title */}
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              DWS Module
            </h2>
          </div>

          {/* Menu Items */}
          <div className="relative h-[calc(100%-3rem)]">
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-[1] pointer-events-none" />

            <nav className="p-4 pt-2 pb-8 space-y-1 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
              {dwsMenuItems.map(item => renderMenuItem(item))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
          </div>
        </aside>
      </>
    );
  }

  // Desktop: Regular sidebar
  return (
    <aside
      ref={sidebarRef}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        isExpanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110 z-10"
      >
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Module Title - only show when expanded */}
      {isExpanded && (
        <div className="px-4 pt-3 pb-1">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            DWS Module
          </h2>
        </div>
      )}

      {/* Menu Items */}
      <div className="relative h-[calc(100%-2rem)]">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-[1] pointer-events-none" />

        <nav className={`p-3 pb-6 space-y-1 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 ${isExpanded ? '' : 'pt-3'}`}>
          {dwsMenuItems.map(item => renderMenuItem(item))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
      </div>
    </aside>
  );
}
