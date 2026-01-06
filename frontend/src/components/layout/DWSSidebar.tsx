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
  '/dws/monthly-schedule',
  '/dws/workforce-dispatch',
  '/dws/stores',
  '/dws/staff',
  '/dws/daily-template',
  '/dws/shift-codes',
  '/dws/task-groups',
];

// Menu group interface
interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

// DWS Menu groups configuration - 3 groups as per design
export const dwsMenuGroups: MenuGroup[] = [
  {
    id: 'schedule',
    label: 'SCHEDULE',
    items: [
      {
        id: 'daily-schedule',
        label: 'Daily Schedule',
        icon: 'calendar-day',
        route: '/dws/daily-schedule',
      },
      {
        id: 'monthly-schedule',
        label: 'Monthly Schedule',
        icon: 'calendar-month',
        route: '/dws/monthly-schedule',
      },
      {
        id: 'workforce-dispatch',
        label: 'Workforce Dispatch',
        icon: 'users-dispatch',
        route: '/dws/workforce-dispatch',
      },
    ],
  },
  {
    id: 'organization',
    label: 'ORGANIZATION',
    items: [
      {
        id: 'stores',
        label: 'Stores',
        icon: 'store',
        route: '/dws/stores',
      },
      {
        id: 'staff',
        label: 'Staff',
        icon: 'users',
        route: '/dws/staff',
      },
    ],
  },
  {
    id: 'work-management',
    label: 'WORK MANAGEMENT',
    items: [
      {
        id: 'daily-template',
        label: 'Daily Template',
        icon: 'template',
        route: '/dws/daily-template',
      },
      {
        id: 'shift-codes',
        label: 'Shift Codes',
        icon: 'shift-code',
        route: '/dws/shift-codes',
      },
      {
        id: 'task-groups',
        label: 'Task Groups',
        icon: 'task-group',
        route: '/dws/task-groups',
      },
      {
        id: 're-task-list',
        label: 'RE Task List',
        icon: 're-task',
        route: '/dws/re-task-list',
      },
    ],
  },
];

