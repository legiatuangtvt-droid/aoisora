'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '@/contexts/SidebarContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { MenuItem } from '@/types/layout';

// Routes that are implemented
const implementedRoutes = ['/tasks/list', '/tasks/new', '/tasks/detail', '/tasks/', '/tasks/messages', '/tasks/todo', '/tasks/library', '/tasks/info', '/tasks/store-info'];

// Menu items configuration with parent-child structure
export const menuItems: MenuItem[] = [
  {
    id: 'hq-store',
    label: 'Task list HQ-Store',
    icon: 'gg-list',
    route: '/tasks',
    children: [
      {
        id: 'list-task',
        label: 'List task',
        icon: 'task-daily',
        route: '/tasks/list',
      },
      {
        id: 'detail',
        label: 'Detail',
        icon: 'task-pin',
        route: '/tasks/detail',
      },
      {
        id: 'message',
        label: 'Message',
        icon: 'message',
        route: '/tasks/messages',
      },
    ],
  },
  {
    id: 'todo',
    label: 'To-do Task',
    icon: 'task-edit',
    route: '/tasks/todo',
  },
  {
    id: 'library',
    label: 'Task Library',
    icon: 'task-library',
    route: '/tasks/library',
  },
  {
    id: 'report',
    label: 'Report',
    icon: 'file-report',
    route: '/reports',
  },
  {
    id: 'users',
    label: 'User management',
    icon: 'user-management',
    route: '/users',
    children: [
      {
        id: 'user-info',
        label: 'User information',
        icon: 'user-cog',
        route: '/tasks/info',
      },
      {
        id: 'store-info',
        label: 'Store information',
        icon: 'store-cog',
        route: '/tasks/store-info',
      },
    ],
  },
];

// PNG icon paths mapping
export const pngIconMap: Record<string, string> = {
  'gg-list': '/icons/gg_list.png',
  'task-daily': '/icons/hugeicons_task-daily-02.png',
  'task-pin': '/icons/streamline-ultimate_task-list-pin.png',
  'message': '/icons/Group.png',
  'task-edit': '/icons/hugeicons_task-edit-02.png',
  'task-library': '/icons/tabler_library.png',
  'file-report': '/icons/mdi_file-report-outline.png',
  'user-management': '/icons/Frame 7.png',
  'user-cog': '/icons/stash_user-cog.png',
  'store-cog': '/icons/mdi_store-cog-outline.png',
};

// Icon component
export function MenuIcon({ name, className = '', isActive = false }: { name: string; className?: string; isActive?: boolean }) {
  // Check if it's a PNG icon
  if (pngIconMap[name]) {
    // Extract size from className (e.g., "w-5 h-5" -> 20)
    const sizeMatch = className.match(/w-(\d+)/);
    const size = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 20;

    // CSS filter for pink/red color (#C5055B) when active
    // Default: grayscale with slight opacity for gray look
    const activeFilter = 'invert(15%) sepia(95%) saturate(5000%) hue-rotate(330deg) brightness(85%) contrast(105%)';
    const defaultFilter = 'invert(45%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)';

    return (
      <Image
        src={pngIconMap[name]}
        alt={name}
        width={size}
        height={size}
        className={`flex-shrink-0 transition-all duration-200 ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          filter: isActive ? activeFilter : defaultFilter,
        }}
      />
    );
  }

  const iconMap: Record<string, JSX.Element> = {
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
        // On desktop, collapse sidebar if expanded
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
    // Special case: /tasks/detail should be active for /tasks/[id] routes
    if (route === '/tasks/detail') {
      const taskDetailPattern = /^\/tasks\/(\d+|detail)$/;
      return taskDetailPattern.test(pathname);
    }
    if (pathname === route) return true;
    // Exclude standalone menu items and User Management children from parent /tasks menu
    if (route === '/tasks' && (
      pathname.startsWith('/tasks/todo') ||
      pathname.startsWith('/tasks/library') ||
      pathname.startsWith('/tasks/info') ||
      pathname.startsWith('/tasks/store-info')
    )) {
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

    setIsNavigating(true);

    if (!isChild) {
      collapseAllMenus();
    }

    // Close mobile menu after navigation
    if (isMobile || isTablet) {
      setIsMobileMenuOpen(false);
    }
  };

  // Generate tooltip content with preview for parent items
  const getTooltipContent = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      return `${item.label} (${item.children.length} items)`;
    }
    return item.label;
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isMenuExpanded = expandedMenus.includes(item.id);
    const active = isActive(item.route) || isChildActive(item);
    const showExpanded = isExpanded || isMobileMenuOpen;

    if (hasChildren) {
      return (
        <div key={item.id} className="group/parent">
          <button
            onClick={() => toggleMenu(item.id)}
            title={!showExpanded ? getTooltipContent(item) : undefined}
            className={`group relative w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all duration-200
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
              <>
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1 text-left transition-colors duration-200">
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

          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              isMenuExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className={`mt-1 space-y-1 ${showExpanded ? 'ml-4 dark:border-gray-700' : ''}`}>
              {item.children?.map(child => renderMenuItem(child, true))}
            </div>
          </div>
        </div>
      );
    }

    const implemented = isImplemented(item.route);
    // When sidebar is collapsed, child items have slight left padding to show hierarchy
    const collapsedChildStyle = isChild && !showExpanded ? 'pl-5 pr-2' : 'px-3';

    return (
      <Link
        key={item.id}
        href={implemented ? item.route : '#'}
        onClick={(e) => handleNavigation(e, item.route, isChild, implemented)}
        title={!showExpanded ? item.label : undefined}
        className={`group relative flex items-center gap-3 py-3 md:py-2.5 rounded-lg transition-all duration-200 ${collapsedChildStyle} ${isChild && showExpanded ? 'ml-2 px-3' : ''}
          ${isActive(item.route)
            ? 'bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 text-[#C5055B] dark:text-pink-400 shadow-sm'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-700 dark:hover:to-gray-600/50'
          }
          hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] transform-gpu`}
      >
        {/* Active indicator bar */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ease-out ${
            isActive(item.route) ? 'h-6 bg-gradient-to-b from-[#C5055B] to-[#E5457B]' : 'h-0 bg-transparent'
          }`}
        />

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <span className="absolute inset-0 bg-[#C5055B] opacity-0 group-active:opacity-10 transition-opacity duration-150" />
        </div>

        <MenuIcon
          name={item.icon}
          className={`${isChild ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3 ${isActive(item.route) ? 'text-[#C5055B] dark:text-pink-400' : ''}`}
          isActive={isActive(item.route)}
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

          {/* Menu Items with scroll improvements */}
          <div className="relative h-full">
            {/* Top fade gradient */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-[1] pointer-events-none" />

            <nav className="p-4 pt-14 pb-8 space-y-1 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
              {menuItems.map(item => renderMenuItem(item))}
            </nav>

            {/* Bottom fade gradient */}
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

      {/* Menu Items with scroll improvements */}
      <div className="relative h-full">
        {/* Top fade gradient */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-[1] pointer-events-none" />

        <nav className="p-3 pb-6 space-y-1 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
      </div>
    </aside>
  );
}
