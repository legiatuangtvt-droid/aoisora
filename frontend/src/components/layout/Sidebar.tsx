'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSidebar } from '@/contexts/SidebarContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { MenuItem } from '@/types/layout';

// Routes that are implemented
const implementedRoutes = ['/tasks/list', '/tasks/new', '/tasks/detail', '/tasks/', '/tasks/messages', '/tasks/todo'];

// Menu items configuration with parent-child structure
const menuItems: MenuItem[] = [
  {
    id: 'hq-store',
    label: 'Task list HQ-Store',
    icon: 'clipboard-list',
    route: '/tasks',
    children: [
      {
        id: 'list-task',
        label: 'List task',
        icon: 'list',
        route: '/tasks/list',
      },
      {
        id: 'detail',
        label: 'Detail',
        icon: 'document',
        route: '/tasks/detail',
      },
      {
        id: 'message',
        label: 'Message',
        icon: 'chat',
        route: '/tasks/messages',
      },
    ],
  },
  {
    id: 'todo',
    label: 'To-do Task',
    icon: 'check-circle',
    route: '/tasks/todo',
  },
  {
    id: 'library',
    label: 'Task Library',
    icon: 'library',
    route: '/library',
  },
  {
    id: 'report',
    label: 'Report',
    icon: 'chart',
    route: '/reports',
  },
  {
    id: 'users',
    label: 'User management',
    icon: 'users',
    route: '/users',
  },
];

// Icon component
function MenuIcon({ name, className = '' }: { name: string; className?: string }) {
  const iconMap: Record<string, JSX.Element> = {
    'clipboard-list': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    'list': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    'document': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'chat': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    'check-circle': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'library': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
    'chart': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    'users': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };

  return iconMap[name] || <span className={className}>?</span>;
}

export default function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();
  const { expandedMenus, toggleMenu, collapseAllMenus, setIsNavigating } = useNavigation();
  const pathname = usePathname();
  const router = useRouter();
  const { showDevelopingToast } = useToast();
  const sidebarRef = useRef<HTMLElement>(null);

  // Handle click outside to collapse menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Click is outside sidebar, collapse all menus
        if (expandedMenus.length > 0) {
          collapseAllMenus();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedMenus, collapseAllMenus]);

  const isActive = (route: string) => {
    // Special case: /tasks/detail should be active for /tasks/[id] routes
    if (route === '/tasks/detail') {
      // Match /tasks/detail or /tasks/{numeric-id}
      const taskDetailPattern = /^\/tasks\/(\d+|detail)$/;
      return taskDetailPattern.test(pathname);
    }
    // Exact match first
    if (pathname === route) return true;
    // For parent routes, only match if not a sibling menu item
    // e.g., /tasks should not highlight when on /tasks/todo (which is a separate menu item)
    if (route === '/tasks' && pathname.startsWith('/tasks/todo')) {
      return false;
    }
    return pathname.startsWith(route + '/');
  };

  const isImplemented = (route: string) => {
    return implementedRoutes.some(r => route === r || route.startsWith(r + '/'));
  };

  const isChildActive = (item: MenuItem) => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.route));
  };

  const handleNavigation = (e: React.MouseEvent, route: string, isChild: boolean, implemented: boolean) => {
    if (!implemented) {
      e.preventDefault();
      showDevelopingToast();
      return;
    }

    // Show loading indicator
    setIsNavigating(true);

    // Collapse all expanded menus when clicking on a non-child menu item
    if (!isChild) {
      collapseAllMenus();
    }
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isMenuExpanded = expandedMenus.includes(item.id);
    const active = isActive(item.route) || isChildActive(item);

    if (hasChildren) {
      return (
        <div key={item.id}>
          {/* Parent menu item */}
          <button
            onClick={() => toggleMenu(item.id)}
            title={!isExpanded ? item.label : undefined}
            className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${active
                ? 'bg-pink-50 dark:bg-pink-900/20 text-[#C5055B] dark:text-pink-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            {/* Active indicator bar */}
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-200 ${
                active ? 'h-6 bg-[#C5055B]' : 'h-0 bg-transparent'
              }`}
            />
            <MenuIcon
              name={item.icon}
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#C5055B] dark:text-pink-400' : ''}`}
            />
            {isExpanded && (
              <>
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1 text-left">
                  {item.label}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ease-out ${isMenuExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {/* Children with animation */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              isMenuExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className={`mt-1 space-y-1 ${isExpanded ? 'ml-4 dark:border-gray-700' : 'ml-5'}`}>
              {item.children?.map(child => renderMenuItem(child, true))}
            </div>
          </div>
        </div>
      );
    }

    // Regular menu item or child item
    const childCollapsedStyle = isChild && !isExpanded ? 'pl-1' : '';
    const implemented = isImplemented(item.route);

    return (
      <Link
        key={item.id}
        href={implemented ? item.route : '#'}
        onClick={(e) => handleNavigation(e, item.route, isChild, implemented)}
        title={!isExpanded ? item.label : undefined}
        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isChild && isExpanded ? 'ml-2' : ''} ${childCollapsedStyle} ${isActive(item.route)
            ? 'bg-pink-50 dark:bg-pink-900/20 text-[#C5055B] dark:text-pink-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
      >
        {/* Active indicator bar */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-200 ${
            isActive(item.route) ? 'h-6 bg-[#C5055B]' : 'h-0 bg-transparent'
          }`}
        />

        {/* Ripple effect container */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <span className="absolute inset-0 bg-[#C5055B] opacity-0 group-active:opacity-10 transition-opacity duration-150" />
        </div>

        <MenuIcon
          name={item.icon}
          className={`${isChild && !isExpanded ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive(item.route) ? 'text-[#C5055B] dark:text-pink-400' : ''}`}
        />
        {isExpanded && (
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
            {item.label}
          </span>
        )}
        {item.badge && isExpanded && (
          <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      ref={sidebarRef}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${isExpanded ? 'w-60' : 'w-16'
        }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110"
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

      {/* Menu Items */}
      <nav className="p-3 space-y-1">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </aside>
  );
}