// DWS-specific SVG icons
const dwsIconMap: Record<string, (className: string, color: string) => JSX.Element> = {
  'calendar-day': (className, color) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1V3M14 1V3M1 7H19M3 3H17C18.1046 3 19 3.89543 19 5V17C19 18.1046 18.1046 19 17 19H3C1.89543 19 1 18.1046 1 17V5C1 3.89543 1.89543 3 3 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="5" y="10" width="4" height="4" rx="0.5" fill={color}/>
    </svg>
  ),
  'calendar-month': (className, color) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1V3M14 1V3M1 7H19M3 3H17C18.1046 3 19 3.89543 19 5V17C19 18.1046 18.1046 19 17 19H3C1.89543 19 1 18.1046 1 17V5C1 3.89543 1.89543 3 3 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="4" y="9" width="2.5" height="2.5" rx="0.3" fill={color}/>
      <rect x="8.5" y="9" width="2.5" height="2.5" rx="0.3" fill={color}/>
      <rect x="13" y="9" width="2.5" height="2.5" rx="0.3" fill={color}/>
      <rect x="4" y="13.5" width="2.5" height="2.5" rx="0.3" fill={color}/>
      <rect x="8.5" y="13.5" width="2.5" height="2.5" rx="0.3" fill={color}/>
    </svg>
  ),
  'users-dispatch': (className, color) => (
    <svg className={className} viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 17V15.6667C15 14.9594 14.719 14.2811 14.219 13.781C13.7189 13.281 13.0406 13 12.3333 13H5.66667C4.95942 13 4.28115 13.281 3.78105 13.781C3.28095 14.2811 3 14.9594 3 15.6667V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 10C10.6569 10 12 8.65685 12 7C12 5.34315 10.6569 4 9 4C7.34315 4 6 5.34315 6 7C6 8.65685 7.34315 10 9 10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 17V15.6667C18.9994 15.0758 18.7961 14.5019 18.4228 14.0349C18.0495 13.5679 17.5272 13.2344 16.9444 13.0867" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 4.08667C14.5843 4.23354 15.1083 4.56714 15.4828 5.03488C15.8574 5.50262 16.0611 6.07789 16.0611 6.67C16.0611 7.26211 15.8574 7.83738 15.4828 8.30512C15.1083 8.77286 14.5843 9.10646 14 9.25333" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 1L21 5M21 1L17 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'store': (className, color) => (
    <svg className={className} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 8V17H19V8M1 1H19L17 8H3L1 1Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 17V12H12V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.5 5V8M10 5V8M14.5 5V8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'users': (className, color) => (
    <svg className={className} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 17V15.6667C14 14.9594 13.719 14.2811 13.219 13.781C12.7189 13.281 12.0406 13 11.3333 13H4.66667C3.95942 13 3.28115 13.281 2.78105 13.781C2.28095 14.2811 2 14.9594 2 15.6667V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10C9.65685 10 11 8.65685 11 7C11 5.34315 9.65685 4 8 4C6.34315 4 5 5.34315 5 7C5 8.65685 6.34315 10 8 10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 17V15.6667C17.9994 15.0758 17.7961 14.5019 17.4228 14.0349C17.0495 13.5679 16.5272 13.2344 15.9444 13.0867" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 4.08667C13.5843 4.23354 14.1083 4.56714 14.4828 5.03488C14.8574 5.50262 15.0611 6.07789 15.0611 6.67C15.0611 7.26211 14.8574 7.83738 14.4828 8.30512C14.1083 8.77286 13.5843 9.10646 13 9.25333" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'template': (className, color) => (
    <svg className={className} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V17C1 17.5304 1.21071 18.0391 1.58579 18.4142C1.96086 18.7893 2.46957 19 3 19H15C15.5304 19 16.0391 18.7893 16.4142 18.4142C16.7893 18.0391 17 17.5304 17 17V7L11 1Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 1V7H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10H13M5 14H13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'shift-code': (className, color) => (
    <svg className={className} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M1 6H19" stroke={color} strokeWidth="1.5"/>
      <path d="M5 10H7V12H5V10Z" fill={color}/>
      <path d="M9 10H11V12H9V10Z" fill={color}/>
      <path d="M13 10H15V12H13V10Z" fill={color}/>
    </svg>
  ),
  'task-group': (className, color) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="12" y="1" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="1" y="12" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="12" y="12" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  're-task': (className, color) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3H17V17H3V3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 7H13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 10H13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 13H10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 12L16 14L14 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// DWS Menu Icon component
function DWSMenuIcon({ name, className = '', isActive = false }: { name: string; className?: string; isActive?: boolean }) {
  const activeColor = '#22C55E'; // Green for active state
  const defaultColor = '#9CA3AF'; // Gray for default state

  if (dwsIconMap[name]) {
    return dwsIconMap[name](className, isActive ? activeColor : defaultColor);
  }

  // Fallback
  return <span className={className}>?</span>;
}

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
  const { collapseAllMenus, setIsNavigating } = useNavigation();
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
        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
          ${active
            ? 'bg-green-500/10 text-green-500'
            : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
          }`}
      >
        <DWSMenuIcon
          name={item.icon}
          className="w-5 h-5 flex-shrink-0 transition-all duration-200"
          isActive={active}
        />
        {showExpanded && (
          <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-colors duration-200 ${active ? 'text-green-500' : ''}`}>
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  const renderMenuGroup = (group: MenuGroup) => {
    const showExpanded = isExpanded || isMobileMenuOpen;

    return (
      <div key={group.id} className="mb-4">
        {showExpanded && (
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {group.label}
          </h3>
        )}
        <div className="space-y-1">
          {group.items.map(item => renderMenuItem(item))}
        </div>
      </div>
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

        {/* Sidebar drawer - Dark theme */}
        <aside
          ref={sidebarRef}
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#1E293B] border-r border-gray-700 z-50 transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Menu Groups */}
          <div className="relative h-full">
            <nav className="p-4 pt-12 pb-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {dwsMenuGroups.map(group => renderMenuGroup(group))}
            </nav>
          </div>
        </aside>
      </>
    );
  }

  // Desktop: Regular sidebar - Dark theme
  return (
    <aside
      ref={sidebarRef}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#1E293B] border-r border-gray-700 transition-all duration-300 z-40 ${
        isExpanded ? 'w-56' : 'w-16'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-[#1E293B] border border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110 z-10"
      >
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Menu Groups */}
      <div className="relative h-full">
        <nav className={`p-3 pb-6 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent ${isExpanded ? '' : 'pt-3'}`}>
          {dwsMenuGroups.map(group => renderMenuGroup(group))}
        </nav>
      </div>
    </aside>
  );
}
