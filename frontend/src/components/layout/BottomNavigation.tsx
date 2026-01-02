'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '@/contexts/SidebarContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { useToast } from '@/components/ui/Toast';

// Bottom navigation items (4 main items for mobile)
const bottomNavItems = [
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'gg-list',
    route: '/tasks/list',
  },
  {
    id: 'todo',
    label: 'To-do',
    icon: 'task-edit',
    route: '/tasks/todo',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: 'message',
    route: '/tasks/messages',
  },
  {
    id: 'more',
    label: 'More',
    icon: 'more',
    route: '#',
    isMore: true,
  },
];

// PNG icon paths mapping
const pngIconMap: Record<string, string> = {
  'gg-list': '/icons/gg_list.png',
  'task-edit': '/icons/hugeicons_task-edit-02.png',
  'message': '/icons/Group.png',
};

// Routes that are implemented
const implementedRoutes = ['/tasks/list', '/tasks/new', '/tasks/detail', '/tasks/', '/tasks/messages', '/tasks/todo'];

export default function BottomNavigation() {
  const { isMobile, toggleMobileMenu } = useSidebar();
  const { setIsNavigating } = useNavigation();
  const pathname = usePathname();
  const { showDevelopingToast } = useToast();

  // Only show on mobile
  if (!isMobile) return null;

  const isActive = (route: string) => {
    if (route === '/tasks/list') {
      return pathname === route || pathname.startsWith('/tasks/') && !pathname.startsWith('/tasks/todo') && !pathname.startsWith('/tasks/messages');
    }
    return pathname === route || pathname.startsWith(route + '/');
  };

  const isImplemented = (route: string) => {
    return implementedRoutes.some(r => route === r || route.startsWith(r + '/'));
  };

  const handleClick = (e: React.MouseEvent, item: typeof bottomNavItems[0]) => {
    if (item.isMore) {
      e.preventDefault();
      toggleMobileMenu();
      return;
    }

    if (!isImplemented(item.route)) {
      e.preventDefault();
      showDevelopingToast();
      return;
    }

    setIsNavigating(true);
  };

  const renderIcon = (iconName: string, isActiveItem: boolean) => {
    if (pngIconMap[iconName]) {
      return (
        <Image
          src={pngIconMap[iconName]}
          alt={iconName}
          width={24}
          height={24}
          className={`transition-transform duration-200 ${isActiveItem ? 'scale-110' : ''}`}
          style={{ width: 'auto', height: 'auto' }}
        />
      );
    }

    // More icon (dots)
    if (iconName === 'more') {
      return (
        <svg
          className={`w-6 h-6 ${isActiveItem ? 'text-[#C5055B]' : 'text-gray-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      );
    }

    return null;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-bottom">
      <div className="h-full grid grid-cols-4">
        {bottomNavItems.map((item) => {
          const active = !item.isMore && isActive(item.route);

          return (
            <Link
              key={item.id}
              href={item.isMore ? '#' : item.route}
              onClick={(e) => handleClick(e, item)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                active
                  ? 'text-[#C5055B]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#C5055B] rounded-b-full" />
              )}

              {/* Icon */}
              <div className="relative">
                {renderIcon(item.icon, active)}
              </div>

              {/* Label */}
              <span className={`text-xs font-medium ${active ? 'text-[#C5055B]' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
